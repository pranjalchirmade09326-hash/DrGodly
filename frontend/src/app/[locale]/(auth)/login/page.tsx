"use client";

import * as React from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MessageSquareHeart,
  ShieldCheck,
  Stethoscope,
  FileText,
  Heart,
  Users,
  Globe2,
  Home,
} from "lucide-react";
import { DrGodlyLogo } from "@/components/shared/DrGodlyLogo";
import { ClinicalBackdrop } from "@/components/shared/ClinicalBackdrop";
import LocaleSwitcher from "@/modules/client/shared/components/LocaleSwitcher";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useRouter } from "@/i18n/navigation";
import { toast } from "sonner";

/**
 * Login screen.
 *
 * Route: /[locale]/(auth)/login
 *
 * Split layout: brand/marketing panel (lg and up) + credential form. Below lg
 * the marketing panel is dropped and a compact header row takes over, so there
 * is always a route back home / to sign up / to the language picker — the
 * previous version left phone users with the brand as inert text and no way
 * out except the browser back button.
 *
 * Colours come from the theme tokens (--primary, --background, --muted,
 * --border …) rather than hard-coded blue/slate hexes, so the screen follows
 * the theme picker and dark mode like the rest of the app.
 *
 * NOTE: the submit handler is still the built-in demo flow — it simulates a
 * round trip and lands on /screens. Real credential auth goes through the
 * external IAM service via <OAuthPkceButton>.
 *
 * The "Demo Doctor" / "Demo Patient" buttons fill the credentials for the
 * chosen persona and complete that simulated round trip in one click, which is
 * how both workspaces are meant to be reached from a cold start.
 */

type UserRole = "patient" | "doctor";

const features = [
  {
    icon: MessageSquareHeart,
    title: "AI Health Intake",
    description: "Share your symptoms in your own words",
    iconClass: "bg-primary/10 text-primary",
  },
  {
    icon: Stethoscope,
    title: "Consult with Trusted Doctors",
    description: "Connect with licensed medical professionals",
    iconClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: FileText,
    title: "AI Clinical Support",
    description: "Better decisions for better outcomes",
    iconClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    icon: Heart,
    title: "Your Health Journey",
    description: "Continuous, personalized care",
    iconClass: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  },
];

const trustStats = [
  { icon: Users, value: "100,000+", label: "Patients Trust DrGodly" },
  { icon: ShieldCheck, value: "500+", label: "Licensed Doctors" },
  { icon: Globe2, value: "Nationwide", label: "Available Across 50 States" },
];

