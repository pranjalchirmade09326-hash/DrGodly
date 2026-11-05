/**
 * InteractiveSimulatorSection — interactive clinical intelligence workbench.
 *
 * Layer: client / (marketing) / components
 *
 * Lets users interactively test 3 real-world clinical cases:
 * - Louise Reed: Preventive Cardiology (Hypertension & Cephalalgia)
 * - Marcus Chen: Pulmonology & Allergy (Moderate Persistent Asthma)
 * - Sarah Jenkins: Metabolic & Endocrinology (Type 2 Diabetes & Microalbuminuria)
 *
 * Displays:
 * 1. Diarized multi-modal dialogue stream
 * 2. Real-time extracted HL7 FHIR R4 entities (ICD-10, LOINC, RxNorm)
 * 3. Clinical Decision Support (CDS) differential probabilities with evidence guidelines
 *
 * Supports responsive column stacking and mobile segmented tab views.
 */

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import {
  Brain,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Database,
  Radio,
  Video,
  Activity,
  HeartPulse,
  Stethoscope,
} from "lucide-react";

interface ClinicalCase {
  id: string;
  patientName: string;
  ageGender: string;
  condition: string;
  specialty: string;
  avatarColor: string;
  vitalStats: { label: string; value: string; status: "optimal" | "warning" | "critical" }[];
  dialogue: { speaker: "Doctor" | "Patient" | "AI Scribe"; text: string; time: string }[];
  extractedFhir: { resource: string; code: string; display: string }[];
  differential: { diagnosis: string; probability: number; color: string }[];
  cdsGuidelines: string;
  suggestedPlan: string;
}

