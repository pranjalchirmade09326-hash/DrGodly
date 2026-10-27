"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Bot,
  Send,
  Mic,
  MicOff,
  Paperclip,
  AlertTriangle,
  Activity,
  HeartPulse,
  Clock,
  User,
  FileText,
  CheckCircle2,
  ShieldAlert,
  Volume2,
  ChevronRight,
  ArrowRight,
  UploadCloud,
  RefreshCw,
  Flame,
  Stethoscope,
  Info,
  Check,
  FileCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export interface IntakeSummaryData {
  primaryArea: string;
  chiefComplaint: string;
  painScore: number;
  painQuality: string;
  onset: string;
  symptoms: string[];
  extractedBiomarkers?: string;
  isRedFlag: boolean;
}

interface AiIntakeStudioProps {
  patientName?: string;
  onSubmitToIntakeQueue?: (summary: IntakeSummaryData) => void;
  onNavigateToConsultation?: () => void;
}

// ── Anatomical Regions & Symptom Mapping ─────────────────────────────────────
const BODY_REGIONS = [
  {
    id: "head",
    name: "Head & Neck",
    icon: "🧠",
    description: "Headache, migraine, dizziness, vision changes, stiff neck",
    symptoms: [
      "Severe Throbbing Headache",
      "Dizziness / Vertigo",
      "Blurred Vision",
      "Light Sensitivity (Photophobia)",
      "Neck Stiffness",
    ],
  },
  {
    id: "chest",
    name: "Chest & Heart",
    icon: "🫀",
    description: "Palpitations, chest pressure, shortness of breath, coughing",
    symptoms: [
      "Chest Tightness / Pressure",
      "Shortness of Breath on Exertion",
      "Racing Heartbeat (Palpitations)",
      "Persistent Dry Cough",
      "Wheezing",
    ],
  },
  {
    id: "abdomen",
    name: "Abdomen & Digestive",
    icon: "🫄",
    description: "Stomach cramping, nausea, reflux, bowel irregularities",
    symptoms: [
      "Sharp Abdominal Cramping",
      "Nausea & Vomiting",
      "Acid Reflux / Heartburn",
      "Bloating / Gas Distention",
      "Appetite Loss",
    ],
  },
  {
    id: "back",
    name: "Spine & Back",
    icon: "🦴",
    description: "Lumbar pain, muscle spasm, sciatica, posture stiffness",
    symptoms: [
      "Lower Back Dull Ache",
      "Shooting Pain down Leg (Sciatica)",
      "Morning Muscle Stiffness",
      "Upper Thoracic Spasm",
    ],
  },
  {
    id: "limbs",
    name: "Limbs & Joints",
    icon: "🦵",
    description: "Joint swelling, knee stiffness, tingling, weakness",
    symptoms: [
      "Knee / Ankle Joint Swelling",
      "Numbness / Tingling in Fingers",
      "Muscle Fatigue / Weakness",
      "Tremors",
    ],
  },
  {
    id: "general",
    name: "General & Systemic",
    icon: "🌡️",
    description: "Fever, chills, extreme fatigue, unexplained weight loss",
    symptoms: [
      "Fever & Chills (101°F+)",
      "Extreme Chronic Exhaustion",
      "Unexplained Night Sweats",
      "Loss of Taste / Smell",
    ],
  },
];

const PAIN_QUALITIES = [
  { id: "throbbing", label: "Throbbing / Pulsing" },
  { id: "sharp", label: "Sharp / Stabbing" },
  { id: "dull", label: "Dull / Aching" },
  { id: "burning", label: "Burning / Stinging" },
  { id: "cramping", label: "Cramping / Spasmodic" },
  { id: "tightness", label: "Tightness / Pressure" },
];

const ONSET_OPTIONS = [
  { id: "sudden-hours", label: "Sudden (< 24 Hours)", tag: "Acute" },
  { id: "recent-days", label: "Past 2–3 Days", tag: "Recent" },
  { id: "subacute-weeks", label: "1–2 Weeks", tag: "Subacute" },
  { id: "chronic-months", label: "More than a Month", tag: "Chronic" },
];