const DEMO_ACCOUNTS: Record<UserRole, { email: string; password: string; name: string }> = {
  patient: {
    email: "louise.reed@example.com",
    password: "PatientPass2026!",
    name: "Louise Reed",
  },
  doctor: {
    email: "dr.wright@drgodly.com",
    password: "DoctorPass2026!",
    name: "Dr. Alexander Wright",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = React.useState<UserRole>("patient");
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = React.useState(false);

  const validate = () => {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) next.email = "Enter your email or phone number.";
    else if (email.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "That email address doesn't look right.";
    if (!password) next.password = "Enter your password.";
    else if (password.length < 8) next.password = "Password must be at least 8 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      // Demo round trip — see the note above about OAuthPkceButton for real auth.
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success(`Welcome to DrGodly, ${DEMO_ACCOUNTS[role].name}!`);
      // Carry the chosen persona so the demo workspace opens on the matching side.
      router.push(`/screens?role=${role}`);
    } finally {
      setIsLoading(false);
    }
  }

  const fillDemoAccount = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setEmail(DEMO_ACCOUNTS[selectedRole].email);
    setPassword(DEMO_ACCOUNTS[selectedRole].password);
    setErrors({});
  };

  /**
   * One-click demo access: fill the persona's credentials, then run the same
   * simulated round trip the form does, and open that persona's workspace.
   */
  async function startDemoSession(selectedRole: UserRole) {
    fillDemoAccount(selectedRole);
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success(`Welcome to DrGodly, ${DEMO_ACCOUNTS[selectedRole].name}!`);
      router.push(`/screens?role=${selectedRole}`);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Social buttons are placeholders in this build: the IAM/PKCE service is not
   * part of the frontend-only demo, so say so instead of silently prefilling.
   */
  const socialUnavailable = () => {
    toast.info("Social sign-in needs the IAM service. Use a demo account in this build.");
  };

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="grid min-h-dvh lg:grid-cols-2">
        {/* =========================================================
            LEFT: DRGODLY BRAND / MARKETING PANEL (lg and up)
        ========================================================= */}
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-muted/60 via-background to-primary/10 lg:flex lg:flex-col">
          <ClinicalBackdrop className="opacity-80" />

          <div className="relative flex min-h-dvh flex-col justify-between px-10 py-8 xl:px-16">
            <div>
              <DrGodlyLogo size="lg" tagline="Care Smarter. Together." linkTo="/" />

              <div className="mt-14 max-w-2xl">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  AI-Native Telemedicine
                </p>
                <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-foreground xl:text-5xl">
                  Better Care.
                  <br />
                  <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
                    For A Healthier You.
                  </span>
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                  From symptom check to specialist consultation, DrGodly combines AI with licensed
                  medical professionals to deliver high-quality, personalized and accessible care.
                </p>
              </div>

              <div className="mt-8 grid max-w-xl gap-4">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="flex items-center gap-3.5">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${feature.iconClass}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{feature.title}</h3>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative mt-8 pt-4">
              <div className="mb-4 max-w-xs rounded-2xl border border-border/70 bg-card/90 p-4 shadow-lg backdrop-blur">
                <div className="flex gap-2.5">
                  <span className="text-2xl leading-none text-primary">“</span>
                  <p className="text-xs leading-relaxed text-card-foreground">
                    Technology should bring you closer to care, not further away.
                  </p>
                </div>
                <p className="mt-1 pl-5 text-[11px] font-semibold text-primary">
                  — The DrGodly Team
                </p>
              </div>

              <div className="grid grid-cols-3 border-t border-border pt-5">
                {trustStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.value}
                      className="flex items-center gap-2.5 border-r border-border px-3 first:pl-0 last:border-0"
                    >
                      <Icon className="h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <div className="text-sm font-bold text-foreground">{stat.value}</div>
                        <div className="text-[11px] leading-tight text-muted-foreground">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Small steps today. A healthier tomorrow.
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            RIGHT: HEADER ROW + LOGIN CARD
        ========================================================= */}
        <section className="relative flex min-h-dvh flex-col bg-muted/20">
          <header className="flex items-center justify-between gap-3 px-4 py-4 sm:px-8 lg:justify-end lg:px-10">
            {/* Only shown where the marketing panel is hidden — the way back home. */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-sm font-semibold text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Home className="h-4 w-4" />
                DrGodly
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <LocaleSwitcher />
              <Link href="/signup" className="hidden sm:inline-flex">
                <Button
                  variant="outline"
                  className="rounded-xl border-primary/40 px-4 h-9 text-sm text-primary hover:bg-primary/5"
                >
                  Create an account
                </Button>
              </Link>
            </div>
          </header>

          <div className="flex flex-1 items-center justify-center px-4 pb-8 sm:px-8">
            <Card className="w-full max-w-[500px] rounded-3xl border-border/60 bg-card shadow-xl">
              <CardContent className="p-6 sm:p-9">
                <div className="flex flex-col items-center text-center">
                  <DrGodlyLogo
                    size="xl"
                    tagline="AI for Better Care"
                    className="flex-col items-center"
                    textClassName="items-center text-center mt-1"
                  />
                  <h2 className="mt-6 text-2xl font-bold tracking-tight text-card-foreground">
                    Welcome Back
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Sign in to your DrGodly clinical account
                  </p>
                </div>

                <Tabs
                  value={role}
                  onValueChange={(value) => {
                    const next = value as UserRole;
                    setRole(next);
                    if (email || password) fillDemoAccount(next);
                  }}
                  className="mt-6"
                >
                  <TabsList className="grid h-12 w-full grid-cols-2 rounded-xl bg-muted p-1">
                    <TabsTrigger
                      value="patient"
                      className="h-10 rounded-lg text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                    >
                      <Users className="mr-1.5 h-4 w-4" />
                      Patient
                    </TabsTrigger>
                    <TabsTrigger
                      value="doctor"
                      className="h-10 rounded-lg text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                    >
                      <Stethoscope className="mr-1.5 h-4 w-4" />
                      Doctor
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <form onSubmit={handleLogin} noValidate className="mt-6 space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email or Phone Number
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={validate}
                        placeholder="Enter your email or phone number"
                        aria-invalid={Boolean(errors.email)}
                        className="h-11 rounded-xl pl-10 text-sm"
                        autoComplete="username"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs font-medium text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <Label htmlFor="password" className="text-sm font-medium text-foreground">
                        Password
                      </Label>
                      <Link
                        href="/forgot-password"
                        className="shrink-0 text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={validate}
                        placeholder="Enter your password"
                        aria-invalid={Boolean(errors.password)}
                        className="h-11 rounded-xl pl-10 pr-11 text-sm"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs font-medium text-destructive">{errors.password}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-11 w-full rounded-xl text-sm font-semibold shadow-md shadow-primary/20"
                  >
                    {isLoading ? (
                      "Signing in..."
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Demo access — this build ships without the IAM service, so these
                    two buttons are how the clinician and patient workflows get
                    exercised. Each one fills the credentials and signs straight in. */}
                <div className="mt-5 rounded-2xl border border-border/70 bg-muted/40 p-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      Demo credentials
                    </p>
                    <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                      No setup needed
                    </span>
                  </div>

                  <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => startDemoSession("doctor")}
                      disabled={isLoading}
                      className="flex min-w-0 items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2.5 text-left transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Stethoscope className="size-4.5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-card-foreground">
                          Demo Doctor
                        </span>
                        <span className="block truncate text-[11px] text-muted-foreground">
                          {DEMO_ACCOUNTS.doctor.email}
                        </span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => startDemoSession("patient")}
                      disabled={isLoading}
                      className="flex min-w-0 items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2.5 text-left transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Users className="size-4.5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-card-foreground">
                          Demo Patient
                        </span>
                        <span className="block truncate text-[11px] text-muted-foreground">
                          {DEMO_ACCOUNTS.patient.email}
                        </span>
                      </span>
                    </button>
                  </div>

                  <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                    Password for both demo accounts:{" "}
                    <span className="font-mono font-semibold text-foreground">DoctorPass2026!</span>{" "}
                    /{" "}
                    <span className="font-mono font-semibold text-foreground">PatientPass2026!</span>
                  </p>
                </div>

                <div className="my-5 flex items-center gap-3">
                  <Separator className="flex-1" />
                  <span className="text-xs text-muted-foreground">or continue with</span>
                  <Separator className="flex-1" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-10 rounded-xl text-sm"
                    type="button"
                    onClick={socialUnavailable}
                  >
                    <GoogleIcon />
                    <span className="ml-2">Google</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 rounded-xl text-sm"
                    type="button"
                    onClick={socialUnavailable}
                  >
                    <AppleIcon />
                    <span className="ml-2">Apple</span>
                  </Button>
                </div>

                <p className="mt-5 text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                  >
                    Create one
                  </Link>
                </p>
                <Link
                  href="/signup"
                  className="mt-3 flex w-full sm:hidden"
                >
                  <Button variant="outline" className="w-full rounded-xl text-sm">
                    Create an account
                  </Button>
                </Link>

                <div className="mt-5 flex gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-card-foreground">
                      Your health data is secure
                    </p>
                    <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
                      We follow industry-leading security and privacy standards.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {["HIPAA", "ABDM M1/M2/M3", "ISO 27001"].map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-border bg-background px-2 py-0.5 text-[11px] font-semibold text-muted-foreground"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <Link href="/legal" className="hover:text-foreground hover:underline">
                    Terms of Service
                  </Link>
                  <span aria-hidden="true">|</span>
                  <Link href="/legal#privacy" className="hover:text-foreground hover:underline">
                    Privacy Policy
                  </Link>
                  <span aria-hidden="true">|</span>
                  <Link href="/hipaa" className="hover:text-foreground hover:underline">
                    Security
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ===============================================================
   GOOGLE ICON
================================================================ */

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.71-.06-1.39-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.22Z"
      />
      <path
        fill="#34A853"
        d="M12 21.67c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.67Z"
      />
      <path
        fill="#FBBC05"
        d="M6.54 13.75A5.86 5.86 0 0 1 6.23 12c0-.61.11-1.2.31-1.75V7.72H3.3A9.76 9.76 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.28l3.24-2.53Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.22c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.83 3.31 14.63 2.33 12 2.33a9.74 9.74 0 0 0-8.7 5.39l3.24 2.53C7.31 7.94 9.46 6.22 12 6.22Z"
      />
    </svg>
  );
}

/* ===============================================================
   APPLE ICON
================================================================ */

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 12.54c-.02-2.25 1.84-3.34 1.93-3.39a4.15 4.15 0 0 0-3.27-1.77c-1.38-.15-2.7.81-3.4.81-.71 0-1.8-.79-2.96-.77a4.36 4.36 0 0 0-3.67 2.24c-1.58 2.74-.4 6.79 1.11 9.01.75 1.09 1.62 2.3 2.78 2.25 1.12-.05 1.54-.72 2.9-.72 1.35 0 1.73.72 2.9.69 1.2-.02 1.96-1.1 2.69-2.19a8.97 8.97 0 0 0 1.22-2.53 3.91 3.91 0 0 1-2.23-3.63Zm-2.23-6.62a3.9 3.9 0 0 0 .89-2.8 4.03 4.03 0 0 0-2.6 1.35 3.75 3.75 0 0 0-.92 2.69 3.34 3.34 0 0 0 2.63-1.24Z" />
    </svg>
  );
}
