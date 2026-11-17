import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { IMAGE_SLOTS, JUTIMA_PROJECT, SKILL_GROUPS } from '../../data/content';
import type { FocusTarget } from '../../types/portfolio';
import { createCodeMonolithTexture, createSlotScreenTexture } from '../../utils/webgl';

interface BuildZoneProps {
  reducedMotion: boolean;
  scrollProgressRef: React.MutableRefObject<number>;
  onSelectDevicePreview: (focus: FocusTarget) => void;
  onSelectJutima: (focus: FocusTarget) => void;
  onHoverLabel: (label: string | null) => void;
}

export function BuildZone({
  reducedMotion,
  scrollProgressRef,
  onSelectDevicePreview,
  onSelectJutima,
  onHoverLabel,
}: BuildZoneProps) {
  const chipsGroupRef = useRef<THREE.Group>(null);
  const [laptopHover, setLaptopHover] = useState(false);
  const [jutimaHover, setJutimaHover] = useState(false);

  const codeTex1 = useMemo(
    () =>
      createCodeMonolithTexture(
        'kelvjessia / seat-lock.sql',
        [
          '// Supabase atomic seat lock',
          'CREATE FUNCTION lock_trip_seat(',
          '  p_trip_id uuid,',
          '  p_seat_no int',
          ') RETURNS boolean AS $$',
          '  UPDATE seats SET status = $locked',
          '  WHERE trip_id = p_trip_id',
          '    AND status = $available;',
          '$$ LANGUAGE plpgsql;',
          'export async function reserveSeat() {',
          '  const { data } = await supabase',
          '    .rpc("lock_trip_seat", payload);',
          '  return data;',
          '}',
        ],
        '#4DE1FF'
      ),
    []
  );

  const codeTex2 = useMemo(
    () =>
      createCodeMonolithTexture(
        'nextjs / route-tracking.ts',
        [
          '// Mapbox + Paystack checkout flow',
          'export async function initBooking() {',
          '  const route = await mapbox.directions(',
          '    "Ilara-Epe", destination',
          '  );',
          '  const pay = await paystack.verify({',
          '    reference, mode: "test"',
          '  });',
          '  if (pay.verified) {',
          '    enableLiveLocationShare(tripId);',
          '  }',
          '}',
        ],
        '#FF6A1A'
      ),
    []
  );

  const kelvScreenTex = useMemo(() => {
    const slot = IMAGE_SLOTS['IMG-02'];
    if (slot.src) {
      const t = new THREE.TextureLoader().load(slot.src, (loaded) => {
        const img = loaded.image as HTMLImageElement | undefined;
        if (!img || !img.width || !img.height) return;
        const imgAspect = img.width / img.height;
        const frameAspect = 1.82 / 1.12;
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
      slotId: 'IMG-02 · LIVE BUILD',
      title: 'KELVJESSIA.VERCEL.APP',
      subtitle: 'Next.js · Tailwind · Supabase · Paystack · Mapbox',
      badge: 'CLICK TO INSPECT LIVE PREVIEW',
      lines: [
        'Auth: Email Sign Up / Login',
        'Seats: Available / Selected / Taken',
        'Tracking: Mapbox Live Route Sharing',
      ],
      accent: '#FF6A1A',
      secondary: '#4DE1FF',
      width: 640,
      height: 400,
    });
  }, []);

  const jutimaTex = useMemo(
    () =>
      createSlotScreenTexture({
        slotId: 'UNIVERSITY PROJECT',
        title: JUTIMA_PROJECT.title,
        subtitle: JUTIMA_PROJECT.stack.join(' · '),
        badge: 'CLICK FOR DETAILS',
        lines: [
          'Database design project + lo-fi wireframes',
          'Full-stack MySQL & Node.js/Express build',
        ],
        accent: '#4DE1FF',
        secondary: '#FF6A1A',
        width: 560,
        height: 340,
      }),
    []
  );

  const phoneScreenTex = useMemo(() => {
    const slot = IMAGE_SLOTS['IMG-03'];
    if (slot.src) {
      const t = new THREE.TextureLoader().load(slot.src, (loaded) => {
        const img = loaded.image as HTMLImageElement | undefined;
        if (!img || !img.width || !img.height) return;
        const imgAspect = img.width / img.height;
        const frameAspect = 0.46 / 0.88;
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
    return kelvScreenTex;
  }, [kelvScreenTex]);

  useEffect(() => {
    return () => {
      codeTex1.dispose();
      codeTex2.dispose();
      kelvScreenTex.dispose();
      if (phoneScreenTex !== kelvScreenTex) phoneScreenTex.dispose();
      jutimaTex.dispose();
    };
  }, [codeTex1, codeTex2, kelvScreenTex, phoneScreenTex, jutimaTex]);

  useFrame((state, rawDelta) => {
    if (reducedMotion) return;
    const delta = Math.min(rawDelta, 0.05);
    // Scroll code monolith textures continuously
    codeTex1.offset.y = (codeTex1.offset.y - delta * 0.08) % 1;
    codeTex2.offset.y = (codeTex2.offset.y - delta * 0.065) % 1;

    // Dock skill chips smoothly toward the monoliths only when near Zone 2
    if (chipsGroupRef.current) {
      const p = scrollProgressRef.current;
      if (Math.abs(p - 0.49) > 0.34) return;
      const inBuild = THREE.MathUtils.clamp(1 - Math.abs(p - 0.49) / 0.14, 0, 1);
      const t = state.clock.elapsedTime;

      chipsGroupRef.current.children.forEach((child, idx) => {
        const angle = (idx / 5) * Math.PI * 2 + t * 0.18 * (1 - inBuild * 0.85);
        const orbitX = Math.cos(angle) * (4.6 - inBuild * 1.4);
        const dockedX = idx < 3 ? -4.3 : 4.3;
        const targetX = THREE.MathUtils.lerp(orbitX, dockedX, inBuild * 0.78);
        const targetY = 1.15 + (idx % 3) * 0.92 + Math.sin(t * 1.4 + idx) * (0.08 * (1 - inBuild * 0.5));
        child.position.x = THREE.MathUtils.damp(child.position.x, targetX, 4.5, delta);
        child.position.y = THREE.MathUtils.damp(child.position.y, targetY, 4.5, delta);
      });
    }
  });

  return (
    <group position={[0, 0, -21]}>

      {/* Left Code Monolith (grounded at Y=0) */}
      <group position={[-4.6, 0, -1]} rotation={[0, 0.25, 0]}>
        <mesh position={[0, 2.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.1, 5.2, 0.55]} />
          <meshPhysicalMaterial color="#10131A" metalness={0.82} roughness={0.28} clearcoat={0.6} />
        </mesh>
        <mesh position={[0, 2.65, 0.29]}>
          <planeGeometry args={[1.86, 4.6]} />
          <meshBasicMaterial map={codeTex1} toneMapped={false} />
        </mesh>
      </group>

      {/* Right Code Monolith + Terminal Wall */}
      <group position={[4.6, 0, -1.6]} rotation={[0, -0.25, 0]}>
        <mesh position={[0, 2.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.1, 5.2, 0.55]} />
          <meshPhysicalMaterial color="#10131A" metalness={0.82} roughness={0.28} clearcoat={0.6} />
        </mesh>
        <mesh position={[0, 2.65, 0.29]}>
          <planeGeometry args={[1.86, 4.6]} />
          <meshBasicMaterial map={codeTex2} toneMapped={false} />
        </mesh>
      </group>

      {/* Center Device Showcase Pedestal (Composite Laptop + Smartphone showing Kelvjessia) */}
      <group
        position={[-0.2, 0, 0.2]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setLaptopHover(true);
          onHoverLabel('Open');
        }}
        onPointerOut={() => {
          setLaptopHover(false);
          onHoverLabel(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelectDevicePreview({
            id: 'kelvjessia-live',
            type: 'device',
            cameraPos: [-0.2, 2.1, -17.3],
            lookAt: [-0.2, 1.7, -20.8],
          });
        }}
      >
        {/* Heavy dark steel pedestal */}
        <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.6, 1.04, 1.6]} />
          <meshStandardMaterial color="#151922" metalness={0.78} roughness={0.42} />
        </mesh>
        <mesh position={[0, 1.05, 0.78]}>
          <boxGeometry args={[3.4, 0.03, 0.04]} />
          <meshStandardMaterial
            color="#FF6A1A"
            emissive="#FF6A1A"
            emissiveIntensity={laptopHover ? 3.2 : 1.5}
            toneMapped={false}
          />
        </mesh>

        {/* Composite Laptop (base + keyboard deck + tilted display + screen) */}
        <group position={[-0.45, 1.06, 0]}>
          <mesh position={[0, 0.03, 0.22]} castShadow>
            <boxGeometry args={[1.95, 0.05, 1.28]} />
            <meshPhysicalMaterial color="#9CA3AF" metalness={0.9} roughness={0.22} />
          </mesh>
          <mesh position={[0, 0.06, 0.16]}>
            <boxGeometry args={[1.65, 0.01, 0.68]} />
            <meshStandardMaterial color="#111318" roughness={0.75} metalness={0.2} />
          </mesh>
          <group position={[0, 0.64, -0.4]} rotation={[-0.14, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[1.95, 1.24, 0.04]} />
              <meshPhysicalMaterial color="#8E96A4" metalness={0.92} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0, 0.025]}>
              <planeGeometry args={[1.82, 1.12]} />
              <meshBasicMaterial map={kelvScreenTex} toneMapped={false} />
            </mesh>
          </group>
        </group>

        {/* Composite Smartphone Mockup beside Laptop */}
        <group position={[1.15, 1.48, 0.12]} rotation={[-0.12, -0.22, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.52, 0.96, 0.045]} />
            <meshPhysicalMaterial color="#272D38" metalness={0.88} roughness={0.22} />
          </mesh>
          <mesh position={[0, 0, 0.026]}>
            <planeGeometry args={[0.46, 0.88]} />
            <meshBasicMaterial map={phoneScreenTex} toneMapped={false} />
          </mesh>
        </group>
      </group>

      {/* JUTIMA Compact Hardware Card */}
      <group
        position={[3.0, 1.25, 1.2]}
        rotation={[0, -0.35, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setJutimaHover(true);
          onHoverLabel('Inspect');
        }}
        onPointerOut={() => {
          setJutimaHover(false);
          onHoverLabel(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelectJutima({
            id: 'jutima',
            type: 'jutima',
            cameraPos: [1.9, 1.5, -17.1],
            lookAt: [3.0, 1.25, -19.8],
          });
        }}
      >
        <mesh castShadow>
          <boxGeometry args={[1.95, 1.22, 0.08]} />
          <meshPhysicalMaterial color="#181D26" metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[1.8, 1.08]} />
          <meshBasicMaterial map={jutimaTex} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.63, 0.02]}>
          <boxGeometry args={[1.95, 0.025, 0.08]} />
          <meshStandardMaterial
            color="#4DE1FF"
            emissive="#4DE1FF"
            emissiveIntensity={jutimaHover ? 3 : 1.2}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* 5 Orbiting / Docking Skill Group Beacons */}
      <group ref={chipsGroupRef}>
        {SKILL_GROUPS.map((grp, idx) => (
          <group key={grp.category} position={[idx < 3 ? -3.4 : 3.4, 1.2 + (idx % 3) * 0.9, -0.2]}>
            <mesh>
              <boxGeometry args={[1.55, 0.34, 0.14]} />
              <meshPhysicalMaterial
                color="#141821"
                metalness={0.75}
                roughness={0.28}
                clearcoat={0.7}
              />
            </mesh>
            <mesh position={[-0.68, 0, 0.08]}>
              <boxGeometry args={[0.08, 0.22, 0.03]} />
              <meshStandardMaterial
                color={grp.accent}
                emissive={grp.accent}
                emissiveIntensity={2.4}
                toneMapped={false}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
