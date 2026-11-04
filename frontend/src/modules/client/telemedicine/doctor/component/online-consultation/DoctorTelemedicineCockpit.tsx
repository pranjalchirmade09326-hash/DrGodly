"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Share2,
  MoreHorizontal,
  PhoneOff,
  Sparkles,
  User,
  Clock,
  Heart,
  Pill,
  ShieldAlert,
  AlertTriangle,
  FileText,
  ChevronRight,
  Maximize2,
  CheckCircle2,
  MessageSquare,
  BookOpen,
  Send,
  HelpCircle,
  Lightbulb,
  CheckSquare,
  FileCheck2,
  Database,
  ArrowLeft,
  PieChart,
  Activity,
  Layers,
  Check,
  Stethoscope,
  ExternalLink,
  ShieldCheck,
  Volume2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface DoctorTelemedicineCockpitProps {
  onBack?: () => void;
  onEndVisit?: () => void;
}

export function DoctorTelemedicineCockpit({
  onBack,
  onEndVisit,
}: DoctorTelemedicineCockpitProps) {
  // Navigation & Sub-tab States
  const [leftTab, setLeftTab] = useState<"intake" | "history" | "documents">("intake");
  const [centerSubTab, setCenterSubTab] = useState<"transcript" | "notes">("transcript");
  const [rightTab, setRightTab] = useState<"cds" | "investigations" | "medications" | "education">("cds");

  // In-Call Media States
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(754); // 12:34
  const [messageInput, setMessageInput] = useState("");
  const [aiPromptInput, setAiPromptInput] = useState("");
  const [clinicianNotes, setClinicianNotes] = useState(
    "Patient states episodes occur upon rising from bed. Blood pressure normal at rest. Hydration recommended."
  );

  // Interactive Checklist in CDS
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({
    orthostaticVitals: false,
    cbcElectrolytes: false,
    redFlags: false,
    vestibularTest: false,
    followUp: false,
  });

  // Chat stream messages
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; time: string; text: string; role: "patient" | "doctor" }>>([
    {
      sender: "Louise",
      time: "10:02 AM",
      text: "I have been feeling dizzy, especially when I stand up.",
      role: "patient",
    },
    {
      sender: "Dr. Mehta",
      time: "10:03 AM",
      text: "Do you also get headaches with the dizziness?",
      role: "doctor",
    },
    {
      sender: "Louise",
      time: "10:03 AM",
      text: "Yes, mostly in the morning. It's a mild headache.",
      role: "patient",
    },
    {
      sender: "Dr. Mehta",
      time: "10:04 AM",
      text: "Any nausea or vomiting?",
      role: "doctor",
    },
  ]);

  // Elapsed timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      {
        sender: "Dr. Mehta",
        time: "Just now",
        text: messageInput.trim(),
        role: "doctor",
      },
    ]);
    setMessageInput("");
  };

  const handleQuickPrompt = (promptText: string) => {
    setChatMessages((prev) => [
      ...prev,
      {
        sender: "Dr. Mehta",
        time: "Just now",
        text: promptText,
        role: "doctor",
      },
    ]);
    toast.success("Quick prompt sent to patient chat");
  };

  const toggleCheck = (id: string) => {
    setCheckedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddPlan = () => {
    const checkedCount = Object.values(checkedSteps).filter(Boolean).length;
    toast.success(`Added ${checkedCount} recommended next steps to SOAP encounter plan!`);
  };

  const handleAskDrGodlyAi = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiPromptInput.trim()) return;
    toast.info(`DrGodly AI: Searching EHR context for "${aiPromptInput.trim()}"...`);
    setAiPromptInput("");
  };

  return (
    <div className="flex flex-col h-full bg-muted/40 font-sans text-foreground select-none overflow-hidden rounded-2xl border border-border shadow-sm">
      {/* ── 1. TOP PATIENT CONTEXT HEADER ───────────────────────────────── */}
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-border bg-card px-3 py-2.5 sm:px-4">
        {/* Left: Patient Avatar & Demographics */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-primary/30 bg-secondary shrink-0">
            <div className="h-full w-full bg-gradient-to-tr from-primary to-primary/70 flex items-center justify-center text-white font-bold text-sm">
              LR
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-card-foreground tracking-tight leading-none">
                Louise Reed
              </h2>
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Female</span>
              <span>•</span>
              <span>Age 30</span>
              <span>•</span>
              <span>ID #DG100328</span>
            </div>
          </div>

          {/* Demographic Status Pills */}
          <div className="hidden sm:flex items-center gap-1.5 ml-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-[11px] font-medium">
              Established Patient
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium">
              Video Visit
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 text-[11px] font-medium">
              Hypertension
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200 text-[11px] font-medium">
              Migraine
            </span>
          </div>
        </div>

        {/* Right: Visit Reason, Live Timer & End Visit Button */}
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <div className="text-right hidden md:block">
            <span className="text-[11px] text-muted-foreground block uppercase tracking-wider font-semibold">
              Visit Reason
            </span>
            <span className="text-xs font-semibold text-card-foreground">
              Dizziness and headache
            </span>
          </div>

          {/* Green Elapsed Timer */}
          <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-300/70 bg-emerald-50/60 px-2.5 py-1 font-mono text-xs font-bold text-emerald-700">
            <Clock className="size-3.5 text-emerald-600 animate-pulse" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          {/* Red End Visit Button */}
          <Button
            size="sm"
            onClick={onEndVisit}
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs h-8 px-4 rounded-xl shadow-xs"
          >
            End Visit
          </Button>
        </div>
      </header>

      {/* ── 2. MAIN 3-PANEL CONSULTATION STAGE ───────────────────────────── */}
      {/* Stage scrolls vertically while stacked on phones; on lg+ it stays a
          fixed-height three-column workspace with per-panel scrolling. */}
      <div className="grid min-h-0 flex-1 grid-cols-12 gap-3 overflow-x-hidden overflow-y-auto bg-muted/50 p-3 lg:overflow-hidden">
        {/* ── PANEL 1: LEFT PATIENT CLINICAL DOSSIER (~28% / 3.5 cols) ─── */}
        <div className="col-span-12 flex min-h-[28rem] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs lg:col-span-3 lg:min-h-0 xl:col-span-3">
          {/* Header Tabs */}
          <div className="flex shrink-0 overflow-x-auto border-b border-border bg-muted/60 px-2 text-xs font-semibold">
            <button
              onClick={() => setLeftTab("intake")}
              className={`py-2 px-3 border-b-2 transition ${
                leftTab === "intake"
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-muted-foreground hover:text-card-foreground"
              }`}
            >
              AI Intake Summary
            </button>
            <button
              onClick={() => setLeftTab("history")}
              className={`py-2 px-3 border-b-2 transition ${
                leftTab === "history"
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-muted-foreground hover:text-card-foreground"
              }`}
            >
              History
            </button>
            <button
              onClick={() => setLeftTab("documents")}
              className={`py-2 px-3 border-b-2 transition ${
                leftTab === "documents"
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-muted-foreground hover:text-card-foreground"
              }`}
            >
              Documents
            </button>
          </div>

          {/* Scrollable Dossier Content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
            {/* Card 1: Chief Complaint (AI extracted) */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                <PieChart className="size-3.5 text-blue-600" />
                <span>Chief Complaint <span className="text-[11px] text-slate-400 font-normal">(AI extracted)</span></span>
              </div>
              <p className="text-slate-700 text-xs font-medium pl-5">
                Dizziness and headaches for 2 days
              </p>
            </div>

            {/* Card 2: HPI (AI summarized) */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                <MessageSquare className="size-3.5 text-blue-600" />
                <span>HPI <span className="text-[11px] text-slate-400 font-normal">(AI summarized)</span></span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed pl-5">
                30-year-old female with intermittent dizziness, worse on standing, associated with mild headache.
                No fever, no vomiting. Similar episode 6 months ago.
              </p>
            </div>

            {/* Card 3: Key Vitals (patient reported) */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                <Heart className="size-3.5 text-blue-600" />
                <span>Key Vitals <span className="text-[11px] text-slate-400 font-normal">(patient reported)</span></span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white p-1.5 rounded-lg border border-slate-200/70">
                  <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> BP
                  </span>
                  <span className="font-bold text-slate-900 block mt-0.5">118/76</span>
                  <span className="text-[10px] text-slate-400">mmHg</span>
                </div>
                <div className="bg-white p-1.5 rounded-lg border border-slate-200/70">
                  <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> HR
                  </span>
                  <span className="font-bold text-slate-900 block mt-0.5">72</span>
                  <span className="text-[10px] text-slate-400">bpm</span>
                </div>
                <div className="bg-white p-1.5 rounded-lg border border-slate-200/70">
                  <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Temp
                  </span>
                  <span className="font-bold text-slate-900 block mt-0.5">98.1°F</span>
                  <span className="text-[10px] text-slate-400">(36.7°C)</span>
                </div>
              </div>
              <div className="text-center pt-0.5">
                <span className="text-[11px] text-slate-600 font-medium bg-white px-2 py-0.5 rounded-full border border-slate-200/70 inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> SpO₂: 99%
                </span>
              </div>
            </div>

            {/* Card 4: Current Medications */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                <Pill className="size-3.5 text-blue-600" />
                <span>Current Medications</span>
              </div>
              <ul className="text-slate-600 text-[11px] space-y-1 pl-5">
                <li>• Amlodipine 5 mg OD</li>
                <li>• Sumatriptan 50 mg PRN</li>
              </ul>
            </div>

            {/* Card 5: Allergies */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                <ShieldCheck className="size-3.5 text-blue-600" />
                <span>Allergies</span>
              </div>
              <p className="text-slate-600 text-[11px] pl-5">
                No known drug allergies
              </p>
            </div>

            {/* Card 6: Relevant History */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                <Clock className="size-3.5 text-blue-600" />
                <span>Relevant History</span>
              </div>
              <ul className="text-slate-600 text-[11px] space-y-1 pl-5">
                <li>• Hypertension (2022)</li>
                <li>• Migraine (since 2019)</li>
                <li>• No diabetes</li>
                <li>• Non-smoker</li>
              </ul>
            </div>

            {/* Card 7: AI Flagged Concerns (Warning Amber Card) */}
            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-900 font-semibold text-xs">
                <AlertTriangle className="size-3.5 text-amber-600" />
                <span>AI Flagged Concerns</span>
              </div>
              <ul className="text-amber-900/80 text-[11px] space-y-1 pl-5">
                <li>• R/O orthostatic hypotension</li>
                <li>• R/O vestibular migraine</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── PANEL 2: CENTER VIDEO & INTERACTION STAGE (~42% / 5.5 cols) ── */}
        <div className="col-span-12 flex min-h-[30rem] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs lg:col-span-5 lg:min-h-0 xl:col-span-5">
          {/* Top Half: Video Player Stage */}
          <div className="relative h-[280px] bg-gradient-to-b from-slate-900 via-slate-950 to-black flex items-center justify-center overflow-hidden shrink-0">
            {/* Simulated Patient Video Feed */}
            <div className="relative flex flex-col items-center justify-center w-full h-full">
              <div className="h-24 w-24 rounded-full bg-teal-800/40 border-2 border-teal-500/40 flex items-center justify-center text-teal-200 font-bold text-2xl shadow-xl">
                LR
              </div>
              <span className="text-xs font-semibold text-white mt-2">Louise Reed</span>
              <span className="text-[11px] text-slate-400">720p HD • WebRTC Encrypted</span>
            </div>

            {/* Top-left Video HUD Overlay */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-2 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[11px] text-white">
              <span className="font-semibold">Louise Reed</span>
              <span className="flex items-center gap-0.5 text-emerald-400">
                <span className="h-2 w-1 bg-emerald-400 rounded-2xs" />
                <span className="h-3 w-1 bg-emerald-400 rounded-2xs" />
                <span className="h-4 w-1 bg-emerald-400 rounded-2xs" />
              </span>
              <span className="text-slate-300 font-mono text-[11px]">02:34</span>
            </div>

            {/* Top-right Video Controls */}
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 text-white/80">
              <button className="h-7 w-7 rounded-lg bg-black/40 hover:bg-black/60 flex items-center justify-center">
                <Maximize2 className="size-3.5" />
              </button>
              <button className="h-7 w-7 rounded-lg bg-black/40 hover:bg-black/60 flex items-center justify-center">
                <MoreHorizontal className="size-3.5" />
              </button>
            </div>

            {/* Doctor Self-View PiP (Bottom-right) */}
            <div className="absolute bottom-14 right-3 h-20 w-24 rounded-xl bg-slate-800/95 border border-slate-700/80 shadow-lg overflow-hidden flex flex-col justify-between p-1.5">
              <div className="flex justify-end">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>
              <div className="flex items-center justify-center">
                <div className="h-7 w-7 rounded-full bg-teal-600 text-white text-[11px] font-bold flex items-center justify-center">
                  AM
                </div>
              </div>
              <span className="text-[10px] text-center font-semibold text-slate-200 truncate">
                Dr. Arjun Mehta (You)
              </span>
            </div>

            {/* Floating Translucent Media Controls Dock */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md border border-slate-700/70 px-3 py-1.5 rounded-full shadow-lg">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`h-8 w-8 rounded-full flex items-center justify-center text-white transition ${
                  isMuted ? "bg-rose-600" : "bg-slate-800 hover:bg-slate-700"
                }`}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <MicOff className="size-3.5" /> : <Mic className="size-3.5" />}
              </button>

              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`h-8 w-8 rounded-full flex items-center justify-center text-white transition ${
                  isVideoOff ? "bg-rose-600" : "bg-slate-800 hover:bg-slate-700"
                }`}
                title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
              >
                {isVideoOff ? <VideoOff className="size-3.5" /> : <VideoIcon className="size-3.5" />}
              </button>

              <button
                onClick={() => toast.info("Screen sharing initiated")}
                className="h-8 w-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center"
                title="Share Screen"
              >
                <Share2 className="size-3.5" />
              </button>

              <button
                onClick={() => setShowCaptions(!showCaptions)}
                className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-[11px] transition ${
                  showCaptions ? "bg-teal-600" : "bg-slate-800 hover:bg-slate-700"
                }`}
                title="Closed Captions"
              >
                CC
              </button>

              <button
                onClick={() => toast.info("Opening in-call clinical tools...")}
                className="h-8 w-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center"
                title="More Tools"
              >
                <MoreHorizontal className="size-3.5" />
              </button>

              <button
                onClick={onEndVisit}
                className="h-8 w-8 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md shadow-rose-900/30"
                title="End Consultation"
              >
                <PhoneOff className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Bottom Half: Live Transcript & Notes Tabs */}
          <div className="flex-1 flex flex-col min-h-0 bg-white">
            {/* Sub-tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50/70 text-xs font-semibold px-2 shrink-0">
              <button
                onClick={() => setCenterSubTab("transcript")}
                className={`py-2 px-3 border-b-2 transition ${
                  centerSubTab === "transcript"
                    ? "border-blue-600 text-blue-600 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Live Transcript
              </button>
              <button
                onClick={() => setCenterSubTab("notes")}
                className={`py-2 px-3 border-b-2 transition ${
                  centerSubTab === "notes"
                    ? "border-blue-600 text-blue-600 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Clinician Notes
              </button>
            </div>

            {/* Transcript Messages Thread */}
            {centerSubTab === "transcript" ? (
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border max-w-[90%] leading-relaxed ${
                      msg.role === "doctor"
                        ? "ml-auto bg-blue-50/60 border-blue-200 text-blue-950"
                        : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold">{msg.sender}</span>
                      <span className="text-slate-400 font-mono">{msg.time}</span>
                    </div>
                    <p className="text-[11px]">{msg.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 p-3 flex flex-col">
                <textarea
                  value={clinicianNotes}
                  onChange={(e) => setClinicianNotes(e.target.value)}
                  className="flex-1 w-full p-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 resize-none"
                  placeholder="Type clinician observations here during consultation..."
                />
              </div>
            )}

            {/* In-Call Action Chips */}
            <div className="px-3 py-1.5 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] bg-slate-50/50 shrink-0">
              <button
                onClick={() => handleQuickPrompt("Do you feel lightheaded right after standing up?")}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-slate-700 whitespace-nowrap"
              >
                <Lightbulb className="size-3 text-amber-500" />
                <span>Quick Prompts</span>
              </button>
              <button
                onClick={() => toast.success("Patient Education: Sent 'Postural Precautions' leaflet")}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-slate-700 whitespace-nowrap"
              >
                <BookOpen className="size-3 text-blue-500" />
                <span>Patient Education</span>
              </button>
              <button
                onClick={() => toast.info("Opening file upload modal...")}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-slate-700 whitespace-nowrap"
              >
                <FileText className="size-3 text-teal-500" />
                <span>Share File</span>
              </button>
              <button
                onClick={() => toast.success("Telemedicine informed consent recorded")}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-slate-700 whitespace-nowrap"
              >
                <Stethoscope className="size-3 text-purple-500" />
                <span>Record Consent</span>
              </button>
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="p-2.5 border-t border-slate-200 flex items-center gap-2 shrink-0">
              <input
                type="text"
                placeholder="Type a message to patient..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 text-slate-800"
              />
              <button
                type="submit"
                className="h-8 w-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-2xs"
              >
                <Send className="size-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* ── PANEL 3: RIGHT CLINICAL DECISION SUPPORT (~30% / 3.5 cols) ── */}
        <div className="col-span-12 flex min-h-[28rem] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs lg:col-span-4 lg:min-h-0 xl:col-span-4">
          {/* Header Tabs */}
          <div className="flex shrink-0 overflow-x-auto border-b border-border bg-muted/60 px-2 text-xs font-semibold">
            <button
              onClick={() => setRightTab("cds")}
              className={`py-2 px-3 border-b-2 transition whitespace-nowrap ${
                rightTab === "cds"
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-muted-foreground hover:text-card-foreground"
              }`}
            >
              Clinical Decision Support
            </button>
            <button
              onClick={() => setRightTab("investigations")}
              className={`py-2 px-3 border-b-2 transition whitespace-nowrap ${
                rightTab === "investigations"
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-muted-foreground hover:text-card-foreground"
              }`}
            >
              Investigations
            </button>
            <button
              onClick={() => setRightTab("medications")}
              className={`py-2 px-3 border-b-2 transition whitespace-nowrap ${
                rightTab === "medications"
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-muted-foreground hover:text-card-foreground"
              }`}
            >
              Medications
            </button>
            <button
              onClick={() => setRightTab("education")}
              className={`py-2 px-3 border-b-2 transition whitespace-nowrap ${
                rightTab === "education"
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-muted-foreground hover:text-card-foreground"
              }`}
            >
              Patient Education
            </button>
          </div>

          {/* Scrollable CDS Content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
            {/* Card 1: AI Clinical Assessment */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
                  <Stethoscope className="size-4 text-emerald-600" />
                  AI Clinical Assessment
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                  Low–Moderate Risk
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Based on the current presentation and history, most likely causes are orthostatic hypotension,
                vestibular migraine or tension headache.
              </p>
            </div>

            {/* Card 2: Suggested Differential Diagnosis */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
                  <Lightbulb className="size-4 text-blue-600" />
                  Suggested Differential Diagnosis
                </span>
                <button
                  onClick={() => toast.info("Grounded in ACC/AHA 2024 Clinical Guidelines")}
                  className="text-[11px] text-blue-600 hover:underline font-medium"
                >
                  View Evidence
                </button>
              </div>

              {/* Progress Bars */}
              <div className="space-y-2 text-[11px]">
                <div>
                  <div className="flex justify-between text-slate-700 mb-0.5">
                    <span>Orthostatic hypotension</span>
                    <span className="font-bold text-blue-600">45%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full w-[45%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 mb-0.5">
                    <span>Vestibular migraine</span>
                    <span className="font-bold text-blue-600">30%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full w-[30%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 mb-0.5">
                    <span>Tension-type headache</span>
                    <span className="font-bold text-blue-600">15%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full w-[15%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 mb-0.5">
                    <span>BPPV</span>
                    <span className="font-bold text-blue-600">7%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-400 rounded-full w-[7%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 mb-0.5">
                    <span>Other (e.g. anemia, arrhythmia)</span>
                    <span className="font-bold text-blue-600">3%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-400 rounded-full w-[3%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Recommended Next Steps Checklist */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
                  <CheckSquare className="size-4 text-emerald-600" />
                  Recommended Next Steps
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddPlan}
                  className="h-6 text-[11px] px-2 text-blue-600 border-blue-200 hover:bg-blue-50 font-semibold"
                >
                  Add to Plan
                </Button>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-700">
                <div
                  onClick={() => toggleCheck("orthostaticVitals")}
                  className="flex items-start gap-2 cursor-pointer hover:text-slate-900"
                >
                  <div className={`h-3.5 w-3.5 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                    checkedSteps.orthostaticVitals ? "bg-blue-600 border-blue-600 text-white" : "border-slate-400"
                  }`}>
                    {checkedSteps.orthostaticVitals && <Check className="size-2.5" />}
                  </div>
                  <span>Check orthostatic vitals (BP, HR supine and standing)</span>
                </div>

                <div
                  onClick={() => toggleCheck("cbcElectrolytes")}
                  className="flex items-start gap-2 cursor-pointer hover:text-slate-900"
                >
                  <div className={`h-3.5 w-3.5 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                    checkedSteps.cbcElectrolytes ? "bg-blue-600 border-blue-600 text-white" : "border-slate-400"
                  }`}>
                    {checkedSteps.cbcElectrolytes && <Check className="size-2.5" />}
                  </div>
                  <span>Consider CBC, electrolytes if persistent symptoms</span>
                </div>

                <div
                  onClick={() => toggleCheck("redFlags")}
                  className="flex items-start gap-2 cursor-pointer hover:text-slate-900"
                >
                  <div className={`h-3.5 w-3.5 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                    checkedSteps.redFlags ? "bg-blue-600 border-blue-600 text-white" : "border-slate-400"
                  }`}>
                    {checkedSteps.redFlags && <Check className="size-2.5" />}
                  </div>
                  <span>Assess for red flags (neurological deficits, severe headache, syncope)</span>
                </div>

                <div
                  onClick={() => toggleCheck("vestibularTest")}
                  className="flex items-start gap-2 cursor-pointer hover:text-slate-900"
                >
                  <div className={`h-3.5 w-3.5 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                    checkedSteps.vestibularTest ? "bg-blue-600 border-blue-600 text-white" : "border-slate-400"
                  }`}>
                    {checkedSteps.vestibularTest && <Check className="size-2.5" />}
                  </div>
                  <span>Consider vestibular function test if recurrent</span>
                </div>

                <div
                  onClick={() => toggleCheck("followUp")}
                  className="flex items-start gap-2 cursor-pointer hover:text-slate-900"
                >
                  <div className={`h-3.5 w-3.5 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                    checkedSteps.followUp ? "bg-blue-600 border-blue-600 text-white" : "border-slate-400"
                  }`}>
                    {checkedSteps.followUp && <Check className="size-2.5" />}
                  </div>
                  <span>Follow up in 2 weeks or earlier if worsening</span>
                </div>
              </div>
            </div>

            {/* Split Two-Box Footer: Red Flag Alerts & Relevant Guidelines */}
            <div className="grid grid-cols-2 gap-2">
              {/* Left Box: Red Flag Alerts */}
              <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/80 space-y-1">
                <span className="font-semibold text-rose-900 flex items-center gap-1 text-[11px]">
                  <AlertTriangle className="size-3 text-rose-600" />
                  Red Flag Alerts
                </span>
                <ul className="text-rose-900/80 text-[11px] space-y-0.5 leading-snug">
                  <li>• Severe headache (thunderclap)</li>
                  <li>• Focal neurological deficit</li>
                  <li>• Persistent vomiting</li>
                  <li>• Syncope</li>
                  <li>• New vision changes</li>
                </ul>
              </div>

              {/* Right Box: Relevant Guidelines */}
              <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-1">
                <span className="font-semibold text-blue-900 flex items-center gap-1 text-[11px]">
                  <BookOpen className="size-3 text-blue-600" />
                  Relevant Guidelines
                </span>
                <ul className="text-blue-900/80 text-[11px] space-y-0.5 leading-snug">
                  <li>• <a href="#" className="underline">ACG – Headache (2022)</a></li>
                  <li>• <a href="#" className="underline">AHA – Orthostatic HTN</a></li>
                  <li>• <a href="#" className="underline">AAO – Vertigo Eval</a></li>
                  <li>• <a href="#" className="underline">Choosing Wisely</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. BOTTOM PERSISTENT ACTION TOOLBAR ─────────────────────────── */}
      <footer className="flex shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-border bg-card px-3 py-2.5 shadow-2xs sm:px-4">
        {/* Left: Back to Patients */}
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="h-8 shrink-0 gap-1.5 rounded-xl border-border text-xs text-secondary-foreground hover:bg-muted"
        >
          <ArrowLeft className="size-3.5" /> Back to Patients
        </Button>

        {/* Center: Clinical Encounter Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => toast.success("Drafting SOAP note with ambient STT speech model...")}
            className="h-8 gap-1.5 rounded-xl border border-primary/20 bg-primary/10 text-xs font-semibold text-primary hover:bg-primary/15"
          >
            <FileText className="size-3.5" /> Generate SOAP Note
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.success("Encounter committed to FHIR R4 repository")}
            className="h-8 gap-1.5 rounded-xl border-border text-xs text-secondary-foreground hover:bg-muted"
          >
            <Database className="size-3.5" /> Add to EMR
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.success("Patient summary dispatched via SMS & WhatsApp")}
            className="h-8 gap-1.5 rounded-xl border-border text-xs text-secondary-foreground hover:bg-muted"
          >
            <Share2 className="size-3.5" /> Share with Patient
          </Button>
        </div>

        {/* Right: Ask DrGodly AI Natural Language Input — full width under the actions on phones */}
        <form onSubmit={handleAskDrGodlyAi} className="flex w-full min-w-0 items-center gap-2 sm:w-auto sm:max-w-sm">
          <Button
            type="button"
            size="sm"
            className="h-8 shrink-0 gap-1.5 rounded-xl bg-primary text-xs text-primary-foreground shadow-xs hover:bg-primary/90"
          >
            <Sparkles className="size-3.5" /> Ask DrGodly AI
          </Button>

          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Ask anything about this patient..."
              value={aiPromptInput}
              onChange={(e) => setAiPromptInput(e.target.value)}
              aria-label="Ask about this patient's record"
              className="w-full rounded-xl border border-input bg-muted/60 py-1.5 pl-3 pr-7 text-xs text-foreground placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            />
            <button
              type="submit"
              aria-label="Send question"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80"
            >
              <Send className="size-3.5" />
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
}
