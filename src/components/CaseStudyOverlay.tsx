import { ExternalLink, X, Monitor, Smartphone, Image as ImageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { IMAGE_SLOTS } from '../data/content';
import type { CaseStudyProject } from '../data/content';

interface CaseStudyOverlayProps {
  project: CaseStudyProject | null;
  onClose: () => void;
}

export function CaseStudyOverlay({ project, onClose }: CaseStudyOverlayProps) {
  const [showLiveIframe, setShowLiveIframe] = useState(false);

  useEffect(() => {
    setShowLiveIframe(false);
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [project, onClose]);

  if (!project) return null;

  const liveUrl = project.links.find((l) => l.url.includes('vercel.app'))?.url;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/78 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
    >
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0C0F15] shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
          <div className="space-y-1">
            <p className="font-mono text-xs text-[#FF6A1A]">{project.badge}</p>
            <h2 id="case-study-title" className="font-display text-2xl font-extrabold text-white sm:text-3xl">
              {project.title}
            </h2>
            <p className="text-sm text-zinc-400">
              {project.subtitle} · {project.stack.join(' / ')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-zinc-300 transition-colors hover:border-[#FF6A1A] hover:text-white focus-visible:outline-2 focus-visible:outline-[#FF6A1A]"
            aria-label="Close case study and return to hangar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Case Study Content */}
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          {/* Action Links Row */}
          <div className="flex flex-wrap items-center gap-2.5">
            {project.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                  link.primary
                    ? 'bg-[#FF6A1A] text-black hover:bg-[#ff7f3a]'
                    : 'border border-white/15 bg-white/5 text-zinc-100 hover:border-[#4DE1FF]/60 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ))}

            {liveUrl && (
              <button
                type="button"
                onClick={() => setShowLiveIframe((v) => !v)}
                className="inline-flex items-center gap-2 rounded-lg border border-[#4DE1FF]/40 bg-[#4DE1FF]/10 px-4 py-2 text-xs font-semibold text-[#4DE1FF] transition-colors hover:bg-[#4DE1FF]/20 whitespace-nowrap"
              >
                <Monitor className="h-3.5 w-3.5" />
                <span>{showLiveIframe ? 'Hide Embedded Live Site' : 'Preview Live Site Here'}</span>
              </button>
            )}
          </div>

          {/* Optional Embedded Live Site Preview */}
          {showLiveIframe && liveUrl && (
            <div className="space-y-2 rounded-xl border border-white/12 bg-black p-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono">{liveUrl}</span>
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF6A1A] hover:underline"
                >
                  Open in new tab if blocked
                </a>
              </div>
              <iframe
                src={liveUrl}
                title={`${project.title} live site`}
                className="h-[420px] w-full rounded-lg border border-white/10 bg-white"
              />
            </div>
          )}

          {/* Summary & Highlights */}
          <div className="space-y-3">
            <p className="text-base leading-relaxed text-zinc-200">{project.summary}</p>
            <ul className="space-y-2 text-sm leading-relaxed text-zinc-300">
              {project.highlights.map((item, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF6A1A]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Full Case Study Structure */}
          {project.sections && (
            <div className="grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-2">
              {[
                { label: '01. Problem', text: project.sections.problem },
                { label: '02. Users', text: project.sections.users },
                { label: '03. Journey & Flows', text: project.sections.journeyFlows },
                { label: '04. Design Decisions', text: project.sections.designDecisions },
                { label: '05. Screens (Desktop + Mobile)', text: project.sections.screens },
                { label: '06. Build & Tech', text: project.sections.buildAndTech },
                { label: "07. What I'd Do Next", text: project.sections.whatNext },
              ].map((block) => (
                <div
                  key={block.label}
                  className="rounded-xl border border-white/10 bg-[#121620] p-4"
                >
                  <h3 className="mb-1.5 font-mono text-xs font-semibold text-[#4DE1FF]">
                    {block.label}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-300">{block.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Image Slots Grid */}
          <div className="space-y-3 border-t border-white/10 pt-5">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs font-semibold text-zinc-300 uppercase">
                Screen Slots ({project.imageSlots.join(', ')})
              </h3>
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
                <Smartphone className="h-3.5 w-3.5" />
                Desktop &amp; Mobile
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {project.imageSlots.map((slotId) => {
                const slot = IMAGE_SLOTS[slotId];
                if (!slot) return null;
                return (
                  <div
                    key={slotId}
                    className={`overflow-hidden rounded-xl bg-[#10141C] p-2.5 ${
                      slot.src
                        ? 'border border-white/15'
                        : 'border border-dashed border-white/20'
                    }`}
                  >
                    {slot.src ? (
                      <div className="space-y-2">
                        <img
                          src={slot.src}
                          alt={slot.label}
                          referrerPolicy="no-referrer"
                          className="aspect-video w-full rounded-lg bg-[#07090D] object-contain"
                        />
                        <div className="flex items-center justify-between gap-2 px-1">
                          <span className="font-mono text-[10px] font-semibold text-[#FF6A1A]">
                            {slot.slotId}
                          </span>
                          <span className="truncate text-[11px] text-zinc-300">{slot.label}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex aspect-video flex-col items-center justify-center gap-1.5 rounded-lg bg-[#090B10] px-3 text-center">
                        <ImageIcon className="h-5 w-5 text-[#FF6A1A]" />
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
    </div>
  );
}
