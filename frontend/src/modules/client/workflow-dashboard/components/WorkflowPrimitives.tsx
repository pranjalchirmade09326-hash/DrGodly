'use client';

/**
 * WorkflowPrimitives — the small shared vocabulary for the routing dashboard.
 *
 * Layer: client / workflow-dashboard / components
 *
 * Everything here is styled with utility classes and theme tokens that already
 * exist in the app (bg-card, border-border, text-muted-foreground, primary/*,
 * destructive/*). No new CSS is introduced, so the dashboard follows whichever
 * theme the token set resolves to.
 *
 * Status is always carried by a word, never by colour alone, and the sparkline
 * is decorative next to a printed value — both are deliberate so the vitals
 * monitor stays readable for screen-reader and colour-blind users.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import type { VitalStatus } from '../data/mockWorkflowData';

// ── Sparkline ────────────────────────────────────────────────────────────────

const SPARK_WIDTH = 120;
const SPARK_HEIGHT = 34;
const SPARK_PAD = 3;

export function MicroSparkline({
  values,
  className,
  label,
}: {
  values: readonly number[];
  className?: string;
  /** Spoken by assistive tech; the shape itself carries no information. */
  label: string;
}) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = SPARK_WIDTH / (values.length - 1);

  const coords = values.map((value, index) => {
    const x = index * step;
    const y = SPARK_HEIGHT - SPARK_PAD - ((value - min) / span) * (SPARK_HEIGHT - SPARK_PAD * 2);
    return [x, y] as const;
  });

  const points = coords.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const [lastX, lastY] = coords[coords.length - 1];

  return (
    <svg
      viewBox={`0 0 ${SPARK_WIDTH} ${SPARK_HEIGHT}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={label}
      fill="none"
      className={cn('h-8 w-full text-primary/70', className)}
    >
      <polyline
        points={points}
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={lastX} cy={lastY} r={2.25} className="fill-current" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// ── Status vocabulary ────────────────────────────────────────────────────────

const STATUS_CLASSES: Record<VitalStatus, string> = {
  normal: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700',
  elevated: 'border-amber-500/35 bg-amber-500/10 text-amber-700',
  critical: 'border-destructive/35 bg-destructive/10 text-destructive',
  low: 'border-sky-500/30 bg-sky-500/10 text-sky-700',
};

const STATUS_WORDS: Record<VitalStatus, string> = {
  normal: 'Normal',
  elevated: 'Elevated',
  critical: 'Critical',
  low: 'Low',
};

export function StatusPill({
  status,
  className,
}: {
  status: VitalStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-bold',
        STATUS_CLASSES[status],
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {STATUS_WORDS[status]}
    </span>
  );
}

export function statusWord(status: VitalStatus): string {
  return STATUS_WORDS[status];
}

// ── Metric tile ──────────────────────────────────────────────────────────────

const DELTA_TONE_CLASSES = {
  'up-good': 'text-emerald-700',
  'up-bad': 'text-destructive',
  flat: 'text-muted-foreground',
} as const;

export function MetricTile({
  label,
  value,
  delta,
  deltaTone,
  hint,
  series,
}: {
  label: string;
  value: string;
  delta: string;
  deltaTone: keyof typeof DELTA_TONE_CLASSES;
  hint: string;
  series: readonly number[];
}) {
  return (
    <Card className='rounded-2xl border border-border bg-card p-4 shadow-xs transition-shadow duration-200 hover:shadow-sm'>
      <div className='flex items-start justify-between gap-3'>
        <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>{label}</p>
        <span className={cn('text-[11px] font-bold', DELTA_TONE_CLASSES[deltaTone])}>{delta}</span>
      </div>
      <p className='mt-2 text-2xl font-black tracking-tight text-foreground tabular-nums'>{value}</p>
      <MicroSparkline values={series} label={`${label}: ${value}, ${delta}`} className='mt-2' />
      <p className='mt-1.5 text-[11px] leading-relaxed text-muted-foreground'>{hint}</p>
    </Card>
  );
}

// ── Avatar placeholder ───────────────────────────────────────────────────────

export function PatientAvatar({
  initials,
  name,
  size = 'lg',
  className,
}: {
  initials: string;
  name: string;
  size?: 'md' | 'lg';
  className?: string;
}) {
  return (
    <div
      role='img'
      aria-label={`Profile photo placeholder for ${name}`}
      className={cn(
        'grid shrink-0 place-items-center rounded-full border-2 border-dashed border-primary/35 bg-primary/10 font-black text-primary',
        size === 'lg' ? 'size-16 text-xl' : 'size-10 text-sm',
        className,
      )}
    >
      {initials}
    </div>
  );
}

// ── Section shell ────────────────────────────────────────────────────────────

export function SectionCard({
  title,
  subtitle,
  icon: Icon,
  aside,
  children,
  className,
  contentClassName,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <Card className={cn('rounded-3xl border border-border bg-card shadow-xs', className)}>
      <div className='flex flex-wrap items-start justify-between gap-3 border-b border-border/70 p-4 sm:p-5'>
        <div className='flex min-w-0 items-start gap-2.5'>
          {Icon ? <Icon className='mt-0.5 size-5 shrink-0 text-primary' /> : null}
          <div className='min-w-0'>
            <h3 className='text-sm font-extrabold tracking-tight text-foreground'>{title}</h3>
            {subtitle ? <p className='mt-0.5 text-xs text-muted-foreground'>{subtitle}</p> : null}
          </div>
        </div>
        {aside}
      </div>
      <div className={cn('p-4 sm:p-5', contentClassName)}>{children}</div>
    </Card>
  );
}
