/**
 * TrustLogos — Healthcare interoperability & compliance trust marquee.
 *
 * Layer: client / (marketing) / components
 *
 * Showcases DrGodly's deep interoperability with HL7 FHIR, major EHR networks
 * (Epic, Cerner, athenahealth), and gold-standard healthcare compliance (HIPAA, SOC 2, ABDM).
 */

"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Database, Server, Lock, CheckCircle2, Zap } from "lucide-react";

interface PartnerNetwork {
  name: string;
  tagline: string;
  badge: string;
  iconBg: string;
}

const networks: PartnerNetwork[] = [
  {
    name: "HL7® FHIR® R4",
    tagline: "Core Data Standard",
    badge: "100% Native",
    iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    name: "Epic Systems",
    tagline: "SMART on FHIR Ready",
    badge: "Interoperable",
    iconBg: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  },
  {
    name: "Oracle Health (Cerner)",
    tagline: "EHR Data Exchange",
    badge: "Connected",
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  {
    name: "athenahealth",
    tagline: "API Bridge Protocol",
    badge: "Certified",
    iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  {
    name: "HIPAA BAA",
    tagline: "Zero PHI Leakage",
    badge: "Audited",
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    name: "SOC 2 Type II",
    tagline: "Continuous Assurance",
    badge: "Certified",
    iconBg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  },
  {
    name: "ABDM Health Records",
    tagline: "M1, M2, M3 Milestones",
    badge: "Compliant",
    iconBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
];

export default function TrustLogos() {
  return (
    <section className="py-10 border-y border-border/60 bg-muted/20 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
            Interoperable With Leading EHRs, Open Standards & Compliance Frameworks
          </p>
        </div>

        {/* Responsive Flex Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 items-center justify-center">
          {networks.map((net, i) => (
            <motion.div
              key={net.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              whileHover={{ y: -2, scale: 1.02 }}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-card/70 backdrop-blur-sm border border-border/60 hover:border-primary/30 hover:shadow-md transition-all text-center h-24"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-extrabold text-foreground tracking-tight line-clamp-1">
                  {net.name}
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground font-medium leading-tight">
                {net.tagline}
              </span>
              <span
                className={`mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${net.iconBg}`}
              >
                {net.badge}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