const clinicalCases: ClinicalCase[] = [
  {
    id: "cardio-louise",
    patientName: "Louise Reed",
    ageGender: "30F • MRN #DG-89241",
    condition: "Acute Cephalalgia with Systolic Spikes",
    specialty: "Cardiology",
    avatarColor: "from-blue-600 to-teal-500",
    vitalStats: [
      { label: "Blood Pressure", value: "142/88 mmHg", status: "warning" },
      { label: "Heart Rate", value: "72 bpm regular", status: "optimal" },
      { label: "SpO2 Saturation", value: "98% ambient", status: "optimal" },
      { label: "12-Lead ECG", value: "Sinus Rhythm", status: "optimal" },
    ],
    dialogue: [
      {
        speaker: "Patient",
        time: "10:02:14",
        text: "I've had a throbbing morning headache behind my eyes for 3 days and my home BP was 142/88 mmHg.",
      },
      {
        speaker: "Doctor",
        time: "10:02:28",
        text: "Have you experienced any visual aura, light sensitivity, or sudden postural dizziness upon standing?",
      },
      {
        speaker: "Patient",
        time: "10:02:41",
        text: "No visual blurriness, but I felt slightly lightheaded when getting out of bed this morning.",
      },
      {
        speaker: "AI Scribe",
        time: "10:02:45",
        text: "Chief complaint synthesized: 3-day morning throbbing cephalalgia + elevated home systolic reading. Denies scintillating scotoma.",
      },
    ],
    extractedFhir: [
      { resource: "Condition", code: "ICD-10 I10", display: "Essential (Primary) Hypertension" },
      { resource: "Condition", code: "ICD-10 G44.209", display: "Tension-type headache, unspecified" },
      { resource: "Observation", code: "LOINC 85354-9", display: "BP panel: 142/88 mmHg" },
      { resource: "Observation", code: "LOINC 8867-4", display: "Heart rate: 72 bpm" },
    ],
    differential: [
      { diagnosis: "Stage 2 Essential Hypertension with Symptoms", probability: 48, color: "bg-blue-600" },
      { diagnosis: "Tension-Type Vascular Cephalalgia", probability: 32, color: "bg-teal-500" },
      { diagnosis: "Migraine without Aura", probability: 14, color: "bg-indigo-500" },
      { diagnosis: "Orthostatic Variation", probability: 6, color: "bg-amber-500" },
    ],
    cdsGuidelines: "ACC/AHA 2024: Confirm home BP diary. Initiate low-dose CCB (Amlodipine 5mg). Order CMP & urine albumin-to-creatinine ratio.",
    suggestedPlan: "Initiate Amlodipine 5mg QD. Prescribe 14-day digital home BP log. Telehealth check-in in 14 days.",
  },
  {
    id: "pulmo-marcus",
    patientName: "Marcus Chen",
    ageGender: "42M • MRN #DG-54129",
    condition: "Nocturnal Cough & Exertional Wheezing",
    specialty: "Pulmonology",
    avatarColor: "from-teal-600 to-emerald-500",
    vitalStats: [
      { label: "Blood Pressure", value: "128/82 mmHg", status: "optimal" },
      { label: "Heart Rate", value: "84 bpm", status: "optimal" },
      { label: "SpO2 Saturation", value: "95% ambient", status: "warning" },
      { label: "Peak Flow", value: "320 L/min (64%)", status: "warning" },
    ],
    dialogue: [
      {
        speaker: "Patient",
        time: "11:14:02",
        text: "I wake up coughing at 3 AM almost every night this week and feel chest tightness when climbing stairs.",
      },
      {
        speaker: "Doctor",
        time: "11:14:18",
        text: "How often have you been reaching for your rescue Albuterol inhaler in the last 7 days?",
      },
      {
        speaker: "Patient",
        time: "11:14:32",
        text: "Almost 4 times per week, especially after my evening run in the cold air.",
      },
      {
        speaker: "AI Scribe",
        time: "11:14:36",
        text: "Flagged GINA un-controlled criteria: SABA rescue >2x/week, nocturnal awakenings, PEF 64% predicted.",
      },
    ],
    extractedFhir: [
      { resource: "Condition", code: "ICD-10 J45.40", display: "Moderate persistent asthma, uncomplicated" },
      { resource: "Observation", code: "LOINC 19926-5", display: "Peak expiratory flow: 320 L/min" },
      { resource: "MedicationStatement", code: "RxNorm 745679", display: "Albuterol 90mcg Inhalation Aerosol" },
      { resource: "Observation", code: "LOINC 59408-5", display: "O2 Saturation: 95%" },
    ],
    differential: [
      { diagnosis: "Uncontrolled Moderate Persistent Asthma (GINA Step 3)", probability: 64, color: "bg-teal-600" },
      { diagnosis: "Cough-Variant Asthma / Cold Air Induced", probability: 22, color: "bg-blue-500" },
      { diagnosis: "GERD-Induced Bronchospasm", probability: 10, color: "bg-indigo-500" },
      { diagnosis: "Post-Viral Hyperresponsiveness", probability: 4, color: "bg-amber-500" },
    ],
    cdsGuidelines: "GINA 2024 Track 1: Step up to low-dose ICS-formoterol maintenance & reliever therapy (SMART). Review inhaler technique.",
    suggestedPlan: "Step up to Budesonide-Formoterol 160/4.5mcg 1 puff BID + PRN. Daily peak flow diary.",
  },
  {
    id: "endo-sarah",
    patientName: "Sarah Jenkins",
    ageGender: "58F • MRN #DG-31092",
    condition: "Suboptimal Glycemia & Microalbuminuria",
    specialty: "Endocrinology",
    avatarColor: "from-violet-600 to-indigo-500",
    vitalStats: [
      { label: "Blood Pressure", value: "134/84 mmHg", status: "optimal" },
      { label: "HbA1c", value: "8.2% (Target <7%)", status: "warning" },
      { label: "eGFR (CKD-EPI)", value: "68 mL/min", status: "optimal" },
      { label: "Urine ACR", value: "48 mg/g (A2)", status: "warning" },
    ],
    dialogue: [
      {
        speaker: "Patient",
        time: "14:20:10",
        text: "My morning fasting blood sugars have been hovering around 160-175 mg/dL despite Metformin 1000mg twice daily.",
      },
      {
        speaker: "Doctor",
        time: "14:20:25",
        text: "Any symptoms of peripheral numbness in your toes, increased thirst, or gastrointestinal discomfort?",
      },
      {
        speaker: "Patient",
        time: "14:20:40",
        text: "No GI issues with extended-release, but I notice my legs feel tired after short walks.",
      },
      {
        speaker: "AI Scribe",
        time: "14:20:46",
        text: "Extracted labs: HbA1c 8.2%, urine ACR 48 mg/g (Stage A2 albuminuria), eGFR 68. Cardiorenal protection indicated.",
      },
    ],
    extractedFhir: [
      { resource: "Condition", code: "ICD-10 E11.22", display: "Type 2 diabetes with diabetic nephropathy" },
      { resource: "Observation", code: "LOINC 4548-4", display: "Hemoglobin A1c: 8.2%" },
      { resource: "Observation", code: "LOINC 32294-1", display: "Albumin/Creatinine in urine: 48 mg/g" },
      { resource: "MedicationRequest", code: "RxNorm 860975", display: "Metformin HCl 1000 MG Oral" },
    ],
    differential: [
      { diagnosis: "Type 2 Diabetes with Incipient Nephropathy", probability: 72, color: "bg-indigo-600" },
      { diagnosis: "Metformin Inadequate Monotherapy", probability: 18, color: "bg-blue-500" },
      { diagnosis: "Secondary Hypertensive Sclerosis", probability: 7, color: "bg-teal-500" },
      { diagnosis: "Subclinical Peripheral Arterial Strain", probability: 3, color: "bg-amber-500" },
    ],
    cdsGuidelines: "ADA 2024 Standards of Care: Add SGLT2 inhibitor (Empagliflozin 10mg) for proven cardiorenal risk reduction and glycemic control.",
    suggestedPlan: "Add Empagliflozin 10mg daily. Continue Metformin ER 1000mg BID. Repeat CMP & Urine ACR in 12 weeks.",
  },
];

