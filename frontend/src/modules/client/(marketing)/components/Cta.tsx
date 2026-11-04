/**
 * Cta — final call-to-action section on the DrGodly marketing page.
 *
 * Layer: client / (marketing) / components
 *
 * Encourages healthcare providers to start their free trial or explore the interactive
 * clinical cockpit, with messaging focused on FHIR EMR transformation and AI-powered care.
 */

"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Database, Server, Sparkles } from "lucide-react";
import type { AuthResponse } from "@/modules/server/auth/types";

/**
 * Full-width CTA banner encouraging sign-up or cockpit demonstration.
 *
 * @param session - Active auth session; controls CTA button variant.
 */
export default function Cta({ session }: { session: AuthResponse | null }) {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[2.5rem] overflow-hidden bg-primary px-6 py-16 sm:px-16 sm:py-24 text-center shadow-2xl"
        >
          {/* Decorative SVG */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-foreground tracking-tight">
              Transform Your Practice with FHIR-Native AI
            </h2>
            <p className="mt-6 text-base sm:text-xl text-primary-foreground/85 max-w-2xl mx-auto leading-relaxed">
              Join forward-thinking healthcare providers already using DrGodly to
              eliminate documentation burden, automate FHIR record creation, and
              deliver superior patient outcomes with ambient clinical intelligence.
            </p>

            {/* Compliance badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-primary-foreground/80 text-xs sm:text-sm font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> HIPAA BAA Ready
              </span>
              <span className="text-primary-foreground/40 hidden sm:inline">·</span>
              <span className="flex items-center gap-1.5">
                <Database className="w-4 h-4" /> HL7 FHIR R4
              </span>
              <span className="text-primary-foreground/40 hidden sm:inline">·</span>
              <span className="flex items-center gap-1.5">
                <Server className="w-4 h-4" /> MCP Server Ready
              </span>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              {!session ? (
                <>
                  <Link href="/signup" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="w-full sm:w-auto rounded-full px-8 h-13 sm:h-14 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/screens" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto rounded-full px-8 h-13 sm:h-14 text-base sm:text-lg bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 font-semibold gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Explore Interactive Cockpit</span>
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href={session.session.activeRoleRedirectUrl ?? "/screens"} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full sm:w-auto rounded-full px-8 h-13 sm:h-14 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Open Clinical Cockpit
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
