/**
 * FhirEmrSection — dedicated FHIR EMR interoperability showcase section.
 *
 * Layer: client / (marketing) / components
 *
 * Highlights the HL7 FHIR R4 resource model powering DrGodly's electronic
 * medical records layer and presents the clear advantage of open FHIR standards
 * over legacy proprietary EMR systems (Epic, Cerner, Allscripts).
 */

"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
} from "lucide-react";

// ── FHIR resource cards ─────────────────────────────────────────────────────

const fhirResources = [
  {
    icon: <User className="w-4 h-4 text-blue-500" />,
    resource: "Patient",
    color: "bg-blue-500/10 border-blue-500/20",
    description: "Complete demographic and contact information for every patient.",
  },
  {
    icon: <UserCheck className="w-4 h-4 text-emerald-500" />,
    resource: "Practitioner",
    color: "bg-emerald-500/10 border-emerald-500/20",
    description: "Verified clinician profiles, credentials, specialties, and scheduling data.",
  },
  {
    icon: <Calendar className="w-4 h-4 text-violet-500" />,
    resource: "Appointment",
    color: "bg-violet-500/10 border-violet-500/20",
    description: "Bookings with FHIR status codes: booked, fulfilled, cancelled, no-show.",
  },
  {
    icon: <ClipboardList className="w-4 h-4 text-amber-500" />,
    resource: "Encounter",
    color: "bg-amber-500/10 border-amber-500/20",
    description: "Clinical encounters created on consultation completion with full SOAP notes.",
  },
  {
    icon: <Activity className="w-4 h-4 text-rose-500" />,
    resource: "Observation",
    color: "bg-rose-500/10 border-rose-500/20",
    description: "AI-extracted vitals, symptoms, and LOINC clinical measurements from intake.",
  },
  {
    icon: <Pill className="w-4 h-4 text-cyan-500" />,
    resource: "Condition",
    color: "bg-cyan-500/10 border-cyan-500/20",
    description: "Diagnoses and conditions linked directly to SNOMED CT terminology codes.",
  },
  {
    icon: <FileText className="w-4 h-4 text-indigo-500" />,
    resource: "DocumentReference",
    color: "bg-indigo-500/10 border-indigo-500/20",
    description: "Clinical documents, discharge summaries, and automated intake reports.",
  },
];

// ── Comparison: FHIR vs. Proprietary ─────────────────────────────────────

const fhirAdvantages = [
  { pro: "Interoperability with any FHIR-compatible system worldwide", con: "Vendor lock-in — patient data trapped in proprietary silos" },
  { pro: "AI agents query structured resources natively via MCP", con: "AI must scrape fragile PDF reports or flat CSV dumps" },
  { pro: "HIPAA-aligned data model with standardized fields", con: "Compliance requires expensive custom middleware bridges" },
  { pro: "Vibrant ecosystem of FHIR apps, SDKs, and validators", con: "Closed APIs requiring expensive annual integration contracts" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function FhirEmrSection() {
  return (
    <section id="fhir-emr" className="py-16 sm:py-24 bg-muted/20 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
            <Database className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">HL7 FHIR R4 Interoperability</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
            Electronic Medical Records Powered by FHIR
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Every piece of clinical data in DrGodly — from patient demographics to
            AI-generated observations — is stored as a validated HL7 FHIR R4 resource,
            enabling true interoperability with any hospital or health system.
          </p>
        </motion.div>

        {/* FHIR resource grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {fhirResources.map((res, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className={`border ${res.color} bg-card hover:shadow-md transition-shadow rounded-2xl h-full flex flex-col justify-between`}>
                <CardContent className="pt-4 pb-4 px-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-background flex items-center justify-center border border-border/70">
                      {res.icon}
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono border-border/60">
                      {res.resource}
                    </Badge>
                  </div>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug">
                    {res.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Plus more card */}
          <motion.div variants={itemVariants}>
            <Card className="border border-dashed border-border/70 bg-card/40 rounded-2xl h-full flex flex-col items-center justify-center text-center p-4 min-h-[100px]">
              <Database className="w-5 h-5 text-muted-foreground/40 mb-1" />
              <p className="text-xs font-semibold text-muted-foreground">
                + Condition, Medication, DiagnosticReport
              </p>
            </Card>
          </motion.div>
        </motion.div>

        {/* FHIR vs. proprietary comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-6">
            Why FHIR EMR vs. Legacy Proprietary EMRs?
          </h3>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {/* FHIR column */}
            <Card className="border-primary/20 bg-primary/5 rounded-2xl">
              <CardContent className="pt-5 pb-5 px-5 space-y-3.5">
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-bold text-foreground text-sm sm:text-base">DrGodly — FHIR R4 Native</span>
                </div>
                <ul className="space-y-2.5">
                  {fhirAdvantages.map((adv, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-foreground/90">{adv.pro}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Proprietary column */}
            <Card className="border-border/60 bg-muted/30 rounded-2xl">
              <CardContent className="pt-5 pb-5 px-5 space-y-3.5">
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center border border-border">
                    <XCircle className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="font-bold text-muted-foreground text-sm sm:text-base">Legacy Proprietary EMR</span>
                </div>
                <ul className="space-y-2.5">
                  {fhirAdvantages.map((adv, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{adv.con}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
