'use client';

/**
 * RecordsTimeline — scannable history for the patient focus route.
 *
 * Layer: client / workflow-dashboard / components / patient
 *
 * A single ordered list of the record's events with a kind filter on top. The
 * rail is a plain border with a marker per item, so the timeline reflows on
 * narrow screens without any positioning tricks or custom CSS.
 */

import React, { useMemo, useState } from 'react';
import {
  CalendarCheck,
  FlaskConical,
  Pill,
  ScanLine,
  Search,
  Stethoscope,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { RecordKind, TimelineEntry } from '../../data/mockWorkflowData';
import { SectionCard } from '../WorkflowPrimitives';

type FilterOption = 'all' | RecordKind;

const KIND_META: Record<
  RecordKind,
  { label: string; icon: React.ComponentType<{ className?: string }>; marker: string }
> = {
  visit: { label: 'Visit', icon: Stethoscope, marker: 'bg-primary text-primary-foreground' },
  diagnosis: { label: 'Diagnosis', icon: Search, marker: 'bg-amber-500/20 text-amber-700 ring-1 ring-amber-500/40' },
  prescription: { label: 'Prescription', icon: Pill, marker: 'bg-emerald-500/20 text-emerald-700 ring-1 ring-emerald-500/40' },
  lab: { label: 'Lab', icon: FlaskConical, marker: 'bg-sky-500/20 text-sky-700 ring-1 ring-sky-500/40' },
  imaging: { label: 'Imaging', icon: ScanLine, marker: 'bg-muted text-muted-foreground ring-1 ring-border' },
};

const FILTER_ORDER: readonly FilterOption[] = [
  'all',
  'visit',
  'diagnosis',
  'prescription',
  'lab',
  'imaging',
];

function TimelineRow({ entry }: { entry: TimelineEntry }) {
  const meta = KIND_META[entry.kind];
  const Icon = meta.icon;

  return (
    <li className='relative pl-10'>
      <span
        aria-hidden='true'
        className={`absolute left-0 top-0 grid size-7 place-items-center rounded-full ${meta.marker}`}
      >
        <Icon className='size-3.5' />
      </span>
      <div className='rounded-2xl border border-border/70 bg-muted/30 p-3 transition-colors duration-200 hover:bg-muted/50'>
        <div className='flex flex-wrap items-center gap-2'>
          <p className='text-xs font-black tracking-tight text-foreground'>{entry.title}</p>
          <span className='shrink-0 rounded-full border border-border bg-card px-2 py-0.5 text-[11px] font-bold text-muted-foreground'>
            {meta.label}
          </span>
          <span className='ml-auto shrink-0 font-mono text-[11px] font-semibold text-muted-foreground'>
            {entry.date}
          </span>
        </div>
        <p className='mt-1.5 text-[11px] leading-relaxed text-card-foreground'>{entry.detail}</p>
        <p className='mt-1.5 text-[11px] font-semibold text-muted-foreground'>{entry.clinician}</p>
        {entry.tags.length > 0 ? (
          <ul className='mt-2 flex flex-wrap gap-1.5'>
            {entry.tags.map((tag) => (
              <li
                key={tag}
                className='rounded-full bg-card px-2 py-0.5 text-[11px] font-semibold text-muted-foreground ring-1 ring-border/70'
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  );
}

export function RecordsTimeline({ timeline }: { timeline: readonly TimelineEntry[] }) {
  const [filter, setFilter] = useState<FilterOption>('all');

  const entries = useMemo(
    () => (filter === 'all' ? timeline : timeline.filter((entry) => entry.kind === filter)),
    [filter, timeline],
  );

  return (
    <SectionCard
      title='Medical records'
      subtitle={`${entries.length} of ${timeline.length} entries · newest first`}
      icon={CalendarCheck}
      aside={
        <div className='flex flex-wrap gap-1.5' role='group' aria-label='Filter records by type'>
          {FILTER_ORDER.map((option) => {
            const isActive = option === filter;
            return (
              <Button
                key={option}
                type='button'
                variant={isActive ? 'default' : 'outline'}
                size='xs'
                aria-pressed={isActive}
                onClick={() => setFilter(option)}
                className='rounded-lg text-[11px] font-bold'
              >
                {option === 'all' ? 'All' : KIND_META[option as RecordKind].label}
              </Button>
            );
          })}
        </div>
      }
    >
      {entries.length === 0 ? (
        <p className='py-6 text-center text-xs text-muted-foreground'>
          No entries of this type on the record.
        </p>
      ) : (
        <ol className='space-y-3 border-l border-border pl-0'>
          {entries.map((entry) => (
            <TimelineRow key={entry.id} entry={entry} />
          ))}
        </ol>
      )}
    </SectionCard>
  );
}
