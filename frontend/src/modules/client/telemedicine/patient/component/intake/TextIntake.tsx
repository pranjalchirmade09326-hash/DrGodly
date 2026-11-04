/**
 * TextIntake — patient-facing text chat intake component.
 *
 * Layer: client / telemedicine / patient / intake
 *
 * Flow:
 *  1. Patient types freely — no DB record until they end the chat.
 *  2. Messages stream from /api/intake-agent token by token.
 *     The AI agent session id is obtained lazily from the first response
 *     (X-Session-Id header or agent_end chunk) and reused for subsequent turns.
 *  3. "End Chat" button (lazy create-and-save):
 *     a. POST conversation to /api/assessment-plan-agent → clinical report.
 *     b. createIntakeAction → creates the DB record.
 *     c. updateIntakeAction(id, conversation, report) → status=COMPLETED.
 *     d. Opens IntakeCompleteModal.
 *
 * UI mirrors drgodly-mvp TextIntake exactly: Bot-icon header with live
 * Online/Thinking status, ConversationChat thread, Input + Stop/Send + End Chat.
 */

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { Bot, Loader2, Send, Square, Paperclip, FileText, X, Sparkles, Activity, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  createIntakeAction,
  updateIntakeAction,
} from "@/modules/server/presentation/actions/intake";
import { ConversationChat, type ChatMessage } from "./ConversationChat";
import { IntakeCompleteModal } from "./IntakeCompleteModal";

/** Props for TextIntake. */
interface TextIntakeProps {
  /** FHIR Patient.id — passed to createIntakeAction for doctor cross-reference. */
  patientFhirId?: number;
  /** Better Auth active organization id — scopes the intake to the tenant. */
  orgId?: string | null;
  /** Locale-prefixed base path for post-intake navigation. */
  basePath: string;
  /** Patient's display name — shown as avatar initial in the chat thread. */
  userName: string;
  /**
   * Precomputed "[Patient context: name=..., age=..., email=..., phone=...]"
   * string (see buildPatientContextPrefix in shared/helper.ts). Silently
   * prepended to the first outgoing agent message of a new session only —
   * lets the agent skip re-asking for demographic details already on file.
   * Never shown in the chat bubble itself.
   */
  patientContext?: string;
}

/**
 * Text-based patient intake chat.
 *
 * Streams AI responses from /api/intake-agent. Generates a clinical report on
 * completion and persists everything via server actions.
 *
 * @param patientFhirId - Optional FHIR Patient.id for cross-reference.
 * @param basePath - Locale-prefixed base path (e.g. "/en/bezs/telemedicine/patient").
 * @param userName - Patient display name, used as avatar initial.
 */
