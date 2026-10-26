# DrGodly Clinical Platform: Swagger API Guide & In-Detail Integration Prompts

This guide provides the complete OpenAPI/Swagger specifications for all DrGodly backend services, active API endpoints, testing commands, and in-depth prompts for coding agents to implement and integrate the frontend with the backend.

---

## 1. Swagger & API Documentation URLs

DrGodly provides a **Unified Multi-Service Swagger UI** as well as direct documentation endpoints for each microservice:

| Documentation Interface | URL | Description |
|---|---|---|
| **Unified Swagger UI Hub** | `http://localhost:4000/api/docs` (or `/api/swagger`) | Unified interactive Swagger UI with drop-down selector across all 4 services (FHIR Server, Middleware, Mobile API, AI Agents). |
| **FHIR Server Swagger** | `http://localhost:8000/docs` | Direct FastAPI Swagger UI for the core FHIR R4 data layer (34+ clinical resources). |
| **FHIR Server ReDoc** | `http://localhost:8000/redoc` | Clean documentation view for FHIR R4 schemas. |
| **FHIR Server OpenAPI Spec** | `http://localhost:8000/openapi.json` | Raw OpenAPI 3.0 JSON specification. |
| **FHIR Middleware Swagger** | `http://localhost:8005/docs` | FastAPI Swagger UI for the orchestration, RBAC, and rate-limiting gateway. |
| **FHIR Middleware Spec** | `http://localhost:8005/openapi.json` | OpenAPI spec for the `/api/v1` middleware endpoints. |
| **Scalar Mobile Reference** | `http://localhost:4000/api/mobile/docs` | Modern interactive API reference for intake and consultation session state. |
| **FastMCP Streamable HTTP** | `http://localhost:8002/mcp` | MCP endpoint turning OpenAPI endpoints into typed AI agent tools. |

---

## 2. Architecture & Service Mesh

```
                     ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ
                     Γöé          Unified Swagger UI Hub               Γöé
                     Γöé       http://localhost:4000/api/docs          Γöé
                     ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓö¼ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ
                                             Γöé
               ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓö╝ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ
               Γû╝                             Γû╝                             Γû╝
   ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ   ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ   ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ
   Γöé      fhir-server      Γöé   Γöé       fhir-gql        Γöé   Γöé    DrGodly Frontend   Γöé
   Γöé      (Port 8000)      Γöé   Γöé      (Port 8005)      Γöé   Γöé      (Port 4000)      Γöé
   Γöé  FHIR R4 REST Data    Γöé   Γöé   RBAC & Rate Limit   Γöé   Γöé  AI Agents & LiveKit  Γöé
   Γöé   /api/fhir/v1/*      Γöé   Γöé       /api/v1/*       Γöé   Γöé     /api/{intake,...} Γöé
   ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓö¼ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ   ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓö¼ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ   ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓö¼ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ
               Γöé                           Γöé                           Γöé
               ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓö¼ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓö┤ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ
                               Γû╝
               ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ
               Γöé         PostgreSQL 15         Γöé
               Γöé   drgodly:password (:5432)    Γöé
               ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ
```

---

## 3. Core FHIR API Endpoints Catalog

All core endpoints are mounted under `/api/fhir/v1/<resource>` on port `8000` (or `/api/v1/<resource>` on the port `8005` middleware).

### Supported Content Types (Dual Format):
- `Accept: application/fhir+json`: Standard HL7 FHIR R4 JSON envelope.
- `Accept: application/json`: Clean snake_case JSON representation for lightweight clients.

### 1. Patients (`/api/fhir/v1/patient`)
- `GET /api/fhir/v1/patient`: Search and list patients.
- `POST /api/fhir/v1/patient`: Register new patient.
- `GET /api/fhir/v1/patient/{id}`: Fetch patient by ID.
- `PATCH /api/fhir/v1/patient/{id}`: Update demographics.
- `DELETE /api/fhir/v1/patient/{id}`: Archive patient record.

