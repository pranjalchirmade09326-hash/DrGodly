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
  MessageSquareHeart,
  ShieldCheck,
  Stethoscope,
  FileText,
  Heart,
  Users,
} from "lucide-react";
import { DrGodlyLogo } from "@/components/shared/DrGodlyLogo";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const features = [
  {
    icon: MessageSquareHeart,
    title: "AI Health Intake",
    description: "Share your symptoms in your own words",
    iconClass: "bg-blue-100 text-blue-600",
  },
  {
    icon: Stethoscope,
    title: "Consult with Trusted Doctors",
    description: "Connect with licensed medical professionals",
    iconClass: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: FileText,
    title: "AI Clinical Support",
    description: "Better decisions for better outcomes",
    iconClass: "bg-violet-100 text-violet-600",
  },
  {
    icon: Heart,
    title: "Your Health Journey",
    description: "Continuous, personalized care",
    iconClass: "bg-pink-100 text-pink-600",
  },
];

const trustStats = [
  {
    icon: Users,
    value: "100,000+",
    label: "Patients Trust DrGodly",
  },
  {
    icon: ShieldCheck,
    value: "500+",
    label: "Licensed Doctors",
  },
  {
    icon: Globe2,
    value: "Nationwide",
    label: "Available Across 50 States",
  },
];

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
        `Welcome to DrGodly, ${role === "doctor" ? "Dr. Alexander Wright" : "Louise Reed"}!`
      );

      if (role === "doctor") {
        router.push("/screens");
      } else {
        router.push("/screens");
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
      toast.info("Loaded Louise Reed test credentials");
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* =========================================================
            LEFT: DRGODLY BRAND / MARKETING PANEL
        ========================================================= */}
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-white via-blue-50/70 to-cyan-50 lg:flex lg:flex-col">
          {/* Decorative ambient gradients */}
          <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />

          <div className="relative flex min-h-screen flex-col px-10 py-8 xl:px-16 justify-between">
            {/* Header / Logo */}
            <div>
              <DrGodlyLogo
                size="lg"
                tagline="Care Smarter. Together."
                linkTo="/en"
              />

              {/* Hero Messaging */}
              <div className="mt-14 max-w-2xl">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#4056b8]">
                  AI-Native Telemedicine
                </p>

                <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-[#10195c] xl:text-5xl">
                  Better Care.
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    For A Healthier You.
                  </span>
                </h1>

                <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600">
                  From symptom check to specialist consultation, DrGodly combines AI with licensed
                  medical professionals to deliver high-quality, personalized and accessible care.
                </p>
              </div>

              {/* Feature list */}
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
                        <h3 className="text-sm font-semibold text-[#10195c]">
                          {feature.title}
                        </h3>
                        <p className="text-xs text-slate-500">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Team Quote & Physician Visual */}
            <div className="relative mt-8 pt-4">
              <div className="max-w-xs rounded-2xl border border-white/80 bg-white/95 p-4 shadow-lg backdrop-blur mb-4">
                <div className="flex gap-2.5">
                  <span className="text-2xl text-blue-500 leading-none">“</span>
                  <p className="text-xs leading-relaxed text-slate-700">
                    Technology should bring you closer to care, not further away.
                  </p>
                </div>
                <p className="pl-5 mt-1 text-[11px] font-semibold text-blue-600">
                  — The DrGodly Team
                </p>
              </div>

              {/* Trust stats */}
              <div className="grid grid-cols-3 border-t border-blue-100 pt-5">
                {trustStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.value}
                      className="flex items-center gap-2.5 border-r border-blue-100 px-3 first:pl-0 last:border-0"
                    >
                      <Icon className="h-6 w-6 text-blue-600 shrink-0" />
                      <div>
                        <div className="font-bold text-sm text-[#10195c]">{stat.value}</div>
                        <div className="text-[10px] text-slate-500 leading-tight">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 text-center text-[10px] font-medium uppercase tracking-[0.25em] text-slate-400">
                Small steps today. A healthier tomorrow.
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            RIGHT: LOGIN FORM & CARD
        ========================================================= */}
        <section className="relative flex min-h-screen flex-col bg-[#f8fbff]">
          {/* Top navigation */}
          <header className="flex items-center justify-end gap-3 px-6 py-4 sm:px-10">
            <Select defaultValue="en">
              <SelectTrigger className="w-[110px] h-9 border-0 bg-transparent text-xs text-slate-600 shadow-none">
                <Globe2 className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिन्दी</SelectItem>
                <SelectItem value="ta">தமிழ்</SelectItem>
              </SelectContent>
            </Select>

            <Link href="/signup">
              <Button
                variant="outline"
                className="rounded-xl border-blue-500 px-4 h-9 text-xs text-blue-600 hover:bg-blue-50"
              >
                Create an account
              </Button>
            </Link>
          </header>

          {/* Login Card */}
          <div className="flex flex-1 items-center justify-center px-4 pb-8 sm:px-8">
            <Card className="w-full max-w-[500px] rounded-3xl border-0 bg-white shadow-[0_20px_70px_rgba(30,64,175,0.08)]">
              <CardContent className="p-6 sm:p-9">
                {/* Logo & Welcome */}
                <div className="flex flex-col items-center text-center">
                  <DrGodlyLogo
                    size="xl"
                    tagline="AI for Better Care"
                    className="flex-col items-center"
                    textClassName="items-center text-center mt-1"
                  />

                  <h2 className="mt-6 text-2xl font-bold tracking-tight text-[#10195c]">
                    Welcome Back
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Sign in to your DrGodly clinical account
                  </p>
                </div>

                {/* Role Switcher */}
                <Tabs
                  value={role}
                  onValueChange={(value) => fillTestAccount(value as UserRole)}
                  className="mt-6"
                >
                  <TabsList className="grid h-12 w-full grid-cols-2 rounded-xl bg-slate-100 p-1">
                    <TabsTrigger
                      value="patient"
                      className="h-10 rounded-lg text-xs font-semibold data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                    >
                      <Users className="mr-1.5 h-4 w-4" />
                      Patient
                    </TabsTrigger>

                    <TabsTrigger
                      value="doctor"
                      className="h-10 rounded-lg text-xs font-semibold data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                    >
                      <Stethoscope className="mr-1.5 h-4 w-4" />
                      Doctor
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Form */}
                <form onSubmit={handleLogin} className="mt-6 space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-medium text-slate-700">
                      Email or Phone Number
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email or phone number"
                        className="h-11 rounded-xl border-slate-200 pl-10 text-xs focus-visible:ring-blue-500"
                        autoComplete="username"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-xs font-medium text-slate-700">
                        Password
                      </Label>
                      <button
                        type="button"
                        className="text-xs font-medium text-blue-600 hover:text-blue-700"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div className="relative">
                      <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="h-11 rounded-xl border-slate-200 pl-10 pr-10 text-xs focus-visible:ring-blue-500"
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
                    className="h-11 w-full rounded-xl bg-blue-600 text-xs font-semibold shadow-md shadow-blue-600/20 hover:bg-blue-700 text-white"
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

                {/* Divider */}
                <div className="my-5 flex items-center gap-3">
                  <Separator className="flex-1" />
                  <span className="text-[11px] text-slate-400">or continue with</span>
                  <Separator className="flex-1" />
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-10 rounded-xl border-slate-200 text-xs"
                    type="button"
                    onClick={() => {
                      fillTestAccount("patient");
                      toast.info("1-Click Google sign-in demo linked!");
                    }}
                  >
                    <GoogleIcon />
                    <span className="ml-2">Google</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-10 rounded-xl border-slate-200 text-xs"
                    type="button"
                    onClick={() => {
                      fillTestAccount("doctor");
                      toast.info("1-Click Apple sign-in demo linked!");
                    }}
                  >
                    <AppleIcon />
                    <span className="ml-2">Apple</span>
                  </Button>
                </div>

                {/* Registration link */}
                <p className="mt-5 text-center text-xs text-slate-500">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Create one
                  </Link>
                </p>

                {/* Security Card */}
                <div className="mt-5 flex gap-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-blue-50 p-4 border border-emerald-100">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-[#10195c]">
                      Your health data is secure
                    </p>
                    <p className="mt-0.5 text-[11px] leading-tight text-slate-500">
                      We follow industry-leading security and privacy standards.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {["HIPAA", "ABDM M1/M2/M3", "ISO 27001"].map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-700 shadow-2xs border border-slate-200/60"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Legal Footer */}
                <div className="mt-6 flex justify-center gap-3 text-[11px] text-slate-400">
                  <button type="button" className="hover:text-slate-600">
                    Terms of Service
                  </button>
                  <span>|</span>
                  <button type="button" className="hover:text-slate-600">
                    Privacy Policy
                  </button>
                  <span>|</span>
                  <button type="button" className="hover:text-slate-600">
                    Contact Us
                  </button>
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
