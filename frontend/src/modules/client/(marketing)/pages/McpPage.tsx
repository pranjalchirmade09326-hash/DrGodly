/**
 * McpPage — dedicated marketing page explaining the DrGodly MCP Server.
 *
 * Layer: client / (marketing) / pages
 *
 * Covers: what the Model Context Protocol (MCP) is, how DrGodly exposes FHIR
 * resources as AI-callable tools, the full tool registry, developer setup,
 * and HIPAA-scoped cryptographic security.
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import {
  Server,
  Terminal,
  Database,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Plug,
  Code2,
  Activity,
  Layers,
  Copy,
} from "lucide-react";
import type { AuthResponse } from "@/modules/server/auth/types";

const mcpTools = [
  {
    name: "get_patient",
    description: "Retrieve full FHIR Patient resource by ID or MRN identifier",
    returns: "Patient (demographics, contacts, active identifiers)",
    scope: "read:patient",
  },
  {
    name: "list_appointments",
    description: "Query FHIR Appointments by practitioner, date window, or status",
    returns: "Appointment[] (status, period, participants, class)",
    scope: "read:appointment",
  },
  {
    name: "get_intake_summary",
    description: "Retrieve AI-extracted intake Observations and preliminary SOAP note",
    returns: "Observation[], draft SOAP note, differential flags",
    scope: "read:intake",
  },
  {
    name: "get_encounter",
    description: "Fetch completed FHIR Encounter including signed SOAP documentation",
    returns: "Encounter (vitals, diagnoses, attestation proof)",
    scope: "read:encounter",
  },
  {
    name: "create_observation",
    description: "Create new LOINC-coded Observation resource from clinical measurements",
    returns: "Created Observation (id, status, valueQuantity)",
    scope: "write:observation (attested)",
  },
  {
    name: "list_conditions",
    description: "List active SNOMED CT and ICD-10 conditions with confidence rankings",
    returns: "Condition[] (code, severity, onsetDateTime)",
    scope: "read:condition",
  },
];

const sampleConfig = `{
  "mcpServers": {
    "drgodly-fhir-emr": {
      "command": "npx",
      "args": ["-y", "@drgodly/mcp-server"],
      "env": {
        "DRGODLY_API_URL": "https://api.drgodly.com/fhir/r4",
        "DRGODLY_API_KEY": "drg_live_sec_..."
      }
    }
  }
}`;

export function McpPage({ session }: { session: AuthResponse | null }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleConfig);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-20">
      {/* ── Hero ── */}
      <section className="py-16 sm:py-24 bg-background relative overflow-hidden border-b border-border/50">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-bold tracking-wide">
              <Server className="w-3.5 h-3.5" />
              <span>Model Context Protocol (MCP) Integration</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.1]">
              Connect Any AI Agent to Your{" "}
              <span className="bg-gradient-to-r from-teal-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                Live FHIR EMR
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-normal">
              The Model Context Protocol (MCP) is the open industry standard for AI tool execution.
              DrGodly exposes your clinical EMR as a secure, structured tool ecosystem — enabling
              Claude, GPT-4, Cursor, and autonomous agents to safely query and reason over patient data.
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
                  Inspect Live Server Logs
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-5 sm:p-6 rounded-2xl bg-card border border-border/70 shadow-2xs">
            {[
              { icon: <Server className="w-5 h-5 text-teal-500" />, value: "MCP Standard", label: "Open agent protocol" },
              { icon: <Database className="w-5 h-5 text-blue-500" />, value: "6+ Tools", label: "Ready-to-use FHIR tools" },
              { icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />, value: "HIPAA-Scoped", label: "Cryptographic token auth" },
              { icon: <Zap className="w-5 h-5 text-violet-500" />, value: "< 50ms", label: "Tool invocation latency" },
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

      {/* ── MCP Tool Registry ── */}
      <section className="py-16 sm:py-24 bg-muted/20 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Tool Ecosystem</span>
            <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
              Pre-Built FHIR R4 Tool Registry
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Every tool returns strongly typed JSON payloads validated against official HL7 FHIR R4 schemas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mcpTools.map((t, i) => (
              <Card key={i} className="p-5 rounded-2xl bg-card border border-border/70 shadow-2xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">
                      {t.name}()
                    </span>
                    <Badge variant="outline" className="text-[9px] font-mono border-border">
                      {t.scope}
                    </Badge>
                  </div>
                  <p className="text-xs text-foreground font-medium mb-1.5">{t.description}</p>
                  <p className="text-[11px] font-mono text-muted-foreground">
                    Returns: <span className="text-foreground/90">{t.returns}</span>
                  </p>
                </div>

                <div className="pt-2.5 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Type</span>
                  <span className="text-emerald-500 font-bold">HL7 FHIR R4</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Developer Setup ── */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Developer Integration</span>
            <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
              Add DrGodly to Claude Desktop or Cursor in 30 Seconds
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Paste this configuration snippet directly into your MCP configuration file to grant your local AI tools access to the clinical test environment.
            </p>
          </div>

          <div className="max-w-2xl mx-auto rounded-2xl border border-slate-800 bg-slate-950 shadow-xl overflow-hidden font-mono text-xs">
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-teal-400" />
                <span>claude_desktop_config.json</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] hover:text-white transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
            <pre className="p-4 text-slate-200 text-[11px] leading-relaxed overflow-x-auto">
              <code>{sampleConfig}</code>
            </pre>
          </div>

          {/* CTA Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-600/10 via-blue-500/10 to-indigo-600/10 border border-primary/20 text-center space-y-3 max-w-4xl mx-auto">
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              Ready to build clinical AI workflows with MCP?
            </h3>
            <p className="text-xs text-muted-foreground max-w-xl mx-auto">
              Access test patient records, execute mock tool queries, and integrate our FHIR EMR in your local agent sandbox.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link href="/signup">
                <Button size="sm" className="rounded-full px-6 bg-primary text-primary-foreground font-semibold">
                  Get Developer Keys
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
