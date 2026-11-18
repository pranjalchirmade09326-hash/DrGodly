/**
 * mockWorkflowData — every data state the routing dashboard renders.
 *
 * Layer: client / workflow-dashboard / data
 *
 * The dashboard is a frontend-only showcase, so nothing here is fetched: the
 * panel list, vitals series, record timelines, alerts and appointment ledger are
 * literal mock objects. Numbers are clinically plausible rather than random so
 * the vitals cards, sparkline shapes and status badges can be reviewed together.
 *
 * `getPatientRecord(id)` returns a full record for the three patients that were
 * authored by hand and a derived record for everyone else, which keeps the
 * patient route from ever rendering an empty state when deep-linked by id.
 */

export type VitalStatus = 'normal' | 'elevated' | 'low' | 'critical';

export type VitalKey = 'heartRate' | 'bloodPressure' | 'temperature';

export type VitalReading = {
  key: VitalKey;
  label: string;
  value: string;
  unit: string;
  status: VitalStatus;
  reference: string;
  measuredAt: string;
  /** Sparkline points. For BP these are the systolic values. */
  series: readonly number[];
  seriesNote: string;
};

export type RecordKind = 'visit' | 'diagnosis' | 'prescription' | 'lab' | 'imaging';

export type TimelineEntry = {
  id: string;
  kind: RecordKind;
  title: string;
  detail: string;
  date: string;
  clinician: string;
  tags: readonly string[];
};

export type CriticalAlert = {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  detail: string;
  source: string;
};

export type ActiveMedication = {
  id: string;
  name: string;
  dosage: string;
  schedule: string;
  refillsLeft: number;
};

export type PatientRecord = {
  id: string;
  name: string;
  initials: string;
  age: number;
  sex: 'Female' | 'Male';
  bloodType: string;
  mrn: string;
  plan: string;
  risk: 'Routine' | 'Accelerated' | 'High complexity';
  primaryClinician: string;
  lastSync: string;
  allergies: readonly string[];
  vitals: readonly VitalReading[];
  alerts: readonly CriticalAlert[];
  timeline: readonly TimelineEntry[];
  medications: readonly ActiveMedication[];
};

export type OverviewMetric = {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaTone: 'up-good' | 'up-bad' | 'flat';
  hint: string;
  series: readonly number[];
};

export type AppointmentRow = {
  id: string;
  patient: string;
  clinician: string;
  when: string;
  channel: 'Video' | 'Phone' | 'In person' | 'Lab';
  status: 'confirmed' | 'awaiting' | 'completed' | 'cancelled';
  serviceType: string;
};

export type CareGapRow = {
  id: string;
  patient: string;
  gap: string;
  overdueBy: string;
  severity: 'critical' | 'warning' | 'info';
};

// ── Vitals builders ──────────────────────────────────────────────────────────

type Baseline = {
  hr: number;
  systolic: number;
  diastolic: number;
  temp: number;
  status: { hr: VitalStatus; bp: VitalStatus; temp: VitalStatus };
};

/** Deterministic 12-point series around a baseline, no random per render. */
function series(around: number, offsets: readonly number[]): number[] {
  return offsets.map((offset) => around + offset);
}

const HR_OFFSETS = [-4, -2, -3, 1, 2, -1, 3, 0, -2, 1, 2, 0];
const SYS_OFFSETS = [-6, -3, -1, 2, 5, 3, 7, 4, 1, 3, 6, 4];
const TEMP_OFFSETS = [-0.3, -0.2, -0.1, 0, 0.1, -0.1, 0.2, 0.3, 0.1, 0, 0.2, 0.1];

