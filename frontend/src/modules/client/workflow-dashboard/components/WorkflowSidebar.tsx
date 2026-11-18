'use client';

/**
 * WorkflowSidebar — primary module navigation for the routing dashboard.
 *
 * Layer: client / workflow-dashboard / components
 *
 * The sidebar never owns routing state. It receives the active route id and a
 * `onSelect` handler, so the same markup serves the fixed desktop rail and the
 * mobile drawer without duplicating keyboard or ARIA behaviour.
 *
 * Selection semantics are the whole point of this screen: a click calls
 * `navigate()`, which writes the hash, and the outlet drops every widget that
 * does not belong to the new route. Active state is therefore always a
 * consequence of the URL rather than a parallel piece of component state.
 */

import React from 'react';
import { CalendarDays, LayoutDashboard, User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DrGodlyLogo } from '@/components/shared/DrGodlyLogo';
import { SIDEBAR_ROUTES, type WorkflowIconKey, type WorkflowRouteId } from '../router/routeTable';
import { DEMO_IDENTITY } from '../data/mockWorkflowData';

const ROUTE_ICONS: Record<WorkflowIconKey, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  users: Users,
  patient: User,
  calendar: CalendarDays,
};

export function RouteIcon({
  iconKey,
  className,
}: {
  iconKey: WorkflowIconKey;
  className?: string;
}) {
  const Icon = ROUTE_ICONS[iconKey];
  return <Icon className={className} />;
}

export function WorkflowSidebarNav({
  activeRouteId,
  onSelect,
  currentHash,
}: {
  activeRouteId: WorkflowRouteId;
  onSelect: (routeId: WorkflowRouteId) => void;
  /** Read-back of the URL fragment, so the router's effect is visible. */
  currentHash: string;
}) {
  return (
    <div className='flex min-h-0 flex-1 flex-col gap-6'>
      <div className='px-1'>
        <DrGodlyLogo size='sm' tagline='Routing Dashboard' className='focus-visible:outline-none' />
      </div>

      <nav aria-label='Primary modules' className='min-w-0'>
        <p className='px-2 pb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground'>
          Modules
        </p>
        <ul className='space-y-1'>
          {SIDEBAR_ROUTES.map((route) => {
            const isActive = route.id === activeRouteId;
            return (
              <li key={route.id}>
                <button
                  type='button'
                  onClick={() => onSelect(route.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2.5 text-left text-sm font-bold transition-colors duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <RouteIcon
                    iconKey={route.iconKey}
                    className={cn('mt-0.5 size-4 shrink-0', isActive ? 'opacity-100' : 'opacity-70')}
                  />
                  <span className='min-w-0 flex-1'>
                    <span className='flex items-center gap-2'>
                      <span className='truncate'>{route.label}</span>
                      {route.mode === 'focus' ? (
                        <span
                          className={cn(
                            'shrink-0 rounded-full px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide',
                            isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground',
                          )}
                        >
                          Focus
                        </span>
                      ) : null}
                    </span>
                    <span
                      className={cn(
                        'mt-0.5 block truncate text-[11px] font-medium leading-relaxed',
                        isActive ? 'text-primary-foreground/80' : 'text-muted-foreground',
                      )}
                    >
                      {route.description}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Router read-back: what the URL says right now. */}
      <div className='mt-auto rounded-2xl border border-border bg-muted/50 p-3'>
        <p className='text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground'>
          Active route
        </p>
        <p className='mt-1.5 truncate font-mono text-[11px] font-semibold text-foreground' title={currentHash}>
          {currentHash}
        </p>
        <p className='mt-2 text-[11px] leading-relaxed text-muted-foreground'>
          Selecting <span className='font-bold text-foreground'>Patient</span> unmounts this sidebar and
          every overview widget, then mounts the isolated patient record.
        </p>
      </div>

      <div className='flex items-center gap-2.5 border-t border-border/70 pt-4'>
        <div className='grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-black text-primary ring-1 ring-primary/25'>
          {DEMO_IDENTITY.initials}
        </div>
        <div className='min-w-0'>
          <p className='truncate text-xs font-bold text-foreground'>{DEMO_IDENTITY.name}</p>
          <p className='truncate text-[11px] text-muted-foreground'>
            {DEMO_IDENTITY.role} · {DEMO_IDENTITY.npi}
          </p>
        </div>
      </div>
    </div>
  );
}
