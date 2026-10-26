# 🩺 DrGodly: AI-Native Telemedicine & Smart EMR Platform

[![GitHub main branch](https://img.shields.io/badge/git-main-teal.svg)](https://github.com/pranjalchirmade09326-hash/DrGodly.git)
[![HL7 FHIR R4](https://img.shields.io/badge/standard-HL7%20FHIR%20R4-blue.svg)](http://hl7.org/fhir/R4/)
[![Next.js 16](https://img.shields.io/badge/frontend-Next.js%2016-black.svg)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/backend-FastAPI%200.115+-009688.svg)](https://fastapi.tiangolo.com/)
[![ABDM Compliant](https://img.shields.io/badge/ABDM-ABHA%20M1%2FM2%2FM3-orange.svg)](https://abdm.gov.in/)
[![FastMCP](https://img.shields.io/badge/AI-FastMCP%20Streamable--HTTP-purple.svg)](https://modelcontextprotocol.io/)

> **DrGodly** is an enterprise-grade, **AI-Native Telemedicine and Clinical Operating System** that combines ambient intelligence, live clinical decision support, WebRTC telemedicine, and an HL7 FHIR R4 data repository to eliminate physician documentation burden and deliver personalized healthcare.

---

## 🌟 Key Highlights & Core Capabilities

| Capability | What It Does | Clinical Impact |
|---|---|---|
| **Multi-Modal AI Intake** | Pre-consultation conversational chatbot collects symptoms and ingests past lab/prescription files (PDF/images) via OCR. | Doctors start calls with a synthesized 1-page clinical briefing instead of unorganized paper files. |
| **3-Panel Telemedicine Cockpit** | Full-HD WebRTC video alongside live speech-to-text transcription and an interactive patient medical dossier. | Zero tab-switching during calls; doctor sees vitals, medications, and allergies while seeing the patient. |
| **Live Clinical Decision Support (CDS)** | Real-time risk scoring, probability-ranked differential diagnoses, red-flag sentinels, and guideline checklists. | Reduces diagnostic blind spots and alerts doctors to acute hazards or drug contraindications during the call. |
| **Ambient SOAP Note Generation** | Automatically converts consultation transcripts and notes into structured SOAP notes (Subjective, Objective, Assessment, Plan). | Eliminates after-hours clinical documentation ("pajama time") for doctors. |
| **Smart e-Prescription & QR Verification** | Autocompletes dosages, checks drug-drug interactions, applies doctor's digital signature, and embeds a tamper-evident SHA-256 QR code. | Prevents forged prescriptions and provides partner pharmacies with instant verification. |
| **Patient Wellness Portal** | Interactive dashboard with an animated 78/100 health score gauge, vitals tracking, daily care plan checklist, and "Ask DrGodly" AI. | Boosts chronic care compliance and keeps patients actively engaged in their care plans. |
| **ABDM / ABHA Integration** | Verifies national 14-digit ABHA IDs via OTP and pushes digital prescriptions into the patient's national health locker. | Full regulatory compliance with India's Ayushman Bharat Digital Mission. |
| **Natural Language EMR Search** | Query patient populations and historical charts in plain English via the FastMCP gateway. | Instant cohort search (e.g. *"Find all diabetic patients with HbA1c > 8.0 without recent visits"*). |

---

## 🏗️ System Architecture & Data Flow

```
[ Patient & Doctor Browser ] (Next.js 16 App Router on Port 4000)
             │
             ├──► LiveKit WebRTC Server (Real-Time Encrypted Video & Audio)
             │
             ├──► AI Next.js Endpoints (/api/intake-agent, /api/consultation-agent)
             │
             ▼ (ZSA Server Actions + JWKS Bearer Token)
[ fhir-gql Middleware ] (FastAPI on Port 8005) ──► RBAC, Rate Limiting & Auth Proxy
             │
             ▼ (Internal HTTP)
[ fhir-server ] (FastAPI on Port 8000) ◄─────► [ fhir-mcp Gateway ] (Port 8002)
   HL7 FHIR R4 REST API                              Model Context Protocol for AI
             │
      ┌──────┴──────┐
      ▼             ▼
[ PostgreSQL 15 ] [ Redis 7 ]
  Port 5432       Port 6379
```

---

## 🛠️ Technology Stack

### Frontend Application (`frontend/`)
* **Framework**: [Next.js 16](https://nextjs.org/) (React 19, App Router, Server Actions, Server Components)
* **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/)
* **Architecture**: Clean Architecture with Dependency Injection using [`@evyweb/ioctopus`](https://github.com/evyweb/ioctopus)
* **Data & State**: [TanStack Query v5](https://tanstack.com/query), ZSA Server Actions, [Zod](https://zod.dev/) validation
* **Real-Time Video**: [LiveKit WebRTC SDK](https://livekit.io/) (`@livekit/components-react`) + Vapi
* **Package Manager**: **`npm`** (strictly: `npm run dev`, `npm run build`, `npm run db:generate`)

### Backend Microservices (`backend/`)
* **Core FHIR Data Server (`backend/fhir-server` - Port `8000`)**:
  * [FastAPI](https://fastapi.tiangolo.com/), Python 3.12+
  * [HL7 FHIR R4](http://hl7.org/fhir/R4/) (34+ clinical resources: Patient, Practitioner, Appointment, Encounter, Condition, Observation, MedicationRequest, etc.)
  * [SQLAlchemy 2.0](https://www.sqlalchemy.org/) (Async) + `asyncpg`
  * Dual-format responses (`application/json` and `application/fhir+json`)
* **Middleware & RBAC Gateway (`backend/fhir-gql` - Port `8005`)**:
  * FastAPI, PyJWT, PyJWKClient for JWKS authentication and Redis-backed rate-limiting
* **AI Tool Gateway (`backend/fhir-mcp` - Port `8002`)**:
  * [FastMCP](https://github.com/jlowin/fastmcp) (Streamable-HTTP transport) converting OpenAPI endpoints into typed LLM tools
* **Databases & Cache**:
  * PostgreSQL 15 (Clinical relational store & FHIR JSONB envelopes)
  * Redis 7 (Rate-limiting & session cache)
* **AI & Machine Learning**:
  * [Google Gemini 2.5 Pro / Flash](https://ai.google.dev/) for clinical reasoning, OCR, and SOAP note synthesis
  * Whisper / Speech STT for live consultation transcription

---

## 🌐 Ports & Services Matrix

| Service | Port | Endpoint | Description |
|---|---|---|---|
| **Frontend Web App** | `4000` | `http://localhost:4000` | Next.js 16 clinical portal, telemedicine cockpit, and patient dashboard |
| **Unified Swagger UI Hub** | `4000` | `http://localhost:4000/api/docs` | Interactive Swagger UI with dropdown switcher for all 4 services |
| **FHIR Server API** | `8000` | `http://localhost:8000` | Core FHIR R4 REST API (`/api/fhir/v1/*`) |
| **FHIR Server Docs** | `8000` | `http://localhost:8000/docs` | Direct FastAPI Swagger UI for FHIR R4 data layer |
| **FastMCP AI Gateway** | `8002` | `http://localhost:8002/mcp` | Model Context Protocol streamable-HTTP endpoint |
| **FHIR Middleware Gateway** | `8005` | `http://localhost:8005` | RBAC and rate-limiting proxy (`/api/v1/*`) |
| **Scalar Mobile Docs** | `4000` | `http://localhost:4000/api/mobile/docs` | Interactive reference for mobile session endpoints |
| **PostgreSQL Database** | `5432` | `localhost:5432` | Relational clinical database (`drgodly:password`) |
| **Redis Cache** | `6379` | `localhost:6379` | In-memory cache & sliding window limiter |

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
* **Node.js**: v20.x or v22.x LTS
* **npm**: v10+ (`npm -v`)
* **Python**: v3.12+ with [uv](https://github.com/astral-sh/uv) installed
* **Docker & Docker Compose** (for PostgreSQL and Redis)

---

### 2. Start PostgreSQL & Redis
In the project root, launch the containerized databases:
```bash
cd backend
docker compose up -d
```
*Verify containers are running with `docker ps` (Ports 5432 and 6379).*

---

### 3. Start Backend Services

#### Terminal 1: Core FHIR Server (Port 8000)
```bash
cd backend/fhir-server
cp .env.example .env
uv sync
uv run alembic upgrade head
uv run fastapi dev app/main.py
# → Running at http://localhost:8000 (Swagger docs at /docs)
```

#### Terminal 2: FastMCP AI Gateway (Port 8002)
```bash
cd backend/fhir-mcp
cp .env.example .env
uv sync
uv run python -m app.main
# → Running at http://localhost:8002/mcp
```

#### Terminal 3: FHIR Middleware (Port 8005)
```bash
cd backend/fhir-gql
cp .env.example .env
uv sync
uv run uvicorn app.main:app --port 8005 --reload
# → Running at http://localhost:8005
```

---

### 4. Start Next.js Frontend (Port 4000)

#### Terminal 4: Frontend Web App
```bash
cd frontend
npm install
npm run dev
# → Running at http://localhost:4000
```

---

## 🔍 Interactive API Testing & Documentation

DrGodly provides a **Unified Multi-Service Swagger UI** where you can inspect and execute test requests across all backend microservices:

1. Open your browser to: **[`http://localhost:4000/api/docs`](http://localhost:4000/api/docs)** *(also available at [`/api/swagger`](http://localhost:4000/api/swagger))*.
2. Use the top dropdown to select any service:
   * **1. FHIR Server R4 REST API (Port 8000)**
   * **2. FHIR Middleware & RBAC Gateway (Port 8005)**
   * **3. DrGodly Clinical Mobile & Intake API**
   * **4. AI Clinical & Telemedicine Services (Port 4000)**
3. Click any endpoint, select **"Try it out"**, provide test parameters or tokens, and click **"Execute"**!

---

## 📚 Master Reference Documents

* **[DRGODLY_SPECIFICATION_DOCUMENT.md](file:///d:/DrGodly%20New/DRGODLY_SPECIFICATION_DOCUMENT.md)**: Formal, publication-grade Technical Specification & System Architecture Document.
* **[PROMPTS_MASTER_PLAN.md](file:///d:/DrGodly%20New/PROMPTS_MASTER_PLAN.md)**: The complete 60-prompt implementation plan across all 10 phases.
* **[SWAGGER_AND_API_INTEGRATION_PROMPTS.md](file:///d:/DrGodly%20New/SWAGGER_AND_API_INTEGRATION_PROMPTS.md)**: Detailed API catalog, cURL commands, and integration prompts.
* **UI Design Source Screens**: `c:/Users/Pranjal/Downloads/drive-download-20261025T080725Z-1-001/` (`Doctor Dashboard.png`, `Patient Dashboard.png`, `DrGodly Telemedicine Dashboard 1.png`, `Post-Visit Documentation.png`, `Sign In Screen 1-6.png`).

---

## 🔒 Security & Medical Compliance
* **HL7 FHIR R4 Standards**: Ensures interoperability with global hospital EMRs.
* **Ayushman Bharat Digital Mission (ABDM)**: M1/M2/M3 compliance for India's national health stack.
* **Data Protection**: Designed in accordance with the Indian **Digital Personal Data Protection (DPDP) Act 2023** and **HIPAA** guidelines.
* **Encrypted WebRTC**: End-to-end DTLS/SRTP encryption on all video and audio media streams.

---

## 🤝 Contributing & License
Developed for the **DrGodly AI-Native Healthcare Initiative**.  
All rights reserved © 2026. For technical questions or contribution guidelines, please refer to the engineering team.
