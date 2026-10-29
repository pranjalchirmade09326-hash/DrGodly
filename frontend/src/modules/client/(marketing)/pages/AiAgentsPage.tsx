/**
 * AiAgentsPage — dedicated marketing page explaining DrGodly's AI clinical agents.
 *
 * Layer: client / (marketing) / pages
 *
 * Covers: the specialized clinical AI agents (Intake, Consultation Scribe, CDS),
 * how each operates across the encounter continuum, and the strict Human-in-the-Loop
 * safety principles that guarantee clinician authority and HIPAA adherence.
 */

"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import {
  Brain,
  MessageSquare,
  Mic,
  ClipboardList,
  Eye,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Database,
  ShieldCheck,
  Clock,
  Activity,
  Stethoscope,
} from "lucide-react";
import type { AuthResponse } from "@/modules/server/auth/types";

const agents = [
  {
    id: "intake",
    icon: <MessageSquare className="w-6 h-6 text-blue-500" />,
    color: "border-blue-500/20 bg-blue-500/5",
    accentColor: "text-blue-500",
    badgeColor: "border-blue-500/30 text-blue-600 dark:text-blue-400",
    status: "Active Production",
    title: "AI Intake & Triage Agent",
    subtitle: "Pre-appointment clinical dialogue via voice or text",
    description:
      "Before every appointment, the AI Intake Agent conducts an adaptive clinical interview. It elicits symptoms, pain ratings, duration, and past history — converting raw dialogue into structured FHIR Observations.",
    howItWorks: [
      "Patient accesses pre-visit intake link on mobile or desktop",
      "Agent asks targeted clinical questions dynamically adapted to response",
      "NLP extracts red flags, duration, and severity scores in real time",
      "Drafts FHIR Observations and Conditions directly into the patient record",
      "Synthesizes an advance clinical summary for the attending physician",
    ],
    outputs: ["FHIR Observation resources", "Pre-consultation SOAP summary", "Emergency red flag alerts", "ICD-10 differential hints"],
  },
  {
    id: "scribe",
    icon: <Mic className="w-6 h-6 text-teal-500" />,
    color: "border-teal-500/20 bg-teal-500/5",
    accentColor: "text-teal-500",
    badgeColor: "border-teal-500/30 text-teal-600 dark:text-teal-400",
    status: "Active Production",
    title: "Ambient Consultation Scribe",
    subtitle: "Real-time WebRTC audio transcription & sub-second SOAP generation",
    description:
      "During telehealth visits, the Ambient Scribe operates in the background. It transcribes multi-party conversations, attributes speakers, and autonomously constructs clean Subjective, Objective, Assessment, and Plan notes.",
    howItWorks: [
      "Physician starts 1080p encrypted WebRTC consultation session",
      "Bi-directional audio streams at 48kHz with acoustic noise cancellation",
      "Parallel SLMs extract clinical observations without lag",
      "SOAP note sections update progressively during the encounter",
      "Physician reviews, edits, and digitally attests with a single click",
    ],
    outputs: ["FHIR Encounter payload", "Autonomous SOAP note (S/O/A/P)", "Timestamped speaker transcript", "Digital signature attestation"],
  },
  {
    id: "cds",
    icon: <Brain className="w-6 h-6 text-violet-500" />,
    color: "border-violet-500/20 bg-violet-500/5",
    accentColor: "text-violet-500",
    badgeColor: "border-violet-500/30 text-violet-600 dark:text-violet-400",
    status: "Active Production",
    title: "Clinical Decision Support (CDS) Agent",
    subtitle: "Evidence-based guidelines & differential diagnosis ranking",
    description:
      "Leveraging medical RAG (Retrieval-Augmented Generation), the CDS Agent matches patient vitals and symptoms against ACC/AHA, GINA, and ADA clinical practice guidelines to present probabilistic differentials.",
    howItWorks: [
      "Correlates live patient vitals with historical laboratory metrics",
      "Queries vector database containing verified peer-reviewed guidelines",
      "Ranks top differential diagnoses with calculated confidence percentages",
      "Suggests guideline-adherent pharmacotherapy and lab orders",
      "Prevents drug-condition contraindications and duplicate dosing",
    ],
    outputs: ["Differential diagnosis probabilities", "Guideline citations (ACC/AHA, ADA)", "Suggested pharmacotherapy plans", "Lab requisition orders"],
  },
];

