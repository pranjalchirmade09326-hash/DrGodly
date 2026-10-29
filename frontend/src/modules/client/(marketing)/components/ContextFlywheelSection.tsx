"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import {
  Stethoscope,
  Activity,
  HeartPulse,
  Brain,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  FileCheck2,
  Video,
  Database,
  Radio,
  FileText,
  Sliders,
  ChevronRight,
  TrendingUp,
  Cpu,
} from "lucide-react";

interface ClinicalCase {
  id: string;
  patientName: string;
  ageGender: string;
  condition: string;
  specialty: string;
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
    ageGender: "30F • ID #DG-89241",
    condition: "Acute Cephalalgia with Systolic Spikes",
    specialty: "Preventive Cardiology",
    vitalStats: [
      { label: "Blood Pressure", value: "142/88 mmHg", status: "warning" },
      { label: "Heart Rate", value: "72 bpm regular", status: "optimal" },
      { label: "SpO2 Saturation", value: "98% ambient air", status: "optimal" },
      { label: "12-Lead ECG", value: "Normal Sinus Rhythm", status: "optimal" },
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
        text: "No visual blurriness or nausea, but I felt slightly lightheaded when getting out of bed this morning.",
      },
      {
        speaker: "AI Scribe",
        time: "10:02:45",
        text: "Synthesized chief complaint: 3-day morning throbbing cephalalgia + elevated home systolic reading. Denies scintillations.",
      },
    ],
    extractedFhir: [
      { resource: "Condition", code: "ICD-10 I10", display: "Essential (Primary) Hypertension" },
      { resource: "Condition", code: "ICD-10 G44.209", display: "Tension-type headache, unspecified" },
      { resource: "Observation", code: "LOINC 85354-9", display: "Blood pressure panel: 142/88 mmHg" },
      { resource: "Observation", code: "LOINC 8867-4", display: "Heart rate: 72 beats/minute" },
    ],
    differential: [
      { diagnosis: "Stage 2 Essential Hypertension with Symptomatic Elevation", probability: 48, color: "bg-blue-600" },
      { diagnosis: "Tension-Type Vascular Cephalalgia", probability: 32, color: "bg-teal-500" },
      { diagnosis: "Migraine without Aura", probability: 14, color: "bg-indigo-500" },
      { diagnosis: "Medication-Induced Orthostatic Variation", probability: 6, color: "bg-amber-500" },
    ],
    cdsGuidelines: "ACC/AHA 2024 Stage 2 Guideline: Confirm ambulatory BP monitoring log. Initiate low-dose CCB (Amlodipine 5mg). Order CMP & urine albumin-to-creatinine ratio.",
    suggestedPlan: "1. Initiate Amlodipine 5mg orally once daily in morning.\n2. Prescribe 14-day digital home blood pressure log.\n3. Order CMP & Urine microalbumin.\n4. Scheduled telehealth follow-up in 14 days.",
  },
  {
    id: "pulmo-marcus",
    patientName: "Marcus Chen",
    ageGender: "42M • ID #DG-54129",
    condition: "Nocturnal Cough & Exertional Wheezing",
    specialty: "Pulmonology & Allergy",
    vitalStats: [
      { label: "Blood Pressure", value: "128/82 mmHg", status: "optimal" },
      { label: "Heart Rate", value: "84 bpm", status: "optimal" },
      { label: "SpO2 Saturation", value: "95% ambient air", status: "warning" },
      { label: "Peak Expiratory Flow", value: "320 L/min (64% pred)", status: "warning" },
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
        text: "Almost 4 times per week, especially after my evening run in cold air.",
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
      { resource: "Observation", code: "LOINC 59408-5", display: "Oxygen saturation in arterial blood: 95%" },
    ],
    differential: [
      { diagnosis: "Uncontrolled Moderate Persistent Asthma (GINA Step 3)", probability: 64, color: "bg-blue-600" },
      { diagnosis: "Cough-Variant Asthma / Cold Air Induced", probability: 22, color: "bg-teal-500" },
      { diagnosis: "Gastroesophageal Reflux-Induced Bronchospasm", probability: 10, color: "bg-indigo-500" },
      { diagnosis: "Post-Viral Bronchial Hyperresponsiveness", probability: 4, color: "bg-amber-500" },
    ],
    cdsGuidelines: "GINA 2024 Track 1 Recommendation: Step up to low-dose ICS-formoterol maintenance and reliever therapy (SMART). Review inhaler inhalation technique and asthma action plan.",
    suggestedPlan: "1. Step up to Budesonide-Formoterol 160/4.5mcg 1 puff BID plus PRN.\n2. In-app peak flow diary logging twice daily.\n3. Avoid cold-air trigger without pre-warming scarf.\n4. Virtual spirometry check-in in 4 weeks.",
  },
  {
    id: "endo-sarah",
    patientName: "Sarah Jenkins",
    ageGender: "58F • ID #DG-31092",
    condition: "Suboptimal Glycemic Control & Microalbuminuria",
    specialty: "Metabolic & Endocrinology",
    vitalStats: [
      { label: "Blood Pressure", value: "134/84 mmHg", status: "optimal" },
      { label: "Hemoglobin A1c", value: "8.2% (Target <7.0%)", status: "warning" },
      { label: "eGFR (CKD-EPI)", value: "68 mL/min/1.73m²", status: "optimal" },
      { label: "Urine ACR", value: "48 mg/g (Microalbuminuria)", status: "warning" },
    ],
    dialogue: [
      {
        speaker: "Patient",
        time: "14:20:10",
        text: "My morning fasting blood sugars have been hovering around 160-175 mg/dL despite taking Metformin 1000mg twice daily.",
      },
      {
        speaker: "Doctor",
        time: "14:20:25",
        text: "Any symptoms of peripheral numbness in your toes, increased thirst, or gastrointestinal discomfort?",
      },
      {
        speaker: "Patient",
        time: "14:20:40",
        text: "No stomach issues with the extended-release Metformin, but I notice my legs feel tired after short walks.",
      },
      {
        speaker: "AI Scribe",
        time: "14:20:46",
        text: "Extracted lab values: HbA1c 8.2%, urine ACR 48 mg/g (Stage A2 albuminuria), eGFR 68. Cardiorenal protection indicated.",
      },
    ],
    extractedFhir: [
      { resource: "Condition", code: "ICD-10 E11.22", display: "Type 2 diabetes with diabetic chronic kidney disease" },
      { resource: "Observation", code: "LOINC 4548-4", display: "Hemoglobin A1c: 8.2%" },
      { resource: "Observation", code: "LOINC 32294-1", display: "Albumin/Creatinine in urine: 48 mg/g" },
      { resource: "MedicationRequest", code: "RxNorm 860975", display: "Metformin HCl 1000 MG Oral Tablet" },
    ],
    differential: [
      { diagnosis: "Type 2 Diabetes with Incipient Diabetic Nephropathy", probability: 72, color: "bg-blue-600" },
      { diagnosis: "Metformin Inadequate Monotherapy Failure", probability: 18, color: "bg-teal-500" },
      { diagnosis: "Secondary Hypertensive Microvascular Sclerosis", probability: 7, color: "bg-indigo-500" },
      { diagnosis: "Subclinical Peripheral Arterial Insufficiency", probability: 3, color: "bg-amber-500" },
    ],
    cdsGuidelines: "ADA 2024 Standards of Care: Add SGLT2 inhibitor (Empagliflozin 10mg) for proven cardiorenal risk reduction and glycemic lowering independent of baseline HbA1c.",
    suggestedPlan: "1. Add Empagliflozin 10mg orally once daily in morning.\n2. Continue Metformin ER 1000mg BID with evening meal.\n3. Repeat CMP & Urine ACR in 12 weeks to monitor eGFR.\n4. Annual dilated retinal examination referral.",
  },
];

