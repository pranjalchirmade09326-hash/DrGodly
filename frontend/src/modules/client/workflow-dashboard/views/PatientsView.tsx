'use client';

/**
 * PatientsView — panel directory and the main entry into the patient workflow.
 *
 * Layer: client / workflow-dashboard / views
 *
 * Rows navigate rather than expand: selecting a patient writes
 * `#/patient?id=…`, which is what makes the deep link shareable and lets the
 * focus route resolve the right record from the URL alone.
 */

import React, { useMemo, useState } from 'react';
import { ArrowRight, Search, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PATIENT_DIRECTORY, type PatientRecord } from '../data/mockWorkflowData';
import { PatientAvatar, SectionCard } from '../components/WorkflowPrimitives';
import type { WorkflowRouteId } from '../router/routeTable';

const RISK_CLASSES: Record<PatientRecord['risk'], string> = {
  Routine: 'border-border bg-muted/60 text-muted-foreground',
  Accelerated: 'border-amber-500/35 bg-amber-500/10 text-amber-700',
  'High complexity': 'border-destructive/35 bg-destructive/10 text-destructive',
};

function summariseVitals(record: PatientRecord): string {
  const [hr, bp] = record.vitals;
  return `${hr.value} bpm · ${bp.value} ${bp.unit}`;
}

export function PatientsView({
  onNavigate,
}: {
  onNavigate: (routeId: WorkflowRouteId, params?: Record<string, string>) => void;
}) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle.length === 0) return PATIENT_DIRECTORY;
    return PATIENT_DIRECTORY.filter((record) =>
      [record.name, record.mrn, record.primaryClinician, record.risk]
        .join(' ')
        .toLowerCase()
        .includes(needle),
    );
  }, [query]);

  return (
    <SectionCard
      title='Patient panel'
      subtitle={`${results.length} of ${PATIENT_DIRECTORY.length} patients match`}
      icon={Users}
      aside={
        <div className='flex w-full items-end gap-2 sm:w-auto'>
          <div className='w-full sm:w-56'>
            <Label htmlFor='patient-search' className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>
              Filter
            </Label>
            <div className='relative mt-1'>
              <Search className='pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                id='patient-search'
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder='Name, MRN or clinician'
                className='h-9 rounded-xl pl-9 text-xs'
              />
            </div>
          </div>
        </div>
      }
      contentClassName='p-0 sm:p-0'
    >
      {results.length === 0 ? (
        <p className='px-4 py-8 text-center text-xs text-muted-foreground sm:px-5'>
          No patient matches “{query}”. Clear the filter to see the full panel.
        </p>
      ) : (
        <ul className='divide-y divide-border/70'>
          {results.map((record) => (
            <li key={record.id}>
              <button
                type='button'
                onClick={() => onNavigate('patient', { id: record.id })}
                aria-label={`Open patient dashboard for ${record.name}, medical record number ${record.mrn}`}
                className='flex w-full flex-wrap items-center gap-3 px-4 py-3.5 text-left transition-colors duration-200 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:px-5'
              >
                <PatientAvatar initials={record.initials} name={record.name} size='md' />

                <div className='min-w-0 flex-1'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <p className='truncate text-xs font-black text-foreground'>{record.name}</p>
                    <span className='text-[11px] font-semibold text-muted-foreground'>
                      {record.age} yrs · {record.sex}
                    </span>
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-bold ${RISK_CLASSES[record.risk]}`}
                    >
                      {record.risk}
                    </span>
                  </div>
                  <p className='mt-1 truncate text-[11px] text-muted-foreground'>
                    MRN {record.mrn} · {record.bloodType} · {record.primaryClinician}
                  </p>
                </div>

                <div className='flex shrink-0 items-center gap-3'>
                  <div className='hidden text-right sm:block'>
                    <p className='font-mono text-[11px] font-bold text-foreground'>{summariseVitals(record)}</p>
                    <p className='text-[11px] text-muted-foreground'>Synced {record.lastSync}</p>
                  </div>
                  <Badge
                    variant='outline'
                    className='hidden shrink-0 border-primary/25 bg-primary/5 text-[11px] font-bold text-primary md:inline-flex'
                  >
                    {record.alerts.length > 0 ? `${record.alerts.length} open alert` : 'No alerts'}
                  </Badge>
                  <ArrowRight className='size-4 shrink-0 text-muted-foreground' />
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className='flex items-center justify-between gap-3 border-t border-border/70 px-4 py-3 sm:px-5'>
        <p className='text-[11px] text-muted-foreground'>
          Rows are deep links: the URL becomes <span className='font-mono font-semibold'>#/patient?id=…</span> and the
          record mounts in full-screen focus mode.
        </p>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onNavigate('appointments')}
          className='h-9 shrink-0 rounded-xl text-[11px] font-bold'
        >
          Ledger
          <ArrowRight className='ml-1.5 size-3.5' />
        </Button>
      </div>
    </SectionCard>
  );
}
