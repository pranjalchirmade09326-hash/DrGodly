'use client';

import React from 'react';
import { CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { nowIST } from '@/modules/shared/helper';

/**
 * DoctorWeekSchedule — seven-day agenda strip for the clinician dashboard.
 *
 * Layer: client / telemedicine / doctor / component / dashboard-overview
 *
 * DashboardOverview already answers "how busy am I today" (metric tiles, the
 * triage queue, the trend and status charts, and the recent-visit table). This
 * strip answers the adjacent question a clinician asks next: "where does the
 * rest of my week go?" Each day carries its booked slots plus a load bar, so
 * the heavy days are obvious at a glance on desktop and stay swipeable on a
 * phone.
 *
 * All data is mock and generated from a fixed pattern, so the strip renders
 * identically on every reload while still showing real weekday labels.
 */

type Slot = {
  time: string;
  patient: string;
  kind: 'Consultation' | 'Follow-up' | 'Review';
};

/** Fixed slot patterns indexed by weekday position, capped at three visible. */
const SLOT_PATTERNS: Slot[][] = [
  [
    { time: '09:00', patient: 'Louise Reed', kind: 'Consultation' },
    { time: '11:30', patient: 'Marcus Chen', kind: 'Follow-up' },
    { time: '15:00', patient: 'Nina Alvarez', kind: 'Review' },
  ],
  [
    { time: '10:00', patient: 'Sarah Jenkins', kind: 'Consultation' },
    { time: '14:30', patient: 'Devon Price', kind: 'Follow-up' },
  ],
  [
    { time: '09:30', patient: 'Amara Osei', kind: 'Review' },
    { time: '13:00', patient: 'Robert Klein', kind: 'Consultation' },
    { time: '16:30', patient: 'Priya Nair', kind: 'Follow-up' },
  ],
  [{ time: '11:00', patient: 'Tomás Rivera', kind: 'Follow-up' }],
  [
    { time: '08:30', patient: 'Grace Liu', kind: 'Consultation' },
    { time: '12:00', patient: 'Ethan Brooks', kind: 'Review' },
  ],
  [{ time: '10:30', patient: 'Hana Suzuki', kind: 'Follow-up' }],
  [],
];

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Load bar width, in percent, for a day with the given number of slots. */
function loadWidth(count: number): string {
  if (count === 0) return '0%';
  return `${Math.min(100, count * 30)}%`;
}

export function DoctorWeekSchedule() {
  // Build the seven days from today forward in the app's clinical timezone so
  // the strip agrees with the timestamps used across the rest of the cockpit.
  const days = React.useMemo(() => {
    const base = nowIST();
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(base);
      date.setDate(base.getDate() + index);
      const pattern = SLOT_PATTERNS[(date.getDay() + index) % SLOT_PATTERNS.length];
      return {
        key: date.toISOString().slice(0, 10),
        weekday: WEEKDAY_LABELS[date.getDay()],
        dayNumber: date.getDate(),
        isToday: index === 0,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        slots: pattern,
      };
    });
  }, []);

  const weekCount = days.reduce((sum, day) => sum + day.slots.length, 0);

  return (
    <Card className='rounded-3xl border border-border bg-card shadow-xs'>
      <CardContent className='p-4 sm:p-5'>
        <div className='flex flex-wrap items-center justify-between gap-3 pb-3'>
          <div className='flex min-w-0 items-center gap-2.5'>
            <CalendarDays className='size-5 shrink-0 text-primary' />
            <div className='min-w-0'>
              <h3 className='text-sm font-extrabold tracking-tight text-foreground'>
                Week at a glance
              </h3>
              <p className='text-xs text-muted-foreground'>
                {weekCount} visits across the next 7 days
              </p>
            </div>
          </div>
          <Badge variant='outline' className='text-[11px] font-semibold text-muted-foreground'>
            Mon–Sun clinic hours
          </Badge>
        </div>

        {/* One row per day on desktop; a swipeable track on phones, because
            seven fixed columns would squeeze each slot label into illegibility.
            The track is a focusable list so keyboard users can reach and scroll
            the overflow instead of being trapped behind a pointer-only control. */}
        <div
          role='list'
          aria-label='Next seven days, scrollable on small screens'
          tabIndex={0}
          className='-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:mx-0 md:grid md:grid-cols-7 md:gap-2 md:overflow-visible md:px-0 md:pb-0 md:focus-visible:ring-0'
        >
          {days.map((day) => (
            <div
              key={day.key}
              role='listitem'
              aria-label={`${day.weekday} ${day.dayNumber}: ${day.slots.length} visits scheduled`}
              className={`w-[13.5rem] shrink-0 snap-start rounded-2xl border p-3 transition-colors md:w-auto ${
                day.isToday
                  ? 'border-primary/45 bg-primary/5'
                  : 'border-border bg-muted/40 hover:bg-muted/70'
              }`}
            >
              <div className='flex items-baseline justify-between gap-2'>
                <div className='flex items-baseline gap-1.5'>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      day.isToday ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {day.weekday}
                  </span>
                  <span className='text-sm font-extrabold text-foreground'>{day.dayNumber}</span>
                </div>
                {day.isToday && (
                  <span className='rounded-full bg-primary px-1.5 py-0.5 text-[11px] font-bold text-primary-foreground'>
                    Today
                  </span>
                )}
              </div>

              <div className='mt-2 h-1 overflow-hidden rounded-full bg-border/70'>
                <div
                  className={`h-full rounded-full ${day.isToday ? 'bg-primary' : 'bg-primary/45'}`}
                  style={{ width: loadWidth(day.slots.length) }}
                />
              </div>

              <div className='mt-2.5 space-y-1.5'>
                {day.slots.length === 0 ? (
                  <p className='text-[11px] font-medium text-muted-foreground'>
                    {day.isWeekend ? 'On call only' : 'No visits booked'}
                  </p>
                ) : (
                  day.slots.slice(0, 3).map((slot) => (
                    <div
                      key={`${day.key}-${slot.time}`}
                      className='flex items-center gap-1.5 rounded-lg bg-card px-2 py-1.5 ring-1 ring-border/60'
                    >
                      <span className='font-mono text-[11px] font-semibold text-primary'>
                        {slot.time}
                      </span>
                      <span className='min-w-0 flex-1 truncate text-[11px] font-semibold text-card-foreground'>
                        {slot.patient}
                      </span>
                      <span className='shrink-0 text-[11px] text-muted-foreground'>
                        {slot.kind}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
