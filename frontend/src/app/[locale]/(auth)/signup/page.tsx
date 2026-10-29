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
  User,
  Stethoscope,
  ShieldCheck,
  FileCheck2,
  CheckCircle2,
  Building2,
  Sparkles,
} from "lucide-react";
import { DrGodlyLogo } from "@/components/shared/DrGodlyLogo";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type UserRole = "doctor" | "patient";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = React.useState<UserRole>("doctor");
  const [showPassword, setShowPassword] = React.useState(false);
  const [fullName, setFullName] = React.useState("Dr. Alexander Wright");
  const [email, setEmail] = React.useState("dr.wright@drgodly.com");
  const [password, setPassword] = React.useState("DoctorSecure2026!");
  const [specialty, setSpecialty] = React.useState("Cardiovascular Medicine (FACC)");
  const [medicalId, setMedicalId] = React.useState("NMC-78291-DL / NPI #1982736450");
  const [abhaId, setAbhaId] = React.useState("louise.reed@abdm");
  const [agreedTerms, setAgreedTerms] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  // Dynamic Live Password Security Calculator
  const passwordStrength = React.useMemo(() => {
    if (!password) return { score: 0, label: "Enter a password", color: "bg-slate-200", text: "text-slate-400" };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 1, label: "Weak • Add 8+ characters", color: "bg-rose-500", text: "text-rose-600" };
    if (score === 2) return { score: 2, label: "Fair • Add numbers or symbols", color: "bg-amber-500", text: "text-amber-600" };
    if (score === 3) return { score: 3, label: "Good • Meets clinical baseline", color: "bg-teal-500", text: "text-teal-600" };
    return { score: 4, label: "Strong • HIPAA Compliant Standard", color: "bg-emerald-500", text: "text-emerald-600" };
  }, [password]);

  // 1-Click Profile Selection
  const selectRoleProfile = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === "doctor") {
      setFullName("Dr. Alexander Wright");
      setEmail("dr.wright@drgodly.com");
      setPassword("DoctorSecure2026!");
      setSpecialty("Cardiovascular Medicine (FACC)");
      setMedicalId("NMC-78291-DL / NPI #1982736450");
      toast.info("Selected Dr. Wright (Clinician) registration profile");
    } else {
      setFullName("Louise Reed");
      setEmail("louise.reed@example.com");
      setPassword("PatientSecure2026!");
      setAbhaId("louise.reed@abdm / DG-89241");
      toast.info("Selected Louise Reed (Patient) registration profile");
    }
  };

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!agreedTerms) {
      toast.error("Please accept the Clinical Terms & HIPAA Guidelines.");
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success(
        `Account created successfully! Welcome to DrGodly, ${
          role === "doctor" ? `Dr. ${fullName.replace(/^Dr\.\s*/i, "")}` : fullName
        }!`
      );
      router.push("/screens");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen bg-slate-50/70 text-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Floating Ambient Glow Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-xl mx-auto space-y-4 my-auto py-2">
        {/* ── Top Header Navigation Bar ── */}
        <header className="flex items-center justify-between pb-2">
          <DrGodlyLogo size="md" linkTo="/" />

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
                className="rounded-lg h-8 text-xs font-bold border-blue-200 bg-blue-50/60 text-blue-700 hover:bg-blue-100/70"
              >
                All Screens Showcase
              </Button>
            </Link>
          </div>
        </header>

        {/* ── Visual Banner (Exact Match with Telehealth Cockpit) ── */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=160&q=80"
                alt="Doctor"
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-white/30 shrink-0"
              />
              <div>
                <h3 className="text-xs font-bold leading-tight">DrGodly Telehealth</h3>
                <p className="text-[10px] text-blue-200">AI Intake &bull; HD Video &bull; e-Prescriptions</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold shrink-0">
              Live & Secure
            </span>
          </div>
        </div>

        {/* ── Main Signup Card ── */}
        <Card className="w-full rounded-3xl border border-slate-200/80 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)] overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Sign Up for DrGodly
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Choose your workspace role or load demo credentials below
              </p>
            </div>

            {/* 1-Click Interactive Persona Selection */}
            <div className="mt-5 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Select Demo Profile (1-Click Fill)
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {/* Doctor Option */}
                <button
                  type="button"
                  onClick={() => selectRoleProfile("doctor")}
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
                  </div>
                </button>

                {/* Patient Option */}
                <button
                  type="button"
                  onClick={() => selectRoleProfile("patient")}
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
                  </div>
                </button>
              </div>
            </div>

            {/* Registration Form Inputs */}
            <form onSubmit={handleSignUp} className="mt-5 space-y-3.5">
              {/* Full Name */}
              <div className="space-y-1">
                <Label htmlFor="fullName" className="text-xs font-semibold text-slate-700">
                  Full Legal Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={role === "doctor" ? "Dr. Alexander Wright, MD" : "Louise Reed"}
                    className="h-11 rounded-xl border-slate-200 pl-10 text-xs font-medium focus-visible:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="h-11 rounded-xl border-slate-200 pl-10 text-xs font-medium focus-visible:ring-blue-500"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Doctor Specific: Specialty & Medical Registration */}
              {role === "doctor" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="specialty" className="text-xs font-semibold text-slate-700">
                      Primary Clinical Specialty
                    </Label>
                    <div className="relative">
                      <Stethoscope className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="specialty"
                        type="text"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        placeholder="Cardiovascular Medicine"
                        className="h-11 rounded-xl border-slate-200 pl-10 text-xs font-medium focus-visible:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="medicalId" className="text-xs font-semibold text-slate-700">
                      Medical Registration / NPI #
                    </Label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="medicalId"
                        type="text"
                        value={medicalId}
                        onChange={(e) => setMedicalId(e.target.value)}
                        placeholder="NMC-78291-DL"
                        className="h-11 rounded-xl border-slate-200 pl-10 text-xs font-medium focus-visible:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <Label htmlFor="abhaId" className="text-xs font-semibold text-slate-700">
                    Health Identifier / ABHA ID (Optional)
                  </Label>
                  <div className="relative">
                    <FileCheck2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="abhaId"
                      type="text"
                      value={abhaId}
                      onChange={(e) => setAbhaId(e.target.value)}
                      placeholder="louise.reed@abdm"
                      className="h-11 rounded-xl border-slate-200 pl-10 text-xs font-medium focus-visible:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="space-y-1">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                  Create Password
                </Label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="h-11 rounded-xl border-slate-200 pl-10 pr-10 text-xs font-medium focus-visible:ring-blue-500"
                    autoComplete="new-password"
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

                {/* Dynamic Live Password Strength Meter */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">HIPAA Security Standard:</span>
                    <span className={`font-bold ${passwordStrength.text} transition-colors duration-200`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 h-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-full rounded-full transition-all duration-300 ${
                          step <= passwordStrength.score ? passwordStrength.color : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Clinical Terms & Consent */}
              <div className="flex items-start gap-2 pt-1">
                <Checkbox
                  id="terms"
                  checked={agreedTerms}
                  onCheckedChange={(checked) => setAgreedTerms(Boolean(checked))}
                  className="mt-0.5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="terms" className="text-[11px] text-slate-600 leading-tight cursor-pointer font-normal">
                  I agree to DrGodly's{" "}
                  <span className="font-semibold text-blue-600 hover:underline">Clinical Terms of Service</span>,{" "}
                  <span className="font-semibold text-blue-600 hover:underline">HIPAA BAA Guidelines</span>, and{" "}
                  <span className="font-semibold text-blue-600 hover:underline">Privacy Policy</span>.
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  "Provisioning Clinical Profile..."
                ) : (
                  <>
                    <span>Create {role === "doctor" ? "Doctor Cockpit Account" : "Patient Portal Account"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Direct Switch to Sign In */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">Already have an account?</span>
              <Link
                href="/login"
                className="font-bold text-blue-600 hover:text-blue-800 text-[11px] flex items-center gap-1"
              >
                <span>Sign In to DrGodly &rarr;</span>
              </Link>
            </div>

            {/* Direct Bypass Link to Screens Showcase */}
            <div className="mt-2.5 pt-2.5 border-t border-slate-100/70 flex items-center justify-between text-xs">
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

        {/* ── Footer Security Badges ── */}
        <footer className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 border-t border-slate-200/70">
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
      </div>
    </main>
  );
}
