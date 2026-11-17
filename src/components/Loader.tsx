import { useEffect, useState } from 'react';
import { PROFILE } from '../data/content';

interface LoaderProps {
  sceneReady: boolean;
  onComplete: () => void;
}

export function Loader({ sceneReady, onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let raf = 0;
    let current = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const target = sceneReady ? 100 : Math.min(88, Math.floor((elapsed / 1200) * 88));
      current += (target - current) * 0.14;
      if (sceneReady && target - current < 0.8) {
        current = 100;
      }
      const rounded = Math.min(100, Math.round(current));
      setProgress(rounded);

      if (rounded >= 100 && sceneReady) {
        setTimeout(() => {
          setExiting(true);
          setTimeout(onComplete, 550);
        }, 180);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [sceneReady, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07080B] transition-opacity duration-500 ${
        exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-live="polite"
      aria-label="Loading The Dockyard Studio"
    >
      {/* Subtle architectural hangar horizon lines */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-25">
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#FF6A1A]/50 to-transparent" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-[#4DE1FF]/40 to-transparent" />
      </div>

      {/* Assembling ODC geometric emblem */}
      <div className="relative flex flex-col items-center gap-6 px-6 text-center">
        <div className="relative flex items-center justify-center">
          <svg
            width="136"
            height="68"
            viewBox="0 0 136 68"
            fill="none"
            className="drop-shadow-[0_0_24px_rgba(255,106,26,0.35)]"
          >
            {/* O */}
            <circle
              cx="26"
              cy="34"
              r="18"
              stroke="#FF6A1A"
              strokeWidth="4.5"
              strokeDasharray="114"
              strokeDashoffset={114 - (114 * progress) / 100}
              className="transition-[stroke-dashoffset] duration-150"
            />
            {/* D */}
            <path
              d="M58 16H71C81.5 16 89 23.5 89 34C89 44.5 81.5 52 71 52H58V16Z"
              stroke="#F4F5F7"
              strokeWidth="4.5"
              strokeDasharray="118"
              strokeDashoffset={118 - (118 * progress) / 100}
              className="transition-[stroke-dashoffset] duration-150"
            />
            {/* C */}
            <path
              d="M126 22C122.5 18 117.5 16 112 16C101.5 16 95 24 95 34C95 44 101.5 52 112 52C117.5 52 122.5 50 126 46"
              stroke="#4DE1FF"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeDasharray="106"
              strokeDashoffset={106 - (106 * progress) / 100}
              className="transition-[stroke-dashoffset] duration-150"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <p className="font-mono text-xs tracking-[0.26em] text-zinc-400 uppercase">
            {PROFILE.studioTitle}
          </p>
          <p className="font-display text-lg font-extrabold tracking-tight text-white">
            {PROFILE.fullName}
          </p>
        </div>

        {/* Real progress counter */}
        <div className="w-56 space-y-2">
          <div className="h-[2px] w-full overflow-hidden bg-zinc-800">
            <div
              className="h-full bg-[#FF6A1A] transition-[width] duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
            <span>{progress < 100 ? 'Entering Hangar' : 'Ready'}</span>
            <span className="tabular-nums text-white">{String(progress).padStart(3, '0')}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
