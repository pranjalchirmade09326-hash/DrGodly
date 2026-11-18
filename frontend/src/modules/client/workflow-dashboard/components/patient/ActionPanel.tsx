'use client';

/**
 * ActionPanel — the workflow controls of the patient focus route.
 *
 * Layer: client / workflow-dashboard / components / patient
 *
 * "Schedule Appointment" is a real route transition (it writes `#/appointments`),
 * which makes it the clearest demonstration that leaving focus mode restores the
 * chrome. "Edit Details" and "Issue Prescription" would open forms against a
 * backend, so they resolve to an honest toast instead of a dead button.
 */

import React from 'react';
import { CalendarPlus, Pill, UserPen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { ActiveMedication, PatientRecord } from '../../data/mockWorkflowData';
import { SectionCard } from '../WorkflowPrimitives';
import type { WorkflowRouteId } from '../../router/routeTable';

export function ActionPanel({
  record,
  onNavigate,
}: {
  record: PatientRecord;
  onNavigate: (routeId: WorkflowRouteId, params?: Record<string, string>) => void;
}) {
  return (
    <SectionCard
      title='Actions'
      subtitle='Everything a clinician can do from this record'
      icon={UserPen}
    >
      <div className='grid grid-cols-1 gap-2.5'>
        <Button
          onClick={() => onNavigate('appointments')}
          className='h-11 w-full justify-start rounded-2xl px-4 text-xs font-bold'
        >
          <CalendarPlus className='mr-2.5 size-4 shrink-0' />
          Schedule appointment
        </Button>
        <Button
          variant='outline'
          onClick={() =>
            toast.info('Demographics form ready to mount', {
              description: `Mock workflow — the edit sheet for ${record.name} needs the Patient API.`,
            })
          }
          className='h-11 w-full justify-start rounded-2xl border-border px-4 text-xs font-bold'
        >
          <UserPen className='mr-2.5 size-4 shrink-0 text-primary' />
          Edit details
        </Button>
        <Button
          variant='outline'
          onClick={() =>
            toast.info('Prescription composer opened', {
              description: 'Mock workflow — no e-Rx bundle is submitted.',
            })
          }
          className='h-11 w-full justify-start rounded-2xl border-border px-4 text-xs font-bold'
        >
          <Pill className='mr-2.5 size-4 shrink-0 text-primary' />
          Issue prescription
        </Button>
      </div>

      <dl className='mt-4 space-y-2 border-t border-border/70 pt-4'>
        <div className='flex items-baseline justify-between gap-3'>
          <dt className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>Risk band</dt>
          <dd className='text-xs font-bold text-foreground'>{record.risk}</dd>
        </div>
        <div className='flex items-baseline justify-between gap-3'>
          <dt className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>Open alerts</dt>
          <dd className='text-xs font-bold text-foreground'>{record.alerts.length}</dd>
        </div>
        <div className='flex items-baseline justify-between gap-3'>
          <dt className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>Active meds</dt>
          <dd className='text-xs font-bold text-foreground'>{record.medications.length}</dd>
        </div>
        <div className='flex items-baseline justify-between gap-3'>
          <dt className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>Synced</dt>
          <dd className='text-xs font-semibold text-muted-foreground'>{record.lastSync}</dd>
        </div>
      </dl>
    </SectionCard>
  );
}

export function MedicationList({ medications }: { medications: readonly ActiveMedication[] }) {
  return (
    <SectionCard
      title='Active prescriptions'
      subtitle={medications.length > 0 ? `${medications.length} on the medication list` : 'Nothing active'}
      icon={Pill}
      contentClassName='p-0 sm:p-0'
    >
      {medications.length === 0 ? (
        <p className='px-4 py-6 text-center text-xs text-muted-foreground'>
          No active medication recorded.
        </p>
      ) : (
        <ul className='divide-y divide-border/70'>
          {medications.map((med) => (
            <li key={med.id} className='flex flex-wrap items-start justify-between gap-2 px-4 py-3 sm:px-5'>
              <div className='min-w-0'>
                <p className='truncate text-xs font-bold text-foreground'>{med.name}</p>
                <p className='mt-0.5 text-[11px] text-muted-foreground'>
                  {med.dosage} · {med.schedule}
                </p>
              </div>
              <span className='shrink-0 rounded-full border border-border bg-muted/60 px-2 py-0.5 text-[11px] font-bold text-muted-foreground'>
                {med.refillsLeft} refill{med.refillsLeft === 1 ? '' : 's'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