function buildVitals(baseline: Baseline): VitalReading[] {
  return [
    {
      key: 'heartRate',
      label: 'Heart Rate',
      value: String(baseline.hr),
      unit: 'bpm',
      status: baseline.status.hr,
      reference: '60–100 bpm at rest',
      measuredAt: '08:40 · Wearable',
      series: series(baseline.hr, HR_OFFSETS),
      seriesNote: 'Resting pulse, 12-hour rolling window',
    },
    {
      key: 'bloodPressure',
      label: 'Blood Pressure',
      value: `${baseline.systolic}/${baseline.diastolic}`,
      unit: 'mmHg',
      status: baseline.status.bp,
      reference: '< 120/80 mmHg',
      measuredAt: '07:55 · Home cuff',
      series: series(baseline.systolic, SYS_OFFSETS),
      seriesNote: 'Systolic readings, morning and evening',
    },
    {
      key: 'temperature',
      label: 'Temperature',
      value: baseline.temp.toFixed(1),
      unit: '°F',
      status: baseline.status.temp,
      reference: '97.0–99.0 °F',
      measuredAt: '22:10 · Reported',
      series: series(baseline.temp, TEMP_OFFSETS).map((n) => Number(n.toFixed(1))),
      seriesNote: 'Self-reported nightly readings',
    },
  ];
}

// ── Panel list ───────────────────────────────────────────────────────────────

const LOUISE: PatientRecord = {
  id: 'pt-louise',
  name: 'Louise Reed',
  initials: 'LR',
  age: 30,
  sex: 'Female',
  bloodType: 'O+',
  mrn: 'DG-89241',
  plan: 'Commercial PPO',
  risk: 'Accelerated',
  primaryClinician: 'Dr. Alexander Wright, MD, FACC',
  lastSync: '42 minutes ago',
  allergies: ['Penicillin — anaphylaxis history', 'Latex — contact urticaria'],
  vitals: buildVitals({
    hr: 72,
    systolic: 142,
    diastolic: 88,
    temp: 98.4,
    status: { hr: 'normal', bp: 'elevated', temp: 'normal' },
  }),
  alerts: [
    {
      id: 'al-louise-bp',
      severity: 'critical',
      title: 'Systolic pressure above target for 4 consecutive days',
      detail:
        'Home cuff average 142/88 mmHg against a target below 130/80. Amlodipine 5 mg started 27 Oct — reassess in 14 days.',
      source: 'Connected BP monitor · Hypertension protocol',
    },
    {
      id: 'al-louise-allergy',
      severity: 'warning',
      title: 'Penicillin allergy — prescribing blocked',
      detail: 'Beta-lactam class flagged in the CDS bundle; alternatives surfaced at e-Rx.',
      source: 'AllergyIntolerance · DG-89241',
    },
    {
      id: 'al-louise-lipid',
      severity: 'info',
      title: 'LDL recheck due',
      detail: 'Fasting lipid panel is 8 weeks out since the 12 Oct result.',
      source: 'Preventive care schedule',
    },
  ],
  timeline: [
    {
      id: 'tl-louise-1',
      kind: 'visit',
      title: 'Telehealth encounter — hypertension initiation',
      detail:
        'Throbbing morning headache for 3 days. SOAP note signed, Amlodipine 5 mg started, 14-day home BP log ordered.',
      date: '27 Oct 2026',
      clinician: 'Dr. Alexander Wright, MD, FACC',
      tags: ['ICD-10 I10', 'ICD-10 G44.209', 'Signed'],
    },
    {
      id: 'tl-louise-2',
      kind: 'prescription',
      title: 'Amlodipine besylate 5 mg',
      detail: 'One tablet each morning, 30-day supply, 2 refills remaining, $0 copay.',
      date: '27 Oct 2026',
      clinician: 'Dr. Alexander Wright, MD, FACC',
      tags: ['Active', '30-day'],
    },
    {
      id: 'tl-louise-3',
      kind: 'lab',
      title: 'Lipid panel',
      detail: 'LDL 118 mg/dL, HDL 51 mg/dL, triglycerides 142 mg/dL. Lifestyle counselling documented.',
      date: '12 Oct 2026',
      clinician: 'Ordered by Dr. Priya Nair, MD',
      tags: ['Resulted', 'Fasting'],
    },
    {
      id: 'tl-louise-4',
      kind: 'imaging',
      title: 'Chest X-ray — two views',
      detail: 'No acute cardiopulmonary process. Cardiac silhouette within normal limits.',
      date: '28 Sep 2026',
      clinician: 'Radiology — Abdi Wellness Center',
      tags: ['Final', 'No findings'],
    },
    {
      id: 'tl-louise-5',
      kind: 'diagnosis',
      title: 'Essential hypertension — added to problem list',
      detail: 'Confirmed on serial home readings after two supervised measurements.',
      date: '27 Oct 2026',
      clinician: 'Dr. Alexander Wright, MD, FACC',
      tags: ['Problem list', 'Chronic'],
    },
    {
      id: 'tl-louise-6',
      kind: 'visit',
      title: 'Annual wellness visit',
      detail: 'BMI 23.4, immunisations reviewed, depression screen negative, continuity confirmed.',
      date: '06 Aug 2026',
      clinician: 'Dr. Priya Nair, MD',
      tags: ['Preventive', 'Complete'],
    },
  ],
  medications: [
    { id: 'rx-louise-1', name: 'Amlodipine 5 mg', dosage: '1 tablet daily', schedule: 'Morning', refillsLeft: 2 },
    { id: 'rx-louise-2', name: 'Lisinopril 10 mg', dosage: '1 tablet daily', schedule: 'Evening', refillsLeft: 1 },
  ],
};

