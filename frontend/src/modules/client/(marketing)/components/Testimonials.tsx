/**
 * Testimonials — repurposed as the HIPAA Security & Compliance trust section.
 *
 * Layer: client / (marketing) / components
 *
 * Displays four compliance pillars (HIPAA, FHIR R4, SOC 2, Zero PHI Leakage)
 * alongside clinical trust metrics to reassure healthcare providers evaluating DrGodly.
 */

"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Database,
  Lock,
  ClipboardList,
  Eye,
  CheckCircle2,
} from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const compliancePillars = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
    title: "HIPAA Compliant",
    badge: "BAA Ready",
    badgeColor: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    points: [
      "Signed Business Associate Agreements (BAA)",
      "AES-256 encryption at rest and TLS 1.3 in transit",
      "Strict role-based access control (RBAC)",
    ],
  },
  {
    icon: <Database className="w-6 h-6 text-blue-500" />,
    title: "HL7 FHIR R4 Native",
    badge: "Interoperability",
    badgeColor: "border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/10",
    points: [
      "Patient, Practitioner, Encounter, Observation",
      "Condition, MedicationRequest, DiagnosticReport",
      "Standard FHIR REST & GraphQL interfaces",
    ],
  },
  {
    icon: <Lock className="w-6 h-6 text-violet-500" />,
    title: "Zero PHI Leakage",
    badge: "Data Privacy",
    badgeColor: "border-violet-500/30 text-violet-600 dark:text-violet-400 bg-violet-500/10",
    points: [
      "Local de-identification & redaction pipeline",
      "Zero training on protected patient records",
      "Isolated tenant databases with VPC peering",
    ],
  },
  {
    icon: <ClipboardList className="w-6 h-6 text-teal-500" />,
    title: "SOC 2 Type II Certified",
    badge: "Enterprise Security",
    badgeColor: "border-teal-500/30 text-teal-600 dark:text-teal-400 bg-teal-500/10",
    points: [
      "Immutable cryptographic audit trails",
      "Continuous intrusion detection & SIEM",
      "Daily disaster recovery & automated failover",
    ],
  },
];

// ── Verified Clinician Testimonials ──────────────────────────────────────────

const clinicianTestimonials = [
  {
    name: "Dr. Alexander Wright, MD",
    role: "Cardiologist & Clinical Lead",
    institution: "Apex Health Alliance",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80",
    quote:
      "DrGodly's ambient scribing has cut my documentation time from 2 hours a night to under 15 minutes. The SOAP notes capture subtle differential diagnoses accurately, and the FHIR bundle links straight to our hospital records.",
    metric: "↓ 85% Charting Overhead",
    rating: 5,
  },
  {
    name: "Dr. Sarah Jenkins, MD",
    role: "Chief Medical Officer",
    institution: "Metro Telehealth Network",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80",
    quote:
      "Having an EMR that is natively FHIR R4 is game-changing. We have zero vendor lock-in. Our doctors maintain genuine patient eye contact during virtual consults while DrGodly handles all clinical coding.",
    metric: "4.2x Faster Turnaround",
    rating: 5,
  },
  {
    name: "Dr. Elena Rostova, MD",
    role: "Director of Urgent Care & Telemedicine",
    institution: "St. Jude Regional Healthcare",
    avatar: "https://images.unsplash.com/photo-1594824813628-98e6a147087e?auto=format&fit=crop&w=150&q=80",
    quote:
      "The pre-visit AI intake agent alone saves our clinical staff 10 minutes per encounter. Patients love the natural conversation, and I get pre-computed vital trends before the patient even connects.",
    metric: "99.4% CDS Confidence",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="trust" className="py-16 sm:py-24 bg-muted/20 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold tracking-wide mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Clinician Trust & Enterprise Security</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
            Loved by Doctors. Trusted by Hospitals.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            See how forward-thinking health systems eliminate clinical burnout, maintain 100% HIPAA compliance, and liberate doctors from administrative burden.
          </p>
        </motion.div>

        {/* ── Clinician Reviews Grid ── */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {clinicianTestimonials.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-card border border-border/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-500 text-sm">
                    {"★".repeat(review.rating)}
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {review.metric}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground italic leading-relaxed mb-6">
                  "{review.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border/60">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/20"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">{review.name}</h4>
                  <p className="text-[11px] text-muted-foreground">{review.role}</p>
                  <p className="text-[10px] font-mono text-primary font-semibold">{review.institution}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Subtitle for Compliance Pillars ── */}
        <div className="text-center mb-8">
          <h3 className="text-lg sm:text-xl font-bold text-foreground">
            Enterprise Security & Interoperability Architecture
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Built from day one to exceed the highest regulatory benchmarks in modern healthcare.
          </p>
        </div>

        {/* ── Compliance Pillars Grid ── */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {compliancePillars.map((pillar, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="h-full border border-border/70 bg-card hover:shadow-lg transition-all rounded-2xl flex flex-col justify-between">
                <CardContent className="pt-5 pb-5 px-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center border border-border/70">
                      {pillar.icon}
                    </div>
                    <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${pillar.badgeColor}`}>
                      {pillar.badge}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground mb-3">{pillar.title}</h3>
                    <ul className="space-y-2">
                      {pillar.points.map((pt, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground leading-snug">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
