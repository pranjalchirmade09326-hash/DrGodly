/**
 * Marketing landing page for DrGodly.
 *
 * Route: /[locale]/(marketing)
 *
 * Server component. Fetches the current session to control CTA button
 * variants (Sign Up vs. Open Dashboard). Composes the high-converting,
 * sleek Silicon Valley healthcare SaaS narrative flow:
 *
 *   RootNavbar                   — fixed top nav with DrGodly logo, navigation, and auth actions
 *   Hero                         — value prop + compact live telemetry cockpit simulation
 *   MetricsRibbon                — single-row 4-metric strip + certified interoperability ticker
 *   InteractiveSimulatorSection  — interactive patient workbench (Louise Reed / Marcus Chen / Sarah Jenkins)
 *   ClinicalPipelineSection      — 4-stage visual data pipeline (Ambient Input → Event Bus → SLMs → Attestation)
 *   Features                     — 6 core capabilities bento grid
 *   FhirEmrSection               — HL7 FHIR R4 resource model vs. legacy proprietary EMRs
 *   McpSection                   — Model Context Protocol server terminal simulation
 *   Testimonials                 — HIPAA, SOC 2 Type II, BAA, and data privacy trust pillars
 *   Cta                          — Final sign-up / cockpit demonstration call-to-action
 *   Footer                       — Links + HL7/HIPAA/MCP compliance disclosures
 */

import { getServerSession } from "@/modules/server/auth/get-session";
import RootNavbar from "@/modules/client/(marketing)/components/RootNavbar";
import Hero from "@/modules/client/(marketing)/components/Hero";
import MetricsRibbon from "@/modules/client/(marketing)/components/MetricsRibbon";
import TrustLogos from "@/modules/client/(marketing)/components/TrustLogos";
import Features from "@/modules/client/(marketing)/components/Features";
import InteractiveSimulatorSection from "@/modules/client/(marketing)/components/InteractiveSimulatorSection";
import ClinicalPipelineSection from "@/modules/client/(marketing)/components/ClinicalPipelineSection";
import FhirEmrSection from "@/modules/client/(marketing)/components/FhirEmrSection";
import McpSection from "@/modules/client/(marketing)/components/McpSection";
import Testimonials from "@/modules/client/(marketing)/components/Testimonials";
import Cta from "@/modules/client/(marketing)/components/Cta";
import Footer from "@/modules/client/(marketing)/components/Footer";

export const dynamic = "force-dynamic";

/** Marketing landing page with high-converting clinical sequence. */
export default async function Home() {
  const session = await getServerSession();

  return (
    <>
      <RootNavbar session={session} />
      <main>
        <Hero session={session} />
        <MetricsRibbon />
        <TrustLogos />
        <Features />
        <InteractiveSimulatorSection />
        <ClinicalPipelineSection />
        <FhirEmrSection />
        <McpSection />
        <Testimonials />
        <Cta session={session} />
      </main>
      <Footer />
    </>
  );
}