### 2. Practitioners & Clinicians (`/api/fhir/v1/practitioner`)
- `GET /api/fhir/v1/practitioner`: List all doctors and specialists.
- `POST /api/fhir/v1/practitioner`: Register practitioner with license & council reg number.
- `GET /api/fhir/v1/practitioner/{id}`: Fetch doctor profile and qualifications.
- `GET /api/fhir/v1/practitioner/me`: Fetch authenticated practitioner profile.

### 3. Appointments & Scheduling (`/api/fhir/v1/appointment`)
- `GET /api/fhir/v1/appointment`: Query appointments by `practitioner_id`, `patient_id`, or `date`.
- `POST /api/fhir/v1/appointment`: Book new consultation slot.
- `PATCH /api/fhir/v1/appointment/{id}`: Update status (`booked`, `arrived`, `fulfilled`, `cancelled`).

### 4. Consultations & Encounters (`/api/fhir/v1/encounter`)
- `GET /api/fhir/v1/encounter`: Query active or completed clinical visits.
- `POST /api/fhir/v1/encounter`: Initialize encounter when consultation starts.
- `PATCH /api/fhir/v1/encounter/{id}`: Complete encounter with duration and final state.

### 5. Vitals & Observations (`/api/fhir/v1/observation`)
- `GET /api/fhir/v1/observation`: Fetch vitals (BP: LOINC `85354-9`, Glucose: LOINC `2339-0`, SpO2: LOINC `59408-5`).
- `POST /api/fhir/v1/observation`: Record newly logged vital from wearable or manual entry.

### 6. Diagnoses & Conditions (`/api/fhir/v1/condition`)
- `GET /api/fhir/v1/condition`: Query patient's active diagnoses (ICD-10 / SNOMED CT).
- `POST /api/fhir/v1/condition`: Record new clinical diagnosis from SOAP note assessment.

### 7. Electronic Prescriptions (`/api/fhir/v1/medication-request`)
- `GET /api/fhir/v1/medication-request`: List prescribed medications for patient.
- `POST /api/fhir/v1/medication-request`: Create e-Prescription with dosage, route, frequency, and instructions.

### 8. Pre-Visit Intakes (`/api/fhir/v1/questionnaire-response`)
- `GET /api/fhir/v1/questionnaire-response`: Fetch completed AI intake questionnaires.
- `POST /api/fhir/v1/questionnaire-response`: Save patient-submitted symptom interview answers.

---

## 4. Live Testing with cURL & Swagger

### Step 1: Health Check (No Auth Required)
```bash
curl -X GET "http://localhost:8000/health" -H "Accept: application/json"
# Output: {"status":"ok","req_id":"..."}
```

### Step 2: Fetch Swagger OpenAPI Schema
```bash
curl -X GET "http://localhost:8000/openapi.json" | jq .info
```

### Step 3: Fetch Patients with Bearer Token
```bash
curl -X GET "http://localhost:8000/api/fhir/v1/patient" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Accept: application/json"
```

### Step 4: Book an Appointment
```bash
curl -X POST "http://localhost:8000/api/fhir/v1/appointment" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "booked",
    "start": "2026-10-25T10:30:00Z",
    "end": "2026-10-25T11:00:00Z",
    "participant": [
      {"actor": {"reference": "Patient/p-001"}},
      {"actor": {"reference": "Practitioner/doc-001"}}
    ],
    "description": "Hypertension & Diabetes Follow-up"
  }'
```

---

## 5. In-Detail Implementation Prompts for Coding Agents

### Swagger & API Integration Prompt A: Unified Swagger UI & OpenAPI Gateway
```text
Task: Connect the Next.js frontend to all backend OpenAPI schemas and verify the Swagger UI Hub.
Target Files:
  - frontend/src/app/api/docs/route.ts
  - frontend/src/app/api/swagger/route.ts
  - frontend/src/app/api/openapi/[service]/route.ts

Instructions:
1. Ensure the route handler at /api/docs serves the SwaggerUIBundle HTML with the custom DrGodly dark teal theme (#0f172a, #0d9488).
2. Configure the drop-down selector to switch between:
   - "1. FHIR Server R4 REST API (Port 8000)" -> /api/openapi/fhir-server
   - "2. FHIR Middleware & RBAC Gateway (Port 8005)" -> /api/openapi/fhir-gql
   - "3. DrGodly Clinical Mobile & Intake API" -> /api/mobile/openapi.json
   - "4. AI Clinical & Telemedicine Services (Port 4000)" -> /api/openapi/ai-agents
3. In /api/openapi/[service]/route.ts, proxy upstream requests to http://localhost:8000/openapi.json and http://localhost:8005/openapi.json with a 2-second timeout and provide full schema fallbacks when backends are offline.
4. Verify by navigating to http://localhost:4000/api/docs and executing an interactive "Try it out" request against /health.
```

