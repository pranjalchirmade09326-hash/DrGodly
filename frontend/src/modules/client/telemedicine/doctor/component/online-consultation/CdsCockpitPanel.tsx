"use client";

import { useState } from "react";
import { Sparkles, ShieldAlert, CheckCircle2, AlertTriangle, FileCheck, ExternalLink, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Differential {
  id: string;
  name: string;
  icd10: string;
  probability: number;
  evidence: string;
}

const DIFFERENTIALS: Differential[] = [
  {
    id: "d1",
    name: "Essential (Primary) Hypertension",
    icd10: "I10",
    probability: 84,
    evidence: "30-day baseline SBP > 140 mmHg, maternal family history",
  },
  {
    id: "d2",
    name: "Hypertensive Urgency without Target Organ Damage",
    icd10: "I16.0",
    probability: 12,
    evidence: "Acute BP 150/95 with headache; no chest pain or dyspnea",
  },
  {
    id: "d3",
    name: "Secondary Hypertension (Renal)",
    icd10: "I15.0",
    probability: 4,
    evidence: "Borderline microalbuminuria noted on prior lab report",
  },
];

interface NextStepItem {
  id: string;
  label: string;
  guideline: string;
  checked: boolean;
}

const INITIAL_STEPS: NextStepItem[] = [
  {
    id: "s1",
    label: "Order Comprehensive Metabolic Panel & Serum Potassium",
    guideline: "AHA/ACC 2024 Guidelines",
    checked: true,
  },
  {
    id: "s2",
    label: "Add Amlodipine 5mg OD (CCB) to Telmisartan",
    guideline: "JNC-8 Stage 2 Combination Therapy",
    checked: false,
  },
  {
    id: "s3",
    label: "Schedule 2-Week Telemedicine BP Re-check",
    guideline: "Standard Follow-up Protocol",
    checked: true,
  },
  {
    id: "s4",
    label: "Share DASH Diet & Sodium Restriction Handout",
    guideline: "Lifestyle Modification Consensus",
    checked: false,
  },
];

export function CdsCockpitPanel() {
  const [steps, setSteps] = useState<NextStepItem[]>(INITIAL_STEPS);
  const [acceptedDx, setAcceptedDx] = useState<string>("d1");

  const toggleStep = (id: string) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s))
    );
  };

  const handleAddPlan = () => {
    const selected = steps.filter((s) => s.checked).map((s) => s.label);
    toast.success(`Added ${selected.length} recommendations to Plan`);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* CDS Header */}
      <div className="p-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-teal-600 text-white shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-900">
            Clinical Decision Support
          </span>
        </div>
        <Badge className="bg-teal-50 text-teal-800 text-[10px] font-medium border border-teal-200">
          FastMCP Live
        </Badge>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
        {/* Risk Score Meter */}
        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-amber-900 text-[11px] flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
              Cardiovascular Risk Stratification
            </span>
            <span className="font-bold text-amber-800 text-xs">MODERATE (Tier 2)</span>
          </div>
          <div className="w-full bg-amber-200/60 rounded-full h-1.5 overflow-hidden">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "65%" }} />
          </div>
          <p className="text-[10px] text-amber-800 leading-tight">
            Stage 2 HTN with acute elevation. Low cardiovascular organ damage risk currently.
          </p>
        </div>

        {/* Suggested Differential Diagnoses */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-800 text-xs">
              Suggested Differential Diagnosis
            </span>
            <span className="text-[10px] text-slate-400">Gemini 2.5 Pro</span>
          </div>

          <div className="space-y-2">
            {DIFFERENTIALS.map((dx) => (
              <div
                key={dx.id}
                onClick={() => setAcceptedDx(dx.id)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                  acceptedDx === dx.id
                    ? "bg-teal-50/50 border-teal-500 shadow-2xs"
                    : "bg-slate-50/50 border-slate-200/80 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                    {acceptedDx === dx.id && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                    )}
                    {dx.name}
                  </span>
                  <Badge variant="outline" className="text-[10px] font-mono border-slate-300">
                    {dx.icd10}
                  </Badge>
                </div>

                {/* Probability Bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        dx.probability > 70
                          ? "bg-emerald-500"
                          : dx.probability > 20
                          ? "bg-amber-500"
                          : "bg-slate-400"
                      }`}
                      style={{ width: `${dx.probability}%` }}
                    />
                  </div>
                  <span className="font-mono font-bold text-[11px] text-slate-700">
                    {dx.probability}%
                  </span>
                </div>

                <p className="text-[10px] text-slate-500 leading-tight">{dx.evidence}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Evidence-Based Next Steps */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-800 text-xs">
              Recommended Next Steps
            </span>
            <span className="text-[10px] text-teal-700 font-medium">JNC-8 / AHA</span>
          </div>

          <div className="space-y-1.5">
            {steps.map((step) => (
              <div
                key={step.id}
                onClick={() => toggleStep(step.id)}
                className="p-2 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer flex items-start gap-2 text-[11px]"
              >
                <input
                  type="checkbox"
                  checked={step.checked}
                  onChange={() => toggleStep(step.id)}
                  className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                />
                <div className="space-y-0.5">
                  <span className={step.checked ? "font-semibold text-slate-900" : "text-slate-600"}>
                    {step.label}
                  </span>
                  <span className="block text-[10px] text-teal-700">{step.guideline}</span>
                </div>
              </div>
            ))}
          </div>

          <Button
            size="sm"
            onClick={handleAddPlan}
            className="w-full mt-2 h-7 text-xs rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Selected to Plan
          </Button>
        </div>
      </div>
    </div>
  );
}
