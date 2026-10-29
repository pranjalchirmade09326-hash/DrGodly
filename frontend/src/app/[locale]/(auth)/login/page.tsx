"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "@/i18n/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Globe2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Stethoscope,
  Heart,
  Sparkles,
  CheckCircle2,
  Video,
  Star,
  Users,
} from "lucide-react";
import { DrGodlyLogo } from "@/components/shared/DrGodlyLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type UserRole = "patient" | "doctor";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = React.useState<UserRole>("patient");
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("louise.reed@example.com");
  const [password, setPassword] = React.useState("password123");
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success(
        `Welcome back to DrGodly, ${role === "doctor" ? "Dr. Alexander Wright" : "Louise Reed"}!`
      );
      if (role === "doctor") {
        router.push("/screens?role=doctor");
      } else {
        router.push("/screens?role=patient");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const fillTestAccount = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === "doctor") {
      setEmail("dr.wright@drgodly.com");
      setPassword("DoctorPass2026!");
      toast.info("Loaded Dr. Alexander Wright (Cardiology) test credentials");
    } else {
      setEmail("louise.reed@example.com");
      setPassword("PatientPass2026!");
      toast.info("Loaded Louise Reed (Patient) test credentials");
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <div className="grid min-h-screen lg:grid-cols-12">
        {/* =========================================================
            LEFT HERO: PREMIUM CLINICAL PHOTOGRAPHY & BRAND (5 Cols)
        ========================================================= */}
        <section className="relative hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-between overflow-hidden bg-slate-950 p-8 xl:p-12 text-white">
          {/* Background High-Definition Clinical Photography */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80"
              alt="DrGodly Clinical Telemedicine Environment"
              className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-105"
            />
            {/* Ambient Multi-Stop Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-blue-950/60" />
            <div className="absolute inset-0 bg-radial-[at_top_right] from-blue-600/25 via-transparent to-transparent" />
          </div>

          {/* Top Brand Header */}
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold tracking-wide text-white">
                  v2.4 Telehealth Live
                </span>
                <span className="text-slate-400 text-xs">&middot;</span>
                <span className="text-xs text-blue-200 font-medium">HIPAA Certified</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-black/40 backdrop-blur px-3 py-1 rounded-full border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit TLS & SOC 2 Type II</span>
              </div>
            </div>

            {/* Headline and Value Proposition */}
            <div className="mt-12 xl:mt-16 max-w-xl">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-3">
                Intelligent Medical Record & Virtual Clinic
              </span>
              <h1 className="text-3xl xl:text-5xl font-black tracking-tight leading-[1.12] text-white">
                Better Care.
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                  Intelligent By Design.
                </span>
              </h1>
              <p className="mt-4 text-sm xl:text-base text-slate-300 leading-relaxed max-w-lg font-normal">
                Connecting licensed clinicians with patients through real-time ambient AI,
                interactive video telemedicine, and atomic HL7 FHIR R4 medical records.
              </p>
            </div>
          </div>

          {/* Floating Clinical Feature Cards with Photos */}
          <div className="relative z-10 grid sm:grid-cols-2 gap-3.5 my-8">
            {/* Card 1: Active Doctor Consultation */}
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80"
                  alt="Dr. Alexander Wright, MD"
                  className="w-12 h-12 rounded-xl object-cover object-top ring-2 ring-emerald-400/50 shadow-md"
                />
                <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-900 absolute -bottom-0.5 -right-0.5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white truncate">Dr. Alexander Wright</span>
                  <CheckCircle2 className="w-3 h-3 text-blue-400 shrink-0" />
                </div>
                <p className="text-[11px] text-slate-300 truncate">Cardiology Specialist &middot; FACC</p>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300 font-semibold mt-0.5">
                  <Video className="w-2.5 h-2.5" /> Ready in HD Room
                </span>
              </div>
            </div>

            {/* Card 2: AI Clinical Scribe */}
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white block truncate">Ambient AI Clinical Scribe</span>
                <p className="text-[11px] text-slate-300 truncate">Synthesizes SOAP & ICD-10 notes</p>
                <span className="inline-flex items-center gap-1 text-[10px] text-blue-300 font-semibold mt-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Instant FHIR Export
                </span>
              </div>
            </div>
          </div>

          {/* Social Proof & Metrics Bottom Row */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                  alt="Patient"
                  className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Patient"
                  className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80"
                  alt="Doctor"
                  className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs font-bold text-white">
                  <div className="flex text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <Star className="w-3 h-3 fill-amber-400" />
                    <Star className="w-3 h-3 fill-amber-400" />
                    <Star className="w-3 h-3 fill-amber-400" />
                    <Star className="w-3 h-3 fill-amber-400" />
                  </div>
                  <span>4.98 / 5.0</span>
                </div>
                <p className="text-[11px] text-slate-400">100k+ clinical consultations</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-200 block">ABDM & Ayushman Bharat</span>
              <span className="text-[11px] text-slate-400">M1, M2, M3 Compliant</span>
            </div>
          </div>
        </section>

        {/* =========================================================
            RIGHT FORM: MODERN RESPONSIVE LOGIN WORKSPACE (7/6 Cols)
        ========================================================= */}
        <section className="col-span-12 lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-4 sm:p-8 xl:p-10">
          {/* Top Navbar */}
          <header className="flex items-center justify-between pb-4">
            <DrGodlyLogo size="md" />

            <div className="flex items-center gap-2">
              <Select defaultValue="en">
                <SelectTrigger className="w-[95px] h-8 border-slate-200 bg-white text-xs text-slate-700 shadow-2xs rounded-lg">
                  <Globe2 className="mr-1 h-3 w-3 text-slate-500" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिन्दी</SelectItem>
                  <SelectItem value="ta">தமிழ்</SelectItem>
                </SelectContent>
              </Select>

              <Link href="/screens">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg h-8 text-xs font-bold border-blue-200 bg-blue-50/50 text-blue-700 hover:bg-blue-100/70"
                >
                  All Screens Showcase
                </Button>
              </Link>
            </div>
          </header>

          {/* Mobile Hero Visual Banner (Shown only on small screens) */}
          <div className="block mb-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-2.5">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=160&q=80"
                  alt="Doctor"
                  className="w-11 h-11 rounded-xl object-cover ring-2 ring-white/30"
                />
                <div>
                  <h3 className="text-xs font-bold leading-tight">DrGodly Telehealth</h3>
                  <p className="text-[10px] text-blue-200">AI Intake &bull; HD Video &bull; e-Prescriptions</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                Live & Secure
              </span>
            </div>
          </div>

          {/* Main Card */}
          <div className="my-auto py-2">
            <Card className="w-full rounded-3xl border border-slate-200/80 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)] overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900">
                    Sign In to DrGodly
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Choose your workspace role or load demo credentials below
                  </p>
                </div>

                {/* 1-Click Interactive Test Persona Cards with Real Pictures */}
                <div className="mt-5 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Select Demo Profile (1-Click Fill)
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Doctor Option */}
                    <button
                      type="button"
                      onClick={() => fillTestAccount("doctor")}
                      className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                        role === "doctor"
                          ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20 shadow-2xs"
                          : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <img
                        src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=160&q=80"
                        alt="Dr. Alexander Wright"
                        className="w-10 h-10 rounded-xl object-cover object-top ring-1 ring-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 block truncate">Dr. Wright</span>
                        <span className="text-[10px] text-blue-700 font-semibold block truncate">Cardiologist</span>
                        {role === "doctor" && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-blue-700 bg-blue-100/90 px-1.5 py-0.2 rounded mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                            Active Profile
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Patient Option */}
                    <button
                      type="button"
                      onClick={() => fillTestAccount("patient")}
                      className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                        role === "patient"
                          ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20 shadow-2xs"
                          : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80"
                        alt="Louise Reed"
                        className="w-10 h-10 rounded-xl object-cover object-top ring-1 ring-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 block truncate">Louise Reed</span>
                        <span className="text-[10px] text-emerald-700 font-semibold block truncate">Patient Intake</span>
                        {role === "patient" && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-100/90 px-1.5 py-0.2 rounded mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            Active Profile
                          </span>
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Form Inputs */}
                <form onSubmit={handleLogin} className="mt-5 space-y-3.5">
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                      Email or Telehealth Identifier
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="doctor@drgodly.com"
                        className="h-11 rounded-xl border-slate-200 pl-10 text-xs font-medium focus-visible:ring-blue-500"
                        autoComplete="username"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                        Password
                      </Label>
                      <span className="text-[11px] font-medium text-blue-600 hover:underline cursor-pointer">
                        Forgot?
                      </span>
                    </div>
                    <div className="relative">
                      <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="h-11 rounded-xl border-slate-200 pl-10 pr-10 text-xs font-medium focus-visible:ring-blue-500"
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-11 w-full mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      "Connecting to Clinical Gateway..."
                    ) : (
                      <>
                        <span>Enter {role === "doctor" ? "Doctor Cockpit" : "Patient Portal"}</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Direct Bypass Link to Screens Showcase */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Direct Component Access:</span>
                  <Link
                    href="/screens"
                    className="font-bold text-blue-600 hover:text-blue-800 text-[11px] flex items-center gap-1"
                  >
                    <span>Open Master Showcase &rarr;</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer Security Badges */}
          <footer className="pt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 border-t border-slate-200/70">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">&copy; 2026 DrGodly Health</span>
              <span>&middot;</span>
              <span>ISO 27001</span>
              <span>&middot;</span>
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-500 hover:text-slate-800 cursor-pointer">Security Policy</span>
              <span className="text-slate-500 hover:text-slate-800 cursor-pointer">Terms</span>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
}
