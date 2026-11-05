'use client';

import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Brain,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Download,
  Edit3,
  ExternalLink,
  Eye,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Filter,
  FlaskConical,
  Heart,
  HeartPulse,
  Info,
  Layers,
  Lock,
  Pill,
  Plus,
  Printer,
  QrCode,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Trash2,
  User,
  X,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PatientDemographics {
  id: string;
  name: string;
  dob: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  mrn: string;
  bloodType: string;
  insurance: {
    payer: string;
    plan: string;
    memberId: string;
    group: string;
    status: 'Active' | 'Pending' | 'Inactive';
  };
  allergies: Array<{ substance: string; reaction: string; severity: 'High' | 'Moderate' | 'Low' }>;
  codeStatus: 'FULL CODE' | 'DNR' | 'DNI';
  primaryCarePhysician: string;
}

export interface ClinicalVitalsRecord {
  timestamp: string;
  bpSystolic: number;
  bpDiastolic: number;
  heartRate: number;
  spo2: number;
  temperature: number;
  respiratoryRate: number;
  weightLbs: number;
  heightInches: number;
  bmi: number;
}

export interface ProblemListItem {
  id: string;
  code: string; // ICD-10
  description: string;
  status: 'Active' | 'Resolved' | 'Chronic';
  onsetDate: string;
  verifiedBy: string;
}

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  route: string;
  frequency: string;
  refillsRemaining: number;
  prescribedBy: string;
  startDate: string;
  status: 'Active' | 'Discontinued' | 'On Hold';
}

export interface LabResultItem {
  name: string;
  value: number | string;
  unit: string;
  refLow?: number;
  refHigh?: number;
  status: 'Normal' | 'High' | 'Low' | 'Critical';
}

export interface DiagnosticPanel {
  panelName: string;
  collectedAt: string;
  status: 'Final' | 'Preliminary';
  tests: LabResultItem[];
}

export interface ImagingReport {
  id: string;
  modality: 'CXR' | 'CT' | 'MRI' | 'US';
  title: string;
  performedDate: string;
  radiologist: string;
  impression: string;
  dicomAvailable: boolean;
}

// ── Default Mock Data (Silicon Valley HealthTech Patient) ─────────────────────

const defaultPatient: PatientDemographics = {
  id: 'PT-94821',
  name: 'Eleanor Vance',
  dob: 'April 12, 1984',
  age: 42,
  gender: 'Female',
  mrn: '#DG-94821-US',
  bloodType: 'O+ Positive',
  insurance: {
    payer: 'Aetna Choice POS II',
    plan: 'Open Access Premier HDHP',
    memberId: 'W920194821',
    group: 'US-TECH-4819',
    status: 'Active',
  },
  allergies: [
    { substance: 'Penicillins', reaction: 'Anaphylaxis / Airway Edema', severity: 'High' },
    { substance: 'Sulfa Drugs', reaction: 'Urticaria / Contact Rash', severity: 'Moderate' },
  ],
  codeStatus: 'FULL CODE',
  primaryCarePhysician: 'Dr. Alexander Wright, MD (FACC)',
};

const defaultVitals: ClinicalVitalsRecord = {
  timestamp: 'Today at 02:15 PM',
  bpSystolic: 118,
  bpDiastolic: 76,
  heartRate: 72,
  spo2: 98,
  temperature: 98.6,
  respiratoryRate: 14,
  weightLbs: 138,
  heightInches: 66,
  bmi: 22.3,
};

const defaultProblems: ProblemListItem[] = [
  {
    id: 'pr-1',
    code: 'I10',
    description: 'Essential (primary) hypertension',
    status: 'Active',
    onsetDate: 'March 2022',
    verifiedBy: 'Dr. Wright',
  },
  {
    id: 'pr-2',
    code: 'E11.9',
    description: 'Type 2 diabetes mellitus without complications',
    status: 'Active',
    onsetDate: 'October 2023',
    verifiedBy: 'Dr. Wright',
  },
  {
    id: 'pr-3',
    code: 'G43.909',
    description: 'Migraine, unspecified, not intractable',
    status: 'Chronic',
    onsetDate: 'January 2021',
    verifiedBy: 'Dr. Wright',
  },
];