export default function ContextFlywheelSection() {
  const [activeCaseId, setActiveCaseId] = useState<string>("cardio-louise");
  const activeCase = clinicalCases.find((c) => c.id === activeCaseId) || clinicalCases[0];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden border-y border-slate-200/80">
      {/* Background Soft Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-40">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* ── 1. SECTION TITLE & INTRO ── */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold tracking-wide shadow-2xs">
            <Cpu className="size-3.5 text-blue-600" />
            <span>Event-Driven Autonomous Clinical Intelligence</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Healthcare designed for{" "}
            <span className="bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              active reasoning
            </span>
            , not passive forms.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Legacy EHRs are static databases designed for manual keyboard entry. DrGodly embeds autonomous
            AI directly into the transactional clinical event loop: ambient listening, real-time FHIR event
            brokers, and evidence-based clinical decision support.
          </p>
        </div>

        {/* ── 2. REAL-TIME CLINICAL EVENT-DRIVEN PIPELINE (From Technical Spec) ── */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400">
                <Radio className="size-3.5 text-teal-400 animate-pulse" />
                <span>The Real-Time Clinical Data Pipeline</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                From Unstructured Dialogue to Cryptographically Verified FHIR Records
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                70% Fewer Manual Interactions
              </span>
              <Link href="/screens">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs">
                  Experience Live in Studio
                  <ArrowRight className="size-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* 5-Step Pipeline Steps */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 relative">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/30">
                01
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Ambient Input</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Passive multi-channel acoustic recording captures natural doctor-patient dialogue without clinical distraction.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 relative">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs border border-teal-500/30">
                02
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">FHIR Event Bus</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Diarized conversational stream published to Kafka/NATS event broker with micro-second latency.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 relative">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
                03
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Context Engine</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Parallelized clinical SLMs parse ICD-10, LOINC biomarkers, and past medication history simultaneously.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 relative">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs border border-purple-500/30">
                04
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Medical RAG & CDS</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Secure vector embeddings match patient context with ACC/AHA, GINA, and ADA evidence guidelines.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 relative">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold text-xs border border-emerald-500/40">
                05
              </div>
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Clinician Write</h4>
              <p className="text-[11px] text-emerald-100 leading-relaxed">
                "AI proposes; clinicians dispose." Doctor validates draft SOAP note with cryptographic digital signature.
              </p>
            </div>
          </div>
        </div>

        {/* ── 3. INTERACTIVE CLINICAL SIMULATION WORKBENCH ── */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Live Interactive Clinical Simulator
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Select a clinical encounter to observe ambient diarization, FHIR entity extraction, and CDS reasoning in real time.
              </p>
            </div>

            {/* Patient Scenario Segmented Selector */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200/80 overflow-x-auto">
              {clinicalCases.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveCaseId(c.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeCaseId === c.id
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200/70"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {c.patientName} ({c.specialty.split(" ")[0]})
                </button>
              ))}
            </div>
          </div>

          {/* 3-Column Cockpit Simulation Card */}
          <Card className="rounded-3xl border-slate-200/80 shadow-lg overflow-hidden bg-white">
            {/* Top Patient Header Bar */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-xs">
                  {activeCase.patientName.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white">{activeCase.patientName}</h4>
                    <span className="text-xs text-slate-400 font-medium">{activeCase.ageGender}</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] font-bold">
                      Live Telehealth Active
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{activeCase.condition} • {activeCase.specialty}</p>
                </div>
              </div>

              {/* Vitals Ribbon */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                {activeCase.vitalStats.map((v, i) => (
                  <div
                    key={i}
                    className={`px-3 py-1 rounded-xl text-xs border font-medium shrink-0 ${
                      v.status === "warning"
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                        : "bg-white/10 border-white/15 text-slate-200"
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 block">{v.label}</span>
                    <span className="font-bold text-white">{v.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Main 3-Column Interactive Grid */}
            <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/50">
              {/* Column 1: Ambient Diarized Dialogue Stream (4 Cols) */}
              <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                      <Radio className="size-3.5 text-blue-600 animate-pulse" />
                      <span>Ambient Multi-Modal Dialogue</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      1080p Diarizing
                    </span>
                  </div>

                  <div className="mt-3 space-y-2.5">
                    {activeCase.dialogue.map((d, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          d.speaker === "Doctor"
                            ? "bg-blue-50/80 text-blue-900 border border-blue-100 ml-3"
                            : d.speaker === "Patient"
                            ? "bg-slate-100/90 text-slate-800 border border-slate-200/80 mr-3"
                            : "bg-emerald-50/80 text-emerald-900 border border-emerald-200 font-medium"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold opacity-70 mb-1">
                          <span>{d.speaker}</span>
                          <span>{d.time}</span>
                        </div>
                        <p>{d.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                    Continuous Scribe Active
                  </span>
                  <span className="font-semibold text-slate-700">Sub-second Latency</span>
                </div>
              </div>

              {/* Column 2: Live Extracted FHIR R4 Entities (4 Cols) */}
              <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                      <Database className="size-3.5 text-teal-600" />
                      <span>Extracted FHIR R4 Schemas</span>
                    </div>
                    <Badge className="bg-teal-50 text-teal-700 border-teal-200 text-[10px] font-bold">
                      Zero DB Translation
                    </Badge>
                  </div>

                  <div className="mt-3 space-y-2">
                    {activeCase.extractedFhir.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-100/60 px-1.5 py-0.5 rounded">
                            {item.resource}
                          </span>
                          <span className="text-[10px] font-mono font-semibold text-slate-500">{item.code}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 mt-1">{item.display}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-blue-600" />
                  <span>Validated against US Core 6.1.0 & ABDM M1</span>
                </div>
              </div>

              {/* Column 3: CDS Differential & Evidence Guidelines (4 Cols) */}
              <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                      <Brain className="size-3.5 text-indigo-600" />
                      <span>Clinical Decision Support (CDS)</span>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                      Medical RAG Active
                    </span>
                  </div>

                  <div className="mt-3 space-y-2.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Differential Diagnosis Probabilities
                    </div>
                    {activeCase.differential.map((diff, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-medium text-slate-800">
                          <span className="truncate pr-2">{diff.diagnosis}</span>
                          <span className="font-bold text-slate-900 shrink-0">{diff.probability}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${diff.color} rounded-full`} style={{ width: `${diff.probability}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-[11px] text-blue-900 leading-relaxed">
                    <strong className="block text-blue-950 font-bold mb-0.5">Evidence Guideline:</strong>
                    {activeCase.cdsGuidelines}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <Link href="/screens">
                    <Button
                      size="sm"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Video className="size-3.5 text-blue-400" />
                      <span>Launch Full 3-Panel Cockpit</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── 4. FOUR CORE ARCHITECTURAL PILLARS (From Presentation Slides) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 font-bold">
              <Database className="size-6" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900">FHIR-Native Core</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Zero proprietary database translation. Every data point maps instantly to fully structured HL7 FHIR R4 schemas for seamless interoperability.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-600 font-bold">
              <Zap className="size-6" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900">Event-Driven Architecture</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Replaces batch nightly cron jobs. Clinical actions trigger micro-webhooks on the event bus, sparking instant concurrent SLM background execution.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600 font-bold">
              <ShieldCheck className="size-6" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900">Human-in-the-Loop Safety</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              "AI proposes; clinicians dispose." Interactive draft states require explicit clinical affirmation before writing to the permanent EHR record.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200/60 flex items-center justify-center text-purple-600 font-bold">
              <Lock className="size-6" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900">Decoupled Security & BAA</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Sensitive patient identifiers (PII/PHI) are programmatically redacted on local servers prior to outbound routing with signed HIPAA BAAs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
