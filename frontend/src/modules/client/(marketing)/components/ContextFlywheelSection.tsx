"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import {
  UploadCloud,
  ShieldCheck,
  Sparkles,
  UserCheck,
  FileText,
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Lock,
  EyeOff,
  Database,
  Pill,
  HeartPulse,
  ChevronRight,
  Bot,
  Zap,
} from "lucide-react";

type FlywheelMode = "anonymous" | "personalized";

interface SampleDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  conditions: string[];
  vitals: string[];
  medications: string[];
  safetyAlert?: string;
}

const sampleDocuments: SampleDocument[] = [
  {
    id: "doc-1",
    name: "Apollo_Hospital_Discharge_Summary.pdf",
    type: "Clinical Discharge Record",
    size: "1.4 MB",
    date: "14 Oct 2024",
    conditions: ["Essential Hypertension (ICD-10 I10)", "Post-Cholecystectomy"],
    vitals: ["Resting BP: 142/90 mmHg", "Pulse: 76 bpm", "BMI: 24.2"],
    medications: ["Amlodipine 5mg OD", "Pantoprazole 40mg (completed)"],
    safetyAlert: "Postural check recommended if dizziness co-occurs with Amlodipine.",
  },
  {
    id: "doc-2",
    name: "Thyrocare_Comprehensive_Lipid_Panel.pdf",
    type: "Diagnostic Pathology Report",
    size: "820 KB",
    date: "02 Sep 2024",
    conditions: ["Borderline Hyperlipidemia (ICD-10 E78.5)"],
    vitals: ["Total Cholesterol: 218 mg/dL", "LDL: 138 mg/dL", "HbA1c: 5.6%"],
    medications: ["Atorvastatin 10mg HS (Recommended candidate)"],
  },
  {
    id: "doc-3",
    name: "MaxHealth_Cardiology_Consult_ECG.pdf",
    type: "Specialist Consultation & ECG",
    size: "2.1 MB",
    date: "18 Jun 2024",
    conditions: ["Normal Sinus Rhythm", "Mild Left Ventricular Hypertrophy"],
    vitals: ["HR: 70 bpm regular", "PR Interval: 154 ms", "QRS: 88 ms"],
    medications: ["Continue Amlodipine 5mg"],
  },
];

