# 🩺 DrGodly Frontend: Enterprise Web UI Workstation & Documentation

> **Official Brand Vision**: *"Healthcare that knows your story."*  
> **Core Product Philosophy**: *"AI does the preparation. Doctors do the care. Patients get a better healthcare experience."*  
> **Platform Standard**: 100% Responsive Clinical Web Application (Desktop-first Workstation with Tablet/Mobile Web Adaptability). Built with Next.js 16.2.4 (React 19), Tailwind CSS v4, Lucide React, and TypeScript.  
> **Interoperability**: HL7® FHIR® Release 4 compliant & Ayushman Bharat Digital Mission (ABDM M1/M2/M3) ready.

---

## ⚡ 1. Quick Start Guide (Standard `npm` Workflow)

DrGodly is engineered to run seamlessly with standard Node.js and **`npm`**:

### Prerequisites
* **Node.js**: v20.x or higher LTS
* **npm**: v10.x or higher

### Installation & Execution
```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install all dependencies using npm
npm install

# 3. Launch the development server on Port 4000
npm run dev

# 4. Verify all TypeScript types with zero errors
npm run typecheck

# 5. Build for production deployment
npm run build
```

Once running, access the application at:
* **Interactive Screen Studio (Zero-Backend Mode)**: 👉 **`http://localhost:4000/en/screens`**
* **Universal Split-Screen Login Portal**: 👉 **`http://localhost:4000/en/login`**
* **Doctor Verification & Registration**: 👉 **`http://localhost:4000/en/signup`**
* **Public Marketing Homepage**: 👉 **`http://localhost:4000/en`**

---

## 📁 2. Production Directory & Architectural Layout

The frontend follows a Domain-Driven, Modular Feature architecture:

```
frontend/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx           # Split-screen Marketing Login (60/40) with Role Tabs
│   │   │   │   └── signup/page.tsx          # Doctor / Patient Registration & NMC Verification
│   │   │   ├── (marketing)/                 # Public Landing Page ("Healthcare that knows your story")
│   │   │   │   └── page.tsx                 # Hero, Context Flywheel, FHIR R4 Grid, Features, Trust
│   │   │   ├── screens/page.tsx             # Interactive Screen Studio (Zero-Backend Mode)
│   │   │   ├── doctor/                      # Doctor Portal Routes
│   │   │   │   ├── dashboard/page.tsx       # Clinical Workstation Overview & Triage Queue
│   │   │   │   └── appointments/            # Active Consultations & Review
│   │   │   │       └── [id]/
│   │   │   │           ├── online-consultation/page.tsx # 3-Panel Consultation Cockpit
│   │   │   │           └── review/page.tsx              # Post-Visit SOAP & e-Prescription Review
│   │   │   └── patient/                     # Patient Portal Routes
│   │   │       ├── dashboard/page.tsx       # Wellness Dashboard (Health Score Gauge 88/100)
│   │   │       ├── intake/page.tsx          # AI Clinical Intake Studio (Anatomical Map, VAS 1-10)
│   │   │       ├── appointments/            # Patient Visits & Specialist Booking Wizard
│   │   │       └── medical-records/         # ABDM Digital Health Records Locker
│   │   ├── api/                             # API Handlers, FastMCP Endpoints, Scalar OpenAPI Docs
│   │   └── globals.css                      # Tailwind CSS v4, Clinical Color Tokens, Spacing Scale
│   │
│   ├── components/                          # Atomic & Molecular UI Components
│   │   ├── ui/                              # Atoms: Button, Card, Input, Tabs, Dialog, Slider
│   │   ├── layout/                          # Organisms: GlobalHeader, GlobalFooter, AppSidebar
│   │   ├── clinical/                        # Molecules: ClinicalStatusBadge, ConsultationSlotPicker, ClinicalMetricCard
│   │   └── shared/                          # Brand Logos, Avatar Badges, Shell Navbars
│   │
│   ├── modules/                             # Domain-Specific Clinical Feature Engines
│   │   ├── client/                          # Client Components & Interactive Workspaces
│   │   │   ├── layout/                      # Top Header, 10-Item Sidebar, Patient Context Bar
│   │   │   ├── doctor-search/               # Specialist Marketplace, Filter Sidebar, Result Cards, Pagination
│   │   │   ├── (marketing)/                 # Hero, ContextFlywheelSection, McpSection, Features
│   │   │   └── telemedicine/
│   │   │       ├── doctor/component/        # 3-Panel Cockpit, Dossier, Video Stage, CDS, Digital Signature
│   │   │       └── patient/component/       # AI Intake Studio, Health Score Gauge, Generic Pharmacy
│   │   ├── server/                          # Server Actions, Auth Providers, ZSA Safe Actions
│   │   ├── entities/                        # FHIR R4 schemas (Patient, Practitioner, Encounter, Observation)
│   │   └── shared/                          # Helpers, Date formatters, Clinical validators
│   │
│   ├── i18n/                                # Multilingual Routing Engine (English, हिन्दी, தமிழ்)
│   └── lib/                                 # Global utilities (cn, clsx)
│
├── public/                                  # High-resolution clinical assets, icons, brand badges
├── package.json                             # Dependencies & standard npm scripts
└── tsconfig.json                            # Strict TypeScript configuration
```

