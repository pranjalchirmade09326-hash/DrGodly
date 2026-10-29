/**
 * Hero — primary above-the-fold section for the DrGodly marketing page.
 *
 * Layer: client / (marketing) / components
 *
 * Positions DrGodly as an AI-native, HIPAA-compliant FHIR R4 EMR platform
 * with MCP server integration.
 *
 * Features:
 * - Left column: High-impact headline with subtle medical cyan/emerald gradient,
 *   crisp value prop, dual primary CTAs (Start Free Trial / Explore Live Cockpit),
 *   social proof avatar strip (1,200+ clinicians), and compliance pills.
 * - Right column: Compact, ultra-clean live clinical intelligence cockpit preview
 *   with live tabs (Encounter, AI SOAP, FHIR JSON), 48kHz ambient visualizer,
 *   and real-time status telemetry — engineered with a bounded max-height so it
 *   fits naturally alongside the headline without pushing content below the fold.
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Database,
  Server,
  Brain,
  CheckCircle2,
  Sparkles,
  Code2,
  Activity,
  Volume2,
  Stethoscope,
  HeartPulse,
} from "lucide-react";
import type { AuthResponse } from "@/modules/server/auth/types";

// ── Animation variants ──────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

// ── Mock data for the clinical preview ──────────────────────────────────────

const fhirResources = [
  {
    type: "Patient",
    id: "PAT-00241",
    label: "Louise Reed (30F)",
    status: "Verified",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    detail: "MRN #994821 • DOB: 14/05/1996",
  },
  {
    type: "Observation",
    id: "OBS-03301",
    label: "BP 118/76 mmHg • HR 72 bpm",
    status: "Normal",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    detail: "Normotensive • Regular Sinus Rhythm",
  },
  {
    type: "Condition",
    id: "COND-0492",
    label: "Acute BPPV (ICD-10 H81.10)",
    status: "Active",
    badgeColor: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    detail: "99.4% Differential Match",
  },
];

const mockFhirJson = `{
  "resourceType": "Bundle",
  "id": "drgodly-bundle-00118",
  "type": "transaction",
  "entry": [
    {
      "resource": {
        "resourceType": "Patient",
        "id": "PAT-00241",
        "name": [{ "family": "Reed", "given": ["Louise"] }]
      }
    },
    {
      "resource": {
        "resourceType": "Observation",
        "code": { "coding": [{ "code": "85354-9", "display": "Blood Pressure" }] },
        "valueQuantity": { "value": 118, "unit": "mmHg" }
      }
    }
  ]
}`;

export default function Hero({ session }: { session: AuthResponse | null }) {
  const [activeTab, setActiveTab] = useState<"encounter" | "soap" | "json">("encounter");

  return (
    <section className="relative pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20 overflow-hidden bg-background">
      {/* ── Background Aesthetics: Medical Grid + Ambient Radial Glows ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute -top-24 right-0 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] bg-gradient-to-bl from-teal-400/15 via-blue-500/10 to-transparent rounded-full blur-3xl opacity-80" />
        <div className="absolute -bottom-20 -left-20 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-transparent rounded-full blur-3xl opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* ── Left Column: Value Proposition + CTAs (col-span-6) ── */}
          <div className="lg:col-span-6 xl:col-span-6 text-center lg:text-left">
            {/* Live-status pill */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-semibold backdrop-blur-sm shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
                </span>
                <span>HL7 FHIR R4 Native &middot; HIPAA BAA &middot; Real-Time MCP</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-teal-500/20 font-bold">
                  v2.4
                </span>
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-5xl xl:text-6xl font-extrabold text-foreground tracking-tight leading-[1.12]"
            >
              Healthcare that{" "}
              <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                knows your story.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal"
            >
              DrGodly unifies longitudinal EHR records, ambient multi-modal AI scribing,
              and board-certified clinicians — eliminating clinical documentation burnout
              and turning every patient visit into structured FHIR intelligence.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={itemVariants}
              className="mt-6 flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-3.5"
            >
              {!session ? (
                <>
                  <Link href="/signup" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto rounded-full px-7 h-12 text-base bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/35 transition-all font-semibold border-0"
                    >
                      <span>Start Free Trial</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/screens" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto rounded-full px-6 h-12 text-base border-primary/20 hover:border-primary/40 bg-card/60 backdrop-blur-sm hover:bg-muted/60 font-semibold gap-2 transition-all shadow-2xs"
                    >
                      <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>Explore Live Cockpit</span>
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href={session.session.activeRoleRedirectUrl ?? "/screens"}>
                  <Button
                    size="lg"
                    className="rounded-full px-8 h-12 text-base bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-lg shadow-teal-500/25 font-semibold"
                  >
                    <span>Open Clinical Cockpit</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </motion.div>

            {/* Micro reassurance checklist */}
            <motion.div
              variants={itemVariants}
              className="mt-4 text-xs text-muted-foreground font-medium flex flex-wrap items-center justify-center lg:justify-start gap-x-3.5 gap-y-1"
            >
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Zero PHI Leakage
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                Sub-Second SOAP Generation
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                HL7 FHIR Certified
              </span>
            </motion.div>

            {/* Clinician Social Proof Strip */}
            <motion.div
              variants={itemVariants}
              className="mt-6 pt-5 border-t border-border/60 flex flex-wrap items-center justify-center lg:justify-start gap-3.5"
            >
              <div className="flex -space-x-2">
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-background object-cover"
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=80&q=80"
                  alt="Dr. Sarah Jenkins"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-background object-cover"
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=80&q=80"
                  alt="Dr. Aaron Wright"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-background object-cover"
                  src="https://images.unsplash.com/photo-1594824813628-98e6a147087e?auto=format&fit=crop&w=80&q=80"
                  alt="Dr. Emily Patel"
                />
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary">
                  +1.2k
                </div>
              </div>
              <div className="text-left text-xs text-muted-foreground">
                <div className="flex items-center gap-1 text-amber-500">
                  {"★".repeat(5)}
                  <span className="text-[11px] font-bold text-foreground ml-1">4.9 / 5.0</span>
                </div>
                <span>Trusted by 1,200+ doctors across 40+ specialties</span>
              </div>
            </motion.div>
          </div>

          {/* ── Right Column: Sleek, Compact Live Clinical Cockpit Simulation (col-span-6) ── */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-6 xl:col-span-6 relative w-full"
          >
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              {/* Outer decorative glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 via-blue-500/20 to-violet-500/20 rounded-3xl blur-xl opacity-75 -z-10" />

              {/* Main Cockpit Window Card — Compact & Sleek */}
              <div className="relative bg-card/95 backdrop-blur-xl border border-border/80 rounded-2xl shadow-xl overflow-hidden z-20">
                {/* ── Window Titlebar ── */}
                <div className="px-3.5 py-2.5 border-b border-border bg-muted/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/90" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/90" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/90" />
                    <span className="ml-1.5 text-xs font-mono font-semibold text-foreground/80 hidden sm:inline">
                      DrGodly FHIR Engine v2.4
                    </span>
                  </div>

                  {/* Mode Tabs */}
                  <div className="flex items-center gap-1 p-0.5 rounded-lg bg-background/80 border border-border/60">
                    <button
                      type="button"
                      onClick={() => setActiveTab("encounter")}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        activeTab === "encounter"
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Encounter
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("soap")}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        activeTab === "soap"
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      AI SOAP
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("json")}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        activeTab === "json"
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      FHIR JSON
                    </button>
                  </div>
                </div>

                {/* ── Live Telehealth Ambient Banner ── */}
                <div className="px-3.5 py-2 bg-gradient-to-r from-teal-950/80 via-slate-950 to-blue-950/80 text-white flex items-center justify-between text-xs border-b border-border/40">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="font-semibold text-emerald-400">Live Ambient Stream</span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="text-slate-300 text-[11px] truncate">Dr. Wright & Louise Reed</span>
                  </div>

                  {/* Animated Waveform Visualizer */}
                  <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full border border-white/10 shrink-0">
                    <Volume2 className="w-3 h-3 text-teal-400 mr-1" />
                    <span className="w-0.5 h-3 bg-teal-400 animate-pulse rounded-full" />
                    <span className="w-0.5 h-4 bg-teal-300 animate-pulse delay-75 rounded-full" />
                    <span className="w-0.5 h-2 bg-teal-400 animate-pulse delay-150 rounded-full" />
                    <span className="text-[10px] font-mono text-teal-300 ml-1">48 kHz</span>
                  </div>
                </div>

                {/* ── Tab Content (Compact & Fixed max-height) ── */}
                <div className="p-3.5 sm:p-4 min-h-[260px] max-h-[320px] overflow-y-auto">
                  <AnimatePresence mode="wait">
                    {/* 1. Encounter View */}
                    {activeTab === "encounter" && (
                      <motion.div
                        key="encounter"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-2.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                            Live FHIR R4 Bundle
                          </span>
                          <span className="text-muted-foreground font-mono text-[10px]">3 verified resources</span>
                        </div>

                        {/* Resource list */}
                        <div className="space-y-1.5">
                          {fhirResources.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-muted/40 hover:bg-muted/70 border border-border/60 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-foreground">{item.type}</span>
                                    <span className="text-[10px] font-mono text-muted-foreground">({item.id})</span>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                                </div>
                              </div>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${item.badgeColor}`}
                              >
                                {item.status}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Ambient Clinical Scribe Box */}
                        <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20 space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Brain className="w-3.5 h-3.5 text-primary" />
                              <span className="text-xs font-bold text-foreground">Ambient Clinical Scribe</span>
                            </div>
                            <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                              99.4% Match
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-snug">
                            Chief complaint: positional vertigo with morning headache. Differential: BPPV (ICD-10 H81.10).
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* 2. AI SOAP View */}
                    {activeTab === "soap" && (
                      <motion.div
                        key="soap"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                          <span className="font-bold text-foreground flex items-center gap-1.5 text-xs">
                            <Brain className="w-3.5 h-3.5 text-blue-500" />
                            Autonomous SOAP Note
                          </span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                            &lt; 800ms Latency
                          </span>
                        </div>

                        <div className="space-y-1.5 text-[11px] bg-muted/30 p-2.5 rounded-lg border border-border/50">
                          <div>
                            <span className="font-bold text-primary">S: </span>
                            <span className="text-muted-foreground">
                              30F with 3-day acute positional vertigo tilting head back.
                            </span>
                          </div>
                          <div>
                            <span className="font-bold text-primary">O: </span>
                            <span className="text-muted-foreground">
                              BP 118/76, HR 72. Dix-Hallpike confirms left posterior canal nystagmus.
                            </span>
                          </div>
                          <div>
                            <span className="font-bold text-primary">A: </span>
                            <span className="text-foreground font-semibold">
                              Benign Paroxysmal Positional Vertigo [H81.10].
                            </span>
                          </div>
                          <div>
                            <span className="font-bold text-primary">P: </span>
                            <span className="text-muted-foreground">
                              Epley maneuver completed. Vestibular rehab home exercises advised.
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <Badge variant="outline" className="text-[9px] border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
                            ✓ Ready for Attestation
                          </Badge>
                          <span className="text-[10px] text-muted-foreground font-mono">Dr. Aaron Wright, MD</span>
                        </div>
                      </motion.div>
                    )}

                    {/* 3. FHIR JSON View */}
                    {activeTab === "json" && (
                      <motion.div
                        key="json"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            <Code2 className="w-3.5 h-3.5 text-teal-500" />
                            HL7 FHIR R4 Bundle
                          </span>
                          <span className="text-[9px] font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            US Core 4.0.1
                          </span>
                        </div>

                        <pre className="p-2.5 rounded-lg bg-slate-950 text-slate-200 font-mono text-[10px] leading-tight overflow-x-auto max-h-[160px] border border-slate-800">
                          <code>{mockFhirJson}</code>
                        </pre>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Cockpit Action Footer */}
                <div className="px-3.5 py-2.5 bg-muted/40 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-medium">Ready for Telehealth Visit</span>
                  </div>
                  <Link href="/screens">
                    <Button
                      size="sm"
                      className="text-xs h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1 px-3 shadow-2xs"
                    >
                      <span>Launch Cockpit</span>
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