const MARCUS: PatientRecord = {
  ...LOUISE,
  id: 'pt-chen',
  name: 'Marcus Chen',
  initials: 'MC',
  age: 41,
  sex: 'Male',
  bloodType: 'A-',
  mrn: 'DG-54129',
  plan: 'High deductible PPO',
  risk: 'High complexity',
  primaryClinician: 'Dr. Alexander Wright, MD, FACC',
  lastSync: '3 hours ago',
  allergies: ['Sulfa drugs — rash'],
  vitals: buildVitals({
    hr: 88,
    systolic: 150,
    diastolic: 94,
    temp: 98.9,
    status: { hr: 'normal', bp: 'critical', temp: 'normal' },
  }),
  alerts: [
    {
      id: 'al-chen-bp',
      severity: 'critical',
      title: 'Stage 2 hypertension range — clinician outreach pending',
      detail:
        'Average 150/94 mmHg over 7 days with two readings above 160 systolic. Escalation rule fired at 06:00.',
      source: 'Hypertension protocol · Escalation',
    },
    {
      id: 'al-chen-hba1c',
      severity: 'warning',
      title: 'HbA1c 8.1% — endocrine review recommended',
      detail: 'Metformin adherence at 62% by pharmacy refill history.',
      source: 'Laboratory · Diabetes registry',
    },
  ],
  timeline: [
    {
      id: 'tl-chen-1',
      kind: 'visit',
      title: 'In-person consult — hypertension protocol & lab review',
      detail: 'Weight 84 kg, no oedema. Added spironolactone discussion; 2-week return scheduled.',
      date: '02 Nov 2026',
      clinician: 'Dr. Alexander Wright, MD, FACC',
      tags: ['In person', 'Chronic care'],
    },
    {
      id: 'tl-chen-2',
      kind: 'lab',
      title: 'Comprehensive metabolic panel',
      detail: 'Creatinine 1.1 mg/dL, eGFR 88, potassium 4.2 mmol/L.',
      date: '30 Oct 2026',
      clinician: 'Ordered by Dr. Alexander Wright',
      tags: ['Resulted'],
    },
    {
      id: 'tl-chen-3',
      kind: 'prescription',
      title: 'Metformin XR 1000 mg',
      detail: 'Twice daily with meals, 90-day supply, refills exhausted.',
      date: '15 Oct 2026',
      clinician: 'Dr. Priya Nair, MD',
      tags: ['Refill needed', '90-day'],
    },
  ],
  medications: [
    { id: 'rx-chen-1', name: 'Lisinopril 20 mg', dosage: '1 tablet daily', schedule: 'Morning', refillsLeft: 0 },
    { id: 'rx-chen-2', name: 'Metformin XR 1000 mg', dosage: '1 tablet twice daily', schedule: 'Meals', refillsLeft: 0 },
  ],
};

