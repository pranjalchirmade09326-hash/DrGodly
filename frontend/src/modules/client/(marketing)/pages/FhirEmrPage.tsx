/**
 * FhirEmrPage — dedicated marketing page explaining FHIR R4 EMR in DrGodly.
 *
 * Layer: client / (marketing) / pages
 *
 * Covers: what HL7 FHIR R4 is, the core resources used in DrGodly,
 * how clinical workflows map to FHIR resources, and why FHIR-native
 * records are superior to legacy proprietary EMR formats.
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import {
  Database,
  User,
  UserCheck,
  Calendar,
  ClipboardList,
  Activity,
  Pill,
  FileText,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Layers,
  Zap,
  Globe,
  Code2,
  Sparkles,
} from "lucide-react";
import type { AuthResponse } from "@/modules/server/auth/types";

const resources = [
  {
    icon: <User className="w-5 h-5 text-blue-500" />,
    name: "Patient",
    code: "PAT-00241",
    color: "border-blue-500/20 bg-blue-500/5",
    accent: "text-blue-500",
    description:
      "Stores patient demographics, verified identifiers, and telecom contacts. The anchor resource every clinical record links back to.",
    fields: ["identifier (MRN)", "name.family", "birthDate", "telecom", "address"],
    exampleJson: `{\n  "resourceType": "Patient",\n  "id": "PAT-00241",\n  "name": [{ "family": "Reed", "given": ["Louise"] }],\n  "gender": "female",\n  "birthDate": "1996-05-14"\n}`,
  },
  {
    icon: <UserCheck className="w-5 h-5 text-emerald-500" />,
    name: "Practitioner",
    code: "PRAC-00088",
    color: "border-emerald-500/20 bg-emerald-500/5",
    accent: "text-emerald-500",
    description:
      "Clinician credentials, board certifications, medical licenses, and verified digital signatures for attestation.",
    fields: ["qualification", "specialty", "telecom", "licenseNPI", "digitalSignature"],
    exampleJson: `{\n  "resourceType": "Practitioner",\n  "id": "PRAC-00088",\n  "name": [{ "family": "Wright", "given": ["Aaron"], "prefix": ["Dr."] }],\n  "qualification": [{ "code": "MD", "issuer": "State Board" }]\n}`,
  },
  {
    icon: <Calendar className="w-5 h-5 text-violet-500" />,
    name: "Appointment",
    code: "APT-01182",
    color: "border-violet-500/20 bg-violet-500/5",
    accent: "text-violet-500",
    description:
      "Teleconsultation scheduling with real-time FHIR state tracking: booked, arrived, in-progress, fulfilled, cancelled.",
    fields: ["status", "start", "end", "participant", "serviceType", "telehealthRoomId"],
    exampleJson: `{\n  "resourceType": "Appointment",\n  "id": "APT-01182",\n  "status": "fulfilled",\n  "serviceType": [{ "text": "Preventive Cardiology" }]\n}`,
  },
  {
    icon: <ClipboardList className="w-5 h-5 text-amber-500" />,
    name: "Encounter",
    code: "ENC-00118",
    color: "border-amber-500/20 bg-amber-500/5",
    accent: "text-amber-500",
    description:
      "Captures the consultation lifecycle: WebRTC room metadata, duration, diagnostic impressions, and structured SOAP notes.",
    fields: ["status", "class", "subject", "participant", "period", "reasonCode"],
    exampleJson: `{\n  "resourceType": "Encounter",\n  "id": "ENC-00118",\n  "status": "finished",\n  "class": { "code": "VR", "display": "virtual" }\n}`,
  },
  {
    icon: <Activity className="w-5 h-5 text-rose-500" />,
    name: "Observation",
    code: "OBS-03301",
    color: "border-rose-500/20 bg-rose-500/5",
    accent: "text-rose-500",
    description:
      "AI-extracted vitals, quantitative LOINC lab tests, and subjective severity ratings generated from ambient intake.",
    fields: ["status", "code (LOINC)", "subject", "valueQuantity", "effectiveDateTime"],
    exampleJson: `{\n  "resourceType": "Observation",\n  "id": "OBS-03301",\n  "code": { "coding": [{ "system": "http://loinc.org", "code": "85354-9" }] },\n  "valueQuantity": { "value": 118, "unit": "mmHg" }\n}`,
  },
  {
    icon: <Pill className="w-5 h-5 text-cyan-500" />,
    name: "Condition",
    code: "COND-0492",
    color: "border-cyan-500/20 bg-cyan-500/5",
    accent: "text-cyan-500",
    description:
      "Active diagnoses linked directly to SNOMED CT and ICD-10 terminology codes with confidence scoring.",
    fields: ["clinicalStatus", "code (ICD-10 / SNOMED)", "subject", "onsetDateTime", "evidence"],
    exampleJson: `{\n  "resourceType": "Condition",\n  "id": "COND-0492",\n  "code": { "coding": [{ "system": "http://hl7.org/fhir/sid/icd-10", "code": "H81.10" }] },\n  "clinicalStatus": "active"\n}`,
  },
  {
    icon: <FileText className="w-5 h-5 text-indigo-500" />,
    name: "DocumentReference",
    code: "DOC-09941",
    color: "border-indigo-500/20 bg-indigo-500/5",
    accent: "text-indigo-500",
    description:
      "Comprehensive consultation clinical notes, discharge summaries, and patient-facing aftercare instructions.",
    fields: ["status", "type", "subject", "date", "author", "content (Base64/URI)"],
    exampleJson: `{\n  "resourceType": "DocumentReference",\n  "id": "DOC-09941",\n  "status": "current",\n  "type": { "coding": [{ "code": "11488-4", "display": "Consult Note" }] }\n}`,
  },
];

const comparison = [
  {
    aspect: "Data Format",
    fhir: "Standardized HL7 FHIR R4 JSON & XML schemas",
    legacy: "Proprietary database schemas — distinct per vendor",
  },
  {
    aspect: "Interoperability",
    fhir: "Seamlessly exchangeable with any hospital, lab, or payer",
    legacy: "Requires costly custom HL7 v2 / C-CDA middleware bridges",
  },
  {
    aspect: "AI & Agent Integration",
    fhir: "Native tool calling via Model Context Protocol (MCP)",
    legacy: "Fragile PDF parsing, CSV dumps, or optical character recognition",
  },
  {
    aspect: "Regulatory Alignment",
    fhir: "Fully compliant with ONC Cures Act & US Core 6.1.0",
    legacy: "Risk of vendor lock-in and steep data export exit penalties",
  },
];

const fade = {
  hidden: { opacity: 0, y: 15 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4 },
  }),
};

export function FhirEmrPage({ session }: { session: AuthResponse | null }) {
  const [selectedResource, setSelectedResource] = useState<string>("Patient");

  const currentResource = resources.find((r) => r.name === selectedResource) || resources[0];

  return (
    <div className="pt-20">
      {/* ── Hero ── */}
      <section className="py-16 sm:py-24 bg-background relative overflow-hidden border-b border-border/50">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="max-w-3xl space-y-4"
            initial="hidden"
            animate="visible"
            variants={fade}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wide">
              <Database className="w-3.5 h-3.5" />
              <span>HL7 FHIR R4 Native Core</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.1]">
              The Global Standard for{" "}
              <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Open Healthcare Records
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-normal">
              HL7 FHIR R4 is the gold standard for healthcare data exchange. DrGodly eliminates
              proprietary EMR silos by storing every patient record, vital observation, and SOAP
              encounter directly in native, validated FHIR resources.
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
                  Explore Live Cockpit
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Quick Metrics Bar */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-5 sm:p-6 rounded-2xl bg-card border border-border/70 shadow-2xs">
            {[
              { icon: <Globe className="w-5 h-5 text-blue-500" />, label: "Global Interoperability", value: "HL7 FHIR R4" },
              { icon: <Layers className="w-5 h-5 text-teal-500" />, label: "Core Clinical Schemas", value: "7+ Resources" },
              { icon: <Zap className="w-5 h-5 text-violet-500" />, label: "Query Interface", value: "REST + MCP" },
              { icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />, label: "US Regulatory Ready", value: "ONC / ABDM" },
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

      {/* ── Interactive FHIR Resource Explorer ── */}
      <section className="py-16 sm:py-24 bg-muted/20 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Resource Model</span>
            <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
              Interactive FHIR R4 Schema Inspector
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Click a resource below to inspect its schema definition, key clinical fields, and live JSON transaction payload.
            </p>

            {/* Segmented resource buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {resources.map((r) => (
                <button
                  key={r.name}
                  type="button"
                  onClick={() => setSelectedResource(r.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedResource === r.name
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-card text-muted-foreground hover:text-foreground border border-border"
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Resource Viewer */}
          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            {/* Left: Details */}
            <div className="lg:col-span-5 bg-card p-6 rounded-2xl border border-border/70 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center border border-border">
                      {currentResource.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{currentResource.name}</h3>
                      <span className="text-[11px] font-mono text-muted-foreground">{currentResource.code}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                    Validated R4
                  </Badge>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {currentResource.description}
                </p>

                <div className="mt-5 space-y-2">
                  <span className="text-xs font-bold text-foreground block">Key FHIR Attributes:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentResource.fields.map((f, i) => (
                      <span key={i} className="text-[11px] font-mono bg-muted/60 px-2 py-0.5 rounded-md border border-border/50 text-foreground">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                <span>Standard: US Core 6.1.0</span>
                <span className="text-emerald-500 font-bold">100% Interoperable</span>
              </div>
            </div>

            {/* Right: Code Payload */}
            <div className="lg:col-span-7 bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl overflow-hidden font-mono text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400 text-xs">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-teal-400" />
                    <span>{currentResource.name.toLowerCase()}-payload.json</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">Valid HL7 FHIR</span>
                </div>
                <pre className="p-3 text-slate-200 text-[11px] leading-relaxed overflow-x-auto max-h-[280px]">
                  <code>{currentResource.exampleJson}</code>
                </pre>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Directly queryable via DrGodly MCP Server</span>
                <Link href="/mcp" className="text-teal-400 hover:underline">
                  Learn about MCP &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison Section ── */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Why Choose FHIR-Native Over Legacy EMRs?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              A transparent look at open HL7 interoperability versus closed legacy databases.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 overflow-hidden shadow-2xs">
            <div className="grid grid-cols-12 bg-muted/60 p-3.5 text-xs font-bold border-b border-border/70 text-foreground">
              <div className="col-span-4 sm:col-span-3">Capability</div>
              <div className="col-span-4 sm:col-span-5 text-primary">DrGodly (FHIR R4)</div>
              <div className="col-span-4 sm:col-span-4 text-muted-foreground">Legacy Proprietary EMR</div>
            </div>

            {comparison.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 p-3.5 text-xs border-b border-border/50 items-center bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="col-span-4 sm:col-span-3 font-semibold text-foreground">
                  {item.aspect}
                </div>
                <div className="col-span-4 sm:col-span-5 text-foreground flex items-start gap-1.5 pr-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{item.fhir}</span>
                </div>
                <div className="col-span-4 sm:col-span-4 text-muted-foreground flex items-start gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{item.legacy}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600/10 via-teal-500/10 to-indigo-600/10 border border-primary/20 text-center space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              Ready to liberate your clinical data?
            </h3>
            <p className="text-xs text-muted-foreground max-w-xl mx-auto">
              Start your 14-day free trial or open our interactive telehealth studio to test FHIR generation in real time.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link href="/signup">
                <Button size="sm" className="rounded-full px-6 bg-primary text-primary-foreground font-semibold">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/screens">
                <Button variant="outline" size="sm" className="rounded-full px-6 border-border font-semibold">
                  Launch Cockpit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
