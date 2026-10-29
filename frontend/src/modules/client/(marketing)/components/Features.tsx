/**
 * Features — six-card bento grid showcasing DrGodly's core FHIR EMR capabilities.
 *
 * Layer: client / (marketing) / components
 *
 * Highlights: FHIR R4 native records, autonomous clinical agents, HIPAA compliance,
 * MCP server integration, ambient scribe consults, and the 3-panel clinical cockpit.
 */

"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  Brain,
  ShieldCheck,
  Server,
  Mic,
  Stethoscope,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Link } from "@/i18n/navigation";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.45, ease: "easeOut" as const } },
};

const features = [
  {
    icon: <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    iconBg: "bg-blue-500/10 border-blue-500/20",
    title: "FHIR R4 Native EMR",
    badge: "HL7 Standard",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    description:
      "Every patient record, appointment, observation, and encounter is stored as a validated HL7 FHIR R4 resource — enterprise-grade interoperability out of the box with zero proprietary lock-in.",
    preview: (
      <div className="mt-3 p-2.5 rounded-xl bg-muted/50 border border-border/60 font-mono text-[11px] space-y-1">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-blue-600 dark:text-blue-400 font-bold">HL7::FHIR_R4_Bundle</span>
          <span className="text-emerald-500 text-[10px]">Validated</span>
        </div>
        <div className="flex flex-wrap gap-1 pt-1">
          <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 text-[10px] font-semibold">Patient/PAT-00241</span>
          <span className="px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-600 text-[10px] font-semibold">Observation/BP</span>
          <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 text-[10px] font-semibold">Encounter/VR</span>
        </div>
      </div>
    ),
  },
  {
    icon: <Mic className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
    iconBg: "bg-amber-500/10 border-amber-500/20",
    title: "Ambient Scribe & WebRTC Audio",
    badge: "Real-Time AI",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    description:
      "High-definition video encounters with real-time ambient transcription. Clinicians maintain natural eye contact while DrGodly generates structured SOAP notes in under 800ms.",
    preview: (
      <div className="mt-3 relative h-28 rounded-xl overflow-hidden border border-border/60">
        <img
          src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80"
          alt="Ambient Clinician Scribing"
          className="w-full h-full object-cover filter brightness-[0.9]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2.5">
          <div className="flex items-center gap-1.5 text-white text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>48 kHz WebRTC • 99.4% CDS Confidence</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: <Stethoscope className="h-5 w-5 text-rose-600 dark:text-rose-400" />,
    iconBg: "bg-rose-500/10 border-rose-500/20",
    title: "3-Panel Clinical Cockpit",
    badge: "Telehealth Suite",
    badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    description:
      "Integrated patient clinical dossier, real-time consultation video, and active Clinical Decision Support (CDS) differential diagnosis with one-click care planning.",
    preview: (
      <div className="mt-3 relative h-28 rounded-xl overflow-hidden border border-border/60">
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80"
          alt="Doctor Telehealth Cockpit"
          className="w-full h-full object-cover filter brightness-[0.9]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2.5">
          <div className="flex items-center justify-between w-full text-white text-[10px] font-mono">
            <span className="bg-blue-600/90 px-1.5 py-0.5 rounded font-bold">Panel: Dossier | Stage | CDS</span>
            <span className="text-emerald-300">1080p 60fps</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: <Brain className="h-5 w-5 text-violet-600 dark:text-violet-400" />,
    iconBg: "bg-violet-500/10 border-violet-500/20",
    title: "Autonomous Clinical Agents",
    badge: "Multi-SLM Pipeline",
    badgeColor: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    description:
      "Intelligent intake agents elicit patient symptoms through guided voice or interactive chat. Parallel SLMs extract SOAP notes, differentials, and FHIR observations.",
    preview: (
      <div className="mt-3 p-2.5 rounded-xl bg-violet-500/5 border border-violet-500/20 space-y-1.5 text-xs">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-bold text-foreground">Intake Agent Triage</span>
          <span className="text-violet-600 dark:text-violet-400 font-mono text-[10px]">Active</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-snug">
          "Patient reports acute dizziness & cephalalgia. Triage priority: Level 2 Urgency."
        </p>
      </div>
    ),
  },
  {
    icon: <Server className="h-5 w-5 text-teal-600 dark:text-teal-400" />,
    iconBg: "bg-teal-500/10 border-teal-500/20",
    title: "Model Context Protocol (MCP)",
    badge: "Agent Interop",
    badgeColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    description:
      "Expose your FHIR EMR securely to Claude, Cursor, and clinical assistants via standard MCP tools. Safely query clinical history, lab ranges, and medication interactions.",
    preview: (
      <div className="mt-3 p-2.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-[10px] space-y-1 border border-slate-800">
        <div className="text-teal-400 font-bold">$ mcp-server-drgodly --fhir-v2.4</div>
        <div className="text-slate-400">&gt; Tool: drgodly_search_observations()</div>
        <div className="text-emerald-400">&gt; Result: 200 OK [BP 118/76, HR 72]</div>
      </div>
    ),
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    title: "HIPAA & SOC 2 BAA Ready",
    badge: "Zero PHI Leakage",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    description:
      "Cryptographic PHI pseudonymization, signed Business Associate Agreements, end-to-end encryption in transit and at rest, and full auditable provenance logs.",
    preview: (
      <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="font-bold text-foreground text-[11px]">AES-256-GCM Encrypted</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">Audit: 100% Pass</span>
      </div>
    ),
  },
];

export default function Features() {
  return (
    <motion.section
      id="features"
      className="py-16 sm:py-24 bg-background relative overflow-hidden border-b border-border/50"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Core Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Designed for Modern Clinical Excellence
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            From pre-visit AI intake to HIPAA-compliant FHIR record persistence, DrGodly handles the
            entire clinical continuum — so practitioners focus on patients, not administrative burdens.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
            >
              <Card className="h-full border border-border/70 bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300 rounded-2xl p-2 group flex flex-col justify-between">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`inline-flex items-center justify-center h-10 w-10 rounded-xl border ${feature.iconBg} transition-transform group-hover:scale-105 duration-300`}>
                      {feature.icon}
                    </div>
                    <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${feature.badgeColor}`}>
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 flex flex-col justify-between flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  {feature.preview}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Cockpit Callout Banner */}
        <motion.div
          variants={itemVariants}
          className="mt-12 sm:mt-14 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-600/10 via-teal-500/10 to-indigo-600/10 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="text-center sm:text-left">
            <h4 className="text-sm sm:text-base font-bold text-foreground">Want to see all 14 clinical & patient screens in action?</h4>
            <p className="text-xs text-muted-foreground mt-0.5">Explore our interactive 3-panel telehealth cockpit, AI intake studio, triage queues, and patient health app.</p>
          </div>
          <Link href="/screens">
            <button className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-md transition-all flex items-center gap-2 shrink-0">
              <span>Open All Screens Showcase</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