export default function ContextFlywheelSection() {
  const [activeMode, setActiveMode] = useState<FlywheelMode>("personalized");
  const [selectedDocId, setSelectedDocId] = useState<string>("doc-1");
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [ocrSuccess, setOcrSuccess] = useState(true);

  const selectedDoc =
    sampleDocuments.find((d) => d.id === selectedDocId) || sampleDocuments[0];

  const handleSelectDoc = (id: string) => {
    setIsProcessingOcr(true);
    setSelectedDocId(id);
    setTimeout(() => {
      setIsProcessingOcr(false);
      setOcrSuccess(true);
    }, 600);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden border-t border-border/40">
      {/* Background glow highlights */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[110rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge className="bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20 px-3 py-1 text-xs font-semibold">
            <Sparkles className="size-3.5 mr-1.5 inline" /> The DrGodly Context Engine
          </Badge>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Anonymous when you need an answer. <br className="hidden sm:inline" />
            <span className="text-primary">Personalized</span> when you want better care.
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Get instant, private medical clarity without logging in — or connect your longitudinal medical records
            so DrGodly&apos;s clinical AI co-pilot grounds every diagnosis in your personal history.
          </p>
        </div>

        {/* Dual Mode Switcher Bar — stacks on phones so both options stay reachable */}
        <div className="mt-10 flex justify-center">
          <div className="mx-auto flex w-full max-w-md flex-col gap-1 rounded-2xl border border-border bg-muted/80 p-1.5 shadow-xs sm:w-auto sm:max-w-none sm:gap-0 sm:inline-flex sm:flex-row">
            <button
              onClick={() => setActiveMode("anonymous")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-left text-xs font-semibold transition-all sm:px-5 sm:text-sm ${
                activeMode === "anonymous"
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <EyeOff className="size-4 text-muted-foreground" />
              <span>1. Anonymous Instant Triage</span>
              <Badge
                variant="outline"
                className="py-0 text-[11px] font-normal text-muted-foreground"
              >
                Zero Data Retention
              </Badge>
            </button>

            <button
              onClick={() => setActiveMode("personalized")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-left text-xs font-semibold transition-all sm:px-5 sm:text-sm ${
                activeMode === "personalized"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="size-4" />
              <span>2. Personalized with Health History</span>
              <Badge
                variant="outline"
                className={
                  activeMode === "personalized"
                    ? "border-0 bg-white/20 py-0 text-[11px] font-normal text-white"
                    : "py-0 text-[11px] font-normal text-muted-foreground"
                }
              >
                High Precision
              </Badge>
            </button>
          </div>
        </div>

        {/* Dynamic Interactive Panel */}
        <div className="mt-12 max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {/* ── MODE A: ANONYMOUS INSTANT TRIAGE ── */}
            {activeMode === "anonymous" && (
              <motion.div
                key="anonymous"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="grid lg:grid-cols-12 gap-6 items-stretch"
              >
                {/* Left: What is Anonymous Mode? */}
                <Card className="lg:col-span-5 rounded-3xl border-border bg-card/60 backdrop-blur p-6 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
                      <Lock className="size-6" />
                    </div>

                    <h3 className="text-xl font-bold text-foreground">
                      Zero-Footprint Clinical Guidance
                    </h3>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Need urgent clarity on a symptom without creating an account or revealing your identity?
                      Ask your question anonymously. Our clinical AI analyzes red flags and gives you vetted medical education.
                    </p>

                    <div className="space-y-2.5 pt-2 text-xs text-foreground/80">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-500" />
                        <span>No registration or phone number required</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-500" />
                        <span>Ephemeral session: destroyed immediately after closing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-500" />
                        <span>Instant triage with emergency red-flag screening</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Link href="/screens">
                      <Button variant="outline" className="w-full text-xs font-semibold rounded-xl gap-2">
                        Try Anonymous Consult in Studio <ArrowRight className="size-3.5" />
                      </Button>
                    </Link>
                  </div>
                </Card>

                {/* Right: Live Interactive Triage Simulation */}
                <Card className="lg:col-span-7 rounded-3xl border-border bg-card p-6 flex flex-col justify-between space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-foreground">Anonymous Session: #T-9921</span>
                    </div>
                    <Badge variant="outline" className="text-[11px] text-muted-foreground">
                      Encrypted Ephemeral
                    </Badge>
                  </div>

                  {/* Chat flow */}
                  <div className="space-y-3 text-xs flex-1">
                    <div className="p-3 rounded-2xl bg-muted/60 text-foreground space-y-1 max-w-[85%]">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase">You</span>
                      <p className="leading-relaxed">
                        &ldquo;I woke up feeling very dizzy whenever I stand up out of bed. My head feels heavy. What could this be?&rdquo;
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-950 dark:text-teal-100 space-y-2 ml-auto max-w-[90%]">
                      <div className="flex items-center justify-between text-[11px] font-bold text-teal-700 dark:text-teal-300">
                        <span className="flex items-center gap-1.5">
                          <Bot className="size-3.5" /> DrGodly AI Co-pilot
                        </span>
                        <span className="text-[11px] font-normal text-muted-foreground">Evidence Grounded</span>
                      </div>
                      <p className="text-xs leading-relaxed text-foreground/90">
                        Based on your description, this symptom cluster fits <strong>postural lightheadedness</strong>. Common considerations:
                      </p>
                      <ul className="list-disc pl-4 space-y-1 text-[11px] text-muted-foreground">
                        <li><strong>Orthostatic Hypotension:</strong> Temporary drop in blood pressure upon standing.</li>
                        <li><strong>Benign Paroxysmal Positional Vertigo (BPPV):</strong> Inner-ear calcium crystal displacement.</li>
                        <li><strong>Dehydration or Electrolyte shifts.</strong></li>
                      </ul>
                      <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] flex items-center gap-1.5">
                        <AlertTriangle className="size-3.5 shrink-0" />
                        <span>Red flags: Seek emergency care if you experience chest tightness, fainting, or slurred speech.</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-teal-500/5 border border-teal-500/15 flex items-center justify-between gap-3 text-xs">
                    <span className="text-muted-foreground text-[11px]">
                      Want personalized diagnosis grounded in your medications & past ECGs?
                    </span>
                    <Button
                      size="sm"
                      onClick={() => setActiveMode("personalized")}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs h-8 rounded-lg shrink-0"
                    >
                      Unlock Full Context
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* ── MODE B: PERSONALIZED WITH HEALTH HISTORY ── */}
            {activeMode === "personalized" && (
              <motion.div
                key="personalized"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                {/* Top: Upload & Document Selector Strip */}
                <div className="grid md:grid-cols-3 gap-3">
                  {sampleDocuments.map((doc) => {
                    const isSelected = doc.id === selectedDocId;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => handleSelectDoc(doc.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-teal-50 dark:bg-teal-950/40 border-teal-500 shadow-sm"
                            : "bg-card hover:bg-muted/50 border-border"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <FileText
                            className={`size-4 mt-0.5 ${
                              isSelected ? "text-teal-600 dark:text-teal-400" : "text-muted-foreground"
                            }`}
                          />
                          <Badge
                            variant={isSelected ? "default" : "outline"}
                            className={`text-[11px] py-0 ${
                              isSelected ? "bg-teal-600 text-white" : "text-muted-foreground"
                            }`}
                          >
                            {doc.date}
                          </Badge>
                        </div>
                        <p className="text-xs font-bold text-foreground mt-2 truncate">{doc.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{doc.type}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Main OCR Extraction & Longitudinal Synthesizer Card */}
                <Card className="rounded-3xl border-border bg-card p-6 shadow-xl space-y-6">
                  {/* Status header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                        <UploadCloud className="size-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm sm:text-base text-foreground">
                            Context-Aware Health Profile
                          </h4>
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[11px]">
                            HL7 FHIR R4 Ready
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Extracted from {selectedDoc.name} ({selectedDoc.size})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {isProcessingOcr ? (
                        <span className="flex items-center gap-1.5 text-teal-600 font-semibold animate-pulse">
                          <Zap className="size-3.5 animate-spin" /> Extracting clinical entities...
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                          <ShieldCheck className="size-4" /> ABDM / ABHA Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Extracted 3-Column Clinical Dossier */}
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Column 1: Conditions */}
                    <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <HeartPulse className="size-3.5 text-rose-500" /> Chronic Conditions
                      </span>
                      <ul className="text-xs space-y-1.5 text-muted-foreground">
                        {selectedDoc.conditions.map((c, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-teal-500 font-bold">•</span>
                            <span className="text-foreground">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Column 2: Vitals & Labs */}
                    <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Activity className="size-3.5 text-teal-500" /> Vitals & Lab Baseline
                      </span>
                      <ul className="text-xs space-y-1.5 text-muted-foreground">
                        {selectedDoc.vitals.map((v, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-teal-500 font-bold">•</span>
                            <span className="text-foreground">{v}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Column 3: Active Medications & Alerts */}
                    <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Pill className="size-3.5 text-emerald-500" /> Current Medications
                      </span>
                      <ul className="text-xs space-y-1.5 text-muted-foreground">
                        {selectedDoc.medications.map((m, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span className="text-foreground">{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* AI Clinical Cross-Correlation Insight */}
                  {selectedDoc.safetyAlert && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-start gap-3">
                      <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-800 dark:text-amber-200">
                          Cross-Correlation Clinical Safety Alert:
                        </span>
                        <p className="text-amber-900/80 dark:text-amber-200/80 mt-0.5 leading-relaxed">
                          {selectedDoc.safetyAlert} This finding is automatically flagged in the Doctor&apos;s
                          CDS Cockpit during live telemedicine consults.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground text-center sm:text-left">
                      Every uploaded record updates your longitudinal timeline and syncs seamlessly into your ABDM health locker.
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link href="/screens">
                        <Button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs h-9 rounded-xl shadow-xs">
                          Test Full Doctor Experience <ArrowRight className="size-3.5 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
