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
    <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-xs overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200/60">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <CardTitle className="text-base font-semibold text-slate-900">
            Tasks & Critical Alerts
          </CardTitle>
        </div>
        <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200">
          3 Pending
        </Badge>
      </CardHeader>

      <CardContent className="pt-3 divide-y divide-slate-100">
        {SAMPLE_ALERTS.map((alert) => (
          <div key={alert.id} className="py-3 first:pt-1 last:pb-1 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div
                className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                  alert.type === "critical-lab"
                    ? "bg-rose-50 text-rose-600 border border-rose-200/60"
                    : alert.type === "signature"
                    ? "bg-amber-50 text-amber-600 border border-amber-200/60"
                    : "bg-blue-50 text-blue-600 border border-blue-200/60"
                }`}
              >
                {alert.type === "critical-lab" && <AlertTriangle className="h-3.5 w-3.5" />}
                {alert.type === "signature" && <Clock className="h-3.5 w-3.5" />}
                {alert.type === "refill" && <Pill className="h-3.5 w-3.5" />}
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-slate-900">{alert.title}</p>
                <p className="text-[11px] text-slate-500">{alert.description}</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs px-2.5 rounded-lg text-teal-700 hover:text-teal-800 hover:bg-teal-50 border-teal-200 shrink-0"
            >
              {alert.actionLabel}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
