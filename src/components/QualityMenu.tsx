import { SlidersHorizontal, Volume2, VolumeX, Layers, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { QualityMode, ResolvedQuality } from '../types/portfolio';

interface QualityMenuProps {
  qualityMode: QualityMode;
  resolvedQuality: ResolvedQuality;
  onChangeQuality: (mode: QualityMode) => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  fallback2D: boolean;
  onToggleFallback2D: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export function QualityMenu({
  qualityMode,
  resolvedQuality,
  onChangeQuality,
  audioEnabled,
  onToggleAudio,
  fallback2D,
  onToggleFallback2D,
  reducedMotion,
  onToggleReducedMotion,
}: QualityMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleAudio}
          className="flex h-9 items-center gap-1.5 rounded-lg border border-white/12 bg-[#0D0F14]/90 px-3 text-xs font-medium text-zinc-200 transition-colors hover:border-[#FF6A1A]/60 hover:text-white focus-visible:outline-2 focus-visible:outline-[#FF6A1A]"
          aria-pressed={audioEnabled}
          aria-label={audioEnabled ? 'Mute studio audio' : 'Enable studio audio'}
        >
          {audioEnabled ? (
            <Volume2 className="h-3.5 w-3.5 text-[#FF6A1A]" />
          ) : (
            <VolumeX className="h-3.5 w-3.5 text-zinc-400" />
          )}
          <span className="hidden sm:inline whitespace-nowrap">
            {audioEnabled ? 'Sound On' : 'Sound Off'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 items-center gap-1.5 rounded-lg border border-white/12 bg-[#0D0F14]/90 px-3 text-xs font-medium text-zinc-200 transition-colors hover:border-[#FF6A1A]/60 hover:text-white focus-visible:outline-2 focus-visible:outline-[#FF6A1A]"
          aria-expanded={open}
          aria-label="Open graphics and accessibility settings"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-[#FF6A1A]" />
          <span className="whitespace-nowrap">Studio Settings</span>
        </button>
      </div>

      {open && (
        <div
          className="absolute bottom-12 right-0 z-40 w-72 rounded-xl border border-white/12 bg-[#0B0D12]/95 p-4 text-left shadow-2xl"
          role="dialog"
          aria-label="Graphics and accessibility settings"
        >
          <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-mono text-xs font-semibold text-white">
              Graphics &amp; Controls
            </span>
            <span className="font-mono text-[11px] text-zinc-400">
              Active: {resolvedQuality}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="mb-1.5 block text-xs text-zinc-400">Render Quality</span>
              <div className="grid grid-cols-4 gap-1 rounded-lg bg-black/50 p-1">
                {(['auto', 'high', 'medium', 'low'] as QualityMode[]).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => onChangeQuality(tier)}
                    className={`rounded-md py-1.5 font-mono text-[11px] capitalize transition-colors whitespace-nowrap ${
                      qualityMode === tier
                        ? 'bg-[#FF6A1A] font-semibold text-black'
                        : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-3">
              <span className="flex items-center gap-2 text-xs text-zinc-300">
                <Layers className="h-3.5 w-3.5 text-[#4DE1FF]" />
                <span>2D Readable Mode</span>
              </span>
              <button
                type="button"
                onClick={onToggleFallback2D}
                className={`rounded-md px-2.5 py-1 font-mono text-[11px] transition-colors ${
                  fallback2D
                    ? 'bg-[#4DE1FF] font-semibold text-black'
                    : 'border border-white/15 text-zinc-300 hover:border-white/30'
                }`}
              >
                {fallback2D ? 'On' : 'Off'}
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-3">
              <span className="flex items-center gap-2 text-xs text-zinc-300">
                <Sparkles className="h-3.5 w-3.5 text-[#FF6A1A]" />
                <span>Calm / Reduced Motion</span>
              </span>
              <button
                type="button"
                onClick={onToggleReducedMotion}
                className={`rounded-md px-2.5 py-1 font-mono text-[11px] transition-colors ${
                  reducedMotion
                    ? 'bg-[#FF6A1A] font-semibold text-black'
                    : 'border border-white/15 text-zinc-300 hover:border-white/30'
                }`}
              >
                {reducedMotion ? 'On' : 'Off'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