const SARAH: PatientRecord = {
  ...LOUISE,
  id: 'pt-jenkins',
  name: 'Sarah Jenkins',
  initials: 'SJ',
  age: 67,
  sex: 'Female',
  bloodType: 'B+',
  mrn: 'DG-31092',
  plan: 'Medicare Advantage',
  risk: 'Accelerated',
  primaryClinician: 'Dr. Priya Nair, MD',
  lastSync: 'Yesterday, 21:05',
  allergies: [],
  vitals: buildVitals({
    hr: 64,
    systolic: 126,
    diastolic: 78,
    temp: 97.6,
    status: { hr: 'normal', bp: 'normal', temp: 'normal' },
  }),
  alerts: [
    {
      id: 'al-sarah-inr',
      severity: 'warning',
      title: 'Anticoagulation monitoring overdue',
      detail: 'Last INR 12 weeks ago while on apixaban; annual echo also outstanding.',
      source: 'Cardiology registry',
    },
  ],
  timeline: [
    {
      id: 'tl-sarah-1',
      kind: 'visit',
      title: 'Video consult — lipid management',
      detail: 'Atorvastatin continued; adherence discussed; repeat panel in 8 weeks.',
      date: '24 Oct 2026',
      clinician: 'Dr. Priya Nair, MD',
      tags: ['Video', 'Chronic care'],
    },
    {
      id: 'tl-sarah-2',
      kind: 'imaging',
      title: 'Echocardiogram',
      detail: 'EF 58%, mild diastolic dysfunction, no valvular disease.',
      date: '09 Oct 2026',
      clinician: 'Cardiac Imaging',
      tags: ['Final'],
    },
  ],
  medications: [
    { id: 'rx-sarah-1', name: 'Atorvastatin 40 mg', dosage: '1 tablet daily', schedule: 'Evening', refillsLeft: 3 },
    { id: 'rx-sarah-2', name: 'Apixaban 2.5 mg', dosage: '1 tablet twice daily', schedule: 'Meals', refillsLeft: 2 },
  ],
};

/** Names used by the derived-record fallback so the list never dead-ends. */
const PANEL_EXTRAS: Array<Omit<PatientRecord, 'vitals' | 'alerts' | 'timeline' | 'medications'>> = [
  {
    id: 'pt-alvarez',
    name: 'Nina Alvarez',
    initials: 'NA',
    age: 34,
    sex: 'Female',
    bloodType: 'AB+',
    mrn: 'DG-77410',
    plan: 'Employer sponsored',
    risk: 'Routine',
    primaryClinician: 'Dr. Emily Vance, MD',
    lastSync: '26 minutes ago',
    allergies: [],
  },
  {
    id: 'pt-osei',
    name: 'Amara Osei',
    initials: 'AO',
    age: 52,
    sex: 'Female',
    bloodType: 'O-',
    mrn: 'DG-60218',
    plan: 'Medicare Advantage',
    risk: 'Accelerated',
    primaryClinician: 'Dr. Alexander Wright, MD, FACC',
    lastSync: '2 hours ago',
    allergies: ['Codeine — nausea'],
  },
  {
    id: 'pt-klein',
    name: 'Robert Klein',
    initials: 'RK',
    age: 58,
    sex: 'Male',
    bloodType: 'A+',
    mrn: 'DG-45002',
    plan: 'Commercial PPO',
    risk: 'High complexity',
    primaryClinician: 'Dr. Priya Nair, MD',
    lastSync: '5 hours ago',
    allergies: ['Aspirin — hives'],
  },
];

const AUTHORED_RECORDS: PatientRecord[] = [LOUISE, MARCUS, SARAH];

/** Baselines for the derived patients, indexed by id so records stay stable. */
const DERIVED_BASELINES: Record<string, Baseline> = {
  'pt-alvarez': { hr: 66, systolic: 118, diastolic: 74, temp: 98.1, status: { hr: 'normal', bp: 'normal', temp: 'normal' } },
  'pt-osei': { hr: 79, systolic: 134, diastolic: 84, temp: 98.6, status: { hr: 'normal', bp: 'elevated', temp: 'normal' } },
  'pt-klein': { hr: 92, systolic: 146, diastolic: 92, temp: 99.4, status: { hr: 'elevated', bp: 'critical', temp: 'elevated' } },
};