---

## 🖥️ 3. Core Web UI Screens (Detailed Specifications)

### Screen 1: Universal Split-Screen Login Experience (`/login`)
* **Visual Blueprint**: Desktop 60/40 Split-Screen layout designed for high-conversion and clinical trust.
* **Left Marketing Panel (60%)**:
  * **Brand Heading**: *"Better Care. For A Healthier You."* (Subtitle: *"Care Smarter. Together."*).
  * **DrGodly Brand Mark**: Blue-to-cyan gradient squircle with white heart and blue `+` center.
  * **4 Value Proposition Pills**:
    1. `AI Health Intake`: Share your symptoms in your own words.
    2. `Consult with Trusted Doctors`: Connect with licensed medical professionals.
    3. `AI Clinical Support`: Better decisions for better outcomes.
    4. `Your Health Journey`: Continuous, personalized care.
  * **Physician Team Quote Card**: *"Technology should bring you closer to care, not further away. — The DrGodly Team"*.
  * **Verified Trust Statistics**:
    * `100,000+` Patients Trust DrGodly
    * `500+` Licensed Doctors
    * `Accessible` Across India and Beyond
* **Right Authentication Card (40%)**:
  * Language Selector: English, हिन्दी, தமிழ்.
  * Role Switcher: `Patient` vs `Doctor` tabs with instant 1-click demo credential autofill.
  * Social Sign-In: Google & Apple authentication buttons.
  * Security & Compliance Card: Embedded **HIPAA**, **ABDM M1/M2/M3**, and **ISO 27001** badges.

---

### Screen 2: Doctor Clinical Workstation Dashboard (`/doctor/dashboard`)
* **KPI Metrics Row**: Today's Appointments (14), In Waiting Lobby (3), Completed Visits (11), Average Consult Duration (11m 42s).
* **Live Consult Queue Table**:
  * Patient Avatar, Demographic summary, Arrival status, Triage badge (`Urgent` vs `Routine`), and *"Start Video Consult"* button.
* **AI Clinical Assistant Widget**: Quick natural-language prompt chips (*"Summarize pending lab results"*, *"Check drug interactions"*).
* **Critical Lab In-Basket**: Abnormal lab findings flagged by FastMCP OCR.

---

### Screen 3: Doctor 3-Panel Consultation Cockpit (`DoctorTelemedicineCockpit.tsx`)
* **Specification**: Proprietary 3-Panel Clinical Telemedicine Workstation with continuous WebRTC and real-time Clinical Decision Support (CDS).
* **Persistent Consultation Architecture**:
  * The video call remains active at all times while the doctor navigates between information layers.
