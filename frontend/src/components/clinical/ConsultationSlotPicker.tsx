import React, { useState } from 'react';
import { Sun, CloudSun, Moon, Check, Clock } from 'lucide-react';

export interface ConsultationSlot {
  id: string;
  time: string;
  period: 'morning' | 'afternoon' | 'evening';
  available: boolean;
}

interface ConsultationSlotPickerProps {
  slots: ConsultationSlot[];
  selectedSlotId?: string | null;
  onSelectSlot: (slotId: string) => void;
  className?: string;
}

export const ConsultationSlotPicker: React.FC<ConsultationSlotPickerProps> = ({
  slots,
  selectedSlotId,
  onSelectSlot,
  className = '',
}) => {
  const [activePeriod, setActivePeriod] = useState<'morning' | 'afternoon' | 'evening'>('morning');

  const morningSlots = slots.filter((s) => s.period === 'morning');
  const afternoonSlots = slots.filter((s) => s.period === 'afternoon');
  const eveningSlots = slots.filter((s) => s.period === 'evening');

  const currentSlots = 
    activePeriod === 'morning' 
      ? morningSlots 
      : activePeriod === 'afternoon' 
        ? afternoonSlots 
        : eveningSlots;

  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {/* Period Selection Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-lg border border-slate-200/80">
        <button
          type="button"
          onClick={() => setActivePeriod('morning')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-md text-xs font-semibold transition-all ${
            activePeriod === 'morning'
              ? 'bg-white text-blue-700 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sun size={13} className={activePeriod === 'morning' ? 'text-amber-500' : 'text-slate-400'} />
          <span>Morning ({morningSlots.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePeriod('afternoon')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-md text-xs font-semibold transition-all ${
            activePeriod === 'afternoon'
              ? 'bg-white text-blue-700 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CloudSun size={13} className={activePeriod === 'afternoon' ? 'text-orange-500' : 'text-slate-400'} />
          <span>Afternoon ({afternoonSlots.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePeriod('evening')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-md text-xs font-semibold transition-all ${
            activePeriod === 'evening'
              ? 'bg-white text-blue-700 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Moon size={13} className={activePeriod === 'evening' ? 'text-indigo-500' : 'text-slate-400'} />
          <span>Evening ({eveningSlots.length})</span>
        </button>
      </div>

      {/* Slots Grid */}
      {currentSlots.length === 0 ? (
        <div className="flex items-center justify-center py-4 text-xs text-slate-400 gap-1.5">
          <Clock size={13} />
          <span>No slots available for this time window.</span>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
          {currentSlots.map((slot) => {
            const isSelected = selectedSlotId === slot.id;
            return (
              <button
                key={slot.id}
                type="button"
                disabled={!slot.available}
                onClick={() => onSelectSlot(slot.id)}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                  !slot.available
                    ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed line-through'
                    : isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
              >
                {isSelected && <Check size={12} className="stroke-[3]" />}
                <span>{slot.time}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