function deriveRecord(extras: (typeof PANEL_EXTRAS)[number]): PatientRecord {
  const baseline = DERIVED_BASELINES[extras.id] ?? {
    hr: 70,
    systolic: 122,
    diastolic: 78,
    temp: 98.2,
    status: { hr: 'normal', bp: 'normal', temp: 'normal' },
  };
  const elevatedBp = baseline.status.bp !== 'normal';

  return {
    ...extras,
    vitals: buildVitals(baseline),
    alerts: elevatedBp
      ? [
          {
            id: `al-${extras.id}-bp`,
            severity: 'warning',
            title: 'Blood pressure above target — clinician review queued',
            detail: `Average ${baseline.systolic}/${baseline.diastolic} mmHg across the last 5 synced readings.`,
            source: 'Connected BP monitor',
          },
        ]
      : [
          {
            id: `al-${extras.id}-routine`,
            severity: 'info',
            title: 'Preventive care on schedule',
            detail: 'No open escalations. Next annual review is due in 4 months.',
            source: 'Preventive care schedule',
          },
        ],
    timeline: [
      {
        id: `tl-${extras.id}-1`,
        kind: 'visit',
        title: 'Routine follow-up',
        detail: 'Chronic medications continued, home readings reviewed, no new symptoms reported.',
        date: '18 Oct 2026',
        clinician: extras.primaryClinician,
        tags: ['Video', 'Complete'],
      },
      {
        id: `tl-${extras.id}-2`,
        kind: 'prescription',
        title: 'Maintenance therapy continued',
        detail: '90-day supply released to the patient’s preferred pharmacy.',
        date: '18 Oct 2026',
        clinician: extras.primaryClinician,
        tags: ['Active'],
      },
      {
        id: `tl-${extras.id}-3`,
        kind: 'lab',
        title: 'Basic metabolic panel',
        detail: 'Within reference ranges; recheck in 6 months.',
        date: '02 Oct 2026',
        clinician: 'Reference laboratory',
        tags: ['Resulted'],
      },
    ],
    medications: [
      { id: `rx-${extras.id}-1`, name: 'Low-dose statin', dosage: '1 tablet daily', schedule: 'Evening', refillsLeft: 2 },
    ],
  };
}

const ALL_RECORDS: Record<string, PatientRecord> = Object.fromEntries([
  ...AUTHORED_RECORDS.map((record) => [record.id, record]),
  ...PANEL_EXTRAS.map((extras) => [extras.id, deriveRecord(extras)]),
]);

/** Panel order the directory renders. */
export const PATIENT_DIRECTORY: PatientRecord[] = [
  LOUISE,
  MARCUS,
  SARAH,
  ALL_RECORDS['pt-alvarez'],
  ALL_RECORDS['pt-osei'],
  ALL_RECORDS['pt-klein'],
];

export function getPatientRecord(id: string | undefined): PatientRecord {
  if (id && ALL_RECORDS[id]) return ALL_RECORDS[id];
  return LOUISE;
}

export function getPatientBrief(record: PatientRecord) {
  return {
    id: record.id,
    name: record.name,
    initials: record.initials,
    age: record.age,
    sex: record.sex,
    risk: record.risk,
    bloodType: record.bloodType,
    mrn: record.mrn,
    lastSync: record.lastSync,
    primaryClinician: record.primaryClinician,
  };
}

// ── Overview + ledger mocks ──────────────────────────────────────────────────

export const OVERVIEW_METRICS: OverviewMetric[] = [
  {
    id: 'm-patients',
    label: 'Patients today',
    value: '38',
    delta: '+6 vs last Tue',
    deltaTone: 'up-good',
    hint: 'Unique patients with a booked encounter',
    series: [26, 28, 31, 29, 33, 35, 38],
  },
  {
    id: 'm-appointments',
    label: 'Appointments today',
    value: '46',
    delta: '+11% week over week',
    deltaTone: 'up-good',
    hint: 'Includes 14 video and 5 phone visits',
    series: [31, 34, 33, 38, 40, 42, 46],
  },
  {
    id: 'm-wait',
    label: 'Average wait',
    value: '6 min',
    delta: '-2 min vs target',
    deltaTone: 'up-good',
    hint: 'Check-in to clinician join',
    series: [12, 11, 9, 10, 8, 7, 6],
  },
  {
    id: 'm-alerts',
    label: 'Open critical alerts',
    value: '3',
    delta: '+1 since morning',
    deltaTone: 'up-bad',
    hint: 'Escalation rules that fired and are unacknowledged',
    series: [0, 1, 1, 2, 2, 2, 3],
  },
];

