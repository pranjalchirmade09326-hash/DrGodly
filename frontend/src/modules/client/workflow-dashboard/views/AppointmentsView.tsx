'use client';

/**
 * AppointmentsView — week strip, status summary and the encounter ledger.
 *
 * Layer: client / workflow-dashboard / views
 *
 * Another general surface: it exists so the router has something other than the
 * overview to clear out of the outlet, and so the patient focus route is
 * reachable from a workflow button rather than only from the directory.
 *
 * The ledger is rendered twice — a real `<table>` from `md` up and a stacked
 * card list below it — because a five-column clinical table is unreadable at
 * 360px and squashing it into one row is worse than switching shape.
 */

import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  FlaskConical,
  Phone,
  Stethoscope,
  Video,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { APPOINTMENT_LEDGER, type AppointmentRow } from '../data/mockWorkflowData';
import { SectionCard } from '../components/WorkflowPrimitives';
import type { WorkflowRouteId } from '../router/routeTable';

type StatusFilter = 'all' | AppointmentRow['status'];

const CHANNEL_ICON: Record<AppointmentRow['channel'], React.ComponentType<{ className?: string }>> = {
  Video,
  Phone,
  'In person': Stethoscope,
  Lab: FlaskConical,
};

const STATUS_META: Record<AppointmentRow['status'], { label: string; className: string }> = {
  confirmed: { label: 'Confirmed', className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700' },
  awaiting: { label: 'Awaiting check-in', className: 'border-amber-500/35 bg-amber-500/10 text-amber-700' },
  completed: { label: 'Completed', className: 'border-border bg-muted/60 text-muted-foreground' },
  cancelled: { label: 'Cancelled', className: 'border-destructive/35 bg-destructive/10 text-destructive' },
};

const FILTERS: readonly StatusFilter[] = ['all', 'confirmed', 'awaiting', 'completed', 'cancelled'];

/** Mock week grid; counts are illustrative rather than derived from the ledger. */
const WEEK_STRIP = [
  { day: 'Sun', date: '01', booked: 31, label: 'Past' },
  { day: 'Mon', date: '02', booked: 40, label: 'Past' },
  { day: 'Tue', date: '03', booked: 46, label: 'Today' },
  { day: 'Wed', date: '04', booked: 44, label: 'Tomorrow' },
  { day: 'Thu', date: '05', booked: 29, label: 'Open' },
  { day: 'Fri', date: '06', booked: 35, label: 'Open' },
  { day: 'Sat', date: '07', booked: 8, label: 'Weekend clinic' },
] as const;

const STRIP_TONE: Record<string, string> = {
  Past: 'border-border bg-muted/40 text-muted-foreground',
  Today: 'border-primary bg-primary/10 text-primary',
  Tomorrow: 'border-primary/35 bg-primary/5 text-primary',
  Open: 'border-border bg-card text-card-foreground',
  'Weekend clinic': 'border-border bg-card text-muted-foreground',
};

function countByStatus(status: AppointmentRow['status']): number {
  return APPOINTMENT_LEDGER.filter((row) => row.status === status).length;
}

function ChannelBadge({ channel }: { channel: AppointmentRow['channel'] }) {
  const Icon = CHANNEL_ICON[channel];
  return (
    <span className='inline-flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground'>
      <Icon className='size-3.5 shrink-0 text-primary' />
      {channel}
    </span>
  );
}

function StatusBadge({ status }: { status: AppointmentRow['status'] }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[11px] font-bold ${STATUS_META[status].className}`}
    >
      {STATUS_META[status].label}
    </span>
  );
}

export function AppointmentsView({
  onNavigate,
}: {
  onNavigate: (routeId: WorkflowRouteId, params?: Record<string, string>) => void;
}) {
  const [filter, setFilter] = useState<StatusFilter>('all');

  const rows = useMemo(
    () => (filter === 'all' ? APPOINTMENT_LEDGER : APPOINTMENT_LEDGER.filter((row) => row.status === filter)),
    [filter],
  );

  return (
    <div className='space-y-6'>
      <section aria-labelledby='appointments-filters-heading' className='space-y-3'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <h2 id='appointments-filters-heading' className='text-sm font-extrabold tracking-tight text-foreground'>
            Bookings by status
          </h2>
          <p className='text-xs text-muted-foreground'>
            {rows.length} of {APPOINTMENT_LEDGER.length} encounters shown
          </p>
        </div>

        <div className='flex flex-wrap gap-2'>
          {FILTERS.map((option) => {
            const isActive = option === filter;
            const count =
              option === 'all'
                ? APPOINTMENT_LEDGER.length
                : countByStatus(option as AppointmentRow['status']);
            return (
              <Button
                key={option}
                type='button'
                variant={isActive ? 'default' : 'outline'}
                size='sm'
                aria-pressed={isActive}
                onClick={() => setFilter(option)}
                className='h-9 rounded-xl text-[11px] font-bold'
              >
                {option === 'all' ? 'All' : STATUS_META[option as AppointmentRow['status']].label}
                <span className={isActive ? 'ml-1.5 opacity-80' : 'ml-1.5 text-muted-foreground'}>{count}</span>
              </Button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby='appointments-week-heading' className='space-y-3'>
        <h2 id='appointments-week-heading' className='text-sm font-extrabold tracking-tight text-foreground'>
          Week strip
        </h2>
        <ul
          role='list'
          aria-label='Booked encounters per day, scrollable on small screens'
          tabIndex={0}
          className='flex snap-x gap-3 overflow-x-auto pb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        >
          {WEEK_STRIP.map((column) => (
            <li
              key={column.date}
              className={`flex min-w-[7rem] shrink-0 snap-start flex-col rounded-2xl border px-3 py-2.5 transition-colors duration-200 ${STRIP_TONE[column.label]}`}
            >
              <span className='text-[11px] font-bold uppercase tracking-wider'>{column.day}</span>
              <span className='text-lg font-black tabular-nums leading-tight text-foreground'>{column.date}</span>
              <span className='mt-1 text-[11px] font-semibold'>{column.label}</span>
              <span className='mt-1 font-mono text-[11px] text-muted-foreground'>{column.booked} booked</span>
            </li>
          ))}
        </ul>
      </section>

      <SectionCard
        title='Encounter ledger'
        subtitle='Every channel the clinic runs, newest first'
        icon={CalendarDays}
        aside={
          <Button
            variant='outline'
            size='sm'
            onClick={() => onNavigate('patient', { id: 'pt-louise' })}
            className='h-9 rounded-xl text-[11px] font-bold'
          >
            Open patient dashboard
            <ArrowRight className='ml-1.5 size-3.5' />
          </Button>
        }
        contentClassName='p-0 sm:p-0'
      >
        {rows.length === 0 ? (
          <p className='px-4 py-8 text-center text-xs text-muted-foreground'>
            No encounters with this status today.
          </p>
        ) : (
          <>
            <div className='hidden md:block'>
              <Table>
                <TableHeader>
                  <TableRow className='hover:bg-transparent'>
                    <TableHead className='pl-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground sm:pl-5'>
                      Patient
                    </TableHead>
                    <TableHead className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>
                      When
                    </TableHead>
                    <TableHead className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>
                      Channel
                    </TableHead>
                    <TableHead className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>
                      Service
                    </TableHead>
                    <TableHead className='pr-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground sm:pr-5'>
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id} className='border-border/70'>
                      <TableCell className='py-3 pl-4 sm:pl-5'>
                        <button
                          type='button'
                          onClick={() => onNavigate('patient', { id: 'pt-louise' })}
                          aria-label={`Open the patient dashboard for ${row.patient}`}
                          className='rounded-lg text-left text-xs font-bold text-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                        >
                          {row.patient}
                        </button>
                        <p className='mt-0.5 text-[11px] text-muted-foreground'>{row.clinician}</p>
                      </TableCell>
                      <TableCell className='py-3 font-mono text-[11px] font-semibold text-muted-foreground'>
                        {row.when}
                      </TableCell>
                      <TableCell className='py-3'>
                        <ChannelBadge channel={row.channel} />
                      </TableCell>
                      <TableCell className='py-3 text-[11px] text-card-foreground'>{row.serviceType}</TableCell>
                      <TableCell className='py-3 pr-4 sm:pr-5'>
                        <StatusBadge status={row.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <ul className='divide-y divide-border/70 md:hidden'>
              {rows.map((row) => (
                <li key={row.id} className='space-y-2 px-4 py-3.5'>
                  <div className='flex items-start justify-between gap-3'>
                    <div className='min-w-0'>
                      <p className='truncate text-xs font-black text-foreground'>{row.patient}</p>
                      <p className='truncate text-[11px] text-muted-foreground'>{row.clinician}</p>
                    </div>
                    <StatusBadge status={row.status} />
                  </div>
                  <div className='flex flex-wrap items-center gap-x-3 gap-y-1.5'>
                    <span className='font-mono text-[11px] font-semibold text-muted-foreground'>{row.when}</span>
                    <ChannelBadge channel={row.channel} />
                  </div>
                  <p className='text-[11px] leading-relaxed text-card-foreground'>{row.serviceType}</p>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => onNavigate('patient', { id: 'pt-louise' })}
                    className='h-8 rounded-lg px-2 text-[11px] font-bold text-primary hover:bg-primary/10'
                  >
                    Patient dashboard
                    <ArrowRight className='ml-1.5 size-3.5' />
                  </Button>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className='flex flex-wrap items-center justify-between gap-3 border-t border-border/70 px-4 py-3 sm:px-5'>
          <p className='text-[11px] text-muted-foreground'>
            Every row points at the same focus route: <span className='font-mono font-semibold'>#/patient?id=…</span>
          </p>
          <Badge
            variant='outline'
            className='border-primary/25 bg-primary/5 text-[11px] font-bold text-primary'
          >
            Mock ledger
          </Badge>
        </div>
      </SectionCard>
    </div>
  );
}
