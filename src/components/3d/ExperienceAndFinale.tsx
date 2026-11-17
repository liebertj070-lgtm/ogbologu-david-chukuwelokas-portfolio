import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { EXPERIENCES } from '../../data/content';
import { createCvSheetTexture, createSlotScreenTexture } from '../../utils/webgl';

interface ExperienceAndFinaleProps {
  scrollProgressRef: React.MutableRefObject<number>;
  reducedMotion: boolean;
  onDownloadCv: (type: 'uiux' | 'video') => void;
  onHoverLabel: (label: string | null) => void;
}

interface StudioCvTableProps {
  variant: 'uiux' | 'video';
  position: [number, number, number];
  rotationY: number;
  accentColor: string;
  cvTexture: THREE.Texture;
  onDownload: () => void;
  onHoverLabel: (label: string | null) => void;
}

function StudioCvTable({
  variant,
  position,
  rotationY,
  accentColor,
  cvTexture,
  onDownload,
  onHoverLabel,
}: StudioCvTableProps) {
  const [hovered, setHovered] = useState(false);
  const sheetGroupRef = useRef<THREE.Group>(null);
  const isLeft = variant === 'uiux';
  const paperTilt = isLeft ? 0.04 : -0.04;
  const lampSide = isLeft ? -0.94 : 0.94;

  useFrame((_, rawDelta) => {
    if (!sheetGroupRef.current) return;
    const delta = Math.min(rawDelta, 0.05);
    const targetY = hovered ? 0.945 : 0.918;
    sheetGroupRef.current.position.y = THREE.MathUtils.damp(
      sheetGroupRef.current.position.y,
      targetY,
      10,
      delta
    );
  });

  return (
    <group
      position={position}
      rotation={[0, rotationY, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHoverLabel(isLeft ? 'Download UI/UX CV' : 'Download Video CV');
      }}
      onPointerOut={() => {
        setHovered(false);
        onHoverLabel(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onDownload();
      }}
    >
      {/* Brushed Steel Table Legs (4 corners, grounded at local Y=0) */}
      {[
        [-1.08, 0.41, -0.64],
        [1.08, 0.41, -0.64],
        [-1.08, 0.41, 0.64],
        [1.08, 0.41, 0.64],
      ].map(([lx, ly, lz], i) => (
        <mesh key={i} position={[lx, ly, lz]} castShadow>
          <boxGeometry args={[0.07, 0.82, 0.07]} />
          <meshStandardMaterial color="#1B2029" metalness={0.86} roughness={0.32} />
        </mesh>
      ))}

      {/* Side Structural Stretcher Bars */}
      <mesh position={[-1.08, 0.22, 0]}>
        <boxGeometry args={[0.045, 0.045, 1.24]} />
        <meshStandardMaterial color="#181C24" metalness={0.85} roughness={0.35} />
      </mesh>
      <mesh position={[1.08, 0.22, 0]}>
        <boxGeometry args={[0.045, 0.045, 1.24]} />
        <meshStandardMaterial color="#181C24" metalness={0.85} roughness={0.35} />
      </mesh>

      {/* Dark Smoked-Walnut Studio Tabletop */}
      <mesh position={[0, 0.86, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.42, 0.08, 1.56]} />
        <meshStandardMaterial color="#27201B" metalness={0.12} roughness={0.62} />
      </mesh>

      {/* Matte Charcoal Desk Blotter Pad */}
      <mesh position={[0, 0.904, 0.03]} receiveShadow>
        <boxGeometry args={[1.66, 0.01, 1.18]} />
        <meshStandardMaterial color="#11141B" metalness={0.15} roughness={0.85} />
      </mesh>

      {/* Subtle Accent Locator Bar along front edge of desk pad */}
      <mesh position={[0, 0.911, 0.59]}>
        <boxGeometry args={[0.82, 0.008, 0.024]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={hovered ? 2.4 : 0.95}
          toneMapped={false}
        />
      </mesh>

      {/* Underlay Backing CV Page (tucked slightly rotated for paper stack realism) */}
      <mesh position={[0.02, 0.911, -0.01]} rotation={[-Math.PI / 2, 0, -paperTilt * 1.4]}>
        <planeGeometry args={[0.78, 1.1]} />
        <meshStandardMaterial color="#E4E1DA" roughness={0.85} metalness={0.02} />
      </mesh>

      {/* Hero Physical A4 CV Document Lying Flat on Table */}
      <group ref={sheetGroupRef} position={[0, 0.918, 0]} rotation={[0, paperTilt, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <planeGeometry args={[0.78, 1.1]} />
          <meshStandardMaterial
            map={cvTexture}
            roughness={0.68}
            metalness={0.02}
            emissive="#FFFFFF"
            emissiveIntensity={hovered ? 0.09 : 0.02}
          />
        </mesh>
      </group>

      {/* Minimalist Architectural Desk Lamp on Back Corner */}
      <group position={[lampSide, 0.9, -0.56]} rotation={[0, isLeft ? 0.65 : -0.65, 0]}>
        <mesh position={[0, 0.018, 0]}>
          <cylinderGeometry args={[0.11, 0.12, 0.036, 18]} />
          <meshStandardMaterial color="#151922" metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.24, -0.03]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.014, 0.016, 0.46, 8]} />
          <meshStandardMaterial color="#2A313D" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.46, 0.1]} rotation={[0.45, 0, 0]}>
          <boxGeometry args={[0.26, 0.045, 0.14]} />
          <meshStandardMaterial color="#141820" metalness={0.8} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.435, 0.1]} rotation={[0.45, 0, 0]}>
          <planeGeometry args={[0.22, 0.09]} />
          <meshStandardMaterial
            color="#FFE2B8"
            emissive={accentColor}
            emissiveIntensity={hovered ? 2.6 : 1.5}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Signature Tactile Desk Props (UI/UX Stylus + Swatch vs Video SSD + Slate Marker) */}
      {isLeft ? (
        <group position={[0.64, 0.912, 0.18]}>
          {/* Matte Figma Swatch Card */}
          <mesh rotation={[0, -0.22, 0]}>
            <boxGeometry args={[0.22, 0.012, 0.3]} />
            <meshStandardMaterial color="#1B2230" roughness={0.5} metalness={0.25} />
          </mesh>
          {/* Aluminum Stylus */}
          <mesh position={[-0.18, 0.008, 0.04]} rotation={[Math.PI / 2, 0, 0.18]}>
            <cylinderGeometry args={[0.011, 0.011, 0.34, 10]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.22} />
          </mesh>
        </group>
      ) : (
        <group position={[-0.64, 0.914, 0.18]}>
          {/* Portable Aluminum Media SSD */}
          <mesh rotation={[0, 0.24, 0]}>
            <boxGeometry args={[0.18, 0.022, 0.28]} />
            <meshStandardMaterial color="#232A36" metalness={0.85} roughness={0.28} />
          </mesh>
          {/* SSD Activity Indicator */}
          <mesh position={[0.04, 0.014, 0.08]} rotation={[0, 0.24, 0]}>
            <boxGeometry args={[0.04, 0.005, 0.015]} />
            <meshStandardMaterial color="#4DE1FF" emissive="#4DE1FF" emissiveIntensity={1.6} toneMapped={false} />
          </mesh>
        </group>
      )}
    </group>
  );
}