const oversightPrinciples = [
  {
    icon: <Eye className="w-5 h-5 text-blue-500" />,
    title: "Clinician Authority First",
    description: "No AI output is committed to the permanent EMR until a licensed practitioner explicitly reviews, edits, and attests it.",
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
    title: "Advisory by Architecture",
    description: "Every diagnosis and medication suggestion is marked as an advisory draft state, upholding the 'AI proposes; clinicians dispose' rule.",
  },
  {
    icon: <ClipboardList className="w-5 h-5 text-teal-500" />,
    title: "Immutable Audit Trails",
    description: "Every SLM prompt, inference token, and clinician modification is recorded in cryptographically signed audit logs for compliance.",
  },
  {
    icon: <Clock className="w-5 h-5 text-violet-500" />,
    title: "Session-Bounded Memory",
    description: "Agent execution contexts are strictly isolated to the active clinical encounter, preventing cross-tenant data leakage.",
  },
];

export function AiAgentsPage({ session }: { session: AuthResponse | null }) {
  return (
    <div className="pt-20">
      {/* ── Hero ── */}
      <section className="py-16 sm:py-24 bg-background relative overflow-hidden border-b border-border/50">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Agent Clinical Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.1]">
              Clinical AI Agents That Work{" "}
              <span className="bg-gradient-to-r from-violet-600 via-blue-500 to-teal-500 bg-clip-text text-transparent">
                Before, During, & After
              </span>{" "}
              Every Visit
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-normal">
              DrGodly coordinates specialized small language models across the clinical encounter.
              From conversational intake to real-time ambient scribing and evidence-based CDS,
              our agents eliminate documentation fatigue while keeping physicians in total control.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
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

          {/* Quick Metrics */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-5 sm:p-6 rounded-2xl bg-card border border-border/70 shadow-2xs">
            {[
              { icon: <Sparkles className="w-5 h-5 text-violet-500" />, value: "3", label: "Specialized clinical agents" },
              { icon: <Database className="w-5 h-5 text-blue-500" />, value: "FHIR R4", label: "Structured output persistence" },
              { icon: <Eye className="w-5 h-5 text-teal-500" />, value: "100%", label: "Clinician oversight required" },
              { icon: <Clock className="w-5 h-5 text-emerald-500" />, value: "< 800ms", label: "Autonomous SOAP latency" },
            ].map((f, i) => (
              <div key={i} className="text-center p-2">
                <div className="flex justify-center mb-1.5">{f.icon}</div>
                <p className="text-lg sm:text-xl font-extrabold text-foreground">{f.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Agents Deep Dive ── */}
      <section className="py-16 sm:py-24 bg-muted/20 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {agents.map((agent, i) => (
            <div
              key={agent.id}
              className={`grid lg:grid-cols-12 gap-8 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
            >
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${agent.color} border flex items-center justify-center`}>
                    {agent.icon}
                  </div>
                  <div>
                    <Badge variant="outline" className={`text-[10px] mb-1 font-bold ${agent.badgeColor}`}>
                      {agent.status}
                    </Badge>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">{agent.title}</h2>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-primary font-medium">{agent.subtitle}</p>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{agent.description}</p>

                <div className="pt-2">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">Workflow Process:</h4>
                  <ul className="space-y-1.5">
                    {agent.howItWorks.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="lg:col-span-6">
                <Card className="rounded-2xl border border-border/70 bg-card shadow-md p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border/60">
                    <span className="text-xs font-bold text-foreground">Generated Clinical Deliverables</span>
                    <Badge variant="outline" className="text-[10px] border-border font-mono">
                      Sub-second SLM
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {agent.outputs.map((out, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/40 border border-border/50 text-xs">
                        <Activity className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="font-medium text-foreground">{out}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Human Oversight Principles ── */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Clinical Safety</span>
            <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
              Human-in-the-Loop Clinical Governance
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              DrGodly is engineered with strict ethical and legal safeguards. Autonomous agents assist,
              synthesize, and draft — but licensed clinicians always retain absolute final decision-making power.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {oversightPrinciples.map((p, idx) => (
              <Card key={idx} className="p-5 rounded-2xl bg-card border border-border/70 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center border border-border">
                  {p.icon}
                </div>
                <h3 className="font-bold text-sm sm:text-base text-foreground">{p.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
              </Card>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-600/10 via-blue-500/10 to-teal-500/10 border border-primary/20 text-center space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              Experience DrGodly&apos;s Clinical Agents in Real Time
            </h3>
            <p className="text-xs text-muted-foreground max-w-xl mx-auto">
              Test ambient voice diarization, live SOAP note drafting, and automated FHIR generation in our interactive sandbox.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link href="/signup">
                <Button size="sm" className="rounded-full px-6 bg-primary text-primary-foreground font-semibold">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/screens">
                <Button variant="outline" size="sm" className="rounded-full px-6 border-border font-semibold">
                  Open Interactive Screens
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
