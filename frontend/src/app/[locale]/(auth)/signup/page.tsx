"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Stethoscope,
  Loader2,
  ArrowRight,
  FileCheck2,
  CheckCircle2,
  Sparkles,
  Home,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DrGodlyLogo } from "@/components/shared/DrGodlyLogo";
import LocaleSwitcher from "@/modules/client/shared/components/LocaleSwitcher";
import { Link, useRouter } from "@/i18n/navigation";
import { toast } from "sonner";

/**
 * Sign-up screen.
 *
 * Route: /[locale]/(auth)/signup
 *
 * Shares the login screen's visual language: token colours (so dark mode and
 * the theme picker work), a brand panel on lg and up, and a compact header row
 * carrying home / language / sign-in below lg.
 *
 * Field-level behaviour fixes over the previous version: the HIPAA/ABDM consent
 * box no longer starts ticked, the specialty picker is the same custom control
 * as the rest of the app instead of a bare <select>, the doctor-only fields stop
 * squeezing into two columns on a phone, and the terms text is a real link.
 *
 * NOTE: submission is the built-in demo flow (simulated, then routed into the
 * app). Real registration is handled by the external IAM service.
 */

const SPECIALTIES = [
  "Internal Medicine",
  "Cardiology",
  "Neurology",
  "General Practice",
  "Pediatrics",
  "Endocrinology",
  "Pulmonology",
] as const;

const roleBenefits = [
  "Ambient SOAP note transcription during visits",
  "Tamper-evident SHA-256 digital signature stamps",
  "Zero administrative documentation burnout",
];

