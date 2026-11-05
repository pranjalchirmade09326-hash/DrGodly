/**
 * ClinicalPipelineSection — visual 4-stage data pipeline for the DrGodly marketing page.
 *
 * Layer: client / (marketing) / components
 *
 * Demonstrates the event-driven clinical continuum:
 * 1. Ambient Input (Multi-channel audio & teleconsult)
 * 2. FHIR Event Bus (Microsecond event broker)
 * 3. Context Engine & Clinical SLMs (Parallel entity extraction & medical RAG)
 * 4. Clinician Attestation ("AI proposes; clinicians dispose")
 */

"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import {
  Mic,
  Zap,
  Brain,
  ShieldCheck,
  ArrowRight,
  Database,
  Radio,
  FileCheck2,
} from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Ambient Input",
    badge: "1080p WebRTC",
    icon: <Mic className="w-5 h-5 text-blue-500" />,
    color: "border-blue-500/20 bg-blue-500/5",
    description:
      "Multi-channel acoustic recording captures natural clinician-patient dialogue with zero physical keyboard distraction.",
  },
  {
    step: "02",
    title: "FHIR Event Bus",
    badge: "Kafka / NATS",
    icon: <Zap className="w-5 h-5 text-teal-500" />,
    color: "border-teal-500/20 bg-teal-500/5",
    description:
      "Diarized conversational chunks stream to high-throughput event brokers with sub-millisecond propagation latency.",
  },
  {
    step: "03",
    title: "Clinical SLMs & RAG",
    badge: "< 800ms Inference",
    icon: <Brain className="w-5 h-5 text-violet-500" />,
    color: "border-violet-500/20 bg-violet-500/5",
    description:
      "Parallel small language models extract ICD-10, LOINC codes, and cross-reference ACC/AHA, GINA, and ADA clinical guidelines.",
  },
  {
    step: "04",
    title: "Clinician Attestation",
    badge: "Human-in-the-Loop",
    icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
    color: "border-emerald-500/20 bg-emerald-500/5",
    description:
      "“AI proposes; clinicians dispose.” Doctors validate pre-drafted SOAP notes and commit cryptographically signed FHIR records.",
  },
];

export default function ClinicalPipelineSection() {
  return (
    <section className="py-16 sm:py-24 bg-muted/20 relative overflow-hidden border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-bold tracking-wide shadow-2xs">
              <Radio className="w-3.5 h-3.5 text-teal-500 animate-pulse" />
              <span>Event-Driven Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight">
              The Real-Time Clinical Data Pipeline
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              From raw acoustic conversational dialogue to cryptographically verified,
              interoperable HL7 FHIR R4 records — fully automated in under one second.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3.5 py-1.5 rounded-xl bg-card border border-border/80 text-xs font-semibold shadow-2xs">
              <span className="text-emerald-500 font-bold mr-1.5">70% Fewer</span>
              <span className="text-muted-foreground">Manual Clicks</span>
            </div>
            <Link href="/screens">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-xl shadow-2xs h-9">
                <span>View Full Telemetry</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Steps Horizontal Connected Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
          {steps.map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.45 }}
              className={`p-5 rounded-2xl bg-card border ${s.color} shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-xl bg-background flex items-center justify-center border border-border/70 group-hover:scale-105 transition-transform">
                    {s.icon}
                  </div>
                  <span className="text-xs font-mono font-black text-muted-foreground/60">
                    STAGE {s.step}
                  </span>
                </div>

                <Badge variant="outline" className="text-[11px] font-mono mb-2 border-border/60">
                  {s.badge}
                </Badge>

                <h3 className="text-base font-bold text-foreground mb-2">
                  {s.title}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {s.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-semibold text-foreground/80">Automated</span>
                <span className="text-emerald-500 font-bold">✓ Ready</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