const defaultMedications: MedicationItem[] = [
  {
    id: 'rx-1',
    name: 'Lisinopril Oral Tablet',
    dosage: '10 mg',
    route: 'Oral (PO)',
    frequency: 'Once daily every morning',
    refillsRemaining: 3,
    prescribedBy: 'Dr. Wright, MD',
    startDate: '12/10/2023',
    status: 'Active',
  },
  {
    id: 'rx-2',
    name: 'Metformin Hydrochloride ER',
    dosage: '500 mg',
    route: 'Oral (PO)',
    frequency: 'Once daily with evening meal',
    refillsRemaining: 2,
    prescribedBy: 'Dr. Wright, MD',
    startDate: '01/15/2024',
    status: 'Active',
  },
  {
    id: 'rx-3',
    name: 'Atorvastatin Calcium Tablet',
    dosage: '20 mg',
    route: 'Oral (PO)',
    frequency: 'Once daily at bedtime',
    refillsRemaining: 5,
    prescribedBy: 'Dr. Wright, MD',
    startDate: '04/02/2024',
    status: 'Active',
  },
];

const defaultLabPanels: DiagnosticPanel[] = [
  {
    panelName: 'Comprehensive Metabolic Panel (CMP)',
    collectedAt: 'Today, 08:30 AM (Fasting 12h)',
    status: 'Final',
    tests: [
      { name: 'Fasting Glucose', value: 94, unit: 'mg/dL', refLow: 70, refHigh: 99, status: 'Normal' },
      { name: 'Potassium (Serum)', value: 4.2, unit: 'mEq/L', refLow: 3.5, refHigh: 5.0, status: 'Normal' },
      { name: 'Sodium', value: 140, unit: 'mEq/L', refLow: 135, refHigh: 145, status: 'Normal' },
      { name: 'eGFR (Creatinine-based)', value: '> 90', unit: 'mL/min/1.73m²', status: 'Normal' },
      { name: 'Blood Urea Nitrogen (BUN)', value: 14, unit: 'mg/dL', refLow: 7, refHigh: 20, status: 'Normal' },
    ],
  },
  {
    panelName: 'Lipid Profile Panel',
    collectedAt: 'Today, 08:30 AM (Fasting 12h)',
    status: 'Final',
    tests: [
      { name: 'Total Cholesterol', value: 185, unit: 'mg/dL', refLow: 125, refHigh: 200, status: 'Normal' },
      { name: 'LDL Cholesterol (Calculated)', value: 108, unit: 'mg/dL', refLow: 0, refHigh: 100, status: 'High' },
      { name: 'HDL Cholesterol', value: 58, unit: 'mg/dL', refLow: 50, refHigh: 90, status: 'Normal' },
      { name: 'Triglycerides', value: 125, unit: 'mg/dL', refLow: 0, refHigh: 150, status: 'Normal' },
    ],
  },
];

const defaultImaging: ImagingReport = {
  id: 'RAD-CXR-849',
  modality: 'CXR',
  title: 'Chest 2-Views Frontal & Lateral',
  performedDate: 'Oct 24, 2026',
  radiologist: 'Dr. Sarah Lin, MD (Board-Certified Diagnostic Radiologist)',
  impression:
    'Lungs are clear bilaterally without focal consolidation, pneumothorax, or pleural effusion. Heart size and pulmonary vascularity are within normal physiological limits. Stable baseline study.',
  dicomAvailable: true,
};

// ── Main Workspace Component ──────────────────────────────────────────────────

