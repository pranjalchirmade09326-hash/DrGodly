/**
 * RootNavbar — fixed top navigation for the DrGodly marketing site.
 *
 * Layer: client / (marketing) / components
 *
 * Renders the brand logo, main nav links (FHIR EMR, AI Agents, Security,
 * MCP API) and action buttons (Sign In / Get Started Free, or Open App when
 * already authenticated). Becomes opaque + blurred on scroll.
 *
 * Responsive contract:
 *   >= md — full inline nav links + both CTAs in the bar.
 *   <  md — links and CTAs collapse into a right-hand Sheet opened by a
 *           hamburger button; the bar itself only carries the compact logo,
 *           theme toggle and menu button so it can never overflow a 320px
 *           viewport. Previously the CTA row stayed in the fixed bar with no
 *             mobile replacement for the hidden nav, leaving "Get Started
 *           Free" clipped off-screen and phones with no way to navigate.
 */

"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { OAuthPkceButton } from "@/modules/client/auth/components/OAuthPkceButton";
import { ThemeSwitcher } from "@/theme/ThemeSwitcher";
import { NavUser } from "@/modules/client/shared/components/NavUser";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import type { AuthResponse } from "@/modules/server/auth/types";
import { DrGodlyLogo } from "@/components/shared/DrGodlyLogo";
import { cn } from "@/lib/utils";

/** Single source of truth for the marketing nav, shared by bar and sheet. */
const NAV_LINKS = [
  { href: "/fhir-emr", label: "FHIR EMR" },
  { href: "/ai-agents", label: "AI Agents" },
  { href: "/hipaa", label: "Security" },
  { href: "/mcp", label: "MCP API" },
] as const;

/**
 * Top navigation bar for the marketing landing page.
 *
 * @param session - Current server session (null if unauthenticated).
 */
export default function RootNavbar({
  session,
}: {
  session: AuthResponse | null;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
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

  const openApp = () => {
    const url =
      session?.session.activeRoleRedirectUrl ??
      "/bezs/telemedicine/patient/profile";
    router.push(url as any);
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/90 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent",
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-[110rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20 gap-3">
          {/* Logo — badge and tagline drop out on narrow screens so the bar
              never competes with the action row for width. */}
          <DrGodlyLogo
            size="md"
            badge="FHIR R4"
            badgeClassName="hidden md:inline-flex"
            tagline="AI for Better Care"
            taglineClassName="hidden sm:block"
            linkTo="/"
          />

          {/* Nav links (md and up) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isActive(href)
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5",
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <ThemeSwitcher />

            {!user ? (
              <>
                {/* Compact text CTA stays from sm; below sm it lives in the sheet */}
                <OAuthPkceButton
                  variant="ghost"
                  size="sm"
                  className="hidden sm:inline-flex font-semibold rounded-full"
                >
                  Sign In
                </OAuthPkceButton>
                <OAuthPkceButton
                  size="sm"
                  className="hidden sm:inline-flex rounded-full px-5 lg:px-6 shadow-md hover:shadow-lg transition-all"
                >
                  Get Started Free
                </OAuthPkceButton>
              </>
            ) : (
              <Button
                size="sm"
                className="hidden sm:inline-flex rounded-full px-5 lg:px-6 shadow-md hover:shadow-lg transition-all"
                onClick={openApp}
              >
                Open App
              </Button>
            )}

            {/* Mobile menu */}
            <Sheet
              open={isMobileNavOpen}
              onOpenChange={setIsMobileNavOpen}
            >
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden hover:bg-transparent"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[min(20rem,88vw)] gap-0 p-0 flex flex-col overflow-y-auto"
              >
                <SheetHeader className="px-5 py-4 border-b border-border">
                  <SheetTitle className="text-left">
                    <DrGodlyLogo size="sm" tagline={null} linkTo="/" />
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    Site navigation and account actions
                  </SheetDescription>
                </SheetHeader>

                <nav className="flex flex-col px-3 py-3">
                  {NAV_LINKS.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsMobileNavOpen(false)}
                      className={cn(
                        "rounded-xl px-4 py-3 text-base font-medium transition-colors",
                        isActive(href)
                          ? "bg-primary/5 text-primary"
                          : "text-foreground/80 hover:bg-secondary hover:text-primary",
                      )}
                    >
                      {label}
                    </Link>
                  ))}
                </nav>

                <Separator />

                <div className="px-5 py-5 mt-auto space-y-3">
                  {!user ? (
                    <>
                      <OAuthPkceButton
                        variant="outline"
                        className="w-full rounded-full font-semibold"
                      >
                        Sign In
                      </OAuthPkceButton>
                      <OAuthPkceButton className="w-full rounded-full font-semibold shadow-md">
                        Get Started Free
                      </OAuthPkceButton>
                    </>
                  ) : (
                    <>
                      <Button
                        className="w-full rounded-full font-semibold shadow-md"
                        onClick={() => {
                          setIsMobileNavOpen(false);
                          openApp();
                        }}
                      >
                        Open App
                      </Button>
                      <NavUser user={user} />
                    </>
                  )}
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    HIPAA-ready &middot; HL7 FHIR R4
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
