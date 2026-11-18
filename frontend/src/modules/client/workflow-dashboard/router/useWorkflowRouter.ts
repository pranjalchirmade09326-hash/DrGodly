'use client';

/**
 * useWorkflowRouter — React binding for the workflow store.
 *
 * Layer: client / workflow-dashboard / router
 *
 * `useSyncExternalStore` is the right primitive here rather than a context +
 * `useState` pair: the router is external state (the browser owns the hash and
 * fires events we do not control), the snapshot is already immutable and
 * referentially stable, and the hook needs a distinct server snapshot so the
 * first paint never reads `window`.
 *
 * The listener itself is attached inside the store the first time a component
 * subscribes and detached when the last one unsubscribes, so mounting the
 * dashboard twice cannot double-commit a transition.
 */

import { useCallback, useSyncExternalStore } from 'react';
import { getRouteOrFallback, type WorkflowRouteDefinition, type WorkflowRouteId } from './routeTable';
import {
  canGoBack,
  getServerSnapshot,
  getSnapshot,
  goBack,
  navigate,
  serializeLocation,
  subscribe,
  type RouteTransitionTrace,
  type WorkflowLocation,
} from './workflowStore';

export type WorkflowRouter = {
  route: WorkflowRouteDefinition;
  location: WorkflowLocation;
  /** Stable per-location string; used as the outlet React key. */
  locationKey: string;
  trace: readonly RouteTransitionTrace[];
  /** True when the active route owns the whole viewport and chrome is unmounted. */
  isFocusRoute: boolean;
  navigate: (routeId: WorkflowRouteId, params?: Record<string, string>) => void;
  goBack: () => void;
  canGoBack: boolean;
};

export function useWorkflowRouter(): WorkflowRouter {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const route = getRouteOrFallback(snapshot.location.routeId);
  const locationKey = serializeLocation(snapshot.location);
  const isFocusRoute = route.mode === 'focus';

  const handleGoBack = useCallback(() => {
    goBack();
  }, []);

  return {
    route,
    location: snapshot.location,
    locationKey,
    trace: snapshot.trace,
    isFocusRoute,
    navigate,
    goBack: handleGoBack,
    canGoBack: canGoBack(),
  };
}
