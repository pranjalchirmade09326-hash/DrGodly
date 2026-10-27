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

const SIZE_MAP: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', { px: number; textSize: string; tagSize: string; gap: string }> = {
  xs: { px: 22, textSize: 'text-sm font-bold', tagSize: 'text-[9px]', gap: 'gap-1.5' },
  sm: { px: 28, textSize: 'text-base font-extrabold', tagSize: 'text-[10px]', gap: 'gap-2' },
  md: { px: 36, textSize: 'text-lg font-black', tagSize: 'text-[11px]', gap: 'gap-2.5' },
  lg: { px: 44, textSize: 'text-xl font-black', tagSize: 'text-xs', gap: 'gap-3' },
  xl: { px: 56, textSize: 'text-2xl font-black', tagSize: 'text-xs', gap: 'gap-3.5' },
};

/**
 * Authentic DrGodly Vector Logo Mark
 * Designed in exact concordance with the ChatGPT clinical design specification:
 * Radiant sapphire-to-cyan gradient heart contour with precision centered white medical cross.
 */
export const DrGodlyLogoMark: React.FC<{ sizePx: number; className?: string }> = ({
  sizePx,
  className = '',
}) => {
  // Unique gradient ID to avoid SVG ID collision across multiple instances
  const gradId = React.useId().replace(/:/g, '');

  return (
    <div
      style={{ width: sizePx, height: sizePx }}
      className={`relative shrink-0 flex items-center justify-center transition-transform hover:scale-105 duration-200 ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm select-none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`drgodly-grad-${gradId}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1D4ED8" />
            <stop offset="42%" stopColor="#2563EB" />
            <stop offset="78%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <filter id={`drgodly-glow-${gradId}`} x="-15%" y="-15%" width="130%" height="135%">
            <feDropShadow dx="0" dy="3.5" stdDeviation="4" floodColor="#0284C7" floodOpacity="0.32" />
          </filter>
        </defs>

        {/* Radiant Heart Geometry */}
        <path
          d="M 50 24 C 50 24, 42 10, 28 10 C 15 10, 6 20, 6 34 C 6 56, 32 72, 50 90 C 68 72, 94 56, 94 34 C 94 20, 85 10, 72 10 C 58 10, 50 24, 50 24 Z"
          fill={`url(#drgodly-grad-${gradId})`}
          filter={`url(#drgodly-glow-${gradId})`}
        />

        {/* Embedded Precision White Medical Cross */}
        <rect x="33" y="36" width="34" height="12" rx="3.5" fill="#FFFFFF" />
        <rect x="44" y="25" width="12" height="34" rx="3.5" fill="#FFFFFF" />
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
        px: typeof size === 'number' ? size : 36,
        textSize: 'text-lg font-black',
        tagSize: 'text-[11px]',
        gap: 'gap-2.5',
      };

  const isDark = theme === 'dark';
  const titleColor = isDark
    ? 'text-white group-hover:text-cyan-300'
    : 'text-slate-900 group-hover:text-blue-600';
  const subtitleColor = isDark ? 'text-slate-400' : 'text-slate-500';

  const content = (
    <div className={`inline-flex items-center ${config.gap} group select-none ${className}`}>
      <DrGodlyLogoMark sizePx={config.px} />

      {showText && (
        <div className={`flex flex-col text-left leading-none ${textClassName}`}>
          <div className="flex items-center gap-1.5">
            <span
              className={`${config.textSize} tracking-tight transition-colors duration-200 ${titleColor}`}
            >
              DrGodly
            </span>
            {badge && (
              <span className="text-[9px] uppercase tracking-wider font-extrabold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200/80">
                {badge}
              </span>
            )}
          </div>
          {tagline && (
            <span
              className={`${config.tagSize} font-medium tracking-tight mt-0.5 transition-colors duration-200 ${subtitleColor}`}
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
