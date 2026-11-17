import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { CREATE_MEDIA_ITEMS, IMAGE_SLOTS } from '../../data/content';
import type { CreateMediaItem } from '../../data/content';
import type { FocusTarget } from '../../types/portfolio';
import { createSlotScreenTexture } from '../../utils/webgl';

interface CreateZoneProps {
  reducedMotion: boolean;
  onSelectMedia: (item: CreateMediaItem, focus: FocusTarget) => void;
  onTriggerClapper: () => void;
  onHoverLabel: (label: string | null) => void;
}

function StudioMonitor({
  item,
  onSelect,
  onHoverLabel,
}: {
  item: CreateMediaItem;
  onSelect: () => void;
  onHoverLabel: (label: string | null) => void;
}) {
  const [hovered, setHovered] = useState(false);

  const multiPosterTextures = useMemo(() => {
    const loadedSrcs = item.slotIds
      .map((sid) => IMAGE_SLOTS[sid]?.src)
      .filter((s): s is string => Boolean(s));
    if (loadedSrcs.length <= 1) return null;
    const isWide = loadedSrcs.length >= 3;
    const frameAspect = isWide ? 0.59 / 0.84 : 0.74 / 1.24;
    const loader = new THREE.TextureLoader();
    return loadedSrcs.map((src) => {
      const t = loader.load(src, (loaded) => {
        const img = loaded.image as HTMLImageElement | undefined;
        if (!img || !img.width || !img.height) return;
        const imgAspect = img.width / img.height;
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
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    });
  }, [item]);

  const primarySlot = IMAGE_SLOTS[item.slotIds[0]];
  const isVerticalPoster = primarySlot?.aspect === '9:16' && Boolean(primarySlot?.src);

  const monitorTex = useMemo(() => {
    if (multiPosterTextures && multiPosterTextures.length > 0) return null;
    const slotId = item.slotIds[0];
    const slot = IMAGE_SLOTS[slotId];
    if (slot?.src) {
      const t = new THREE.TextureLoader().load(slot.src, (loaded) => {
        if (slot.aspect === '9:16') return;
        const img = loaded.image as HTMLImageElement | undefined;
        if (!img || !img.width || !img.height) return;
        const imgAspect = img.width / img.height;
        const frameAspect = 2.16 / 1.3;
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
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    }
    return createSlotScreenTexture({
      slotId,
      title: item.title,
      subtitle: item.tools.join(' · '),
      badge: `${item.category.toUpperCase()} · CLICK TO OPEN`,
      lines: [item.placeholderNote ?? item.description.slice(0, 52)],
      accent: item.category === 'Graphic Design' ? '#4DE1FF' : '#FF6A1A',
      secondary: '#4DE1FF',
      width: 600,
      height: 360,
    });
  }, [item, multiPosterTextures]);

  useEffect(() => {
    return () => {
      monitorTex?.dispose();
      multiPosterTextures?.forEach((t) => t.dispose());
    };
  }, [monitorTex, multiPosterTextures]);

  const posterCount = multiPosterTextures?.length ?? 0;
  const isWideShowcase = posterCount >= 3;
  const chassisWidth = isWideShowcase ? 3.62 : 2.35;
  const bezelWidth = isWideShowcase ? 3.42 : 2.16;
  const posterWidth = isWideShowcase ? 0.59 : 0.74;
  const posterHeight = isWideShowcase ? 0.84 : 1.24;
  const posterStep = isWideShowcase ? 0.66 : 0.92;

  return (
    <group
      position={item.monitorPosition}
      rotation={item.monitorRotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHoverLabel('Play');
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
      {/* Broadcast Monitor Chassis */}
      <mesh castShadow>
        <boxGeometry args={[chassisWidth, 1.48, 0.14]} />
        <meshPhysicalMaterial color="#141820" metalness={0.82} roughness={0.34} />
      </mesh>
      {/* Dark recessed bezel backing */}
      <mesh position={[0, 0, 0.074]}>
        <planeGeometry args={[bezelWidth, 1.3]} />
        <meshBasicMaterial color="#07090D" />
      </mesh>
      {/* Screen surface(s) */}
      {multiPosterTextures && multiPosterTextures.length > 0 ? (
        <group>
          {multiPosterTextures.map((tex, idx) => {
            const xOffset = (idx - (multiPosterTextures.length - 1) / 2) * posterStep;
            return (
              <mesh key={idx} position={[xOffset, 0, 0.082]}>
                <planeGeometry args={[posterWidth, posterHeight]} />
                <meshBasicMaterial map={tex} toneMapped={false} />
              </mesh>
            );
          })}
        </group>
      ) : (
        monitorTex && (
          <mesh position={[0, 0, 0.082]}>
            <planeGeometry args={isVerticalPoster ? [0.76, 1.28] : [2.16, 1.3]} />
            <meshBasicMaterial map={monitorTex} toneMapped={false} />
          </mesh>
        )
      )}
      {/* Tally indicator bar on top */}
      <mesh position={[0, 0.77, 0.05]}>
        <boxGeometry args={[0.45, 0.05, 0.05]} />
        <meshStandardMaterial
          color="#FF6A1A"
          emissive="#FF6A1A"
          emissiveIntensity={hovered ? 3.5 : 1.3}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export function CreateZone({
  reducedMotion,
  onSelectMedia,
  onTriggerClapper,
  onHoverLabel,
}: CreateZoneProps) {
  const reelRef = useRef<THREE.Group>(null);
  const clapperArmRef = useRef<THREE.Group>(null);
  const clapTimer = useRef(0);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    if (!reducedMotion && reelRef.current) {
      reelRef.current.rotation.z -= delta * 0.7;
    }
    if (clapperArmRef.current) {
      if (clapTimer.current > 0) {
        clapTimer.current = Math.max(0, clapTimer.current - delta * 3.5);
        clapperArmRef.current.rotation.z = THREE.MathUtils.lerp(0.02, 0.45, 1 - clapTimer.current);
      } else {
        clapperArmRef.current.rotation.z = THREE.MathUtils.damp(clapperArmRef.current.rotation.z, 0.36, 6, delta);
      }
    }
  });

  const handleClap = () => {
    clapTimer.current = 1;
    onTriggerClapper();
  };

  return (
    <group>
      <pointLight position={[-3.2, 4.4, -34.5]} color="#FF6A1A" intensity={18} distance={15} decay={2} />
      <pointLight position={[3.2, 4.4, -35.5]} color="#4DE1FF" intensity={16} distance={15} decay={2} />

      {/* Curved Wall of Video & Graphics Monitors */}
      {CREATE_MEDIA_ITEMS.map((item) => (
        <StudioMonitor
          key={item.id}
          item={item}
          onHoverLabel={onHoverLabel}
          onSelect={() => {
            const [mx, my, mz] = item.monitorPosition;
            onSelectMedia(item, {
              id: item.id,
              type: 'media',
              cameraPos: [mx * 0.72, my, mz + 3.4],
              lookAt: [mx, my, mz],
            });
          }}
        />
      ))}

      {/* Composite Cinema Camera Rig on Tripod (8+ parts, grounded at Y=0) */}
      <group position={[-2.9, 0, -34.0]} rotation={[0, 0.42, 0]}>
        {/* Tripod legs */}
        {[
          [-0.42, 0.72, 0.35, 0.22, 0.25],
          [0.42, 0.72, 0.35, 0.22, -0.25],
          [0, 0.72, -0.45, -0.28, 0],
        ].map(([x, y, z, rx, rz], i) => (
          <mesh key={i} position={[x, y, z]} rotation={[rx, 0, rz]} castShadow>
            <cylinderGeometry args={[0.028, 0.022, 1.55, 10]} />
            <meshStandardMaterial color="#232833" metalness={0.88} roughness={0.3} />
          </mesh>
        ))}
        {/* Fluid head */}
        <mesh position={[0, 1.48, 0]}>
          <cylinderGeometry args={[0.16, 0.18, 0.14, 16]} />
          <meshStandardMaterial color="#181B22" metalness={0.85} roughness={0.35} />
        </mesh>
        {/* Milled matte-black cinema body */}
        <mesh position={[0, 1.72, -0.05]} castShadow>
          <boxGeometry args={[0.42, 0.36, 0.62]} />
          <meshPhysicalMaterial color="#161920" metalness={0.72} roughness={0.38} />
        </mesh>
        {/* Top cage handle */}
        <mesh position={[0, 1.98, -0.05]}>
          <boxGeometry args={[0.1, 0.08, 0.44]} />
          <meshStandardMaterial color="#FF6A1A" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Anodized cinema prime lens barrel */}
        <mesh position={[0, 1.72, 0.44]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.16, 0.42, 24]} />
          <meshPhysicalMaterial color="#202632" metalness={0.9} roughness={0.22} />
        </mesh>
        {/* Optical glass front lens element */}
        <mesh position={[0, 1.72, 0.66]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.03, 24]} />
          <meshPhysicalMaterial color="#4DE1FF" metalness={0.1} roughness={0.05} clearcoat={1} />
        </mesh>
        {/* Matte box hood */}
        <mesh position={[0, 1.72, 0.72]}>
          <boxGeometry args={[0.42, 0.3, 0.12]} />
          <meshStandardMaterial color="#0D0F14" roughness={0.75} metalness={0.25} />
        </mesh>
      </group>

      {/* Rotating Film Reel Sculpture (grounded stand + spoked reel) */}
      <group position={[3.1, 0, -34.2]} rotation={[0, -0.38, 0]}>
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.06, 0.1, 1.8, 12]} />
          <meshStandardMaterial color="#1F242E" metalness={0.85} roughness={0.35} />
        </mesh>
        <group ref={reelRef} position={[0, 2.05, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.78, 0.055, 12, 36]} />
            <meshPhysicalMaterial color="#CBD5E1" metalness={0.94} roughness={0.18} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.14, 20]} />
            <meshStandardMaterial color="#FF6A1A" metalness={0.6} roughness={0.35} />
          </mesh>
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh key={i} rotation={[0, 0, (i * Math.PI * 2) / 5]}>
              <boxGeometry args={[0.07, 1.5, 0.04]} />
              <meshStandardMaterial color="#64748B" metalness={0.9} roughness={0.24} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Interactive Clapperboard Easter Egg ("C" key or Click) */}
      <group
        position={[0, 0.65, -34.2]}
        rotation={[0, 0.08, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHoverLabel('Clap');
        }}
        onPointerOut={() => onHoverLabel(null)}
        onClick={(e) => {
          e.stopPropagation();
          handleClap();
        }}
      >
        {/* Stand pedestal */}
        <mesh position={[0, -0.32, 0]}>
          <cylinderGeometry args={[0.04, 0.28, 0.65, 16]} />
          <meshStandardMaterial color="#1C2028" metalness={0.85} roughness={0.35} />
        </mesh>
        {/* Slate body */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.92, 0.64, 0.05]} />
          <meshStandardMaterial color="#0F1218" roughness={0.55} metalness={0.2} />
        </mesh>
        {/* Hinged top clapper arm */}
        <group ref={clapperArmRef} position={[-0.46, 0.49, 0]} rotation={[0, 0, 0.36]}>
          <mesh position={[0.46, 0.05, 0]}>
            <boxGeometry args={[0.92, 0.1, 0.06]} />
            <meshStandardMaterial color="#FF6A1A" emissive="#FF6A1A" emissiveIntensity={0.45} roughness={0.4} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
