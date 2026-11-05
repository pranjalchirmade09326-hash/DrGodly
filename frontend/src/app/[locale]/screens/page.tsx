'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Video,
  FileCheck2,
  HeartPulse,
  Sparkles,
  CalendarCheck,
  Stethoscope,
  ShieldCheck,
  CheckCircle2,
  Activity,
  User,
  Clock,
  Pill,
  Send,
  FileText,
  X,
  AlertTriangle,
  ChevronRight,
  Sliders,
  Star,
  Building2,
  Edit3,
  Save,
  QrCode,
  Download,
  Check,
  PhoneCall,
  Lock,
  ArrowRight,
  Truck,
  Heart,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// Master Layout & Brand Components
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import { GlobalFooter } from '@/components/layout/GlobalFooter';
import { DrGodlyLogo } from '@/components/shared/DrGodlyLogo';

// Clinical Workstation Modules
import { DoctorSearchMarketplace } from '@/modules/client/doctor-search/DoctorSearchMarketplace';
import { DashboardOverview } from '@/modules/client/telemedicine/doctor/component/dashboard-overview/DashboardOverview';
import { DoctorWeekSchedule } from '@/modules/client/telemedicine/doctor/component/dashboard-overview/DoctorWeekSchedule';
import { DoctorTelemedicineCockpit } from '@/modules/client/telemedicine/doctor/component/online-consultation/DoctorTelemedicineCockpit';
import { AiIntakeStudio } from '@/modules/client/telemedicine/patient/component/ai-intake/AiIntakeStudio';
import { GenericPharmacyCheckout } from '@/modules/client/telemedicine/patient/component/pharmacy/GenericPharmacyCheckout';
import { DigitalSignatureAndQrCard } from '@/modules/client/telemedicine/doctor/component/appointment-review/DigitalSignatureAndQrCard';
import { HealthScoreGauge } from '@/modules/client/telemedicine/patient/component/dashboard/HealthScoreGauge';
import { HealthSnapshotGrid } from '@/modules/client/telemedicine/patient/component/dashboard/HealthSnapshotGrid';
import { CarePlanChecklist } from '@/modules/client/telemedicine/patient/component/dashboard/CarePlanChecklist';
import { AskDrGodlyChatWidget } from '@/modules/client/telemedicine/patient/component/dashboard/AskDrGodlyChatWidget';
import { DoctorClinicalRecordsWorkspace } from '@/modules/client/telemedicine/doctor/component/clinical-records/DoctorClinicalRecordsWorkspace';
import type { TAppointmentResponse } from '@/modules/entities/schemas/appointment';

// ── US Clinical Triage Queue Mock Data ───────────────────────────────────────
const mockAppointments: TAppointmentResponse[] = [
  {
    id: 101,
    status: 'booked',
    start: new Date(Date.now() + 1000 * 60 * 20).toISOString(),
    end: new Date(Date.now() + 1000 * 60 * 50).toISOString(),
    created: new Date().toISOString(),
    participant: [
      {
        id: 1,
        reference_type: 'Patient',
        reference_id: 1,
        reference_display: 'Louise Reed (ID #DG-89241 • Commercial PPO)',
        status: 'accepted',
      },
      {
        id: 2,
        reference_type: 'Practitioner',
        reference_id: 1,
        reference_display: 'Dr. Alexander Wright, MD (FACC)',
        status: 'accepted',
      },
    ],
    service_type: [{ id: 1, text: 'Cardiovascular Telehealth Encounter' }],
  },
  {
    id: 102,
    status: 'arrived',
    start: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    end: new Date(Date.now() + 1000 * 60 * 90).toISOString(),
    created: new Date().toISOString(),
    participant: [
      {
        id: 3,
        reference_type: 'Patient',
        reference_id: 2,
        reference_display: 'Marcus Chen (ID #DG-54129 • High Deductible)',
        status: 'accepted',
      },
      {
        id: 4,
        reference_type: 'Practitioner',
        reference_id: 1,
        reference_display: 'Dr. Alexander Wright, MD (FACC)',
        status: 'accepted',
      },
    ],
    service_type: [{ id: 2, text: 'Hypertension Protocol & Lab Review' }],
  },
  {
    id: 103,
    status: 'fulfilled',
    start: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    end: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    created: new Date().toISOString(),
    participant: [
      {
        id: 5,
        reference_type: 'Patient',
        reference_id: 3,
        reference_display: 'Sarah Jenkins (ID #DG-31092 • Medicare Advantage)',
        status: 'accepted',
      },
      {
        id: 6,
        reference_type: 'Practitioner',
        reference_id: 1,
        reference_display: 'Dr. Alexander Wright, MD (FACC)',
        status: 'accepted',
      },
    ],
    service_type: [{ id: 3, text: 'Lipid Panel & 12-Lead ECG Review' }],
  },
];