* **Top Patient Context Bar**:
  * Patient Name: **Louise Reed**
  * Demographics: **Female • Age 30 • ID #DG100328**
  * Demographic Badges: `Established Patient`, `Video Visit`, `Hypertension`, `Migraine`
  * Chief Reason: `Dizziness and headache`
  * Active Call Timer: **🕒 12:34** (Live elapsed counter)
  * Emergency Action: Red **End Visit** button
* **Left Panel (~28%) — Patient Medical Dossier**:
  * Sub-tabs: `AI Intake Summary`, `History`, `Documents`
  * Chief Complaint & AI-summarized HPI Narrative
  * Vitals Grid: BP `118/76 mmHg`, Heart Rate `72 bpm`, Temp `98.1°F`, SpO2 `99%`
  * Active Medications: Amlodipine 5mg OD, Sumatriptan 50mg SOS
  * Allergies: Penicillin (Rash), Sulfa Drugs (Hives)
  * Past History: Essential Hypertension (3y), Migraine with aura (5y)
  * Amber Flagged Box: **AI Flagged Concerns** (Headache triggered upon standing; rule out orthostatic hypotension)
* **Center Panel (~42%) — 1080p Video Stage & Live Transcript**:
  * Encrypted WebRTC video stage with Doctor Picture-in-Picture (`Dr. Arjun Mehta, Internal Medicine`)
  * Floating In-Call Media Dock: `🎙 Mute`, `📹 Camera`, `🖥 Share`, `[CC] Captions`, `⋯ More`, `🔴 End`
  * Tabbed lower workspace: `Live Transcript` vs `Clinician Notes`
  * Timestamped dialogue stream (`10:14 AM Louise Reed`, `10:14 AM Dr. Arjun Mehta`)
  * Bottom Message Input with Action Chips:
    `[💡 Quick Prompts]` `[🎓 Patient Education]` `[📄 Share File]` `[🩺 Record Consent]`
* **Right Panel (~30%) — Clinical Decision Support (CDSS)**:
  * Risk Score: **Low-Moderate Risk**
  * Differential Diagnosis Probability Bars:
    1. Orthostatic Hypotension: **45%** (High probability)
    2. Vestibular Migraine: **30%** (Moderate)
    3. Tension Headache: **15%** (Low)
    4. Benign Paroxysmal Positional Vertigo (BPPV): **7%**
    5. Other: **3%**
  * Recommended Next Steps Interactive Checklist:
    - [x] Check orthostatic vitals (lying vs standing BP) `[Add to Plan]`
    - [x] Review current antihypertensive dosing `[Add to Plan]`
    - [ ] Order CBC and Comprehensive Metabolic Panel `[Add to Plan]`
    - [ ] Provide hydration & slow postural change guidance `[Add to Plan]`
  * Red Flag Alerts Card: Sudden focal weakness, syncope, speech slurring
  * Relevant Guidelines: *AHA/ACC 2024 Hypertension Guidelines*, *IHS Headache (ICHD-3)*
* **Bottom Clinical Action Bar**:
  * Navigation: `← Back to Patients`
  * EMR Actions: `📄 Generate SOAP Note`, `🗄 Add to EMR`, `📤 Share with Patient`
  * Purple Natural Language AI Omnibar: `✨ Ask DrGodly AI (e.g. 'What is the recommended titration for Amlodipine?')`

---

### Screen 4: Post-Visit SOAP Documentation & Digital e-Prescribing (`post-visit`)
* **Ambiently Synthesized SOAP Note** (Gemini 2.5 Pro):
  * **S (Subjective)**: Comprehensive symptom story, pain characteristics, and duration.
  * **O (Objective)**: Correlated vitals and ECG findings.
  * **A (Assessment)**: ICD-10 coded clinical impressions (`I10 Essential Hypertension`, `G43.909 Migraine`).
  * **P (Plan)**: Medication titrations, lifestyle guidance, and follow-up appointment.