export function AiIntakeStudio({
  patientName = "Louise Reed",
  onSubmitToIntakeQueue,
  onNavigateToConsultation,
}: AiIntakeStudioProps) {
  // ── Intake Form States ──
  const [selectedRegion, setSelectedRegion] = useState<string>("head");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    "Severe Throbbing Headache",
    "Dizziness / Vertigo",
  ]);
  const [painLevel, setPainLevel] = useState<number>(6);
  const [painQuality, setPainQuality] = useState<string>("throbbing");
  const [onset, setOnset] = useState<string>("recent-days");

  // ── Red Flag Emergency Detection ──
  const isRedFlag =
    selectedSymptoms.some(
      (s) =>
        s.includes("Chest Tightness") ||
        s.includes("Severe Throbbing Headache") && painLevel >= 8
    ) || painLevel >= 9;

  // ── Voice Dictation State ──
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);

  // ── Correlated Lab / OCR State ──
  const [uploadedFile, setUploadedFile] = useState<string>("ecg_report_24oct.pdf");
  const [extractedOcrText, setExtractedOcrText] = useState<string>(
    "Normal Sinus Rhythm (78 bpm), PR: 142ms, QRS: 88ms, No Ischemic ST Changes. BP Recorded: 148/92 mmHg."
  );

  // ── Conversational Elicitation Chat Thread ──
  const [chatMessages, setChatMessages] = useState<
    { from: "assistant" | "user"; text: string; time: string }[]
  >([
    {
      from: "assistant",
      text: `Hello ${patientName}. I am DrGodly's Clinical Intake Copilot. I'll help you prepare your symptoms, timeline, and vitals so Dr. Arjun Mehta can review your case before your video consult starts. Where are you feeling discomfort today?`,
      time: "10:14 AM",
    },
    {
      from: "user",
      text: "I've been feeling severe throbbing headaches for the last 3 days, especially when I stand up from bed in the morning.",
      time: "10:15 AM",
    },
    {
      from: "assistant",
      text: "Understood. Along with the headaches, have you noticed any dizziness, blurred vision, or changes in balance? Also, are you currently taking any prescription medications?",
      time: "10:15 AM",
    },
  ]);
  const [chatInput, setChatInput] = useState<string>("");

  const handleToggleSymptom = (symp: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symp) ? prev.filter((s) => s !== symp) : [...prev, symp]
    );
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    const userMsg = {
      from: "user" as const,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput("");

    // Simulate AI clinical reasoning response
    setTimeout(() => {
      let aiReply = "Noted. I've logged this into your clinical dossier for Dr. Mehta.";
      if (text.toLowerCase().includes("pain") || text.toLowerCase().includes("headache")) {
        aiReply =
          "I've updated your pain index. We have your recent ECG on file showing normal sinus rhythm. Next, please confirm if your blood pressure was checked recently.";
      } else if (text.toLowerCase().includes("bp") || text.toLowerCase().includes("pressure")) {
        aiReply =
          "Thanks. Blood pressure history correlates with your established hypertension history. We will prioritize orthostatic vitals check during the consultation.";
      }

      setChatMessages((prev) => [
        ...prev,
        {
          from: "assistant",
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 600);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingSeconds(0);
      toast.info("Listening... Speak clearly about your symptoms.");
    } else {
      setIsRecording(false);
      handleSendMessage(
        "I feel a spinning sensation when turning my head quickly, and nausea comes on suddenly."
      );
      toast.success("Voice transcript synthesized into intake chat!");
    }
  };

  const getPainColor = (val: number) => {
    if (val <= 3) return { bg: "bg-emerald-500", text: "text-emerald-700", label: "Mild Discomfort" };
    if (val <= 6) return { bg: "bg-amber-500", text: "text-amber-700", label: "Moderate Pain" };
    if (val <= 8) return { bg: "bg-orange-500", text: "text-orange-700", label: "Severe Pain" };
    return { bg: "bg-rose-600", text: "text-rose-700", label: "Unbearable / Acute" };
  };

  const currentPainMeta = getPainColor(painLevel);
  const activeRegionObj = BODY_REGIONS.find((r) => r.id === selectedRegion) || BODY_REGIONS[0];

  return (
    <div className="space-y-4 max-w-6xl mx-auto pb-8">
      {/* ── Studio Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Sparkles className="size-4" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              AI Clinical Intake Studio
            </h2>
            <Badge className="bg-teal-50 text-teal-700 border-teal-200 text-[10px] font-semibold">
              ABDM & FHIR R4 Ready
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Autonomous multi-modal pre-consultation elicitation, symptom mapping & triage grounding
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-xs py-1 px-2.5">
            Patient: <span className="font-semibold text-slate-900 ml-1">{patientName}</span>
          </Badge>
          <Button
            size="sm"
            onClick={() => {
              toast.success("Intake Dossier locked & forwarded to Dr. Mehta's Cockpit!");
              onNavigateToConsultation?.();
            }}
            className="bg-teal-600 hover:bg-teal-700 text-white text-xs h-8 gap-1.5 shadow-xs"
          >
            <span>Proceed to Telemedicine</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* ── Red-Flag Emergency Banner (Safety First) ── */}
      {isRedFlag && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-xs flex items-start gap-3 animate-in fade-in">
          <div className="h-8 w-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="size-5" />
          </div>
          <div className="flex-1 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                Clinical Caution: Severe Symptoms Flagged by Triage
              </span>
              <Badge className="bg-amber-200 text-amber-900 border-amber-300 text-[10px]">
                High Triage Priority
              </Badge>
            </div>
            <p className="text-amber-800 leading-relaxed">
              Based on your reported pain score ({painLevel}/10) or combination of symptoms,
              our safety protocol advises having emergency contact info available. If you experience crushing
              chest pain radiating to your left arm or difficulty breathing, call <strong>108 / 112</strong> or visit the nearest ER immediately.
            </p>
          </div>
        </div>
      )}

      {/* ── Main 2-Column Clinical Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ── LEFT COLUMN: Interactive Elicitation Panels (7 Cols) ── */}
        <div className="lg:col-span-7 space-y-4">
          {/* 1. Anatomical Region Selector */}
          <Card className="rounded-2xl border-slate-200/90 shadow-xs overflow-hidden">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span>1. Select Anatomical Discomfort Area</span>
                </CardTitle>
                <span className="text-[11px] text-slate-500">Click to locate pain</span>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BODY_REGIONS.map((region) => {
                  const isSelected = selectedRegion === region.id;
                  return (
                    <button
                      key={region.id}
                      type="button"
                      onClick={() => {
                        setSelectedRegion(region.id);
                        // Add first symptom of region as convenience
                        if (region.symptoms.length > 0 && !selectedSymptoms.includes(region.symptoms[0])) {
                          setSelectedSymptoms((prev) => [...prev, region.symptoms[0]]);
                        }
                      }}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-20 ${
                        isSelected
                          ? "bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20 shadow-2xs"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">{region.icon}</span>
                        {isSelected && (
                          <span className="h-4 w-4 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">
                            <Check className="size-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <div>
                        <span className={`text-xs font-semibold block leading-tight ${isSelected ? "text-teal-900" : "text-slate-800"}`}>
                          {region.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Correlated Symptoms Checklist */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">
                    Associated {activeRegionObj.name} Symptoms:
                  </span>
                  <span className="text-[11px] text-teal-600 font-medium">
                    {selectedSymptoms.length} selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeRegionObj.symptoms.map((symp, i) => {
                    const isChecked = selectedSymptoms.includes(symp);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleToggleSymptom(symp)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition flex items-center gap-1.5 font-medium ${
                          isChecked
                            ? "bg-teal-600 text-white border-teal-600 shadow-2xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {isChecked && <Check className="size-3 stroke-[2.5]" />}
                        <span>{symp}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Visual Pain Scale & Character Matrix */}
          <Card className="rounded-2xl border-slate-200/90 shadow-xs overflow-hidden">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="size-3.5 text-teal-600" />
                  <span>2. Pain Severity & Quality Characteristics</span>
                </CardTitle>
                <Badge className={`text-[10px] ${currentPainMeta.text} bg-slate-100 border`}>
                  {currentPainMeta.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Visual Pain Slider (1-10) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Visual Analog Scale (VAS):</span>
                  <span className="text-base font-extrabold text-slate-900 font-mono">
                    {painLevel} <span className="text-xs font-normal text-slate-400">/ 10</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">😊</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={painLevel}
                    onChange={(e) => setPainLevel(Number(e.target.value))}
                    className="w-full accent-teal-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                  />
                  <span className="text-lg">😭</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1">
                  <span>1 - Minimal</span>
                  <span>4 - Annoying</span>
                  <span>7 - Disabling</span>
                  <span>10 - Unbearable</span>
                </div>
              </div>

              {/* Pain Quality Options */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-xs font-semibold text-slate-700 block">
                  How does the pain feel?
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PAIN_QUALITIES.map((q) => {
                    const isSelected = painQuality === q.id;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setPainQuality(q.id)}
                        className={`text-xs px-2.5 py-2 rounded-xl border text-center transition font-medium ${
                          isSelected
                            ? "bg-teal-50 border-teal-500 text-teal-900 font-semibold shadow-2xs"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {q.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Onset & Duration Options */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-xs font-semibold text-slate-700 block">
                  When did this episode start?
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ONSET_OPTIONS.map((opt) => {
                    const isSelected = onset === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setOnset(opt.id)}
                        className={`text-xs p-2 rounded-xl border text-center transition ${
                          isSelected
                            ? "bg-teal-600 text-white border-teal-600 shadow-2xs"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="block font-semibold text-[11px] leading-tight">
                          {opt.label}
                        </span>
                        <span className={`text-[9px] uppercase tracking-wider block mt-0.5 ${isSelected ? "text-teal-100" : "text-slate-400"}`}>
                          {opt.tag}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Correlated Document & Lab Slip OCR */}
          <Card className="rounded-2xl border-slate-200/90 shadow-xs overflow-hidden">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Paperclip className="size-3.5 text-teal-600" />
                  <span>3. Grounding Health Documents & Recent Lab Slips</span>
                </CardTitle>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                  FastMCP OCR Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                    PDF
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">
                      {uploadedFile}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Uploaded 24 Oct 2026 • Apollo Diagnostics 12-Lead ECG
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    toast.success("Document OCR re-analyzed with FastMCP!");
                  }}
                  className="text-xs h-7 gap-1 border-slate-300 text-slate-700"
                >
                  <RefreshCw className="size-3" /> Re-scan
                </Button>
              </div>

              {/* OCR Extracted Biomarkers */}
              <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200/80 text-xs space-y-1">
                <span className="text-[11px] font-bold text-teal-900 uppercase tracking-wider block">
                  AI Extracted Biomarkers & ECG Findings:
                </span>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  {extractedOcrText}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── RIGHT COLUMN: Conversational Elicitation & Dossier Summary (5 Cols) ── */}
        <div className="lg:col-span-5 space-y-4 flex flex-col">
          {/* Conversational Elicitation Agent */}
          <Card className="rounded-2xl border-slate-200/90 shadow-xs flex-1 flex flex-col overflow-hidden">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3 px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                    <Bot className="size-3.5" />
                  </div>
                  <CardTitle className="text-xs font-bold text-slate-900">
                    Clinical Elicitation Chatbot
                  </CardTitle>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-slate-500 font-medium">Gemini 2.5 Active</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 flex-1 flex flex-col justify-between">
              {/* Message Thread */}
              <div className="p-3.5 space-y-3 h-[320px] overflow-y-auto">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2 ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.from === "assistant" && (
                      <div className="h-6 w-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        DG
                      </div>
                    )}
                    <div
                      className={`max-w-[82%] p-2.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                        msg.from === "user"
                          ? "bg-teal-600 text-white rounded-tr-xs"
                          : "bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200/70"
                      }`}
                    >
                      {msg.text}
                      <span className={`block text-[9px] mt-1 text-right ${msg.from === "user" ? "text-teal-200" : "text-slate-400"}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input & Voice Trigger */}
              <div className="p-3 bg-white border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    variant={isRecording ? "destructive" : "outline"}
                    onClick={toggleRecording}
                    className="h-8 px-2.5 rounded-xl text-xs gap-1 shrink-0"
                    title={isRecording ? "Stop dictation" : "Voice dictation (Hindi / English)"}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="size-3.5 animate-pulse" />
                        <span className="text-[10px]">Listening...</span>
                      </>
                    ) : (
                      <>
                        <Mic className="size-3.5 text-teal-600" />
                        <span className="text-[10px]">Voice</span>
                      </>
                    )}
                  </Button>

                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Describe symptoms or answer doctor questions..."
                    className="h-8 text-xs rounded-xl flex-1"
                  />

                  <Button
                    size="sm"
                    onClick={() => handleSendMessage()}
                    disabled={!chatInput.trim()}
                    className="h-8 bg-teal-600 hover:bg-teal-700 text-white px-3 rounded-xl text-xs shrink-0"
                  >
                    <Send className="size-3" />
                  </Button>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                  <span>⚡ Voice support in Hindi & English</span>
                  <span>🔒 End-to-end encrypted</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-Time Intake Dossier Hand-Off Card */}
          <Card className="rounded-2xl border-slate-200/90 shadow-xs bg-gradient-to-br from-slate-900 to-slate-950 text-white overflow-hidden">
            <CardHeader className="py-3 px-4 border-b border-slate-800 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="size-3.5 text-teal-400" />
                <span>Pre-Consultation Hand-off Dossier</span>
              </CardTitle>
              <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30 text-[10px]">
                Ready for Doctor
              </Badge>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Chief Complaint:</span>
                <span className="font-semibold text-white truncate max-w-[200px]">
                  {selectedSymptoms[0] || "Severe Throbbing Headache"}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Target Region:</span>
                <span className="font-semibold text-teal-300 capitalize">
                  {activeRegionObj.name}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">VAS Pain Score:</span>
                <span className="font-mono font-bold text-amber-400">
                  {painLevel} / 10 ({painQuality})
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Duration:</span>
                <span className="text-white">
                  {ONSET_OPTIONS.find((o) => o.id === onset)?.label || "2–3 Days"}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <Button
                  onClick={() => {
                    toast.success("Dossier transferred to Dr. Arjun Mehta's Consultation Cockpit!");
                    onNavigateToConsultation?.();
                  }}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs h-9 rounded-xl font-semibold gap-1.5 shadow-md"
                >
                  <Stethoscope className="size-3.5" />
                  <span>Transfer Dossier & Enter Call</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
