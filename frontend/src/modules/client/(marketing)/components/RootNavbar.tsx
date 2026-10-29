/**
 * RootNavbar — fixed top navigation for the DrGodly marketing landing page.
 *
 * Layer: client / (marketing) / components
 *
 * Renders the brand logo, main nav links (FHIR EMR, Platform, Security,
 * Integrations), and action buttons (Sign In / Sign Up or Open App if
 * already authenticated). Becomes opaque + blurred on scroll.
 */

"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeSwitcher } from "@/theme/ThemeSwitcher";
import { NavUser } from "@/modules/client/shared/components/NavUser";
import { Link, useRouter } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import type { AuthResponse } from "@/modules/server/auth/types";
import { DrGodlyLogo } from "@/components/shared/DrGodlyLogo";
import { Menu, X, Sparkles, ArrowRight, Stethoscope, ShieldCheck, Database } from "lucide-react";

/**
 * Top navigation bar for the marketing landing page with full mobile responsiveness.
 *
 * @param session - Current server session (null if unauthenticated).
 */
export default function RootNavbar({
  session,
}: {
  session: AuthResponse | null;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const user = session
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        username: session.user.username,
      }
    : null;

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md shadow-sm border-b border-border/80"
          : "bg-background/60 backdrop-blur-xs border-b border-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <DrGodlyLogo
            size="md"
            badge="FHIR R4"
            tagline="AI for Better Care"
            linkTo="/"
          />

          {/* Nav links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-7">
            <Link
              href="/screens"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Interactive Cockpit</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </Link>
            <Link
              href="/fhir-emr"
              className="text-sm text-muted-foreground font-medium hover:text-primary transition-colors"
            >
              FHIR EMR
            </Link>
            <Link
              href="/ai-agents"
              className="text-sm text-muted-foreground font-medium hover:text-primary transition-colors"
            >
              AI Agents
            </Link>
            <Link
              href="/hipaa"
              className="text-sm text-muted-foreground font-medium hover:text-primary transition-colors"
            >
              Security & HIPAA
            </Link>
            <Link
              href="/mcp"
              className="text-sm text-muted-foreground font-medium hover:text-primary transition-colors"
            >
              MCP Server
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeSwitcher />

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-border"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Desktop Auth Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              {!user ? (
                <>
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-semibold rounded-full text-xs h-9 px-4"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      size="sm"
                      className="rounded-full px-5 h-9 text-xs font-semibold bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white shadow-md shadow-teal-500/20 hover:shadow-teal-500/30 transition-all border-0"
                    >
                      Get Started Free
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    className="rounded-full px-5 h-9 text-xs font-semibold shadow-md hover:shadow-lg transition-all"
                    onClick={() => {
                      const url =
                        session?.session.activeRoleRedirectUrl ??
                        "/screens";
                      router.push(url as any);
                    }}
                  >
                    Open App
                  </Button>
                  <NavUser user={user} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Navigation Drawer ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-b border-border bg-background/95 backdrop-blur-xl px-4 py-6 shadow-xl"
          >
            <div className="flex flex-col space-y-4">
              <Link
                href="/screens"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 font-semibold text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Interactive Cockpit & Screens</span>
                </div>
                <Badge className="bg-emerald-500 text-white text-[10px] px-2 py-0.5">Live Demo</Badge>
              </Link>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <Link
                  href="/fhir-emr"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 rounded-xl hover:bg-muted border border-border/50 text-foreground font-medium flex items-center gap-2"
                >
                  <Database className="w-4 h-4 text-primary" />
                  <span>FHIR EMR</span>
                </Link>
                <Link
                  href="/ai-agents"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 rounded-xl hover:bg-muted border border-border/50 text-foreground font-medium flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  <span>AI Agents</span>
                </Link>
                <Link
                  href="/hipaa"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 rounded-xl hover:bg-muted border border-border/50 text-foreground font-medium flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>HIPAA Security</span>
                </Link>
                <Link
                  href="/mcp"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 rounded-xl hover:bg-muted border border-border/50 text-foreground font-medium flex items-center gap-2"
                >
                  <Stethoscope className="w-4 h-4 text-teal-500" />
                  <span>MCP Server</span>
                </Link>
              </div>

              <div className="pt-4 border-t border-border flex flex-col gap-2.5">
                {!user ? (
                  <>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                      <Button variant="outline" className="w-full rounded-xl font-semibold h-11">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                      <Button className="w-full rounded-xl font-semibold h-11 shadow-md shadow-primary/20">
                        Get Started Free
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button
                    className="w-full rounded-xl font-semibold h-11"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      const url =
                        session?.session.activeRoleRedirectUrl ??
                        "/screens";
                      router.push(url as any);
                    }}
                  >
                    Open App
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
