/**
 * MetricsRibbon — compact, single-row horizontal metrics and interoperability banner.
 *
 * Layer: client / (marketing) / components
 *
 * Positions key quantitative performance metrics (documentation reduction,
 * inference latency, FHIR standard conformity, HIPAA security) in a cohesive,
 * modern glassmorphic strip directly below the Hero.
 */

"use client";

import { motion } from "framer-motion";
import { FileText, Sparkles, Database, ShieldCheck, CheckCircle2 } from "lucide-react";

const metrics = [
  {
    value: "85%",
    label: "Less Clinical Documentation Time",
    trend: "↓ 4.2x Faster SOAP",
    icon: <FileText className="w-4 h-4 text-blue-500" />,
    accent: "border-blue-500/20 hover:border-blue-500/40",
    gradient: "from-blue-500/10 to-transparent",
  },
  {
    value: "< 800ms",
    label: "Autonomous Clinical SLM Inference",
    trend: "Sub-Second Latency",
    icon: <Sparkles className="w-4 h-4 text-violet-500" />,
    accent: "border-violet-500/20 hover:border-violet-500/40",
    gradient: "from-violet-500/10 to-transparent",
  },
  {
    value: "100%",
    label: "HL7 FHIR R4 Interoperability",
    trend: "Zero Proprietary Lock-In",
    icon: <Database className="w-4 h-4 text-teal-500" />,
    accent: "border-teal-500/20 hover:border-teal-500/40",
    gradient: "from-teal-500/10 to-transparent",
  },
  {
    value: "SOC 2 & BAA",
    label: "HIPAA Compliant Infrastructure",
    trend: "Zero PHI Leakage",
    icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
    accent: "border-emerald-500/20 hover:border-emerald-500/40",
    gradient: "from-emerald-500/10 to-transparent",
  },
];

const standards = [
  "HL7 FHIR R4 Native",
  "SNOMED CT International",
  "LOINC Laboratory Terms",
  "Model Context Protocol (MCP)",
  "US Core STU4 & ABDM M1",
  "HIPAA BAA Cryptographic Privacy",
];

export default function MetricsRibbon() {
  return (
    <section className="relative py-8 sm:py-10 bg-muted/20 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {metrics.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className={`p-3.5 sm:p-4 rounded-xl bg-card/80 backdrop-blur-xs border ${metric.accent} bg-gradient-to-br ${metric.gradient} shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="w-7 h-7 rounded-lg bg-background/80 flex items-center justify-center border border-border/60">
                  {metric.icon}
                </div>
                <span className="text-[10px] font-mono font-bold text-muted-foreground bg-background/80 px-2 py-0.5 rounded-md border border-border/50">
                  {metric.trend}
                </span>
              </div>
              <div className="mt-2.5">
                <p className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  {metric.value}
                </p>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 leading-snug">
                  {metric.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Standards Ticker Row */}
        <div className="mt-6 pt-5 border-t border-border/40 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/70">
            Certified Interoperability:
          </span>
          {standards.map((std, i) => (
            <div key={i} className="inline-flex items-center gap-1.5 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>{std}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
