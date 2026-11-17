import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { IMAGE_SLOTS, PROFILE } from '../../data/content';
import { createSlotScreenTexture } from '../../utils/webgl';

interface AboutZoneProps {
  reducedMotion: boolean;
  onSelectPortrait?: () => void;
}

export function AboutZone({ reducedMotion }: AboutZoneProps) {
  const holoRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const portraitTex = useMemo(() => {
    const slot = IMAGE_SLOTS['IMG-01'];
    if (slot.src) {
      const loader = new THREE.TextureLoader();
      const t = loader.load(slot.src, (loaded) => {
        const img = loaded.image as HTMLImageElement | undefined;
        if (!img || !img.width || !img.height) return;
        const imgAspect = img.width / img.height;
        const frameAspect = 1.34 / 1.78;
        if (imgAspect < frameAspect) {
          // Tall portrait: preserve full width, crop vertically toward upper subject
          const repeatY = imgAspect / frameAspect;
          loaded.repeat.set(1, repeatY);
          loaded.offset.set(0, Math.max(0, (1 - repeatY) * 0.88));
        } else {
          const repeatX = frameAspect / imgAspect;
          loaded.repeat.set(repeatX, 1);
          loaded.offset.set((1 - repeatX) * 0.5, 0);
        }
        loaded.needsUpdate = true;
      });
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    }
    return createSlotScreenTexture({
      slotId: 'IMG-01',
      title: 'JOHAN · OGBOLOGU DAVID',
      subtitle: 'Portrait / Profile Photo Slot',
      badge: 'LAGOS, NIGERIA · AUGUSTINE UNIV.',
      lines: [
        'B.Sc. Computer Science (300 Level, 2027)',
        'Naval Dockyard Limited — Intern',
        'Design · Code · Video · AI Content',
      ],
      accent: '#4DE1FF',
      secondary: '#FF6A1A',
      width: 480,
      height: 640,
    });
  }, []);

  useEffect(() => {
    return () => {
      portraitTex.dispose();
    };
  }, [portraitTex]);

  useFrame((state, rawDelta) => {
    if (!holoRef.current || reducedMotion) return;
    const t = state.clock.elapsedTime;
    const delta = Math.min(rawDelta, 0.05);
    const targetY = 2.05 + Math.sin(t * 1.4) * 0.04;
    holoRef.current.position.y = THREE.MathUtils.damp(holoRef.current.position.y, targetY, 4, delta);
    const targetRotY = hovered ? -0.14 : -0.28 + Math.sin(t * 0.6) * 0.05;
    holoRef.current.rotation.y = THREE.MathUtils.damp(holoRef.current.rotation.y, targetRotY, 5, delta);
  });

  return (
    <group position={[2.2, 0, 6.2]}>
      {/* Warm workbench lamp pool */}
      <pointLight position={[-0.6, 3.1, 0.6]} color="#FFAE70" intensity={10} distance={9} decay={2} />
      <pointLight position={[0.4, 2.2, 1.1]} color="#4DE1FF" intensity={6} distance={7} decay={2} />

      {/* Composite Industrial Workbench (7 parts, grounded at Y=0) */}
      <group position={[0, 0, 0]}>
        {/* Heavy dark slate benchtop */}
        <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.4, 0.12, 1.5]} />
          <meshStandardMaterial color="#181C24" roughness={0.62} metalness={0.28} />
        </mesh>
        {/* Brushed steel front edge trim */}
        <mesh position={[0, 0.95, 0.76]}>
          <boxGeometry args={[3.42, 0.1, 0.04]} />
          <meshStandardMaterial color="#6B7280" roughness={0.28} metalness={0.9} />
        </mesh>
        {/* Four steel legs */}
        {[
          [-1.52, 0.45, -0.6],
          [1.52, 0.45, -0.6],
          [-1.52, 0.45, 0.6],
          [1.52, 0.45, 0.6],
        ].map(([lx, ly, lz], i) => (
          <mesh key={i} position={[lx, ly, lz]} castShadow>
            <boxGeometry args={[0.1, 0.9, 0.1]} />
            <meshStandardMaterial color="#252B36" metalness={0.85} roughness={0.35} />
          </mesh>
        ))}
        {/* Lower tool shelf */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[3.1, 0.05, 1.2]} />
          <meshStandardMaterial color="#12151B" roughness={0.75} metalness={0.4} />
        </mesh>
        {/* Articulated Workbench Lamp Arm + Head */}
        <mesh position={[-1.25, 1.55, -0.45]} rotation={[0, 0, -0.25]}>
          <cylinderGeometry args={[0.03, 0.035, 1.2, 12]} />
          <meshStandardMaterial color="#2A303B" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[-0.95, 2.05, -0.25]} rotation={[0.4, 0, -0.4]}>
          <coneGeometry args={[0.24, 0.32, 18]} />
          <meshStandardMaterial color="#FF6A1A" metalness={0.5} roughness={0.38} />
        </mesh>
        {/* Drafting scale ruler on desk */}
        <mesh position={[-0.55, 1.02, 0.35]} rotation={[0, 0.22, 0]}>
          <boxGeometry args={[0.9, 0.015, 0.09]} />
          <meshStandardMaterial color="#FF6A1A" metalness={0.6} roughness={0.32} />
        </mesh>
      </group>

      {/* Hologram Portrait Pedestal + Framed IMG-01 Slot */}
      <group
        ref={holoRef}
        position={[0.4, 2.05, 0]}
        rotation={[0, -0.28, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Hologram emitter base on workbench */}
        <mesh position={[0, -1.0, 0]}>
          <cylinderGeometry args={[0.42, 0.5, 0.08, 24]} />
          <meshStandardMaterial color="#1E2430" metalness={0.9} roughness={0.22} />
        </mesh>
        <mesh position={[0, -0.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.38, 0.018, 12, 32]} />
          <meshStandardMaterial color="#4DE1FF" emissive="#4DE1FF" emissiveIntensity={2.1} toneMapped={false} />
        </mesh>

        {/* Outer metallic frame */}
        <mesh position={[0, 0, -0.02]}>
          <boxGeometry args={[1.48, 1.94, 0.04]} />
          <meshPhysicalMaterial color="#181D26" metalness={0.85} roughness={0.28} />
        </mesh>

        {/* Portrait Texture Plane (IMG-01) */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[1.34, 1.78]} />
          <meshBasicMaterial map={portraitTex} toneMapped={false} />
        </mesh>

        {/* Glass protective front plate */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[1.42, 1.88]} />
          <meshPhysicalMaterial
            color="#4DE1FF"
            transparent
            opacity={hovered ? 0.14 : 0.08}
            roughness={0.05}
            metalness={0.1}
            clearcoat={1}
          />
        </mesh>
      </group>
      {/* Hidden accessible label reference */}
      <group name={PROFILE.preferredName} />
    </group>
  );
}
