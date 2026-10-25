import { NextResponse } from "next/server";

export async function GET() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>DrGodly Clinical API - Swagger Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <link rel="icon" type="image/png" href="/icon.png" />
  <style>
    html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin: 0; background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .topbar { background-color: #0f172a !important; padding: 12px 20px !important; border-bottom: 2px solid #0d9488; }
    .topbar-wrapper { display: flex; align-items: center; justify-content: space-between; max-width: 1460px; margin: 0 auto; }
    .topbar-wrapper .link { display: flex; align-items: center; gap: 10px; text-decoration: none; font-size: 1.25rem; font-weight: 700; color: #ffffff !important; }
    .badge-live { background: #10b981; color: #ffffff; padding: 2px 8px; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; margin-left: 8px; }
    .swagger-ui .info { margin: 30px 0 20px 0; }
    .swagger-ui .info .title { color: #0f172a; font-size: 2.2rem; }
    .swagger-ui .scheme-container { background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border-radius: 12px; margin-bottom: 20px; }
    .swagger-ui .btn.authorize { color: #0d9488; border-color: #0d9488; font-weight: 600; }
    .swagger-ui .btn.authorize svg { fill: #0d9488; }
    .swagger-ui .opblock.opblock-get .opblock-summary-method { background: #0d9488; }
    .swagger-ui .opblock.opblock-post .opblock-summary-method { background: #0284c7; }
    .swagger-ui .opblock.opblock-delete .opblock-summary-method { background: #e11d48; }
    .swagger-ui .opblock.opblock-patch .opblock-summary-method { background: #f59e0b; }
    .quick-nav { background: #ffffff; border-bottom: 1px solid #e2e8f0; padding: 10px 20px; font-size: 0.85rem; display: flex; gap: 20px; justify-content: center; align-items: center; flex-wrap: wrap; }
    .quick-nav a { color: #0d9488; text-decoration: none; font-weight: 500; display: inline-flex; align-items: center; gap: 4px; }
    .quick-nav a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="quick-nav">
    <span><strong>Active Backends:</strong></span>
    <a href="http://localhost:8000/docs" target="_blank">FHIR Server Direct Swagger (:8000) ↗</a>
    <a href="http://localhost:8005/docs" target="_blank">FHIR Middleware Swagger (:8005) ↗</a>
    <a href="/api/mobile/docs" target="_blank">Scalar Mobile Reference ↗</a>
    <a href="http://localhost:8002/mcp" target="_blank">FastMCP Endpoint (:8002) ↗</a>
  </div>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" crossorigin></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js" crossorigin></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        urls: [
          { url: "/api/openapi/fhir-server", name: "1. FHIR Server R4 REST API (Port 8000)" },
          { url: "/api/openapi/fhir-gql", name: "2. FHIR Middleware & RBAC Gateway (Port 8005)" },
          { url: "/api/mobile/openapi.json", name: "3. DrGodly Clinical Mobile & Intake API" },
          { url: "/api/openapi/ai-agents", name: "4. AI Clinical & Telemedicine Services (Port 4000)" }
        ],
        "urls.primaryName": "1. FHIR Server R4 REST API (Port 8000)",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "StandaloneLayout",
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: "list",
        filter: true
      });
    };
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
