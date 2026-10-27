'use client';

import React from 'react';
import { Filter, RotateCcw, Check, Video, Building2, Sparkles } from 'lucide-react';

export interface DoctorFilterState {
  specialties: string[];
  consultationMode: 'all' | 'video' | 'in-clinic';
  maxFee: number;
  minExperience: number;
  availableTodayOnly: boolean;
}

interface DoctorFilterSidebarProps {
  filters: DoctorFilterState;
  totalResults: number;
  onFilterChange: (newFilters: DoctorFilterState) => void;
  onReset: () => void;
  className?: string;
}

const AVAILABLE_SPECIALTIES = [
  'Cardiology',
  'Neurology',
  'Internal Medicine',
  'Pediatrics',
  'Orthopedics',
  'Dermatology',
  'Psychiatry',
  'Gastroenterology',
];

export const DoctorFilterSidebar: React.FC<DoctorFilterSidebarProps> = ({
  filters,
  totalResults,
  onFilterChange,
  onReset,
  className = '',
}) => {
  const toggleSpecialty = (spec: string) => {
    const exists = filters.specialties.includes(spec);
    const updated = exists
      ? filters.specialties.filter((s) => s !== spec)
      : [...filters.specialties, spec];
    onFilterChange({ ...filters, specialties: updated });
  };

  const handleModeChange = (mode: 'all' | 'video' | 'in-clinic') => {
    onFilterChange({ ...filters, consultationMode: mode });
  };

  const handleFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, maxFee: Number(e.target.value) });
  };

  const handleExperienceChange = (years: number) => {
    onFilterChange({ ...filters, minExperience: years });
  };

  const handleAvailableTodayToggle = () => {
    onFilterChange({ ...filters, availableTodayOnly: !filters.availableTodayOnly });
  };

  return (
    <aside className={`w-full lg:w-72 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col gap-6 ${className}`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Filter size={14} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-none">Filter Doctors</h3>
            <span className="text-[11px] text-slate-500 font-medium">{totalResults} verified matches</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors"
        >
          <RotateCcw size={11} />
          <span>Reset</span>
        </button>
      </div>

      {/* Consultation Mode */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Consultation Mode
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => handleModeChange('all')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filters.consultationMode === 'all'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Modes
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('video')}
            className={`py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-all ${
              filters.consultationMode === 'video'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video size={12} className={filters.consultationMode === 'video' ? 'text-blue-600' : 'text-slate-400'} />
            <span>Video</span>
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('in-clinic')}
            className={`py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-all ${
              filters.consultationMode === 'in-clinic'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 size={12} className={filters.consultationMode === 'in-clinic' ? 'text-blue-600' : 'text-slate-400'} />
            <span>In-Clinic</span>
          </button>
        </div>
      </div>

      {/* Available Today Toggle */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/60 border border-blue-200/60">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-blue-600" />
          <span className="text-xs font-bold text-blue-900">Available Today Only</span>
        </div>
        <input
          type="checkbox"
          checked={filters.availableTodayOnly}
          onChange={handleAvailableTodayToggle}
          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
        />
      </div>

      {/* Max Consultation Fee Slider */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-900 uppercase tracking-wider">Max Fee:</span>
          <span className="text-blue-700 font-extrabold text-sm">₹{filters.maxFee}</span>
        </div>
        <input
          type="range"
          min="300"
          max="3000"
          step="100"
          value={filters.maxFee}
          onChange={handleFeeChange}
          className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
        />
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>₹300 (Subsidized)</span>
          <span>₹3,000 (Super-Specialist)</span>
        </div>
      </div>

      {/* Experience Level */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Minimum Experience
        </label>
        <div className="grid grid-cols-4 gap-1">
          {[0, 5, 10, 15].map((years) => (
            <button
              key={years}
              type="button"
              onClick={() => handleExperienceChange(years)}
              className={`py-1 text-xs font-semibold rounded-lg border transition-all ${
                filters.minExperience === years
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {years === 0 ? 'Any' : `${years}+ yrs`}
            </button>
          ))}
        </div>
      </div>

      {/* Medical Specialties */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Specialty
        </label>
        <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
          {AVAILABLE_SPECIALTIES.map((spec) => {
            const isChecked = filters.specialties.includes(spec);
            return (
              <label
                key={spec}
                className={`flex items-center justify-between p-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  isChecked
                    ? 'bg-blue-50 text-blue-900 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleSpecialty(spec)}
                    className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span>{spec}</span>
                </div>
                {isChecked && <Check size={12} className="text-blue-600 stroke-[3]" />}
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
