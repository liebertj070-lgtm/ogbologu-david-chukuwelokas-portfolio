import Lenis from 'lenis';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SceneRoot } from './components/3d/SceneRoot';
import { CaseStudyOverlay } from './components/CaseStudyOverlay';
import { Cursor } from './components/Cursor';
import { Fallback2D } from './components/Fallback2D';
import { HudOverlay } from './components/HudOverlay';
import { Loader } from './components/Loader';
import { MediaLightbox } from './components/MediaLightbox';
import { DESIGN_PROJECTS, PROFILE, ZONE_WAYPOINTS } from './data/content';
import type { CaseStudyProject, CreateMediaItem } from './data/content';
import type { FocusTarget, QualityMode, ZoneId } from './types/portfolio';
import { soundEngine } from './utils/sound';
import { detectSoftwareGl, hasWebGLSupport, resolveQualityTier } from './utils/webgl';

const MemoSceneRoot = memo(SceneRoot);

function getNearestZone(progress: number): ZoneId {
  let closest = ZONE_WAYPOINTS[0];
  let bestDist = Infinity;
  for (const wp of ZONE_WAYPOINTS) {
    const dist = Math.abs(progress - wp.scrollProgress);
    if (dist < bestDist) {
      bestDist = dist;
      closest = wp;
    }
  }
  return closest.id;
}

