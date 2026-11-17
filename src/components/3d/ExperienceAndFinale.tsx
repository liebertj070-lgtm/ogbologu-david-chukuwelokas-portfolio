import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { EXPERIENCES } from '../../data/content';
import { createSlotScreenTexture } from '../../utils/webgl';

interface ExperienceAndFinaleProps {
  scrollProgressRef: React.MutableRefObject<number>;
  reducedMotion: boolean;
  onDownloadCv: (type: 'uiux' | 'video') => void;
  onHoverLabel: (label: string | null) => void;
}

export function ExperienceAndFinale({
  scrollProgressRef,
  reducedMotion,
  onDownloadCv,
  onHoverLabel,
}: ExperienceAndFinaleProps) {
  const nodeRefs = useRef<(THREE.Group | null)[]>([]);

  const expTextures = useMemo(() => {
    return EXPERIENCES.map((exp) =>
      createSlotScreenTexture({
        slotId: exp.period.toUpperCase(),
        title: `${exp.role} · ${exp.organization}`,
        subtitle: exp.location ?? 'Independent Creative Production',
        lines: exp.bullets.slice(0, 3),
        accent: exp.accentColor,
        secondary: '#FFFFFF',
        width: 640,
        height: 400,
      })
    );
  }, []);

  useEffect(() => {
    return () => {
      expTextures.forEach((t) => t.dispose());
    };
  }, [expTextures]);

  useFrame((_, rawDelta) => {
    if (reducedMotion) return;
    const delta = Math.min(rawDelta, 0.05);
    const p = scrollProgressRef.current;

    nodeRefs.current.forEach((node, idx) => {
      if (!node) return;
      const targetProgress = idx === 0 ? 0.81 : 0.87;
      const active = Math.abs(p - targetProgress) < 0.11;
      const targetScale = active ? 1 : 0.85;
      const targetY = active ? 1.55 : 0.95;
      node.position.y = THREE.MathUtils.damp(node.position.y, targetY, 5, delta);
      const s = THREE.MathUtils.damp(node.scale.x, targetScale, 5, delta);
      node.scale.set(s, s, s);
    });
  });

  return (
    <group>
      {/* Floor-Lit Experience Rail (Z = -46 to Z = -60) */}
      <mesh position={[0, 0.03, -53]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.24, 15]} />
        <meshStandardMaterial color="#FF6A1A" emissive="#FF6A1A" emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.03, -53]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.9, 15]} />
        <meshStandardMaterial color="#141820" metalness={0.85} roughness={0.35} />
      </mesh>

      {/* Two Unfolding Timeline Nodes */}
      {EXPERIENCES.map((exp, idx) => (
        <group key={exp.id} position={exp.nodePosition}>
          {/* Glowing floor ring */}
          <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.62, 0.78, 32]} />
            <meshStandardMaterial
              color={exp.accentColor}
              emissive={exp.accentColor}
              emissiveIntensity={2.2}
              toneMapped={false}
            />
          </mesh>
          {/* Rising experience plaque */}
          <group
            ref={(el) => {
              nodeRefs.current[idx] = el;
            }}
            position={[0, 1.55, 0]}
            rotation={[0, idx === 0 ? 0.34 : -0.34, 0]}
          >
            <mesh castShadow>
              <boxGeometry args={[3.2, 2.05, 0.08]} />
              <meshPhysicalMaterial color="#12161F" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, 0.045]}>
              <planeGeometry args={[3.0, 1.88]} />
              <meshBasicMaterial map={expTextures[idx]} toneMapped={false} />
            </mesh>
          </group>
        </group>
      ))}

      {/* Control Room Elevated Overlook Finale (Z = -70..-76) */}
      <group position={[0, 2.55, -71.5]}>
        <pointLight position={[0, 3.2, 1.5]} color="#FFB26B" intensity={22} distance={18} decay={2} />
        {/* Steel balcony deck */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[14, 0.35, 8]} />
          <meshStandardMaterial color="#141820" metalness={0.85} roughness={0.36} />
        </mesh>
        {/* Access ramp leading up */}
        <mesh position={[0, -1.25, 6.8]} rotation={[0.38, 0, 0]}>
          <boxGeometry args={[5.4, 0.25, 7.4]} />
          <meshStandardMaterial color="#181D27" metalness={0.8} roughness={0.42} />
        </mesh>
        {/* Panoramic golden-hour window mullions */}
        {[-4.5, -1.5, 1.5, 4.5].map((x, idx) => (
          <mesh key={idx} position={[x, 2.4, -3.8]}>
            <boxGeometry args={[0.16, 4.8, 0.22]} />
            <meshStandardMaterial color="#1C212B" metalness={0.9} roughness={0.25} />
          </mesh>
        ))}

        {/* Two Physical 3D CV Console Pedestals */}
        <group
          position={[-2.2, 0.85, -1.5]}
          rotation={[0, 0.18, 0]}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHoverLabel('CV');
          }}
          onPointerOut={() => onHoverLabel(null)}
          onClick={(e) => {
            e.stopPropagation();
            onDownloadCv('uiux');
          }}
        >
          <mesh castShadow>
            <boxGeometry args={[2.1, 1.15, 0.85]} />
            <meshStandardMaterial color="#191E28" metalness={0.82} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.62, 0.15]} rotation={[-0.35, 0, 0]}>
            <boxGeometry args={[1.6, 0.14, 0.48]} />
            <meshStandardMaterial color="#FF6A1A" emissive="#FF6A1A" emissiveIntensity={1.5} toneMapped={false} />
          </mesh>
        </group>

        <group
          position={[2.2, 0.85, -1.5]}
          rotation={[0, -0.18, 0]}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHoverLabel('CV');
          }}
          onPointerOut={() => onHoverLabel(null)}
          onClick={(e) => {
            e.stopPropagation();
            onDownloadCv('video');
          }}
        >
          <mesh castShadow>
            <boxGeometry args={[2.1, 1.15, 0.85]} />
            <meshStandardMaterial color="#191E28" metalness={0.82} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.62, 0.15]} rotation={[-0.35, 0, 0]}>
            <boxGeometry args={[1.6, 0.14, 0.48]} />
            <meshStandardMaterial color="#4DE1FF" emissive="#4DE1FF" emissiveIntensity={1.5} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
