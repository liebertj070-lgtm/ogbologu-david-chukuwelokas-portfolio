import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { DESIGN_PROJECTS, IMAGE_SLOTS } from '../../data/content';
import type { CaseStudyProject } from '../../data/content';
import type { FocusTarget, ResolvedQuality } from '../../types/portfolio';
import { createSlotScreenTexture } from '../../utils/webgl';

interface DesignZoneProps {
  quality: ResolvedQuality;
  isSoftwareGl: boolean;
  reducedMotion: boolean;
  onFocusProject: (project: CaseStudyProject, focus: FocusTarget) => void;
  onHoverLabel: (label: string | null) => void;
}

function GlassProjectScreen({
  project,
  slotId,
  quality,
  isSoftwareGl,
  reducedMotion,
  onSelect,
  onHoverLabel,
}: {
  project: CaseStudyProject;
  slotId: string;
  quality: ResolvedQuality;
  isSoftwareGl: boolean;
  reducedMotion: boolean;
  onSelect: () => void;
  onHoverLabel: (label: string | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const multiMobileTextures = useMemo(() => {
    if (project.id !== 'food-delivery') return null;
    const loader = new THREE.TextureLoader();
    return project.imageSlots
      .map((sid) => IMAGE_SLOTS[sid]?.src)
      .filter((src): src is string => Boolean(src))
      .map((src) => {
        const tex = loader.load(src);
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
      });
  }, [project]);

  const screenTex = useMemo(() => {
    if (multiMobileTextures && multiMobileTextures.length > 0) return null;
    const slot = IMAGE_SLOTS[slotId];
    if (slot?.src) {
      const tex = new THREE.TextureLoader().load(slot.src, (loaded) => {
        const img = loaded.image as HTMLImageElement | undefined;
        if (!img || !img.width || !img.height) return;
        const imgAspect = img.width / img.height;
        const frameAspect = 3.86 / 2.52;
        if (imgAspect > frameAspect) {
          const rx = frameAspect / imgAspect;
          loaded.repeat.set(rx, 1);
          loaded.offset.set((1 - rx) * 0.5, 0);
        } else {
          const ry = imgAspect / frameAspect;
          loaded.repeat.set(1, ry);
          loaded.offset.set(0, (1 - ry) * 0.5);
        }
        loaded.needsUpdate = true;
      });
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    }
    return createSlotScreenTexture({
      slotId,
      title: project.title,
      subtitle: project.subtitle,
      badge: project.badge.toUpperCase(),
      lines: project.highlights.slice(0, 3),
      accent: project.id === 'kelvjessia' ? '#FF6A1A' : '#4DE1FF',
      secondary: project.id === 'kelvjessia' ? '#4DE1FF' : '#FF6A1A',
      width: 680,
      height: 440,
    });
  }, [multiMobileTextures, project, slotId]);

  useEffect(() => {
    return () => {
      screenTex?.dispose();
      multiMobileTextures?.forEach((t) => t.dispose());
    };
  }, [screenTex, multiMobileTextures]);

  useFrame((state, rawDelta) => {
    if (!groupRef.current) return;
    const delta = Math.min(rawDelta, 0.05);
    const t = state.clock.elapsedTime;
    const baseY = project.panelPosition[1];
    const floatOffset = reducedMotion ? 0 : Math.sin(t * 1.1 + project.panelPosition[0]) * 0.08;
    const targetY = baseY + floatOffset + (hovered ? 0.22 : 0);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 6, delta);

    const targetScale = hovered ? 1.045 : 1.0;
    const s = THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 7, delta);
    groupRef.current.scale.set(s, s, s);
  });

  const accentColor = project.id === 'kelvjessia' ? '#FF6A1A' : '#4DE1FF';

  return (
    <group
      ref={groupRef}
      position={project.panelPosition}
      rotation={project.panelRotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHoverLabel('View');
      }}
      onPointerOut={() => {
        setHovered(false);
        onHoverLabel(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Optical glass backing slab (zero extra transmission render pass) */}
      <mesh castShadow>
        <boxGeometry args={[4.1, 2.75, 0.08]} />
        <meshPhysicalMaterial
          color="#D9ECFF"
          metalness={0.08}
          roughness={0.06}
          transparent
          opacity={0.22}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* Crisp UI screen face(s) */}
      {multiMobileTextures && multiMobileTextures.length > 0 ? (
        <group>
          {multiMobileTextures.map((tex, idx) => {
            const xOffset = (idx - (multiMobileTextures.length - 1) / 2) * 1.24;
            return (
              <mesh key={idx} position={[xOffset, 0, idx === 1 ? 0.065 : 0.052]}>
                <planeGeometry args={[1.05, 2.24]} />
                <meshBasicMaterial map={tex} toneMapped={false} />
              </mesh>
            );
          })}
        </group>
      ) : (
        screenTex && (
          <mesh position={[0, 0, 0.05]}>
            <planeGeometry args={[3.86, 2.52]} />
            <meshBasicMaterial map={screenTex} toneMapped={false} />
          </mesh>
        )
      )}

      {/* Emissive bezel rails */}
      <mesh position={[0, 1.38, 0.02]}>
        <boxGeometry args={[4.12, 0.03, 0.1]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={hovered ? 2.8 : 1.2}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, -1.38, 0.02]}>
        <boxGeometry args={[4.12, 0.03, 0.1]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={hovered ? 2.8 : 1.2}
          toneMapped={false}
        />
      </mesh>

      {/* Support floor stanchion */}
      <mesh position={[0, -1.85, -0.08]}>
        <cylinderGeometry args={[0.04, 0.06, 0.9, 12]} />
        <meshStandardMaterial color="#1F242E" metalness={0.9} roughness={0.28} />
      </mesh>
    </group>
  );
}

