"use client";

import { useState } from "react";
import { Heart, Activity, Scale, Footprints, Plus, CheckCircle2, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function HealthSnapshotGrid() {
  const [open, setOpen] = useState(false);
  const [systolic, setSystolic] = useState("128");
  const [diastolic, setDiastolic] = useState("82");
  const [glucose, setGlucose] = useState("104");

  return (
    <Card className="dash-card border border-border/80 bg-card rounded-2xl shadow-xs hover:shadow-md transition-all overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="dash-section-title text-foreground">
            My Health Snapshot
          </CardTitle>
          <p className="dash-caption text-xs text-muted-foreground mt-0.5">
            Key vitals and biometric indicators from EMR & wearables
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="dash-btn-inline h-8 text-xs rounded-xl border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 gap-1.5 shadow-2xs transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Log Vitals</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px] rounded-2xl border-border bg-card">
            <DialogHeader>
              <DialogTitle className="dash-card-title text-foreground">Log Biometric Reading</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground font-medium">Systolic BP (mmHg)</Label>
                  <Input value={systolic} onChange={(e) => setSystolic(e.target.value)} className="h-9 text-xs rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground font-medium">Diastolic BP (mmHg)</Label>
                  <Input value={diastolic} onChange={(e) => setDiastolic(e.target.value)} className="h-9 text-xs rounded-xl" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground font-medium">Blood Glucose (mg/dL)</Label>
                <Input value={glucose} onChange={(e) => setGlucose(e.target.value)} className="h-9 text-xs rounded-xl" />
              </div>
              <Button
                onClick={() => setOpen(false)}
                className="dash-btn-primary w-full rounded-xl h-10 text-xs font-semibold shadow-xs"
              >
                Save to Clinical Record
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="pt-5 pb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Vital 1: Blood Pressure */}
        <div className="p-4 rounded-xl border border-rose-200/50 dark:border-rose-900/30 bg-gradient-to-br from-card to-rose-500/5 shadow-2xs hover:shadow-xs hover:border-rose-300 dark:hover:border-rose-800 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Blood Pressure</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Heart className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="dash-metric-text text-xl font-bold text-foreground">{systolic}/{diastolic}</span>
            <span className="text-[11px] font-medium text-muted-foreground">mmHg</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pt-0.5">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> Normal Target
          </div>
        </div>

        {/* Vital 2: HbA1c */}
        <div className="p-4 rounded-xl border border-amber-200/50 dark:border-amber-900/30 bg-gradient-to-br from-card to-amber-500/5 shadow-2xs hover:shadow-xs hover:border-amber-300 dark:hover:border-amber-800 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">HbA1c</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Activity className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="dash-metric-text text-xl font-bold text-foreground">6.8%</span>
            <span className="text-[11px] font-medium text-muted-foreground">Last Lab</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium pt-0.5">
            Pre-Diabetic Range
          </div>
        </div>

        {/* Vital 3: Body Weight */}
        <div className="p-4 rounded-xl border border-blue-200/50 dark:border-blue-900/30 bg-gradient-to-br from-card to-blue-500/5 shadow-2xs hover:shadow-xs hover:border-blue-300 dark:hover:border-blue-800 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Body Weight</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Scale className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="dash-metric-text text-xl font-bold text-foreground">68.2</span>
            <span className="text-[11px] font-medium text-muted-foreground">kg</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pt-0.5">
            <TrendingDown className="h-3.5 w-3.5 shrink-0" /> -0.8 kg this month
          </div>
        </div>

        {/* Vital 4: Daily Steps */}
        <div className="p-4 rounded-xl border border-emerald-200/50 dark:border-emerald-900/30 bg-gradient-to-br from-card to-emerald-500/5 shadow-2xs hover:shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Daily Steps</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Footprints className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="dash-metric-text text-xl font-bold text-foreground">4,320</span>
            <span className="text-[11px] font-medium text-muted-foreground">/ 8,000</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: "54%" }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
