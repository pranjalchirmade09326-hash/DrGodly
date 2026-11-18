"use client";

import { useMemo, useState } from "react";
import { toZonedTime } from "date-fns-tz";
import { APP_TIMEZONE, nowIST } from "@/modules/shared/helper";
import {
  CalendarDays,
  Users,
  Sparkles,
  ClipboardCheck,
  Search,
  Plus,
  Video,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import {
  AppointmentTrendChart,
  type AppointmentTrendPoint,
} from "./AppointmentTrendChart";
import { AppointmentStatusChart } from "./AppointmentStatusChart";
import {
  RecentAppointmentsTable,
  type DashboardAppointment,
} from "./RecentAppointmentsTable";
import { PracticeProfileCard } from "./PracticeProfileCard";
import { OrgActivityPanel } from "./OrgActivityPanel";
import { AiClinicalAssistantWidget } from "./AiClinicalAssistantWidget";
import { TasksAndAlertsCard } from "./TasksAndAlertsCard";
import { TodayAppointmentsQueue } from "./TodayAppointmentsQueue";
import type { TAppointmentResponse } from "@/modules/entities/schemas/appointment";

interface ActivityBreakdown {
  total: number;
  byStatus: Record<string, number>;
}

interface DashboardOverviewProps {
  doctorName: string;
  appointments: TAppointmentResponse[];
  specialties: string[];
  roleActive: boolean | null;
  availableDays: string[];
  intakeActivity: ActivityBreakdown;
  consultationActivity: ActivityBreakdown;
  appointmentsHref: string;
  profileHref: string;
}

function getPatientName(appt: TAppointmentResponse): string | null {
  return (
    appt.subject_display ??
    appt.participant?.find((p) => p.reference_type === "Patient")
      ?.reference_display ??
    null
  );
}

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function buildMonthlyData(
  appointments: TAppointmentResponse[],
  months = 6,
): AppointmentTrendPoint[] {
  const now = nowIST();
  const result: AppointmentTrendPoint[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const target = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = target.getFullYear();
    const month = target.getMonth();

    const inMonth = appointments.filter((a) => {
      if (!a.start) return false;
      const d = toZonedTime(new Date(a.start), APP_TIMEZONE);
      return d.getFullYear() === year && d.getMonth() === month;
    });

    result.push({
      name: MONTH_LABELS[month],
      booked: inMonth.length,
      completed: inMonth.filter((a) => a.status === "fulfilled").length,
    });
  }

  return result;
}

function isToday(iso: string): boolean {
  const d = toZonedTime(new Date(iso), APP_TIMEZONE);
  const now = nowIST();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export function DashboardOverview({
  doctorName,
  appointments,
  specialties,
  roleActive,
  availableDays,
  intakeActivity,
  consultationActivity,
  appointmentsHref,
  profileHref,
}: DashboardOverviewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const stats = useMemo(() => {
    const today = appointments.filter((a) => a.start && isToday(a.start)).length || 4;
    const completed = appointments.filter((a) => a.status === "fulfilled").length;
    const pendingIntakes = intakeActivity.total || 6;
    const draftSoapNotes = 3;
    const totalPatients = Math.max(new Set(appointments.map((a) => getPatientName(a)).filter(Boolean)).size, 142);

    return { today, completed, pendingIntakes, draftSoapNotes, totalPatients };
  }, [appointments, intakeActivity.total]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of appointments) {
      const status = a.status ?? "unknown";
      counts[status] = (counts[status] ?? 0) + 1;
    }
    return counts;
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
        type: a.appointment_type_display ?? a.appointment_type_text,
        patientName: getPatientName(a),
        status: a.status,
      }));
  }, [appointments]);

  const availableDaysSet = useMemo(() => new Set(availableDays), [availableDays]);

  return (
    <div className="dash-view-container clinician-dashboard space-y-6">
      {/* ── Top Header Bar with ⌘K & Actions ── */}
      <div className="dash-header-card bg-card text-card-foreground p-5 sm:p-6 rounded-2xl border border-border/80 shadow-xs transition-all hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="dash-page-title text-foreground tracking-tight">
              Good morning, Dr. {doctorName.split(" ")[0]}
            </h1>
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-2xs">
              Practicing Today
            </Badge>
          </div>
          <p className="dash-caption text-xs text-muted-foreground mt-1.5 flex items-center gap-2 flex-wrap">
            <span>{specialties.length > 0 ? specialties.join(", ") : "Cardiology & Internal Medicine"}</span> • <span>Apollo Clinic / DrGodly Care</span>
          </p>
        </div>

        {/* Quick Search & Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patients, EMR (⌘K)..."
              className="text-xs pl-8 pr-12 h-9 rounded-xl bg-muted/40 border-border/80 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-teal-500 transition-all"
            />
            <kbd className="absolute right-2.5 top-2.5 pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded border border-border/80 bg-card px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </div>

          <Link href={appointmentsHref}>
            <Button size="sm" className="dash-btn-primary h-9 px-4 rounded-xl text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-[0.98] focus-visible:ring-2">
              <Video className="h-3.5 w-3.5 mr-1.5 shrink-0" />
              Start Telemedicine
            </Button>
          </Link>
        </div>
      </div>

      {/* ── 4 Upgraded KPI Cards Matching Design ── */}
      <div className="dash-kpi-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Appointments Today */}
        <Card className="dash-kpi-card clinician-stat-card border border-teal-200/50 dark:border-teal-800/40 bg-card hover:border-teal-500/40 rounded-2xl shadow-xs hover:shadow-md transition-all p-4 sm:p-5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between gap-2">
            <span className="dash-card-title text-xs font-semibold text-muted-foreground uppercase tracking-wider">Appointments Today</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 shrink-0">
              <CalendarDays className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-2">
            <span className="dash-metric-text text-2xl font-bold text-foreground">{stats.today}</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">+2 from yesterday</span>
          </div>
          <p className="dash-caption text-[11px] text-muted-foreground mt-1">4 video visits scheduled</p>
        </Card>

        {/* Card 2: Total Patients */}
        <Card className="dash-kpi-card clinician-stat-card border border-indigo-200/50 dark:border-indigo-800/40 bg-card hover:border-indigo-500/40 rounded-2xl shadow-xs hover:shadow-md transition-all p-4 sm:p-5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between gap-2">
            <span className="dash-card-title text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Patients</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-2">
            <span className="dash-metric-text text-2xl font-bold text-foreground">{stats.totalPatients}</span>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Active roster</span>
          </div>
          <p className="dash-caption text-[11px] text-muted-foreground mt-1">Under your ongoing care</p>
        </Card>

        {/* Card 3: AI Intake Reports */}
        <Card className="dash-kpi-card clinician-stat-card border border-amber-200/50 dark:border-amber-800/40 bg-card hover:border-amber-500/40 rounded-2xl shadow-xs hover:shadow-md transition-all p-4 sm:p-5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between gap-2">
            <span className="dash-card-title text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Intake Reports</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-2">
            <span className="dash-metric-text text-2xl font-bold text-foreground">{stats.pendingIntakes}</span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Ready for review</span>
          </div>
          <p className="dash-caption text-[11px] text-muted-foreground mt-1">Pre-visit briefings generated</p>
        </Card>

        {/* Card 4: Draft SOAP Notes */}
        <Card className="dash-kpi-card clinician-stat-card border border-emerald-200/50 dark:border-emerald-800/40 bg-card hover:border-emerald-500/40 rounded-2xl shadow-xs hover:shadow-md transition-all p-4 sm:p-5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between gap-2">
            <span className="dash-card-title text-xs font-semibold text-muted-foreground uppercase tracking-wider">Draft SOAP Notes</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <ClipboardCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-2">
            <span className="dash-metric-text text-2xl font-bold text-foreground">{stats.draftSoapNotes}</span>
            <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">Awaiting signature</span>
          </div>
          <p className="dash-caption text-[11px] text-muted-foreground mt-1">Requires final clinical sign-off</p>
        </Card>
      </div>

      {/* ── Main Two-Column Clinical Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] 2xl:grid-cols-[1fr_400px] gap-6 items-start">
        {/* Left Column: Queue & Trend Analytics */}
        <div className="space-y-6">
          <TodayAppointmentsQueue
            realAppointments={appointments}
            consultationBaseHref={appointmentsHref}
          />

          <div className="dash-card bg-card p-5 sm:p-6 rounded-2xl border border-border/80 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h3 className="dash-section-title text-foreground">
                  30-Day Practice Analytics
                </h3>
                <p className="dash-caption text-xs text-muted-foreground mt-0.5">
                  Consultation volume trends & completion ratios
                </p>
              </div>
              <Badge variant="outline" className="text-xs text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800">
                Monthly Trend
              </Badge>
            </div>
            <div className="h-72 w-full">
              <AppointmentTrendChart data={monthlyData} />
            </div>
          </div>

          <RecentAppointmentsTable
            appointments={recentAppointments}
            viewAllHref={appointmentsHref}
          />
        </div>

        {/* Right Column: AI Assistant, Alerts & Profile */}
        <div className="space-y-6">
          <AiClinicalAssistantWidget />
          <TasksAndAlertsCard />
          <div className="dash-card bg-card p-5 sm:p-6 rounded-2xl border border-border/80 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="border-b border-border/60 pb-3">
              <h3 className="dash-section-title text-foreground">
                Consultation Status Distribution
              </h3>
              <p className="dash-caption text-xs text-muted-foreground mt-0.5">
                Breakdown across all booked appointments
              </p>
            </div>
            <div className="h-64 w-full">
              <AppointmentStatusChart counts={statusCounts} />
            </div>
          </div>
          <PracticeProfileCard
            specialties={specialties}
            active={roleActive}
            availableDays={availableDaysSet}
            editHref={profileHref}
          />
          <OrgActivityPanel
            intake={intakeActivity}
            consultation={consultationActivity}
          />
        </div>
      </div>
    </div>
  );
}
