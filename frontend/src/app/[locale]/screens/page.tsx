"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Video,
  FileCheck2,
  HeartPulse,
  Sparkles,
  CalendarCheck,
  Stethoscope,
  ShieldCheck,
  CheckCircle2,
  Activity,
  User,
  Clock,
  Pill,
  Send,
  Paperclip,
  FileText,
  X,
  AlertTriangle,
  Flame,
  ChevronRight,
  Maximize2,
  Sliders,
  Star,
  Sunrise,
  Sun,
  Sunset,
  Bot,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Import our upgraded clinical components
import { DashboardOverview } from "@/modules/client/telemedicine/doctor/component/dashboard-overview/DashboardOverview";
import { PatientDashboard } from "@/modules/client/telemedicine/patient/component/dashboard/PatientDashboard";
import { PatientDossierPanel } from "@/modules/client/telemedicine/doctor/component/online-consultation/PatientDossierPanel";
import { CdsCockpitPanel } from "@/modules/client/telemedicine/doctor/component/online-consultation/CdsCockpitPanel";
import { DigitalSignatureAndQrCard } from "@/modules/client/telemedicine/doctor/component/appointment-review/DigitalSignatureAndQrCard";
import { PatientCarePanel } from "@/modules/client/telemedicine/patient/component/online-consultation/PatientCarePanel";
import { HealthScoreGauge } from "@/modules/client/telemedicine/patient/component/dashboard/HealthScoreGauge";
import { HealthSnapshotGrid } from "@/modules/client/telemedicine/patient/component/dashboard/HealthSnapshotGrid";
import { CarePlanChecklist } from "@/modules/client/telemedicine/patient/component/dashboard/CarePlanChecklist";
import { AskDrGodlyChatWidget } from "@/modules/client/telemedicine/patient/component/dashboard/AskDrGodlyChatWidget";
import type { TAppointmentResponse } from "@/modules/entities/schemas/appointment";

// ── Mock Clinical Data for Standalone UI Mode ─────────────────────────────────
const mockAppointments: TAppointmentResponse[] = [
  {
    id: 101,
    status: "booked",
    start: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
    end: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    created: new Date().toISOString(),
    participant: [
      {
        id: 1,
        reference_type: "Patient",
        reference_id: 1,
        reference_display: "Anjali Menon",
        status: "accepted",
      },
      {
        id: 2,
        reference_type: "Practitioner",
        reference_id: 1,
        reference_display: "Dr. Priya Sharma",
        status: "accepted",
      },
    ],
    service_type: [{ text: "Cardiology Consultation" }],
  },
  {
    id: 102,
    status: "arrived",
    start: new Date(Date.now() + 1000 * 60 * 90).toISOString(),
    end: new Date(Date.now() + 1000 * 60 * 120).toISOString(),
    created: new Date().toISOString(),
    participant: [
      {
        id: 3,
        reference_type: "Patient",
        reference_id: 2,
        reference_display: "Vikram Malhotra",
        status: "accepted",
      },
      {
        id: 4,
        reference_type: "Practitioner",
        reference_id: 1,
        reference_display: "Dr. Priya Sharma",
        status: "accepted",
      },
    ],
    service_type: [{ text: "Hypertension Follow-up" }],
  },
  {
    id: 103,
    status: "fulfilled",
    start: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    end: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    created: new Date().toISOString(),
    participant: [
      {
        id: 5,
        reference_type: "Patient",
        reference_id: 3,
        reference_display: "Sneha Patel",
        status: "accepted",
      },
      {
        id: 6,
        reference_type: "Practitioner",
        reference_id: 1,
        reference_display: "Dr. Priya Sharma",
        status: "accepted",
      },
    ],
    service_type: [{ text: "Lipid Profile & ECG Review" }],
  },
];

type ScreenKey =
  | "doctor-dashboard"
  | "doctor-telemedicine"
  | "post-visit"
  | "patient-dashboard"
  | "patient-telemedicine"
  | "ai-intake"
  | "appointment-booking";