* **Digital Signature & Tamper-Evident QR Card**:
  * Doctor's verified NMC Registration Certificate, cryptographic hash, and scan-to-verify 2D QR Code.

---

### Screen 5: Patient Wellness Portal (`patient-dashboard`)
* **Health Score Gauge**: Animated circular SVG gauge (**88/100**, "Optimal Condition").
* **Vitals Snapshot Grid**: Blood pressure 7-day trend graph, resting heart rate, daily steps, blood glucose.
* **Daily Care Plan Checklist**: Morning meds taken, blood pressure logged, 2L hydration tracker.
* **"Ask DrGodly AI" Chat Widget**: Context-aware clinical chat for post-visit instructions.

---

### Screen 6: AI Clinical Intake Studio (`AiIntakeStudio.tsx`)
* **Interactive Anatomical Body Map**: 6 clickable anatomical regions (Head & Neck, Chest & Heart, Abdomen & Digestive, Spine & Back, Limbs & Joints, General/Systemic) that dynamically filter symptoms.
* **Visual Analog Scale (VAS 1–10) Slider**: Expressive emoji anchors (😊 Mild to 😭 Unbearable).
* **Pain Quality Characterization**: Throbbing, Sharp, Dull, Burning, Cramping, Tightness.
* **Onset Chronology**: Acute (<24h), Recent (2-3d), Subacute (1-2w), Chronic (>1mo).
* **Autonomous Red-Flag Emergency Triage**: Real-time safety detector that triggers emergency caution banners with **108 / 112 emergency advice** upon detecting high-risk symptoms.
* **FastMCP OCR Scanner**: Live extraction of biomarkers from uploaded diagnostic slips (`ecg_report_24oct.pdf` $\to$ Normal Sinus Rhythm 78 bpm, PR 142ms, QRS 88ms, BP 148/92 mmHg).
* **Multilingual Speech-to-Text Voice Dictation**: Voice recording in Hindi and English with live animated audio visualizer.
* **Pre-Consultation Hand-Off Dossier**: One-click transfer of intake findings directly into **Dr. Arjun Mehta's 3-Panel Consultation Cockpit**.

---

### Screen 7: Generic E-Pharmacy & Prescription Fulfillment (`GenericPharmacyCheckout.tsx`)
* **Auto-Linked e-Prescription**: Automatically populates prescribed medications from DrGodly consults.
* **Jan Aushadhi Generic Equivalence Engine**:
  * Compares prescribed branded medicines against verified generic bio-equivalents:
    * *Norvasc (Amlodipine 5mg)*: Branded MRP ₹120 $\to$ Generic ₹28 (**Save 76%**)
    * *Telma (Telmisartan 40mg)*: Branded MRP ₹185 $\to$ Generic ₹42 (**Save 77%**)
    * *Dolo (Paracetamol 650mg)*: Branded MRP ₹34 $\to$ Generic ₹14 (**Save 58%**)
  * Total Savings Widget: Total Branded MRP ₹1,128 $\to$ Generic Price ₹549 (**Instant Savings: ₹579 / 51% Off**).
* **Clinician Recommended Wellness Supplements**: Curated supplements for hypertension and dizziness (Vitamin D3, Omega-3 Fish Oil, Magnesium Glycinate, Electrolyte packs).
* **Doorstep Express Delivery & Checkout**: Within 4-hour express delivery, ABHA profile address sync, UPI/Card/COD options, and instant order tracking.

---

