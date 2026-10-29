/**
 * HowItWorksPage — dedicated deep-dive page on the DrGodly clinical workflow.
 *
 * Layer: client / (marketing) / pages
 *
 * Covers: the full AI FHIR clinical workflow from the patient's perspective,
 * the doctor's perspective, and the underlying technical data flow showing
 * how each interaction maps to FHIR resources in real time.
 */

"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import {
  UserCheck,
  Calendar,
  MessageSquare,
  Stethoscope,
  FileText,
  Database,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Brain,
  Mic,
  Activity,
  Zap,
} from "lucide-react";
import type { AuthResponse } from "@/modules/server/auth/types";

const patientSteps = [
  {
    icon: <UserCheck className="w-5 h-5 text-blue-500" />,
    step: "01",
    title: "1-Click Profile & Health ID",
    description:
      "Patient registers in 60 seconds with verified demographics. A valid FHIR Patient resource is provisioned immediately with secure credentials.",
    fhirResource: "FHIR Patient",
  },
  {
    icon: <Calendar className="w-5 h-5 text-teal-500" />,
    step: "02",
    title: "Specialist Matching & Slot Booking",
    description:
      "Patient browses board-certified physicians by sub-specialty, checks verified ratings, and schedules. Creates an active FHIR Appointment resource.",
    fhirResource: "FHIR Appointment",
  },
  {
    icon: <MessageSquare className="w-5 h-5 text-violet-500" />,
    step: "03",
    title: "Pre-Visit Autonomous AI Intake",
    description:
      "Prior to the consult, an adaptive AI agent elicits symptoms, pain ratings, and medication history — populating standardized FHIR Observations.",
    fhirResource: "FHIR Observation",
  },
  {
    icon: <Stethoscope className="w-5 h-5 text-amber-500" />,
    step: "04",
    title: "1080p Encrypted Teleconsultation",
    description:
      "Patient connects via WebRTC video. Ambient AI scribing runs in the background while the doctor focuses entirely on patient care.",
    fhirResource: "FHIR Encounter",
  },
  {
    icon: <FileText className="w-5 h-5 text-emerald-500" />,
    step: "05",
    title: "Digital Care Plan & E-Prescriptions",
    description:
      "Patient receives their finalized clinical report, e-prescription orders, and home monitoring schedules directly in their secure portal.",
    fhirResource: "FHIR DocumentReference",
  },
];

const doctorSteps = [
  {
    icon: <ClipboardList className="w-5 h-5 text-violet-500" />,
    step: "01",
    title: "Smart Triage & Appointment Queue",
    description:
      "Physician dashboard groups patients chronologically with automated clinical risk flags and pre-visit intake completeness scores.",
  },
  {
    icon: <Brain className="w-5 h-5 text-blue-500" />,
    step: "02",
    title: "Pre-Synthesized AI Dossier",
    description:
      "Doctor reviews the AI-extracted chief complaint, past vitals, and preliminary ICD-10 differentials before the video call even connects.",
  },
  {
    icon: <Stethoscope className="w-5 h-5 text-teal-500" />,
    step: "03",
    title: "3-Panel Clinical Cockpit",
    description:
      "During the call, the cockpit displays live patient records on the left, 1080p WebRTC in the center, and active AI CDS on the right.",
  },
  {
    icon: <Activity className="w-5 h-5 text-amber-500" />,
    step: "04",
    title: "Progressive AI SOAP Generation",
    description:
      "As doctor and patient speak, Subjective, Objective, Assessment, and Plan notes populate live with sub-second SLM latency.",
  },
  {
    icon: <Database className="w-5 h-5 text-emerald-500" />,
    step: "05",
    title: "One-Click Cryptographic Attestation",
    description:
      "Physician approves or edits the drafted note with digital signature, simultaneously finalizing the FHIR Encounter and sending e-Rx orders.",
  },
];

export function HowItWorksPage({ session }: { session: AuthResponse | null }) {
  return (
    <div className="pt-20">
      {/* ── Hero ── */}
      <section className="py-16 sm:py-24 bg-background relative overflow-hidden border-b border-border/50">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wide">
              <Zap className="w-3.5 h-3.5" />
              <span>Full Clinical Continuum</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.1]">
              The Complete AI FHIR Clinical Workflow,{" "}
              <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Step by Step
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-normal">
              DrGodly bridges the entire clinical continuum — from autonomous pre-visit intake
              to ambient consultation scribing and cryptographic FHIR record persistence.
            </p>

            <div className="pt-2 flex justify-center gap-3">
              {!session ? (
                <Link href="/signup">
                  <Button size="lg" className="rounded-full px-7 h-11 text-sm bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white font-semibold shadow-md">
                    Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <Link href="/screens">
                  <Button size="lg" className="rounded-full px-7 h-11 text-sm bg-primary text-primary-foreground font-semibold">
                    Open Clinical Cockpit <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              )}
              <Link href="/screens">
                <Button variant="outline" size="lg" className="rounded-full px-6 h-11 text-sm font-semibold border-border">
                  Experience Live in Studio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Patient Journey ── */}
      <section className="py-16 sm:py-24 bg-muted/20 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs mb-1">
              <UserCheck className="w-4 h-4" />
              <span>Patient Experience</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
              From Symptom Onset to Resolved Care Plan
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
              A frictionless, guided digital journey ensuring patients feel heard and cared for.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {patientSteps.map((s, idx) => (
              <Card key={idx} className="p-4 rounded-2xl bg-card border border-border/70 shadow-2xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-xl bg-background flex items-center justify-center border border-border">
                      {s.icon}
                    </div>
                    <span className="text-xs font-mono font-bold text-muted-foreground/60">{s.step}</span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1">{s.title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-snug">{s.description}</p>
                </div>
                <div className="pt-2 border-t border-border/50">
                  <Badge variant="outline" className="text-[9px] font-mono border-border text-primary">
                    {s.fhirResource}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Doctor Journey ── */}
      <section className="py-16 sm:py-24 bg-background border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div>
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider text-xs mb-1">
              <Stethoscope className="w-4 h-4" />
              <span>Clinician Experience</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
              Zero Keyboard Fatigue, Maximum Clinical Focus
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
              Turn documentation burden into automated clinical insights so doctors can focus on patients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {doctorSteps.map((s, idx) => (
              <Card key={idx} className="p-4 rounded-2xl bg-card border border-border/70 shadow-2xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-xl bg-background flex items-center justify-center border border-border">
                      {s.icon}
                    </div>
                    <span className="text-xs font-mono font-bold text-muted-foreground/60">{s.step}</span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1">{s.title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-snug">{s.description}</p>
                </div>
                <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Latency</span>
                  <span className="text-emerald-500 font-bold">&lt; 800ms</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final Action CTA ── */}
      <section className="py-16 sm:py-24 bg-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
            See the Complete Clinical Workflow in Real Time
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            Experience the 3-panel telehealth cockpit, explore interactive triage queues, and test ambient FHIR generation.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link href="/signup">
              <Button size="lg" className="rounded-full px-7 bg-primary text-primary-foreground font-semibold">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/screens">
              <Button variant="outline" size="lg" className="rounded-full px-7 border-border font-semibold">
                Open All Screens Showcase
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
