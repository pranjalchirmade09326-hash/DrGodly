/**
 * workflowStore — centralized, framework-free router state.
 *
 * Layer: client / workflow-dashboard / router
 *
 * The URL hash is the only source of truth. `navigate()` writes the hash and
 * the `hashchange` listener commits the parsed location into this store, which
 * then notifies subscribers. One write path means browser Back/Forward, a pasted
 * deep link (`#/patient?id=pt-louise`) and a sidebar click all resolve to the
 * same state instead of three competing copies of the route.
 *
 * On every commit the store records a trace entry naming the widget groups that
 * left the outlet and the ones that mounted. That trace is what the dashboard
 * renders in its "Outlet" strip, so the context switch is visible in the UI.
 *
 * No React here: `subscribe`/`getSnapshot` are exactly what
 * `useSyncExternalStore` wants, and the module is safe to import during SSR
 * because every `window` read is guarded and `getServerSnapshot` is a constant.
 */

import {
  DEFAULT_ROUTE_ID,
  buildHash,
  getRoute,
  getRouteOrFallback,
  isWorkflowRouteId,
  type WorkflowRouteId,
} from './routeTable';

export type WorkflowLocation = {
  routeId: WorkflowRouteId;
  params: Record<string, string>;
};

export type RouteTransitionTrace = {
  from: WorkflowRouteId;
  to: WorkflowRouteId;
  /** Widget groups unmounted from the outlet by this transition. */
  cleared: readonly string[];
  /** Widget groups mounted in their place. */
  mounted: readonly string[];
  /** Set when a focus route took over the viewport, or when chrome came back. */
  chrome: 'kept' | 'cleared' | 'restored';
};

export type WorkflowSnapshot = {
  location: WorkflowLocation;
  /** Most recent transition first; empty until the user (or a deep link) moves. */
  trace: readonly RouteTransitionTrace[];
  /** In-app back stack, newest last. */
  stack: readonly WorkflowLocation[];
};

const MAX_TRACE = 6;
const MAX_STACK = 12;

const DEFAULT_LOCATION: WorkflowLocation = { routeId: DEFAULT_ROUTE_ID, params: {} };

/** Stable identity keeps `useSyncExternalStore` from re-rendering on every read. */
const INITIAL_SNAPSHOT: WorkflowSnapshot = {
  location: DEFAULT_LOCATION,
  trace: [],
  stack: [],
};

let snapshot: WorkflowSnapshot = INITIAL_SNAPSHOT;
const listeners = new Set<() => void>();
let hashListenerAttached = false;

/** `#/patient?id=pt-1` -> `{ routeId: 'patient', params: { id: 'pt-1' } }`. */
export function parseLocation(rawHash: string | null | undefined): WorkflowLocation {
  const cleaned = (rawHash ?? '').replace(/^#\/?/, '');
  const [pathPart, queryPart] = cleaned.split('?');
  const routeId = isWorkflowRouteId(pathPart) ? pathPart : DEFAULT_ROUTE_ID;
  return {
    routeId,
    params: Object.fromEntries(new URLSearchParams(queryPart ?? '')),
  };
}

/** Deterministic key for a location, used for outlet remounts and equality checks. */
export function serializeLocation(location: WorkflowLocation): string {
  return buildHash(location.routeId, location.params);
}

function locationsEqual(a: WorkflowLocation, b: WorkflowLocation): boolean {
  return serializeLocation(a) === serializeLocation(b);
}

function diffWidgets(from: WorkflowRouteId, to: WorkflowRouteId): RouteTransitionTrace {
  const mountedNames = getRoute(to)?.widgets ?? [];
  const clearedNames = (getRoute(from)?.widgets ?? []).filter(
    (widget) => !mountedNames.includes(widget),
  );
  const toMode = getRouteOrFallback(to).mode;
  const fromMode = getRouteOrFallback(from).mode;
  return {
    from,
    to,
    cleared: clearedNames,
    mounted: mountedNames,
    chrome:
      toMode === fromMode ? 'kept' : toMode === 'focus' ? 'cleared' : 'restored',
  };
}

function notify(): void {
  for (const listener of listeners) listener();
}

function commit(next: WorkflowLocation, options: { pushToStack?: boolean } = {}): void {
  const previous = snapshot.location;
  // The outlet already shows this exact location, so a commit would only churn.
  if (locationsEqual(previous, next)) return;

  snapshot = {
    location: next,
    trace: [diffWidgets(previous.routeId, next.routeId), ...snapshot.trace].slice(0, MAX_TRACE),
    stack:
      options.pushToStack === false
        ? snapshot.stack
        : [...snapshot.stack, previous].slice(-MAX_STACK),
  };
  notify();
}

function currentHash(): string {
  if (typeof window === 'undefined') return '';
  return window.location.hash;
}

function onHashChange(): void {
  const next = parseLocation(currentHash());
  commit(next, { pushToStack: true });

  // Repair links that point at an unknown or missing fragment so the address
  // bar always describes a route that actually mounted.
  const expected = serializeLocation(next);
  if (typeof window !== 'undefined' && window.location.hash !== expected) {
    window.history.replaceState(null, '', expected);
  }
}

function attachHashListener(): void {
  if (hashListenerAttached || typeof window === 'undefined') return;
  window.addEventListener('hashchange', onHashChange);
  hashListenerAttached = true;
  onHashChange();
}

function detachHashListenerWhenIdle(): void {
  if (listeners.size > 0 || typeof window === 'undefined') return;
  window.removeEventListener('hashchange', onHashChange);
  hashListenerAttached = false;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  attachHashListener();
  return () => {
    listeners.delete(listener);
    detachHashListenerWhenIdle();
  };
}

export function getSnapshot(): WorkflowSnapshot {
  return snapshot;
}

/** Server render always shows the default route; the real one arrives after mount. */
export function getServerSnapshot(): WorkflowSnapshot {
  return INITIAL_SNAPSHOT;
}

export function navigate(
  routeId: WorkflowRouteId,
  params: Record<string, string> = {},
): void {
  const nextHash = buildHash(routeId, params);
  if (typeof window === 'undefined') return;
  if (window.location.hash === nextHash) {
    commit(parseLocation(nextHash), { pushToStack: true });
    return;
  }
  // Writing the hash lets the browser record the entry and fires hashchange.
  window.location.hash = nextHash;
}

/** Pops the in-app stack; falls back to the parent module when there is nothing to pop. */
export function goBack(fallbackRouteId: WorkflowRouteId = DEFAULT_ROUTE_ID): void {
  const stack = snapshot.stack;
  const previous = stack.length > 0 ? stack[stack.length - 1] : null;
  const target = previous ?? { routeId: fallbackRouteId, params: {} };
  if (locationsEqual(snapshot.location, target)) return;

  snapshot = {
    ...snapshot,
    location: target,
    stack: previous ? stack.slice(0, -1) : stack,
  };
  notify();
  if (typeof window !== 'undefined') {
    window.history.replaceState(null, '', serializeLocation(target));
  }
}

export function canGoBack(): boolean {
  return snapshot.stack.length > 0;
}

export function getPatientIdFromLocation(location: WorkflowLocation): string | undefined {
  return location.params.id;
}
