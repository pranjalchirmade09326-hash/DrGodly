"use client";

import { useMemo } from "react";
import { toZonedTime } from "date-fns-tz";
import { APP_TIMEZONE, nowIST } from "@/modules/shared/helper";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Pill,
  Video,
  Plus,
  ShieldCheck,
  Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { AppointmentBarChart, type AppointmentBarChartData } from "./AppointmentBarChart";
import { AppointmentSummaryChart } from "./AppointmentSummaryChart";
import { RecentAppointmentsTable, type DashboardAppointment } from "./RecentAppointmentsTable";
import { HealthScoreGauge } from "./HealthScoreGauge";
import { HealthSnapshotGrid } from "./HealthSnapshotGrid";
import { CarePlanChecklist } from "./CarePlanChecklist";
import { AskDrGodlyChatWidget } from "./AskDrGodlyChatWidget";
import type { TAppointmentResponse } from "@/modules/entities/schemas/appointment";

interface PatientDashboardProps {
  userName: string;
  appointments: TAppointmentResponse[];
  patientId: number;
}

function getDoctorName(appt: TAppointmentResponse): string | null {
  return (
    appt.participant?.find((p) => p.reference_type === "Practitioner")
      ?.reference_display ?? null
  );
}

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function buildMonthlyData(
  appointments: TAppointmentResponse[],
  months = 6,
): AppointmentBarChartData[] {
  const now = nowIST();
  const result: AppointmentBarChartData[] = [];

  for (let i = months - 1; i >= -1; i--) {
    const target = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = target.getFullYear();
    const month = target.getMonth();

    const inMonth = appointments.filter((a) => {
      if (!a.start) return false;
      const d = toZonedTime(new Date(a.start), APP_TIMEZONE);
      return d.getFullYear() === year && d.getMonth() === month;
    });

    const booked = inMonth.length;
    const completed = inMonth.filter((a) => a.status === "fulfilled").length;

    result.push({ name: MONTH_LABELS[month], booked, completed });
  }

  return result;
}

