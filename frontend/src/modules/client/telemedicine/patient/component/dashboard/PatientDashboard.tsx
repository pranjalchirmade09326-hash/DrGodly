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
    <div className="space-y-6">
      {/* ── Patient Welcome Header with ABHA Verification ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Hello, {userName} 👋
            </h1>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              ABHA Verified
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Age: 42 • Female • ABHA ID: <span className="font-mono font-medium text-slate-700">91-4821-9032-1104</span>
          </p>
        </div>

        <Link href="/patient/appointments/book">
          <Button size="sm" className="h-9 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-medium shadow-xs text-xs">
            <Plus className="h-3.5 w-3.5 mr-1" />
            Book New Consultation
          </Button>
        </Link>
      </div>

      {/* ── Health Score Gauge & Next Visit Spotlight ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <HealthScoreGauge score={78} label="Good Condition" changeNote="+5 pts for blood pressure adherence" />
        </div>

        {/* Next Visit Launcher Card */}
        <div className="lg:col-span-5">
          <Card className="border border-teal-200/80 bg-gradient-to-br from-teal-600 to-emerald-700 text-white rounded-2xl shadow-xs p-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between text-teal-100 text-xs font-medium">
                <span className="flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                  <Video className="h-4 w-4" /> Next Appointment
                </span>
                <span className="bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[11px] text-white">
                  Today, 10:30 AM
                </span>
              </div>

              <div className="mt-3.5 space-y-1">
                <h3 className="text-lg font-bold">Dr. Priya Sharma</h3>
                <p className="text-xs text-teal-100">
                  Cardiology & Internal Medicine • Apollo Clinic
                </p>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Badge className="bg-emerald-400/30 text-white border-white/20 text-[11px]">
                  ✓ AI Intake Submitted
                </Badge>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/20 flex items-center justify-between">
              <span className="text-xs text-teal-100">Room opens 10m before visit</span>
              <Link href="/patient/appointments/online-consultation?appointmentId=101">
                <Button size="sm" className="bg-white text-teal-900 hover:bg-teal-50 font-semibold rounded-xl text-xs shadow-xs h-8 px-3">
                  Join Video Visit →
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* ── 4 Patient Status KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Next Appointment */}
        <Card className="border border-teal-100 bg-white rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Next Visit</span>
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="text-base font-bold text-slate-900">Today, 10:30 AM</div>
          <p className="text-[11px] text-teal-700 font-medium">Dr. Priya Sharma (Video)</p>
        </Card>

        {/* Card 2: AI Intake Status */}
        <Card className="border border-emerald-100 bg-white rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">AI Intake Status</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="text-base font-bold text-emerald-700 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" /> Completed
          </div>
          <p className="text-[11px] text-slate-500">Submitted 15 mins ago</p>
        </Card>

        {/* Card 3: Care Plan Goals */}
        <Card className="border border-indigo-100 bg-white rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Care Plan Goals</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="text-base font-bold text-slate-900">4 of 6 (67%)</div>
          <p className="text-[11px] text-indigo-600 font-medium">Daily walks on track</p>
        </Card>

        {/* Card 4: Medications Due */}
        <Card className="border border-amber-100 bg-white rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Medications Due</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <Pill className="h-4 w-4" />
            </div>
          </div>
          <div className="text-base font-bold text-slate-900">2 Doses Remaining</div>
          <p className="text-[11px] text-amber-700 font-medium">Next: Metformin at 8 PM</p>
        </Card>
      </div>

      {/* ── Vitals & Health Snapshot ── */}
      <HealthSnapshotGrid />

      {/* ── Two-Column Layout: Care Plan & Ask DrGodly AI ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-6">
          <CarePlanChecklist />
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">
              Monthly Visit Trends
            </h3>
            <div className="h-64">
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