export function DoctorClinicalRecordsWorkspace({
  patient = defaultPatient,
  initialVitals = defaultVitals,
  doctorName = 'Dr. Alexander Wright, MD (FACC)',
  onOpenDicomViewer,
}: {
  patient?: PatientDemographics;
  initialVitals?: ClinicalVitalsRecord;
  doctorName?: string;
  onOpenDicomViewer?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'chart' | 'labs' | 'imaging' | 'soap'>('chart');
  const [problems, setProblems] = useState<ProblemListItem[]>(defaultProblems);
  const [meds, setMeds] = useState<MedicationItem[]>(defaultMedications);
  const [isGeneratingAiSoap, setIsGeneratingAiSoap] = useState(false);
  const [soapSigned, setSoapSigned] = useState(false);
  const [showDicomModal, setShowDicomModal] = useState(false);
  const [selectedCpt, setSelectedCpt] = useState('99214');

  // SOAP State
  const [soap, setSoap] = useState({
    subjective:
      '42-year-old female presents for scheduled follow-up of hypertension and type 2 diabetes. Patient reports strict adherence to Lisinopril 10mg daily and Metformin 500mg ER. Home blood pressure readings over the past 3 weeks average 115-122 mmHg systolic and 74-78 mmHg diastolic. Denies chest pressure, palpitations, dyspnea on exertion, orthopnea, or lower extremity edema. Reports mild tension-type headache twice over the month, resolving with rest.',
    objective:
      'Constitutional: Well-appearing, alert, oriented x3, in no acute distress.\nCardiovascular: Regular rate and rhythm, normal S1/S2, no murmurs, rubs, or gallops. Peripheral pulses 2+ symmetric.\nRespiratory: Clear to auscultation bilaterally. No wheezes, rales, or rhonchi.\nVital Signs: BP 118/76 mmHg, HR 72 bpm regular, SpO2 98% room air, BMI 22.3 kg/m².\nDiagnostic: Fasting glucose 94 mg/dL. Total cholesterol 185 mg/dL with LDL 108 mg/dL.',
    assessment:
      '1. I10 - Essential (primary) hypertension: Well-controlled on ACE-inhibitor therapy.\n2. E11.9 - Type 2 diabetes mellitus: Stable glycemic control, home logs consistent with target.\n3. E78.00 - Pure hypercholesterolemia: Mild LDL elevation (108 mg/dL); maintain current Atorvastatin.',
    plan:
      '1. Continue Lisinopril 10 mg PO once daily in the morning.\n2. Continue Metformin 500 mg ER PO once daily with dinner.\n3. Continue Atorvastatin 20 mg PO at bedtime.\n4. Recheck CMP, HbA1c, and Lipid profile in 6 months.\n5. Encourage continued adherence to low-sodium Mediterranean cardioprotective dietary pattern.\n6. Follow-up via telehealth in 6 months or earlier if blood pressure exceeds 140/90 mmHg.',
  });

  const handleTriggerAiScribe = () => {
    setIsGeneratingAiSoap(true);
    setTimeout(() => {
      setIsGeneratingAiSoap(false);
      setSoap((prev) => ({
        ...prev,
        subjective:
          prev.subjective +
          '\n\n[AI Scribe Note]: Patient confirmed zero adverse drug reactions. Verified home Omron BP cuff calibration within 3 mmHg.',
      }));
    }, 1200);
  };

  const handleSignSoapNote = () => {
    setSoapSigned(true);
  };

  return (
    <div className="w-full space-y-4 text-foreground">
      {/* ── Top Header Banner: Patient Demographic & Safety Matrix ── */}
      <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Patient Core Info */}
          <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 font-bold text-xl border border-blue-600/20 shadow-inner">
              {patient.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-foreground">{patient.name}</h2>
                <Badge variant="outline" className="font-mono text-xs border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30">
                  {patient.mrn}
                </Badge>
                <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs gap-1">
                  <ShieldCheck className="size-3" />
                  {patient.insurance.status}: {patient.insurance.payer}
                </Badge>
                <Badge variant="secondary" className="text-xs font-mono font-medium">
                  {patient.bloodType}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{patient.age} years old</span> • Born {patient.dob} • {patient.gender} • Attending: <span className="font-medium text-foreground">{doctorName}</span>
              </p>
            </div>
          </div>

          {/* Critical Clinical Alerts & Code Status */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-50/80 dark:bg-red-950/40 px-3 py-1.5 text-xs font-medium text-red-700 dark:text-red-300">
              <ShieldAlert className="size-4 shrink-0 text-red-600 dark:text-red-400" />
              <span>
                <strong>Allergy:</strong> Penicillins (Anaphylaxis)
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-50/80 dark:bg-amber-950/40 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300">
              <AlertTriangle className="size-3.5 shrink-0 text-amber-600" />
              <span>Fall Risk: Low</span>
            </div>
            <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider border-zinc-400 text-zinc-700 dark:text-zinc-300">
              {patient.codeStatus}
            </Badge>
          </div>
        </div>

        {/* Real-time Vitals Ribbon */}
        <Separator className="my-4 bg-border/60" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          <div className="rounded-lg border border-border/50 bg-muted/30 p-2.5">
            <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
              <span>Blood Pressure</span>
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-lg font-bold text-foreground">
                {initialVitals.bpSystolic}/{initialVitals.bpDiastolic}
              </span>
              <span className="text-[11px] text-muted-foreground">mmHg</span>
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Optimal Control</span>
          </div>

          <div className="rounded-lg border border-border/50 bg-muted/30 p-2.5">
            <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
              <span>Heart Rate</span>
              <Heart className="size-3 text-rose-500" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-lg font-bold text-foreground">{initialVitals.heartRate}</span>
              <span className="text-[11px] text-muted-foreground">bpm</span>
            </div>
            <span className="text-[11px] text-muted-foreground font-medium">Regular sinus</span>
          </div>

          <div className="rounded-lg border border-border/50 bg-muted/30 p-2.5">
            <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
              <span>SpO2 Oxygen</span>
              <Activity className="size-3 text-blue-500" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-lg font-bold text-foreground">{initialVitals.spo2}%</span>
              <span className="text-[11px] text-muted-foreground">RA</span>
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Room air</span>
          </div>

          <div className="rounded-lg border border-border/50 bg-muted/30 p-2.5">
            <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
              <span>Oral Temp</span>
              <span className="text-[11px] text-muted-foreground">°F</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-lg font-bold text-foreground">{initialVitals.temperature}</span>
              <span className="text-[11px] text-muted-foreground">°F</span>
            </div>
            <span className="text-[11px] text-muted-foreground font-medium">Afebrile</span>
          </div>

          <div className="rounded-lg border border-border/50 bg-muted/30 p-2.5">
            <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
              <span>Respiration</span>
              <span className="text-[11px] text-muted-foreground">bpm</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-lg font-bold text-foreground">{initialVitals.respiratoryRate}</span>
              <span className="text-[11px] text-muted-foreground">/min</span>
            </div>
            <span className="text-[11px] text-muted-foreground font-medium">Unlabored</span>
          </div>

          <div className="rounded-lg border border-border/50 bg-muted/30 p-2.5">
            <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
              <span>BMI / Weight</span>
              <span className="text-[11px] text-muted-foreground">{initialVitals.weightLbs} lbs</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-lg font-bold text-foreground">{initialVitals.bmi}</span>
              <span className="text-[11px] text-muted-foreground">kg/m²</span>
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Healthy range</span>
          </div>
        </div>
      </div>

      {/* ── Main Clinical Workstation Layout (3-Column Cockpit) ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left Column: Problem List, Active Medications, Immunizations (Span 4) */}
        <div className="space-y-4 lg:col-span-4">
          {/* Active Problems / Diagnoses (ICD-10) */}
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Stethoscope className="size-4 text-blue-600" />
                <CardTitle className="text-sm font-semibold">Problem List (ICD-10)</CardTitle>
              </div>
              <Badge variant="secondary" className="text-xs">
                {problems.length} Active
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-0">
              {problems.map((p) => (
                <div key={p.id} className="flex items-start justify-between rounded-lg border border-border/60 p-2.5 hover:bg-muted/30 transition-colors">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded">
                        {p.code}
                      </span>
                      <span className="text-xs font-semibold text-foreground">{p.description}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Onset: {p.onsetDate} • Verified by {p.verifiedBy}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[11px] font-medium border-emerald-500/30 text-emerald-600">
                    {p.status}
                  </Badge>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full text-xs text-blue-600 hover:text-blue-700 gap-1.5 h-8">
                <Plus className="size-3.5" />
                Add Problem / ICD-10 Code
              </Button>
            </CardContent>
          </Card>

          {/* Active Medications & Refills */}
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Pill className="size-4 text-emerald-600" />
                <CardTitle className="text-sm font-semibold">Active Medications</CardTitle>
              </div>
              <Badge variant="secondary" className="text-xs">
                {meds.length} Active
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-0">
              {meds.map((m) => (
                <div key={m.id} className="rounded-lg border border-border/60 p-2.5 space-y-1 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">{m.name}</span>
                    <span className="text-[11px] font-mono font-medium text-emerald-600 dark:text-emerald-400">
                      {m.dosage}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{m.frequency}</p>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 pt-1 mt-1">
                    <span>Refills remaining: <strong className="text-foreground">{m.refillsRemaining}</strong></span>
                    <span>Started: {m.startDate}</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 h-8 border-dashed">
                <Plus className="size-3.5" />
                Reconcile & Prescribe New Rx
              </Button>
            </CardContent>
          </Card>

          {/* Immunization & Preventative Care */}
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ShieldCheck className="size-4 text-blue-600" />
                Preventative Care & Vaccines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Influenza (2025–2026)</span>
                <Badge variant="secondary" className="text-[11px] text-emerald-600 font-medium">Up to Date</Badge>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Tdap Booster</span>
                <Badge variant="secondary" className="text-[11px] text-emerald-600 font-medium">Administered 2024</Badge>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-muted-foreground">Lipid Screen (Annual)</span>
                <Badge variant="secondary" className="text-[11px] text-blue-600 font-medium">Completed Today</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center & Right Column: Tabs for Diagnostic Labs, DICOM Imaging & Smart SOAP (Span 8) */}
        <div className="space-y-4 lg:col-span-8">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-2">
              <TabsList className="bg-muted/60 p-1">
                <TabsTrigger value="chart" className="gap-1.5 text-xs">
                  <Activity className="size-3.5" />
                  Diagnostic Labs
                </TabsTrigger>
                <TabsTrigger value="imaging" className="gap-1.5 text-xs">
                  <Eye className="size-3.5" />
                  DICOM Radiology
                </TabsTrigger>
                <TabsTrigger value="soap" className="gap-1.5 text-xs font-semibold">
                  <FileText className="size-3.5 text-blue-600" />
                  Smart S.O.A.P Note
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTriggerAiScribe}
                  disabled={isGeneratingAiSoap}
                  className="gap-1.5 text-xs h-8 border-blue-500/30 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                >
                  <Sparkles className={`size-3.5 ${isGeneratingAiSoap ? 'animate-spin' : ''}`} />
                  {isGeneratingAiSoap ? 'Transcribing Encounter...' : 'AI Ambient Scribe Auto-Draft'}
                </Button>
                <Button
                  size="sm"
                  onClick={handleSignSoapNote}
                  disabled={soapSigned}
                  className="gap-1.5 text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  {soapSigned ? (
                    <>
                      <Lock className="size-3.5" />
                      Locked & Signed
                    </>
                  ) : (
                    <>
                      <FileCheck2 className="size-3.5" />
                      Sign EMR Record
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* TAB 1: Diagnostic Lab Panels with Reference Range Visualizers */}
            <TabsContent value="chart" className="space-y-4 pt-3">
              {defaultLabPanels.map((panel, idx) => (
                <Card key={idx} className="border-border/70 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-3 bg-muted/20 border-b border-border/50">
                    <div>
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <FlaskConical className="size-4 text-blue-600" />
                        {panel.panelName}
                      </CardTitle>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{panel.collectedAt}</p>
                    </div>
                    <Badge variant="outline" className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-500/30 font-medium">
                      {panel.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border/50">
                      {panel.tests.map((test, tIdx) => {
                        const isHigh = test.status === 'High';
                        return (
                          <div
                            key={tIdx}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 gap-2 text-xs transition-colors ${
                              isHigh ? 'bg-amber-500/5' : 'hover:bg-muted/20'
                            }`}
                          >
                            <div className="sm:w-1/3">
                              <span className="font-semibold text-foreground">{test.name}</span>
                              {test.refLow !== undefined && test.refHigh !== undefined && (
                                <p className="text-[11px] text-muted-foreground">
                                  Standard Reference: {test.refLow} – {test.refHigh} {test.unit}
                                </p>
                              )}
                            </div>

                            {/* Measured Value */}
                            <div className="sm:w-1/4 flex items-center gap-2">
                              <span className={`text-sm font-bold font-mono ${isHigh ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'}`}>
                                {test.value}
                              </span>
                              <span className="text-[11px] text-muted-foreground">{test.unit}</span>
                            </div>

                            {/* Visual Reference Range Bar */}
                            <div className="sm:w-1/3 flex items-center gap-3">
                              <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    isHigh ? 'bg-amber-500' : 'bg-emerald-500'
                                  }`}
                                  style={{
                                    width: isHigh ? '85%' : '55%',
                                  }}
                                />
                              </div>
                              <Badge
                                variant={isHigh ? 'destructive' : 'secondary'}
                                className={`text-[11px] font-medium shrink-0 ${
                                  isHigh
                                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40'
                                    : 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40'
                                }`}
                              >
                                {test.status}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* TAB 2: DICOM Radiology & Imaging */}
            <TabsContent value="imaging" className="space-y-4 pt-3">
              <Card className="border-border/70 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/20 border-b border-border/50 pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Eye className="size-4 text-blue-600" />
                      {defaultImaging.title} ({defaultImaging.modality})
                    </CardTitle>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Performed: {defaultImaging.performedDate} • Interpreting: {defaultImaging.radiologist}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono font-medium">
                    {defaultImaging.id}
                  </Badge>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {/* Radiology Canvas Thumbnail & Preview */}
                  <div className="relative rounded-lg border border-border/80 bg-zinc-950 p-6 text-white flex flex-col items-center justify-center min-h-[220px] overflow-hidden group">
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="z-10 flex flex-col items-center text-center space-y-2">
                      <div className="size-12 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                        <Activity className="size-6" />
                      </div>
                      <h4 className="font-semibold text-sm">2-View Diagnostic Radiograph (CXR)</h4>
                      <p className="text-xs text-zinc-400 max-w-sm">
                        High-resolution 16-bit DICOM pixel series with WW/WL windowing, Cobb angle measurement tools, and pan/zoom enabled.
                      </p>
                      <Button
                        size="sm"
                        onClick={() => {
                          if (onOpenDicomViewer) onOpenDicomViewer();
                          else setShowDicomModal(true);
                        }}
                        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 shadow-md"
                      >
                        <ExternalLink className="size-3.5" />
                        Launch Web DICOM Canvas
                      </Button>
                    </div>
                  </div>

                  {/* Formal Radiologist Impression */}
                  <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5 space-y-1.5">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-emerald-600" />
                      Radiologist Clinical Impression
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {defaultImaging.impression}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 3: Smart S.O.A.P Note & Clinical Documentation */}
            <TabsContent value="soap" className="space-y-4 pt-3">
              {soapSigned && (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-950/40 p-3 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-emerald-600" />
                    <span>
                      <strong>Legally Signed & Committed:</strong> Authenticated by {doctorName} (NPI #1982736450). Record locked for tamper-proof audit trail.
                    </span>
                  </div>
                  <Badge className="bg-emerald-600 text-white text-[11px]">FHIR DocumentReference #DOC-4981</Badge>
                </div>
              )}

              {/* SOAP Accordion / Sections */}
              <div className="space-y-3">
                {/* Subjective */}
                <div className="rounded-lg border border-border/70 bg-card p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                      <User className="size-3.5" />
                      Subjective (S) — Patient History & Symptoms
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">CC & HPI</span>
                  </div>
                  <textarea
                    rows={3}
                    disabled={soapSigned}
                    value={soap.subjective}
                    onChange={(e) => setSoap({ ...soap, subjective: e.target.value })}
                    className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-75"
                  />
                </div>

                {/* Objective */}
                <div className="rounded-lg border border-border/70 bg-card p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                      <Stethoscope className="size-3.5" />
                      Objective (O) — Physical Exam & Vitals
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">Exam Findings</span>
                  </div>
                  <textarea
                    rows={4}
                    disabled={soapSigned}
                    value={soap.objective}
                    onChange={(e) => setSoap({ ...soap, objective: e.target.value })}
                    className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-75"
                  />
                </div>

                {/* Assessment */}
                <div className="rounded-lg border border-border/70 bg-card p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                      <Activity className="size-3.5" />
                      Assessment (A) — Differential Diagnoses
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">ICD-10 Links</span>
                  </div>
                  <textarea
                    rows={3}
                    disabled={soapSigned}
                    value={soap.assessment}
                    onChange={(e) => setSoap({ ...soap, assessment: e.target.value })}
                    className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-75"
                  />
                </div>

                {/* Plan */}
                <div className="rounded-lg border border-border/70 bg-card p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                      <FileCheck2 className="size-3.5" />
                      Plan (P) — Medical Decision Making & Follow-up
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">Orders & Rx</span>
                  </div>
                  <textarea
                    rows={4}
                    disabled={soapSigned}
                    value={soap.plan}
                    onChange={(e) => setSoap({ ...soap, plan: e.target.value })}
                    className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-75"
                  />
                </div>
              </div>

              {/* Billing & CPT Coding Bar */}
              <div className="rounded-xl border border-border/70 bg-muted/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Shield className="size-3.5 text-blue-600" />
                    CPT Evaluation & Management (E/M) Billing
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    Based on moderate medical decision-making (MDM) and 35 minutes encounter time.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedCpt}
                    onChange={(e) => setSelectedCpt(e.target.value)}
                    disabled={soapSigned}
                    className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="99214">CPT 99214: Established Patient (30–39m)</option>
                    <option value="99213">CPT 99213: Established Patient (20–29m)</option>
                    <option value="99215">CPT 99215: High Complexity (40–54m)</option>
                  </select>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* ── DICOM Viewer Modal (Fallback if no external handler) ── */}
      {showDicomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl rounded-2xl border border-zinc-700 bg-zinc-950 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Activity className="size-5 text-blue-500" />
                <h3 className="font-semibold text-base">Interactive Web DICOM Canvas</h3>
                <Badge variant="outline" className="border-blue-500/40 text-blue-400 text-xs">
                  16-Bit Grayscale
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDicomModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="my-6 flex flex-col items-center justify-center min-h-[360px] rounded-xl border border-zinc-800 bg-zinc-900/60 p-8 text-center">
              <div className="size-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3">
                <Eye className="size-8" />
              </div>
              <p className="font-semibold text-sm">Chest Radiograph — PA & Lateral Views</p>
              <p className="text-xs text-zinc-400 max-w-md mt-1">
                Rendered with WebGL medical imaging shader: WW 1500 / WL -600 (Lung Window Preset).
              </p>
              <div className="flex items-center gap-3 mt-5">
                <Button size="sm" variant="outline" className="border-zinc-700 text-xs">
                  Invert Grayscale
                </Button>
                <Button size="sm" variant="outline" className="border-zinc-700 text-xs">
                  Bone Window Preset
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs">
                  Apply Cobb Angle Tool
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-zinc-400">
              <span>Patient: Eleanor Vance (#DG-94821)</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowDicomModal(false)}
                className="text-xs text-zinc-300 hover:text-white"
              >
                Close Viewer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
