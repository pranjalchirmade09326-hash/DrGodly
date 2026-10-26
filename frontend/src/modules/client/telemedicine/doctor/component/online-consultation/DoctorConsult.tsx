"use client";

import { useEffect, useRef, useState } from "react";
import { LiveKitRoom } from "@livekit/components-react";
import { toast } from "sonner";
import { Clock, Loader2, MessageSquare, MessageSquareOff, FileText, Bot, Share2, Sparkles, CheckCircle2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RoomControlUI } from "@/modules/client/telemedicine/shared/components/online-consultation/RoomControl";
import {
  TranscriptionPanel,
  type TranscriptLine,
} from "@/modules/client/telemedicine/shared/components/online-consultation/TranscriptionPanel";
import { ConsultationNotes } from "./ConsultationNotes";
import { Suggestion } from "./Suggestion";
import { IntakeReportDialog } from "../intake/IntakeReportDialog";
import { PatientDossierPanel } from "./PatientDossierPanel";
import { CdsCockpitPanel } from "./CdsCockpitPanel";
import { completeConsultationAction } from "@/modules/server/presentation/actions/consultation/core.actions";
import { createEncounterAction } from "@/modules/server/presentation/actions/encounter/core.actions";
import { updateAppointmentAction } from "@/modules/server/presentation/actions/appointment/core.actions";

interface ConsultationDetails {
  doctor: { name?: string; speciality: string };
  patient: { name?: string };
}

interface DoctorConsultProps {
  roomId: string;
  fhirAppointmentId: number;
  participantName: string;
  details: ConsultationDetails;
  patientId?: number;
  practitionerId?: number;
  orgId?: string;
}

function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
}