### Swagger & API Integration Prompt B: Full-Stack FHIR Appointment Booking
```text
Task: Wire the frontend Appointment Booking Calendar to the backend FHIR Appointment and Slot endpoints.
Target Files:
  - frontend/src/modules/server/core/appointment/infrastructure/services/appointment.rest.service.ts
  - frontend/src/modules/server/presentation/actions/appointment/core.actions.ts
  - frontend/src/modules/client/telemedicine/patient/components/booking/DoctorBookingCalendar.tsx

Instructions:
1. Implement the server action `bookAppointmentAction` that accepts `{ practitionerId, slotId, start, end, reason }`.
2. Map input data into FHIR Appointment schema:
   - status: 'booked'
   - participant: [{ actor: { reference: `Patient/${patientId}` } }, { actor: { reference: `Practitioner/${practitionerId}` } }]
   - appointmentType: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v2-0276', code: 'ROUTINE' }] }
3. Delegate to `AppointmentRestApiService.book(data)` executing `POST http://localhost:8005/api/v1/appointments/book`.
4. In the UI, disable booked slots and display confirmation toast upon successful booking with the FHIR Appointment ID.
```

### Swagger & API Integration Prompt C: Live Clinical Decision Support & FastMCP Integration
```text
Task: Connect the Telemedicine consultation CDS panel to fhir-mcp (Port 8002) for real-time drug interaction checks.
Target Files:
  - frontend/src/app/api/mcp-agent/route.ts
  - frontend/src/modules/client/telemedicine/doctor/component/consultation/DifferentialDiagnosisCard.tsx
  - frontend/src/modules/client/telemedicine/doctor/component/consultation/CdsRiskMonitor.tsx

Instructions:
1. In /api/mcp-agent, connect via Streamable-HTTP to http://localhost:8002/mcp forwarding the clinician's Bearer JWT.
2. Call FastMCP tool `check_drug_interactions` whenever the doctor adds a new medication or views the patient's existing regimen.
3. Call `get_patient_observations` to fetch the 12-month timeline for LOINC 85354-9 (Blood Pressure) and LOINC 4548-4 (HbA1c).
4. Render the risk percentage bars and evidence citations dynamically in the right panel of the consultation room.
```

### Swagger & API Integration Prompt D: SOAP Note Finalization & Atomic FHIR Commit
```text
Task: Implement the atomic submission pipeline committing finalized SOAP notes to FHIR Encounter, Condition, and Observation records.
Target Files:
  - frontend/src/app/api/consultation/complete/route.ts
  - frontend/src/modules/server/presentation/actions/consultation/completeConsultation.action.ts
  - frontend/src/modules/client/telemedicine/doctor/component/post-visit/SoapDocumentationStudio.tsx

Instructions:
1. In `completeConsultationAction`, receive the finalized SOAP note `{ subjective, objective, assessment, plan, encounterId, patientId }`.
2. Post to `backend/fhir-server`:
   - Update `Encounter`: set status to 'finished', period.end to current time.
   - Create `Condition`: code = primary ICD-10 code, subject = Patient reference.
   - Create `Observation` records for all recorded vitals with quantitative values and LOINC codes.
   - Create `DocumentReference`: store markdown and HTML representation of the clinical note.
3. If all succeed, return 200 with the created resource IDs; if any fails, return an OperationOutcome error.
4. Update the doctor UI with an emerald success notification: "Consultation committed to EMR successfully".
```
