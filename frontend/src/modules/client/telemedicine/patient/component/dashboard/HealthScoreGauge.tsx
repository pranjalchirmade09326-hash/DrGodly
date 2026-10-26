"use client";

import { Activity, ShieldCheck, TrendingUp, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HealthScoreGaugeProps {
  score?: number;
  label?: string;
  changeNote?: string;
}

export function HealthScoreGauge({
  score = 78,
  label = "Good Condition",
  changeNote = "+5 pts this month for blood pressure adherence",
}: HealthScoreGaugeProps) {
  // SVG calculation for circular gauge: radius 45 -> circumference ~ 283
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className="border border-teal-200/60 bg-gradient-to-br from-white via-teal-50/20 to-emerald-50/30 rounded-2xl shadow-xs overflow-hidden">
      <CardHeader className="pb-2 border-b border-teal-100/60 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-600 text-white shadow-xs">
            <Activity className="h-4 w-4" />
          </div>
          <CardTitle className="text-base font-semibold text-slate-900">
            DrGodly Health Score
          </CardTitle>
        </div>
        <Badge className="bg-emerald-100 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
          Optimal
        </Badge>
      </CardHeader>

      <CardContent className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-5">
        {/* SVG Circular Progress Ring */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-slate-100 stroke-current"
              strokeWidth="9"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-emerald-500 stroke-current transition-all duration-1000 ease-out"
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {score}
            </span>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
              / 100
            </span>
          </div>
        </div>

        {/* Narrative & Contributing Factors */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{label}</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your cardiovascular health, glucose control, and medication compliance are well balanced.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-teal-700 font-medium">
            <TrendingUp className="h-3.5 w-3.5 text-teal-600" />
            <span>{changeNote}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
