

> **DrGodly** is an enterprise-grade, **AI-Native Telemedicine and Clinical Operating System** designed to eliminate physician administrative burden, prevent diagnostic errors, and provide seamless chronic care management. It unites ambient AI intelligence, live clinical decision support (CDS), WebRTC telemedicine, and an HL7 FHIR R4 clinical data repository into a single unified platform.

---

## 🌟 Executive Summary: What is DrGodly?

Modern healthcare suffers from two acute bottlenecks: **doctor documentation burnout** ("pajama time" spent typing into legacy EMRs) and **fragmented patient data** (paper prescriptions, lost lab slips, lack of adherence).

**DrGodly solves both:**
1. **For Doctors**: During a telemedicine visit, DrGodly ambiently listens, transcribes in real-time, displays live diagnostic suggestions, and automatically synthesizes a complete **SOAP Note** and **e-Prescription with MCI digital signature & tamper-evident SHA-256 QR code**.
2. **For Patients**: A pre-visit conversational **AI Intake Studio** collects chief complaints, lets patients rate pain on a visual 1–10 slider, and extracts biomarkers from uploaded lab slips/ECGs via OCR. An interactive **Wellness Portal** tracks daily habits with an animated 78/100 health gauge.
3. **For Hospitals & Regulators**: 100% interoperable with global hospital standards via **HL7 FHIR R4** and compliant with India's **Ayushman Bharat Digital Mission (ABDM)** for national health locker synchronization.

---

## 🎨 Interactive Screen Studio (Zero-Backend UI Mode)

To allow developers, evaluators, and stakeholders to test and inspect all official Figma-matched screens **without running databases or backend microservices**, DrGodly includes a standalone **Screen Studio**:

👉 **URL**: **`http://localhost:4000/en/screens`** *(Run `cd frontend && npm run dev`)*

| Screen | Figma Design Reference | Key Clinical Features |
|---|---|---|
| **1. Doctor Clinical Dashboard** | `Doctor Dashboard.png` | 4 KPI cards, triage-sorted appointment queue (`Routine` vs `Urgent`), live AI Clinical Assistant widget, CDS alerts, 30-day analytics. |
| **2. Doctor Telemedicine Room** | `DrGodly Telemedicine Dashboard 1.png` | **3-Panel Cockpit**: Left patient medical dossier, center WebRTC video call with live transcript waveform, right CDS diagnostic probabilities & guidelines. |
| **3. Post-Visit Documentation** | `Post-Visit Documentation.png` | Ambiently drafted SOAP notes, RxNorm medication orders, MCI doctor signature stamp, SHA-256 tamper-evident QR verification, 1-click ABHA push. |
| **4. Patient Wellness Portal** | `Patient Dashboard.png` | Animated circular SVG health score gauge (78/100), vitals telemetry (BP, HbA1c, Weight, Steps), daily care checklist, "Ask DrGodly" AI widget. |
| **5. Patient Call Room** | `DrGodly Telemedicine Care Dashboard 1.png` | Patient-facing video consult with verified doctor profile, pre-visit intake synthesis briefing, real-time in-call messaging, and prescription dispatch status. |
| **6. AI Clinical Intake Studio** | *Conversational Clinic* | **Interactive 1–10 pain slider** with dynamic severity badges, quick-tap symptom pills, FastMCP OCR lab/ECG biomarker extraction preview. |
| **7. Appointment Booking Flow** | `DrGodly Appointment Dashboard.png` | 3-step wizard with doctor discovery cards (`★ 4.9`), **Morning / Afternoon / Evening** categorized time slot pills, and ABHA guarantee. |

---

## 🏗️ System Architecture & Data Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│             Patient & Doctor Client (Next.js 16 App Router)           │
│                               Port 4000                                │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    ▼                                ▼
       ┌────────────────────────┐       ┌────────────────────────┐
       │ LiveKit WebRTC Server  │       │ Unified Swagger UI Hub │
       │ Encrypted Video/Audio  │       │   /api/docs (Port 4000)│
       └────────────────────────┘       └────────────────────────┘
                    │
                    ▼ (ZSA Server Actions / JWKS Token)
       ┌─────────────────────────────────────────────────────────┐
       │   fhir-gql Middleware (FastAPI Gateway - Port 8005)     │
       │   RBAC Auth, Rate Limiting, and Routing Proxy           │
       └────────────────────────────┬────────────────────────────┘
                                    │ (Internal HTTP)
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
       ┌────────────────────────┐      ┌────────────────────────┐
       │ fhir-server (Port 8000)│      │ fhir-mcp (Port 8002)   │
       │ HL7 FHIR R4 REST API   │◄────►│ FastMCP Streamable HTTP│
       │ 34+ Clinical Resources │      │ AI Clinical Tool Agent │
       └────────────┬───────────┘      └────────────────────────┘
                    │
            ┌───────┴───────┐
            ▼               ▼
       ┌──────────┐   ┌───────────┐
       │PostgreSQL│   │  Redis 7  │
       │Port 5432 │   │ Port 6379 │
       └──────────┘   └───────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technologies Used | Purpose |
