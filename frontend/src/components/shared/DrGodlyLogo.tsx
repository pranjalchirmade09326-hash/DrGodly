'use client';

import React from 'react';
import Link from 'next/link';

export interface DrGodlyLogoProps {
  /** Size variant: 'xs' (22px), 'sm' (28px), 'md' (36px), 'lg' (44px), 'xl' (56px) or explicit pixel number */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Whether to render the 'DrGodly' text mark alongside the icon. Default true */
  showText?: boolean;
  /** Optional secondary subtitle / tagline. Defaults to 'AI for Better Care'. Pass empty string or null to hide */
  tagline?: string | null;
  /** Color theme for text: 'light' (dark text on light bg), 'dark' (white text on dark bg), or 'auto' */
  theme?: 'light' | 'dark' | 'auto';
  /** Optional clinical badge pill (e.g., 'Clinical', 'ABDM', 'FHIR R4') */
  badge?: string;
  /** Optional route to link to (e.g., '/en'). If provided, logo wraps in a Link. */
  linkTo?: string;
  /** Extra CSS classes for outer container */
  className?: string;
  /** Extra CSS classes for the text container */
  textClassName?: string;
}

const SIZE_MAP: Record<
  'xs' | 'sm' | 'md' | 'lg' | 'xl',
  { px: number; textSize: string; tagSize: string; gap: string }
> = {
  xs: { px: 24, textSize: 'text-sm font-black', tagSize: 'text-[9px]', gap: 'gap-1.5' },
  sm: { px: 30, textSize: 'text-base font-black', tagSize: 'text-[10px]', gap: 'gap-2' },
  md: { px: 38, textSize: 'text-lg font-black', tagSize: 'text-[11px]', gap: 'gap-2.5' },
  lg: { px: 46, textSize: 'text-xl font-black', tagSize: 'text-xs', gap: 'gap-3' },
  xl: { px: 58, textSize: 'text-2xl font-black', tagSize: 'text-xs', gap: 'gap-3.5' },
};

/**
 * Authentic DrGodly Vector Logo Mark
 * Designed with a modern Silicon Valley clinical shield, precision medical cross,
 * radiant vital core node, and ambient AI intelligence spark.
 */
export const DrGodlyLogoMark: React.FC<{ sizePx: number; className?: string }> = ({
  sizePx,
  className = '',
}) => {
  // Unique gradient ID to avoid SVG ID collision across multiple instances on the same page
  const gradId = React.useId().replace(/:/g, '');

  return (
    <div
      style={{ width: sizePx, height: sizePx }}
      className={`relative shrink-0 flex items-center justify-center transition-all duration-300 hover:scale-105 select-none ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
        aria-hidden="true"
      >
        <defs>
          {/* Main Dimensional Medical Gradient */}
          <linearGradient id={`drgodly-base-${gradId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E40AF" />
            <stop offset="40%" stopColor="#2563EB" />
            <stop offset="78%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          {/* Frosted Glass Top Bezel Highlight */}
          <linearGradient id={`drgodly-rim-${gradId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.5" />
          </linearGradient>

          {/* Inner Vital Core Radial Glow */}
          <radialGradient id={`drgodly-core-${gradId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="55%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </radialGradient>

          {/* Subtle Ambient Soft Shadow */}
          <filter id={`drgodly-shadow-${gradId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#1D4ED8" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* ── 1. Rounded Squircle Clinical Shield Base ── */}
        <rect
          x="7"
          y="7"
          width="86"
          height="86"
          rx="25"
          fill={`url(#drgodly-base-${gradId})`}
          filter={`url(#drgodly-shadow-${gradId})`}
        />

        {/* ── 2. Frosted Inner Rim Border ── */}
        <rect
          x="8.5"
          y="8.5"
          width="83"
          height="83"
          rx="23.5"
          stroke={`url(#drgodly-rim-${gradId})`}
          strokeWidth="1.75"
        />

        {/* ── 3. Embedded Precision White Medical Cross with Pill Ends ── */}
        {/* Vertical Bar */}
        <rect x="36" y="23" width="28" height="54" rx="8" fill="#FFFFFF" />
        {/* Horizontal Bar */}
        <rect x="23" y="36" width="54" height="28" rx="8" fill="#FFFFFF" />

        {/* ── 4. Central Vital Pulse Node (Heart of Clinical Intelligence) ── */}
        <circle cx="50" cy="50" r="7.5" fill={`url(#drgodly-core-${gradId})`} />
        <circle cx="50" cy="50" r="3.2" fill="#FFFFFF" />

        {/* ── 5. Ambient 4-Point AI Intelligence Sparkle (Top-Right) ── */}
        <path
          d="M79 17 C79 21.5 83 22.5 83 22.5 C83 22.5 79 23.5 79 28 C79 23.5 75 22.5 75 22.5 C75 22.5 79 21.5 79 17 Z"
          fill="#38BDF8"
        />
        <circle cx="79" cy="22.5" r="1.2" fill="#FFFFFF" />
      </svg>
    </div>
  );
};

export const DrGodlyLogo: React.FC<DrGodlyLogoProps> = ({
  size = 'md',
  showText = true,
  tagline = 'AI for Better Care',
  theme = 'auto',
  badge,
  linkTo,
  className = '',
  textClassName = '',
}) => {
  const isKey = typeof size === 'string' && size in SIZE_MAP;
  const config = isKey
    ? SIZE_MAP[size as keyof typeof SIZE_MAP]
    : {
        px: typeof size === 'number' ? size : 38,
        textSize: 'text-lg font-black',
        tagSize: 'text-[11px]',
        gap: 'gap-2.5',
      };

  const isDark = theme === 'dark';
  const titleColor = isDark
    ? 'text-white'
    : 'text-slate-900 dark:text-white';
  const subtitleColor = isDark
    ? 'text-slate-400'
    : 'text-slate-500 dark:text-slate-400';

  const content = (
    <div className={`inline-flex items-center ${config.gap} group select-none ${className}`}>
      <DrGodlyLogoMark sizePx={config.px} />

      {showText && (
        <div className={`flex flex-col text-left leading-none ${textClassName}`}>
          <div className="flex items-center gap-1.5">
            <span
              className={`${config.textSize} tracking-tight transition-colors duration-200 ${titleColor}`}
            >
              Dr<span className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent">Godly</span>
            </span>
            {badge && (
              <span className="text-[9px] uppercase tracking-wider font-extrabold bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 px-1.5 py-0.5 rounded border border-blue-200/80 dark:border-blue-800">
                {badge}
              </span>
            )}
          </div>
          {tagline && (
            <span
              className={`${config.tagSize} font-medium tracking-tight mt-1 transition-colors duration-200 ${subtitleColor}`}
            >
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link href={linkTo} className="inline-flex items-center focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
};

export default DrGodlyLogo;
