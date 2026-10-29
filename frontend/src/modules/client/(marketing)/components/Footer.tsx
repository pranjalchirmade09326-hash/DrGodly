/**
 * Footer — site-wide footer for the DrGodly marketing landing page.
 *
 * Layer: client / (marketing) / components
 *
 * Four-column layout: brand tagline, Product links, Company links, Legal links.
 * Bottom bar includes copyright and compliance trust badges
 * (HIPAA, HL7 FHIR R4, MCP Server).
 */

"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { DrGodlyLogo } from "@/components/shared/DrGodlyLogo";
import { Link } from "@/i18n/navigation";

/**
 * Marketing page footer with compliance trust badges and navigation links.
 */
export default function Footer() {
  return (
    <motion.footer
      className="bg-secondary/30 border-t border-border"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <DrGodlyLogo
              size="md"
              badge="FHIR R4"
              tagline="AI for Better Care"
              linkTo="/"
            />
            <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
              The AI-native FHIR R4 EMR built for HIPAA-compliant telemedicine
              and longitudinal electronic medical records.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                FHIR R4 Native
              </Badge>
              <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-600">
                HIPAA BAA
              </Badge>
              <Badge variant="outline" className="text-[10px] border-violet-500/30 text-violet-600">
                MCP Server
              </Badge>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-foreground">Product</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                { label: "Interactive Cockpit & Screens", href: "/screens" },
                { label: "FHIR EMR Interoperability", href: "/fhir-emr" },
                { label: "AI Clinical Agents", href: "/ai-agents" },
                { label: "MCP Server API", href: "/mcp" },
                { label: "HIPAA Security", href: "/hipaa" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Clinicians & Patients */}
          <div>
            <h3 className="font-semibold text-foreground">Solutions</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                { label: "Telehealth Cockpit (3-Panel)", href: "/screens" },
                { label: "AI Symptom Intake Studio", href: "/screens" },
                { label: "Outpatient Waiting Room", href: "/screens" },
                { label: "e-Prescriptions & SOAP", href: "/screens" },
                { label: "Find Board-Certified Doctors", href: "/screens" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground">Company</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {["About Us", "Clinical Advisory Board", "Careers", "Press & Media", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground">Legal & Security</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {["Privacy Policy", "Terms of Service", "HIPAA Business Associate Agreement", "SOC 2 Type II Report", "Security Whitepaper"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DrGodly Health, Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>HL7 FHIR&reg; is a registered trademark of Health Level Seven International.</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
