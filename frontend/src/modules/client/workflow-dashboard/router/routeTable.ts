/**
 * routeTable — the single source of truth for the workflow router.
 *
 * Layer: client / workflow-dashboard / router
 *
 * Every route the dashboard can mount is declared here: its hash fragment, its
 * sidebar label, whether it runs inside the app chrome (`shell`) or owns the
 * whole viewport (`focus`), and which widget groups the outlet mounts for it.
 *
 * The `widgets` lists are not decoration. They are what the router records on
 * each transition so the UI can show exactly which widgets were cleared out of
 * the outlet and which were mounted in their place — the "context shifts
 * entirely" requirement, made observable instead of asserted.
 *
 * This module has no React and no DOM access so the routing logic stays testable
 * and can be reused by a non-React surface if needed.
 */

export type WorkflowRouteId = 'overview' | 'patients' | 'patient' | 'appointments';

/**
 * `shell`  — sidebar + topbar chrome stays mounted around the outlet.
 * `focus`  — the chrome is unmounted and the view owns the entire viewport.
 */
export type WorkflowRouteMode = 'shell' | 'focus';

export type WorkflowIconKey = 'dashboard' | 'users' | 'patient' | 'calendar';

export type WorkflowRouteDefinition = {
  id: WorkflowRouteId;
  /** Hash fragment written to the URL, e.g. `#/patients`. */
  hash: string;
  /** Sidebar label. */
  label: string;
  /** H1-style heading for the mounted view. */
  headline: string;
  description: string;
  iconKey: WorkflowIconKey;
  mode: WorkflowRouteMode;
  /** Module routes appear in the sidebar; workflow routes are entered from a parent view. */
  showInSidebar: boolean;
  /** Widget groups the outlet mounts while this route is active. */
  widgets: readonly string[];
};

export const WORKFLOW_ROUTES: readonly WorkflowRouteDefinition[] = [
  {
    id: 'overview',
    hash: '#/overview',
    label: 'Overview',
    headline: 'Clinic Overview',
    description: 'Cross-clinic metrics, today’s schedule and open care gaps.',
    iconKey: 'dashboard',
    mode: 'shell',
    showInSidebar: true,
    widgets: ['Metric tiles', 'Today’s schedule', 'Care gap queue', 'Activity ribbon'],
  },
  {
    id: 'patients',
    hash: '#/patients',
    label: 'Patients',
    headline: 'Patient Directory',
    description: 'Panel list with risk banding and last-synced vitals.',
    iconKey: 'users',
    mode: 'shell',
    showInSidebar: true,
    widgets: ['Search filter', 'Patient list', 'Risk summary'],
  },
  {
    id: 'patient',
    hash: '#/patient',
    label: 'Patient',
    headline: 'Patient Dashboard',
    description: 'Dedicated single-patient record, isolated from every other widget.',
    iconKey: 'patient',
    mode: 'focus',
    showInSidebar: true,
    widgets: [
      'Patient header',
      'Critical alerts banner',
      'Vitals monitor',
      'Medical records timeline',
      'Action panel',
    ],
  },
  {
    id: 'appointments',
    hash: '#/appointments',
    label: 'Appointments',
    headline: 'Appointment Ledger',
    description: 'Upcoming, completed and cancelled encounters across the week.',
    iconKey: 'calendar',
    mode: 'shell',
    showInSidebar: true,
    widgets: ['Week strip', 'Encounter ledger', 'Status summary'],
  },
];

export const DEFAULT_ROUTE_ID: WorkflowRouteId = 'overview';

/** Sidebar order follows the route table; `patient` is a workflow entry point. */
export const SIDEBAR_ROUTES: readonly WorkflowRouteDefinition[] = WORKFLOW_ROUTES.filter(
  (route) => route.showInSidebar,
);

export function getRoute(id: string | null | undefined): WorkflowRouteDefinition | undefined {
  if (!id) return undefined;
  return WORKFLOW_ROUTES.find((route) => route.id === id);
}

/** Unknown or absent ids fall back to the default route so the outlet is never empty. */
export function getRouteOrFallback(id: string | null | undefined): WorkflowRouteDefinition {
  return getRoute(id) ?? getRoute(DEFAULT_ROUTE_ID)!;
}

/** `#/patient` plus an optional query, e.g. `#/patient?id=pt-louise`. */
export function buildHash(id: WorkflowRouteId, params: Record<string, string> = {}): string {
  const query = new URLSearchParams(params).toString();
  return query.length > 0 ? `${getRoute(id)!.hash}?${query}` : getRoute(id)!.hash;
}

export function isWorkflowRouteId(value: string): value is WorkflowRouteId {
  return getRoute(value) !== undefined;
}
