'use client';

/**
 * PatientHeader — identity block for the focus route.
 *
 * Layer: client / workflow-dashboard / components / patient
 *
 * Everything a clinician needs before reading a record: name, age, sex, blood
 * type, MRN, plan, risk band, responsible clinician, sync recency and the
 * allergy list. The avatar is an intentional placeholder — initials inside a
 * dashed ring rather than an image — so no fake photo is shipped with the demo.
 */

import React from 'react';
import { Droplets, IdCard, ShieldAlert } from 'lucide-react';
import type { PatientRecord } from '../../data/mockWorkflowData';
import { PatientAvatar } from '../WorkflowPrimitives';

const RISK_TONE: Record<PatientRecord['risk'], string> = {
  Routine: 'border-border bg-muted/60 text-muted-foreground',
  Accelerated: 'border-amber-500/35 bg-amber-500/10 text-amber-700',
  'High complexity': 'border-destructive/35 bg-destructive/10 text-destructive',
};

const FACT_ITEMS: readonly { key: string; label: string; pick: (record: PatientRecord) => string }[] = [
  { key: 'age', label: 'Age / sex', pick: (r) => `${r.age} yrs · ${r.sex}` },
  { key: 'mrn', label: 'MRN', pick: (r) => r.mrn },
  { key: 'plan', label: 'Plan', pick: (r) => r.plan },
  { key: 'clinician', label: 'Primary clinician', pick: (r) => r.primaryClinician },
  { key: 'sync', label: 'Record synced', pick: (r) => r.lastSync },
];

export function PatientHeader({ record }: { record: PatientRecord }) {
  return (
    <header className='rounded-3xl border border-border bg-card p-4 shadow-xs sm:p-5'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div className='flex min-w-0 items-start gap-3.5'>
          <PatientAvatar initials={record.initials} name={record.name} size='lg' />
          <div className='min-w-0'>
            <div className='flex flex-wrap items-center gap-2'>
              <h2 className='text-xl font-black tracking-tight text-foreground sm:text-2xl'>{record.name}</h2>
              <span
                className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-bold ${RISK_TONE[record.risk]}`}
              >
                {record.risk}
              </span>
            </div>
            <p className='mt-1 text-xs text-muted-foreground'>
              {record.age} years · {record.sex} · Blood type{' '}
              <span className='font-bold text-foreground'>{record.bloodType}</span>
            </p>
            <p className='mt-1 text-[11px] text-muted-foreground'>
              Isolated workflow route — this record owns the viewport while{' '}
              <span className='font-mono font-semibold text-foreground'>#/patient</span> is active.
            </p>
          </div>
        </div>

        <div className='flex shrink-0 items-center gap-2 self-start sm:self-auto'>
          <span className='inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-2.5 py-1 text-[11px] font-bold text-primary'>
            <Droplets className='size-3.5' aria-hidden='true' />
            {record.bloodType}
          </span>
          <span className='inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-1 font-mono text-[11px] font-semibold text-muted-foreground'>
            <IdCard className='size-3.5' aria-hidden='true' />
            {record.mrn}
          </span>
        </div>
      </div>

      <dl className='mt-4 grid grid-cols-2 gap-3 border-t border-border/70 pt-4 sm:grid-cols-3 lg:grid-cols-5'>
        {FACT_ITEMS.map((fact) => (
          <div key={fact.key} className='min-w-0'>
            <dt className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>{fact.label}</dt>
            <dd className='mt-1 truncate text-xs font-semibold text-foreground' title={fact.pick(record)}>
              {fact.pick(record)}
            </dd>
          </div>
        ))}
      </dl>

      {record.allergies.length > 0 ? (
        <div className='mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-3'>
          <p className='flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-amber-800'>
            <ShieldAlert className='size-3.5 shrink-0' aria-hidden='true' />
            Documented allergies
          </p>
          <ul className='mt-1.5 flex flex-wrap gap-1.5'>
            {record.allergies.map((allergy) => (
              <li
                key={allergy}
                className='rounded-full border border-amber-500/30 bg-card px-2 py-0.5 text-[11px] font-semibold text-amber-900'
              >
                {allergy}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
