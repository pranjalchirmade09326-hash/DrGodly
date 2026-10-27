/**
 * AppLogo — the DrGodly authentic brand mark.
 *
 * Layer: client / shared / components
 *
 * Backed by the official SVG vector mark (Heart + Medical Cross with
 * Royal Blue to Electric Cyan gradient) matching the ChatGPT brand specification.
 */

'use client';

import React from 'react';
import { DrGodlyLogoMark } from '@/components/shared/DrGodlyLogo';

export function AppLogo({
  size = 32,
  className,
}: {
  /** Width/height in px. Default 32. */
  size?: number;
  className?: string;
}) {
  return <DrGodlyLogoMark sizePx={size} className={className} />;
}

export default AppLogo;
