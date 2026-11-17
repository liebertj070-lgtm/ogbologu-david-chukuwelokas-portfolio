import {
  ArrowDown,
  ArrowUp,
  Clapperboard,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Film,
  Image as ImageIcon,
  Layers,
  Monitor,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  CREATE_MEDIA_ITEMS,
  DESIGN_PROJECTS,
  EXPERIENCES,
  IMAGE_SLOTS,
  JUTIMA_PROJECT,
  PROFILE,
  SKILL_GROUPS,
  ZONE_WAYPOINTS,
} from '../data/content';
import type { CaseStudyProject, CreateMediaItem } from '../data/content';
import type { QualityMode, ResolvedQuality, ZoneId } from '../types/portfolio';
import { ContactForm } from './ContactForm';
import { QualityMenu } from './QualityMenu';

interface HudOverlayProps {
  activeZone: ZoneId;
  scrollProgressRef: React.MutableRefObject<number>;
  onJumpToZone: (zoneId: ZoneId) => void;
  onOpenProject: (project: CaseStudyProject) => void;
  onOpenMedia: (item: CreateMediaItem) => void;
  onTriggerClapper: () => void;
  onDownloadCv: (type: 'uiux' | 'video') => void;
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

export function HudOverlay({
  activeZone,
  scrollProgressRef,
  onJumpToZone,
  onOpenProject,
  onOpenMedia,
  onTriggerClapper,
  onDownloadCv,
  qualityMode,
  resolvedQuality,
  onChangeQuality,
  audioEnabled,
  onToggleAudio,
  fallback2D,
  onToggleFallback2D,
  reducedMotion,
  onToggleReducedMotion,
}: HudOverlayProps) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [hudMinimized, setHudMinimized] = useState(false);
  const [showLiveIframe, setShowLiveIframe] = useState(false);
  const [showJutimaDetail, setShowJutimaDetail] = useState(false);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = setInterval(() => {
      setRoleIndex((i) => (i + 1) % PROFILE.roles.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [reducedMotion]);

  useEffect(() => {
    let lastPct = -1;
    const updatePct = () => {
      const nextPct = Math.round(scrollProgressRef.current * 100);
      if (nextPct !== lastPct && pctRef.current) {
        lastPct = nextPct;
        pctRef.current.textContent = `${nextPct}% · Scroll / ↑↓`;
      }
    };
    updatePct();
    window.addEventListener('scroll', updatePct, { passive: true });
    return () => window.removeEventListener('scroll', updatePct);
  }, [scrollProgressRef]);

  const topNavZones: ZoneId[] = ['hero', 'design', 'build', 'create', 'contact'];
  const portraitSlot = IMAGE_SLOTS['IMG-01'];

  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="pointer-events-auto flex h-14 items-center justify-between gap-4 border-b border-white/10 bg-[#080A0E]/90 px-4 sm:gap-8 sm:px-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onJumpToZone('hero')}
          className="font-display text-base font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-[#FF6A1A] transition-colors focus-visible:outline-2 focus-visible:outline-[#FF6A1A]"
        >
          {PROFILE.preferredName} · {PROFILE.initials}
        </button>

        {/* Zone 2: 5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Studio zones">
          {topNavZones.map((zid) => {
            const wp = ZONE_WAYPOINTS.find((w) => w.id === zid)!;
            const active = activeZone === zid;
            return (
              <button
                key={zid}
                type="button"
                onClick={() => onJumpToZone(zid)}
                className={`text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#FF6A1A] ${
                  active
                    ? 'text-[#FF6A1A] underline decoration-[#FF6A1A] underline-offset-8'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                {wp.shortLabel}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onJumpToZone('contact')}
            className="rounded-lg bg-[#FF6A1A] px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-[#ff7f3a] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-white"
          >
            Contact me
          </button>
        </div>
      </header>

      {/* Main Content Stage (bottom-left anchored so center 3D scene remains open) */}
      <div className="relative flex flex-1 items-end justify-between p-4 sm:p-8">
        {!hudMinimized && (
          <section
            key={activeZone}
            aria-label={`Active studio zone: ${activeZone}`}
            className="pointer-events-auto animate-reveal-up max-h-[68vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/12 bg-[#090B10]/90 p-5 shadow-2xl sm:p-6"
          >
            {/* HERO */}
            {activeZone === 'hero' && (
              <div className="space-y-4">
                <p className="font-mono text-xs tracking-wider text-[#FF6A1A]">
                  {PROFILE.studioTitle} · {PROFILE.location}
                </p>
                <h1 className="font-display text-3xl font-extrabold leading-[1.05] tracking-tight text-white text-balance sm:text-4xl">
                  {PROFILE.fullName}
                </h1>
                <div className="flex items-center gap-2 text-sm text-[#4DE1FF] font-mono">
                  <span>{PROFILE.roles[roleIndex]}</span>
                </div>
                <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">
                  {PROFILE.pitch}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => onJumpToZone('about')}
                    data-cursor="Enter"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#FF6A1A] px-5 py-2.5 text-xs font-semibold text-black transition-colors hover:bg-[#ff7f3a] whitespace-nowrap"
                  >
                    <span>Enter the Studio</span>
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onJumpToZone('contact')}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/18 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:border-[#4DE1FF] whitespace-nowrap"
                  >
                    <span>Contact me</span>
                  </button>
                </div>
              </div>
            )}

            {/* ABOUT */}
            {activeZone === 'about' && (
              <div className="space-y-4">
                <p className="font-mono text-xs text-[#4DE1FF]">02 · Workbench &amp; Profile</p>
                <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                  About {PROFILE.preferredName}
                </h2>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div
                    className={`w-24 shrink-0 overflow-hidden rounded-xl bg-[#0D1119] p-1.5 ${
                      portraitSlot.src
                        ? 'border border-[#4DE1FF]/45'
                        : 'border border-dashed border-[#4DE1FF]/45'
                    }`}
                  >
                    {portraitSlot.src ? (
                      <img
                        src={portraitSlot.src}
                        alt={PROFILE.fullName}
                        referrerPolicy="no-referrer"
                        className="aspect-[3/4] w-full rounded-lg object-cover object-top"
                      />
                    ) : (
                      <div className="flex aspect-[3/4] flex-col items-center justify-center gap-1 rounded-lg bg-[#07090E] text-center">
                        <ImageIcon className="h-4 w-4 text-[#4DE1FF]" />
                        <span className="font-mono text-[10px] text-white">IMG-01</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-200">{PROFILE.bio}</p>
                </div>
                <div className="border-t border-white/10 pt-3 text-xs text-zinc-300 space-y-1.5">
                  <p className="font-semibold text-white">
                    {PROFILE.education.university.degree} · {PROFILE.education.university.institution}
                  </p>
                  <p className="text-zinc-400">
                    {PROFILE.education.university.status} · Coursework:{' '}
                    {PROFILE.education.university.coursework.join(', ')}
                  </p>
                  <p className="text-zinc-400">
                    {PROFILE.education.secondary.qualification} · {PROFILE.education.secondary.institution} ({PROFILE.education.secondary.period})
                  </p>
                </div>
              </div>
            )}

            {/* ZONE 1: DESIGN */}
            {activeZone === 'design' && (
              <div className="space-y-4">
                <p className="font-mono text-xs text-[#FF6A1A]">03 · Zone 1: Design</p>
                <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                  Figma Systems &amp; Interactive Prototypes
                </h2>
                <p className="text-sm text-zinc-300">
                  Click a floating glass screen in the hangar—or choose a case study below—to fly in and inspect the full UX journey.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {DESIGN_PROJECTS.map((proj) => (
                    <button
                      key={proj.id}
                      type="button"
                      onClick={() => onOpenProject(proj)}
                      data-cursor="View"
                      className="group rounded-xl border border-white/12 bg-[#11151E] p-3.5 text-left transition-colors hover:border-[#FF6A1A]"
                    >
                      <p className="font-mono text-[11px] text-[#4DE1FF]">{proj.stack.join(' · ')}</p>
                      <h3 className="mt-1 font-display text-base font-bold text-white group-hover:text-[#FF6A1A]">
                        {proj.title}
                      </h3>
                      <p className="mt-1 text-xs text-zinc-400 line-clamp-2">{proj.summary}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ZONE 2: BUILD */}
            {activeZone === 'build' && (
              <div className="space-y-4">
                <p className="font-mono text-xs text-[#4DE1FF]">04 · Zone 2: Build</p>
                <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                  Design-to-Code Engineering &amp; Stack
                </h2>
                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href="https://kelvjessia2.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF6A1A] px-3.5 py-2 text-xs font-semibold text-black hover:bg-[#ff7f3a]"
                  >
                    <span>Open Live Kelvjessia</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setShowLiveIframe((v) => !v)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white hover:border-[#4DE1FF]"
                  >
                    <Monitor className="h-3.5 w-3.5 text-[#4DE1FF]" />
                    <span>{showLiveIframe ? 'Hide Live Frame' : 'Preview in Frame'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowJutimaDetail((v) => !v)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:border-white/35"
                  >
                    <Layers className="h-3.5 w-3.5 text-[#FF6A1A]" />
                    <span>JUTIMA (University)</span>
                  </button>
                </div>

                {showLiveIframe && (
                  <div className="rounded-xl border border-white/12 bg-black p-2">
                    <iframe
                      src="https://kelvjessia2.vercel.app/"
                      title="Kelvjessia Live Preview"
                      className="h-56 w-full rounded-lg bg-white"
                    />
                  </div>
                )}

                {showJutimaDetail && (
                  <div className="rounded-xl border border-white/12 bg-[#11151E] p-3.5 text-xs">
                    <p className="font-mono text-[#4DE1FF]">{JUTIMA_PROJECT.context} · {JUTIMA_PROJECT.stack.join(' / ')}</p>
                    <p className="mt-1 font-semibold text-white">{JUTIMA_PROJECT.title}</p>
                    <p className="mt-1 text-zinc-300">{JUTIMA_PROJECT.summary}</p>
                  </div>
                )}

                {/* Grouped Skills exactly as PART 2 */}
                <div className="space-y-2.5 border-t border-white/10 pt-3">
                  {SKILL_GROUPS.map((group) => (
                    <div key={group.category} className="space-y-1">
                      <h3 className="font-mono text-[11px] font-semibold" style={{ color: group.accent }}>
                        {group.category}
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {group.items.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-zinc-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ZONE 3: CREATE */}
            {activeZone === 'create' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-xs text-[#FF6A1A]">05 · Zone 3: Create</p>
                  <button
                    type="button"
                    onClick={onTriggerClapper}
                    data-cursor="Clap"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#FF6A1A]/45 bg-[#FF6A1A]/12 px-2.5 py-1 font-mono text-[11px] font-semibold text-[#FF6A1A] hover:bg-[#FF6A1A]/20"
                  >
                    <Clapperboard className="h-3.5 w-3.5" />
                    <span>Action! (Key: C)</span>
                  </button>
                </div>
                <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                  Documentary, AI Video &amp; Graphics
                </h2>
                <div className="grid gap-2 sm:grid-cols-2">
                  {CREATE_MEDIA_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onOpenMedia(item)}
                      data-cursor="Play"
                      className="rounded-xl border border-white/12 bg-[#11151E] p-3 text-left transition-colors hover:border-[#FF6A1A]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] text-[#4DE1FF]">{item.category}</span>
                        <Film className="h-3.5 w-3.5 text-zinc-400" />
                      </div>
                      <p className="mt-1 text-xs font-semibold text-white">{item.title}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* EXPERIENCE */}
            {activeZone === 'experience' && (
              <div className="space-y-4">
                <p className="font-mono text-xs text-[#4DE1FF]">06 · Floor-Rail Timeline</p>
                <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                  Experience
                </h2>
                <div className="space-y-3">
                  {EXPERIENCES.map((exp) => (
                    <div
                      key={exp.id}
                      className="rounded-xl border border-white/12 bg-[#11151E] p-4 space-y-2"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-display text-base font-bold text-white">
                          {exp.role}, {exp.organization}
                        </h3>
                        <span className="font-mono text-[11px]" style={{ color: exp.accentColor }}>
                          {exp.period}
                        </span>
                      </div>
                      {exp.location && (
                        <p className="text-xs text-zinc-400">{exp.location}</p>
                      )}
                      <ul className="space-y-1.5 text-xs leading-relaxed text-zinc-300">
                        {exp.bullets.map((b, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#FF6A1A]" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CONTACT & CV FINALE */}
            {activeZone === 'contact' && (
              <div className="space-y-4">
                <p className="font-mono text-xs text-[#FF6A1A]">07 · Control Room Finale</p>
                <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                  CVs &amp; Direct Contact
                </h2>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => onDownloadCv('uiux')}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#FF6A1A] px-4 py-2.5 text-xs font-semibold text-black hover:bg-[#ff7f3a]"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{PROFILE.cvFiles.uiux.label}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDownloadCv('video')}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#4DE1FF]/45 bg-[#4DE1FF]/12 px-4 py-2.5 text-xs font-semibold text-[#4DE1FF] hover:bg-[#4DE1FF]/20"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>{PROFILE.cvFiles.videoContent.label}</span>
                  </button>
                </div>

                <ContactForm />

                <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs text-zinc-400">
                  <span>
                    © {new Date().getFullYear()} {PROFILE.fullName}
                  </span>
                  <button
                    type="button"
                    onClick={() => onJumpToZone('hero')}
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-[#FF6A1A] hover:underline"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                    <span>Back to start</span>
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Right-side compact controls & zone scrubber */}
        <div className="pointer-events-auto ml-auto flex flex-col items-end gap-2.5 self-end">
          {/* Vertical Zone Waypoint Dots (hidden on smallest phones) */}
          <div className="hidden sm:flex flex-col items-end gap-1.5 rounded-xl border border-white/10 bg-[#090B10]/85 p-2.5">
            {ZONE_WAYPOINTS.map((wp) => {
              const isCurrent = wp.id === activeZone;
              return (
                <button
                  key={wp.id}
                  type="button"
                  onClick={() => onJumpToZone(wp.id)}
                  className="group flex items-center gap-2 text-right focus-visible:outline-2 focus-visible:outline-[#FF6A1A]"
                  aria-label={`Jump to ${wp.label}`}
                >
                  <span
                    className={`font-mono text-[11px] transition-colors ${
                      isCurrent ? 'text-[#FF6A1A] font-semibold' : 'text-zinc-400 group-hover:text-white'
                    }`}
                  >
                    {wp.shortLabel}
                  </span>
                  <span
                    className={`h-2 w-2 rounded-full transition-all ${
                      isCurrent ? 'w-4 bg-[#FF6A1A]' : 'bg-zinc-600 group-hover:bg-zinc-300'
                    }`}
                  />
                </button>
              );
            })}
            <div className="mt-1 h-px w-full bg-white/10" />
            <span ref={pctRef} className="font-mono text-[10px] tabular-nums text-zinc-400">
              0% · Scroll / ↑↓
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setHudMinimized((v) => !v)}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-white/12 bg-[#0D0F14]/90 px-3 text-xs font-medium text-zinc-200 transition-colors hover:border-[#4DE1FF]/60 hover:text-white"
              aria-pressed={hudMinimized}
            >
              {hudMinimized ? (
                <>
                  <Eye className="h-3.5 w-3.5 text-[#4DE1FF]" />
                  <span>Show Panel</span>
                </>
              ) : (
                <>
                  <EyeOff className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="hidden sm:inline">Inspect 3D</span>
                </>
              )}
            </button>

            <QualityMenu
              qualityMode={qualityMode}
              resolvedQuality={resolvedQuality}
              onChangeQuality={onChangeQuality}
              audioEnabled={audioEnabled}
              onToggleAudio={onToggleAudio}
              fallback2D={fallback2D}
              onToggleFallback2D={onToggleFallback2D}
              reducedMotion={reducedMotion}
              onToggleReducedMotion={onToggleReducedMotion}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
