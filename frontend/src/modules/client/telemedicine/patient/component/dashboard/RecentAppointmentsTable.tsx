/**
 * RecentAppointmentsTable — patient dashboard widget showing the 5 most-recent appointments.
 *
 * Layer: client / telemedicine / patient / component / dashboard
 *
 * A lightweight, non-paginated table displaying appointment date, time, doctor,
 * and status badge. Consumed only by PatientDashboard (not the full appointments list page).
 * Status badges map FHIR status codes to human-readable labels and colours.
 */

"use client";

import { formatDisplayDate, formatDisplayTime } from "@/modules/shared/helper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

/** Minimal appointment record needed for this widget. */
export interface DashboardAppointment {
  id: number;
  /** ISO datetime string, e.g. "2026-06-15T09:30:00Z". */
  date?: string | null;
  /** Doctor display name derived from participants. */
  doctorName?: string | null;
  /** FHIR appointment status code. */
  status?: string | null;
}

interface RecentAppointmentsTableProps {
  /** Up to 5 appointments to render. */
  appointments: DashboardAppointment[];
}

// ── Status badge config ───────────────────────────────────────────────────────

/** Maps FHIR appointment status to display label and Tailwind colour class. */
const STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  fulfilled: {
    label: "Completed",
    className: "bg-emerald-600/10 text-emerald-600 border-emerald-600/20",
  },
  booked: {
    label: "Booked",
    className: "bg-blue-600/10 text-blue-600 border-blue-600/20",
  },
  pending: {
    label: "Pending",
    className: "bg-yellow-600/10 text-yellow-700 border-yellow-600/20",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-rose-600/10 text-rose-600 border-rose-600/20",
  },
  noshow: {
    label: "No-show",
    className: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  },
  arrived: {
    label: "Arrived",
    className: "bg-indigo-600/10 text-indigo-600 border-indigo-600/20",
  },
};

/**
 * Returns a localised date string for display in the table.
 *
 * @param iso - ISO 8601 datetime string.
 * @returns Human-readable date, e.g. "Jun 15, 2026".
 */
function formatDate(iso: string): string {
  return formatDisplayDate(iso);
}

/**
 * Returns a localised time string for display in the table.
 *
 * @param iso - ISO 8601 datetime string (same value formatDate reads).
 * @returns Human-readable time, e.g. "9:30 AM".
 */
function formatTime(iso: string): string {
  return formatDisplayTime(iso);
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Renders a compact table of recent appointments with status badges.
 * Shows a "No appointments yet" empty state when the array is empty.
 *
 * @param appointments - Array of up to 5 appointment records.
 */
export function RecentAppointmentsTable({ appointments }: RecentAppointmentsTableProps) {
  return (
    <Card className="dash-card p-5 sm:p-6 rounded-2xl border border-border shadow-xs hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/60">
        <h2 className="dash-section-title text-foreground">Recent Appointments</h2>
        <Button
          asChild
          size="sm"
          variant="ghost"
          className="text-xs h-auto p-0 font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 hover:bg-transparent hover:underline transition-colors"
        >
          <Link href="/bezs/telemedicine/patient/appointments">See all</Link>
        </Button>
      </div>

      {appointments.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No appointments yet.
        </p>
      ) : (
        <div className="dash-table-container rounded-xl overflow-hidden border border-border/60">
          <Table className="dash-table w-full">
            <TableHeader>
              <TableRow className="bg-muted/40 border-b border-border/60">
                <TableHead className="font-semibold text-xs text-muted-foreground py-2.5 px-3">Date</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground py-2.5 px-3">Time</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground py-2.5 px-3">Doctor</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground py-2.5 px-3 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/40">
              {appointments.map((appt) => {
                const statusCfg =
                  STATUS_CONFIG[appt.status ?? ""] ?? {
                    label: appt.status ?? "Unknown",
                    className:
                      "bg-gray-500/10 text-gray-500 border-gray-500/20",
                  };

                return (
                  <TableRow key={appt.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="text-xs sm:text-sm font-medium py-3 px-3">
                      {appt.date ? formatDate(appt.date) : "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground py-3 px-3">
                      {appt.date ? formatTime(appt.date) : "—"}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm font-semibold text-foreground py-3 px-3">
                      {appt.doctorName ?? "—"}
                    </TableCell>
                    <TableCell className="py-3 px-3 text-right">
                      <Badge
                        variant="outline"
                        className={cn("text-xs capitalize font-semibold px-2.5 py-0.5 rounded-full border shadow-2xs", statusCfg.className)}
                      >
                        {statusCfg.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}
