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
    <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-xs overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base font-semibold text-slate-900">
            Today&apos;s Appointments Queue
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Patients scheduled for today with real-time AI intake status
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl text-xs">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filter === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Today ({queue.length})
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filter === "upcoming" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Upcoming (3)
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filter === "completed" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Completed (1)
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-medium">
            <tr>
              <th className="py-2.5 px-4">Time & Type</th>
              <th className="py-2.5 px-4">Patient Details</th>
              <th className="py-2.5 px-4">Reason for Visit</th>
              <th className="py-2.5 px-4">AI Intake Status</th>
              <th className="py-2.5 px-4">Triage</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {queue.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                {/* Time & Type */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="font-semibold text-slate-900">{item.time}</div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                    {item.type === "video" ? (
                      <>
                        <Video className="h-3 w-3 text-teal-600" />
                        <span>Video Consult</span>
                      </>
                    ) : (
                      <>
                        <Stethoscope className="h-3 w-3 text-indigo-600" />
                        <span>In-Person</span>
                      </>
                    )}
                  </div>
                </td>

                {/* Patient Details */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2.5">
                    {item.avatarUrl ? (
                      <img
                        src={item.avatarUrl}
                        alt={item.patientName}
                        className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0 shadow-2xs"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-teal-100 text-teal-800 font-semibold flex items-center justify-center text-xs shrink-0">
                        {item.patientName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-slate-900">{item.patientName}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{item.patientAgeGender}</div>
                    </div>
                  </div>
                </td>

                {/* Reason */}
                <td className="py-3 px-4 max-w-[200px] truncate text-slate-700">
                  {item.reason}
                </td>

                {/* AI Intake Status */}
                <td className="py-3 px-4 whitespace-nowrap">
                  {item.intakeStatus === "completed" && (
                    <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 font-medium text-[11px] flex items-center gap-1 w-fit">
                      <CheckCircle2 className="h-3 w-3" />
                      AI Intake Complete
                    </Badge>
                  )}
                  {item.intakeStatus === "in-progress" && (
                    <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60 font-medium text-[11px] flex items-center gap-1 w-fit">
                      <Clock className="h-3 w-3" />
                      In Progress
                    </Badge>
                  )}
                  {item.intakeStatus === "not-started" && (
                    <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 font-medium text-[11px] w-fit">
                      Not Started
                    </Badge>
                  )}
                </td>

                {/* Priority */}
                <td className="py-3 px-4 whitespace-nowrap">
                  {item.priority === "urgent" ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                      Urgent
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
                      Routine
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3 px-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`${consultationBaseHref}?appointmentId=${item.id}`}>
                      <Button
                        size="sm"
                        className="h-7 text-xs px-3 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-xs font-medium"
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
