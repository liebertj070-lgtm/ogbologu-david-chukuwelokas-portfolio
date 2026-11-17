import { ExternalLink, Film, Image as ImageIcon, Play, X } from 'lucide-react';
import { useEffect } from 'react';
import { IMAGE_SLOTS } from '../data/content';
import type { CreateMediaItem } from '../data/content';

interface MediaLightboxProps {
  item: CreateMediaItem | null;
  onClose: () => void;
}

function getEmbedInfo(rawUrl: string): { kind: 'video' | 'iframe' | 'link'; src: string } {
  const url = rawUrl.trim();
  if (/\.(mp4|webm|mov)(\?.*)?$/i.test(url)) {
    return { kind: 'video', src: url };
  }
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  if (ytMatch?.[1]) {
    return { kind: 'iframe', src: `https://www.youtube.com/embed/${ytMatch[1]}` };
  }
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/);
  if (driveMatch?.[1]) {
    return { kind: 'iframe', src: `https://drive.google.com/file/d/${driveMatch[1]}/preview` };
  }
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch?.[1]) {
    return { kind: 'iframe', src: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
  }
  return { kind: 'link', src: url };
}

export function MediaLightbox({ item, onClose }: MediaLightboxProps) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [item, onClose]);

  if (!item) return null;

  const primaryVideo = item.videoUrl ? getEmbedInfo(item.videoUrl) : null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="media-lightbox-title"
    >
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0C0F15] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
          <div>
            <p className="font-mono text-xs text-[#FF6A1A]">{item.category}</p>
            <h2 id="media-lightbox-title" className="font-display text-2xl font-extrabold text-white">
              {item.title}
            </h2>
            <p className="mt-1 text-xs text-zinc-400">{item.tools.join(' · ')}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-zinc-300 transition-colors hover:border-[#FF6A1A] hover:text-white focus-visible:outline-2 focus-visible:outline-[#FF6A1A]"
            aria-label="Close media viewer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto px-6 py-6">
          <p className="text-sm leading-relaxed text-zinc-200">{item.description}</p>

          {primaryVideo && primaryVideo.kind === 'video' && (
            <div className="overflow-hidden rounded-xl border border-white/12 bg-black">
              <video src={primaryVideo.src} controls playsInline className="aspect-video w-full" />
            </div>
          )}

          {primaryVideo && primaryVideo.kind === 'iframe' && (
            <div className="overflow-hidden rounded-xl border border-white/12 bg-black">
              <iframe
                src={primaryVideo.src}
                title={item.title}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="aspect-video w-full border-0"
              />
            </div>
          )}

          {item.placeholderNote && (
            <div className="rounded-xl border border-[#FF6A1A]/30 bg-[#FF6A1A]/8 px-4 py-3 text-xs text-zinc-200">
              <span className="font-mono font-semibold text-[#FF6A1A]">Slot Status: </span>
              {item.placeholderNote}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2.5">
            {item.videoUrl && (
              <a
                href={item.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#FF6A1A] px-4 py-2.5 text-xs font-semibold text-black transition-colors hover:bg-[#ff7f3a]"
              >
                <Play className="h-3.5 w-3.5" />
                <span>Watch Video Link</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}

            {item.externalUrl && (
              <a
                href={item.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#FF6A1A] px-4 py-2.5 text-xs font-semibold text-black transition-colors hover:bg-[#ff7f3a]"
              >
                <span>{item.externalLabel ?? 'Open External Portfolio'}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}

            {item.links?.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:border-[#4DE1FF]"
              >
                <span>{l.label}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>

          <div
            className={`grid gap-3 ${
              item.slotIds.length >= 3 ? 'sm:grid-cols-2 md:grid-cols-3' : 'sm:grid-cols-2'
            }`}
          >
            {item.slotIds.map((slotId) => {
              const slot = IMAGE_SLOTS[slotId];
              if (!slot) return null;
              const targetHref = item.externalUrl || item.videoUrl;
              return (
                <div
                  key={slotId}
                  className={`rounded-xl bg-[#10141C] p-3 ${
                    slot.src
                      ? 'border border-white/15 hover:border-[#FF6A1A]/70 transition-colors'
                      : 'border border-dashed border-white/20'
                  }`}
                >
                  {slot.src ? (
                    targetHref ? (
                      <a
                        href={targetHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block space-y-2"
                      >
                        <img
                          src={slot.src}
                          alt={slot.label}
                          referrerPolicy="no-referrer"
                          className="aspect-[4/5] w-full rounded-lg bg-[#07090D] object-contain"
                        />
                        <div className="flex items-center justify-between gap-2 px-1 text-[11px]">
                          <span className="truncate text-zinc-300 group-hover:text-white">
                            {slot.label}
                          </span>
                          <span className="inline-flex shrink-0 items-center gap-1 font-mono text-[#FF6A1A]">
                            Open <ExternalLink className="h-3 w-3" />
                          </span>
                        </div>
                      </a>
                    ) : (
                      <div className="space-y-2">
                        <img
                          src={slot.src}
                          alt={slot.label}
                          referrerPolicy="no-referrer"
                          className="aspect-video w-full rounded-lg bg-[#07090D] object-contain"
                        />
                        <p className="px-1 text-[11px] text-zinc-300">{slot.label}</p>
                      </div>
                    )
                  ) : (
                    <div className="flex aspect-video flex-col items-center justify-center gap-1.5 rounded-lg bg-[#090B10] px-3 text-center">
                      {item.category === 'Graphic Design' ? (
                        <ImageIcon className="h-5 w-5 text-[#4DE1FF]" />
                      ) : (
                        <Film className="h-5 w-5 text-[#FF6A1A]" />
                      )}
                      <span className="font-mono text-xs font-semibold text-white">{slot.slotId}</span>
                      <span className="text-[11px] text-zinc-400">{slot.label}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
