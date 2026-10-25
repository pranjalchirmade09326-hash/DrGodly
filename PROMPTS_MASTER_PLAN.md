# DrGodly AI-Native Telemedicine Platform: 60 Master Prompts for Coding Agents
## Complete Full-Stack Implementation & Integration Plan (Frontend + Backend)

> **Monorepo Structure Reference:**
> - **Frontend**: `d:/DrGodly New/frontend` (Next.js 16 App Router, React 19, Tailwind CSS v4, Lucide Icons, Framer Motion, TanStack Query, `@evyweb/ioctopus` DI, ZSA Server Actions, LiveKit WebRTC). Built and executed strictly using `npm` (`npm run dev`, `npm run build`, `npm run db:generate`).
> - **Backend Services**: `d:/DrGodly New/backend`
>   - `fhir-server`: FastAPI FHIR R4 REST API (Port `8000`), PostgreSQL 15, Redis 7, asyncpg, SQLAlchemy 2.0.
>   - `fhir-mcp`: FastMCP Streamable-HTTP Gateway (Port `8002`, endpoint `/mcp`), dynamic tool generation from OpenAPI.
>   - `fhir-gql`: FastAPI Orchestration Gateway & RBAC Proxy (Port `8005`), JWT JWKS validation, REST proxying to `fhir-server`.
> - **Design System & UI Grounding Source**: `c:/Users/Pranjal/Downloads/drive-download-20261025T080725Z-1-001/`
>   - `Doctor Dashboard.png`, `Patient Dashboard.png`, `DrGodly Telemedicine Dashboard 1.png`, `DrGodly Telemedicine Care Dashboard 1.png`, `Post-Visit Documentation.png`, `DrGodly Appointment Dashboard.png`, `Sign In Screen 1.png` - `Sign In Screen 6.png`.

---

## Table of Contents

