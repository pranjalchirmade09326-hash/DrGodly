/**
 * Footer — site-wide footer for the DrGodly marketing pages.
 *
 * Layer: client / (marketing) / components
 *
 * Brand column plus two link columns. Every link resolves to a route that
 * actually exists and goes through next-intl's <Link>, so it carries the
 * active locale: the previous version mixed raw href="/fhir-emr" (no locale
 * prefix — a hard navigation that dropped the user out of the i18n routing
 * tree) with href="#" placeholders for Company/Legal columns, which rendered
 * as clickable-but-dead links.
 */

"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { DrGodlyLogo } from "@/components/shared/DrGodlyLogo";

const PRODUCT_LINKS = [
  { label: "FHIR EMR", href: "/fhir-emr" },
  { label: "AI Clinical Agents", href: "/ai-agents" },
  { label: "MCP Server", href: "/mcp" },
  { label: "How It Works", href: "/how-it-works" },
] as const;

const EXPLORE_LINKS = [
  { label: "Interactive demo", href: "/screens" },
  { label: "Security & HIPAA", href: "/hipaa" },
] as const;

const START_LINKS = [
  { label: "Create account", href: "/signup" },
  { label: "Sign in", href: "/login" },
] as const;

/** Marketing page footer with compliance trust badges and navigation links. */
export default function Footer() {
  return (
    <motion.footer
      className="bg-secondary/30 border-t border-border"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-[110rem] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <DrGodlyLogo size="md" tagline={null} linkTo="/" />
            <p className="mt-4 text-muted-foreground text-sm leading-relaxed max-w-sm">
              The AI-native FHIR R4 EMR built for HIPAA-compliant telemedicine
              and electronic medical records.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="text-[11px] border-primary/30 text-primary"
              >
                FHIR R4
              </Badge>
              <Badge
                variant="outline"
                className="text-[11px] border-emerald-500/30 text-emerald-600"
              >
                HIPAA
              </Badge>
              <Badge
                variant="outline"
                className="text-[11px] border-violet-500/30 text-violet-600"
              >
                MCP
              </Badge>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-foreground">Product</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {PRODUCT_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors inline-block py-0.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="font-semibold text-foreground mt-8">Get started</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {START_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors inline-block py-0.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold text-foreground">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {EXPLORE_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors inline-block py-0.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-muted-foreground leading-relaxed max-w-[16rem]">
              Clinical decisions stay with licensed providers. DrGodly supports
              documentation and continuity of care.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} DrGodly. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span>HL7® FHIR® R4 Compliant</span>
            <span className="text-border hidden sm:inline">·</span>
            <span>HIPAA Secured</span>
            <span className="text-border hidden sm:inline">·</span>
            <span>MCP Server Integration</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