type DoctorTab = 'telemedicine' | 'queue' | 'rx-soap' | 'clinical-emr';
type PatientTab = 'dashboard' | 'intake' | 'marketplace' | 'pharmacy';

function ScreensShowcaseContent() {
  const searchParams = useSearchParams();
  const [currentRole, setCurrentRole] = useState<'doctor' | 'patient'>('doctor');
  const [doctorTab, setDoctorTab] = useState<DoctorTab>('telemedicine');
  const [patientTab, setPatientTab] = useState<PatientTab>('dashboard');

  // Landing from /login or /signup carries the chosen persona, e.g.
  // /screens?role=patient, so the demo opens on the matching workspace.
  React.useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'patient' || roleParam === 'doctor') {
      setCurrentRole(roleParam);
    }
  }, [searchParams]);

  // Intake State
  const [intakePainLevel, setIntakePainLevel] = useState<number>(3);
  const [intakeChatMessages, setIntakeChatMessages] = useState<Array<{ from: 'user' | 'assistant'; text: string }>>([
    {
      from: 'assistant',
      text: 'Good morning Louise, I am DrGodly AI Clinical Intake Assistant. What symptoms or concerns are you experiencing today?',
    },
    {
      from: 'user',
      text: 'I have had a throbbing morning headache behind my eyes for 3 days and my home blood pressure was 142/88 mmHg.',
    },
    {
      from: 'assistant',
      text: 'Understood. A 3-day history of morning headaches with elevated home systolic pressures requires thorough review. Have you experienced any visual aura, light sensitivity, or sudden dizziness upon standing?',
    },
  ]);
  const [intakeInput, setIntakeInput] = useState('');

  // Booking Flow State
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1);
  const [bookingSpecialist, setBookingSpecialist] = useState<string>('Dr. Emily Vance, MD');
  const [bookingSlot, setBookingSlot] = useState<string>('10:30 AM EST');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // SOAP & Verification Modal State
  const [showQrVerificationModal, setShowQrVerificationModal] = useState(false);
  const [isEditingSoap, setIsEditingSoap] = useState(false);
  const [isSoapSaved, setIsSoapSaved] = useState(false);
  const [soapData, setSoapData] = useState({
    subjective:
      '30-year-old female presents via high-definition telehealth with a 3-day history of bilateral throbbing morning cephalalgia. Patient logs home BP averaging 142/88 mmHg. Denies visual scintillations, focal neurological deficits, chest tightness, or dyspnea.',
    objective:
      'Home cuff digital reading: 140/86 mmHg, Pulse 72 bpm regular. Uploaded resting 12-lead ECG confirms normal sinus rhythm without acute ischemic changes. Non-obese habitus (BMI 23.4 kg/m²).',
    assessment:
      '1. Primary Essential Hypertension with symptomatic elevation (ICD-10: I10).\n2. Tension-type vascular headache secondary to hemodynamic variation (ICD-10: G44.209).',
    plan:
      '1. Initiate Amlodipine besylate 5mg orally once daily in morning.\n2. Prescribe 14-day continuous digital home blood pressure log.\n3. Order comprehensive metabolic panel (CMP) & urine microalbumin.\n4. Scheduled telehealth follow-up in 2 weeks.',
  });

  const sendIntakeMessage = (txt: string) => {
    if (!txt.trim()) return;
    setIntakeChatMessages((prev) => [
      ...prev,
      { from: 'user', text: txt },
      {
        from: 'assistant',
        text: `Noted: "${txt}". This has been summarized and indexed into your longitudinal chart for Dr. Wright's clinical review.`,
      },
    ]);
    setIntakeInput('');
  };

  const getPainSeverity = (level: number) => {
    if (level <= 3) return { label: 'Mild (Manageable)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (level <= 6) return { label: 'Moderate (Discomforting)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (level <= 8) return { label: 'Severe (Distressing)', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    return { label: 'Debilitating (Critical)', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  return (
    /*
     * The clinical workstation (GlobalHeader, cockpit panels, dossier cards) is
     * authored as a light "chart paper" surface with raw palette classes. Forcing
     * the light token set on this wrapper keeps every theme-aware class here
     * resolving to its light values, so the demo stays coherent regardless of the
     * theme picked in the marketing header. Auth and marketing pages follow the
     * user's theme; this workspace intentionally does not.
     */
    <div
      data-theme="teal-light"
      className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased selection:bg-primary/20 selection:text-foreground"
    >
      {/* ── 1. Master US HealthTech Header ── */}
      <GlobalHeader
        currentRole={currentRole}
        userName={currentRole === 'doctor' ? 'Dr. Alexander Wright, MD' : 'Louise Reed'}
        userRoleTitle={
          currentRole === 'doctor'
            ? 'Chief of Cardiology • NPI #1982736450'
            : 'Member ID #DG-89241 • Pre-Screened'
        }
        onRoleSwitch={(newRole) => setCurrentRole(newRole)}
      />

      {/* ── 2. Modern Clinical Sub-Header & Segmented Dock ── */}
      <div className="sticky top-16 z-30 border-b border-border/70 bg-background/80 px-4 py-3.5 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 md:flex-row md:items-center">
          {/* Persona Title & Security Status */}
          <div className="flex items-center gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              {currentRole === 'doctor' ? <Stethoscope className="size-5" /> : <User className="size-5" />}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight text-foreground sm:text-lg">
                  {currentRole === 'doctor' ? 'Clinician Telehealth Cockpit' : 'Personal Health & Virtual Care'}
                </h1>
                <span className="hidden items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800 sm:inline-flex">
                  <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  {currentRole === 'doctor' ? '1080p WebRTC Session Ready' : 'Active Care Membership'}
                </span>
              </div>
              <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                {currentRole === 'doctor'
                  ? 'Longitudinal EHR Interoperability • Ambient AI Clinical Scribe & Decision Support'
                  : 'Board-Certified Virtual Care • On-Demand Prescriptions & Vitals Tracking'}
              </p>
            </div>
          </div>

          {/* Segmented Apple-Grade Navigation Pill Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {currentRole === 'doctor' ? (
              <>
                <button
                  type="button"
                  onClick={() => setDoctorTab('telemedicine')}
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                    doctorTab === 'telemedicine'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'border border-border bg-card text-card-foreground hover:bg-muted'
                  }`}
                >
                  <Video className="size-3.5 opacity-70" />
                  <span>Telehealth Cockpit (3-Panel)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDoctorTab('queue')}
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                    doctorTab === 'queue'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'border border-border bg-card text-card-foreground hover:bg-muted'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Outpatient Queue & Triage</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDoctorTab('rx-soap')}
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                    doctorTab === 'rx-soap'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'border border-border bg-card text-card-foreground hover:bg-muted'
                  }`}
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Clinical SOAP & e-Rx</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDoctorTab('clinical-emr')}
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                    doctorTab === 'clinical-emr'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'border border-border bg-card text-card-foreground hover:bg-muted'
                  }`}
                >
                  <Stethoscope className="size-3.5" />
                  <span>Longitudinal EMR & Charting</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setPatientTab('dashboard')}
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                    patientTab === 'dashboard'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'border border-border bg-card text-card-foreground hover:bg-muted'
                  }`}
                >
                  <HeartPulse className="size-3.5 opacity-70" />
                  <span>Health Chart & Vitals</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPatientTab('intake')}
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                    patientTab === 'intake'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'border border-border bg-card text-card-foreground hover:bg-muted'
                  }`}
                >
                  <Sparkles className="size-3.5 opacity-70" />
                  <span>AI Symptom Assessment</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPatientTab('marketplace')}
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                    patientTab === 'marketplace'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'border border-border bg-card text-card-foreground hover:bg-muted'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Find Board-Certified Specialist</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPatientTab('pharmacy')}
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                    patientTab === 'pharmacy'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'border border-border bg-card text-card-foreground hover:bg-muted'
                  }`}
                >
                  <Pill className="size-3.5 opacity-70" />
                  <span>Prescription Delivery</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── 3. Main Application Canvas (Silicon Valley HealthTech Style) ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 transition-all duration-300">
        {/* =========================================================================
            CLINICIAN WORKSPACE (US HEALTHCARE GRADE)
        ========================================================================== */}
        {currentRole === 'doctor' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Screen 1: Live 3-Panel Telehealth Cockpit */}
            {doctorTab === 'telemedicine' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/70 shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                      <h2 className="text-base font-bold text-slate-900 leading-tight">
                        Encounter in Progress: Louise Reed (Age 30, Female)
                      </h2>
                      <p className="text-xs text-slate-500">
                        Primary Symptom: Throbbing Morning Headache • Connected Vitals: 140/86 mmHg • Member ID: #DG-89241
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      Ambient AI Scribe Active
                    </span>
                    <Button
                      size="sm"
                      onClick={() => setDoctorTab('rx-soap')}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs px-4"
                    >
                      Complete & Finalize Encounter
                    </Button>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden bg-slate-950 min-h-[660px]">
                  <DoctorTelemedicineCockpit
                    onBack={() => setDoctorTab('queue')}
                    onEndVisit={() => setDoctorTab('rx-soap')}
                  />
                </div>
              </div>
            )}

            {/* Screen 2: Outpatient Queue & Triage */}
            {doctorTab === 'queue' && (
              <div className="space-y-4">
                <div className="flex flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-foreground">
                      Active Telehealth Waiting Room & Triage
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Pre-screened patients with AI symptom briefs & continuous vitals sync
                    </p>
                  </div>
                  <Badge variant="outline" className="w-fit border-primary/25 bg-primary/5 text-[11px] font-bold text-primary">
                    3 Patients Scheduled for Next Hour
                  </Badge>
                </div>
                {/* Seven-day agenda strip above the day view, so the schedule
                    question is answered before the queue scrolls off-screen. */}
                <DoctorWeekSchedule />
                <DashboardOverview
                  doctorName="Dr. Alexander Wright, MD, FACC"
                  specialties={['Cardiovascular Medicine', 'Preventive Cardiology']}
                  roleActive={true}
                  availableDays={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']}
                  intakeActivity={{ total: 16, byStatus: { completed: 13, pending: 3 } }}
                  consultationActivity={{ total: 9, byStatus: { completed: 7, in_progress: 2 } }}
                  appointments={mockAppointments}
                  appointmentsHref="#"
                  profileHref="#"
                />
              </div>
            )}

            {/* Screen 3: Clinical Documentation & e-Prescriptions */}
            {doctorTab === 'rx-soap' && (
              <div className="space-y-6 max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                      Post-Encounter Clinical Charting
                    </h2>
                    <p className="text-xs text-slate-500">
                      Ambiently Synthesized SOAP Notes, e-Prescriptions & Cryptographic Signature
                    </p>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs py-1 px-3 font-semibold">
                    HL7 FHIR R4 DiagnosticReport Validated
                  </Badge>
                </div>

                {/* Editorial SOAP Encounter Note */}
                <Card className="rounded-3xl border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden bg-white">
                  <CardHeader className="bg-slate-50/70 border-b border-slate-100 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        <FileText className="size-4 text-blue-600" />
                        Official SOAP Clinical Note & Differential
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {isSoapSaved && (
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 animate-in fade-in">
                            <Check size={12} className="stroke-[3]" />
                            <span>Pushed to EHR Core</span>
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (isEditingSoap) {
                              setIsSoapSaved(true);
                              setIsEditingSoap(false);
                              setTimeout(() => setIsSoapSaved(false), 4000);
                            } else {
                              setIsEditingSoap(true);
                            }
                          }}
                          className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 flex items-center gap-1.5 shadow-2xs transition-colors"
                        >
                          {isEditingSoap ? (
                            <>
                              <Save size={13} className="text-blue-600" />
                              <span>Commit Note</span>
                            </>
                          ) : (
                            <>
                              <Edit3 size={13} className="text-slate-500" />
                              <span>Edit Chart Note</span>
                            </>
                          )}
                        </button>
                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[11px]">
                          Gemini 2.5 Medical Synthesizer
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-5 text-xs">
                    <div>
                      <span className="font-bold uppercase tracking-wider text-[11px] text-blue-700 block mb-1.5">
                        S — Subjective (Patient History & Presenting Illness)
                      </span>
                      {isEditingSoap ? (
                        <textarea
                          rows={3}
                          value={soapData.subjective}
                          onChange={(e) => setSoapData({ ...soapData, subjective: e.target.value })}
                          className="w-full p-3 rounded-2xl border border-blue-200 bg-blue-50/20 text-xs text-slate-900 focus:outline-blue-600 font-sans"
                        />
                      ) : (
                        <p className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 text-slate-800 leading-relaxed">
                          {soapData.subjective}
                        </p>
                      )}
                    </div>
                    <div>
                      <span className="font-bold uppercase tracking-wider text-[11px] text-emerald-700 block mb-1.5">
                        O — Objective (Observed Telemetry & Physical Exam)
                      </span>
                      {isEditingSoap ? (
                        <textarea
                          rows={3}
                          value={soapData.objective}
                          onChange={(e) => setSoapData({ ...soapData, objective: e.target.value })}
                          className="w-full p-3 rounded-2xl border border-blue-200 bg-blue-50/20 text-xs text-slate-900 focus:outline-blue-600 font-sans"
                        />
                      ) : (
                        <p className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 text-slate-800 leading-relaxed">
                          {soapData.objective}
                        </p>
                      )}
                    </div>
                    <div>
                      <span className="font-bold uppercase tracking-wider text-[11px] text-purple-700 block mb-1.5">
                        A — Assessment & Clinical Differential (ICD-10-CM)
                      </span>
                      {isEditingSoap ? (
                        <textarea
                          rows={2}
                          value={soapData.assessment}
                          onChange={(e) => setSoapData({ ...soapData, assessment: e.target.value })}
                          className="w-full p-3 rounded-2xl border border-blue-200 bg-blue-50/20 text-xs text-slate-900 focus:outline-blue-600 font-sans"
                        />
                      ) : (
                        <p className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 text-slate-900 leading-relaxed font-semibold">
                          {soapData.assessment}
                        </p>
                      )}
                    </div>
                    <div>
                      <span className="font-bold uppercase tracking-wider text-[11px] text-amber-700 block mb-1.5">
                        P — Plan & Therapeutics (Rx & Follow-Up)
                      </span>
                      {isEditingSoap ? (
                        <textarea
                          rows={3}
                          value={soapData.plan}
                          onChange={(e) => setSoapData({ ...soapData, plan: e.target.value })}
                          className="w-full p-3 rounded-2xl border border-blue-200 bg-blue-50/20 text-xs text-slate-900 focus:outline-blue-600 font-sans"
                        />
                      ) : (
                        <p className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 text-slate-800 leading-relaxed">
                          {soapData.plan}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Digital Signature & Cryptographic Seal */}
                <div className="relative">
                  <DigitalSignatureAndQrCard />
                  <div className="mt-3 flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => setShowQrVerificationModal(true)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs rounded-xl px-4"
                    >
                      <QrCode size={14} />
                      <span>Verify Cryptographic Digital Signature</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Screen 4: Longitudinal Clinical EMR & Charting */}
            {doctorTab === 'clinical-emr' && (
              <div className="animate-in fade-in space-y-4 duration-300">
                <div className="flex flex-col items-start justify-between gap-3 border-b border-border pb-3 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-foreground">
                      Longitudinal Patient Chart & Clinical EMR
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Problem List, Medication Reconciliation, Diagnostic Reference Ranges & Smart S.O.A.P Note
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                  >
                    FHIR R4 DiagnosticReport & ClinicalImpression Validated
                  </Badge>
                </div>
                <DoctorClinicalRecordsWorkspace />
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            PATIENT CARE PORTAL (ONE MEDICAL / RO CALIBER)
        ========================================================================== */}
        {currentRole === 'patient' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Screen 1: Health Chart & Vitals Dashboard */}
            {patientTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Silicon Valley Grade Hero Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 rounded-3xl p-6 sm:p-9 text-white shadow-xl relative overflow-hidden border border-slate-800">
                  <div className="pointer-events-none absolute -right-16 -top-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />
                  <div className="pointer-events-none absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl" />

                  <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2.5 max-w-xl">
                      <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold text-cyan-200 border border-white/15">
                        <ShieldCheck size={14} />
                        <span>Member ID: #DG-89241 &middot; Active Plan</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                        Good afternoon, Louise. Your care team is active.
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                        Your connected blood pressure monitor synced 42 minutes ago. Your readings are within standard baseline parameters.
                      </p>

                      {/* Booking is the single most common patient task, so it is
                          reachable from the banner instead of hunting for a tab. */}
                      <div className="flex flex-wrap gap-2.5 pt-1">
                        <Button
                          size="sm"
                          onClick={() => setPatientTab('marketplace')}
                          className="h-9 rounded-xl bg-white text-xs font-bold text-slate-900 hover:bg-slate-100"
                        >
                          <CalendarCheck className="mr-1.5 size-4" />
                          Book an Appointment
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPatientTab('intake')}
                          className="h-9 rounded-xl border-white/25 bg-white/10 text-xs font-bold text-white hover:bg-white/15 hover:text-white"
                        >
                          <Sparkles className="mr-1.5 size-4" />
                          Describe My Symptoms
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 shrink-0 shadow-lg">
                      <HealthScoreGauge score={86} label="Excellent" changeNote="+3 pts since last visit" />
                      <div>
                        <div className="text-[11px] text-slate-300 uppercase tracking-wider font-bold">Health Score</div>
                        <div className="text-2xl font-black text-white">86 / 100</div>
                        <div className="text-xs text-emerald-400 font-semibold">Tier 1 &middot; Optimal</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vitals Snapshot & Care Plan Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8 space-y-6">
                    <Card className="rounded-3xl border-slate-200/80 shadow-[0_2px_16px_rgba(0,0,0,0.02)] p-6 bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                          <Activity className="size-5 text-blue-600" />
                          <h3 className="text-sm font-extrabold text-slate-900">Connected Device Telemetry</h3>
                        </div>
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-bold">
                          Live Sync
                        </Badge>
                      </div>
                      <HealthSnapshotGrid />
                    </Card>

                    <Card className="rounded-3xl border-slate-200/80 shadow-[0_2px_16px_rgba(0,0,0,0.02)] p-6 bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                          <CalendarCheck className="size-5 text-teal-600" />
                          <h3 className="text-sm font-extrabold text-slate-900">Today's Care Protocols & Adherence</h3>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">2 of 3 targets met</span>
                      </div>
                      <CarePlanChecklist />
                    </Card>

                    {/* Chat is wide enough only in the main column; in the rail it
                        would collapse the composer to a single glyph. */}
                    <Card className="rounded-3xl border-border bg-card p-6 shadow-xs">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Send className="size-5 text-primary" />
                          <h3 className="text-sm font-extrabold text-foreground">Ask DrGodly</h3>
                        </div>
                        <Badge variant="outline" className="border-primary/25 bg-primary/5 text-[11px] font-bold text-primary">
                          AI + clinician reviewed
                        </Badge>
                      </div>
                      <AskDrGodlyChatWidget />
                    </Card>
                  </div>

                  <div className="lg:col-span-4 space-y-6">
                    <Card className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-extrabold text-foreground">Upcoming Visits</h3>
                        <Badge variant="outline" className="border-primary/25 bg-primary/5 text-[11px] font-bold text-primary">
                          3 scheduled
                        </Badge>
                      </div>

                      <ul className="space-y-2.5">
                        <li className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-2.5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-xs font-bold uppercase tracking-wider text-primary">Today · 10:30 AM</p>
                              <p className="mt-1 text-xs font-bold text-foreground">Video consult</p>
                            </div>
                            <Video className="size-4 shrink-0 text-primary" />
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-xs">
                              AW
                            </div>
                            <div className="min-w-0">
                              <div className="truncate text-xs font-bold text-foreground">Dr. Alexander Wright, MD</div>
                              <div className="truncate text-[11px] text-muted-foreground">Cardiology · Starts in 20 mins</div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => {
                              setCurrentRole('doctor');
                              setDoctorTab('telemedicine');
                            }}
                            className="mt-1 h-9 w-full rounded-xl text-xs font-bold"
                          >
                            Launch Virtual Exam Room
                          </Button>
                        </li>

                        <li className="flex items-center gap-3 rounded-2xl bg-muted/50 p-3.5 ring-1 ring-border/60">
                          <PhoneCall className="size-4 shrink-0 text-muted-foreground" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-foreground">Follow-up call · Dr. Priya Nair</p>
                            <p className="text-[11px] text-muted-foreground">Tomorrow · 04:00 PM · 15 min</p>
                          </div>
                        </li>

                        <li className="flex items-center gap-3 rounded-2xl bg-muted/50 p-3.5 ring-1 ring-border/60">
                          <FileCheck2 className="size-4 shrink-0 text-muted-foreground" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-foreground">Lab draw · Abdi Wellness Center</p>
                            <p className="text-[11px] text-muted-foreground">In 6 days · 09:15 AM · Fasting</p>
                          </div>
                        </li>
                      </ul>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPatientTab('marketplace')}
                        className="mt-1 h-9 w-full rounded-xl text-xs font-bold"
                      >
                        <CalendarCheck className="mr-1.5 size-4" />
                        Book Another Visit
                      </Button>
                    </Card>

                    <Card className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-extrabold text-foreground">Health Records</h3>
                        <Badge variant="outline" className="text-[11px] font-semibold text-muted-foreground">
                          Last 30 days
                        </Badge>
                      </div>

                      <ul className="space-y-1.5 text-xs">
                        {[
                          { label: 'SOAP note · Dr. Wright', meta: 'Today · Visit summary', icon: FileText },
                          { label: 'Lipid panel results', meta: '12 Oct · Lab report', icon: CheckCircle2 },
                          { label: 'Chest X-ray imaging', meta: '28 Sep · Radiology', icon: Activity },
                          { label: 'Immunisation history', meta: 'On file · 6 records', icon: ShieldCheck },
                        ].map((record) => (
                          <li key={record.label} className="flex items-center gap-2.5 rounded-xl px-2 py-2 hover:bg-muted/60">
                            <record.icon className="size-4 shrink-0 text-primary" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-bold text-foreground">{record.label}</p>
                              <p className="truncate text-[11px] text-muted-foreground">{record.meta}</p>
                            </div>
                            <button
                              type="button"
                              aria-label={`Download ${record.label}`}
                              onClick={() =>
                                toast.success('Download requested', {
                                  description: `${record.label} streams from the FHIR document store once the backend is connected.`,
                                })
                              }
                              className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <Download className="size-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </Card>

                    <Card className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-extrabold text-foreground">Active Prescriptions</h3>
                        <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                          Free Delivery
                        </Badge>
                      </div>
                      <div className="space-y-2.5 text-xs">
                        <div className="p-3 rounded-2xl bg-muted/50 ring-1 ring-border/60 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-bold text-foreground">Amlodipine 5mg</div>
                            <div className="text-[11px] text-muted-foreground">1 Tablet Daily · 30-Day Supply</div>
                          </div>
                          <span className="shrink-0 text-xs font-bold text-emerald-700 dark:text-emerald-400">$0 Copay</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-muted/50 ring-1 ring-border/60 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-bold text-foreground">Lisinopril 10mg</div>
                            <div className="text-[11px] text-muted-foreground">1 Tablet Daily · 90-Day Supply</div>
                          </div>
                          <span className="shrink-0 text-xs font-bold text-emerald-700 dark:text-emerald-400">$5 Copay</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPatientTab('pharmacy')}
                        className="mt-1 h-9 w-full rounded-xl text-xs font-bold"
                      >
                        <Pill className="mr-1.5 size-4" />
                        Manage Prescriptions & Refills
                      </Button>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* Screen 2: AI Symptom Intake Studio */}
            {patientTab === 'intake' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                      AI Clinical Intake & Triage
                    </h2>
                    <p className="text-xs text-slate-500">
                      Share your symptoms ahead of your visit for automated provider briefing
                    </p>
                  </div>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200/80 text-xs py-1 px-3">
                    Gemini 2.5 Medical Engine
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Chatbot Interface */}
                  <div className="md:col-span-7">
                    <Card className="rounded-3xl border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col h-[530px] bg-white overflow-hidden">
                      <CardHeader className="bg-slate-50/80 border-b border-slate-100 p-4 shrink-0">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                            <Sparkles className="size-4" />
                          </div>
                          <div>
                            <h3 className="text-xs font-extrabold text-slate-900">DrGodly Virtual Triage</h3>
                            <p className="text-[11px] text-slate-500">Evidence-based clinical intake protocol</p>
                          </div>
                        </div>
                      </CardHeader>

                      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
                        {intakeChatMessages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                                msg.from === 'user'
                                  ? 'bg-blue-600 text-white rounded-br-none shadow-xs'
                                  : 'bg-slate-100/90 text-slate-900 rounded-bl-none border border-slate-200/50'
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2">
                        <Input
                          placeholder="Describe what you are experiencing..."
                          value={intakeInput}
                          onChange={(e) => setIntakeInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && sendIntakeMessage(intakeInput)}
                          className="text-xs bg-white h-9 rounded-xl border-slate-200"
                        />
                        <Button
                          size="sm"
                          onClick={() => sendIntakeMessage(intakeInput)}
                          className="bg-blue-600 hover:bg-blue-700 text-white shrink-0 h-9 px-3.5 rounded-xl shadow-xs"
                        >
                          <Send size={13} />
                        </Button>
                      </div>
                    </Card>
                  </div>

                  {/* Pain Intensity & Quick Chips */}
                  <div className="md:col-span-5 space-y-4">
                    <Card className="rounded-3xl border-slate-200/80 shadow-[0_2px_16px_rgba(0,0,0,0.02)] p-5 bg-white space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-extrabold text-slate-900">Visual Severity Scale</h3>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getPainSeverity(intakePainLevel).color}`}>
                          {getPainSeverity(intakePainLevel).label}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                          <span>0 (None)</span>
                          <span className="text-blue-600 text-sm font-black">{intakePainLevel} / 10</span>
                          <span>10 (Debilitating)</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={10}
                          value={intakePainLevel}
                          onChange={(e) => setIntakePainLevel(Number(e.target.value))}
                          className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                        />
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-600 space-y-1.5">
                        <span className="font-bold text-slate-800">Quick Symptoms Tags:</span>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {['Morning Headache', 'BP > 140/90', 'Lightheadedness', 'No Chest Pain'].map((chip) => (
                            <button
                              key={chip}
                              type="button"
                              onClick={() => sendIntakeMessage(chip)}
                              className="px-2.5 py-1 rounded-xl bg-white border border-slate-200/80 hover:border-blue-400 text-slate-800 text-[11px] font-bold transition shadow-2xs"
                            >
                              + {chip}
                            </button>
                          ))}
                        </div>
                      </div>
                    </Card>

                    <Card className="rounded-3xl border-blue-200 bg-blue-50/40 p-5 space-y-2.5">
                      <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                        <ShieldCheck className="size-4 text-blue-600" />
                        <span>Physician Pre-Encounter Brief Ready</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Your symptom details will be synthesized into an AI encounter summary. Dr. Wright will review this before joining your video consultation.
                      </p>
                      <Button
                        size="sm"
                        onClick={() => {
                          setCurrentRole('doctor');
                          setDoctorTab('telemedicine');
                        }}
                        className="w-full mt-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs"
                      >
                        Proceed to Virtual Consultation
                      </Button>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* Screen 3: Find Specialist Doctor */}
            {patientTab === 'marketplace' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                      Board-Certified Specialist Network
                    </h2>
                    <p className="text-xs text-slate-500">
                      NPI Verified &middot; Harvard, Johns Hopkins & Stanford Affiliated Faculty
                    </p>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs py-1 px-3 font-semibold">
                    Same-Day Appointments Available
                  </Badge>
                </div>
                <DoctorSearchMarketplace />
              </div>
            )}

            {/* Screen 4: Prescription Delivery */}
            {patientTab === 'pharmacy' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                      Prescription Delivery & Pharmacy Fulfillment
                    </h2>
                    <p className="text-xs text-slate-500">
                      Direct-to-door courier delivery &middot; Automated insurance copay verification
                    </p>
                  </div>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200/80 text-xs py-1 px-3 font-semibold">
                    Capsule & Alto Pharmacy Network
                  </Badge>
                </div>
                <GenericPharmacyCheckout />
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── 4. Cryptographic Integrity Certificate Modal ── */}
      {showQrVerificationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 flex flex-col gap-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    Cryptographic Encounter Verification
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    National Provider Identifier (NPI) &middot; FHIR R4 DiagnosticReport
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowQrVerificationModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex items-center gap-3">
              <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-950">100% Cryptographically Validated Encounter</p>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  This electronic prescription has been digitally signed using an authorized DEA/NPI private key and hashed with SHA-256.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Treating Clinician:</span>
                <span className="font-bold text-slate-900">Dr. Alexander Wright, MD, FACC</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">National Provider Identifier:</span>
                <span className="font-mono font-bold text-blue-700">NPI #1982736450</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Patient Identifier:</span>
                <span className="font-mono font-bold text-slate-900">ID #DG-89241</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Encounter Timestamp:</span>
                <span className="font-semibold text-slate-900">27 Oct 2026 &middot; 10:30:15 EST</span>
              </div>
              <div className="flex flex-col gap-1 py-1.5">
                <span className="text-slate-500">SHA-256 Tamper-Proof Digital Fingerprint:</span>
                <span className="font-mono text-[11px] bg-slate-100 p-2.5 rounded-xl text-slate-700 break-all border border-slate-200">
                  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowQrVerificationModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Downloading Tamper-Evident Signed Clinical PDF...');
                  setShowQrVerificationModal(false);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Download size={13} />
                <span>Download Signed Clinical PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. Master US HealthTech Footer ── */}
      <GlobalFooter />
    </div>
  );
}

/**
 * The content reads `useSearchParams`, so it needs a Suspense boundary — without
 * one, Next's prerender of /screens fails while trying to statically generate a
 * route whose output depends on the query string.
 */
export default function ScreensShowcasePage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-xs font-semibold text-muted-foreground">
          Loading DrGodly Workstation…
        </div>
      }
    >
      <ScreensShowcaseContent />
    </React.Suspense>
  );
}