- [Phase 1: Environment, Monorepo Architecture & Backend-to-Frontend Service Mesh (Prompts 1–6)](#phase-1-environment-monorepo-architecture--backend-to-frontend-service-mesh)
- [Phase 2: Authentication, ABHA Identity & Role-Based Access Control (Prompts 7–12)](#phase-2-authentication-abha-identity--role-based-access-control)
- [Phase 3: Doctor Clinical Practice Dashboard (Prompts 13–18)](#phase-3-doctor-clinical-practice-dashboard)
- [Phase 4: Patient Health Portal & Wellness Dashboard (Prompts 19–24)](#phase-4-patient-health-portal--wellness-dashboard)
- [Phase 5: Grounded Multi-Modal AI Health Intake & Pre-Consultation Synthesis (Prompts 25–30)](#phase-5-grounded-multi-modal-ai-health-intake--pre-consultation-synthesis)
- [Phase 6: Live Telemedicine Consultation Room & WebRTC Video Engine (Prompts 31–36)](#phase-6-live-telemedicine-consultation-room--webrtc-video-engine)
- [Phase 7: Real-Time AI Clinical Decision Support (CDS) Engine (Prompts 37–42)](#phase-7-real-time-ai-clinical-decision-support-cds-engine)
- [Phase 8: Automated SOAP Note Generation & Clinical Documentation (Prompts 43–48)](#phase-8-automated-soap-note-generation--clinical-documentation)
- [Phase 9: e-Prescriptions, Diagnostic Orders & Pharmacy Fulfillment (Prompts 49–54)](#phase-9-e-prescriptions-diagnostic-orders--pharmacy-fulfillment)
- [Phase 10: EMR Intelligence Chatbot, Semantic Search & Enterprise Operations (Prompts 55–60)](#phase-10-emr-intelligence-chatbot-semantic-search--enterprise-operations)

---

## Phase 1: Environment, Monorepo Architecture & Backend-to-Frontend Service Mesh

### Prompt 1: Monorepo Orchestration & Unified Local Dev Environment
**Context & Goal**: Establish a rock-solid, single-command development environment that boots the entire DrGodly service mesh without port conflicts or unhandled environment variables.
**Files to Modify/Create**:
- `backend/docker-compose.yml`
- `backend/.env.example`
- `frontend/.env.local`
- `package.json` (root orchestration script)
**Requirements**:
1. Configure `backend/docker-compose.yml` to provision:
   - PostgreSQL 15 on port `5432` (database: `drgodly`, user: `drgodly`, password: `password`).
   - Redis 7 on port `6379`.
2. Configure `backend/fhir-server` to run on port `8000` via `uv run fastapi dev app/main.py`.
3. Configure `backend/fhir-mcp` on port `8002` connecting to `http://localhost:8000/openapi.json`.
4. Configure `backend/fhir-gql` on port `8005` proxying to `http://localhost:8000`.
5. Update `frontend/.env.local` with:
   - `NEXT_PUBLIC_APP_URL=http://localhost:4000`
   - `FHIR_SERVER_URL=http://localhost:8000`
   - `FHIR_GQL_URL=http://localhost:8005/api/v1`
   - `NEXT_PUBLIC_LIVEKIT_URL=wss://livekit.drgodly.local`
6. Add root npm scripts in root `package.json`:
   - `"dev:backend"`: starts docker containers and python services.
   - `"dev:frontend"`: runs `cd frontend && npm run dev`.
**Verification**: Run `npm run dev` in frontend, verify it launches on port 4000, and execute `curl http://localhost:8000/health` returning `{"status":"ok"}`.

---

### Prompt 2: Database Migrations & ABDM/FHIR R4 Synthetic Seeding
**Context & Goal**: Ensure all PostgreSQL tables and FHIR R4 schema entities exist in `fhir-server`, and seed rich clinical demo data matching the UI screenshots (`Dr. Priya Sharma`, `Anjali Menon`, `Rahul Verma`).
**Files to Modify/Create**:
- `backend/fhir-server/app/models/`
- `backend/fhir-server/migrations/versions/`
- `backend/fhir-server/scripts/seed_demo_data.py`
**Requirements**:
1. Run Alembic migrations to create tables for: `patients`, `practitioners`, `practitioner_roles`, `encounters`, `appointments`, `observations`, `conditions`, `medication_requests`, `diagnostic_reports`, `questionnaire_responses`.
2. In `seed_demo_data.py`, seed:
   - Practitioner: `Dr. Priya Sharma`, MD, Cardiology/Internal Medicine, Registration `#MCI-2018-98421`, Organization: `Apollo Health / DrGodly Clinic`.
   - Patient 1: `Anjali Menon`, 42 Female, ABHA ID: `91-4821-9032-1104`, Hypertension, Type 2 Diabetes, recent HbA1c: 6.8%, BP: 128/82 mmHg.
   - Patient 2: `Rahul Verma`, 35 Male, Acute Bronchitis, Pending AI Intake.
   - Appointments: 4 appointments for today with varied statuses (`booked`, `arrived`, `in-progress`, `fulfilled`).
**Verification**: Run `cd backend/fhir-server && uv run python scripts/seed_demo_data.py`. Verify `curl http://localhost:8000/api/fhir/v1/patient` returns the seeded patients.

---

### Prompt 3: Frontend Dual-Transport Gateway Configuration (REST & GraphQL)
**Context & Goal**: Solidify the frontend's communication bridge to the backend via `FHIR_GQL_URL` and `FHIR_SERVER_URL`, supporting configurable transport modes (`rest` vs `graphql`).
**Files to Modify/Create**:
- `frontend/src/config/env.ts`
- `frontend/src/modules/server/core/shared/infrastructure/http/httpClient.ts`
- `frontend/src/modules/server/presentation/transport/runWithTransport.ts`
**Requirements**:
1. Validate environment variables using Zod in `frontend/src/config/env.ts` (`FHIR_GQL_URL`, `FHIR_SERVER_URL`, `DATABASE_URL`).
2. Create an Axios/Fetch HTTP client singleton in `httpClient.ts` with:
   - Auto-injected Bearer JWT from current session (`getServerSession`).
   - Request timeout (10s), exponential backoff retry for network blips.
   - Correct headers: `Accept: application/fhir+json` or `application/json`.
3. Support seamless fallback if `FHIR_GQL_URL` (8005) is unavailable to route directly to `FHIR_SERVER_URL` (8000).
**Verification**: Execute a server action test script using `npm run dev` to verify `runWithTransport` successfully executes a probe call to `/health`.

---

### Prompt 4: Clean Architecture DI Container & Typed Service Wiring
**Context & Goal**: Wire the dependency injection container using `@evyweb/ioctopus` so all 17 FHIR domain repositories seamlessly resolve across both server actions and API route handlers.
**Files to Modify/Create**:
- `frontend/src/modules/server/di/container.ts`
- `frontend/src/modules/server/di/types.ts`
- `frontend/src/modules/server/di/modules/index.ts`
**Requirements**:
1. Register service interfaces for: `IPatientService`, `IPractitionerService`, `IAppointmentService`, `IEncounterService`, `IConditionService`, `IObservationService`, `IMedicationRequestService`, `IIntakeService`, `IConsultationService`.
2. Bind concrete REST implementations (`AppointmentRestApiService`, `PatientRestApiService`, etc.) in `container.ts` using IoC symbols.
3. Ensure all DI bindings support request-scoped execution and mock overrides for unit/integration tests.
**Verification**: Write an integration test or run `npx tsx scripts/test-di.ts` to confirm container resolves `IPatientService` without throwing undefined symbol errors.

---

### Prompt 5: Zod Schema Synchronization with FHIR R4 Pydantic Models
**Context & Goal**: Enforce strict bidirectional type contracts between backend Pydantic schemas and frontend Zod schemas for all clinical data structures.
**Files to Modify/Create**:
- `frontend/src/modules/entities/schemas/patient.ts`
- `frontend/src/modules/entities/schemas/appointment.ts`
- `frontend/src/modules/entities/schemas/observation.ts`
- `frontend/src/modules/entities/schemas/intake.ts`
- `frontend/src/modules/entities/schemas/soap.ts`
**Requirements**:
1. Match backend Pydantic models in `backend/fhir-server/app/schemas/`:
   - `Patient`: id, identifier (ABHA/National ID), name (given, family), gender, birth_date, telecom, address.
   - `Appointment`: id, status (`booked`, `arrived`, `fulfilled`, `cancelled`), start, end, participant (patient ref, practitioner ref), reason_code, intake_id.
   - `Observation`: code (LOINC), subject, value_quantity, effective_date_time, status.
   - `SoapNote`: subjective (chief_complaint, hpi), objective (vitals, exams), assessment (diagnoses with ICD-10), plan (medications, labs, instructions).
2. Export TypeScript types inferred via `z.infer<typeof Schema>` for all models.
**Verification**: Run `npm run build` or `npx tsc --noEmit` to verify type agreement across entities and server actions.

---

### Prompt 6: Unified FHIR OperationOutcome Error Parser & Global Feedback
**Context & Goal**: Implement enterprise-grade clinical error translation so backend FHIR `OperationOutcome` responses are transformed into user-friendly UI banners and toasts.
**Files to Modify/Create**:
- `frontend/src/modules/server/shared/errors/handleFhirApiError.ts`
- `frontend/src/components/ui/error-boundary.tsx`
- `frontend/src/components/ui/clinical-alert.tsx`
**Requirements**:
1. Inspect Axios and Fetch errors for FHIR `OperationOutcome` payload structure:
   - Extract `issue[0].diagnostics` or `issue[0].details.text`.
   - Map severity levels (`fatal`, `error`, `warning`, `information`) to UI toast variants.
2. Provide fallback messages for standard HTTP status codes: 401 (Session expired), 403 (Insufficient clinical permissions), 404 (FHIR Resource not found), 422 (Clinical validation failed).
3. Export `parseFhirError(error: unknown): { title: string; message: string; severity: 'error' | 'warning' }`.
**Verification**: Trigger a synthetic 422 error from `handleFhirApiError` and verify the parsed outcome outputs cleanly to the console and toast provider.

---

## Phase 2: Authentication, ABHA Identity & Role-Based Access Control

### Prompt 7: BetterAuth & FastAPI JWT Session Handshake
**Context & Goal**: Establish secure, shared token validation between the Next.js frontend session and the FastAPI `fhir-server` and `fhir-gql` backends via JWKS.
**Files to Modify/Create**:
- `frontend/src/modules/server/auth/get-session.ts`
- `frontend/src/modules/server/auth/jwt-token.ts`
- `backend/fhir-server/app/auth/decode_token.py`
- `backend/fhir-gql/app/auth/decode_token.py`
**Requirements**:
1. In `frontend/src/modules/server/auth/jwt-token.ts`, retrieve the active session JWT from cookies or BetterAuth server session.
2. In `backend/fhir-server/app/auth/decode_token.py`, fetch the JWKS public key from `BETTER_AUTH_JWKS_URL` and cache it in Redis.
3. Validate claims: `sub` (User ID), `role` (`doctor`, `patient`, `admin`), `org_id`, and `exp`.
4. Inject the decoded user context into FastAPI `request.state.user`.
**Verification**: Send an authenticated request `curl -H "Authorization: Bearer <token>" http://localhost:8000/api/fhir/v1/practitioner/me` and receive 200 OK with practitioner details.

---

### Prompt 8: Multi-Role Sign-In & Onboarding UI
**Context & Goal**: Build the polished, clinical login and role onboarding flow strictly matching `Sign In Screen 1.png` through `Sign In Screen 6.png`.
**Files to Modify/Create**:
- `frontend/src/app/[locale]/(auth)/login/page.tsx`
- `frontend/src/modules/client/auth/components/LoginForm.tsx`
- `frontend/src/modules/client/auth/components/RoleSelector.tsx`
- `frontend/src/modules/client/auth/components/BrandMarketingPanel.tsx`
**Requirements**:
1. Two-column split layout on desktop:
   - Left side: High-resolution DrGodly clinical branding panel with illustration, badge "AI-NATIVE TELEMEDICINE", headline "Better Care. For A Healthier You.", and feature bullet points.
   - Right side: Clean, minimalist white card with DrGodly logo, tab selector (`Doctor / Clinician` vs `Patient`), Email & Password inputs, "Remember me", and "Sign In" button.
2. Role switcher tab that adjusts inputs:
   - Doctor: Email/Password + Hospital/Clinic ID.
   - Patient: Mobile / ABHA Number + OTP or Password.
3. Framer Motion smooth fade and tab transition animations.
4. Support keyboard navigation (Tab, Enter) and full accessibility standards.
**Verification**: Visit `http://localhost:4000/en/login`, toggle between Doctor and Patient tabs, submit valid credentials, and verify redirection to the appropriate dashboard.

---

### Prompt 9: ABHA (Ayushman Bharat Digital Mission) Health ID & OTP Service
**Context & Goal**: Implement India's national digital health identity (ABHA) registration and verification workflow for patients.
**Files to Modify/Create**:
- `frontend/src/app/api/auth/abha/generate-otp/route.ts`
- `frontend/src/app/api/auth/abha/verify-otp/route.ts`
- `frontend/src/modules/client/auth/components/AbhaOtpModal.tsx`
- `backend/fhir-server/app/services/abha_service.py`
**Requirements**:
1. Route `POST /api/auth/abha/generate-otp`: accepts 14-digit ABHA ID or Aadhaar number, calls backend ABDM sandbox API.
2. Route `POST /api/auth/abha/verify-otp`: verifies 6-digit OTP, returns verified demographic data (Name, DOB, Gender, Address, ABHA Address).
3. If verified, link the ABHA identifier to the FHIR `Patient` resource under `identifier: [{ system: "https://healthid.ndhm.gov.in", value: abhaId }]`.
4. Render an interactive 6-cell numeric OTP input component with 60-second resend countdown timer.
**Verification**: Test OTP flow with sandbox ABHA `91-4821-9032-1104` and OTP `123456`, verifying the patient's FHIR record updates with verified ABHA status.

---

### Prompt 10: Practitioner Profile Onboarding & Specialty Verification
**Context & Goal**: Create the doctor credentialing and profile setup screen (`Practitioner` & `PractitionerRole`).
**Files to Modify/Create**:
- `frontend/src/app/[locale]/(apps)/bezs/telemedicine/doctor/settings/profile/page.tsx`
- `frontend/src/modules/client/telemedicine/doctor/component/profile/DoctorProfileForm.tsx`
- `frontend/src/modules/server/presentation/actions/practitioner/core.actions.ts`
**Requirements**:
1. Form fields: Full Name, Medical Registration Number (NMC/State Council), Primary Specialty (Dropdown: Cardiology, General Medicine, Pediatrics, etc.), Qualifications (MBBS, MD), Consultation Fees, Bio.
2. Weekly Availability Schedule selector: Monday through Sunday, Morning / Evening slots, duration (15 min, 30 min).
3. On submission, execute `updatePractitionerAction` and create/update `PractitionerRole` and `Schedule` in `fhir-server`.
4. Display a "Verified Doctor" badge when registration number passes council format check.
**Verification**: Submit doctor profile update via UI, check `http://localhost:8000/api/fhir/v1/practitioner/<id>` to verify updated specialties and availability.

---

### Prompt 11: Patient Demographic & Emergency Contact Onboarding
**Context & Goal**: Build the patient personal details and clinical baseline onboarding page.
**Files to Modify/Create**:
- `frontend/src/app/[locale]/(apps)/bezs/telemedicine/patient/profile/page.tsx`
- `frontend/src/modules/client/telemedicine/patient/components/PatientProfileForm.tsx`
- `frontend/src/modules/server/presentation/actions/patient/core.actions.ts`
**Requirements**:
1. Profile fields: First Name, Last Name, Blood Group (A+, B+, O+, AB+, etc.), Date of Birth, Gender, Primary Phone, Emergency Contact (Name, Relation, Phone).
2. Known Allergies tag-input component (Penicillin, Sulfa drugs, Peanuts, Latex, etc.).
3. Chronic Conditions multi-select (Hypertension, Diabetes, Asthma, Thyroid, None).
4. Persist data into FHIR `Patient` resource with active allergy entries stored in `Condition` or `AllergyIntolerance`.
**Verification**: Update patient profile, verify values persist upon page refresh and query `fhir-server` for updated `Patient` resource.

---

### Prompt 12: Role-Guarded Navigation Layout & Route Middleware
**Context & Goal**: Construct the unified layout header and role-based route guard that routes doctors to `/doctor/dashboard` and patients to `/patient`.
**Files to Modify/Create**:
- `frontend/src/middleware.ts`
- `frontend/src/modules/client/shared/components/NavigationHeader.tsx`
- `frontend/src/modules/server/shared/auth/require-role.ts`
**Requirements**:
1. Next.js middleware checks path prefix:
   - `/doctor/*` requires session role `doctor` or `admin`. If patient attempts access, redirect to `/unauthorized` or `/patient`.
   - `/patient/*` requires session role `patient`.
2. Header component:
   - DrGodly Logo (pill icon with medical cross).
   - Global Search input (⌘K).
   - Notifications bell with unread badge count.
   - User profile dropdown showing avatar, doctor/patient name, role badge, and "Sign Out" button.
**Verification**: Test navigating as patient to `/doctor/dashboard` and verify clean redirection; verify header renders doctor name when logged in as clinician.

---

## Phase 3: Doctor Clinical Practice Dashboard

### Prompt 13: Doctor Dashboard Header & ⌘K Command Palette
**Context & Goal**: Construct the top navigation, practitioner welcome greeting, and global ⌘K quick-search palette strictly matching `Doctor Dashboard.png`.
**Files to Modify/Create**:
- `frontend/src/app/[locale]/(apps)/bezs/telemedicine/doctor/dashboard/page.tsx`
- `frontend/src/modules/client/telemedicine/doctor/component/dashboard-overview/DashboardHeader.tsx`
- `frontend/src/components/ui/command-palette.tsx`
**Requirements**:
1. Layout header:
   - Left: Greeting "Welcome back, Dr. Priya Sharma" with subtitle "Here is your practice overview and patient queue for today."
   - Right: Date display ("Thursday, 25 October 2026"), "New Consultation" primary action button (teal gradient), and quick filter dropdown.
2. ⌘K Command Palette modal:
   - Pressing ⌘K or Ctrl+K opens quick-action search.
   - Debounced live search across: Patients (name, ABHA ID), Appointments (time, patient), Clinical Records (ICD-10 code, diagnosis).
   - Quick jump items: "Start Telemedicine Visit", "Create New Patient", "Search EMR Records", "Review Draft SOAP Notes".
**Verification**: Press `Ctrl+K` on doctor dashboard, type "Anjali", verify patient search result appears and clicking navigates to the clinical record.

---

### Prompt 14: Doctor Dashboard 4 KPI Metric Cards
**Context & Goal**: Build the 4 key operational KPI metric cards with live calculation from backend FHIR data matching `Doctor Dashboard.png`.
**Files to Modify/Create**:
- `frontend/src/modules/client/telemedicine/doctor/component/dashboard-overview/MetricCards.tsx`
- `frontend/src/modules/server/presentation/actions/appointment/dashboardMetrics.ts`
**Requirements**:
1. Card 1: **Appointments Today**
   - Value: Count of appointments where `start` is today.
   - Subtitle: "+2 from yesterday" (or delta vs yesterday).
   - Icon: Calendar with clock (teal theme).
2. Card 2: **Total Patients**
   - Value: Distinct patient count associated with this practitioner.
   - Subtitle: "Active under care".
   - Icon: Users icon (blue theme).
3. Card 3: **AI Intake Reports**
   - Value: Count of completed AI Intakes ready for review.
   - Subtitle: "3 need review before consult".
   - Icon: Sparkles / FileText icon (amber/purple theme).
4. Card 4: **Draft SOAP Notes**
   - Value: Count of unfinalized clinical consultation encounters.
   - Subtitle: "Awaiting signature".
   - Icon: ClipboardEdit icon (emerald theme).
5. Hover animation with subtle elevation shadow and clean border styling.
**Verification**: Verify all 4 cards render correct values calculated from seeded appointment and intake records.

---

### Prompt 15: Today's Clinical Appointment Queue & Triage Table
**Context & Goal**: Implement the interactive "Today's Appointments" queue table with live status badges matching `Doctor Dashboard.png`.
**Files to Modify/Create**:
- `frontend/src/modules/client/telemedicine/doctor/component/dashboard-overview/AppointmentsQueueTable.tsx`
- `frontend/src/modules/client/telemedicine/doctor/component/dashboard-overview/AppointmentStatusBadge.tsx`
**Requirements**:
1. Table columns:
   - **Time & Type**: Slot time (e.g., "10:30 AM"), Video icon or In-Person icon.
   - **Patient Details**: Avatar, Name ("Anjali Menon"), Age/Gender ("42, Female"), Reason for visit ("Hypertension Follow-up").
   - **AI Intake Status**: Badge: `AI Intake Complete` (green pill with checkmark), `In Progress` (yellow pill), or `Not Started` (gray pill).
   - **Triage Priority**: `Routine` (blue), `Urgent` (orange), or `Critical` (red).
   - **Actions**: "Start Consultation" (primary teal button for `arrived` or current time), "View Intake Summary" (ghost button).
2. Filter tabs above table: `All (8)`, `Upcoming (5)`, `In Progress (1)`, `Completed (2)`.
3. Clicking "Start Consultation" triggers router transition to the live telemedicine room for that appointment.
**Verification**: Check table renders all seeded appointments for today with correct badges and clicking "Start Consultation" navigates to the consult URL.

---

### Prompt 16: AI Clinical Assistant CDS Widget with Prompt Chips
**Context & Goal**: Build the "AI Clinical Assistant" sidebar card with interactive prompt chips matching `Doctor Dashboard.png`.
**Files to Modify/Create**:
- `frontend/src/modules/client/telemedicine/doctor/component/dashboard-overview/AiClinicalAssistantWidget.tsx`
- `frontend/src/app/api/suggestion/route.ts`
**Requirements**:
1. Card header: "AI Clinical Assistant" with glowing sparkle icon and "Gemini 2.5 Pro Grounded" pill tag.
2. Suggested quick-prompt chips:
   - *"Summarize intake for next patient (Anjali Menon)"*
   - *"Check drug interactions: Metformin + Lisinopril"*
   - *"Highlight critical lab values from yesterday"*
   - *"Draft follow-up template for hypertensive review"*
3. Clicking any chip opens a mini chat drawer or executes an instant API call to `/api/suggestion`, rendering the AI's clinical answer in-line with citations.
4. Input bar at bottom: "Ask DrGodly anything about your patients or schedule..." with send icon.
**Verification**: Click "Summarize intake for next patient", verify loading skeleton appears and clinical summary response renders with citation pills.

---

### Prompt 17: Clinical Tasks, Critical Alerts & Action Center
**Context & Goal**: Build the "Tasks & Alerts" module for lab result alerts, pending prescription approvals, and signature requests.
**Files to Modify/Create**:
- `frontend/src/modules/client/telemedicine/doctor/component/dashboard-overview/TasksAndAlertsCard.tsx`
- `frontend/src/modules/server/presentation/actions/diagnostic-report/alerts.actions.ts`
**Requirements**:
1. Tabbed or categorized alert list:
   - **Critical Labs**: E.g., *"Anjali Menon: Serum Potassium 5.8 mEq/L (High) - Reported 2h ago"*. Red warning badge.
   - **Pending e-Signatures**: E.g., *"3 SOAP notes from yesterday await your signature"*. Amber clock badge.
   - **Refill Requests**: E.g., *"Rahul Verma requested Telmisartan 40mg refill"*. Blue pill badge.
2. One-click inline action buttons: `Review Lab`, `Sign Note`, `Approve Refill`.
3. Dismiss and snooze capabilities with optimistic UI update.
**Verification**: Verify alerts render from mock or seeded diagnostic reports and clicking `Review Lab` opens the diagnostic report modal.

---

### Prompt 18: 30-Day Practice Analytics & Patient Volume Trend Charts
**Context & Goal**: Implement the interactive graphical analytics panel showing consult volume trends and diagnosis distributions.
**Files to Modify/Create**:
- `frontend/src/modules/client/telemedicine/doctor/component/dashboard-overview/PracticeAnalyticsChart.tsx`
- `frontend/src/modules/server/presentation/actions/appointment/analytics.actions.ts`
**Requirements**:
1. Line / Area Chart:
   - X-axis: Days of the month (1 - 30).
   - Y-axis: Number of completed consultations.
   - Gradient fill: Teal-to-transparent with smooth curve interpolation.
   - Tooltip: Shows date, Total Consults, Telemedicine vs In-Person split.
2. Donut / Progress breakdown: Top 5 Primary Diagnoses (e.g., Essential Hypertension 34%, Type 2 Diabetes 26%, Acute Upper Respiratory 18%, Dyslipidemia 12%, Other 10%).
3. Time range selector: `Last 7 Days`, `Last 30 Days`, `This Quarter`.
**Verification**: Toggle between 7 days and 30 days, verify smooth SVG animation and accurate re-render of chart metrics.

---

## Phase 4: Patient Health Portal & Wellness Dashboard

### Prompt 19: Patient Portal Header & Health Score Gauge
**Context & Goal**: Build the patient home dashboard header and circular health index gauge strictly matching `Patient Dashboard.png`.
**Files to Modify/Create**:
- `frontend/src/app/[locale]/(apps)/bezs/telemedicine/patient/page.tsx`
- `frontend/src/modules/client/telemedicine/patient/components/dashboard/PatientHeader.tsx`
- `frontend/src/modules/client/telemedicine/patient/components/dashboard/HealthScoreGauge.tsx`
**Requirements**:
1. Header greeting:
   - "Hello, Anjali Menon 👋"
   - Metadata badge: "Age: 42 | Gender: Female | ABHA ID: 91-4821-9032-1104" (verified checkmark icon).
   - Primary action button: "Book New Consultation" (gradient teal).
2. Health Score Circular Gauge:
   - Score value: `78 / 100` with status label "Good Condition".
   - Animated SVG circular progress ring (emerald green gradient).
   - Explanatory breakdown popover: "+5 for blood pressure adherence, -3 for missed glucose log".
**Verification**: Load `/patient` as logged-in patient Anjali, verify header metadata and SVG animated gauge render smoothly.

---

### Prompt 20: Patient Dashboard 4 KPI Status Cards
**Context & Goal**: Implement the 4 patient KPI status cards matching `Patient Dashboard.png`.
**Files to Modify/Create**:
- `frontend/src/modules/client/telemedicine/patient/components/dashboard/PatientMetricCards.tsx`
**Requirements**:
1. Card 1: **Next Appointment**
   - Title: "Today, 10:30 AM"
   - Details: "Dr. Priya Sharma (Cardiology)"
   - Badge: "Video Consult" with camera icon.
2. Card 2: **AI Intake Status**
   - Status: "Completed" (green badge with checkmark) or "Needs Completion" (amber pulse).
   - Subtitle: "Submitted 15 mins ago".
3. Card 3: **Care Plan Goals**
   - Metric: "4 of 6 Completed (67%)"
   - Subtitle: "Daily walks & hydration on track".
4. Card 4: **Medications Due**
   - Metric: "2 Doses Remaining Today"
   - Subtitle: "Next: Metformin 500mg at 8:00 PM".
**Verification**: Check that cards accurately reflect the patient's next appointment and current intake status.

---

### Prompt 21: Upcoming Consultations & 1-Click Telemedicine Launcher
**Context & Goal**: Build the upcoming appointments card with a prominent "Join Video Visit" button matching `Patient Dashboard.png`.
**Files to Modify/Create**:
- `frontend/src/modules/client/telemedicine/patient/components/dashboard/UpcomingAppointmentsCard.tsx`
- `frontend/src/modules/client/telemedicine/patient/components/dashboard/JoinConsultationButton.tsx`
**Requirements**:
1. Card displaying doctor avatar, name, specialty, clinic name, date, time, and appointment ID.
2. "Join Video Visit" primary button:
   - Active & pulsating teal if within 15 minutes of appointment start time.
   - Disabled with tooltip "Available 15 minutes prior to appointment" if scheduled in the future.
3. Secondary button: "Reschedule or Cancel".
4. "Pre-Visit AI Intake" banner: If intake is not completed, display a high-priority prompt "Complete 3-min AI Health Intake to help Dr. Priya prepare for your visit".
**Verification**: Click "Join Video Visit", verify it routes directly to `/patient/appointments/online-consultation?appointmentId=<id>`.

---

### Prompt 22: "My Health Snapshot" Vitals Dashboard & Wearable Sync
**Context & Goal**: Construct the vitals monitoring grid (BP, HbA1c, Heart Rate, SpO2, Steps) matching `Patient Dashboard.png`.
**Files to Modify/Create**:
- `frontend/src/modules/client/telemedicine/patient/components/dashboard/HealthSnapshotGrid.tsx`
- `frontend/src/modules/client/telemedicine/patient/components/dashboard/VitalCard.tsx`
- `frontend/src/modules/server/presentation/actions/vitals/core.actions.ts`
**Requirements**:
1. Vital Card 1: **Blood Pressure** - `128/82 mmHg`, status: "Normal", trend arrow.
2. Vital Card 2: **HbA1c** - `6.8%`, status: "Pre-Diabetic Target", recorded: "Yesterday".
3. Vital Card 3: **Body Weight** - `68.2 kg`, status: "-0.8 kg this month".
4. Vital Card 4: **Daily Steps** - `4,320 / 8,000 steps`, progress bar.
5. "Log Vital" button that opens a modal allowing manual entry of systolic/diastolic, glucose, or weight, persisting to FHIR `Observation` resource.
**Verification**: Enter a new BP reading via the modal, verify optimistic update on the dashboard and query `fhir-server` for the created `Observation`.

---

### Prompt 23: Interactive Care Plan Checklist & Medication Adherence
**Context & Goal**: Build the daily care plan checklist and interactive medication pill reminder tracker.
**Files to Modify/Create**:
- `frontend/src/modules/client/telemedicine/patient/components/dashboard/CarePlanChecklist.tsx`
- `frontend/src/modules/client/telemedicine/patient/components/dashboard/MedicationTracker.tsx`
**Requirements**:
1. Care Plan Checklist items:
   - [x] "Morning Vitals Check (BP & Heart Rate)"
   - [x] "30-min Low-Impact Walking"
   - [ ] "Limit Sodium Intake (< 2g/day)"
   - [ ] "Log Evening Blood Glucose"
2. Interactive checkbox toggle with sound/haptic confetti animation upon completion.
3. Medication Dose Card:
   - Drug name, strength ("Metformin 500mg"), frequency ("Twice daily with meals").
   - "Take Dose" button that marks the dose taken, recording timestamp in FHIR `MedicationStatement`.
**Verification**: Check off a care plan item, refresh page, verify persistent checked state.

---

### Prompt 24: "Ask DrGodly" Patient AI Health Assistant Chat Widget
**Context & Goal**: Implement the floating patient AI companion chat widget grounded in the patient's past medical history matching `Patient Dashboard.png`.
**Files to Modify/Create**:
- `frontend/src/modules/client/telemedicine/patient/components/dashboard/AskDrGodlyChatWidget.tsx`
- `frontend/src/app/api/patient-ai-chat/route.ts`
**Requirements**:
1. Collapsible floating chat drawer in bottom-right corner with DrGodly AI avatar.
2. Grounded system prompt: Model has read-access to patient's active conditions, medications, and recent lab results.
3. Disclaimer banner: "DrGodly AI provides health insights, not formal medical diagnosis. In emergencies, call 112."
4. Suggested query pills: *"Can I take Ibuprofen with my blood pressure medicine?"*, *"Explain my latest HbA1c result"*, *"What exercises are safe for me?"*.
5. Streaming markdown response with clear clinical language, bullet points, and citations to patient records.
**Verification**: Ask *"Can I take Ibuprofen with Lisinopril?"*, verify streaming response cites patient's existing medication list and warns about renal risk.

---

## Phase 5: Grounded Multi-Modal AI Health Intake & Pre-Consultation Synthesis

### Prompt 25: AI Intake Conversational Stepper & Adaptive Symptom Elicitation
**Context & Goal**: Build the dynamic, conversational pre-consultation intake engine where the AI interviews the patient before the doctor visit.
**Files to Modify/Create**:
- `frontend/src/app/[locale]/(apps)/bezs/telemedicine/patient/ai-intake/page.tsx`
- `frontend/src/modules/client/telemedicine/patient/components/ai-intake/IntakeChatStepper.tsx`
- `frontend/src/app/api/intake-agent/route.ts`
**Requirements**:
1. Multi-step conversational UI:
   - Step 1: Chief Complaint & Onset ("What brings you in today? When did it start?").
   - Step 2: Symptom Severity & Pain Scale (Interactive 1-10 visual slider with descriptive faces).
   - Step 3: Associated Symptoms (Smart multiselect chips: Fever, Nausea, Dizziness, Cough).
   - Step 4: Aggravating & Relieving Factors ("What makes it better or worse?").
2. Voice-to-text option using Web Speech API or microphone button for patients who prefer speaking.
3. Adaptive questioning: If patient mentions chest pain, dynamically inject red flag screening questions (shortness of breath, radiating pain to left arm/jaw).
**Verification**: Walk through the intake chat, verify conversational turns flow naturally and responses save into draft intake state.

---

### Prompt 26: Past Medical Record & Prescription File Upload with OCR Parsing
**Context & Goal**: Implement past medical history document upload with client-side preview, FileNest storage, and automatic OCR extraction.
**Files to Modify/Create**:
- `frontend/src/modules/client/telemedicine/patient/components/ai-intake/MedicalDocumentUploader.tsx`
- `frontend/src/app/api/document-agent/route.ts`
- `frontend/src/lib/filenest.server.ts`
**Requirements**:
1. Drag-and-drop file upload zone supporting PDF, PNG, JPG, and DICOM formats up to 25MB.
2. Upload to FileNest storage endpoint (`POST /api/filenest-token`).
3. Trigger `/api/document-agent`:
   - Extracts text and tabular data using OCR.
   - Categorizes document type: `Prescription`, `Lab Report`, `Discharge Summary`, `Imaging`.
   - Extracts key entities: Medication names, doses, lab parameters, diagnostic impressions.
4. Render interactive extracted preview cards where the patient can confirm or edit detected medications/conditions.
**Verification**: Upload a sample PDF lab report, verify OCR extraction identifies parameters (e.g. Hemoglobin, Platelets) and presents them for confirmation.

---

### Prompt 27: Multimodal Clinical Extraction Pipeline (Gemini API)
**Context & Goal**: Create the backend AI extraction pipeline that processes text, uploaded documents, and vocal input into structured clinical entities.
**Files to Modify/Create**:
- `frontend/src/app/api/clinical-extraction-agent/route.ts`
- `frontend/src/modules/server/core/intake/application/extractClinicalEntities.ts`
**Requirements**:
1. Connect via Google GenAI SDK (`@google/genai` or `gemini-api-dev` skill conventions).
2. Model: `gemini-2.5-flash` with structured JSON schema output:
   ```json
   {
     "chief_complaint": string,
     "history_of_present_illness": string,
     "symptom_duration": string,
     "severity": "mild" | "moderate" | "severe",
     "extracted_vitals": { "systolic"?: number, "diastolic"?: number, "pulse"?: number },
     "medications_mentioned": [{ "name": string, "dosage": string, "frequency": string }],
     "allergies_mentioned": [string],
     "red_flags_detected": [string]
   }
   ```
3. Strict medical hallucination guards and fallback to empty structures on ambiguous input.
**Verification**: Send sample patient narrative: "Severe throbbing headache for 3 days with nausea, took Paracetamol 650mg once", verify structured JSON output accurately parses headache, 3 days duration, and Paracetamol medication.

---

### Prompt 28: FHIR QuestionnaireResponse Staging & Historical Cross-Referencing
**Context & Goal**: Store the completed intake as a FHIR `QuestionnaireResponse` and cross-reference with existing historical FHIR records to detect discrepancies.
**Files to Modify/Create**:
- `frontend/src/modules/server/core/intake/infrastructure/services/intake.rest.service.ts`
- `frontend/src/modules/server/presentation/actions/intake/core.actions.ts`
- `backend/fhir-server/app/routers/questionnaire_response.py`
**Requirements**:
1. Map intake questions and answers into FHIR `QuestionnaireResponse` items.
2. Cross-reference query: Fetch patient's past `Condition` and `MedicationRequest` resources from `fhir-server`.
3. Check for discrepancies: If patient reports "No past medical history" but FHIR records indicate "Type 2 Diabetes", generate a clinical note: *"Patient omitted documented history of Diabetes"*.
4. Commit record to `fhir-server` under `/api/fhir/v1/questionnaire-response`.
**Verification**: Submit intake with known past patient, verify `QuestionnaireResponse` is saved and discrepancy flags attach to the intake summary.

---

### Prompt 29: Automated Pre-Visit Synthesis Report Generation
**Context & Goal**: Generate the concise 1-page executive pre-visit clinical briefing report for the doctor before the telemedicine call.
**Files to Modify/Create**:
- `frontend/src/app/api/full-report-agent/route.ts`
- `frontend/src/modules/client/telemedicine/shared/components/clinical/PreVisitReportModal.tsx`
**Requirements**:
1. Combine:
   - Patient demographics & ABHA status.
   - Presenting complaint & HPI synthesized from AI intake.
   - Recent vitals and 30-day trends.
   - Current active medications and verified allergies.
   - Uploaded document highlights (e.g. "ECG from Oct 10 showed Sinus Bradycardia").
   - Highlighted AI Concerns / Red Flags (e.g. "Sudden BP elevation compared to 30-day baseline").
2. Render in a clean, print-friendly clinical summary modal with "Export PDF" and "Copy to Consultation" buttons.
**Verification**: Trigger `/api/full-report-agent` with appointment ID, verify JSON payload returns all sections and modal renders without UI overflow.

---

### Prompt 30: Patient Intake Review & Consent Confirmation Screen
**Context & Goal**: Finalize the patient pre-consultation flow with a clear summary review and telemedicine informed consent screen.
**Files to Modify/Create**:
- `frontend/src/modules/client/telemedicine/patient/components/ai-intake/IntakeReviewAndConsent.tsx`
- `frontend/src/modules/server/presentation/actions/intake/submitIntake.action.ts`
**Requirements**:
1. Review screen displaying all entered symptoms, uploaded documents, and medications in read-only cards with "Edit" buttons.
2. Telemedicine Informed Consent Accordion:
   - Consent for AI pre-consultation analysis.
   - Consent for electronic prescription and digital record storage under ABDM.
   - Acknowledgment of telemedicine limitations.
3. Digital signature pad or single-click "I Agree & Submit to Doctor" button.
4. On submission: Transitions appointment status to `arrived`, updates intake status to `completed`, and redirects patient to "Ready for Visit" waiting room.
**Verification**: Submit completed intake, verify appointment status updates to `arrived` in `fhir-server` and doctor dashboard queue reflects `AI Intake Complete`.

---

## Phase 6: Live Telemedicine Consultation Room & WebRTC Video Engine

### Prompt 31: LiveKit WebRTC Room Orchestration & Ephemeral Tokens
**Context & Goal**: Implement secure WebRTC video room provisioning using LiveKit with role-based participant tokens.
**Files to Modify/Create**:
- `frontend/src/app/api/livekit-token/route.ts`
- `frontend/src/modules/server/core/consultation/infrastructure/livekitService.ts`
**Requirements**:
1. Endpoint `POST /api/livekit-token`:
   - Validates session user (Doctor or Patient).
   - Generates LiveKit access token with `AccessToken` from `livekit-server-sdk`.
   - Room name: `drgodly-consultation-<appointmentId>`.
   - Participant identity: User ID; display name: Doctor/Patient name.
   - Permissions: `canPublish: true`, `canSubscribe: true`, `canPublishData: true`.
2. Token expiration set to 2 hours with automatic refresh buffer.
3. Webhook handler for room events: `participant_joined`, `participant_left`, `room_finished`.
**Verification**: Call `/api/livekit-token` with appointment ID, receive JWT token, and inspect claims with `jwt.io` to verify room permissions.

---

### Prompt 32: 3-Panel Consultation Layout Architecture
**Context & Goal**: Construct the 3-panel split consultation interface strictly matching `DrGodly Telemedicine Dashboard 1.png` and `DrGodly Telemedicine Care Dashboard 1.png`.
**Files to Modify/Create**:
- `frontend/src/app/[locale]/(apps)/bezs/telemedicine/doctor/appointments/online-consultation/page.tsx`
- `frontend/src/modules/client/telemedicine/doctor/component/consultation/ConsultationLayout.tsx`
**Requirements**:
1. Top Navigation Bar:
   - Left: Patient name ("Anjali Menon"), Age/Gender ("42, F"), ABHA ID, Timer ("12:45").
   - Center: Call status badge ("Live - Encrypted WebRTC").
   - Right: "End Consultation" button (red), Settings icon, Layout toggles.
2. Three-Panel Grid:
   - **Left Panel (25% width)**: AI Intake Summary & Longitudinal Medical History.
   - **Center Panel (50% width)**: Live Video streams + bottom call controls + transcript drawer.
   - **Right Panel (25% width)**: Real-time AI Clinical Decision Support (CDS) & Differential Diagnoses.
3. Bottom Action Toolbar: "Generate SOAP Note", "Add to EMR", "Share with Patient", "Ask DrGodly AI".
4. Responsive collapsible panels for smaller displays with toggle buttons.
**Verification**: Open the consultation URL, verify all 3 panels mount side-by-side with correct relative widths and no vertical page scroll.

---

### Prompt 33: Center Video Grid & Professional Media Controls
**Context & Goal**: Build the center video grid supporting dual streams (Doctor & Patient), Picture-in-Picture, and clinical call controls.
**Files to Modify/Create**:
- `frontend/src/modules/client/telemedicine/shared/components/video/LiveVideoGrid.tsx`
- `frontend/src/modules/client/telemedicine/shared/components/video/CallControlBar.tsx`
- `frontend/src/modules/client/telemedicine/shared/components/video/ParticipantTile.tsx`
**Requirements**:
1. Use `@livekit/components-react` (`LiveKitRoom`, `VideoConference`, `ParticipantTile`).
2. Main video view: High-resolution remote participant (Patient for Doctor, Doctor for Patient) with audio indicator waveform.
3. Self-view: Draggable Picture-in-Picture (PiP) tile in corner with flip-camera and minimize buttons.
4. Floating bottom control pill:
   - Mic mute/unmute with input volume meter.
   - Camera toggle on/off with device selection dropdown.
   - Screen share toggle (for reviewing lab reports with patient).
   - Chat / Transcript drawer toggle.
   - End Call button with confirmation dialog.
5. Network quality indicator (5 bars, RTT latency in ms).
**Verification**: Join call with two browser windows, verify bidirectional video and audio connect, and test mute/unmute toggles.

---

### Prompt 34: Real-Time Audio Transcription Pipeline (LiveKit + Speech API)
**Context & Goal**: Set up live streaming speech-to-text during the consultation to capture doctor and patient conversation in real time.
**Files to Modify/Create**:
- `frontend/src/app/api/livekit-start-transcriber/route.ts`
- `frontend/src/modules/client/telemedicine/shared/components/consultation/LiveTranscriptPanel.tsx`
- `backend/fhir-server/app/services/transcription_service.py`
**Requirements**:
1. Endpoint `POST /api/livekit-start-transcriber`: Starts LiveKit SIP / egress audio stream to Whisper or Gemini Live STT engine.
2. Stream transcribed utterances via WebSocket or Server-Sent Events (SSE) to the frontend client.
3. Each transcript chunk contains:
   - `speaker`: "Doctor" | "Patient"
   - `timestamp`: elapsed seconds (e.g., "04:12")
   - `text`: transcribed utterance
   - `clinical_highlight`: boolean (auto-flagged if symptom, medication, or allergy mentioned).
4. Auto-scroll to bottom with pause-on-scroll capability.
**Verification**: Speak into the microphone during consultation, verify transcribed speech appears in real-time transcript panel with speaker labels.

---

### Prompt 35: Live Consultation Chat, Clinician Scratchpad & File Sharing
**Context & Goal**: Build the in-call text messaging, doctor quick scratchpad, and real-time document sharing drawer.
**Files to Modify/Create**:
- `frontend/src/modules/client/telemedicine/shared/components/consultation/InCallChatDrawer.tsx`
- `frontend/src/modules/client/telemedicine/doctor/component/consultation/ClinicianScratchpad.tsx`
**Requirements**:
1. Chat drawer allowing text communication between patient and doctor (useful for spelling medications or low-bandwidth moments).
2. Clinician Scratchpad: Private note-taking textarea visible only to the doctor with auto-save to local storage every 5 seconds.
3. File Dropzone in chat: Allows doctor to share an educational PDF or image directly into the patient's view during the call.
4. Sound notification on incoming chat message with mute setting.
**Verification**: Send a message and image between doctor and patient windows; verify immediate receipt via WebRTC data channel.

---

### Prompt 36: Call Resilience, Reconnection Fallback & Encounter Lifecycle
**Context & Goal**: Build robust error recovery, network reconnection fallbacks, and state synchronization with FHIR `Encounter`.
**Files to Modify/Create**:
- `frontend/src/modules/client/telemedicine/shared/hooks/useConsultationLifecycle.ts`
- `frontend/src/modules/server/presentation/actions/encounter/core.actions.ts`
**Requirements**:
1. On call connect: Set FHIR `Encounter` status to `in-progress` with `actualPeriod.start = now()`.
2. Automatic reconnection logic: If WebRTC drops, display "Reconnecting..." overlay with 30-second exponential retry.
3. Graceful fallback: If video fails due to bandwidth, automatically downgrade to high-fidelity audio-only mode.
4. On "End Call":
   - Set `Encounter` status to `finished` with `actualPeriod.end = now()`.
   - Calculate consultation duration (minutes and seconds).
   - Prompt doctor: "Proceed to SOAP Note & Documentation".
**Verification**: Simulate network offline in DevTools, verify reconnection banner appears, restore network, verify call reconnects seamlessly.

---

## Phase 7: Real-Time AI Clinical Decision Support (CDS) Engine

### Prompt 37: Left Panel: Structured AI Intake & Longitudinal History Viewer
**Context & Goal**: Construct the comprehensive left-side clinical dossier matching `DrGodly Telemedicine Dashboard 1.png`.
**Files to Modify/Create**:
- `frontend/src/modules/client/telemedicine/doctor/component/consultation/IntakeSummaryPanel.tsx`
- `frontend/src/modules/client/telemedicine/doctor/component/consultation/PatientHistoryAccordion.tsx`
**Requirements**:
1. Collapsible accordion sections:
   - **Chief Complaint & HPI**: Concise synthesized summary with symptom onset, severity, and pain score.
   - **Key Vitals**: Grid showing current vs baseline (BP, Heart Rate, SpO2, Temperature, BMI).
   - **Current Medications**: Pill list with drug name, dosage, frequency, and adherence status.
   - **Verified Allergies**: Prominent red banner listing severe drug/food allergies.
   - **Past Medical & Surgical History**: Timeline of past diagnoses (ICD-10) and procedures.
   - **Flagged Concerns**: Highlighted clinical warning cards generated from AI intake.
2. Quick "Copy to Objective/Subjective" action buttons beside each section to inject content into SOAP notes.
**Verification**: Verify left panel loads all seeded patient data for Anjali Menon with expandable accordions.

---

### Prompt 38: Right Panel: Real-Time Risk Stratification & Red Flag Monitor
**Context & Goal**: Implement the live clinical risk score and red flag safety sentinel in the right CDS panel.
**Files to Modify/Create**:
- `frontend/src/modules/client/telemedicine/doctor/component/consultation/CdsRiskMonitor.tsx`
- `frontend/src/modules/client/telemedicine/doctor/component/consultation/RedFlagAlertBanner.tsx`
**Requirements**:
1. Overall Risk Meter:
   - Visual gauge: `Low Risk (Green)`, `Moderate Risk (Amber)`, `High / Critical Risk (Red)`.
   - E.g., for Anjali: "Moderate Cardiovascular & Renal Risk - Stage 2 Hypertension with borderline microalbuminuria".
2. Red Flag Sentinel Card:
   - Displays immediate clinical hazards detected from transcript or intake:
     * ⚠️ *"Patient reported intermittent visual disturbances (scotoma) with BP 150/95 - Rule out hypertensive crisis"*.
     * ⚠️ *"Allergy warning: Patient is allergic to Sulfa; avoid Thiazide diuretics"*.
3. Click to acknowledge / dismiss with audit trail logging.
**Verification**: Check that red flag cards render with distinct amber/red warning icons and provide clear clinical explanations.

---

### Prompt 39: Dynamic Differential Diagnosis Generator with Probability Bars
**Context & Goal**: Build the AI-assisted differential diagnosis widget with confidence percentages and supporting evidence.
**Files to Modify/Create**:
- `frontend/src/modules/client/telemedicine/doctor/component/consultation/DifferentialDiagnosisCard.tsx`
- `frontend/src/app/api/assessment-plan-agent/route.ts`
**Requirements**:
1. Differential Diagnosis List:
   - E.g.:
     1. **Essential (Primary) Hypertension** (ICD-10: I10) - `84% probability` (Emerald bar).
     2. **Secondary Hypertension (Renal Artery Stenosis)** (ICD-10: I15.0) - `12% probability` (Amber bar).
     3. **White-Coat Hypertension** (ICD-10: R03.0) - `4% probability` (Gray bar).
2. Supporting Clinical Evidence dropdown for each diagnosis:
   - "Supported by: SBP > 140 on 3 separate dates, maternal family history".
   - "Arguments against: Normal urinalysis, no papilledema".
3. "Accept as Primary Diagnosis" button that auto-populates the consultation's Assessment section.
**Verification**: Click "Accept as Primary Diagnosis", verify it marks the diagnosis as primary and passes ICD-10 code to the pending SOAP note.

---

### Prompt 40: Evidence-Based Next Steps & Guideline Checkboxes
**Context & Goal**: Construct the interactive clinical guidelines and recommended next steps card matching `DrGodly Telemedicine Dashboard 1.png`.
**Files to Modify/Create**:
- `frontend/src/modules/client/telemedicine/doctor/component/consultation/RecommendedNextStepsCard.tsx`
- `frontend/src/modules/client/telemedicine/doctor/component/consultation/ClinicalGuidelineCitation.tsx`
**Requirements**:
1. Recommended Actions with checkboxes:
   - [ ] *"Order Lipid Panel & Serum Electrolytes (JNC-8 Recommendation)"*
   - [ ] *"Prescribe ARB or ACE-Inhibitor (e.g. Telmisartan 40mg once daily)"*
   - [ ] *"Schedule 2-week Blood Pressure Re-Check"*
   - [ ] *"Provide DASH Diet and sodium restriction educational handout"*
2. "Add Selected to Care Plan" batch action button:
   - Checking items and clicking button automatically creates draft orders in the plan section.
3. Clinical Guideline Reference pill: "AHA/ACC 2024 Hypertension Management Guidelines" with link to guideline excerpt modal.
**Verification**: Check two recommendations, click "Add Selected to Care Plan", verify draft orders appear in the plan drawer.

---

### Prompt 41: FastMCP Tool Integration: Querying fhir-mcp for Real-Time Labs
**Context & Goal**: Connect the CDS engine to `fhir-mcp` (Port 8002) over Streamable-HTTP to dynamically query historical labs, medication interactions, and contraindications.
**Files to Modify/Create**:
- `frontend/src/app/api/mcp-agent/route.ts`
- `backend/fhir-mcp/app/tools/clinical_queries.py`
**Requirements**:
1. Connect to FastMCP endpoint `http://localhost:8002/mcp` with forwarded user JWT.
2. Available AI tools auto-generated from `fhir-server` OpenAPI:
   - `get_patient_observations(patient_id, loinc_code)`: Retrieves 12-month lab trends.
   - `check_drug_interactions(medications_list)`: Cross-references RxNorm database.
   - `get_patient_conditions(patient_id)`: Fetches active disease codes.
3. Call MCP tools from the Next.js API route to enrich the doctor's CDS recommendations during the live call.
**Verification**: Invoke `/api/mcp-agent` requesting drug interaction for Metformin and Lisinopril, verify it returns FastMCP response with verified clinical details.

---

### Prompt 42: Doctor In-Consultation AI Copilot Chat Drawer
**Context & Goal**: Build the collapsible "Ask DrGodly AI" clinical copilot drawer accessible from the bottom consultation toolbar.
**Files to Modify/Create**:
- `frontend/src/modules/client/telemedicine/doctor/component/consultation/DoctorAiCopilotDrawer.tsx`
- `frontend/src/app/api/consultation-agent/route.ts`
**Requirements**:
1. Slide-over drawer from bottom or right when doctor clicks "Ask DrGodly AI" on the toolbar.
2. Capability to ask free-form clinical questions with immediate context of the current patient:
   - *"What is the recommended second-line agent if GFR is 55?"*
   - *"Calculate 10-year ASCVD risk score for this patient"*
   - *"Draft patient explanation for why lifestyle changes are needed alongside medication"*
3. 1-click "Insert into SOAP Note" button beside every response snippet.
4. Latency under 1.5 seconds using streaming tokens.
**Verification**: Open copilot drawer during call, ask ASCVD risk question, verify fast streaming response and click "Insert into SOAP Note" to verify clipboard paste.

---

## Phase 8: Automated SOAP Note Generation & Clinical Documentation

### Prompt 43: Audio Transcript & CDS Synthesis Pipeline
**Context & Goal**: Implement the multi-stage AI pipeline that transforms the recorded consultation transcript and CDS actions into a structured SOAP note JSON.
**Files to Modify/Create**:
- `frontend/src/app/api/consultation/save-clinical-data/route.ts`
- `frontend/src/modules/server/core/consultation/application/generateSoapFromConsultation.ts`
**Requirements**:
1. Input payload: Complete audio transcript, doctor scratchpad notes, accepted differential diagnoses, and checked recommendation steps.
2. Process through Gemini 2.5 Pro with structured schema:
   - `subjective`: Chief complaint, detailed HPI, review of systems, patient-reported symptoms.
   - `objective`: Observed vitals during visit, physical exam findings discussed, reviewed lab values.
   - `assessment`: Primary diagnosis with ICD-10 code, secondary diagnoses, clinical reasoning.
   - `plan`: Medications (Rx), diagnostic lab tests ordered, patient education, follow-up timeline.
3. Automatically link the generated SOAP payload with the FHIR `Encounter` ID.
**Verification**: Run generation test with sample 5-minute transcript, verify output returns valid JSON conforming to the complete SOAP schema.

---

### Prompt 44: Post-Visit SOAP Documentation Studio
**Context & Goal**: Build the complete post-consultation documentation studio interface strictly matching `Post-Visit Documentation.png`.
**Files to Modify/Create**:
- `frontend/src/app/[locale]/(apps)/bezs/telemedicine/doctor/appointments/[appointmentId]/review/page.tsx`
- `frontend/src/modules/client/telemedicine/doctor/component/post-visit/SoapDocumentationStudio.tsx`
**Requirements**:
1. Page Header:
   - Patient Info Banner: Avatar, Anjali Menon, 42F, Visit Date, Visit Type ("Telemedicine Video").
   - Status Badge: `Draft - Needs Review` (amber).
   - Actions: "Discard", "Save Draft", "Sign & Finalize to EMR" (primary emerald button).
2. Four Core SOAP Accordion Panes:
   - **S - Subjective**: Chief complaint, HPI textarea with AI bullet points.
   - **O - Objective**: Vitals table, physical exam notes.
   - **A - Assessment**: Primary and secondary diagnoses with ICD-10 selector pills.
   - **P - Plan**: Rx prescriptions, lab orders, dietary instructions, follow-up date picker.
3. Clean modern typography with editable text areas and syntax highlighting for clinical terms.
**Verification**: Navigate to review page for completed appointment, verify all 4 SOAP panes load with AI-drafted content ready for editing.

---

### Prompt 45: Automated ICD-10 & SNOMED CT Diagnostic Coding Engine
**Context & Goal**: Build the intelligent terminology auto-completer and suggestion engine for ICD-10 and SNOMED CT codes.
**Files to Modify/Create**:
- `frontend/src/modules/client/telemedicine/shared/components/clinical/Icd10CodeSelector.tsx`
- `frontend/src/modules/server/presentation/actions/terminology/core.actions.ts`
- `backend/fhir-server/app/routers/terminology.py`
**Requirements**:
1. Search input with debounced lookup against `fhir-server` terminology endpoint `/api/fhir/v1/terminology/search?q=<query>`.
2. Support searching by code (e.g. "I10") or by description (e.g. "Essential Hypertension").
3. AI Confidence tag on suggested codes: "98% Match based on clinical notes".
4. Support adding multiple secondary diagnoses with primary/secondary toggle radio buttons.
**Verification**: Type "Hyper" in the diagnostic code input, verify dropdown displays "I10 - Essential (primary) hypertension" and "I15 - Secondary hypertension".

---

### Prompt 46: Clinician Rich-Text SOAP Note Editor with Diff Tracking
**Context & Goal**: Provide the doctor with an intuitive rich-text editor to modify AI-generated SOAP notes with tracked changes.
**Files to Modify/Create**:
- `frontend/src/modules/client/telemedicine/doctor/component/post-visit/RichSoapEditor.tsx`
- `frontend/src/modules/client/telemedicine/doctor/component/post-visit/AiDiffHighlighter.tsx`
**Requirements**:
1. TipTap or Lexical rich-text editor instance with toolbar (Bold, Italic, Bullets, Lists, Headings).
2. "AI Generated" visual indicator on paragraphs that were synthesized by AI vs edited by the doctor.
3. "Re-generate Section" button on each pane (Subjective, Objective, Assessment, Plan) with specific doctor instructions (e.g., *"Make HPI more concise"*).
4. Auto-save indicator: "Draft saved 3 seconds ago" with local cache backup.
**Verification**: Edit a paragraph in the Subjective section, verify auto-save indicator updates and changes persist on page refresh.

---

### Prompt 47: FHIR Encounter, Condition & Observation Ingestion Pipeline
**Context & Goal**: Implement the atomic database transaction that commits the finalized SOAP note into the FHIR server.
**Files to Modify/Create**:
- `frontend/src/modules/server/core/consultation/infrastructure/services/consultation.rest.service.ts`
- `frontend/src/modules/server/presentation/actions/consultation/completeConsultation.action.ts`
- `backend/fhir-server/app/services/consultation_service.py`
**Requirements**:
1. When doctor clicks "Sign & Finalize to EMR":
   - Update `Encounter`: status = `completed`.
   - Create or update `Condition`: code = primary ICD-10, clinicalStatus = `active`, subject = Patient.
   - Create `Observation` records for all recorded vitals with timestamps.
   - Create `DocumentReference` containing the complete formatted SOAP note in HTML and Markdown formats.
2. Ensure atomic execution: If any resource creation fails, rollback the transaction and return clear OperationOutcome.
3. Redirect doctor back to dashboard with success toast: "Consultation finalized and committed to EMR".
**Verification**: Finalize a draft note, inspect `backend/fhir-server` database to confirm `Encounter`, `Condition`, and `DocumentReference` records were created.

---

### Prompt 48: Post-Visit Patient After-Care Summary & Multilingual Translation
**Context & Goal**: Generate a plain-language, patient-friendly visit summary with 1-click translation into Indian languages (Hindi, Tamil, Telugu, Marathi).
**Files to Modify/Create**:
- `frontend/src/modules/client/telemedicine/doctor/component/post-visit/PatientCareSummaryPreview.tsx`
- `frontend/src/app/api/patient-summary-translator/route.ts`
**Requirements**:
1. Plain-English summary converting medical jargon into clear instructions:
   - "Why you visited": Follow-up for high blood pressure.
   - "What the doctor found": Your blood pressure is slightly elevated.
   - "What to do next": Take your new medicine every morning after food, avoid salty snacks.
2. Language selector dropdown: `English`, `Hindi (हिन्दी)`, `Tamil (தமிழ்)`, `Telugu (తెలుగు)`.
3. AI translation endpoint preserving drug names in English while translating all instructions into selected native script.
4. "Send to Patient's DrGodly App & WhatsApp" button.
**Verification**: Switch language dropdown to Hindi, verify instructions translate to accurate clinical Hindi with medications clearly formatted.

---

## Phase 9: e-Prescriptions, Diagnostic Orders & Pharmacy Fulfillment

### Prompt 49: Smart e-Prescription Builder with Dosage Auto-Complete
**Context & Goal**: Build the intuitive digital prescription authoring component matching `Post-Visit Documentation.png`.
**Files to Modify/Create**:
- `frontend/src/modules/client/telemedicine/doctor/component/post-visit/PrescriptionBuilder.tsx`
- `frontend/src/modules/client/telemedicine/doctor/component/post-visit/MedicationItemRow.tsx`
- `frontend/src/modules/server/presentation/actions/medication-request/core.actions.ts`
**Requirements**:
1. Searchable drug database auto-complete: Drug Brand/Generic name (e.g. "Telmisartan", "Metformin", "Amoxicillin").
2. Form inputs per drug row:
   - Strength / Form: `40 mg` / `Tablet`
   - Frequency: Dropdown (`Once daily (OD)`, `Twice daily (BD)`, `Thrice daily (TDS)`, `As needed (PRN)`).
   - Timing: `Before food`, `After food`, `With food`, `At bedtime`.
   - Duration: `30 Days` (quick stepper or number input).
   - Instructions: Text field (e.g., *"Take in the morning with water"*).
3. "Add Medication" button and drag-and-drop row reordering.
4. "Load from Previous Prescription" quick-fill button to renew existing chronic regimens with 1 click.
**Verification**: Add two medications to the prescription builder, verify calculation of total units required (e.g. 1 tab OD x 30 days = 30 tablets).

---

### Prompt 50: Real-Time Drug-Drug & Drug-Allergy Safety Checker
**Context & Goal**: Implement the pre-submission safety guardian that flags hazardous medication interactions or allergy contraindications.
**Files to Modify/Create**:
- `frontend/src/modules/client/telemedicine/doctor/component/post-visit/DrugInteractionAlert.tsx`
- `backend/fhir-server/app/services/cds_hooks_service.py`
**Requirements**:
1. As medications are added, trigger background validation:
   - Check against patient's known allergies in FHIR `AllergyIntolerance`.
   - Check against other newly prescribed drugs and existing active medications.
2. If conflict detected, render non-blocking clinical warning banner:
   - E.g.: ⚠️ *"Potential Interaction: Lisinopril + Spironolactone can increase risk of severe hyperkalemia. Consider monitoring serum potassium."*
3. Allow doctor to:
   - "Change Medication"
   - "Override with Clinical Justification" (required text field for legal documentation).
**Verification**: Prescribe a drug conflicting with patient's allergy, verify alert banner renders and requires justification before final signing.

---

### Prompt 51: Diagnostic Lab & Radiology Order Dispatcher
**Context & Goal**: Construct the lab investigation and radiology order builder using FHIR `ServiceRequest`.
**Files to Modify/Create**:
- `frontend/src/modules/client/telemedicine/doctor/component/post-visit/LabOrderBuilder.tsx`
- `frontend/src/modules/server/presentation/actions/service-request/core.actions.ts`
- `backend/fhir-server/app/routers/service_request.py`
**Requirements**:
1. Order categories: `Pathology / Blood`, `Radiology / Imaging`, `Cardiology / ECG`, `Specialty Testing`.
2. Pre-bundled quick order panels:
   - *"Hypertension Workup"* (Lipid Profile, Serum Creatinine, Electrolytes, Urinalysis).
   - *"Diabetic Panel"* (HbA1c, Fasting Blood Sugar, Postprandial Glucose).
3. Checkbox selector with priority flag: `Routine` vs `Urgent / STAT`.
4. Create FHIR `ServiceRequest` records linked to the `Encounter` and `Patient`.
**Verification**: Select "Hypertension Workup" panel, verify 4 distinct lab tests are queued and submit to verify `ServiceRequest` records in `fhir-server`.

---

### Prompt 52: Digital Signature, Practitioner License Stamp & QR Verification
**Context & Goal**: Generate the legally compliant digital signature stamp and tamper-evident QR verification code on prescriptions.
**Files to Modify/Create**:
- `frontend/src/modules/client/telemedicine/doctor/component/post-visit/DigitalSignatureModal.tsx`
- `frontend/src/lib/prescription-security.ts`
**Requirements**:
1. Doctor signature options: Saved digital certificate signature or drawn canvas signature.
2. Stamp details: Doctor Name, Qualifications, MCI/State Medical Council Reg No, Date & Time Hash.
3. Cryptographic hash generation: SHA-256 hash of (Patient ID + Doctor ID + Medications + Timestamp).
4. Generate QR code embedding verification URL `https://drgodly.com/verify-rx/<hash>`.
5. Scanning QR code allows pharmacies to verify authenticity and prevent forged prescriptions.
**Verification**: Sign a prescription, verify generated QR code and test scanning with phone to verify signature verification endpoint.

---

### Prompt 53: ABDM Digital Locker Dispatch & Print-Ready PDF Generation
**Context & Goal**: Implement print-ready PDF export and direct ABDM (Ayushman Bharat Digital Mission) health record push.
**Files to Modify/Create**:
- `frontend/src/modules/server/core/document-reference/infrastructure/pdfGenerator.ts`
- `frontend/src/modules/server/presentation/actions/abdm/pushHealthRecord.action.ts`
**Requirements**:
1. Server-side PDF generation using `@react-pdf/renderer` or Puppeteer:
   - Professional DrGodly hospital header with logo, address, and license info.
   - Patient demographics & ABHA ID.
   - Rx table with clear dosage, frequency, and instructions.
   - Doctor signature stamp and verification QR code.
   - Standard medical disclaimer footer.
2. Push encrypted FHIR bundle to ABDM Gateway (`M1/M2/M3 compliance`) so it appears in the patient's national ABHA Health Locker app (e.g. Aarogya Setu / ABHA App).
**Verification**: Generate PDF, verify layout matches clinical prescription standards and download renders cleanly in browser PDF viewer.

---

### Prompt 54: Pharmacy Routing, Local Fulfillment API & Patient Dispatch
**Context & Goal**: Enable patient to route electronic prescriptions directly to partner pharmacies for home delivery.
**Files to Modify/Create**:
- `frontend/src/modules/client/telemedicine/patient/components/post-visit/PharmacySelectorModal.tsx`
- `frontend/src/app/api/pharmacy/order-dispatch/route.ts`
**Requirements**:
1. Modal shown to patient after consultation: "Get your prescribed medications delivered".
2. Partner options: Apollo Pharmacy, Netmeds, Tata 1mg, or Local Chemist.
3. Displays estimated delivery time and order pricing preview.
4. "Confirm Pharmacy Dispatch" button sends electronic prescription payload to pharmacy partner API and generates order tracking number for the patient.
**Verification**: Select pharmacy and submit, verify mock order confirmation returns tracking ID and SMS notification dispatches.

---

## Phase 10: EMR Intelligence Chatbot, Semantic Search & Enterprise Operations

### Prompt 55: EMR Semantic Vector Indexing & FHIR Resource Embeddings
**Context & Goal**: Build the semantic indexing pipeline in `backend/fhir-server` that embeds patient clinical notes, lab results, and diagnoses for AI retrieval.
**Files to Modify/Create**:
- `backend/fhir-server/app/services/embedding_service.py`
- `backend/fhir-server/app/models/clinical_embedding.py`
- `backend/fhir-server/scripts/reindex_embeddings.py`
**Requirements**:
1. Configure `pgvector` extension in PostgreSQL 15.
2. Table `clinical_embeddings`: `id`, `patient_id`, `resource_type`, `resource_id`, `text_chunk`, `embedding (vector 768)`, `created_at`.
3. Event listener: Whenever a `DiagnosticReport`, `DocumentReference` (SOAP), or `Condition` is committed, automatically generate embedding using `text-embedding-004` or HuggingFace local model.
4. Cosine similarity search function: `search_patient_records(patient_id, query_vector, top_k=5)`.
**Verification**: Run `python scripts/reindex_embeddings.py`, verify clinical records are vectorized and similarity search returns relevant clinical chunks.

---

### Prompt 56: Natural Language EMR Chat Interface (Admin & Doctor)
**Context & Goal**: Implement the interactive EMR search and intelligence chatbot interface located at `admin/emr-chat/[sessionId]` and `doctor/emr/[sessionId]`.
**Files to Modify/Create**:
- `frontend/src/app/[locale]/(apps)/bezs/telemedicine/admin/emr-chat/[sessionId]/page.tsx`
- `frontend/src/modules/client/telemedicine/shared/components/emr-chat/EmrChatInterface.tsx`
- `frontend/src/app/api/pdf-chat-agent/route.ts`
**Requirements**:
1. Chat session UI:
   - Left sidebar: Chat session history list ("Hypertension cohorts", "Anjali Menon review", "Q3 Diabetic reports").
   - Center: Conversational message thread with user queries and rich AI answers.
   - Right: Retrieved clinical evidence drawer with highlighted source documents.
2. Natural language query capabilities:
   - *"Show all patients with HbA1c > 8.0 who haven't had an appointment in 6 months"*
   - *"Summarize Anjali Menon's blood pressure progression over the last year"*
   - *"Which patients are currently prescribed both Metformin and ACE inhibitors?"*
3. Render structured results in interactive tables with 1-click links to the patient's FHIR profile.
**Verification**: Ask *"Summarize Anjali Menon's blood pressure"*, verify bot responds with chronological BP readings and citations to the specific Observation records.

---

### Prompt 57: FastMCP Agent Tool Integration: Multi-Resource EMR Search
**Context & Goal**: Connect the EMR Chatbot to `fhir-mcp` tools for typed, secure data fetching across all 17 FHIR resources.
**Files to Modify/Create**:
- `frontend/src/app/api/mcp-agent/route.ts`
- `backend/fhir-mcp/app/tools/emr_search.py`
**Requirements**:
1. Register specialized FastMCP search tools:
   - `search_encounters_by_diagnosis(icd_code, date_range)`
   - `search_medication_requests(drug_name, status)`
   - `get_patient_timeline(patient_id)`
2. FastMCP handles schema validation, query translation, and pagination.
3. Stream tool call execution indicators in the chat UI ("🔍 Searching FHIR database for LOINC 4548-4...").
**Verification**: Send complex cohort query to EMR chat, verify intermediate tool execution badges render before the final synthesized answer.

---

### Prompt 58: Patient Longitudinal Timeline & Interactive Medical History
**Context & Goal**: Build the interactive chronological visual timeline of patient health events at `/patient/medical-records`.
**Files to Modify/Create**:
- `frontend/src/app/[locale]/(apps)/bezs/telemedicine/patient/medical-records/page.tsx`
- `frontend/src/modules/client/telemedicine/patient/components/records/LongitudinalTimeline.tsx`
- `frontend/src/modules/client/telemedicine/patient/components/records/RecordDetailModal.tsx`
**Requirements**:
1. Vertical interactive timeline with event cards:
   - 📅 **Consultations**: Telemedicine and in-person visits with doctor name and chief complaint.
   - 🧪 **Lab Tests**: Completed blood work with highlighted normal/abnormal badges.
   - 💊 **Prescriptions**: Prescribed courses with start and end dates.
   - 💉 **Immunizations & Procedures**: Vaccines, surgeries, ECGs.
2. Filter bar: `All Events`, `Doctor Visits`, `Lab Reports`, `Prescriptions`.
3. Clicking any event opens a detailed modal displaying the underlying FHIR resource details and linked PDF download.
**Verification**: Visit `/patient/medical-records`, filter by "Lab Reports", verify only diagnostic test records appear and open the detail modal.

---

### Prompt 59: Telemedicine Scheduling, Calendar & Slot Allocation Engine
**Context & Goal**: Build the comprehensive appointment scheduling and slot booking engine matching `DrGodly Appointment Dashboard.png`.
**Files to Modify/Create**:
- `frontend/src/app/[locale]/(apps)/bezs/telemedicine/patient/appointments/book/page.tsx`
- `frontend/src/modules/client/telemedicine/patient/components/booking/DoctorBookingCalendar.tsx`
- `frontend/src/modules/server/presentation/actions/slot/core.actions.ts`
**Requirements**:
1. Doctor discovery: Filter by Specialty, Language, Gender, Availability (Today, Tomorrow), Consultation Type (Video vs In-Person).
2. Interactive Calendar:
   - Date picker with available day indicators.
   - Time slot pills categorized into `Morning (9 AM - 12 PM)`, `Afternoon (1 PM - 5 PM)`, `Evening (6 PM - 9 PM)`.
   - Real-time slot locking: When selected, slot is held for 10 minutes to prevent double-booking.
3. Booking confirmation step with patient reason for visit and optional document pre-attachment.
4. Atomically creates FHIR `Appointment` with status `booked` and updates `Slot` status to `busy`.
**Verification**: Book an available morning slot, verify slot becomes unavailable for subsequent users and appointment appears in doctor's dashboard.

---

### Prompt 60: End-to-End System Health Checks, CI/CD & Production Readiness
**Context & Goal**: Build the end-to-end automated verification suite that validates all 60 features, API integrations, and FHIR services.
**Files to Modify/Create**:
- `frontend/package.json` (verification scripts)
- `backend/tests/test_full_clinical_workflow.py`
- `scripts/verify-all-services.ps1`
**Requirements**:
1. Automated workflow test in Python:
   - Registers test patient & doctor.
   - Books appointment and confirms slot.
   - Executes AI intake and generates pre-visit synthesis report.
   - Simulates LiveKit video consultation start and finish.
   - Generates and signs SOAP note.
   - Creates e-Prescription and commits to FHIR database.
2. Frontend CI build verification:
   - Runs `npm run build` with zero TypeScript or ESLint errors.
   - Verifies bundle size and static route generation.
3. Service health check script (`scripts/verify-all-services.ps1`):
   - Probes `fhir-server` (8000), `fhir-mcp` (8002), `fhir-gql` (8005), and frontend (4000).
   - Reports green checkmarks for all running subsystems.
**Verification**: Execute `npm run build` in `frontend/` and run `scripts/verify-all-services.ps1` to confirm 100% operational readiness.

---

## Instructions for Coding Agents Executing These Prompts

When handing these prompts to a coding agent:
1. **Execute sequentially**: Prompts within Phase 1 establish the foundation; subsequent phases rely on earlier data structures and DI registrations.
2. **Use npm strictly**: In `frontend/`, always run `npm run dev`, `npm run build`, and `npm run db:generate`. Never use `pnpm` or `yarn`.
3. **Preserve Clean Architecture**: Maintain the separation between domain interfaces, infrastructure services, ZSA server actions, and client UI components.
4. **Follow FHIR R4 Standards**: Ensure all clinical records adhere to HL7 FHIR R4 specifications and dual-format JSON content negotiation.
5. **Adhere to the Figma Screenshots**: Match the colors, typography, card borders, badge states, and 3-panel consultation layout seen in `c:/Users/Pranjal/Downloads/drive-download-20261025T080725Z-1-001/`.
