'use client';

/**
 * VitalsMonitor — the high-visibility vitals row of the patient focus route.
 *
 * Layer: client / workflow-dashboard / components / patient
 *
 * Each card pairs a printed value with a status word and a micro-chart, so the
 * trend is readable at a glance and the number is readable without colour or
 * sight of the sparkline. The series is deterministic mock data: the same
 * patient always renders the same curve.
 */

import React from 'react';
import { HeartPulse, MonitorActivity, Thermometer } from 'lucide-react';
import type { PatientRecord, VitalKey, VitalReading } from '../../data/mockWorkflowData';
import { MicroSparkline, StatusPill, statusWord } from '../WorkflowPrimitives';

const VITAL_ICON: Record<VitalKey, React.ComponentType<{ className?: string }>> = {
  heartRate: HeartPulse,
  bloodPressure: MonitorActivity,
  temperature: Thermometer,
};

function VitalCard({ reading }: { reading: VitalReading }) {
  const Icon = VITAL_ICON[reading.key];

  return (
    <article className='flex flex-col gap-3 rounded-3xl border border-border bg-card p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md'>
      <div className='flex items-start justify-between gap-3'>
        <div className='flex items-center gap-2.5'>
          <span className='grid size-9 shrink-0 place-items-center rounded-2xl bg-primary/10 ring-1 ring-primary/20'>
            <Icon className='size-4 text-primary' aria-hidden='true' />
          </span>
          <div className='min-w-0'>
            <h4 className='text-xs font-black tracking-tight text-foreground'>{reading.label}</h4>
            <p className='text-[11px] text-muted-foreground'>{reading.reference}</p>
          </div>
        </div>
        <StatusPill status={reading.status} />
      </div>

      <p className='text-3xl font-black leading-none tracking-tight text-foreground tabular-nums'>
        {reading.value}
        <span className='ml-1 text-sm font-bold text-muted-foreground'>{reading.unit}</span>
      </p>

      <div>
        <MicroSparkline
          values={reading.series}
          label={`${reading.label} trend, latest ${reading.value} ${reading.unit}, status ${statusWord(reading.status)}`}
        />
        <p className='mt-1.5 text-[11px] leading-relaxed text-muted-foreground'>{reading.seriesNote}</p>
      </div>

      <p className='mt-auto border-t border-border/70 pt-2.5 text-[11px] font-semibold text-muted-foreground'>
        Measured {reading.measuredAt}
      </p>
    </article>
  );
}

export function VitalsMonitor({ record }: { record: PatientRecord }) {
  const abnormal = record.vitals.filter((reading) => reading.status !== 'normal');

  return (
    <section aria-labelledby='patient-vitals-heading' className='space-y-3'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <h3 id='patient-vitals-heading' className='text-sm font-extrabold tracking-tight text-foreground'>
          Vitals monitor
        </h3>
        <p className='text-[11px] text-muted-foreground'>
          {abnormal.length === 0
            ? 'All readings within reference range'
            : `${abnormal.length} reading${abnormal.length > 1 ? 's' : ''} outside reference range`}
        </p>
      </div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        {record.vitals.map((reading) => (
          <VitalCard key={reading.key} reading={reading} />
        ))}
      </div>
    </section>
  );
}
