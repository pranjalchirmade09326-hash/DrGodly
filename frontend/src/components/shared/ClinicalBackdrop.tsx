/**
 * ClinicalBackdrop — decorative abstract surface for the marketing hero and the
 * auth split panel.
 *
 * Layer: components/shared
 *
 * Instead of a stock hospital photograph it composes a clean clinical surface
 * from the theme itself: a token-tinted mesh gradient, a faded ECG lattice,
 * monitor pulse rings, medical plus glyphs, and a sweeping waveform. Two
 * reasons for that choice, both deliberate:
 *
 *   1. It stays legible in all nine colour themes and in dark mode, because
 *      every layer mixes from --primary / --border / --background rather than
 *      carrying its own hue.
 *   2. It never fetches a remote asset, so the above-the-fold view cannot end up
 *      half-painted, and the headline contrast is guaranteed (a photo would
 *      need a scrim tuned per image).
 *
 * Purely presentational: aria-hidden, pointer-events-none, and the waveform
 * sweep is disabled under prefers-reduced-motion (see globals.css).
 */

import { cn } from "@/lib/utils";

/**
 * One heartbeat expressed in relative path commands: net dy is 0 so repeated
 * beats hold the baseline, and net dx is 192 units.
 */
const ECG_BEAT = "h 120 l 14 -8 l 10 10 l 16 -84 l 18 150 l 14 -68";
const ECG_VIEWBOX = "0 0 1440 240";

function buildEcgPath(beats: number): string {
  return `M -80 120 ${ECG_BEAT.repeat(beats)} h 200`;
}

/** Small plus glyph used as a sparse medical motif. */
function PlusGlyph({
  className,
  size = 22,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      className={cn("absolute text-primary/20", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 4v16M4 12h16"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ClinicalBackdrop({
  className,
  withWaveform = true,
}: {
  className?: string;
  withWaveform?: boolean;
}) {
  const ecgPath = buildEcgPath(7);

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {/* Token-tinted mesh + faded clinical lattice + readability scrim. */}
      <div className="hero-clinical-mesh absolute inset-0" />
      <div className="hero-clinical-grid absolute inset-0 opacity-70" />
      <div className="hero-clinical-scrim absolute inset-0" />

      {/* Monitor pulse rings, cropped by the corner like a vitals readout. */}
      <svg
        className="absolute -right-20 -top-20 h-80 w-80 text-primary/15 sm:-right-28 sm:-top-28 sm:h-[30rem] sm:w-[30rem]"
        viewBox="0 0 200 200"
        fill="none"
      >
        {[94, 76, 58, 40].map((r) => (
          <circle key={r} cx="100" cy="100" r={r} stroke="currentColor" strokeWidth="1" />
        ))}
        <circle cx="100" cy="100" r="7" className="fill-current opacity-50" />
      </svg>

      {/* Sparse medical plus glyphs. */}
      <PlusGlyph className="left-[6%] top-[18%] hidden sm:block" size={20} />
      <PlusGlyph className="left-[22%] top-[68%] hidden lg:block" size={26} />
      <PlusGlyph className="right-[30%] top-[12%] hidden lg:block" size={18} />
      <PlusGlyph className="right-[8%] bottom-[22%] hidden sm:block" size={22} />

      {/* ECG trace: a static ghost of the full line keeps the shape legible
          while the animated copy sweeps across it. */}
      {withWaveform && (
        <svg
          className="absolute inset-x-0 bottom-4 block w-full text-primary/25 sm:bottom-8"
          viewBox={ECG_VIEWBOX}
          fill="none"
          preserveAspectRatio="xMidYMid meet"
        >
          <path d={ecgPath} className="ecg-line opacity-30" />
          <path d={ecgPath} className="ecg-line ecg-line--sweep" />
        </svg>
      )}
    </div>
  );
}
