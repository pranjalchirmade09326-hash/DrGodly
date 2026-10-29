/**
 * HowItWorks — animated timeline explaining the AI FHIR clinical workflow.
 *
 * Layer: client / (marketing) / components
 *
 * Shows the five-step journey from patient intake through FHIR record
 * finalization, emphasizing AI automation and interoperability at each stage.
 */

"use client";

import { motion } from "framer-motion";
import { CheckCircle2, UserCheck, Database, ClipboardList, Mic, FileText, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// ── Animation variants ──────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

// ── Workflow steps ──────────────────────────────────────────────────────────

const steps = [
  {
    number: "01",
    icon: <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    title: "Patient Self-Registers & Schedules",
    badge: "Patient Portal",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    description:
      "Patients register, securely verify insurance, and schedule teleconsultations with board-certified physicians in under two minutes via self-service portal.",
  },
  {
    number: "02",
    icon: <Mic className="w-5 h-5 text-violet-600 dark:text-violet-400" />,
    title: "Autonomous AI Intake & Triage",
    badge: "Clinical SLM",
    badgeColor: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    description:
      "Guided multi-modal intake agent elicits symptoms via voice or text. Real-time NLP extracts standardized FHIR Observations, red flags, and pain ratings.",
  },
  {
    number: "03",
    icon: <ClipboardList className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
    title: "Clinician Pre-Consultation Review",
    badge: "Clinical Decision Support",
    badgeColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    description:
      "The physician enters the cockpit with pre-synthesized differential diagnoses, past medical history, and recommended tests before the call even connects.",
  },
  {
    number: "04",
    icon: <Mic className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    title: "Live Consult with Ambient Scribing",
    badge: "Real-Time WebRTC",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    description:
      "Doctor and patient converse naturally over encrypted HD video. DrGodly ambiently transcribes the dialogue into a structured, editable SOAP clinical note.",
  },
  {
    number: "05",
    icon: <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    title: "FHIR R4 Finalization & e-Prescription",
    badge: "Interoperable EMR",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    description:
      "With one clinician review and cryptographic signature, FHIR Encounter and DiagnosticReport resources are committed, e-Rx sent, and MCP server updated.",
  },
];

// ── Component ──────────────────────────────────────────────────────────────

/**
 * Animated alternating-side timeline showing the FHIR clinical AI workflow.
 */
export default function HowItWorks() {
  return (
    <motion.section
      id="how-it-works"
      className="py-20 sm:py-28 bg-background overflow-hidden relative"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={containerVariants}
    >
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step-by-Step Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            The AI FHIR Clinical Workflow
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            From the initial patient intake to standardized FHIR record generation, DrGodly
            automates documentation at every phase of the patient encounter.
          </p>
        </motion.div>

        <div className="relative mt-12 sm:mt-16">
          {/* Vertical timeline line */}
          <motion.div
            className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-border rounded-full lg:left-1/2 lg:-translate-x-1/2"
            style={{ originY: 0 }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="absolute top-0 bottom-0 w-full bg-gradient-to-b from-primary/40 via-primary to-primary/40 opacity-70" />
          </motion.div>

          <motion.div
            className="relative flex flex-col items-start gap-y-10 sm:gap-y-14"
            variants={containerVariants}
          >
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`w-full flex items-start gap-4 sm:gap-6 lg:w-1/2 ${
                    isEven
                      ? "lg:self-start lg:pr-12"
                      : "lg:self-end lg:flex-row-reverse lg:pl-12"
                  }`}
                >
                  {/* Step circle */}
                  <motion.div
                    className="relative z-10 shrink-0"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-card border-2 sm:border-4 border-primary/25 rounded-2xl sm:rounded-full flex items-center justify-center shadow-lg shadow-primary/10 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors" />
                      <span className="text-base sm:text-xl font-black text-primary relative z-10">
                        {step.number}
                      </span>
                    </div>
                  </motion.div>

                  {/* Step card */}
                  <div className={`flex-1 ${!isEven ? "lg:text-right" : ""}`}>
                    <div className="p-4 sm:p-5 rounded-2xl bg-card/70 backdrop-blur-xs border border-border/70 hover:border-primary/40 transition-all shadow-xs">
                      <div
                        className={`flex flex-wrap items-center gap-2 mb-2 ${
                          !isEven ? "lg:justify-end" : ""
                        }`}
                      >
                        <h3 className="text-base sm:text-lg font-bold text-foreground">
                          {step.title}
                        </h3>
                        <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${step.badgeColor}`}>
                          {step.badge}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