export default function App() {
  const [webglSupported] = useState(() => hasWebGLSupport());
  const [isSoftwareGl] = useState(() => detectSoftwareGl());
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  const [qualityMode, setQualityMode] = useState<QualityMode>('auto');
  const [fallback2D, setFallback2D] = useState(() => !webglSupported);
  const [sceneReady, setSceneReady] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);

  const [activeZone, setActiveZone] = useState<ZoneId>('hero');
  const scrollProgressRef = useRef(0);
  const lenisRef = useRef<Lenis | null>(null);

  const [focusTarget, setFocusTarget] = useState<FocusTarget | null>(null);
  const [selectedProject, setSelectedProject] = useState<CaseStudyProject | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<CreateMediaItem | null>(null);
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [clapFlash, setClapFlash] = useState(false);

  const resolvedQuality = useMemo(
    () => resolveQualityTier(qualityMode, isSoftwareGl, isMobile),
    [qualityMode, isSoftwareGl, isMobile]
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Setup Lenis smooth inertia scroll when in 3D mode (updates refs directly without React re-renders)
  useEffect(() => {
    if (fallback2D || reducedMotion) {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    const updateFromScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      scrollProgressRef.current = p;
      const nextZone = getNearestZone(p);
      setActiveZone((prev) => (prev === nextZone ? prev : nextZone));
    };

    lenis.on('scroll', updateFromScroll);

    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [fallback2D, reducedMotion]);

  // Native scroll fallback listener when reducedMotion is on in 3D mode
  useEffect(() => {
    if (fallback2D || !reducedMotion) return;
    const onScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      scrollProgressRef.current = p;
      const nextZone = getNearestZone(p);
      setActiveZone((prev) => (prev === nextZone ? prev : nextZone));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [fallback2D, reducedMotion]);

  const jumpToZone = useCallback(
    (zoneId: ZoneId) => {
      const wp = ZONE_WAYPOINTS.find((w) => w.id === zoneId);
      if (!wp) return;
      setFocusTarget(null);
      setSelectedProject(null);
      setSelectedMedia(null);
      soundEngine.playTick(600);

      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const targetY = wp.scrollProgress * maxScroll;

      if (lenisRef.current && !reducedMotion) {
        lenisRef.current.scrollTo(targetY, { duration: 1.35 });
      } else {
        window.scrollTo({ top: targetY, behavior: reducedMotion ? 'auto' : 'smooth' });
      }
    },
    [reducedMotion]
  );

  const triggerClapperEasterEgg = useCallback(() => {
    soundEngine.playClapper();
    setClapFlash(true);
    setTimeout(() => setClapFlash(false), 600);
  }, []);

  // Keyboard navigation: ArrowUp / ArrowDown / PageUp / PageDown + 'C' Clapperboard Easter Egg
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'c' || e.key === 'C') {
        triggerClapperEasterEgg();
        return;
      }

      if (fallback2D || selectedProject || selectedMedia) return;

      const idx = ZONE_WAYPOINTS.findIndex((w) => w.id === activeZone);
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const next = ZONE_WAYPOINTS[Math.min(ZONE_WAYPOINTS.length - 1, idx + 1)];
        jumpToZone(next.id);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const prev = ZONE_WAYPOINTS[Math.max(0, idx - 1)];
        jumpToZone(prev.id);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeZone, fallback2D, jumpToZone, selectedMedia, selectedProject, triggerClapperEasterEgg]);

  const handleDownloadCv = useCallback((type: 'uiux' | 'video') => {
    soundEngine.playTick(720);
    const cfg = type === 'uiux' ? PROFILE.cvFiles.uiux : PROFILE.cvFiles.videoContent;
    const link = document.createElement('a');
    link.href = cfg.href;
    link.download = cfg.filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleToggleAudio = useCallback(() => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    soundEngine.setEnabled(next);
  }, [audioEnabled]);

  const handleCloseOverlay = useCallback(() => {
    setFocusTarget(null);
    setSelectedProject(null);
    setSelectedMedia(null);
    soundEngine.playTick(440);
  }, []);

  const handleSceneReady = useCallback(() => setSceneReady(true), []);
  const handleContextLost = useCallback(() => setFallback2D(true), []);

  const handleFocusProject = useCallback((proj: CaseStudyProject, focus: FocusTarget) => {
    soundEngine.playFocusChime();
    setFocusTarget(focus);
    setSelectedProject(proj);
  }, []);

  const handleSelectDevicePreview = useCallback((focus: FocusTarget) => {
    soundEngine.playFocusChime();
    setFocusTarget(focus);
    setSelectedProject(DESIGN_PROJECTS[0]);
  }, []);

  const handleSelectJutima = useCallback(() => {
    soundEngine.playTick(580);
    jumpToZone('build');
  }, [jumpToZone]);

  const handleSelectMedia = useCallback((item: CreateMediaItem, focus: FocusTarget) => {
    soundEngine.playFocusChime();
    setFocusTarget(focus);
    setSelectedMedia(item);
  }, []);

  const handleHudOpenProject = useCallback((proj: CaseStudyProject) => {
    soundEngine.playFocusChime();
    setSelectedProject(proj);
  }, []);

  const handleHudOpenMedia = useCallback((item: CreateMediaItem) => {
    soundEngine.playFocusChime();
    setSelectedMedia(item);
  }, []);

  const handleToggleFallback2D = useCallback(() => setFallback2D((v) => !v), []);
  const handleToggleReducedMotion = useCallback(() => setReducedMotion((v) => !v), []);

  return (
    <>
      <Cursor enabled={!fallback2D && !reducedMotion} label={cursorLabel} />

      {/* Clapperboard Easter Egg Flash Overlay */}
      {clapFlash && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-white/85 animate-camera-flash">
          <div className="rounded-xl border-2 border-black bg-[#FF6A1A] px-6 py-3 font-display text-2xl font-extrabold tracking-widest text-black uppercase shadow-2xl">
            Scene 01 · Take 01 · Action!
          </div>
        </div>
      )}

      {fallback2D ? (
        <Fallback2D
          webglAvailable={webglSupported}
          onEnable3D={() => {
            setFallback2D(false);
            setLoaderDone(false);
          }}
          onOpenProject={(proj) => setSelectedProject(proj)}
          onOpenMedia={(item) => setSelectedMedia(item)}
          onDownloadCv={handleDownloadCv}
        />
      ) : (
        <>
          {!loaderDone && (
            <Loader sceneReady={sceneReady} onComplete={() => setLoaderDone(true)} />
          )}

          <MemoSceneRoot
            quality={resolvedQuality}
            isSoftwareGl={isSoftwareGl}
            isMobile={isMobile}
            reducedMotion={reducedMotion}
            scrollProgressRef={scrollProgressRef}
            focusTarget={focusTarget}
            onSceneReady={handleSceneReady}
            onContextLost={handleContextLost}
            onFocusProject={handleFocusProject}
            onSelectDevicePreview={handleSelectDevicePreview}
            onSelectJutima={handleSelectJutima}
            onSelectMedia={handleSelectMedia}
            onTriggerClapper={triggerClapperEasterEgg}
            onDownloadCv={handleDownloadCv}
            onHoverLabel={setCursorLabel}
          />

          <HudOverlay
            activeZone={activeZone}
            scrollProgressRef={scrollProgressRef}
            onJumpToZone={jumpToZone}
            onOpenProject={handleHudOpenProject}
            onOpenMedia={handleHudOpenMedia}
            onTriggerClapper={triggerClapperEasterEgg}
            onDownloadCv={handleDownloadCv}
            qualityMode={qualityMode}
            resolvedQuality={resolvedQuality}
            onChangeQuality={setQualityMode}
            audioEnabled={audioEnabled}
            onToggleAudio={handleToggleAudio}
            fallback2D={fallback2D}
            onToggleFallback2D={handleToggleFallback2D}
            reducedMotion={reducedMotion}
            onToggleReducedMotion={handleToggleReducedMotion}
          />

          {/* Continuous Scroll Track driving the 3D spline flight */}
          <div className="relative z-0 h-[720vh] w-full pointer-events-none" aria-hidden="true" />
        </>
      )}

      <CaseStudyOverlay project={selectedProject} onClose={handleCloseOverlay} />
      <MediaLightbox item={selectedMedia} onClose={handleCloseOverlay} />
    </>
  );
}
