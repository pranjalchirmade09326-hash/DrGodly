"use client";

import { useState } from "react";
import { User, AlertTriangle, Heart, Pill, ShieldAlert, FileText, ChevronDown, ChevronRight, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PatientDossierPanelProps {
  patientName?: string;
  patientAgeGender?: string;
  abhaId?: string;
}

export function PatientDossierPanel({
  patientName = "Anjali Menon",
  patientAgeGender = "42, Female",
  abhaId = "91-4821-9032-1104",
}: PatientDossierPanelProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (section: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    toast.success(`Copied ${section} to clipboard`);
    setTimeout(() => setCopiedSection(null), 1500);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Patient Header */}
      <div className="p-3.5 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm shrink-0">
            {patientName.charAt(0)}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-900 truncate">{patientName}</h4>
            <p className="text-[11px] text-slate-500">{patientAgeGender} • ABHA: {abhaId}</p>
          </div>
        </div>
      </div>

      {/* Accordion / Dossier Sections */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 divide-y divide-slate-100 text-xs">
        {/* Chief Complaint & HPI */}
        <div className="pt-2 first:pt-0 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-teal-600" />
              Chief Complaint & HPI
            </span>
            <button
              onClick={() =>
                copyToClipboard(
                  "HPI",
                  "Severe bilateral throbbing headache for 3 days with nausea and visual scotoma. Known Stage 2 HTN."
                )
              }
              className="text-slate-400 hover:text-teal-600"
              title="Copy to SOAP"
            >
              {copiedSection === "HPI" ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>
          <p className="text-slate-600 leading-relaxed bg-teal-50/40 p-2.5 rounded-xl border border-teal-100/60">
            Patient reports 3-day history of throbbing bilateral headache, visual blurriness, and mild nausea. Self-reported morning BP was 150/95 mmHg.
          </p>
        </div>

        {/* Key Vitals */}
        <div className="pt-3 space-y-2">
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5 text-rose-600" />
            Key Vitals (Current vs Baseline)
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded-lg bg-rose-50/60 border border-rose-100">
              <span className="text-slate-500 block">Blood Pressure</span>
              <span className="font-bold text-rose-700 text-sm">150/95</span>
              <span className="text-[11px] text-slate-500 ml-1">mmHg</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">Baseline BP</span>
              <span className="font-semibold text-slate-700 text-sm">128/82</span>
              <span className="text-[11px] text-slate-500 ml-1">mmHg</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">Heart Rate</span>
              <span className="font-semibold text-slate-700">76 bpm</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">HbA1c</span>
              <span className="font-semibold text-slate-700">6.8%</span>
            </div>
          </div>
        </div>

        {/* Current Medications */}
        <div className="pt-3 space-y-1.5">
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Pill className="h-3.5 w-3.5 text-indigo-600" />
            Current Medications
          </span>
          <ul className="space-y-1 text-[11px]">
            <li className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50">
              <span className="font-medium text-slate-800">Telmisartan 40mg</span>
              <span className="text-slate-500">1 Tab OD (Morning)</span>
            </li>
            <li className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50">
              <span className="font-medium text-slate-800">Metformin 500mg</span>
              <span className="text-slate-500">1 Tab BD (With Meals)</span>
            </li>
          </ul>
        </div>

        {/* Verified Allergies */}
        <div className="pt-3 space-y-1.5">
          <span className="font-semibold text-rose-700 flex items-center gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5" />
            Verified Severe Allergies
          </span>
          <div className="p-2 rounded-lg bg-rose-50 border border-rose-200/80 text-[11px] text-rose-800 font-medium">
            ⚠️ Sulfa Drugs (Severe rash/urticaria) • Avoid Thiazide diuretics
          </div>
        </div>

        {/* Flagged Red Flags */}
        <div className="pt-3 space-y-1.5">
          <span className="font-semibold text-amber-700 flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" />
            AI Intake Red Flags
          </span>
          <div className="p-2 rounded-lg bg-amber-50 border border-amber-200/80 text-[11px] text-amber-800 space-y-1">
            <p>• SBP acute spike &gt; 20 mmHg over 30-day baseline</p>
            <p>• Visual symptoms present; rule out hypertensive urgency</p>
          </div>
        </div>
      </div>
    </div>
  );
}
