import { AdaptiveDpr } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import {
  Bloom,
  ChromaticAberration,
  DepthOfField,
  EffectComposer,
  Noise,
  SMAA,
  Vignette,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { CaseStudyProject, CreateMediaItem } from '../../data/content';
import type { FocusTarget, ResolvedQuality } from '../../types/portfolio';
import { AboutZone } from './AboutZone';
import { BuildZone } from './BuildZone';
import { CameraRig } from './CameraRig';
import { CreateZone } from './CreateZone';
import { DesignZone } from './DesignZone';
import { ExperienceAndFinale } from './ExperienceAndFinale';
import { Hangar } from './Hangar';
import { Hero3D } from './Hero3D';

interface SceneRootProps {
  quality: ResolvedQuality;
  isSoftwareGl: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
  scrollProgressRef: React.MutableRefObject<number>;
  focusTarget: FocusTarget | null;
  onSceneReady: () => void;
  onContextLost: () => void;
  onFocusProject: (project: CaseStudyProject, focus: FocusTarget) => void;
  onSelectDevicePreview: (focus: FocusTarget) => void;
  onSelectJutima: (focus: FocusTarget) => void;
  onSelectMedia: (item: CreateMediaItem, focus: FocusTarget) => void;
  onTriggerClapper: () => void;
  onDownloadCv: (type: 'uiux' | 'video') => void;
  onHoverLabel: (label: string | null) => void;
}

function StudioEnvironmentSetup({
  onReady,
  onContextLost,
}: {
  onReady: () => void;
  onContextLost: () => void;
}) {
  const { gl, scene } = useThree();

  useEffect(() => {
    // Procedural HDRI studio reflection environment (zero external .hdr files)
    const pmrem = new THREE.PMREMGenerator(gl);
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmrem.dispose();

    const canvas = gl.domElement;
    const handleLost = (e: Event) => {
      e.preventDefault();
      onContextLost();
    };
    canvas.addEventListener('webglcontextlost', handleLost);
    onReady();

    return () => {
      canvas.removeEventListener('webglcontextlost', handleLost);
      envRT.dispose();
    };
  }, [gl, scene, onReady, onContextLost]);

  return null;
}

function PostProcessingRig({
  quality,
  isSoftwareGl,
  hasFocus,
}: {
  quality: ResolvedQuality;
  isSoftwareGl: boolean;
  hasFocus: boolean;
}) {
  const caOffset = useMemo(() => new THREE.Vector2(0.00055, 0.00055), []);

  if (isSoftwareGl || quality === 'low') {
    return null;
  }

  if (quality === 'medium') {
    return (
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.65} luminanceThreshold={0.9} mipmapBlur />
        <Vignette eskil={false} offset={0.18} darkness={0.55} />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={0}>
      <SMAA />
      <Bloom intensity={0.78} luminanceThreshold={0.88} mipmapBlur />
      <DepthOfField
        focusDistance={hasFocus ? 0.015 : 0.04}
        focalLength={hasFocus ? 0.035 : 0.018}
        bokehScale={hasFocus ? 3.2 : 1.1}
      />
      <ChromaticAberration offset={caOffset} radialModulation={false} modulationOffset={0.15} />
      <Noise opacity={0.028} blendFunction={BlendFunction.SOFT_LIGHT} />
      <Vignette eskil={false} offset={0.16} darkness={0.58} />
    </EffectComposer>
  );
}

export function SceneRoot({
  quality,
  isSoftwareGl,
  isMobile,
  reducedMotion,
  scrollProgressRef,
  focusTarget,
  onSceneReady,
  onContextLost,
  onFocusProject,
  onSelectDevicePreview,
  onSelectJutima,
  onSelectMedia,
  onTriggerClapper,
  onDownloadCv,
  onHoverLabel,
}: SceneRootProps) {
  const readyOnce = useRef(false);
  const handleReady = () => {
    if (!readyOnce.current) {
      readyOnce.current = true;
      onSceneReady();
    }
  };

  const dpr: [number, number] = isSoftwareGl
    ? [1, 1]
    : isMobile
      ? [1, 1.5]
      : quality === 'low'
        ? [1, 1.25]
        : [1, 2];

  return (
    <div className="fixed inset-0 z-0 h-full w-full">
      <Canvas
        shadows={!isSoftwareGl && quality !== 'low'}
        dpr={dpr}
        camera={{ fov: 48, near: 0.1, far: 140, position: [0, 2.3, 25.5] }}
        gl={{
          antialias: !isSoftwareGl,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.08,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <Suspense fallback={null}>
          <StudioEnvironmentSetup onReady={handleReady} onContextLost={onContextLost} />
          <AdaptiveDpr pixelated />
          <CameraRig
            scrollProgressRef={scrollProgressRef}
            focusTarget={focusTarget}
            reducedMotion={reducedMotion}
          />
          <Hangar quality={quality} isSoftwareGl={isSoftwareGl} reducedMotion={reducedMotion} />
          <Hero3D reducedMotion={reducedMotion} />
          <AboutZone reducedMotion={reducedMotion} />
          <DesignZone
            quality={quality}
            isSoftwareGl={isSoftwareGl}
            reducedMotion={reducedMotion}
            onFocusProject={onFocusProject}
            onHoverLabel={onHoverLabel}
          />
          <BuildZone
            reducedMotion={reducedMotion}
            scrollProgressRef={scrollProgressRef}
            onSelectDevicePreview={onSelectDevicePreview}
            onSelectJutima={onSelectJutima}
            onHoverLabel={onHoverLabel}
          />
          <CreateZone
            reducedMotion={reducedMotion}
            onSelectMedia={onSelectMedia}
            onTriggerClapper={onTriggerClapper}
            onHoverLabel={onHoverLabel}
          />
          <ExperienceAndFinale
            scrollProgressRef={scrollProgressRef}
            reducedMotion={reducedMotion}
            onDownloadCv={onDownloadCv}
            onHoverLabel={onHoverLabel}
          />
          <PostProcessingRig
            quality={quality}
            isSoftwareGl={isSoftwareGl}
            hasFocus={Boolean(focusTarget)}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
