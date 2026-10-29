/**
 * McpSection — dedicated section highlighting the DrGodly MCP Server integration.
 *
 * Layer: client / (marketing) / components
 *
 * Explains how the Model Context Protocol (MCP) server exposes the FHIR EMR
 * as a structured AI tool, enabling AI assistants (e.g., Claude, Cursor, ChatGPT)
 * to safely query patient records, clinical encounters, and lab observations.
 */

"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Server,
  Terminal,
  CheckCircle2,
  Database,
  Brain,
  Shield,
  Zap,
} from "lucide-react";

const capabilities = [
  {
    icon: <Database className="w-4 h-4 text-primary shrink-0" />,
    text: "Query FHIR Patient, Appointment, Observation, and Encounter resources",
  },
  {
    icon: <Brain className="w-4 h-4 text-primary shrink-0" />,
    text: "Connect Claude, GPT-4, or any MCP-compatible AI agent to your live clinical records",
  },
  {
    icon: <Shield className="w-4 h-4 text-primary shrink-0" />,
    text: "All tool calls are HIPAA-scoped with cryptographic token validation — zero PHI leakage",
  },
  {
    icon: <Zap className="w-4 h-4 text-primary shrink-0" />,
    text: "Real-time FHIR resource generation via AI tool calls — zero manual keyboard data entry",
  },
];

const terminalLogs = [
  { prefix: "[INIT]", text: "DrGodly MCP Server v2.4 started on port 3100", color: "text-muted-foreground" },
  { prefix: "[FHIR]", text: "HL7 FHIR R4 base URL registered as MCP tool context", color: "text-blue-400" },
  { prefix: "[AUTH]", text: "HIPAA-scoped JWT session validated for clinic-0028", color: "text-emerald-400" },
  { prefix: "[TOOL]", text: "get_patient_by_id(PAT-00241) → Louise Reed returned", color: "text-teal-400" },
  { prefix: "[TOOL]", text: "list_observations(PAT-00241) → BP 118/76, HR 72", color: "text-teal-400" },
  { prefix: "[SLM] ", text: "Clinical Agent: Generating SOAP differential for BPPV...", color: "text-violet-400" },
  { prefix: "[FHIR]", text: "Condition resource created → fhir_id: COND-0492 [H81.10]", color: "text-emerald-400" },
  { prefix: "[SIGN]", text: "Dr. Aaron Wright cryptographic signature committed.", color: "text-emerald-400" },
];

export default function McpSection() {
  return (
    <section id="mcp" className="py-16 sm:py-24 bg-background overflow-hidden border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-bold tracking-wide mb-3">
            <Server className="w-3.5 h-3.5 text-teal-500" />
            <span>Developer & AI Agent Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
            Your FHIR EMR as an AI Tool
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            DrGodly ships with a production-grade{" "}
            <span className="text-foreground font-semibold">Model Context Protocol (MCP) server</span>{" "}
            — turning your entire clinical record system into structured, callable tools
            for modern frontier AI models.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left: capabilities */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-5"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
              Direct Interop for AI Agents
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Instead of forcing AI agents to parse messy screen scrapes or flat PDFs,
              DrGodly exposes type-safe MCP tools backed directly by HL7 FHIR R4 database entities.
            </p>

            <div className="space-y-3 pt-2">
              {capabilities.map((cap, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/70 shadow-2xs"
                >
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    {cap.icon}
                  </div>
                  <span className="text-xs sm:text-sm text-foreground/90 leading-snug">{cap.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: mock terminal simulation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7"
          >
            <div className="rounded-2xl border border-slate-800 bg-slate-950 shadow-xl overflow-hidden font-mono text-xs">
              {/* Terminal header */}
              <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-slate-400 text-xs font-semibold">
                    drgodly-mcp-server &bull; bash
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>LISTENING ON PORT 3100</span>
                </div>
              </div>

              {/* Terminal body */}
              <div className="p-4 sm:p-5 space-y-2 text-[11px] leading-relaxed max-h-[300px] overflow-y-auto">
                {terminalLogs.map((log, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-slate-500 select-none shrink-0">{log.prefix}</span>
                    <span className={log.color}>{log.text}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1 text-slate-500 pt-1">
                  <span>❯</span>
                  <span className="w-2 h-4 bg-teal-400 animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
