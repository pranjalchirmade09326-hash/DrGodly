'use client';

/**
 * PatientFocusView — the isolated, full-screen patient dashboard.
 *
 * Layer: client / workflow-dashboard / views
 *
 * Mounted only while `#/patient` is the active route. The shell unmounts the
 * sidebar, the topbar and every overview widget before this view renders, so
 * nothing here has to coordinate with another context: no global metrics, no
 * module rail, no bleed from the directory or the ledger.
 *
 * The record comes from the URL parameter alone, which is why switching patient
 * is a route change rather than local state — the deep link stays shareable and
 * the router trace stays truthful.
 */

import React from 'react';
import { Link2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PATIENT_DIRECTORY, type PatientRecord } from '../data/mockWorkflowData';
import { SectionCard } from '../components/WorkflowPrimitives';
import { PatientHeader } from '../components/patient/PatientHeader';
import { CriticalAlertsBanner } from '../components/patient/CriticalAlertsBanner';
import { VitalsMonitor } from '../components/patient/VitalsMonitor';
import { RecordsTimeline } from '../components/patient/RecordsTimeline';
import { ActionPanel, MedicationList } from '../components/patient/ActionPanel';
import type { WorkflowRouteId } from '../router/routeTable';

export function PatientFocusView({
  record,
  onNavigate,
}: {
  record: PatientRecord;
  onNavigate: (routeId: WorkflowRouteId, params?: Record<string, string>) => void;
}) {
  const others = PATIENT_DIRECTORY.filter((entry) => entry.id !== record.id);

  return (
    <div className='space-y-6'>
      <PatientHeader record={record} />

      <section aria-labelledby='patient-alerts-heading' className='space-y-2.5'>
        <h3 id='patient-alerts-heading' className='text-sm font-extrabold tracking-tight text-foreground'>
          Critical alerts
        </h3>
        <CriticalAlertsBanner alerts={record.alerts} />
      </section>

      <div className='grid grid-cols-1 gap-6 xl:grid-cols-12'>
        <div className='min-w-0 space-y-6 xl:col-span-8'>
          <VitalsMonitor record={record} />
          <RecordsTimeline timeline={record.timeline} />
        </div>

        <div className='min-w-0 space-y-6 xl:col-span-4'>
          <ActionPanel record={record} onNavigate={onNavigate} />
          <MedicationList medications={record.medications} />

          <SectionCard
            title='Switch record'
            subtitle='Changes the id parameter on the same route'
            icon={Link2}
            aside={
              <Button
                variant='outline'
                size='sm'
                onClick={() => onNavigate('patients')}
                className='h-8 rounded-xl text-[11px] font-bold'
              >
                <Users className='mr-1.5 size-3.5' />
                Panel
              </Button>
            }
            contentClassName='p-0 sm:p-0'
          >
            <ul className='divide-y divide-border/70'>
              {others.map((entry) => (
                <li key={entry.id}>
                  <button
                    type='button'
                    onClick={() => onNavigate('patient', { id: entry.id })}
                    aria-label={`Load the patient dashboard for ${entry.name}`}
                    className='flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors duration-200 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:px-5'
                  >
                    <span className='min-w-0 flex-1'>
                      <span className='block truncate text-xs font-bold text-foreground'>{entry.name}</span>
                      <span className='mt-0.5 block truncate font-mono text-[11px] text-muted-foreground'>
                        {entry.id}
                      </span>
                    </span>
                    <span className='shrink-0 text-[11px] font-bold text-primary'>Load</span>
                  </button>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