export default function ScreensShowcasePage() {
  const [activeScreen, setActiveScreen] = useState<ScreenKey>("doctor-dashboard");
  const [intakePainLevel, setIntakePainLevel] = useState<number>(4);
  const [intakeChatMessages, setIntakeChatMessages] = useState<Array<{ from: "user" | "assistant"; text: string }>>([
    {
      from: "assistant",
      text: "Namaste Anjali! I am DrGodly's pre-visit clinical intake assistant. What symptoms are you experiencing today?",
    },
    {
      from: "user",
      text: "I have had a throbbing headache in the morning for the past 3 days and my home blood pressure was 150/95.",
    },
    {
      from: "assistant",
      text: "Understood. Elevated morning blood pressure paired with headache requires attention. Have you experienced any dizziness, blurry vision, or chest tightness?",
    },
  ]);
  const [intakeInput, setIntakeInput] = useState("");
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1);
  const [bookingSpecialist, setBookingSpecialist] = useState<string>("Dr. Priya Sharma");
  const [bookingSlot, setBookingSlot] = useState<string>("10:30 AM");

  const sendIntakeMessage = (txt: string) => {
    if (!txt.trim()) return;
    setIntakeChatMessages((prev) => [
      ...prev,
      { from: "user", text: txt },
      {
        from: "assistant",
        text: `Noted: "${txt}". This has been summarized for Dr. Priya Sharma's clinical review before your consultation begins.`,
      },
    ]);
    setIntakeInput("");
  };

  const getPainSeverity = (level: number) => {
    if (level <= 3) return { label: "Mild (Manageable)", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    if (level <= 6) return { label: "Moderate (Discomforting)", color: "text-amber-700 bg-amber-50 border-amber-200" };
    if (level <= 8) return { label: "Severe (Distressing)", color: "text-orange-700 bg-orange-50 border-orange-200" };
    return { label: "Debilitating (Critical)", color: "text-rose-700 bg-rose-50 border-rose-200" };
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200/80 px-4 py-3 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black shadow-xs text-base">
              Dg
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 tracking-tight">
                  DrGodly Interactive Screen Studio
                </h1>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-semibold py-0">
                  Zero Backend Required
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Official Figma-matched UI screens with live interactive mock data
              </p>
            </div>
          </div>

          {/* Quick Screen Switcher Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: "doctor-dashboard", label: "Doctor Dashboard", icon: LayoutDashboard },
              { id: "doctor-telemedicine", label: "Telemedicine Room (3-Panel)", icon: Video },
              { id: "post-visit", label: "e-Prescription & SOAP", icon: FileCheck2 },
              { id: "patient-dashboard", label: "Patient Portal", icon: HeartPulse },
              { id: "patient-telemedicine", label: "Patient Call Room", icon: Stethoscope },
              { id: "ai-intake", label: "AI Intake Studio", icon: Sparkles },
              { id: "appointment-booking", label: "Appointment Booking", icon: CalendarCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeScreen === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveScreen(tab.id as ScreenKey)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all shadow-2xs ${
                    isActive
                      ? "bg-teal-600 text-white font-semibold shadow-teal-600/20"
                      : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80"
                  }`}
                >
                  <Icon className="size-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Viewport Width Controls for CSS Testing */}
          <div className="hidden xl:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 shrink-0">
            <button
              onClick={() => setViewMode("desktop")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                viewMode === "desktop" ? "bg-white text-slate-900 font-semibold shadow-2xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              🖥️ Full Screen
            </button>
            <button
              onClick={() => setViewMode("tablet")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                viewMode === "tablet" ? "bg-white text-slate-900 font-semibold shadow-2xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              📱 Tablet (768px)
            </button>
            <button
              onClick={() => setViewMode("mobile")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                viewMode === "mobile" ? "bg-white text-slate-900 font-semibold shadow-2xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              📲 Mobile (390px)
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Screen Viewport ── */}
      <main
        className={`flex-1 p-4 md:p-6 w-full mx-auto transition-all duration-300 ${
          viewMode === "mobile"
            ? "max-w-[420px] bg-white border border-slate-300 rounded-3xl shadow-xl my-4 overflow-x-hidden"
            : viewMode === "tablet"
            ? "max-w-[820px] bg-white border border-slate-300 rounded-3xl shadow-xl my-4 overflow-x-hidden"
            : "max-w-7xl"
        }`}
      >
        {/* 1. DOCTOR DASHBOARD SCREEN */}
        {activeScreen === "doctor-dashboard" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Screen 1: Doctor Clinical Dashboard</h2>
                <p className="text-xs text-slate-500">Figma Reference: Doctor Dashboard.png</p>
              </div>
              <Badge className="bg-teal-50 text-teal-700 border-teal-200">Grounded EHR Queue</Badge>
            </div>
            <DashboardOverview
              doctorName="Dr. Priya Sharma, MD"
              specialties={["Cardiology", "Internal Medicine"]}
              roleActive={true}
              availableDays={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]}
              intakeActivity={{ total: 14, byStatus: { completed: 11, pending: 3 } }}
              consultationActivity={{ total: 8, byStatus: { completed: 6, in_progress: 2 } }}
              appointments={mockAppointments}
              appointmentsHref="#"
            />
          </div>
        )}

        {/* 2. DOCTOR 3-PANEL TELEMEDICINE ROOM */}
        {activeScreen === "doctor-telemedicine" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Screen 2: Doctor 3-Panel Telemedicine Cockpit</h2>
                <p className="text-xs text-slate-500">Figma Reference: DrGodly Telemedicine Dashboard 1.png</p>
              </div>
              <Badge className="bg-red-50 text-red-700 border-red-200 animate-pulse">● Live Encrypted WebRTC</Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-[720px]">
              {/* Left Panel: Patient Medical Dossier */}
              <div className="lg:col-span-3 h-full">
                <PatientDossierPanel
                  patientName="Anjali Menon"
                  patientAgeGender="42, Female"
                  abhaId="91-4821-9032-1104"
                />
              </div>

              {/* Center Panel: WebRTC Video Call & In-Call Transcript */}
              <div className="lg:col-span-6 flex flex-col h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-md">
                {/* Video Stage */}
                <div className="relative flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center">
                  {/* Doctor Picture-in-Picture */}
                  <div className="absolute top-4 right-4 w-36 h-28 bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden flex flex-col items-center justify-center p-2 text-center">
                    <div className="h-10 w-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs mb-1">
                      Dr
                    </div>
                    <span className="text-[10px] text-white font-semibold">Dr. Priya Sharma</span>
                    <span className="text-[9px] text-slate-400">Cardiologist (You)</span>
                  </div>

                  {/* Patient Main Feed */}
                  <div className="flex flex-col items-center justify-center text-center p-6">
                    <div className="h-24 w-24 rounded-full bg-slate-700 text-teal-400 font-bold flex items-center justify-center text-3xl mb-3 border-2 border-teal-500/40 shadow-inner">
                      AM
                    </div>
                    <h3 className="text-lg font-bold text-white">Anjali Menon</h3>
                    <p className="text-xs text-slate-400">Audio & Video Active • 1080p WebRTC (LiveKit)</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs text-emerald-400 font-mono">00:08:42 Elapsed</span>
                    </div>
                  </div>

                  {/* Audio Frequency Waveform visual */}
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-950/70 backdrop-blur rounded-xl p-2.5 border border-slate-800 flex items-center gap-3">
                    <span className="text-[10px] font-mono text-teal-400 shrink-0 font-semibold uppercase">Speech-to-Text:</span>
                    <p className="text-xs text-slate-200 italic truncate">
                      "I took the Amlodipine 5mg at 8 AM, but my head is still throbbing..."
                    </p>
                  </div>
                </div>

                {/* Bottom Clinical Action Toolbar */}
                <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs h-8 gap-1.5">
                      <Sparkles className="size-3.5" /> Generate SOAP
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800 text-xs h-8">
                      Add to EMR
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800 text-xs h-8">
                      Share with Patient
                    </Button>
                  </div>
                  <Button size="sm" variant="destructive" className="text-xs h-8">
                    End Consultation
                  </Button>
                </div>
              </div>

              {/* Right Panel: CDS Cockpit */}
              <div className="lg:col-span-3 h-full">
                <CdsCockpitPanel />
              </div>
            </div>
          </div>
        )}

        {/* 3. POST-VISIT DOCUMENTATION & E-PRESCRIBING */}
        {activeScreen === "post-visit" && (
          <div className="space-y-4 animate-in fade-in duration-300 max-w-5xl mx-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Screen 3: Post-Visit Documentation & e-Prescribing</h2>
                <p className="text-xs text-slate-500">Figma Reference: Post-Visit Documentation.png</p>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">SOAP & ABDM Verified</Badge>
            </div>

            {/* SOAP Notes Card */}
            <Card className="rounded-2xl border-slate-200/80 shadow-xs overflow-hidden">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="size-4 text-teal-600" />
                    Clinical SOAP Encounter Note
                  </CardTitle>
                  <Badge className="bg-teal-50 text-teal-700 border-teal-200 text-[10px]">
                    Ambiently Synthesized via Gemini 2.5
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] text-teal-800">
                    S (Subjective):
                  </span>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    Patient reports a 3-day history of throbbing bilateral morning headaches accompanied by elevated home blood pressure readings (150/95 mmHg). Denies chest pain, shortness of breath, visual blurring, or peripheral edema.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] text-teal-800">
                    O (Objective):
                  </span>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    Remote digital cuff BP: 148/92 mmHg, Heart Rate: 76 bpm regular. Uploaded 12-lead ECG shows normal sinus rhythm without ischemic ST changes. BMI: 24.6 kg/m².
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] text-teal-800">
                    A (Assessment):
                  </span>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    Primary Essential Hypertension with acute symptomatic spike (ICD-10: I10). Tension headache secondary to acute blood pressure elevation.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] text-teal-800">
                    P (Plan & Medications):
                  </span>
                  <div className="space-y-1.5 pt-1">
                    <div className="p-2 rounded-xl bg-teal-50/60 border border-teal-200/80 flex items-center justify-between text-slate-800">
                      <span className="font-semibold">1. Telmisartan 40 mg Tablet</span>
                      <span className="text-slate-500">1 tab PO OD (Morning) • 30 Days</span>
                    </div>
                    <div className="p-2 rounded-xl bg-teal-50/60 border border-teal-200/80 flex items-center justify-between text-slate-800">
                      <span className="font-semibold">2. Amlodipine 5 mg Tablet</span>
                      <span className="text-slate-500">1 tab PO OD (Night) • 30 Days</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-slate-800">
                      <span className="font-semibold">3. Paracetamol 650 mg Tablet</span>
                      <span className="text-slate-500">1 tab SOS for severe headache • Max 3/day</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Digital Signature & Tamper-Evident QR Code Card */}
            <DigitalSignatureAndQrCard
              doctorName="Dr. Priya Sharma"
              regNumber="MCI-2018-98421"
              patientName="Anjali Menon"
              appointmentId="101"
            />
          </div>
        )}

        {/* 4. PATIENT WELLNESS PORTAL SCREEN */}
        {activeScreen === "patient-dashboard" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Screen 4: Patient Wellness Dashboard</h2>
                <p className="text-xs text-slate-500">Figma Reference: Patient Dashboard.png</p>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">ABHA 91-4821-9032-1104 Verified</Badge>
            </div>
            <PatientDashboard
              userName="Anjali Menon"
              patientId={101}
              appointments={mockAppointments}
            />
          </div>
        )}

        {/* 5. PATIENT TELEMEDICINE CARE ROOM */}
        {activeScreen === "patient-telemedicine" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Screen 5: Patient Telemedicine Room</h2>
                <p className="text-xs text-slate-500">Figma Reference: DrGodly Telemedicine Care Dashboard 1.png</p>
              </div>
              <Badge className="bg-teal-50 text-teal-700 border-teal-200">Connected with Verified MD</Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[650px]">
              {/* Video Call Stage (Patient view) */}
              <div className="lg:col-span-8 flex flex-col h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-md">
                <div className="relative flex-1 bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center">
                  <div className="flex flex-col items-center text-center p-6">
                    <div className="h-28 w-28 rounded-full bg-teal-700 text-white font-bold flex items-center justify-center text-3xl mb-3 border-4 border-teal-500 shadow-lg">
                      PS
                    </div>
                    <h3 className="text-lg font-bold text-white">Dr. Priya Sharma</h3>
                    <p className="text-xs text-teal-300">Consultant Cardiologist & Physician</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs text-emerald-400 font-mono">Consultation in progress (00:08:42)</span>
                    </div>
                  </div>

                  {/* Patient PiP */}
                  <div className="absolute bottom-4 right-4 w-32 h-24 bg-slate-800 rounded-xl border border-slate-700 shadow-md flex flex-col items-center justify-center p-1.5">
                    <div className="h-8 w-8 rounded-full bg-slate-700 text-teal-400 font-bold flex items-center justify-center text-xs mb-1">
                      AM
                    </div>
                    <span className="text-[10px] text-white font-semibold">You (Anjali)</span>
                  </div>
                </div>

                {/* Patient In-Call Controls */}
                <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-center gap-3">
                  <Button size="sm" variant="outline" className="border-slate-700 text-white hover:bg-slate-800 text-xs h-8">
                    Mute Audio
                  </Button>
                  <Button size="sm" variant="outline" className="border-slate-700 text-white hover:bg-slate-800 text-xs h-8">
                    Disable Video
                  </Button>
                  <Button size="sm" variant="destructive" className="text-xs h-8">
                    Leave Call
                  </Button>
                </div>
              </div>

              {/* Right Care Panel */}
              <div className="lg:col-span-4 h-full">
                <PatientCarePanel doctorName="Dr. Priya Sharma" specialty="Cardiology & Internal Medicine" />
              </div>
            </div>
          </div>
        )}

        {/* 6. AI CLINICAL INTAKE STUDIO */}
        {activeScreen === "ai-intake" && (
          <div className="space-y-4 animate-in fade-in duration-300 max-w-4xl mx-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Screen 6: AI Clinical Intake Studio</h2>
                <p className="text-xs text-slate-500">Autonomous Pre-Consultation Elicitation & Grounding</p>
              </div>
              <Badge className="bg-teal-50 text-teal-700 border-teal-200">ABHA Pre-Triage Verified</Badge>
            </div>

            {/* Pain Scale & Severity Triage Bar */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50/50 via-white to-emerald-50/40 border border-teal-200/60 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Activity className="size-3.5 text-rose-500" />
                    Pain Level (1–10 Scale):
                  </span>
                  <span className="font-bold text-base text-slate-900">{intakePainLevel}/10</span>
                  <Badge className={`text-[10px] border ${getPainSeverity(intakePainLevel).color}`}>
                    {getPainSeverity(intakePainLevel).label}
                  </Badge>
                </div>

                <div className="flex items-center gap-3 flex-1 max-w-sm">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={intakePainLevel}
                    onChange={(e) => setIntakePainLevel(Number(e.target.value))}
                    className="w-full accent-teal-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    onClick={() => {
                      const { label } = getPainSeverity(intakePainLevel);
                      sendIntakeMessage(`My current pain rating is ${intakePainLevel}/10 (${label}).`);
                    }}
                    className="h-7 text-[11px] px-2.5 rounded-lg border-teal-200 text-teal-800 hover:bg-teal-100/50 shrink-0"
                  >
                    Send Pain
                  </Button>
                </div>
              </div>

              {/* Quick Symptom Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-teal-100/60">
                <span className="text-[11px] font-medium text-slate-500 mr-1">Quick Symptoms:</span>
                {[
                  "Severe Throbbing Headache",
                  "Fever & Chills (101°F)",
                  "Shortness of Breath",
                  "Stomach Cramping & Nausea",
                  "Chest Tightness",
                  "Dizziness / Vertigo",
                ].map((symp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => sendIntakeMessage(`I am experiencing ${symp}.`)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-teal-50 border border-slate-200/90 hover:border-teal-300 text-slate-700 transition shadow-2xs font-medium"
                  >
                    + {symp}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated OCR Extraction Preview */}
            <div className="p-3 bg-white rounded-xl border border-teal-200 shadow-2xs text-xs space-y-1">
              <div className="flex items-center justify-between text-teal-800 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Paperclip className="size-3.5 text-teal-600" />
                  Correlated Lab Slip: <code className="text-[11px] font-mono">ecg_report_24oct.pdf</code>
                </span>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">FastMCP OCR Extracted</Badge>
              </div>
              <p className="text-[11px] text-slate-600">
                Extracted Biomarkers: <strong>Normal Sinus Rhythm (78 bpm)</strong>, PR Interval: 142 ms, QRS Duration: 88 ms, No Ischemic ST elevation.
              </p>
            </div>

            {/* Intake Chat Thread */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-[380px] overflow-hidden">
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {intakeChatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2.5 ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.from === "assistant" && (
                      <div className="h-7 w-7 rounded-xl bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                        <Bot className="size-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                        msg.from === "user"
                          ? "bg-teal-600 text-white rounded-tr-xs"
                          : "bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200/60"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 border-t border-slate-100 flex items-center gap-2">
                <Input
                  value={intakeInput}
                  onChange={(e) => setIntakeInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendIntakeMessage(intakeInput)}
                  placeholder="Type your symptoms or questions..."
                  className="h-9 text-xs rounded-xl"
                />
                <Button
                  size="sm"
                  onClick={() => sendIntakeMessage(intakeInput)}
                  disabled={!intakeInput.trim()}
                  className="h-9 bg-teal-600 hover:bg-teal-700 text-white px-3 rounded-xl text-xs gap-1"
                >
                  <Send className="size-3.5" /> Send
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 7. APPOINTMENT BOOKING FLOW SCREEN */}
        {activeScreen === "appointment-booking" && (
          <div className="space-y-4 animate-in fade-in duration-300 max-w-4xl mx-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Screen 7: Appointment Booking Dashboard</h2>
                <p className="text-xs text-slate-500">Figma Reference: DrGodly Appointment Dashboard.png</p>
              </div>
              <Badge className="bg-teal-50 text-teal-700 border-teal-200">3-Step Clinical Booking</Badge>
            </div>

            {/* Step Progress Pills */}
            <div className="flex items-center gap-2">
              {[
                { step: 1, title: "1. Specialist" },
                { step: 2, title: "2. Date & Time" },
                { step: 3, title: "3. Review & Confirm" },
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setBookingStep(s.step as 1 | 2 | 3)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-center border transition ${
                    bookingStep === s.step
                      ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>

            {/* STEP 1: Select Specialist */}
            {bookingStep === 1 && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    {
                      name: "Dr. Priya Sharma",
                      spec: "Cardiology & Internal Medicine",
                      qual: "MBBS, MD (AIIMS), FACC",
                      rating: "4.9",
                      reviews: "142",
                    },
                    {
                      name: "Dr. Rajesh Kulkarni",
                      spec: "Neurology & Stroke Specialist",
                      qual: "MBBS, DM (Neurology)",
                      rating: "4.8",
                      reviews: "98",
                    },
                  ].map((doc, idx) => (
                    <Card
                      key={idx}
                      onClick={() => {
                        setBookingSpecialist(doc.name);
                        setBookingStep(2);
                      }}
                      className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                        bookingSpecialist === doc.name
                          ? "border-teal-600 ring-2 ring-teal-500/20 bg-teal-50/20 shadow-xs"
                          : "border-slate-200 hover:border-teal-400 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
                            {doc.name.charAt(4)}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-slate-900">{doc.name}</h4>
                            <p className="text-xs text-teal-700 font-medium">{doc.spec}</p>
                            <p className="text-[11px] text-slate-400">{doc.qual}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                          <Star className="size-3 fill-amber-400 text-amber-400" />
                          <span>{doc.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-xs">
                        <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-100">
                          Next Slot: Today 10:30 AM
                        </span>
                        <span className="text-teal-600 font-semibold flex items-center gap-1 text-xs">
                          Select <ChevronRight className="size-3" />
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Time Slots */}
            {bookingStep === 2 && (
              <Card className="p-4 rounded-2xl border-slate-200/80 bg-white space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-sm text-slate-900">
                    Selected Doctor: <span className="text-teal-600">{bookingSpecialist}</span>
                  </span>
                  <Button size="sm" variant="ghost" onClick={() => setBookingStep(1)} className="text-xs h-7">
                    Change Doctor
                  </Button>
                </div>

                {/* Morning Slots */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Sunrise className="w-3.5 h-3.5 text-amber-500" /> Morning Slots (Before 12:00 PM)
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {["09:30 AM", "10:00 AM", "10:30 AM", "11:15 AM"].map((time) => (
                      <button
                        key={time}
                        onClick={() => {
                          setBookingSlot(time);
                          setBookingStep(3);
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                          bookingSlot === time
                            ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                            : "bg-slate-50 border-slate-200 hover:border-teal-400 hover:bg-white text-slate-700"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Afternoon Slots */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-orange-500" /> Afternoon Slots (12:00 PM – 5:00 PM)
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {["02:00 PM", "02:45 PM", "03:30 PM", "04:15 PM"].map((time) => (
                      <button
                        key={time}
                        onClick={() => {
                          setBookingSlot(time);
                          setBookingStep(3);
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                          bookingSlot === time
                            ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                            : "bg-slate-50 border-slate-200 hover:border-teal-400 hover:bg-white text-slate-700"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* STEP 3: Review & Confirm */}
            {bookingStep === 3 && (
              <Card className="p-4 rounded-2xl border-slate-200/80 bg-white space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Doctor</p>
                    <p className="font-bold text-sm text-slate-900">{bookingSpecialist}</p>
                    <p className="text-xs text-slate-500 mt-1">Consultation Time: <strong>Today, {bookingSlot}</strong></p>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Ready to Book</Badge>
                </div>

                <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200/80 text-xs text-teal-900 space-y-1">
                  <span className="font-semibold flex items-center gap-1.5 text-teal-800">
                    <ShieldCheck className="size-4 text-teal-600" /> Telemedicine & ABHA Verified
                  </span>
                  <p className="text-[11px] text-teal-800/80">
                    Your appointment includes encrypted HD WebRTC video, pre-visit AI symptom synthesis, and post-call e-prescriptions synced with your ABHA ID.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button size="sm" variant="outline" onClick={() => setBookingStep(2)} className="text-xs">
                    Change Slot
                  </Button>
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs">
                    Confirm & Start Intake
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
