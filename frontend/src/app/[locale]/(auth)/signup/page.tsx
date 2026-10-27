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
  FileCheck2,
  Building,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<"doctor" | "patient">("doctor");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mciNumber, setMciNumber] = useState("");
  const [specialty, setSpecialty] = useState("Internal Medicine");
  const [hospitalAffiliation, setHospitalAffiliation] = useState("");
  const [abhaId, setAbhaId] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast.error("Please fill in your name, email, and password.");
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
        }!`
      );

      if (role === "doctor") {
        router.push("/bezs/telemedicine/doctor/dashboard");
      } else {
        router.push("/bezs/telemedicine/patient/appointments");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background">
      {/* ── Left Side: Healthcare Clinical Brand Poster ───────────────── */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[50%] relative bg-slate-950 p-6 overflow-hidden">
        <div className="relative w-full h-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between p-8 bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950/40 text-white">
          {/* Top Brand Tag */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-lg shadow-md">
              Dg
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight text-white">DrGodly</h2>
              <p className="text-[11px] text-teal-400 font-medium">AI for Better Care</p>
            </div>
          </div>

          {/* Center Pitch */}
          <div className="space-y-4 max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-xs text-teal-300 font-medium">
              <Sparkles className="size-3.5" /> Next-Gen Clinical OS
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white leading-tight">
              Join the AI-Native Telemedicine Platform
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              DrGodly automates clinical documentation, generates real-time differential diagnosis, and
              synchronizes seamlessly with HL7 FHIR R4 and ABDM Health Lockers.
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-teal-400" />
                <span>Ambient SOAP note transcription during visits</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-teal-400" />
                <span>Tamper-evident SHA-256 digital signature stamps</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-teal-400" />
                <span>Zero administrative documentation burnout</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Trust Badge */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-teal-400" />
              <span>HIPAA & ABDM Level 2 Compliant</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">256-bit AES</span>
          </div>
        </div>
      </div>

      {/* ── Right Side: Clinical Sign-Up Form ─────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 max-w-xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between w-full mb-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            <Globe className="h-4 w-4" />
            <span className="font-medium text-xs">English (US)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Already have an account?</span>
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign In
            </Link>
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full my-auto space-y-5">
          <div className="space-y-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Create Your Account
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Set up your profile to start clinical consultations or access your health records.
            </p>
          </div>

          {/* Role Toggle: Doctor vs Patient */}
          <Tabs
            value={role}
            onValueChange={(val) => setRole(val as "doctor" | "patient")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/60 rounded-xl">
              <TabsTrigger
                value="doctor"
                className="flex items-center gap-2 py-2 text-xs sm:text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg transition-all"
              >
                <Stethoscope className="h-4 w-4" />
                <span>Doctor / Clinician</span>
              </TabsTrigger>
              <TabsTrigger
                value="patient"
                className="flex items-center gap-2 py-2 text-xs sm:text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg transition-all"
              >
                <User className="h-4 w-4" />
                <span>Patient / Family</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Registration Form */}
          <form onSubmit={handleSignUp} className="space-y-3.5">
            {/* Full Name */}
            <div className="space-y-1">
              <Label htmlFor="fullName" className="text-xs font-semibold">
                {role === "doctor" ? "Doctor Full Name (with title)" : "Full Legal Name"}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  required
                  placeholder={role === "doctor" ? "e.g. Dr. Arjun Mehta" : "e.g. Louise Reed"}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-9 text-xs sm:text-sm h-10 rounded-xl"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-semibold">
                Work / Personal Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="name@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 text-xs sm:text-sm h-10 rounded-xl"
                />
              </div>
            </div>

            {/* Doctor-Specific Fields */}
            {role === "doctor" && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <Label htmlFor="mciNumber" className="text-xs font-semibold">
                    MCI / NMC Reg. No.
                  </Label>
                  <div className="relative">
                    <FileCheck2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="mciNumber"
                      type="text"
                      placeholder="e.g. MCI-2018-98421"
                      value={mciNumber}
                      onChange={(e) => setMciNumber(e.target.value)}
                      className="pl-9 text-xs h-10 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="specialty" className="text-xs font-semibold">
                    Primary Specialty
                  </Label>
                  <select
                    id="specialty"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full text-xs h-10 px-3 rounded-xl border border-input bg-background"
                  >
                    <option value="Internal Medicine">Internal Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="General Practice">General Practice</option>
                    <option value="Pediatrics">Pediatrics</option>
                  </select>
                </div>
              </div>
            )}

            {/* Patient-Specific Fields */}
            {role === "patient" && (
              <div className="space-y-1 pt-1">
                <Label htmlFor="abhaId" className="text-xs font-semibold">
                  ABHA ID / National Health Number (Optional)
                </Label>
                <Input
                  id="abhaId"
                  type="text"
                  placeholder="e.g. 91-4821-9032-1104"
                  value={abhaId}
                  onChange={(e) => setAbhaId(e.target.value)}
                  className="text-xs h-10 rounded-xl"
                />
              </div>
            )}

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password" className="text-xs font-semibold">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-9 text-xs sm:text-sm h-10 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-2 pt-1">
              <Checkbox
                id="terms"
                checked={agreedTerms}
                onCheckedChange={(c) => setAgreedTerms(!!c)}
                className="mt-0.5"
              />
              <Label htmlFor="terms" className="text-[11px] text-muted-foreground leading-snug">
                I agree to the{" "}
                <span className="text-primary hover:underline cursor-pointer">
                  Clinical Terms of Service
                </span>{" "}
                and consent to HIPAA/ABDM health data processing guidelines.
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 rounded-xl font-semibold text-xs sm:text-sm bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...
                </>
              ) : (
                <>
                  Create {role === "doctor" ? "Doctor" : "Patient"} Account <ArrowRight className="ml-1.5 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-2 border-t border-border/80 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Quick fill demo:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setRole("doctor");
                  setFullName("Dr. Arjun Mehta");
                  setEmail("dr.mehta@drgodly.com");
                  setPassword("DoctorSecure2026!");
                  setMciNumber("MCI-2018-98421");
                  setSpecialty("Internal Medicine");
                }}
                className="text-primary hover:underline font-medium"
              >
                Dr. Arjun Mehta
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setRole("patient");
                  setFullName("Louise Reed");
                  setEmail("louise.reed@gmail.com");
                  setPassword("PatientCare2026!");
                  setAbhaId("91-1003-2890-4102");
                }}
                className="text-primary hover:underline font-medium"
              >
                Louise Reed
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-muted-foreground mt-4">
          Protected by end-to-end clinical encryption &copy; {new Date().getFullYear()} DrGodly Inc.
        </p>
      </div>
    </div>
  );
}
