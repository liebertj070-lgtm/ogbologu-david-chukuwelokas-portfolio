import { Download, ExternalLink, FileText, Film, Image as ImageIcon, Box } from 'lucide-react';
import {
  CREATE_MEDIA_ITEMS,
  DESIGN_PROJECTS,
  EXPERIENCES,
  IMAGE_SLOTS,
  JUTIMA_PROJECT,
  PROFILE,
  SKILL_GROUPS,
} from '../data/content';
import type { CaseStudyProject, CreateMediaItem } from '../data/content';
import { ContactForm } from './ContactForm';

interface Fallback2DProps {
  webglAvailable: boolean;
  onEnable3D: () => void;
  onOpenProject: (project: CaseStudyProject) => void;
  onOpenMedia: (item: CreateMediaItem) => void;
  onDownloadCv: (type: 'uiux' | 'video') => void;
}

export function Fallback2D({
  webglAvailable,
  onEnable3D,
  onOpenProject,
  onOpenMedia,
  onDownloadCv,
}: Fallback2DProps) {
  const portraitSlot = IMAGE_SLOTS['IMG-01'];

  return (
    <div className="min-h-screen bg-[#090A0D] text-zinc-100">
      {/* Top Bar Contract: 3 zones */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-8 border-b border-white/10 bg-[#090A0D]/95 px-6 lg:px-12">
        <a
          href="#top"
          className="font-display text-lg font-extrabold tracking-tight text-white whitespace-nowrap shrink-0"
        >
          {PROFILE.preferredName} · {PROFILE.initials}
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <a href="#about" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            About
          </a>
          <a href="#design" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Design
          </a>
          <a href="#build" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Build
          </a>
          <a href="#create" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Create
          </a>
          <a href="#experience" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Experience
          </a>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#contact"
            className="rounded-lg bg-[#FF6A1A] px-4 py-2 text-xs font-semibold text-black hover:bg-[#ff7f3a] whitespace-nowrap shrink-0"
          >
            Contact me
          </a>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-6xl space-y-20 px-6 py-14 lg:px-8">
        {/* Hero */}
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-5">
            <p className="font-mono text-xs tracking-wider text-[#FF6A1A]">
              {PROFILE.studioTitle} · {PROFILE.location}
            </p>
            <h1 className="font-display text-4xl font-extrabold leading-[1.04] tracking-tight text-white text-balance sm:text-6xl">
              {PROFILE.fullName}
            </h1>
            <p className="font-mono text-sm text-[#4DE1FF]">{PROFILE.roles.join(' / ')}</p>
            <p className="max-w-xl text-base leading-relaxed text-zinc-300">{PROFILE.pitch}</p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#design"
                className="rounded-lg bg-[#FF6A1A] px-5 py-2.5 text-xs font-semibold text-black hover:bg-[#ff7f3a]"
              >
                Explore Case Studies
              </a>
              <a
                href="#contact"
                className="rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white hover:border-[#4DE1FF]"
              >
                Contact me
              </a>
              {webglAvailable && (
                <button
                  type="button"
                  onClick={onEnable3D}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#4DE1FF]/40 bg-[#4DE1FF]/10 px-4 py-2.5 text-xs font-semibold text-[#4DE1FF] hover:bg-[#4DE1FF]/20"
                >
                  <Box className="h-3.5 w-3.5" />
                  <span>Enter 3D Studio</span>
                </button>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/12 bg-[#10131A] p-4">
            {portraitSlot.src ? (
              <img
                src={portraitSlot.src}
                alt={PROFILE.fullName}
                referrerPolicy="no-referrer"
                className="aspect-[3/4] w-full rounded-xl object-cover object-top"
              />
            ) : (
              <div className="flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-[#0A0C11] p-6 text-center">
                <ImageIcon className="h-7 w-7 text-[#FF6A1A]" />
                <span className="font-mono text-xs font-semibold text-white">IMG-01</span>
                <span className="text-xs text-zinc-400">Portrait / Profile Photo Slot</span>
              </div>
            )}
          </div>
        </section>

        {/* About & Education */}
        <section id="about" className="grid gap-8 border-t border-white/10 pt-14 md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="font-display text-2xl font-extrabold text-white">About</h2>
            <p className="text-sm leading-relaxed text-zinc-300">{PROFILE.bio}</p>
          </div>
          <div className="space-y-4 rounded-2xl border border-white/10 bg-[#10131A] p-6">
            <h3 className="font-mono text-xs font-semibold text-[#4DE1FF]">Education</h3>
            <div className="space-y-1">
              <p className="font-semibold text-white">
                {PROFILE.education.university.degree} — {PROFILE.education.university.institution}
              </p>
              <p className="text-xs text-zinc-400">{PROFILE.education.university.status}</p>
              <p className="text-xs text-zinc-300">
                Coursework: {PROFILE.education.university.coursework.join(', ')}
              </p>
            </div>
            <div className="border-t border-white/10 pt-3 space-y-1">
              <p className="font-semibold text-white">
                {PROFILE.education.secondary.qualification} — {PROFILE.education.secondary.institution}
              </p>
              <p className="text-xs text-zinc-400">{PROFILE.education.secondary.period}</p>
            </div>
          </div>
        </section>

        {/* Design & Build Projects */}
        <section id="design" className="space-y-6 border-t border-white/10 pt-14">
          <div className="space-y-1">
            <p className="font-mono text-xs text-[#FF6A1A]">01. Design &amp; Frontend Engineering</p>
            <h2 className="font-display text-3xl font-extrabold text-white">Selected Case Studies</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {DESIGN_PROJECTS.map((proj) => (
              <article
                key={proj.id}
                className="flex flex-col justify-between rounded-2xl border border-white/12 bg-[#10131A] p-6 space-y-5"
              >
                <div className="space-y-3">
                  <p className="font-mono text-xs text-[#4DE1FF]">
                    {proj.badge} · {proj.stack.join(' / ')}
                  </p>
                  <h3 className="font-display text-2xl font-extrabold text-white">{proj.title}</h3>
                  <p className="text-sm text-zinc-300">{proj.summary}</p>
                  <ul className="space-y-1.5 text-xs leading-relaxed text-zinc-400">
                    {proj.highlights.map((h, i) => (
                      <li key={i}>• {h}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => onOpenProject(proj)}
                    className="rounded-lg bg-[#FF6A1A] px-4 py-2 text-xs font-semibold text-black hover:bg-[#ff7f3a]"
                  >
                    Read Full Case Study
                  </button>
                  {proj.links.slice(0, 2).map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 px-3 py-2 text-xs text-zinc-200 hover:border-[#4DE1FF]"
                    >
                      <span>{l.label}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {/* JUTIMA Compact Card */}
          <div id="build" className="rounded-2xl border border-white/10 bg-[#10131A] p-5">
            <p className="font-mono text-xs text-[#4DE1FF]">
              {JUTIMA_PROJECT.context} · {JUTIMA_PROJECT.stack.join(' · ')}
            </p>
            <h3 className="mt-1 font-display text-lg font-bold text-white">{JUTIMA_PROJECT.title}</h3>
            <p className="mt-1 text-sm text-zinc-300">{JUTIMA_PROJECT.summary}</p>
          </div>
        </section>

        {/* Skills */}
        <section className="space-y-5 border-t border-white/10 pt-14">
          <h2 className="font-display text-2xl font-extrabold text-white">Skills</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SKILL_GROUPS.map((g) => (
              <div key={g.category} className="rounded-2xl border border-white/10 bg-[#10131A] p-5 space-y-2.5">
                <h3 className="font-mono text-xs font-semibold" style={{ color: g.accent }}>
                  {g.category}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {g.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Create Media & Graphics */}
        <section id="create" className="space-y-6 border-t border-white/10 pt-14">
          <div className="space-y-1">
            <p className="font-mono text-xs text-[#FF6A1A]">02. Video, AI Content &amp; Graphics</p>
            <h2 className="font-display text-3xl font-extrabold text-white">Productions &amp; Visuals</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CREATE_MEDIA_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onOpenMedia(item)}
                className="flex flex-col justify-between rounded-2xl border border-white/12 bg-[#10131A] p-5 text-left transition-colors hover:border-[#FF6A1A]"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#4DE1FF]">{item.category}</span>
                    <Film className="h-4 w-4 text-zinc-400" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-zinc-400">{item.description}</p>
                </div>
                <p className="mt-4 font-mono text-[11px] text-[#FF6A1A]">{item.tools.join(' · ')}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="space-y-6 border-t border-white/10 pt-14">
          <h2 className="font-display text-3xl font-extrabold text-white">Experience</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {EXPERIENCES.map((exp) => (
              <div key={exp.id} className="rounded-2xl border border-white/12 bg-[#10131A] p-6 space-y-3">
                <p className="font-mono text-xs" style={{ color: exp.accentColor }}>
                  {exp.period}
                </p>
                <h3 className="font-display text-xl font-bold text-white">
                  {exp.role}, {exp.organization}
                </h3>
                {exp.location && <p className="text-xs text-zinc-400">{exp.location}</p>}
                <ul className="space-y-2 text-sm text-zinc-300">
                  {exp.bullets.map((b, i) => (
                    <li key={i}>• {b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CV + Contact */}
        <section id="contact" className="grid gap-8 border-t border-white/10 pt-14 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="font-display text-3xl font-extrabold text-white">CVs &amp; Contact</h2>
            <p className="text-sm text-zinc-300">
              Download either tailored CV or send a message directly.
            </p>
            <div className="flex flex-wrap gap-3">
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
          </div>

          <div className="rounded-2xl border border-white/12 bg-[#10131A] p-6">
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-zinc-500">
        {PROFILE.fullName} ({PROFILE.preferredName}) · {PROFILE.location}
      </footer>
    </div>
  );
}
