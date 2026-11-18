import type { Metadata } from "next";
import { WorkflowDashboard } from "@/modules/client/workflow-dashboard/WorkflowDashboard";

/**
 * Routing Dashboard — a workflow router that reshapes the whole interface.
 *
 * Route: [locale]/routing-dashboard
 * Module: src/modules/client/workflow-dashboard
 *
 * The page itself is a thin mount point. All routing state lives in the hash
 * (`#/overview`, `#/patients`, `#/patient?id=…`, `#/appointments`), so this
 * screen works as a static server render and then takes over the URL client
 * side. Nothing outside this module is touched: no existing route, page or
 * stylesheet is modified, and every class used is already part of the app's
 * Tailwind surface.
 */

export const metadata: Metadata = {
  title: "Routing Dashboard",
  description:
    "Hash-driven clinical workflow dashboard: selecting a patient clears module chrome and general metrics, then mounts an isolated full-screen patient record.",
};

export default function RoutingDashboardPage() {
  return <WorkflowDashboard />;
}
