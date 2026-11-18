"use client";

import { AlertTriangle, Clock, FileCheck, Pill, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

interface AlertItem {
  id: string;
  type: "critical-lab" | "signature" | "refill";
  title: string;
  description: string;
  time: string;
  actionLabel: string;
  actionHref?: string;
}

const SAMPLE_ALERTS: AlertItem[] = [
  {
    id: "a1",
    type: "critical-lab",
    title: "Critical Lab: Serum Potassium 5.8 mEq/L",
    description: "Anjali Menon (42F) • High value flagged 45m ago",
    time: "45m ago",
    actionLabel: "Review Lab",
  },
  {
    id: "a2",
    type: "signature",
    title: "3 Draft SOAP Notes Awaiting Signature",
    description: "Yesterday's consultations need final approval",
    time: "2h ago",
    actionLabel: "Sign Notes",
  },
  {
    id: "a3",
    type: "refill",
    title: "Prescription Refill: Telmisartan 40mg",
    description: "Rahul Verma requested 30-day refill via portal",
    time: "4h ago",
    actionLabel: "Approve Refill",
  },
];

export function TasksAndAlertsCard() {
  return (
    <Card className="dash-card border border-border/80 bg-card rounded-2xl shadow-xs hover:shadow-md transition-all overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-2xs">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <CardTitle className="dash-section-title text-foreground">
            Tasks & Critical Alerts
          </CardTitle>
        </div>
        <Badge variant="outline" className="text-xs font-semibold bg-muted text-muted-foreground border-border px-2.5 py-0.5 rounded-full">
          3 Pending
        </Badge>
      </CardHeader>

      <CardContent className="pt-3 pb-3 divide-y divide-border/60">
        {SAMPLE_ALERTS.map((alert) => (
          <div key={alert.id} className="py-3 first:pt-1 last:pb-1 flex items-start justify-between gap-3 group hover:bg-muted/40 px-2 rounded-xl transition-colors duration-150">
            <div className="flex items-start gap-2.5">
              <div
                className={`p-2 rounded-xl shrink-0 mt-0.5 shadow-2xs transition-transform duration-150 group-hover:scale-105 ${
                  alert.type === "critical-lab"
                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                    : alert.type === "signature"
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                }`}
              >
                {alert.type === "critical-lab" && <AlertTriangle className="h-4 w-4" />}
                {alert.type === "signature" && <Clock className="h-4 w-4" />}
                {alert.type === "refill" && <Pill className="h-4 w-4" />}
              </div>
              <div className="space-y-0.5">
                <p className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{alert.title}</p>
                <p className="dash-caption text-[11px] sm:text-xs text-muted-foreground">{alert.description}</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="dash-btn-inline h-7 text-xs px-2.5 rounded-lg text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 border-teal-200 dark:border-teal-800 shrink-0 font-medium transition-all active:scale-[0.97]"
            >
              {alert.actionLabel}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