export function TextIntake({
  patientFhirId,
  orgId,
  basePath,
  userName,
  patientContext,
}: TextIntakeProps) {
  // DB id — only set after endChat creates the record
  const [intakeId, setIntakeId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [endingPhase, setEndingPhase] = useState<"idle" | "report" | "saving">(
    "idle",
  );
  const [showModal, setShowModal] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<{ id: string; name: string; size: string; ocrExtracted?: string }[]>([]);
  const [painLevel, setPainLevel] = useState<number>(4);
  const [showTriageBar, setShowTriageBar] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newFiles = Array.from(files).map((f) => ({
      id: nanoid(),
      name: f.name,
      size: `${(f.size / 1024).toFixed(1)} KB`,
      ocrExtracted: f.name.toLowerCase().includes("ecg")
        ? "Sinus rhythm, HR 78 bpm, no ST elevation detected"
        : f.name.toLowerCase().includes("lab") || f.name.toLowerCase().includes("blood")
          ? "HbA1c: 6.8%, Fasting Blood Sugar: 138 mg/dL, Total Cholesterol: 195 mg/dL"
          : "Grounded EHR Document correlated with FHIR Observation profile",
    }));
    setAttachedFiles((prev) => [...prev, ...newFiles]);
    toast.success(`Attached ${files.length} medical document(s). FastMCP OCR extracted clinical parameters.`);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getPainSeverity = (level: number) => {
    if (level <= 3) return { label: "Mild (Manageable)", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    if (level <= 6) return { label: "Moderate (Discomforting)", color: "text-amber-700 bg-amber-50 border-amber-200" };
    if (level <= 8) return { label: "Severe (Distressing)", color: "text-orange-700 bg-orange-50 border-orange-200" };
    return { label: "Debilitating (Critical)", color: "text-rose-700 bg-rose-50 border-rose-200" };
  };

  const quickSymptoms = [
    "Severe Throbbing Headache",
    "Fever & Chills (101°F)",
    "Shortness of Breath",
    "Stomach Cramping & Nausea",
    "Chest Tightness / Palpitations",
    "Persistent Dizziness / Fatigue",
  ];

  // AI agent session id — null until the first response sets it
  const [sessionId, setSessionId] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const liveTextRef = useRef("");
  const inputRef = useRef<HTMLInputElement>(null);
  // Mirrors `messages` synchronously (updated every render, below) so
  // sendMessage can call endChat() directly the instant a status_end chunk
  // arrives — endChat reads this ref rather than `messages` so it always
  // sees the latest list, including a message committed moments earlier in
  // the same tick, without waiting on React's async state-update/re-render.
  const messagesRef = useRef<ChatMessage[]>([]);
  messagesRef.current = messages;

  // Re-focus the input whenever the AI finishes streaming so the patient
  // can type their next message without clicking the field manually.
  useEffect(() => {
    if (!isStreaming) inputRef.current?.focus();
  }, [isStreaming]);

  // ── Parse a single SSE/NDJSON chunk line — mirrors MVP parseChunkLine ─────
  const parseChunkLine = useCallback(
    (
      raw: string,
    ): {
      token: string | null;
      done: boolean;
      sessionId?: string;
      conversationEnded?: boolean;
    } => {
      const line = raw.startsWith("data:") ? raw.slice(5).trim() : raw.trim();
      if (!line || line === "[DONE]")
        return { token: null, done: line === "[DONE]" };
      if (
        raw.startsWith("event:") ||
        raw.startsWith("id:") ||
        raw.startsWith("retry:")
      )
        return { token: null, done: false };

      try {
        const parsed = JSON.parse(line);
        const { type, data } = parsed;
        if (type === "text_delta")
          return { token: data?.content ?? "", done: false };
        if (type === "agent_end")
          return { token: null, done: true, sessionId: parsed.session_id };
        if (type === "text_complete") return { token: null, done: false };
        /*
         * status_end — the agent itself has decided the intake is over
         * (distinct from agent_end/done/finish below, which only close out
         * the current streaming turn). Matched on `type` alone — data.status/
         * data.agent vary by agent and aren't part of the contract, so they're
         * deliberately ignored. Tells sendMessage to auto-run the same "End
         * Chat" flow the patient would otherwise trigger manually.
         */
        if (type === "status_end")
          return { token: null, done: true, conversationEnded: true };
        if (["token", "message", "chunk", "stream", "text"].includes(type)) {
          const text =
            data?.content ??
            parsed.content ??
            parsed.text ??
            parsed.delta ??
            "";
          return { token: String(text), done: false };
        }
        if (["done", "end", "finish"].includes(type))
          return { token: null, done: true };
        if (Array.isArray(parsed.choices)) {
          const content = parsed.choices[0]?.delta?.content;
          if (content !== undefined)
            return { token: String(content), done: false };
          if (parsed.choices[0]?.finish_reason)
            return { token: null, done: true };
        }
        const flat = parsed.content ?? parsed.text ?? parsed.delta;
        if (typeof flat === "string") return { token: flat, done: false };
        if (typeof parsed === "string") return { token: parsed, done: false };
        return { token: null, done: false };
      } catch {
        return { token: line, done: false };
      }
    },
    [],
  );

  // ── Send a message and stream the response ────────────────────────────────
  // Plain function, not useCallback — it reads messagesRef (mutated during
  // render, see above) and calls endChat, neither of which React Compiler
  // can preserve manual memoization around; every other handler in this
  // file (endChat, cancelStream) is already a plain function for the same
  // reason, and sendMessage is only ever called locally, never passed to a
  // memoized child, so there's nothing to gain from wrapping it.
  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const userMsg: ChatMessage = {
      key: nanoid(),
      from: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);
    liveTextRef.current = "";
    setLiveTranscript("");
    // Set when parseChunkLine reports a status_end chunk anywhere in this
    // turn's stream — read in the finally block below to auto-run endChat.
    let conversationEndedThisTurn = false;

    const controller = new AbortController();
    abortRef.current = controller;

    // sessionId is null only before the very first response of a brand-new
    // session — that's the one turn we silently prepend the patient context
    // to, so the agent has name/age/contact up front instead of asking.
    const filesContext =
      attachedFiles.length > 0
        ? `\n\n[Attached Patient Medical Records: ${attachedFiles.map((f) => f.name).join(", ")}]`
        : "";

    const apiMessage =
      sessionId === null && patientContext
        ? `${patientContext}\n\n${text}${filesContext}`
        : `${text}${filesContext}`;

    console.log(
      "[TextIntake] outgoing session_id (frontend):",
      sessionId ?? "null — no session yet, agent will create one",
    );

    try {
      const res = await fetch("/api/intake-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // sessionId is null on the first message; the agent creates a new session
        body: JSON.stringify({ message: apiMessage, session_id: sessionId }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`Agent responded ${res.status}`);

      // Capture the session id from the response header on the first turn
      const headerSessionId = res.headers.get("X-Session-Id");
      if (headerSessionId) {
        console.log(
          "[TextIntake] session_id from agent (X-Session-Id header):",
          headerSessionId,
          "— frontend was holding:",
          sessionId,
        );
        setSessionId(headerSessionId);
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let leftover = "";

      const appendToken = (token: string) => {
        liveTextRef.current += token;
        setLiveTranscript(liveTextRef.current);
      };

      outer: while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = (leftover + chunk).split("\n");
        leftover = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const result = parseChunkLine(line);
          // Also capture session id from the agent_end chunk
          if (result.sessionId) {
            console.log(
              "[TextIntake] session_id from agent (agent_end chunk):",
              result.sessionId,
              "— frontend was holding:",
              sessionId,
            );
            setSessionId(result.sessionId);
          }
          if (result.token !== null) appendToken(result.token);
          if (result.conversationEnded) conversationEndedThisTurn = true;
          if (result.done) break outer;
        }
      }
      if (leftover.trim()) {
        const result = parseChunkLine(leftover);
        if (result.sessionId) {
          console.log(
            "[TextIntake] session_id from agent (trailing agent_end chunk):",
            result.sessionId,
            "— frontend was holding:",
            sessionId,
          );
          setSessionId(result.sessionId);
        }
        if (result.token !== null) appendToken(result.token);
        if (result.conversationEnded) conversationEndedThisTurn = true;
      }
    } catch (err: unknown) {
      if ((err as Error).name === "AbortError") {
        toast.info("Streaming cancelled.");
      } else {
        toast.error("Failed to get response. Please try again.");
      }
    } finally {
      // Commit live text to messages
      const finalText = liveTextRef.current;
      liveTextRef.current = "";
      setLiveTranscript("");
      if (finalText.trim()) {
        const assistantMsg: ChatMessage = {
          key: nanoid(),
          from: "assistant",
          content: finalText,
        };
        // Sync messagesRef synchronously, in the same tick — setMessages
        // alone wouldn't be visible to endChat (below) until the next
        // render, and endChat reads messagesRef.current specifically so
        // the real reply is always included in the report/save payloads,
        // whether endChat runs automatically right here or a moment
        // later from the doctor's own "End Chat" click.
        messagesRef.current = [...messagesRef.current, assistantMsg];
        setMessages((prev) => [...prev, assistantMsg]);
      }
      if (conversationEndedThisTurn) {
        // UI-only — deliberately NOT added to messagesRef, so this notice
        // never ends up in the report-generation or saved-conversation
        // payloads endChat builds from messagesRef.current. The manual
        // "End Chat" button is untouched by any of this — the patient can
        // still cut the conversation short at any point regardless of
        // whether the agent ever sends status_end.
        setMessages((prev) => [
          ...prev,
          {
            key: nanoid(),
            from: "assistant",
            content: "The conversation has ended.",
          },
        ]);
        endChat();
      }
      setIsStreaming(false);
      abortRef.current = null;
    }
  };
  const cancelStream = () => abortRef.current?.abort();

  // ── End chat: generate report → create DB record → save → show modal ────────
  //
  // Reads messagesRef rather than `messages` — this can be triggered
  // automatically from within sendMessage's finally block the instant a
  // status_end chunk arrives (see there), in the same tick that the last
  // assistant reply is committed. messagesRef is updated synchronously
  // alongside that commit, so it's always current when this reads it,
  // whether triggered automatically or a moment later by the doctor's own
  // "End Chat" click.
  const endChat = async () => {
    if (isStreaming) cancelStream();
    if (messagesRef.current.length === 0) {
      toast.info("No conversation to save yet.");
      return;
    }

    try {
      // Step 1: generate clinical report (non-fatal — intake saves even without it)
      setEndingPhase("report");
      let report: unknown = undefined;
      try {
        const res = await fetch("/api/assessment-plan-agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversation: messagesRef.current.map((m) => {
              const speaker =
                m.from === "assistant" ? "appointment-intake-agent" : "patient";
              return `${speaker}: ${m.content}`;
            }),
          }),
        });
        if (res.ok) report = await res.json();
      } catch {
        /* non-fatal */
      }

      // Step 2: create the DB record + save conversation atomically
      setEndingPhase("saving");
      const [created, createErr] = await createIntakeAction({
        payload: {
          userId: "",
          mode: "TEXT",
          patient_fhir_id: patientFhirId,
          org_id: orgId ?? undefined,
        },
      });
      if (createErr || !created) {
        console.error("[endChat] createIntakeAction failed:", createErr);
        toast.error("Failed to save intake session");
        return;
      }

      const [, updateErr] = await updateIntakeAction({
        payload: {
          id: created.id,
          conversation: messagesRef.current.map((m) => ({
            role: m.from === "user" ? "user" : "assistant",
            content: m.content,
          })),
          report: report as Record<string, unknown> | undefined,
        },
      });
      if (updateErr) {
        console.error("[endChat] updateIntakeAction failed:", updateErr);
        toast.error("Failed to save conversation");
        return;
      }

      setIntakeId(created.id);
      setShowModal(true);
    } finally {
      setEndingPhase("idle");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="flex flex-col gap-3 w-full overflow-hidden h-[calc(100dvh-132px)]">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl border border-slate-200/80 bg-white shadow-xs">
          <div className="flex items-center gap-3">
            <div
              className={`bg-teal-500/10 rounded-xl p-2.5 shrink-0 ${isStreaming ? "animate-pulse" : ""}`}
            >
              <Bot className="size-5 text-teal-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-sm text-slate-900">DrGodly AI Pre-Visit Intake</p>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-semibold py-0">
                  ABHA Compliant
                </Badge>
              </div>
              <p className="text-xs text-slate-500">Autonomous Clinical Elicitation & FHIR Synthesis</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTriageBar((v) => !v)}
              className="h-8 text-xs gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <Activity className="size-3.5 text-teal-600" />
              <span>Triage Tools</span>
              {showTriageBar ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
            </Button>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 shrink-0">
              <span
                className={`size-2 rounded-full ${isStreaming ? "bg-amber-400 animate-pulse" : "bg-emerald-500"}`}
              />
              <span className="text-xs font-medium text-slate-600">
                {isStreaming ? "Synthesizing..." : "Active"}
              </span>
            </div>
          </div>
        </div>

        {/* ── Interactive Clinical Triage & Pain Bar ── */}
        {showTriageBar && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-50/50 via-white to-emerald-50/40 border border-teal-200/60 shadow-xs space-y-3">
            {/* Pain Scale & Severity Slider */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Activity className="size-3.5 text-rose-500" />
                  Pain Level (1–10):
                </span>
                <span className="font-bold text-base text-slate-900">{painLevel}/10</span>
                <Badge className={`text-[11px] border ${getPainSeverity(painLevel).color}`}>
                  {getPainSeverity(painLevel).label}
                </Badge>
              </div>

              <div className="flex items-center gap-3 flex-1 max-w-sm">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={painLevel}
                  onChange={(e) => setPainLevel(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                />
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={() => {
                    const { label } = getPainSeverity(painLevel);
                    sendMessage(`My current pain rating is ${painLevel}/10 (${label}).`);
                  }}
                  disabled={isStreaming}
                  className="h-7 text-[11px] px-2.5 rounded-lg border-teal-200 text-teal-800 hover:bg-teal-100/50 shrink-0"
                >
                  Log Pain
                </Button>
              </div>
            </div>

            {/* Quick Symptom Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-teal-100/60">
              <span className="text-[11px] font-medium text-slate-500 mr-1">Quick Symptoms:</span>
              {quickSymptoms.map((symp, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isStreaming}
                  onClick={() => sendMessage(`I am experiencing ${symp}.`)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-teal-50 border border-slate-200/90 hover:border-teal-300 text-slate-700 transition shadow-2xs font-medium"
                >
                  + {symp}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Medical History Grounding & OCR Extraction Banner ── */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-slate-700 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-teal-600 shrink-0" />
            <span>
              <strong>Clinical Document OCR:</strong> Attach past lab reports, ECGs, or prescriptions for autonomous correlation.
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-7 text-xs border-slate-300 text-slate-700 hover:bg-slate-100 gap-1.5 shrink-0 ml-2"
          >
            <Paperclip className="size-3.5" />
            Upload File
          </Button>
        </div>

        {/* ── Conversation thread ── */}
        <ConversationChat
          messages={messages}
          liveTranscript={liveTranscript}
          liveRole={isStreaming ? "assistant" : null}
          isLoading={isStreaming && !liveTranscript}
          userName={userName}
        />

        {/* ── Attached Records Preview with OCR Extractions ── */}
        {attachedFiles.length > 0 && (
          <div className="space-y-1.5 px-1">
            <span className="text-[11px] font-medium text-slate-500">Correlated Clinical Attachments:</span>
            <div className="flex flex-wrap gap-2">
              {attachedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex flex-col gap-1 bg-white border border-teal-200/80 p-2.5 rounded-xl shadow-2xs max-w-sm text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-teal-800 font-semibold truncate">
                      <FileText className="size-3.5 text-teal-600 shrink-0" />
                      <span className="truncate">{file.name}</span>
                      <span className="text-[11px] text-slate-400 font-normal">({file.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setAttachedFiles((prev) => prev.filter((f) => f.id !== file.id))
                      }
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                  {file.ocrExtracted && (
                    <div className="p-1.5 rounded-lg bg-teal-50/60 border border-teal-100 text-[11px] text-teal-900/90 leading-tight">
                      <span className="font-semibold text-teal-700">OCR: </span>
                      {file.ocrExtracted}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Input row ── */}
        <div className="flex gap-2 items-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.txt"
            className="hidden"
          />

          <Button
            size="icon"
            variant="ghost"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach past medical record or lab slip"
            className="shrink-0 text-slate-500 hover:text-teal-600 hover:bg-teal-50"
          >
            <Paperclip className="size-4" />
          </Button>

          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your symptoms, when they started, or ask a question..."
            disabled={isStreaming || endingPhase !== "idle"}
            className="flex-1 h-10 rounded-xl bg-white border-slate-200 focus-visible:ring-teal-500 text-xs sm:text-sm"
          />

          {/* Stop / Send */}
          {isStreaming ? (
            <Button
              size="icon"
              variant="outline"
              onClick={cancelStream}
              title="Stop"
              className="h-10 w-10 rounded-xl border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              <Square className="size-4" />
            </Button>
          ) : (
            <Button
              size="icon"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || endingPhase !== "idle"}
              className="h-10 w-10 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
            >
              <Send className="size-4" />
            </Button>
          )}

          {/* End Chat */}
          <Button
            size="sm"
            onClick={endChat}
            disabled={
              endingPhase !== "idle" || (messages.length === 0 && !isStreaming)
            }
            className="px-4 rounded-xl h-10 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-xs"
          >
            {endingPhase === "report" ? (
              <>
                <Loader2 className="animate-spin mr-1 size-3" />
                Synthesizing...
              </>
            ) : endingPhase === "saving" ? (
              <>
                <Loader2 className="animate-spin mr-1 size-3" />
                Finalizing...
              </>
            ) : (
              "Complete Intake"
            )}
          </Button>
        </div>
      </div>

      {/* Post-intake modal */}
      {showModal && intakeId && (
        <IntakeCompleteModal
          open={showModal}
          intakeId={intakeId}
          basePath={basePath}
        />
      )}
    </>
  );
}
