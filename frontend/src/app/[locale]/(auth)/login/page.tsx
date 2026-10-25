"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Stethoscope,
  Globe,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { AppLogo } from "@/modules/client/shared/components/AppLogo";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      toast.error("Please enter both your email/phone and password.");
      return;
    }

    setIsLoading(true);
    // Simulate authentication and route to respective dashboard
    setTimeout(() => {
      setIsLoading(false);
      toast.success(
        `Welcome back, ${role === "doctor" ? "Dr. Sharma" : "Louise"}!`
      );
      if (role === "doctor") {
        router.push("/bezs/telemedicine/doctor/dashboard");
      } else {
        router.push("/bezs/telemedicine/patient/appointments");
      }
    }, 900);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background">
      {/* ── Left Side: High-Resolution Marketing Panel ────────────────── */}
      <div className="hidden lg:flex lg:w-[58%] xl:w-[60%] relative bg-slate-950 p-4 lg:p-6 overflow-hidden">
        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl flex items-center justify-center bg-slate-900">
          <Image
            src="/images/auth-poster.jpg"
            alt="DrGodly AI-Native Telemedicine"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1200px) 58vw, 60vw"
          />

          {/* Gentle vignette overlay for maximum contrast and readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/20 pointer-events-none" />

          {/* Floating Live Telehealth Pulse Badge */}
          <div className="absolute bottom-6 left-6 z-10 bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-full px-4 py-2 flex items-center gap-2.5 text-xs text-slate-200 shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-emerald-400">FHIR R4 Connected</span>
            <span className="text-slate-500">•</span>
            <span>Real-time Clinical Decision Support</span>
          </div>
        </div>
      </div>

      {/* ── Right Side: Healthcare Sign-In Card ───────────────────────── */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 max-w-xl mx-auto w-full">
        {/* Top Header: Language Switcher & Quick Sign Up */}
        <div className="flex items-center justify-between w-full mb-6 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            <Globe className="h-4 w-4" />
            <span className="font-medium text-xs">English (US)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Don&apos;t have an account?</span>
            <Link
              href="/signup"
              className="font-semibold text-primary hover:underline"
            >
              Create an account
            </Link>
          </div>
        </div>

        {/* Main Sign-In Form Container */}
        <div className="w-full my-auto space-y-6">
          {/* Logo & Headline */}
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-md shadow-cyan-500/20">
                <span className="text-xl tracking-tight">DG</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-xl tracking-tight text-foreground leading-none">
                  DrGodly
                </span>
                <span className="text-[11px] text-muted-foreground tracking-wide uppercase font-medium mt-0.5">
                  Care Smarter. Together.
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Welcome Back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to access your consultations, medical records, and AI copilot.
            </p>
          </div>

          {/* Role Toggle: Patient vs Doctor */}
          <Tabs
            value={role}
            onValueChange={(val) => setRole(val as "patient" | "doctor")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/60 rounded-xl">
              <TabsTrigger
                value="patient"
                className="flex items-center gap-2 py-2 text-xs sm:text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg transition-all"
              >
                <User className="h-4 w-4" />
                <span>Patient</span>
              </TabsTrigger>
              <TabsTrigger
                value="doctor"
                className="flex items-center gap-2 py-2 text-xs sm:text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg transition-all"
              >
                <Stethoscope className="h-4 w-4" />
                <span>Doctor / Clinician</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="identifier" className="text-xs font-semibold">
                {role === "doctor"
                  ? "Provider Email or NPI"
                  : "Email or Phone Number"}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="identifier"
                  type="text"
                  placeholder={
                    role === "doctor"
                      ? "dr.sharma@drgodly.com or NPI"
                      : "name@example.com or +1 (555) 000-0000"
                  }
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="pl-10 h-11 text-sm bg-background/50 border-input focus-visible:ring-primary/30"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 text-sm bg-background/50 border-input focus-visible:ring-primary/30"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(c) => setRememberMe(!!c)}
                />
                <label
                  htmlFor="remember"
                  className="text-xs text-muted-foreground font-medium cursor-pointer"
                >
                  Remember for 30 days
                </label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in as {role === "doctor" ? "Doctor" : "Patient"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Social SSO Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted/80" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground font-medium">
                or continue with
              </span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              type="button"
              className="h-10 text-xs font-medium border-input hover:bg-muted/50"
              onClick={() => {
                toast.info("Connecting to Google OAuth…");
              }}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>

            <Button
              variant="outline"
              type="button"
              className="h-10 text-xs font-medium border-input hover:bg-muted/50"
              onClick={() => {
                toast.info("Connecting to Apple ID…");
              }}
            >
              <svg className="mr-2 h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.67-.82 1.13-1.96 1-3.1-.98.04-2.16.65-2.85 1.47-.61.71-1.14 1.88-1 3 1.09.08 2.19-.55 2.85-1.37z" />
              </svg>
              Apple
            </Button>
          </div>
        </div>

        {/* Bottom Trust & Compliance Card */}
        <div className="mt-8 pt-4 border-t border-muted/60">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-foreground block">
                Your health data is private and encrypted
              </span>
              <span className="text-muted-foreground text-[11px] leading-tight block mt-0.5">
                Compliant with HIPAA, ABDM (ABHA), and SOC-2 Type II standards.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