export const CARE_GAP_QUEUE: CareGapRow[] = [
  {
    id: 'cg-1',
    patient: 'Marcus Chen',
    gap: 'Stage 2 hypertension — outreach not acknowledged',
    overdueBy: 'Today',
    severity: 'critical',
  },
  {
    id: 'cg-2',
    patient: 'Sarah Jenkins',
    gap: 'INR monitoring overdue while on anticoagulation',
    overdueBy: '12 weeks',
    severity: 'warning',
  },
  {
    id: 'cg-3',
    patient: 'Robert Klein',
    gap: 'Refill exhausted — metformin adherence gap',
    overdueBy: '9 days',
    severity: 'warning',
  },
  {
    id: 'cg-4',
    patient: 'Louise Reed',
    gap: 'Fasting lipid panel recheck due',
    overdueBy: '8 weeks',
    severity: 'info',
  },
];

export const APPOINTMENT_LEDGER: AppointmentRow[] = [
  {
    id: 'ap-1',
    patient: 'Louise Reed',
    clinician: 'Dr. Alexander Wright',
    when: 'Today · 10:30 AM',
    channel: 'Video',
    status: 'confirmed',
    serviceType: 'Hypertension follow-up',
  },
  {
    id: 'ap-2',
    patient: 'Marcus Chen',
    clinician: 'Dr. Alexander Wright',
    when: 'Today · 11:30 AM',
    channel: 'In person',
    status: 'confirmed',
    serviceType: 'Protocol review & lab check',
  },
  {
    id: 'ap-3',
    patient: 'Nina Alvarez',
    clinician: 'Dr. Emily Vance',
    when: 'Today · 02:00 PM',
    channel: 'Video',
    status: 'awaiting',
    serviceType: 'New symptom intake',
  },
  {
    id: 'ap-4',
    patient: 'Amara Osei',
    clinician: 'Dr. Priya Nair',
    when: 'Tomorrow · 09:15 AM',
    channel: 'Phone',
    status: 'confirmed',
    serviceType: 'Post-discharge call',
  },
  {
    id: 'ap-5',
    patient: 'Sarah Jenkins',
    clinician: 'Dr. Priya Nair',
    when: 'Tomorrow · 04:00 PM',
    channel: 'Phone',
    status: 'confirmed',
    serviceType: '15-minute medication check',
  },
  {
    id: 'ap-6',
    patient: 'Robert Klein',
    clinician: 'Lab network',
    when: 'In 6 days · 09:15 AM',
    channel: 'Lab',
    status: 'awaiting',
    serviceType: 'Fasting metabolic panel',
  },
  {
    id: 'ap-7',
    patient: 'Louise Reed',
    clinician: 'Dr. Alexander Wright',
    when: '27 Oct · 10:30 AM',
    channel: 'Video',
    status: 'completed',
    serviceType: 'Initial hypertension visit',
  },
  {
    id: 'ap-8',
    patient: 'Nina Alvarez',
    clinician: 'Dr. Emily Vance',
    when: '24 Oct · 01:00 PM',
    channel: 'Video',
    status: 'cancelled',
    serviceType: 'Rescheduled by patient',
  },
];

export const ACTIVITY_RIBBON: readonly string[] = [
  '12 SOAP notes auto-synthesised and signed',
  '42 connected-device readings ingested',
  '9 e-prescriptions released to pharmacy network',
  '3 escalation rules fired and routed',
];

export const DEMO_IDENTITY = {
  name: 'Dr. Alexander Wright, MD, FACC',
  role: 'Chief of Cardiology',
  npi: 'NPI #1982736450',
  initials: 'AW',
} as const;