|---|---|---|
| **Frontend** | **Next.js 16**, React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Framer Motion | High-performance responsive medical interface |
| **State & Data** | TanStack Query v5, ZSA Server Actions, Zod validation | Type-safe client-server data synchronization |
| **Video Calling** | LiveKit WebRTC SDK (`@livekit/components-react`), Web Audio STT | Low-latency encrypted doctor-patient video consultations |
| **Core FHIR Backend** | **FastAPI**, Python 3.12+, SQLAlchemy 2.0 (Async), `asyncpg`, Alembic | Standardized HL7 FHIR R4 REST server (`:8000`) |
| **AI Tool Gateway** | **FastMCP** (Streamable-HTTP transport) | Converts OpenAPI schemas into typed tools for LLM reasoning (`:8002`) |
| **Middleware Gateway** | FastAPI, PyJWT, PyJWKClient, Redis sliding window rate-limiter | Security and RBAC proxy (`:8005`) |
| **AI Models** | Google Gemini 2.5 Pro & Flash, Whisper STT | Clinical intake elicitation, OCR, and SOAP note synthesis |
| **Databases** | PostgreSQL 15 (Relational & JSONB), Redis 7 | Clinical storage, caching, and rate limiting |

---

## 🌐 Microservices & Ports Matrix

| Service | Port | Endpoint URL | Description |
|---|---|---|---|
| **Frontend Web App** | `4000` | `http://localhost:4000` | Main Next.js 16 clinical portal & telemedicine client |
| **Screen Studio Hub** | `4000` | `http://localhost:4000/en/screens` | **Zero-backend interactive showroom for all 7 UI screens** |
| **Unified Swagger UI Hub** | `4000` | `http://localhost:4000/api/docs` | Dropdown multi-service Swagger tester (`:8000`, `:8005`, `:4000`) |
| **FHIR Server API** | `8000` | `http://localhost:8000` | Core FHIR R4 data repository (`/api/fhir/v1/*`) |
| **FHIR Server Swagger** | `8000` | `http://localhost:8000/docs` | Direct FastAPI Swagger documentation for FHIR layer |
| **FastMCP AI Gateway** | `8002` | `http://localhost:8002/mcp` | FastMCP streamable-HTTP endpoint for LLMs |
| **FHIR Middleware** | `8005` | `http://localhost:8005` | RBAC gateway & rate-limiting proxy (`/api/v1/*`) |
| **PostgreSQL** | `5432` / `5436` | `localhost:5436` | Relational clinical database (`fhir-server`) |
| **Redis** | `6379` / `6381` | `localhost:6381` | In-memory cache & sliding window limiter |

---

## ⚡ How to Run DrGodly

### Mode 1: UI Screens Mode (Zero Backend Required)
*Recommended for designers, evaluators, and frontend developers who want to test the UI immediately.*

```powershell
# 1. Navigate to the frontend directory
cd "d:\DrGodly New\frontend"

# 2. Start the Next.js development server
npm run dev

# 3. Open in your browser:
# ➔ Screen Studio: http://localhost:4000/en/screens

```

---

### Mode 2: Full-Stack Mode (Frontend + Backend + DB)
*For end-to-end testing with PostgreSQL, FastAPI microservices, and FastMCP AI tools.*

#### Step 1: Start PostgreSQL & Redis via Docker
```powershell
cd "d:\DrGodly New\backend"
docker compose up -d
```

#### Step 2: Start Core FHIR Server (Port 8000)
```powershell
cd "d:\DrGodly New\backend\fhir-server"
uv run alembic upgrade head
uv run fastapi dev app/main.py
# ➔ Running at http://localhost:8000
```

#### Step 3: Start FastMCP AI Gateway (Port 8002)
```powershell
cd "d:\DrGodly New\backend\fhir-mcp"
uv run python -m app.main
# ➔ Running at http://localhost:8002/mcp
```

#### Step 4: Start FHIR Middleware Gateway (Port 8005)
```powershell
cd "d:\DrGodly New\backend\fhir-gql"
uv run uvicorn app.main:app --port 8005 --reload
# ➔ Running at http://localhost:8005
```

#### Step 5: Start Frontend Application (Port 4000)
```powershell
cd "d:\DrGodly New\frontend"
npm run dev
# ➔ Running at http://localhost:4000
```

---

## 🔍 Interactive API Testing (Swagger Hub)

DrGodly provides a unified Swagger UI where you can inspect, test, and execute requests across all microservices:
1. Open **`http://localhost:4000/api/docs`** (or `/api/swagger`).
2. Use the top dropdown to switch between:
   * **1. FHIR Server R4 REST API (Port 8000)**
   * **2. FHIR Middleware & RBAC Gateway (Port 8005)**
   * **3. DrGodly Clinical Mobile & Intake API**
   * **4. AI Clinical & Telemedicine Services (Port 4000)**
3. Click any endpoint, select **"Try it out"**, fill in test values, and click **"Execute"**.

---

## 🔒 Security & Medical Standards Compliance

- **HL7 FHIR R4 Standards**: Implements 34+ core FHIR resources (`Patient`, `PractitionerRole`, `Appointment`, `Encounter`, `Condition`, `Observation`, `MedicationRequest`, etc.).
- **Ayushman Bharat Digital Mission (ABDM)**: M1 (ABHA creation), M2 (Health record viewing), and M3 (Digital prescription push) compliant.
- **DPDP Act 2023 & HIPAA Compliance**: Role-based access control (RBAC), audit logging, and encryption at rest and in transit.
- **Encrypted Telemedicine**: WebRTC media streams are protected with DTLS-SRTP end-to-end encryption.
- **Tamper-Evident Prescriptions**: Every generated e-prescription contains an MCI registration stamp and a SHA-256 hashed QR code that pharmacies can verify offline.

---


---

## 👥 Authors & License
Developed for the **DrGodly AI-Native Healthcare Initiative**.  
All rights reserved © 2026.