export function DesignZone({
  quality,
  isSoftwareGl,
  reducedMotion,
  onFocusProject,
  onHoverLabel,
}: DesignZoneProps) {
  const figmaCursorRef = useRef<THREE.Group>(null);
  const wireframeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    if (figmaCursorRef.current) {
      figmaCursorRef.current.position.x = Math.sin(t * 0.75) * 2.1;
      figmaCursorRef.current.position.y = 2.4 + Math.cos(t * 1.1) * 0.55;
      figmaCursorRef.current.position.z = -1.6 + Math.sin(t * 0.5) * 0.7;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y = Math.sin(t * 0.35) * 0.12;
    }
  });

  return (
    <group>
      {/* Project Glass Panels */}
      {DESIGN_PROJECTS.map((project) => (
        <GlassProjectScreen
          key={project.id}
          project={project}
          slotId={project.imageSlots[0]}
          quality={quality}
          isSoftwareGl={isSoftwareGl}
          reducedMotion={reducedMotion}
          onHoverLabel={onHoverLabel}
          onSelect={() => {
            const [px, py, pz] = project.panelPosition;
            const offsetX = project.id === 'kelvjessia' ? 0.9 : -0.9;
            onFocusProject(project, {
              id: project.id,
              type: 'case-study',
              cameraPos: [px + offsetX, py, pz + 3.9],
              lookAt: [px, py, pz],
            });
          }}
        />
      ))}

      {/* Secondary floating wireframe frames behind glass panels */}
      <group ref={wireframeRef} position={[0, 3.6, -5.2]}>
        {[-2.2, 0, 2.2].map((x, idx) => (
          <mesh key={idx} position={[x, (idx % 2) * 0.35, 0]}>
            <boxGeometry args={[1.55, 1.05, 0.02]} />
            <meshBasicMaterial color={idx === 1 ? '#FF6A1A' : '#4DE1FF'} wireframe transparent opacity={0.35} />
          </mesh>
        ))}
      </group>

      {/* Drifting 3D Figma-style Cursor */}
      <group ref={figmaCursorRef} position={[0, 2.4, -1.6]}>
        <mesh rotation={[0, 0, 0.35]}>
          <coneGeometry args={[0.14, 0.36, 3]} />
          <meshStandardMaterial color="#FF6A1A" emissive="#FF6A1A" emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
        {/* Selection bounding halo */}
        <mesh position={[0.45, -0.2, 0]}>
          <boxGeometry args={[0.72, 0.24, 0.02]} />
          <meshStandardMaterial color="#4DE1FF" emissive="#4DE1FF" emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}
