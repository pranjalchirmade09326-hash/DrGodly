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
    <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-xs overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold text-slate-900">
            My Health Snapshot
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Key vitals and biometric indicators from EMR & wearables
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs rounded-xl border-teal-200 text-teal-700 hover:bg-teal-50 gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Log Vitals</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">Log Biometric Reading</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Systolic BP (mmHg)</Label>
                  <Input value={systolic} onChange={(e) => setSystolic(e.target.value)} className="h-9 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Diastolic BP (mmHg)</Label>
                  <Input value={diastolic} onChange={(e) => setDiastolic(e.target.value)} className="h-9 text-xs" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Blood Glucose (mg/dL)</Label>
                <Input value={glucose} onChange={(e) => setGlucose(e.target.value)} className="h-9 text-xs" />
              </div>
              <Button
                onClick={() => setOpen(false)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl h-9 text-xs font-medium"
              >
                Save to Clinical Record
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Vital 1: Blood Pressure */}
        <div className="p-3.5 rounded-xl border border-rose-100 bg-gradient-to-br from-white to-rose-50/20 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Blood Pressure</span>
            <div className="p-1.5 rounded-lg bg-rose-100 text-rose-600">
              <Heart className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">{systolic}/{diastolic}</span>
            <span className="text-[11px] text-slate-500">mmHg</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <CheckCircle2 className="h-3 w-3" /> Normal Target
          </div>
        </div>

        {/* Vital 2: HbA1c */}
        <div className="p-3.5 rounded-xl border border-amber-100 bg-gradient-to-br from-white to-amber-50/20 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">HbA1c</span>
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
              <Activity className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">6.8%</span>
            <span className="text-[11px] text-slate-500">Last Lab</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-700 font-medium">
            Pre-Diabetic Range
          </div>
        </div>

        {/* Vital 3: Body Weight */}
        <div className="p-3.5 rounded-xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/20 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Body Weight</span>
            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
              <Scale className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">68.2</span>
            <span className="text-[11px] text-slate-500">kg</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <TrendingDown className="h-3 w-3" /> -0.8 kg this month
          </div>
        </div>

        {/* Vital 4: Daily Steps */}
        <div className="p-3.5 rounded-xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/20 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Daily Steps</span>
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <Footprints className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">4,320</span>
            <span className="text-[11px] text-slate-500">/ 8,000</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "54%" }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
