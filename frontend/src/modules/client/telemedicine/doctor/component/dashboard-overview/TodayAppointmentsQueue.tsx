"use client";

import { useState } from "react";
import { Video, User, CheckCircle2, Clock, FileText, ChevronRight, AlertCircle, Stethoscope } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { TAppointmentResponse } from "@/modules/entities/schemas/appointment";

export interface QueueAppointment {
  id: number | string;
  patientName: string;
  patientAgeGender: string;
  avatarUrl?: string;
  time: string;
  type: "video" | "in-person";
  reason: string;
  intakeStatus: "completed" | "in-progress" | "not-started";
  priority: "routine" | "urgent" | "critical";
  status: string;
}

const SAMPLE_QUEUE: QueueAppointment[] = [
  {
    id: 101,
    patientName: "Anjali Menon",
    patientAgeGender: "42, Female",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    time: "10:30 AM",
    type: "video",
    reason: "Hypertension & Diabetes Follow-up",
    intakeStatus: "completed",
    priority: "routine",
    status: "booked",
  },
  {
    id: 102,
    patientName: "Rahul Verma",
    patientAgeGender: "35, Male",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    time: "11:15 AM",
    type: "video",
    reason: "Acute Bronchitis & Persistent Cough",
    intakeStatus: "in-progress",
    priority: "urgent",
    status: "arrived",
  },
  {
    id: 103,
    patientName: "Meera Nair",
    patientAgeGender: "58, Female",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    time: "02:00 PM",
    type: "in-person",
    reason: "Cardiology Review & ECG Evaluation",
    intakeStatus: "completed",
    priority: "routine",
    status: "booked",
  },
  {
    id: 104,
    patientName: "Sanjay Patel",
    patientAgeGender: "29, Male",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    time: "03:30 PM",
    type: "video",
    reason: "Lab Report Discussion (Lipid Profile)",
    intakeStatus: "not-started",
    priority: "routine",
    status: "booked",
  },
];

interface TodayAppointmentsQueueProps {
  realAppointments?: TAppointmentResponse[];
  consultationBaseHref?: string;
}

export function TodayAppointmentsQueue({
  realAppointments = [],
  consultationBaseHref = "/doctor/appointments/online-consultation",
}: TodayAppointmentsQueueProps) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");

  const queue = SAMPLE_QUEUE;

  return (
    <Card className="dash-card border border-border/80 bg-card rounded-2xl shadow-xs hover:shadow-md transition-all overflow-hidden">
      <CardHeader className="pb-3.5 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card">
        <div>
          <CardTitle className="dash-section-title text-foreground">
            Today&apos;s Appointments Queue
          </CardTitle>
          <p className="dash-caption text-xs text-muted-foreground mt-0.5">
            Patients scheduled for today with real-time AI intake status
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl text-xs border border-border/40">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filter === "all" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            }`}
          >
            All Today ({queue.length})
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filter === "upcoming" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            }`}
          >
            Upcoming (3)
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filter === "completed" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            }`}
          >
            Completed (1)
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto dash-table-container border-0 rounded-none">
        <table className="dash-table w-full text-left text-xs">
          <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold uppercase text-[11px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Time & Type</th>
              <th className="py-3 px-4">Patient Details</th>
              <th className="py-3 px-4">Reason for Visit</th>
              <th className="py-3 px-4">AI Intake Status</th>
              <th className="py-3 px-4">Triage</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {queue.map((item) => (
              <tr key={item.id} className="hover:bg-muted/50 transition-colors duration-150 group cursor-default">
                {/* Time & Type */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="font-bold text-foreground text-xs sm:text-sm">{item.time}</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                    {item.type === "video" ? (
                      <>
                        <Video className="h-3 w-3 text-teal-600 dark:text-teal-400 shrink-0" />
                        <span>Video Consult</span>
                      </>
                    ) : (
                      <>
                        <Stethoscope className="h-3 w-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span>In-Person</span>
                      </>
                    )}
                  </div>
                </td>

                {/* Patient Details */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2.5">
                    {item.avatarUrl ? (
                      <img
                        src={item.avatarUrl}
                        alt={item.patientName}
                        className="h-9 w-9 rounded-full object-cover ring-1 ring-border shrink-0 shadow-2xs"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-400 font-bold flex items-center justify-center text-xs shrink-0">
                        {item.patientName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-foreground text-xs sm:text-sm">{item.patientName}</div>
                      <div className="text-[11px] text-muted-foreground font-medium">{item.patientAgeGender}</div>
                    </div>
                  </div>
                </td>

                {/* Reason */}
                <td className="py-3.5 px-4 max-w-[200px] truncate text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  {item.reason}
                </td>

                {/* AI Intake Status */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {item.intakeStatus === "completed" && (
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold text-[11px] flex items-center gap-1.5 px-2.5 py-0.5 rounded-full shadow-2xs w-fit">
                      <CheckCircle2 className="h-3 w-3 shrink-0" />
                      AI Intake Complete
                    </Badge>
                  )}
                  {item.intakeStatus === "in-progress" && (
                    <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-semibold text-[11px] flex items-center gap-1.5 px-2.5 py-0.5 rounded-full shadow-2xs w-fit">
                      <Clock className="h-3 w-3 shrink-0" />
                      In Progress
                    </Badge>
                  )}
                  {item.intakeStatus === "not-started" && (
                    <Badge variant="outline" className="bg-muted text-muted-foreground border-border/80 font-medium text-[11px] px-2.5 py-0.5 rounded-full w-fit">
                      Not Started
                    </Badge>
                  )}
                </td>

                {/* Priority */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {item.priority === "urgent" ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shadow-2xs">
                      Urgent
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-2xs">
                      Routine
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`${consultationBaseHref}?appointmentId=${item.id}`}>
                      <Button
                        size="sm"
                        className="dash-btn-inline h-8 text-xs px-3.5 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-xs font-semibold tracking-wide transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-teal-500"
                      >
                        Start Consultation
                      </Button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
