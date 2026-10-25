import { NextRequest, NextResponse } from "next/server";

const FALLBACK_FHIR_SERVER_SPEC = {
  openapi: "3.0.3",
  info: {
    title: "DrGodly FHIR R4 Server API",
    version: "1.0.0",
    description: "Production-ready FHIR R4 REST API server for DrGodly AI Telemedicine Platform. Supports 17+ core FHIR resources with dual-format responses (application/json and application/fhir+json). Mounted at http://localhost:8000.",
  },
  servers: [{ url: "http://localhost:8000", description: "Local FHIR Server" }],
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Liveness probe",
        responses: { "200": { description: "Service is alive" } },
      },
    },
    "/api/fhir/v1/patient": {
      get: {
        tags: ["Patient"],
        summary: "List patients with filtering and pagination",
        responses: { "200": { description: "List of FHIR Patient resources" } },
      },
      post: {
        tags: ["Patient"],
        summary: "Create a new Patient resource",
        responses: { "201": { description: "Patient created" } },
      },
    },
    "/api/fhir/v1/patient/{id}": {
      get: {
        tags: ["Patient"],
        summary: "Get Patient by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Patient resource" } },
      },
    },
    "/api/fhir/v1/practitioner": {
      get: {
        tags: ["Practitioner"],
        summary: "List clinicians and doctors",
        responses: { "200": { description: "List of Practitioner resources" } },
      },
    },
    "/api/fhir/v1/practitioner/{id}": {
      get: {
        tags: ["Practitioner"],
        summary: "Get Practitioner profile by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Practitioner profile" } },
      },
    },
    "/api/fhir/v1/appointment": {
      get: {
        tags: ["Appointment"],
        summary: "List appointments for patient or practitioner",
        parameters: [
          { name: "practitioner_id", in: "query", schema: { type: "string" } },
          { name: "patient_id", in: "query", schema: { type: "string" } },
          { name: "date", in: "query", schema: { type: "string" } },
        ],
        responses: { "200": { description: "Appointments list" } },
      },
      post: {
        tags: ["Appointment"],
        summary: "Book an appointment",
        responses: { "201": { description: "Appointment booked" } },
      },
    },
    "/api/fhir/v1/encounter": {
      get: {
        tags: ["Encounter"],
        summary: "List clinical consultations & encounters",
        responses: { "200": { description: "Encounters list" } },
      },
      post: {
        tags: ["Encounter"],
        summary: "Create an active consultation encounter",
        responses: { "201": { description: "Encounter created" } },
      },
    },
    "/api/fhir/v1/observation": {
      get: {
        tags: ["Observation"],
        summary: "Query patient vitals & lab observations (BP, Glucose, Heart Rate)",
        responses: { "200": { description: "List of observations" } },
      },
      post: {
        tags: ["Observation"],
        summary: "Record new vital or lab observation",
        responses: { "201": { description: "Observation recorded" } },
      },
    },
    "/api/fhir/v1/condition": {
      get: {
        tags: ["Condition"],
        summary: "List diagnoses and active medical conditions (ICD-10)",
        responses: { "200": { description: "List of active conditions" } },
      },
      post: {
        tags: ["Condition"],
        summary: "Record new diagnosis",
        responses: { "201": { description: "Condition created" } },
      },
    },
    "/api/fhir/v1/medication-request": {
      get: {
        tags: ["MedicationRequest"],
        summary: "List electronic prescriptions",
        responses: { "200": { description: "List of prescriptions" } },
      },
      post: {
        tags: ["MedicationRequest"],
        summary: "Create e-Prescription with dosage, route and duration",
        responses: { "201": { description: "Prescription created" } },
      },
    },
    "/api/fhir/v1/diagnostic-report": {
      get: {
        tags: ["DiagnosticReport"],
        summary: "List diagnostic laboratory & radiology reports",
        responses: { "200": { description: "Diagnostic reports" } },
      },
    },
    "/api/fhir/v1/questionnaire-response": {
      get: {
        tags: ["QuestionnaireResponse"],
        summary: "List completed AI health intakes",
        responses: { "200": { description: "Intake responses" } },
      },
      post: {
        tags: ["QuestionnaireResponse"],
        summary: "Submit completed AI intake questionnaire",
        responses: { "201": { description: "Intake response recorded" } },
      },
    },
  },
};