const patientBenefits = [
  "One continuous, private health timeline",
  "AI intake that a licensed doctor actually reviews",
  "Records you can share with any clinic in seconds",
];

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<"doctor" | "patient">("patient");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mciNumber, setMciNumber] = useState("");
  const [specialty, setSpecialty] = useState<string>("Internal Medicine");
  const [hospitalAffiliation, setHospitalAffiliation] = useState("");
  const [abhaId, setAbhaId] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password) {
      toast.error("Please fill in your name, email, and password.");
      return;
    }
    if (password.length < 8) {
      toast.error("Please choose a password with at least 8 characters.");
      return;
    }
    if (!agreedTerms) {
      toast.error("Please agree to the clinical terms and privacy guidelines.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success(
        `Account successfully created! Welcome to DrGodly, ${
          role === "doctor" ? `Dr. ${fullName.replace(/^Dr\.\s*/i, "")}` : fullName
        }!`,
      );

      if (role === "doctor") {
        router.push("/bezs/telemedicine/doctor/dashboard");
      } else {
        router.push("/bezs/telemedicine/patient/appointments");
      }
    }, 1000);
  };

  return (
    <div className="min-h-dvh w-full bg-background text-foreground grid lg:grid-cols-2">
      {/* ── Brand panel (lg and up) ─────────────────────────────────── */}
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-muted/60 via-background to-primary/10 lg:flex lg:flex-col lg:p-8 xl:p-10">
        <div className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative flex min-h-dvh w-full flex-col justify-between rounded-3xl border border-border/60 bg-card/70 p-8 shadow-xl backdrop-blur sm:p-10 xl:p-12">
          <DrGodlyLogo size="lg" tagline="AI for Better Care" linkTo="/" />

          <div className="space-y-5 max-w-md py-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" /> Next-Gen Clinical OS
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground leading-tight xl:text-4xl">
              Join the AI-Native Telemedicine Platform
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              DrGodly automates clinical documentation, surfaces real-time
              differentials, and synchronizes with HL7 FHIR R4 and ABDM health
              records.
            </p>

            <ul className="space-y-2.5 pt-1 text-sm text-foreground/80">
              {(role === "doctor" ? roleBenefits : patientBenefits).map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/60 p-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 shrink-0 text-primary" />
              <span>HIPAA &amp; ABDM Level 2 Compliant</span>
            </div>
            <span className="font-mono text-[11px] text-primary">256-bit AES</span>
          </div>
        </div>
      </section>

      {/* ── Form column ─────────────────────────────────────────────── */}
      <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 max-w-xl mx-auto w-full">
        <div className="flex items-center justify-between gap-3 w-full text-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-sm font-semibold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Home className="h-4 w-4" />
            DrGodly
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <LocaleSwitcher />
            <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
              Already have an account?
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                Sign In
              </Link>
            </span>
          </div>
        </div>

        <div className="w-full my-6 space-y-6">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Create Your Account
            </h1>
            <p className="text-sm text-muted-foreground">
              Set up your profile to start clinical consultations or access your
              health records.
            </p>
          </div>

          <Tabs
            value={role}
            onValueChange={(val) => setRole(val as "doctor" | "patient")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 h-12 bg-muted p-1 rounded-xl">
              <TabsTrigger
                value="patient"
                className="h-10 rounded-lg text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
              >
                <User className="h-4 w-4 mr-1.5" />
                Patient / Family
              </TabsTrigger>
              <TabsTrigger
                value="doctor"
                className="h-10 rounded-lg text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
              >
                <Stethoscope className="h-4 w-4 mr-1.5" />
                Doctor / Clinician
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Full name */}
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-sm font-medium">
                {role === "doctor" ? "Doctor Full Name (with title)" : "Full Legal Name"}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder={role === "doctor" ? "e.g. Dr. Arjun Mehta" : "e.g. Louise Reed"}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-11 pl-9 text-sm rounded-xl"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Work / Personal Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 pl-9 text-sm rounded-xl"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Doctor-specific fields */}
            {role === "doctor" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="mciNumber" className="text-sm font-medium">
                    MCI / NMC Reg. No.
                  </Label>
                  <div className="relative">
                    <FileCheck2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="mciNumber"
                      name="mciNumber"
                      type="text"
                      placeholder="MCI-2018-98421"
                      value={mciNumber}
                      onChange={(e) => setMciNumber(e.target.value)}
                      className="h-11 pl-9 text-sm rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="hospitalAffiliation" className="text-sm font-medium">
                    Hospital / Clinic
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="hospitalAffiliation"
                      name="hospitalAffiliation"
                      type="text"
                      placeholder="e.g. Meridian Care Hospital"
                      value={hospitalAffiliation}
                      onChange={(e) => setHospitalAffiliation(e.target.value)}
                      className="h-11 pl-9 text-sm rounded-xl"
                      autoComplete="organization"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="specialty" className="text-sm font-medium">
                    Primary Specialty
                  </Label>
                  <Select value={specialty} onValueChange={setSpecialty}>
                    <SelectTrigger
                      id="specialty"
                      className="h-11 rounded-xl text-sm w-full"
                    >
                      <SelectValue placeholder="Select a specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {SPECIALTIES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Patient-specific fields */}
            {role === "patient" && (
              <div className="space-y-1.5">
                <Label htmlFor="abhaId" className="text-sm font-medium">
                  ABHA ID / National Health Number
                  <span className="ml-1 font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="abhaId"
                  name="abhaId"
                  type="text"
                  placeholder="91-4821-9032-1104"
                  value={abhaId}
                  onChange={(e) => setAbhaId(e.target.value)}
                  className="h-11 text-sm rounded-xl"
                />
              </div>
            )}

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pl-9 pr-11 text-sm rounded-xl"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Consent — never pre-ticked */}
            <div className="flex items-start gap-3 pt-1">
              <Checkbox
                id="terms"
                checked={agreedTerms}
                onCheckedChange={(c) => setAgreedTerms(!!c)}
                className="mt-0.5 shrink-0"
              />
              <Label
                htmlFor="terms"
                className="text-sm font-normal leading-relaxed text-muted-foreground cursor-pointer"
              >
                I agree to the{" "}
                <Link
                  href="/legal"
                  className="font-medium text-primary underline-offset-2 hover:underline"
                >
                  Clinical Terms of Service
                </Link>{" "}
                and consent to HIPAA/ABDM health data processing.
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl font-semibold text-sm shadow-md shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...
                </>
              ) : (
                <>
                  Create {role === "doctor" ? "Doctor" : "Patient"} Account
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Demo quick-fill — this build ships without the IAM service. */}
          <div className="pt-3 border-t border-border/80 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>Quick fill demo:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setRole("doctor");
                  setFullName("Dr. Arjun Mehta");
                  setEmail("dr.mehta@drgodly.com");
                  setPassword("DoctorSecure2026!");
                  setMciNumber("MCI-2018-98421");
                  setHospitalAffiliation("Meridian Care Hospital");
                  setSpecialty("Internal Medicine");
                }}
                className="rounded-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Dr. Arjun Mehta
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => {
                  setRole("patient");
                  setFullName("Louise Reed");
                  setEmail("louise.reed@example.com");
                  setPassword("PatientCare2026!");
                  setAbhaId("91-1003-2890-4102");
                }}
                className="rounded-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Louise Reed
              </button>
            </div>
          </div>

          <Link href="/login" className="flex sm:hidden">
            <Button variant="outline" className="w-full rounded-xl text-sm">
              Already have an account? Sign In
            </Button>
          </Link>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Protected by end-to-end clinical encryption &copy; {new Date().getFullYear()} DrGodly Inc.
        </p>
      </div>
    </div>
  );
}