export function ExperienceAndFinale({
  scrollProgressRef,
  reducedMotion,
  onDownloadCv,
  onHoverLabel,
}: ExperienceAndFinaleProps) {
  const { gl } = useThree();
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

  const cvTextures = useMemo(() => {
    const aniso = Math.min(8, gl.capabilities.getMaxAnisotropy());
    return {
      uiux: createCvSheetTexture('uiux', aniso),
      video: createCvSheetTexture('video', aniso),
    };
  }, [gl]);

  useEffect(() => {
    return () => {
      expTextures.forEach((t) => t.dispose());
      cvTextures.uiux.dispose();
      cvTextures.video.dispose();
    };
  }, [expTextures, cvTextures]);

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
        {/* Single warm overhead studio key light illuminating both CV tables */}
        <pointLight position={[0, 4.3, -1.2]} color="#FFD6AA" intensity={26} distance={16} decay={2} />

        {/* Steel balcony deck */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[14, 0.35, 8.2]} />
          <meshStandardMaterial color="#141820" metalness={0.84} roughness={0.38} />
        </mesh>

        {/* Subtle Recessed Amber Safety Trim along Front & Rear Balcony Edge */}
        <mesh position={[0, 0.18, -3.98]}>
          <boxGeometry args={[13.6, 0.02, 0.08]} />
          <meshStandardMaterial color="#FF6A1A" emissive="#FF6A1A" emissiveIntensity={1.1} toneMapped={false} />
        </mesh>

        {/* Front & Side Balcony Safety Handrails */}
        {[-6.8, -4.6, -2.7, 2.7, 4.6, 6.8].map((rx, idx) => (
          <mesh key={idx} position={[rx, 0.66, 3.95]}>
            <boxGeometry args={[0.06, 0.96, 0.06]} />
            <meshStandardMaterial color="#252B36" metalness={0.88} roughness={0.3} />
          </mesh>
        ))}
        <mesh position={[-4.75, 1.12, 3.95]}>
          <boxGeometry args={[4.2, 0.05, 0.07]} />
          <meshStandardMaterial color="#384152" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[4.75, 1.12, 3.95]}>
          <boxGeometry args={[4.2, 0.05, 0.07]} />
          <meshStandardMaterial color="#384152" metalness={0.9} roughness={0.25} />
        </mesh>

        {/* Access ramp leading up + subtle warm step lights */}
        <mesh position={[0, -1.25, 6.8]} rotation={[0.38, 0, 0]}>
          <boxGeometry args={[5.4, 0.25, 7.4]} />
          <meshStandardMaterial color="#181D27" metalness={0.8} roughness={0.42} />
        </mesh>
        {[4.8, 6.8, 8.8].map((rz, idx) => (
          <mesh key={idx} position={[0, -1.12 - idx * 0.72, rz]} rotation={[0.38, 0, 0]}>
            <boxGeometry args={[4.2, 0.02, 0.08]} />
            <meshStandardMaterial color="#FF6A1A" emissive="#FF6A1A" emissiveIntensity={0.9} toneMapped={false} />
          </mesh>
        ))}

        {/* Panoramic golden-hour window mullions framing the harbour overlook */}
        {[-5.2, -1.75, 1.75, 5.2].map((x, idx) => (
          <mesh key={idx} position={[x, 2.5, -3.95]}>
            <boxGeometry args={[0.16, 4.9, 0.22]} />
            <meshStandardMaterial color="#1C212B" metalness={0.9} roughness={0.26} />
          </mesh>
        ))}
        <mesh position={[0, 4.95, -3.95]}>
          <boxGeometry args={[14, 0.22, 0.28]} />
          <meshStandardMaterial color="#1C212B" metalness={0.9} roughness={0.26} />
        </mesh>

        {/* Two Studio Briefing Tables with Physical CVs Lying On Top */}
        <StudioCvTable
          variant="uiux"
          position={[-1.85, 0.175, -1.35]}
          rotationY={0.08}
          accentColor="#FF6A1A"
          cvTexture={cvTextures.uiux}
          onDownload={() => onDownloadCv('uiux')}
          onHoverLabel={onHoverLabel}
        />

        <StudioCvTable
          variant="video"
          position={[1.85, 0.175, -1.35]}
          rotationY={-0.08}
          accentColor="#4DE1FF"
          cvTexture={cvTextures.video}
          onDownload={() => onDownloadCv('video')}
          onHoverLabel={onHoverLabel}
        />
      </group>
    </group>
  );
}