export default function InteractiveSimulatorSection() {
  const [activeCaseId, setActiveCaseId] = useState<string>("cardio-louise");
  const [mobileTab, setMobileTab] = useState<"dialogue" | "fhir" | "cds">("dialogue");

  const activeCase = clinicalCases.find((c) => c.id === activeCaseId) || clinicalCases[0];

  return (
    <section className="py-16 sm:py-24 bg-background relative overflow-hidden border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* ── Section Title & Intro ── */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wide shadow-2xs">
            <Brain className="w-3.5 h-3.5" />
            <span>Interactive Clinical Reasoning Workbench</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight">
            See the{" "}
            <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
              Clinical Intelligence Loop
            </span>{" "}
            in action.
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-normal">
            Select a real-world patient encounter to inspect how DrGodly captures ambient dialogue,
            extracts standardized FHIR R4 schemas, and generates evidence-based differential diagnoses.
          </p>

          {/* Patient Scenario Segmented Selector */}
          <div className="pt-3 flex items-center justify-center">
            <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-muted/60 border border-border/80 shadow-2xs overflow-x-auto max-w-full">
              {clinicalCases.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveCaseId(c.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeCaseId === c.id
                      ? "bg-card text-foreground shadow-sm border border-border/80 font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full bg-gradient-to-tr ${c.avatarColor}`} />
                  <span>{c.patientName}</span>
                  <span className="text-[11px] opacity-70 font-normal">({c.specialty})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Interactive Workbench Card ── */}
        <div className="bg-card rounded-2xl border border-border/80 shadow-xl overflow-hidden">
          {/* Patient Header Banner */}
          <div className="bg-muted/70 px-4 sm:px-6 py-3.5 border-b border-border/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${activeCase.avatarColor} flex items-center justify-center text-white font-black text-xs shrink-0 shadow-2xs`}
              >
                {activeCase.patientName.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-foreground">{activeCase.patientName}</h4>
                  <span className="text-[11px] text-muted-foreground font-mono">{activeCase.ageGender}</span>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                    Live Telehealth Active
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                  {activeCase.condition} &bull; {activeCase.specialty}
                </p>
              </div>
            </div>

            {/* Vitals Ribbon */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              {activeCase.vitalStats.map((v, i) => (
                <div
                  key={i}
                  className={`px-2.5 py-1 rounded-lg text-xs border font-medium shrink-0 ${
                    v.status === "warning"
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                      : "bg-background/80 border-border/70 text-foreground"
                  }`}
                >
                  <span className="text-[11px] text-muted-foreground block">{v.label}</span>
                  <span className="font-bold">{v.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile view segmented tabs (< lg) */}
          <div className="lg:hidden flex border-b border-border bg-muted/40 p-1">
            <button
              type="button"
              onClick={() => setMobileTab("dialogue")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mobileTab === "dialogue" ? "bg-card text-foreground shadow-2xs" : "text-muted-foreground"
              }`}
            >
              1. Ambient Dialogue
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("fhir")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mobileTab === "fhir" ? "bg-card text-foreground shadow-2xs" : "text-muted-foreground"
              }`}
            >
              2. FHIR R4
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("cds")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mobileTab === "cds" ? "bg-card text-foreground shadow-2xs" : "text-muted-foreground"
              }`}
            >
              3. CDS Reasoning
            </button>
          </div>

          {/* Main 3-Column Interactive Grid */}
          <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 bg-background/50">
            {/* Column 1: Ambient Diarized Dialogue Stream (4 Cols) */}
            <div
              className={`lg:col-span-4 bg-card p-4 rounded-xl border border-border/70 shadow-2xs space-y-3 flex flex-col justify-between ${
                mobileTab === "dialogue" ? "block" : "hidden lg:flex"
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <Radio className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                    <span>Ambient Multi-Modal Dialogue</span>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                    1080p Diarizing
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  {activeCase.dialogue.map((d, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                        d.speaker === "Doctor"
                          ? "bg-blue-500/10 text-foreground border border-blue-500/20 ml-2"
                          : d.speaker === "Patient"
                          ? "bg-muted/60 text-foreground border border-border/70 mr-2"
                          : "bg-emerald-500/10 text-foreground border border-emerald-500/20 font-medium"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold opacity-70 mb-1">
                        <span className="flex items-center gap-1">
                          {d.speaker === "Doctor" ? "👨‍⚕️" : d.speaker === "Patient" ? "👤" : "⚡"} {d.speaker}
                        </span>
                        <span className="font-mono text-[10px]">{d.time}</span>
                      </div>
                      <p className="text-[11px] leading-snug">{d.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Live Scribing Active
                </span>
                <span className="font-mono font-bold text-foreground">&lt; 800ms Latency</span>
              </div>
            </div>

            {/* Column 2: Live Extracted FHIR R4 Schemas (4 Cols) */}
            <div
              className={`lg:col-span-4 bg-card p-4 rounded-xl border border-border/70 shadow-2xs space-y-3 flex flex-col justify-between ${
                mobileTab === "fhir" ? "block" : "hidden lg:flex"
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <Database className="w-3.5 h-3.5 text-teal-500" />
                    <span>Extracted FHIR R4 Schemas</span>
                  </div>
                  <Badge variant="outline" className="text-[11px] font-bold border-teal-500/30 text-teal-600 dark:text-teal-400">
                    Validated
                  </Badge>
                </div>

                <div className="mt-3 space-y-2">
                  {activeCase.extractedFhir.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-muted/30 border border-border/60 hover:border-border transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded">
                          {item.resource}
                        </span>
                        <span className="text-[11px] font-mono font-semibold text-muted-foreground">{item.code}</span>
                      </div>
                      <p className="text-xs font-bold text-foreground mt-1">{item.display}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2.5 border-t border-border/60 text-[11px] text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>US Core STU4 & ABDM M1 Compatible</span>
              </div>
            </div>

            {/* Column 3: CDS Differential & Evidence Guidelines (4 Cols) */}
            <div
              className={`lg:col-span-4 bg-card p-4 rounded-xl border border-border/70 shadow-2xs space-y-3 flex flex-col justify-between ${
                mobileTab === "cds" ? "block" : "hidden lg:flex"
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <Brain className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Clinical Decision Support (CDS)</span>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                    Medical RAG
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Differential Diagnosis Probabilities
                  </div>
                  {activeCase.differential.map((diff, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex items-center justify-between text-xs font-medium text-foreground">
                        <span className="truncate pr-2 text-[11px]">{diff.diagnosis}</span>
                        <span className="font-bold text-[11px] shrink-0">{diff.probability}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className={`h-full ${diff.color} rounded-full`} style={{ width: `${diff.probability}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 p-2.5 bg-blue-500/10 rounded-lg border border-blue-500/20 text-[11px] text-foreground leading-snug">
                  <strong className="block text-blue-600 dark:text-blue-400 font-bold mb-0.5">Guideline Recommendation:</strong>
                  {activeCase.cdsGuidelines}
                </div>
              </div>

              <div className="pt-2.5 border-t border-border/60">
                <Link href="/screens">
                  <Button
                    size="sm"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-lg shadow-2xs flex items-center justify-center gap-1.5 h-8"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Open 3-Panel Cockpit with {activeCase.patientName.split(" ")[0]}</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