### Screen 8: Specialist Marketplace & Doctor Discovery (`DoctorSearchMarketplace.tsx`)
* **Step 3 Modular Architecture**: Fully assembled using decoupled, reusable components.
* **Sticky Filter Sidebar (`DoctorFilterSidebar.tsx`)**:
  * Medical specialty multi-select checkboxes (Cardiology, Neurology, Pediatrics, Orthopedics, etc.).
  * Consultation mode toggle (`All Modes`, `Video`, `In-Clinic`).
  * Dynamic budget slider: ₹300 to ₹3,000 per consult with live amount display.
  * Experience tier buttons (`Any`, `5+ yrs`, `10+ yrs`, `15+ yrs`).
  * Instant toggle: `Available Today Only`.
  * One-click filter reset with match counter badge.
* **Doctor Profile Result Cards (`DoctorSearchResultCard.tsx`)**:
  * Doctor name, verified degrees, specialty, and sub-specialty.
  * NMC/MCI registration verification badge, top-rated badge, and ABDM linked badge.
  * Consultation fee and experience pill.
  * Embedded **Interactive Slot Selector (`ConsultationSlotPicker.tsx`)** allowing immediate reservation of Morning, Afternoon, or Evening slots.
  * Jan Aushadhi generic prescribing endorsement tag.
  * Primary CTA: *"Book Video Consult"* with slot confirmation toast.
* **Accessible Pagination (`DoctorSearchPagination.tsx`)**:
  * Results tally (`Showing 1–4 of 48 verified specialists`).
  * Numbered page navigation and rows-per-page dropdown.

---

## 🎨 4. Global Design System Tokens & Geometric Spacing

### 4.1 Clinical Color Tokens
```css
:root {
  --brand-blue: #2563EB;       /* Primary CTA, Logo gradient, Active Tabs */
  --brand-navy: #10195C;       /* Main Brand Headers, Login Titles */
  --medical-teal: #0D9488;     /* Vitals, Health Score, Safe Badges */
  --ai-purple: #7C3AED;        /* AI Assistant button, DrGodly AI omnibar */
  --canvas-bg: #F8FAFC;        /* Clinical Workstation Canvas */
  --card-surface: #FFFFFF;     /* Pure White Card Surface */
  --card-border: #E2E8F0;      /* Hairline Boundary (border-slate-200) */
  --text-primary: #0F172A;     /* Primary High-Contrast Text */
  --text-secondary: #475569;   /* Secondary Subtitles and Demographics */
  --text-muted: #94A3B8;       /* Subtle Placeholders and Timestamps */
  --status-emerald: #059669;   /* Normal Vitals, Verified Pills, Timer */
  --status-amber: #D97706;     /* AI Flagged Concerns, Triage Cautions */
  --status-rose: #DC2626;      /* End Visit button, Red Flag Emergency Alerts */
}
```

### 4.2 4px/8px Geometric Spacing System
All paddings, margins, and gaps strictly follow an 8px grid (with 4px micro-steps):
* Micro steps: `p-1` (4px), `p-2` (8px), `p-3` (12px), `p-4` (16px), `p-6` (24px), `p-8` (32px)
* Panel Density: `gap-3` (12px) or `gap-4` (16px) for high-density clinical workstations
* Border Radii:
  * Panels: `rounded-2xl` (16px)
  * Cards: `rounded-xl` (12px)
  * Badges & Chips: `rounded-full` (9999px)

---

## 🧪 5. Testing & Verification

Run these verification commands inside `frontend/`:

```bash
# 1. Typecheck all TypeScript code
npm run typecheck

# 2. Run ESLint code quality checks
npm run lint

# 3. Build production bundle to verify tree-shaking
npm run build
```

---

## 📜 6. Compliance & Governance

* **HL7® FHIR® R4**: All schemas match the official FHIR R4 standard (`Patient`, `Practitioner`, `Encounter`, `Observation`, `Condition`, `MedicationRequest`, `DiagnosticReport`, `Consent`).
* **ABDM M1/M2/M3**: Full compatibility with the Ayushman Bharat Digital Mission for ABHA number generation, health record generation, and consent-based health data exchange.
* **Zero External Dependencies**: All components and types are self-contained and independently testable without third-party external repositories.
