'use client';

/**
 * WorkflowChrome — the surrounding interface for each route mode.
 *
 * Layer: client / workflow-dashboard / components
 *
 * Two shapes, chosen by the route table:
 *   • `WorkflowTopbar` + `OutletTraceBar` wrap the outlet in shell mode.
 *   • `WorkflowFocusBar` replaces both in focus mode; the sidebar is not
 *     rendered at all, so the patient record is the only thing on screen.
 *
 * The trace bar is the observable proof of the context switch: it prints the
 * widget groups the router cleared and the ones it mounted for the active
 * route, taken straight from the store's transition record.
 */

import { ArrowLeft, Menu, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { RouteTransitionTrace } from '../router/workflowStore';
import type { WorkflowRouteDefinition, WorkflowRouteId } from '../router/routeTable';
import { getRoute } from '../router/routeTable';

// ── Shell top bar ────────────────────────────────────────────────────────────

export function WorkflowTopbar({
  route,
  currentHash,
  onOpenDrawer,
}: {
  route: WorkflowRouteDefinition;
  currentHash: string;
  onOpenDrawer: () => void;
}) {
  return (
    <header className='sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-md'>
      <div className='flex items-center gap-3 px-4 py-3 sm:px-6'>
        <Button
          variant='outline'
          size='icon'
          onClick={onOpenDrawer}
          aria-label='Open module navigation'
          className='shrink-0 rounded-xl lg:hidden'
        >
          <Menu className='size-4' />
        </Button>

        <div className='min-w-0 flex-1'>
          <h1 className='truncate text-base font-black tracking-tight text-foreground sm:text-lg'>
            {route.headline}
          </h1>
          <p className='truncate text-xs text-muted-foreground'>{route.description}</p>
        </div>

        <span className='hidden shrink-0 items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-1 font-mono text-[11px] font-semibold text-muted-foreground sm:inline-flex'>
          {currentHash}
        </span>
      </div>
    </header>
  );
}

// ── Outlet trace strip ───────────────────────────────────────────────────────

function TraceLine({ entry, className }: { entry: RouteTransitionTrace; className?: string }) {
  const from = getRoute(entry.from);
  const to = getRoute(entry.to);

  return (
    <p className={cn('text-[11px] leading-relaxed text-muted-foreground', className)}>
      <span className='font-bold text-foreground'>
        {from?.label ?? entry.from} → {to?.label ?? entry.to}
      </span>
      <span aria-hidden='true'> · </span>
      {entry.chrome === 'cleared' ? (
        <span className='font-bold text-destructive'>chrome unmounted</span>
      ) : entry.chrome === 'restored' ? (
        <span className='font-bold text-primary'>chrome restored</span>
      ) : (
        <span>chrome kept</span>
      )}
      <span aria-hidden='true'> · </span>
      <span className='font-semibold'>Outlet cleared:</span>{' '}
      {entry.cleared.length > 0 ? entry.cleared.join(', ') : 'nothing'}
      <span aria-hidden='true'> · </span>
      <span className='font-semibold'>Mounted:</span>{' '}
      {entry.mounted.length > 0 ? entry.mounted.join(', ') : 'nothing'}
    </p>
  );
}

export function OutletTraceBar({ trace }: { trace: readonly RouteTransitionTrace[] }) {
  const latest = trace[0];
  if (!latest) return null;

  return (
    <div className='border-b border-border/70 bg-muted/40 px-4 py-2 sm:px-6'>
      <div className='mx-auto flex max-w-7xl items-start gap-2.5'>
        <Sparkles className='mt-0.5 size-3.5 shrink-0 text-primary' aria-hidden='true' />
        <div className='min-w-0'>
          <p className='text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground'>
            Router trace
          </p>
          <TraceLine entry={latest} className='mt-0.5' />
        </div>
      </div>
    </div>
  );
}

// ── Focus mode bar ───────────────────────────────────────────────────────────

export function WorkflowFocusBar({
  route,
  currentHash,
  trace,
  onBack,
  onExit,
}: {
  route: WorkflowRouteDefinition;
  currentHash: string;
  trace: readonly RouteTransitionTrace[];
  onBack: () => void;
  onExit: () => void;
}) {
  const latest = trace[0];

  return (
    <header className='sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md'>
      <div className='flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6'>
        <Button
          variant='outline'
          size='icon'
          onClick={onBack}
          aria-label='Back to the previous route'
          className='shrink-0 rounded-xl'
        >
          <ArrowLeft className='size-4' />
        </Button>

        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-2'>
            <h1 className='truncate text-base font-black tracking-tight text-foreground'>{route.headline}</h1>
            <span className='shrink-0 rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary'>
              Focus mode
            </span>
          </div>
          <p className='truncate text-xs text-muted-foreground'>
            Sidebar and all non-patient widgets are unmounted while this route is active.
          </p>
        </div>

        <span className='hidden shrink-0 items-center rounded-full border border-border bg-muted/60 px-2.5 py-1 font-mono text-[11px] font-semibold text-muted-foreground md:inline-flex'>
          {currentHash}
        </span>

        <Button
          variant='ghost'
          onClick={onExit}
          className='shrink-0 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground'
        >
          <X className='mr-1.5 size-4' />
          Exit to dashboard
        </Button>
      </div>

      {latest ? (
        <div className='border-t border-border/70 bg-muted/40 px-4 py-2 sm:px-6'>
          <div className='mx-auto max-w-[110rem]'>
            <TraceLine entry={latest} />
          </div>
        </div>
      ) : null}
    </header>
  );
}

// ── Outlet placeholder guard ─────────────────────────────────────────────────

/** Only reachable if a route id appears in the table without a view mapping. */
export function UnmappedRoute({ routeId }: { routeId: WorkflowRouteId }) {
  return (
    <div className='mx-auto max-w-md rounded-3xl border border-dashed border-border bg-card p-8 text-center'>
      <p className='text-sm font-bold text-foreground'>No view is mounted for {routeId}</p>
      <p className='mt-1.5 text-xs text-muted-foreground'>
        Every route in the table needs an entry in the outlet map.
      </p>
    </div>
  );
}