const FALLBACK_AI_AGENTS_SPEC = {
  openapi: "3.0.3",
  info: {
    title: "DrGodly AI & Telemedicine Services API",
    version: "1.0.0",
    description: "AI Agent Endpoints, Real-Time Transcription, LiveKit WebRTC Token Generation, and Clinical Extraction Services.",
  },
  servers: [{ url: "http://localhost:4000", description: "DrGodly Web App" }],
  paths: {
    "/api/livekit-token": {
      post: {
        tags: ["Telemedicine Video"],
        summary: "Generate LiveKit WebRTC access token for consultation room",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  appointmentId: { type: "string" },
                  role: { type: "string", enum: ["doctor", "patient"] },
                },
                required: ["appointmentId"],
              },
            },
          },
        },
        responses: { "200": { description: "LiveKit access token and room metadata" } },
      },
    },
    "/api/intake-agent": {
      post: {
        tags: ["AI Intake"],
        summary: "Interactive pre-visit conversational intake agent turn",
        responses: { "200": { description: "AI interviewer response and next questions" } },
      },
    },
    "/api/clinical-extraction-agent": {
      post: {
        tags: ["AI Intake"],
        summary: "Extract structured clinical entities from patient narrative or OCR",
        responses: { "200": { description: "Structured clinical entities (vitals, meds, complaints)" } },
      },
    },
    "/api/document-agent": {
      post: {
        tags: ["Document Processing"],
        summary: "OCR extraction for uploaded prescriptions & lab reports",
        responses: { "200": { description: "Extracted medical report data" } },
      },
    },
    "/api/consultation-agent": {
      post: {
        tags: ["Clinical Decision Support"],
        summary: "In-call doctor AI copilot ('Ask DrGodly AI')",
        responses: { "200": { description: "Clinical recommendations with guideline citations" } },
      },
    },
    "/api/consultation/save-clinical-data": {
      post: {
        tags: ["SOAP Note Generation"],
        summary: "Synthesize transcript and CDS into finalized SOAP note",
        responses: { "200": { description: "Generated SOAP note JSON" } },
      },
    },
    "/api/mcp-agent": {
      post: {
        tags: ["FastMCP Gateway"],
        summary: "Execute FastMCP tools (drug interactions, LOINC lab trends)",
        responses: { "200": { description: "Tool execution output" } },
      },
    },
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ service: string }> }
) {
  const { service } = await params;

  if (service === "ai-agents") {
    return NextResponse.json(FALLBACK_AI_AGENTS_SPEC);
  }

  const targetUrl =
    service === "fhir-server"
      ? (process.env.FHIR_SERVER_URL || "http://localhost:8000") + "/openapi.json"
      : service === "fhir-gql"
      ? (process.env.FHIR_GQL_URL?.replace(/\/api\/v1\/?$/, "") || "http://localhost:8005") + "/openapi.json"
      : null;

  if (targetUrl) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(targetUrl, { signal: controller.signal });
      clearTimeout(timeout);

      if (res.ok) {
        const spec = await res.json();
        return NextResponse.json(spec);
      }
    } catch {
      // Fallback if backend server is not currently running locally
    }
  }

  if (service === "fhir-server") {
    return NextResponse.json(FALLBACK_FHIR_SERVER_SPEC);
  }

  if (service === "fhir-gql") {
    return NextResponse.json({
      ...FALLBACK_FHIR_SERVER_SPEC,
      info: {
        title: "DrGodly FHIR Middleware & RBAC Gateway (:8005)",
        version: "0.1.0",
        description: "Middleware service orchestrating authentication, RBAC, and rate limiting in front of the FHIR Server.",
      },
      servers: [{ url: "http://localhost:8005/api/v1", description: "Middleware API" }],
    });
  }

  return NextResponse.json({ error: "Unknown service" }, { status: 404 });
}
