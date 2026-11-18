'use client';

/**
 * WorkflowDashboard — shell that owns the outlet and the chrome.
 *
 * Layer: client / workflow-dashboard
 *
 * This is where the routing contract is enforced. Two things implement the
 * "clear the container, mount an isolated dashboard" behaviour from the spec:
 *
 *   1. `key={locationKey}` on the outlet wrapper. React tears down the previous
 *      subtree and builds a new one whenever the serialized location changes,
 *      which is the declarative equivalent of `container.replaceChildren(view)`
 *      in a hand-written router. No view has to clean up after another.
 *   2. `route.mode`. In `shell` mode the sidebar and topbar mount around the
 *      outlet; in `focus` mode neither is rendered at all — the tree literally
 *      cannot contain module chrome, so the patient dashboard gets the viewport
 *      with no layout bleed and no CSS overrides needed.
 *
 * The mobile drawer is unmounted in focus mode for the same reason: the only
 * way back out is the focus bar, which keeps the escape hatch visible instead of
 * hiding it behind a hamburger that no longer exists.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useWorkflowRouter } from './router/useWorkflowRouter';
import { getPatientIdFromLocation } from './router/workflowStore';
import type { WorkflowRouteId } from './router/routeTable';
import { getPatientRecord } from './data/mockWorkflowData';
import { WorkflowSidebarNav } from './components/WorkflowSidebar';
import { OutletTraceBar, UnmappedRoute, WorkflowFocusBar, WorkflowTopbar } from './components/WorkflowChrome';
import { OverviewView } from './views/OverviewView';
import { PatientsView } from './views/PatientsView';
import { AppointmentsView } from './views/AppointmentsView';
import { PatientFocusView } from './views/PatientFocusView';

export function WorkflowDashboard() {
  const { route, location, locationKey, trace, isFocusRoute, navigate, goBack } = useWorkflowRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const outletRef = useRef<HTMLElement>(null);
  /** First render must not steal focus from the address bar or a skip link. */
  const hasRoutedOnce = useRef(false);

  const record = useMemo(
    () => (route.id === 'patient' ? getPatientRecord(getPatientIdFromLocation(location)) : null),
    [route.id, location],
  );

  const handleNavigate = (routeId: WorkflowRouteId, params: Record<string, string> = {}) => {
    navigate(routeId, params);
    setDrawerOpen(false);
  };

  const focusOutlet = () => {
    outletRef.current?.focus({ preventScroll: true });
    outletRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };

  useEffect(() => {
    document.title =
      record !== null ? `${record.name} · Patient Dashboard` : `${route.headline} · Routing Dashboard`;

    if (!hasRoutedOnce.current) {
      hasRoutedOnce.current = true;
      return;
    }
    // After a route swap the old subtree is gone; move the reader into the new one.
    outletRef.current?.focus({ preventScroll: true });
  }, [locationKey, record, route.headline]);

  const outlet = (() => {
    switch (route.id) {
      case 'overview':
        return <OverviewView onNavigate={handleNavigate} />;
      case 'patients':
        return <PatientsView onNavigate={handleNavigate} />;
      case 'appointments':
        return <AppointmentsView onNavigate={handleNavigate} />;
      case 'patient':
        return <PatientFocusView record={record ?? getPatientRecord(undefined)} onNavigate={handleNavigate} />;
      default:
        return <UnmappedRoute routeId={route.id as WorkflowRouteId} />;
    }
  })();

  const announcement = `${route.headline} loaded${record ? ` for ${record.name}` : ''}`;

  return (
    <div
      data-theme='teal-light'
      className='relative flex min-h-dvh flex-col bg-background font-sans text-foreground antialiased selection:bg-primary/20 selection:text-foreground'
    >
      <button
        type='button'
        onClick={focusOutlet}
        className='sr-only rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50'
      >
        Skip to main content
      </button>

      {isFocusRoute ? (
        <>
          <WorkflowFocusBar
            route={route}
            currentHash={locationKey}
            trace={trace}
            onBack={goBack}
            onExit={() => navigate('overview')}
          />
          <main
            id='workflow-outlet'
            ref={outletRef}
            tabIndex={-1}
            aria-label={route.headline}
            className='mx-auto w-full max-w-[110rem] flex-1 px-4 py-5 outline-none sm:px-6 sm:py-6'
          >
            <div key={locationKey} className='animate-in fade-in duration-200'>
              {outlet}
            </div>
          </main>
        </>
      ) : (
        <div className='grid min-h-dvh grid-cols-1 lg:grid-cols-[17rem_minmax(0,1fr)]'>
          <aside className='sticky top-0 hidden h-dvh min-h-0 flex-col border-r border-border bg-muted/30 px-4 py-5 lg:flex'>
            <WorkflowSidebarNav
              activeRouteId={route.id}
              onSelect={(routeId) => handleNavigate(routeId)}
              currentHash={locationKey}
            />
          </aside>

          <div className='flex min-w-0 flex-col'>
            <WorkflowTopbar route={route} currentHash={locationKey} onOpenDrawer={() => setDrawerOpen(true)} />
            <OutletTraceBar trace={trace} />
            <main
              id='workflow-outlet'
              ref={outletRef}
              tabIndex={-1}
              aria-label={route.headline}
              className='mx-auto w-full max-w-7xl flex-1 px-4 py-5 outline-none sm:px-6 sm:py-6'
            >
              <div key={locationKey} className='animate-in fade-in duration-200'>
                {outlet}
              </div>
            </main>
          </div>
        </div>
      )}

      {/* Unmounted entirely in focus mode — see the header comment. */}
      {isFocusRoute ? null : (
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent side='left' className='w-[18rem] gap-0 overflow-y-auto px-4 py-5 sm:max-w-[18rem]'>
            <SheetHeader className='sr-only'>
              <SheetTitle>Module navigation</SheetTitle>
              <SheetDescription>Primary workflow routes for the routing dashboard.</SheetDescription>
            </SheetHeader>
            <WorkflowSidebarNav
              activeRouteId={route.id}
              onSelect={(routeId) => handleNavigate(routeId)}
              currentHash={locationKey}
            />
          </SheetContent>
        </Sheet>
      )}

      <p role='status' aria-live='polite' className='sr-only'>
        {announcement}
      </p>
    </div>
  );
}
