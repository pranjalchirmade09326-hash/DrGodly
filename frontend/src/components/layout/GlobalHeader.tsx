"use client";

import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Stethoscope, 
  User, 
  ShieldCheck, 
  Sparkles,
  Command,
  ChevronDown,
  Lock
} from 'lucide-react';
import Link from 'next/link';
import { DrGodlyLogo } from '@/components/shared/DrGodlyLogo';

export interface GlobalHeaderProps {
  currentRole?: 'doctor' | 'patient';
  userName?: string;
  userRoleTitle?: string;
  notificationCount?: number;
  onRoleSwitch?: (role: 'doctor' | 'patient') => void;
  onSearch?: (query: string) => void;
  className?: string;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  currentRole = 'doctor',
  userName,
  userRoleTitle,
  notificationCount = 2,
  onRoleSwitch,
  onSearch,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [role, setRole] = useState<'doctor' | 'patient'>(currentRole);

  const activeName = userName || (role === 'doctor' ? 'Dr. Alexander Wright, MD' : 'Louise Reed');
  const activeTitle = userRoleTitle || (role === 'doctor' ? 'Chief of Cardiology • NPI #1982736450' : 'Member ID #DG-89241 • Pre-Screened');

  const handleRoleToggle = (newRole: 'doctor' | 'patient') => {
    setRole(newRole);
    if (onRoleSwitch) {
      onRoleSwitch(newRole);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className={`w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/70 sticky top-0 z-40 transition-all shadow-[0_2px_12px_rgba(0,0,0,0.02)] ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* ── Brand Logo (US HealthTech Clean Style) ── */}
        <Link href="/en" className="shrink-0 focus:outline-none flex items-center gap-3">
          <DrGodlyLogo
            size="md"
            badge="Health AI"
            tagline="Clinical Intelligence Platform"
          />
        </Link>

        {/* ── Floating Omnisearch (One Medical / Linear Grade) ── */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patient chart, ICD-10, clinical notes, medications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-16 py-2 text-xs font-medium bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] text-slate-400 font-mono bg-white px-1.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">
              <Command size={10} />
              <span>K</span>
            </div>
          </div>
        </form>

        {/* ── Right-Side Controls: Trust, Role Toggle, Profile ── */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* US Regulatory Trust Indicator */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50/70 border border-emerald-200/60 text-emerald-800 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>HIPAA & SOC 2 Verified</span>
          </div>

          {/* Segmented iOS/macOS Style Role Switcher */}
          <div className="bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 flex items-center gap-1 shadow-2xs">
            <button
              type="button"
              onClick={() => handleRoleToggle('doctor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                role === 'doctor'
                  ? 'bg-white text-blue-600 shadow-xs border border-slate-200/70'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope size={13} className={role === 'doctor' ? 'text-blue-600' : 'text-slate-400'} />
              <span>Clinician</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleToggle('patient')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                role === 'patient'
                  ? 'bg-white text-blue-600 shadow-xs border border-slate-200/70'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User size={13} className={role === 'patient' ? 'text-blue-600' : 'text-slate-400'} />
              <span>Patient</span>
            </button>
          </div>

          {/* Notifications */}
          <button
            type="button"
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            title="Notifications"
          >
            <Bell size={17} />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-white font-black text-[9px] flex items-center justify-center ring-2 ring-white">
                {notificationCount}
              </span>
            )}
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 pl-1 sm:pl-2 border-l border-slate-200">
            <div className="relative shrink-0">
              <img
                src={
                  role === 'doctor'
                    ? 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80'
                    : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
                }
                alt={activeName}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/30 shadow-xs"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white absolute -bottom-0.5 -right-0.5" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                {activeName}
              </span>
              <span className="text-[10px] text-slate-500 font-medium leading-tight truncate max-w-[170px]">
                {activeTitle}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
