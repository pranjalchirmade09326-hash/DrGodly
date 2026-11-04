'use client';

import React, { useState } from 'react';
import {
  Search,
  Bell,
  Stethoscope,
  User,
  X,
  Command,
} from 'lucide-react';
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

/**
 * Clinical workspace header used by the /screens demo cockpit.
 *
 * Layout contract: every element that is not essential at 375px hides itself,
 * so the role switcher and identity pill always stay on screen. The omnisearch
 * collapses into an icon button below `md` that expands a full-width overlay
 * row, which keeps the bar a constant 64px tall (the sticky sub-header on
 * /screens offsets itself by exactly that amount).
 *
 * Colors come from the theme tokens rather than raw slate/blue classes so the
 * bar follows light and dark mode.
 */
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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const activeName = userName || (role === 'doctor' ? 'Dr. Alexander Wright, MD' : 'Louise Reed');
  const activeTitle = userRoleTitle || (role === 'doctor' ? 'Chief of Cardiology • NPI #1982736450' : 'Member ID #DG-89241 • Pre-Screened');

  const handleRoleToggle = (newRole: 'doctor' | 'patient') => {
    setRole(newRole);
    onRoleSwitch?.(newRole);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
    setMobileSearchOpen(false);
  };

  const searchField = (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search chart, ICD-10, notes, medications…"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Search clinical records"
        className="w-full rounded-full border border-input bg-muted/60 py-2 pl-10 pr-16 text-xs font-medium text-foreground transition-colors placeholder:text-muted-foreground hover:bg-muted focus-visible:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      />
      <span className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-0.5 rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
        <Command size={11} />
        <span>K</span>
      </span>
    </div>
  );

  return (
    <header className={`sticky top-0 z-40 w-full border-b border-border/70 bg-background/90 backdrop-blur-xl transition-all ${className}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6">
        {/* ── Brand lockup: text tagline and badge drop out on narrow screens ── */}
        <DrGodlyLogo
          size="md"
          badge="Health AI"
          badgeClassName="hidden xl:inline-flex"
          tagline="Clinical Intelligence Platform"
          taglineClassName="hidden lg:block"
          linkTo="/"
        />

        {/* ── Omnisearch (md and up) ── */}
        <form onSubmit={handleSearchSubmit} className="mx-4 hidden max-w-md flex-1 md:block">
          {searchField}
        </form>

        {/* ── Right-side controls ── */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setMobileSearchOpen((open) => !open)}
            aria-label={mobileSearchOpen ? 'Close search' : 'Open search'}
            aria-expanded={mobileSearchOpen}
            className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
          >
            {mobileSearchOpen ? <X size={17} /> : <Search size={17} />}
          </button>

          {/* Segmented role switcher — labels drop below sm so both segments fit */}
          <div className="flex items-center gap-1 rounded-xl border border-border/80 bg-muted/70 p-1">
            <button
              type="button"
              onClick={() => handleRoleToggle('doctor')}
              aria-pressed={role === 'doctor'}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors sm:px-3 ${
                role === 'doctor'
                  ? 'bg-background text-primary shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Stethoscope size={14} />
              <span className="hidden sm:inline">Clinician</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleToggle('patient')}
              aria-pressed={role === 'patient'}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors sm:px-3 ${
                role === 'patient'
                  ? 'bg-background text-primary shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <User size={14} />
              <span className="hidden sm:inline">Patient</span>
            </button>
          </div>

          <button
            type="button"
            className="relative hidden size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:flex"
            title="Notifications"
            aria-label={`Notifications (${notificationCount} unread)`}
          >
            <Bell size={17} />
            {notificationCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex min-w-4 h-4 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground ring-2 ring-background">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Identity pill — initials only on phones */}
          <div className="flex items-center gap-2.5 border-l border-border pl-1 sm:pl-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {role === 'doctor' ? 'AW' : 'LR'}
            </div>
            <div className="hidden flex-col text-left lg:flex">
              <span className="max-w-[180px] truncate text-xs font-bold leading-tight text-foreground">
                {activeName}
              </span>
              <span className="max-w-[180px] truncate text-[11px] font-medium leading-tight text-muted-foreground">
                {activeTitle}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile omnisearch overlay row — absolutely positioned so the bar height stays 64px */}
      {mobileSearchOpen && (
        <div className="absolute inset-x-0 top-16 border-b border-border/70 bg-background/95 px-3 py-3 backdrop-blur-xl md:hidden">
          <form onSubmit={handleSearchSubmit}>{searchField}</form>
        </div>
      )}
    </header>
  );
};

export default GlobalHeader;
