'use client';

/**
 * CriticalAlertsBanner — decision-support escalations for the focus route.
 *
 * Layer: client / workflow-dashboard / components / patient
 *
 * Rendered as a live `role="alert"` region only when something is actually
 * critical; otherwise it degrades to a `role="status"` all-clear line so the
 * section is never an empty box. Severity is carried by an icon, a word and a
 * colour rather than colour alone.
 */

import React from 'react';
import { BellOff, CircleCheck, Info, ShieldAlert, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { CriticalAlert } from '../../data/mockWorkflowData';

const SEVERITY_META: Record<
  CriticalAlert['severity'],
  { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
> = {
  critical: {
    label: 'Critical',
    className: 'border-destructive/25 bg-destructive/5 text-destructive',
    icon: ShieldAlert,
  },
  warning: {
    label: 'Warning',
    className: 'border-amber-500/35 bg-amber-500/10 text-amber-700',
    icon: TriangleAlert,
  },
  info: {
    label: 'Advisory',
    className: 'border-border bg-muted/50 text-muted-foreground',
    icon: Info,
  },
};

export function CriticalAlertsBanner({ alerts }: { alerts: readonly CriticalAlert[] }) {
  if (alerts.length === 0) {
    return (
      <div
        role='status'
        className='flex items-center gap-2.5 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 px-4 py-3'
      >
        <CircleCheck className='size-4 shrink-0 text-emerald-700' />
        <p className='text-xs font-bold text-emerald-800'>No open alerts on this record.</p>
        <p className='hidden text-[11px] text-muted-foreground sm:block'>
          Escalation rules last evaluated 08:45.
        </p>
      </div>
    );
  }

  const hasCritical = alerts.some((alert) => alert.severity === 'critical');

  return (
    <section
      role={hasCritical ? 'alert' : 'region'}
      aria-label={hasCritical ? 'Critical alerts for this patient' : 'Open alerts for this patient'}
      className='space-y-2.5'
    >
      {alerts.map((alert) => {
        const meta = SEVERITY_META[alert.severity];
        const Icon = meta.icon;
        return (
          <div
            key={alert.id}
            className={`flex flex-col gap-3 rounded-2xl border p-3.5 sm:flex-row sm:items-start ${meta.className}`}
          >
            <Icon className='mt-0.5 size-4 shrink-0' aria-hidden='true' />
            <div className='min-w-0 flex-1'>
              <div className='flex flex-wrap items-center gap-2'>
                <p className='text-xs font-black tracking-tight text-foreground'>{alert.title}</p>
                <span className='shrink-0 rounded-full border border-border bg-card/70 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-inherit'>
                  {meta.label}
                </span>
              </div>
              <p className='mt-1 text-[11px] leading-relaxed text-card-foreground'>{alert.detail}</p>
              <p className='mt-1 text-[11px] font-semibold text-muted-foreground'>{alert.source}</p>
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={() =>
                toast.info('Alert acknowledged', {
                  description: 'Mock workflow — acknowledgement is not written to a task list.',
                })
              }
              className='h-8 shrink-0 self-start rounded-lg border-border/60 bg-card/70 text-[11px] font-bold text-card-foreground hover:bg-card'
            >
              <BellOff className='mr-1.5 size-3.5' />
              Acknowledge
            </Button>
          </div>
        );
      })}
    </section>
  );
}