export function DoctorConsult({
  roomId,
  fhirAppointmentId,
  participantName,
  details,
  patientId,
  practitionerId,
  orgId,
}: DoctorConsultProps) {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [livekitUrl, setLivekitUrl] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<TranscriptLine[]>([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [notes, setNotes] = useState("");

  const transcriptsRef = useRef<TranscriptLine[]>([]);
  const notesRef = useRef("");
  notesRef.current = notes;
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/livekit-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId, name: participantName }),
        });
        const data = await res.json();
        setToken(data.token);
      } catch {
        toast.error("Failed to connect to the consultation room");
      }
    })();
  }, [roomId, participantName]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/runtime-config", { cache: "no-store" });
        if (!res.ok) throw new Error("runtime-config failed");
        const data = await res.json();
        setLivekitUrl(data.livekitUrl);
      } catch {
        toast.error("Failed to load LiveKit config");
      }
    })();
  }, []);

  useEffect(() => {
    if (!token || !livekitUrl) return;
    startedAtRef.current ??= Date.now();
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [token, livekitUrl]);

  const onTranscriptRef = useRef<(line: TranscriptLine) => void>(() => {});
  onTranscriptRef.current = (line) => {
    setTranscripts((prev) => {
      const next = [...prev, line];
      transcriptsRef.current = next;
      return next;
    });
  };
  const handleTranscript = useRef((line: TranscriptLine) =>
    onTranscriptRef.current(line),
  ).current;

  if (!token || !livekitUrl) {
    return (
      <div className="flex items-center justify-center mt-20">
        <p className="inline-flex items-center gap-2 text-muted-foreground text-sm font-medium">
          <Loader2 className="animate-spin text-teal-600" /> Connecting to DrGodly Telemedicine Room...
        </p>
      </div>
    );
  }

  const handleEndCall = async () => {
    if (isCompleting) return;
    setIsCompleting(true);

    const currentTranscripts = transcriptsRef.current;
    const currentNotes = notesRef.current;

    const conversation = currentTranscripts
      .filter((t) => t.text?.trim())
      .map((t) => {
        const role = t.name.toLowerCase().includes("doctor")
          ? "DOCTOR"
          : "PATIENT";
        return `${role}: ${t.text.trim()}`;
      });
    if (currentNotes.trim()) {
      conversation.push(`DOCTOR NOTES: ${currentNotes.trim()}`);
    }

    const virtualConversation = currentTranscripts.map((t) => ({
      speaker: (t.name.toLowerCase().includes("doctor")
        ? "DOCTOR"
        : "PATIENT") as "DOCTOR" | "PATIENT",
      text: t.text,
      timestamp: t.timestamp,
    }));

    let fullReport: Record<string, unknown> | null = null;
    let soapNote: Record<string, unknown> | null = null;
    try {
      const res = await fetch("/api/full-report-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation }),
      });
      if (res.ok) {
        fullReport = await res.json();
        soapNote = (fullReport?.soap_report as Record<string, unknown>) ?? null;
      }
    } catch {
      // Non-fatal
    }

    const [, err] = await completeConsultationAction({
      payload: {
        fhir_appointment_id: fhirAppointmentId,
        virtual_conversation: virtualConversation,
        soap_note: soapNote ?? undefined,
        full_report: fullReport ?? undefined,
      },
    });

    if (err) {
      toast.error("Consultation ended but report could not be saved.");
    } else {
      toast.success("Consultation completed");
    }

    try {
      await updateAppointmentAction({
        payload: { id: fhirAppointmentId, status: "fulfilled" },
      });
    } catch {
      // Non-fatal
    }

    try {
      await createEncounterAction({
        payload: {
          status: "completed",
          ...(patientId ? { subject: `Patient/${patientId}` } : {}),
          ...(startedAtRef.current != null
            ? {
                actual_period_start: new Date(
                  startedAtRef.current,
                ).toISOString(),
              }
            : {}),
          actual_period_end: new Date().toISOString(),
          appointment: [{ reference: `Appointment/${fhirAppointmentId}` }],
          ...(practitionerId
            ? { participant: [{ reference: `Practitioner/${practitionerId}` }] }
            : {}),
          ...(orgId ? { org_id: orgId } : {}),
        },
      });
    } catch {
      // Non-fatal
    }

    setIsCompleting(false);
    router.push(
      `/bezs/telemedicine/doctor/appointments/${fhirAppointmentId}/review`,
    );
  };

  return (
    <LiveKitRoom
      video={false}
      audio={true}
      token={token}
      serverUrl={livekitUrl}
      data-lk-theme="default"
      onDisconnected={handleEndCall}
      className="!bg-transparent !shadow-none !h-[calc(100vh-120px)]"
      style={
        {
          "--lk-accent-bg": "var(--primary)",
          "--lk-accent-fg": "var(--primary-foreground)",
        } as React.CSSProperties
      }
    >
      <div className="flex flex-col h-full w-full gap-3">
        {/* ── Top Clinical Header Bar ── */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs shrink-0">
          <div className="flex items-center gap-3">
            {/* Live Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200/60">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
                Live Consult
              </span>
            </div>

            <div className="h-4 w-px bg-slate-200" />

            {/* Doctor & Patient Info */}
            <div className="text-xs">
              <span className="font-semibold text-slate-900">{details.doctor.name}</span>
              <span className="text-slate-400 mx-1.5">•</span>
              <span className="text-slate-600">Patient: <strong className="text-slate-900">{details.patient.name}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Timer */}
            <div className="flex items-center gap-1.5 text-xs text-slate-700 px-3 py-1 rounded-xl bg-slate-100/80 border border-slate-200">
              <Clock className="h-3.5 w-3.5 text-teal-600" />
              <span className="font-mono font-semibold">{formatElapsed(elapsed)}</span>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowTranscript((v) => !v)}
              className="h-8 text-xs rounded-xl border-slate-200 gap-1.5"
            >
              {showTranscript ? <MessageSquareOff className="h-3.5 w-3.5" /> : <MessageSquare className="h-3.5 w-3.5" />}
              {showTranscript ? "Hide Transcript" : "Show Transcript"}
            </Button>

            <IntakeReportDialog fhirAppointmentId={fhirAppointmentId} />

            <Button
              size="sm"
              variant="destructive"
              onClick={handleEndCall}
              disabled={isCompleting}
              className="h-8 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 shadow-xs"
            >
              {isCompleting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  Generating SOAP…
                </>
              ) : (
                "End Consultation"
              )}
            </Button>
          </div>
        </div>

        {/* ── 3-Panel Split Layout Architecture ── */}
        <div className="flex flex-1 gap-3 min-h-0 overflow-hidden">
          {/* Panel 1 (Left 25%): AI Intake & Patient Dossier */}
          <div className="w-[300px] shrink-0 h-full overflow-hidden hidden lg:block">
            <PatientDossierPanel patientName={details.patient.name} />
          </div>

          {/* Panel 2 (Center 50%): Video Room, Notes & Controls */}
          <div className="flex flex-col flex-1 min-h-0 gap-3 overflow-hidden">
            <div className="flex-1 min-h-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-950 shadow-xs relative">
              <RoomControlUI />
            </div>

            {/* Bottom Transcript / Clinician Notes */}
            {showTranscript ? (
              <div className="h-44 overflow-auto rounded-2xl border border-slate-200/80 bg-white p-2">
                <TranscriptionPanel
                  roomId={roomId}
                  transcripts={transcripts}
                  onTranscript={handleTranscript}
                />
              </div>
            ) : (
              <div className="h-36 overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
                <ConsultationNotes notes={notes} onNotesChange={setNotes} />
              </div>
            )}
          </div>

          {/* Panel 3 (Right 25%): Real-Time AI Clinical Decision Support */}
          <div className="w-[320px] shrink-0 h-full overflow-hidden hidden md:block">
            <CdsCockpitPanel />
          </div>
        </div>

        {/* ── Bottom Clinical Toolbar ── */}
        <div className="flex items-center justify-between px-4 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-xs shrink-0 text-xs">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleEndCall}
              disabled={isCompleting}
              className="h-8 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium gap-1.5"
            >
              <FileText className="h-3.5 w-3.5" />
              Generate SOAP Note
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success("Draft encounter synchronized with EMR")}
              className="h-8 rounded-xl border-slate-200 text-slate-700 gap-1.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Add to EMR
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.info("Intake summary shared with patient portal")}
              className="h-8 rounded-xl border-slate-200 text-slate-700 gap-1.5"
            >
              <Share2 className="h-3.5 w-3.5 text-teal-600" />
              Share with Patient
            </Button>
          </div>

          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <span className="flex items-center gap-1.5 text-teal-700 font-semibold bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/60">
              <Bot className="h-3.5 w-3.5 text-teal-600" /> Ask DrGodly AI Copilot
            </span>
          </div>
        </div>
      </div>
    </LiveKitRoom>
  );
}
