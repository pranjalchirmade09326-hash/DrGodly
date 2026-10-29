/**
 * HipaaPage — dedicated marketing page explaining DrGodly's HIPAA compliance.
 *
 * Layer: client / (marketing) / pages
 *
 * Covers: what HIPAA requires, how DrGodly implements each safeguard,
 * PHI handling policies, encryption standards, BAA availability,
 * and immutable cryptographic audit trails.
 */

"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import {
  ShieldCheck,
  Lock,
  Eye,
  ClipboardList,
  Server,
  Users,
  KeyRound,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Database,
  FileLock2,
} from "lucide-react";
import type { AuthResponse } from "@/modules/server/auth/types";

const safeguards = [
  {
    icon: <Lock className="w-5 h-5 text-blue-500" />,
    color: "bg-blue-500/10 border-blue-500/20",
    title: "Technical Safeguards",
    badge: "Encryption & Auth",
    points: [
      "TLS 1.3 encryption across all network transit",
      "AES-256 encryption at rest with automated key rotation",
      "Automatic session timeouts & MFA enforcement",
      "Hardware-backed token signing for clinician attestation",
    ],
  },
  {
    icon: <Server className="w-5 h-5 text-emerald-500" />,
    color: "bg-emerald-500/10 border-emerald-500/20",
    title: "Physical Safeguards",
    badge: "SOC 2 Infrastructure",
    points: [
      "Hosted on SOC 2 Type II certified cloud data centers",
      "Isolated single-tenant DB schemas per clinical organization",
      "Zero sensitive PHI cached on client local storage",
      "Geographically redundant backups with daily restore tests",
    ],
  },
  {
    icon: <Users className="w-5 h-5 text-violet-500" />,
    color: "bg-violet-500/10 border-violet-500/20",
    title: "Administrative Safeguards",
    badge: "Governance & BAA",
    points: [
      "Granular Role-Based Access Control (RBAC)",
      "Strict minimum-necessary access authorization policies",
      "Executed Business Associate Agreements (BAA)",
      "Annual third-party security audits and penetration tests",
    ],
  },
  {
    icon: <ClipboardList className="w-5 h-5 text-teal-500" />,
    color: "bg-teal-500/10 border-teal-500/20",
    title: "Audit & Provenance",
    badge: "Immutable Logs",
    points: [
      "Every PHI view, edit, and export is timestamped",
      "Cryptographically sealed audit trail storage",
      "All SLM prompts & doctor approvals logged permanently",
      "Instant compliance export package for OCR audits",
    ],
  },
];

const phiPractices = [
  {
    title: "Minimum Necessary Principle",
    description: "Only the exact clinical parameters needed for diagnostic reasoning are decrypted in active memory during an encounter.",
  },
  {
    title: "Zero Third-Party Training",
    description: "Your organization's patient data is strictly quarantined and never used to train public foundation models.",
  },
  {
    title: "Local De-Identification Pipeline",
    description: "Sensitive patient identifiers (names, MRNs, phone numbers) are pseudonymized locally prior to any SLM reasoning.",
  },
  {
    title: "Guaranteed Data Sovereignty",
    description: "Records remain stored in your selected jurisdiction (US East/West or EU) with automated geo-fencing policies.",
  },
];

export function HipaaPage({ session }: { session: AuthResponse | null }) {
  return (
    <div className="pt-20">
      {/* ── Hero ── */}
      <section className="py-16 sm:py-24 bg-background relative overflow-hidden border-b border-border/50">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>HIPAA Compliance & Privacy Guarantee</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.1]">
              Enterprise Healthcare Security{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-500 bg-clip-text text-transparent">
                Engineered Into Every Layer
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-normal">
              Healthcare data requires uncompromising protection. DrGodly satisfies every
              HIPAA Privacy, Security, and Breach Notification safeguard — backed by signed
              Business Associate Agreements (BAA) and end-to-end cryptographic encryption.
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
                  Inspect Live Audit Trail
                </Button>
              </Link>
            </div>
          </div>

          {/* Stat row */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-5 sm:p-6 rounded-2xl bg-card border border-border/70 shadow-2xs">
            {[
              { icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />, value: "HIPAA Ready", label: "Full BAA execution" },
              { icon: <Lock className="w-5 h-5 text-blue-500" />, value: "AES-256", label: "Data at rest & transit" },
              { icon: <KeyRound className="w-5 h-5 text-violet-500" />, value: "RBAC + MFA", label: "Strict access control" },
              { icon: <FileCheck className="w-5 h-5 text-teal-500" />, value: "Zero Leakage", label: "No AI training on PHI" },
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

      {/* ── Safeguards Grid ── */}
      <section className="py-16 sm:py-24 bg-muted/20 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Compliance Architecture</span>
            <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
              The Four HIPAA Safeguard Pillars
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              DrGodly doesn&apos;t treat compliance as an afterthought. Every database schema, WebSocket stream,
              and AI inference container is strictly isolated to enforce regulatory boundaries.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {safeguards.map((sg, i) => (
              <Card key={i} className="rounded-2xl border border-border/70 bg-card shadow-2xs p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-background flex items-center justify-center border border-border">
                      {sg.icon}
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono border-border">
                      {sg.badge}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-3">{sg.title}</h3>
                  <ul className="space-y-2">
                    {sg.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground leading-snug">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Standard</span>
                  <span className="text-emerald-500 font-bold">✓ Enforced</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Strict PHI Handling Policy ── */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Data Governance</span>
            <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
              Our Cryptographic PHI Handling Covenant
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              We uphold the highest standard of patient dignity and privacy. Here is our unambiguous commitment to your organization.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {phiPractices.map((prac, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-card border border-border/70 shadow-2xs space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <h3 className="font-bold text-sm sm:text-base text-foreground">{prac.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-6">
                  {prac.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600/10 via-teal-500/10 to-blue-500/10 border border-primary/20 text-center space-y-3 max-w-4xl mx-auto">
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              Request Our HIPAA Business Associate Agreement (BAA)
            </h3>
            <p className="text-xs text-muted-foreground max-w-xl mx-auto">
              Ready to deploy DrGodly in your clinical practice or hospital network? We provide standard or custom BAAs during enterprise onboarding.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link href="/signup">
                <Button size="sm" className="rounded-full px-6 bg-primary text-primary-foreground font-semibold">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/screens">
                <Button variant="outline" size="sm" className="rounded-full px-6 border-border font-semibold">
                  View Security Cockpit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
