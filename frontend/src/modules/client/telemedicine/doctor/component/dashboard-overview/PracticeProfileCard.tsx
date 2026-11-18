/**
 * PracticeProfileCard — doctor's own PractitionerRole summary card for the
 * practice-overview dashboard.
 *
 * Layer: client / telemedicine / doctor / component / dashboard-overview
 *
 * Shows specialty, active/inactive status, and which days of the week the
 * doctor has declared availability on — read straight off the
 * PractitionerRole's own `availability[].available_times[].days_of_week`
 * data, the same field the booking wizard's calendar hint already reads
 * (BookAppointment.tsx). No separate fetch of slot data needed.
 */

"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { CalendarCheck2, Stethoscope } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface PracticeProfileCardProps {
  /** Practice specialty label(s), e.g. ["Cardiology"]. Empty if none declared. */
  specialties: string[];
  /** Whether the PractitionerRole is currently active. */
  active: boolean | null;
  /** Lowercase 3-letter weekday codes with declared availability, e.g. {"mon","wed"}. */
  availableDays: Set<string>;
  /** Link to the doctor's profile settings page for editing. */
  editHref: string;
}

// ── Weekday chips ─────────────────────────────────────────────────────────────

/** FHIR R4 DaysOfWeek codes in display order, paired with a single-letter label. */
const WEEKDAYS: { code: string; label: string }[] = [
  { code: "sun", label: "S" },
  { code: "mon", label: "M" },
  { code: "tue", label: "T" },
  { code: "wed", label: "W" },
  { code: "thu", label: "T" },
  { code: "fri", label: "F" },
  { code: "sat", label: "S" },
];

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Renders the doctor's specialty, active status, and weekly availability chips.
 *
 * @param specialties - Specialty display labels.
 * @param active - PractitionerRole active flag.
 * @param availableDays - Set of weekday codes with declared availability.
 * @param editHref - Link to the profile settings page.
 */
export function PracticeProfileCard({
  specialties,
  active,
  availableDays,
  editHref,
}: PracticeProfileCardProps) {
  return (
    <Card className="dash-card p-5 sm:p-6 rounded-2xl border border-border/80 shadow-xs hover:shadow-md transition-all space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <h2 className="dash-section-title text-foreground flex items-center gap-2">
          <Stethoscope className="size-4 text-teal-600 dark:text-teal-400" />
          Practice Profile
        </h2>
        <Button
          asChild
          size="sm"
          variant="ghost"
          className="text-xs h-auto p-0 font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 hover:bg-transparent hover:underline transition-colors"
        >
          <Link href={editHref}>Edit</Link>
        </Button>
      </div>

      {/* Specialty + active status */}
      <div className="flex flex-wrap items-center gap-2">
        {specialties.length > 0 ? (
          specialties.map((s) => (
            <Badge key={s} variant="secondary" className="text-xs font-medium px-2.5 py-0.5 rounded-lg bg-muted text-foreground border border-border/60">
              {s}
            </Badge>
          ))
        ) : (
          <span className="text-xs text-muted-foreground">
            No specialty on file
          </span>
        )}
        <Badge
          variant="outline"
          className={cn(
            "text-xs ml-auto font-semibold px-2.5 py-0.5 rounded-full border shadow-2xs",
            active
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-border bg-muted text-muted-foreground",
          )}
        >
          {active ? "Active" : "Inactive"}
        </Badge>
      </div>

      {/* Weekly availability */}
      <div className="pt-1">
        <p className="dash-caption text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <CalendarCheck2 className="size-3.5 text-teal-600 dark:text-teal-400" />
          Weekly Availability
        </p>
        {availableDays.size === 0 ? (
          <p className="text-xs text-muted-foreground">
            No availability declared yet.
          </p>
        ) : (
          <div className="flex gap-1.5">
            {WEEKDAYS.map(({ code, label }) => {
              const isAvailable = availableDays.has(code);
              return (
                <div
                  key={code}
                  title={code}
                  className={cn(
                    "flex-1 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all shadow-2xs select-none",
                    isAvailable
                      ? "bg-teal-600 dark:bg-teal-700 text-white hover:scale-105"
                      : "bg-muted/70 text-muted-foreground/50",
                  )}
                >
                  {label}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
