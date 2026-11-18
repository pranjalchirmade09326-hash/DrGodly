/**
 * StatCard — practice-overview stat summary card for the doctor dashboard.
 *
 * Layer: client / telemedicine / doctor / component / dashboard-overview
 *
 * Displays a single stat (today's appointments, pending, completed, etc.)
 * with an icon, colour-coded background, numeric value, and an optional
 * "See details" link. Mirrors the patient portal's StatCard (same shape)
 * but kept as a local copy rather than a cross-module import — doctor and
 * patient are separate top-level client modules in this codebase.
 */

"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

/** Colour variant controls the card and icon background tones. */
type ColorVariant = "blue" | "rose" | "yellow" | "emerald" | "indigo" | "slate";

interface StatCardProps {
  /** Short label displayed in the card header (e.g. "Today", "Pending"). */
  title: string;
  /** Numeric value shown prominently in the card body. */
  value: number;
  /** Lucide icon shown alongside the count. */
  icon: LucideIcon;
  /** Colour scheme for card background and icon container. */
  colorVariant: ColorVariant;
  /** Secondary note shown in the card footer. */
  note: string;
  /** Link target for the "See details" button — omit to hide the link. */
  href?: string;
}

// ── Colour maps ───────────────────────────────────────────────────────────────

const cardBg: Record<ColorVariant, string> = {
  blue: "bg-blue-600/10 dark:bg-blue-600/20",
  rose: "bg-rose-600/10 dark:bg-rose-600/20",
  yellow: "bg-yellow-600/10 dark:bg-yellow-600/20",
  emerald: "bg-emerald-600/10 dark:bg-emerald-600/20",
  indigo: "bg-indigo-600/10 dark:bg-indigo-600/20",
  slate: "bg-slate-600/10 dark:bg-slate-600/20",
};

const iconBg: Record<ColorVariant, string> = {
  blue: "bg-blue-600/20 text-blue-600",
  rose: "bg-rose-600/20 text-rose-600",
  yellow: "bg-yellow-600/20 text-yellow-600",
  emerald: "bg-emerald-600/20 text-emerald-600",
  indigo: "bg-indigo-600/20 text-indigo-600",
  slate: "bg-slate-600/20 text-slate-600",
};

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Renders a coloured stat card with icon, count, and an optional details link.
 *
 * @param title - Card header label.
 * @param value - Numeric stat to display.
 * @param icon - Lucide icon component.
 * @param colorVariant - Colour scheme key.
 * @param note - Footer note text.
 * @param href - "See details" link target; omitted hides the link entirely.
 */
export function StatCard({
  title,
  value,
  icon: Icon,
  colorVariant,
  note,
  href,
}: StatCardProps) {
  return (
    <Card className={cn("dash-kpi-card border border-border/70 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all gap-0 flex flex-col justify-between h-full", cardBg[colorVariant])}>
      <CardHeader className="flex flex-row items-center justify-between p-0 pb-3">
        <h3 className="dash-card-title text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
        {href && (
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="text-xs h-auto p-0 font-medium opacity-80 hover:opacity-100 hover:bg-transparent hover:underline transition-opacity"
          >
            <Link href={href}>See details</Link>
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-0 pb-3">
        <div className="flex items-center gap-3.5">
          <div
            className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs transition-transform duration-200 group-hover:scale-105",
              iconBg[colorVariant],
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <span className="dash-metric-text text-2xl font-bold tracking-tight text-foreground">
            {value.toLocaleString()}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-0 pt-1">
        <p className="dash-caption text-xs text-muted-foreground leading-tight">{note}</p>
      </CardFooter>
    </Card>
  );
}
