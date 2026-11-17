import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { createBrushedSteelRoughnessMap } from '../../utils/webgl';

interface Hero3DProps {
  reducedMotion: boolean;
}

/** Procedural geometric beveled letter shapes for J O H A N — zero external font JSON 404s */
function createLetterGeometry(letter: 'J' | 'O' | 'H' | 'A' | 'N'): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();

  switch (letter) {
    case 'J': {
      shape.moveTo(0.25, 1.55);
      shape.lineTo(1.15, 1.55);
      shape.lineTo(1.15, 0.35);
      shape.quadraticCurveTo(1.15, -0.05, 0.62, -0.05);
      shape.quadraticCurveTo(0.05, -0.05, 0.05, 0.42);
      shape.lineTo(0.38, 0.48);
      shape.quadraticCurveTo(0.38, 0.24, 0.62, 0.24);
      shape.quadraticCurveTo(0.82, 0.24, 0.82, 0.44);
      shape.lineTo(0.82, 1.24);
      shape.lineTo(0.25, 1.24);
      shape.closePath();
      break;
    }
    case 'O': {
      shape.moveTo(0.65, 1.58);
      shape.bezierCurveTo(1.22, 1.58, 1.32, 1.12, 1.32, 0.76);
      shape.bezierCurveTo(1.32, 0.4, 1.22, -0.06, 0.65, -0.06);
      shape.bezierCurveTo(0.08, -0.06, -0.02, 0.4, -0.02, 0.76);
      shape.bezierCurveTo(-0.02, 1.12, 0.08, 1.58, 0.65, 1.58);

      const hole = new THREE.Path();
      hole.moveTo(0.65, 1.26);
      hole.bezierCurveTo(0.38, 1.26, 0.32, 0.98, 0.32, 0.76);
      hole.bezierCurveTo(0.32, 0.54, 0.38, 0.26, 0.65, 0.26);
      hole.bezierCurveTo(0.92, 0.26, 0.98, 0.54, 0.98, 0.76);
      hole.bezierCurveTo(0.98, 0.98, 0.92, 1.26, 0.65, 1.26);
      shape.holes.push(hole);
      break;
    }
    case 'H': {
      shape.moveTo(0, 0);
      shape.lineTo(0.34, 0);
      shape.lineTo(0.34, 0.62);
      shape.lineTo(0.94, 0.62);
      shape.lineTo(0.94, 0);
      shape.lineTo(1.28, 0);
      shape.lineTo(1.28, 1.55);
      shape.lineTo(0.94, 1.55);
      shape.lineTo(0.94, 0.94);
      shape.lineTo(0.34, 0.94);
      shape.lineTo(0.34, 1.55);
      shape.lineTo(0, 1.55);
      shape.closePath();
      break;
    }
    case 'A': {
      shape.moveTo(0, 0);
      shape.lineTo(0.36, 0);
      shape.lineTo(0.48, 0.36);
      shape.lineTo(0.92, 0.36);
      shape.lineTo(1.04, 0);
      shape.lineTo(1.4, 0);
      shape.lineTo(0.88, 1.55);
      shape.lineTo(0.52, 1.55);
      shape.closePath();

      const hole = new THREE.Path();
      hole.moveTo(0.56, 0.64);
      hole.lineTo(0.84, 0.64);
      hole.lineTo(0.7, 1.15);
      hole.closePath();
      shape.holes.push(hole);
      break;
    }
    case 'N': {
      shape.moveTo(0, 0);
      shape.lineTo(0.32, 0);
      shape.lineTo(0.32, 0.98);
      shape.lineTo(0.96, 0);
      shape.lineTo(1.28, 0);
      shape.lineTo(1.28, 1.55);
      shape.lineTo(0.96, 1.55);
      shape.lineTo(0.96, 0.56);
      shape.lineTo(0.32, 1.55);
      shape.lineTo(0, 1.55);
      shape.closePath();
      break;
    }
  }

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.34,
    bevelEnabled: true,
    bevelThickness: 0.045,
    bevelSize: 0.035,
    bevelSegments: 2,
    curveSegments: 10,
  });
  geo.center();
  geo.computeVertexNormals();
  return geo;
}

export function Hero3D({ reducedMotion }: Hero3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const sweepRimRef = useRef<THREE.PointLight>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const roughMap = useMemo(() => createBrushedSteelRoughnessMap(), []);

  const letters = useMemo(() => {
    const chars: ('J' | 'O' | 'H' | 'A' | 'N')[] = ['J', 'O', 'H', 'A', 'N'];
    const offsets = [-3.25, -1.62, 0, 1.66, 3.3];
    return chars.map((ch, idx) => ({
      char: ch,
      x: offsets[idx],
      geometry: createLetterGeometry(ch),
    }));
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      roughMap.dispose();
      letters.forEach((l) => l.geometry.dispose());
    };
  }, [letters, roughMap]);

  useFrame((state, rawDelta) => {
    if (!groupRef.current || reducedMotion) return;
    const delta = Math.min(rawDelta, 0.05);
    const t = state.clock.elapsedTime;

    // Subtle magnetic tilt toward mouse cursor
    const targetRotY = pointer.current.x * 0.14;
    const targetRotX = -pointer.current.y * 0.07;
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 4.5, delta);
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 4.5, delta);

    if (sweepRimRef.current) {
      sweepRimRef.current.position.x = pointer.current.x * 5.2 + Math.sin(t * 0.7) * 1.6;
      sweepRimRef.current.position.y = 2.8 - pointer.current.y * 1.4;
    }
  });

  return (
    <group position={[0, 0, 15.2]}>
      {/* Dynamic sweeping rim light (RoomEnvironment IBL handles surrounding fill) */}
      <pointLight ref={sweepRimRef} position={[0, 3.2, 3.4]} color="#FF6A1A" intensity={24} distance={16} decay={2} />

      {/* Heavy industrial steel plinth */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.25, 0]} receiveShadow castShadow>
          <boxGeometry args={[9.4, 0.5, 2.1]} />
          <meshStandardMaterial color="#151820" metalness={0.85} roughness={0.42} />
        </mesh>
        {/* Glowing orange plinth trim strip */}
        <mesh position={[0, 0.51, 0.96]}>
          <boxGeometry args={[8.8, 0.04, 0.06]} />
          <meshStandardMaterial color="#FF6A1A" emissive="#FF6A1A" emissiveIntensity={2.2} toneMapped={false} />
        </mesh>
      </group>

      {/* Giant 3D Brushed Chrome "JOHAN" sculpture */}
      <group ref={groupRef} position={[0, 2.15, 0]}>
        {letters.map((item) => (
          <mesh
            key={item.char}
            position={[item.x, 0, 0]}
            geometry={item.geometry}
            castShadow
            receiveShadow
          >
            <meshPhysicalMaterial
              color="#E6EAF0"
              metalness={0.96}
              roughness={0.14}
              roughnessMap={roughMap}
              anisotropy={0.85}
              clearcoat={0.4}
              clearcoatRoughness={0.12}
              envMapIntensity={1.6}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
