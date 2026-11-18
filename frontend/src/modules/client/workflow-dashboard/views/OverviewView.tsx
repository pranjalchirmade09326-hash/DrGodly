'use client';

/**
 * OverviewView — the general clinic dashboard the router clears away.
 *
 * Layer: client / workflow-dashboard / views
 *
 * This is the "everything else" surface: cross-clinic KPIs, today's ledger, the
 * care-gap queue and an activity ribbon. Its job in the demo is to be visibly
 * displaced — when the patient workflow route mounts, every widget here is
 * unmounted, and the router trace names them.
 */

import React from 'react';
import {
  Activity,
  ArrowRight,
  CalendarClock,
  ClipboardList,
  ShieldAlert,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ACTIVITY_RIBBON,
  APPOINTMENT_LEDGER,
  CARE_GAP_QUEUE,
  OVERVIEW_METRICS,
  type CareGapRow,
} from '../data/mockWorkflowData';
import { MetricTile, SectionCard, StatusPill } from '../components/WorkflowPrimitives';
import { RouteIcon } from '../components/WorkflowSidebar';
import { SIDEBAR_ROUTES, type WorkflowRouteId } from '../router/routeTable';

const GAP_SEVERITY: Record<CareGapRow['severity'], { label: string; className: string }> = {
  critical: { label: 'Escalate', className: 'border-destructive/35 bg-destructive/10 text-destructive' },
  warning: { label: 'Review', className: 'border-amber-500/35 bg-amber-500/10 text-amber-700' },
  info: { label: 'Monitor', className: 'border-border bg-muted/60 text-muted-foreground' },
};

export function OverviewView({ onNavigate }: { onNavigate: (routeId: WorkflowRouteId, params?: Record<string, string>) => void }) {
  const todaysLedger = APPOINTMENT_LEDGER.filter((row) => row.when.startsWith('Today'));

  return (
    <div className='space-y-6'>
      {/* KPI row */}
      <section aria-labelledby='overview-metrics-heading' className='space-y-3'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <h2 id='overview-metrics-heading' className='text-sm font-extrabold tracking-tight text-foreground'>
            Clinic pulse
          </h2>
          <p className='text-xs text-muted-foreground'>Mock data · refreshed 08:45</p>
        </div>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {OVERVIEW_METRICS.map((metric) => (
            <MetricTile
              key={metric.id}
              label={metric.label}
              value={metric.value}
              delta={metric.delta}
              deltaTone={metric.deltaTone}
              hint={metric.hint}
              series={metric.series}
            />
          ))}
        </div>
      </section>

      {/* Workflow entry point, so the focus route is reachable from the landing view. */}
      <section
        aria-labelledby='overview-workflow-heading'
        className='rounded-3xl border border-primary/25 bg-primary/5 p-4 sm:p-5'
      >
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='min-w-0'>
            <h2 id='overview-workflow-heading' className='text-sm font-extrabold tracking-tight text-foreground'>
              Workflow routes
            </h2>
            <p className='mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground'>
              Opening a patient record switches the route to <span className='font-mono font-bold text-foreground'>#/patient</span>,
              unmounts this sidebar and every widget on this page, and gives the patient dashboard the whole viewport.
            </p>
          </div>
          <div className='flex flex-wrap items-center gap-2.5'>
            {SIDEBAR_ROUTES.filter((route) => route.mode === 'focus').map((route) => (
              <Button
                key={route.id}
                onClick={() => onNavigate(route.id, { id: 'pt-louise' })}
                className='h-10 shrink-0 rounded-xl px-4 text-xs font-bold'
              >
                <RouteIcon iconKey={route.iconKey} className='mr-2 size-4' />
                Open patient dashboard
                <ArrowRight className='ml-2 size-4' />
              </Button>
            ))}
            <Button
              variant='outline'
              onClick={() => onNavigate('patients')}
              className='h-10 shrink-0 rounded-xl text-xs font-bold'
            >
              <Users className='mr-2 size-4' />
              Browse panel
            </Button>
          </div>
        </div>
      </section>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
        <SectionCard
          className='lg:col-span-7'
          title='Today’s schedule'
          subtitle='Encounters booked across every channel'
          icon={CalendarClock}
          aside={
            <Badge variant='outline' className='border-primary/25 bg-primary/5 text-[11px] font-bold text-primary'>
              {todaysLedger.length} visits
            </Badge>
          }
          contentClassName='p-0 sm:p-0'
        >
          <ul className='divide-y divide-border/70'>
            {todaysLedger.map((row) => (
              <li key={row.id} className='flex flex-wrap items-center gap-3 px-4 py-3 sm:px-5'>
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-xs font-bold text-foreground'>{row.patient}</p>
                  <p className='truncate text-[11px] text-muted-foreground'>
                    {row.serviceType} · {row.clinician}
                  </p>
                </div>
                <span className='shrink-0 font-mono text-[11px] font-semibold text-muted-foreground'>
                  {row.when.replace('Today · ', '')}
                </span>
                <span className='shrink-0 rounded-full border border-border bg-muted/60 px-2 py-0.5 text-[11px] font-bold text-muted-foreground'>
                  {row.channel}
                </span>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => onNavigate('patient', { id: 'pt-louise' })}
                  className='shrink-0 rounded-lg text-[11px] font-bold text-primary hover:bg-primary/10'
                >
                  Record
                  <ArrowRight className='ml-1 size-3.5' />
                </Button>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          className='lg:col-span-5'
          title='Care gaps needing review'
          subtitle='Registry rules that fired and stay open'
          icon={ShieldAlert}
          contentClassName='p-0 sm:p-0'
        >
          <ul className='divide-y divide-border/70'>
            {CARE_GAP_QUEUE.map((gap) => {
              const severity = GAP_SEVERITY[gap.severity];
              return (
                <li key={gap.id} className='flex flex-wrap items-start gap-2.5 px-4 py-3 sm:px-5'>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-xs font-bold text-foreground'>{gap.patient}</p>
                    <p className='text-[11px] leading-relaxed text-muted-foreground'>{gap.gap}</p>
                    <p className='mt-1 text-[11px] font-semibold text-muted-foreground'>
                      Open {gap.overdueBy.toLowerCase()}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-bold ${severity.className}`}
                  >
                    {severity.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      </div>

      <section aria-labelledby='overview-activity-heading' className='rounded-3xl border border-border bg-card p-4 sm:p-5'>
        <div className='flex items-center gap-2.5'>
          <Activity className='size-5 shrink-0 text-primary' />
          <h2 id='overview-activity-heading' className='text-sm font-extrabold tracking-tight text-foreground'>
            Automated activity today
          </h2>
          <StatusPill status='normal' className='ml-auto' />
        </div>
        <ul className='mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4'>
          {ACTIVITY_RIBBON.map((line) => (
            <li
              key={line}
              className='flex items-start gap-2 rounded-2xl bg-muted/50 p-3 text-[11px] font-semibold leading-relaxed text-card-foreground ring-1 ring-border/60'
            >
              <ClipboardList className='mt-0.5 size-3.5 shrink-0 text-primary' />
              <span className='min-w-0'>{line}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