export function PatientDashboard({ userName, appointments, patientId }: PatientDashboardProps) {
  const nextAppointment = useMemo(() => {
    return appointments.find((a) => a.status === "booked" || a.status === "pending");
  }, [appointments]);

  const monthlyData = useMemo(
    () => buildMonthlyData(appointments, 6),
    [appointments],
  );

  const recentAppointments = useMemo((): DashboardAppointment[] => {
    return [...appointments]
      .sort((a, b) => {
        const aTime = a.start ? new Date(a.start).getTime() : 0;
        const bTime = b.start ? new Date(b.start).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 5)
      .map((a) => ({
        id: a.id,
        date: a.start,
        doctorName: getDoctorName(a),
        status: a.status,
      }));
  }, [appointments]);

  return (
    <div className="dash-view-container patient-dashboard space-y-6">
      {/* ── Patient Welcome Header with ABHA Verification ── */}
      <div className="dash-header-card patient-hero-banner bg-card text-card-foreground p-5 sm:p-6 rounded-2xl border border-border/80 shadow-xs transition-all hover:shadow-md">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="dash-page-title text-foreground tracking-tight">
              Hello, {userName} 👋
            </h1>
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs font-semibold flex items-center gap-1 px-2.5 py-0.5 rounded-full shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5" />
              ABHA Verified
            </Badge>
          </div>
          <p className="dash-caption text-muted-foreground mt-1.5 flex items-center gap-2 flex-wrap">
            <span>Age: 42</span> • <span>Female</span> • <span>ABHA ID: <span className="font-mono font-medium text-foreground">91-4821-9032-1104</span></span>
          </p>
        </div>

        <Link href="/patient/appointments/book">
          <Button size="sm" className="dash-btn-primary patient-action-hero h-10 px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wide shadow-xs transition-all hover:shadow-md active:scale-[0.98] focus-visible:ring-2">
            <Plus className="h-4 w-4 mr-1.5 shrink-0" />
            Book New Consultation
          </Button>
        </Link>
      </div>

      {/* ── Health Score Gauge & Next Visit Spotlight ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
        <div className="lg:col-span-7 flex flex-col">
          <HealthScoreGauge score={78} label="Good Condition" changeNote="+5 pts for blood pressure adherence" />
        </div>

        {/* Next Visit Launcher Card */}
        <div className="lg:col-span-5 flex flex-col">
          <Card className="dash-card border border-teal-200/80 dark:border-teal-700/50 bg-gradient-to-br from-teal-600 to-emerald-700 text-white rounded-2xl shadow-xs hover:shadow-md p-5 sm:p-6 flex flex-col justify-between h-full transition-all">
            <div>
              <div className="flex items-center justify-between text-teal-100 text-xs font-medium">
                <span className="flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                  <Video className="h-4 w-4" /> Next Appointment
                </span>
                <span className="bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[11px] font-medium text-white shadow-2xs">
                  Today, 10:30 AM
                </span>
              </div>

              <div className="mt-4 space-y-1">
                <h3 className="text-xl font-bold tracking-tight">Dr. Priya Sharma</h3>
                <p className="text-xs text-teal-100 leading-relaxed">
                  Cardiology & Internal Medicine • Apollo Clinic
                </p>
              </div>

              <div className="mt-3.5 flex items-center gap-2">
                <Badge className="bg-emerald-400/30 text-white border-white/20 text-[11px] font-medium px-2.5 py-0.5">
                  ✓ AI Intake Submitted
                </Badge>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-teal-100 font-medium">Room opens 10m before visit</span>
              <Link href="/patient/appointments/online-consultation?appointmentId=101">
                <Button size="sm" className="dash-btn-inline bg-white text-teal-900 hover:bg-teal-50 font-semibold rounded-xl text-xs shadow-xs h-9 px-4 transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white">
                  Join Video Visit →
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* ── 4 Patient Status KPI Cards ── */}
      <div className="dash-kpi-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Next Appointment */}
        <Card className="dash-kpi-card border border-teal-200/50 dark:border-teal-800/40 bg-card hover:border-teal-500/40 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-full">
          <div className="flex items-center justify-between gap-2">
            <span className="dash-card-title text-xs font-semibold text-muted-foreground uppercase tracking-wider">Next Visit</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 shrink-0">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="dash-metric-text text-base sm:text-lg font-bold text-foreground">Today, 10:30 AM</div>
            <p className="dash-caption text-[11px] text-teal-600 dark:text-teal-400 font-medium mt-1">Dr. Priya Sharma (Video)</p>
          </div>
        </Card>

        {/* Card 2: AI Intake Status */}
        <Card className="dash-kpi-card border border-emerald-200/50 dark:border-emerald-800/40 bg-card hover:border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-full">
          <div className="flex items-center justify-between gap-2">
            <span className="dash-card-title text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Intake Status</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="dash-metric-text text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 shrink-0" /> Completed
            </div>
            <p className="dash-caption text-[11px] text-muted-foreground mt-1">Submitted 15 mins ago</p>
          </div>
        </Card>

        {/* Card 3: Care Plan Goals */}
        <Card className="dash-kpi-card border border-indigo-200/50 dark:border-indigo-800/40 bg-card hover:border-indigo-500/40 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-full">
          <div className="flex items-center justify-between gap-2">
            <span className="dash-card-title text-xs font-semibold text-muted-foreground uppercase tracking-wider">Care Plan Goals</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="dash-metric-text text-base sm:text-lg font-bold text-foreground">4 of 6 (67%)</div>
            <p className="dash-caption text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-1">Daily walks on track</p>
          </div>
        </Card>

        {/* Card 4: Medications Due */}
        <Card className="dash-kpi-card border border-amber-200/50 dark:border-amber-800/40 bg-card hover:border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-full">
          <div className="flex items-center justify-between gap-2">
            <span className="dash-card-title text-xs font-semibold text-muted-foreground uppercase tracking-wider">Medications Due</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <Pill className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="dash-metric-text text-base sm:text-lg font-bold text-foreground">2 Doses Remaining</div>
            <p className="dash-caption text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">Next: Metformin at 8 PM</p>
          </div>
        </Card>
      </div>

      {/* ── Vitals & Health Snapshot ── */}
      <HealthSnapshotGrid />

      {/* ── Two-Column Layout: Care Plan & Ask DrGodly AI ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 space-y-6">
          <CarePlanChecklist />
          <div className="dash-card bg-card p-5 sm:p-6 rounded-2xl border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="dash-section-title text-foreground">
                Monthly Visit Trends
              </h3>
              <Badge variant="outline" className="text-xs text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800">
                Past 6 Months
              </Badge>
            </div>
            <div className="h-64 w-full">
              <AppointmentBarChart data={monthlyData} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <AskDrGodlyChatWidget />
          <RecentAppointmentsTable appointments={recentAppointments} />
        </div>
      </div>
    </div>
  );
}
