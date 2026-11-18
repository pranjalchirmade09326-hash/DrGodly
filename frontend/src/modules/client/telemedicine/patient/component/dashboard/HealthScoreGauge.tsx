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
    <Card className="dash-card h-full flex flex-col justify-between border-border/80 bg-gradient-to-br from-card via-card to-teal-500/5 rounded-2xl shadow-xs hover:shadow-md transition-all overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 shadow-2xs">
            <Activity className="h-4 w-4" />
          </div>
          <CardTitle className="dash-section-title text-foreground">
            DrGodly Health Score
          </CardTitle>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border-emerald-500/20 px-2.5 py-0.5 rounded-full">
          Optimal
        </Badge>
      </CardHeader>

      <CardContent className="pt-5 pb-6 flex flex-col sm:flex-row items-center justify-between gap-6 flex-1">
        {/* SVG Circular Progress Ring */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-muted/60 stroke-current"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-emerald-500 stroke-current transition-all duration-1000 ease-out"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="dash-metric-text text-3xl font-extrabold text-foreground tracking-tight">
              {score}
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              / 100
            </span>
          </div>
        </div>

        {/* Narrative & Contributing Factors */}
        <div className="space-y-2.5 text-center sm:text-left flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{label}</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Your cardiovascular health, glucose control, and medication compliance are well balanced.
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-teal-600 dark:text-teal-400 font-medium">
            <TrendingUp className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
            <span>{changeNote}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
