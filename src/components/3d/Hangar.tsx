import { MeshReflectorMaterial } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { ResolvedQuality } from '../../types/portfolio';
import { createWetConcreteTextures } from '../../utils/webgl';

interface HangarProps {
  quality: ResolvedQuality;
  isSoftwareGl: boolean;
  reducedMotion: boolean;
}

const RIB_COUNT = 18;
const _dummy = new THREE.Object3D();

export function Hangar({ quality, isSoftwareGl, reducedMotion }: HangarProps) {
  const { gl } = useThree();
  const ribsLeftRef = useRef<THREE.InstancedMesh>(null);
  const ribsRightRef = useRef<THREE.InstancedMesh>(null);
  const raftersRef = useRef<THREE.InstancedMesh>(null);
  const gantryLightsRef = useRef<THREE.InstancedMesh>(null);
  const sweepLightRef = useRef<THREE.SpotLight>(null);
  const sweepTargetRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const weldLightRef = useRef<THREE.PointLight>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const concrete = useMemo(() => {
    const aniso = Math.min(8, gl.capabilities.getMaxAnisotropy());
    return createWetConcreteTextures(aniso);
  }, [gl]);

  useEffect(() => {
    return () => {
      concrete.colorMap.dispose();
      concrete.roughnessMap.dispose();
    };
  }, [concrete]);

  // Populate instanced steel ribs, overhead trusses, and gantry lamp strips
  useEffect(() => {
    for (let i = 0; i < RIB_COUNT; i++) {
      const z = 32 - i * 6.4;

      if (ribsLeftRef.current) {
        _dummy.position.set(-10.5, 5.2, z);
        _dummy.rotation.set(0, 0, 0);
        _dummy.scale.set(1, 1, 1);
        _dummy.updateMatrix();
        ribsLeftRef.current.setMatrixAt(i, _dummy.matrix);
      }

      if (ribsRightRef.current) {
        _dummy.position.set(10.5, 5.2, z);
        _dummy.rotation.set(0, 0, 0);
        _dummy.scale.set(1, 1, 1);
        _dummy.updateMatrix();
        ribsRightRef.current.setMatrixAt(i, _dummy.matrix);
      }

      if (raftersRef.current) {
        _dummy.position.set(0, 10.4, z);
        _dummy.rotation.set(0, 0, 0);
        _dummy.scale.set(1, 1, 1);
        _dummy.updateMatrix();
        raftersRef.current.setMatrixAt(i, _dummy.matrix);
      }

      if (gantryLightsRef.current) {
        _dummy.position.set(0, 9.75, z);
        _dummy.rotation.set(0, 0, 0);
        _dummy.scale.set(1, 1, 1);
        _dummy.updateMatrix();
        gantryLightsRef.current.setMatrixAt(i, _dummy.matrix);
      }
    }

    if (ribsLeftRef.current) {
      ribsLeftRef.current.instanceMatrix.needsUpdate = true;
      ribsLeftRef.current.computeBoundingSphere();
    }
    if (ribsRightRef.current) {
      ribsRightRef.current.instanceMatrix.needsUpdate = true;
      ribsRightRef.current.computeBoundingSphere();
    }
    if (raftersRef.current) {
      raftersRef.current.instanceMatrix.needsUpdate = true;
      raftersRef.current.computeBoundingSphere();
    }
    if (gantryLightsRef.current) {
      gantryLightsRef.current.instanceMatrix.needsUpdate = true;
      gantryLightsRef.current.computeBoundingSphere();
    }
  }, []);

  // Floating dust motes + distant ember sparks
  const particleCount = quality === 'high' ? 420 : quality === 'medium' ? 220 : 80;
  const particleGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const orange = new THREE.Color('#FF6A1A');
    const cyan = new THREE.Color('#4DE1FF');
    const dust = new THREE.Color('#9AA5B8');

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = 0.25 + Math.random() * 8.5;
      positions[i * 3 + 2] = 30 - Math.random() * 106;

      const r = Math.random();
      const c = r < 0.14 ? orange : r < 0.24 ? cyan : dust;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [particleCount]);

  useEffect(() => {
    return () => {
      particleGeometry.dispose();
    };
  }, [particleGeometry]);

  useFrame((state, rawDelta) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    const delta = Math.min(rawDelta, 0.05);

    // Sweeping gantry searchlight
    if (sweepLightRef.current) {
      sweepTargetRef.current.position.set(
        Math.sin(t * 0.45) * 5.5,
        0,
        -12 + Math.cos(t * 0.3) * 18
      );
      sweepLightRef.current.target = sweepTargetRef.current;
    }

    // Distant welding arc flicker in side bay
    if (weldLightRef.current) {
      const burst = Math.sin(t * 23) * Math.sin(t * 7.3);
      weldLightRef.current.intensity = burst > 0.45 ? 18 * burst : 0.4;
    }

    // Gentle upward drift of dust motes
    if (particlesRef.current) {
      const posAttr = particlesRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        let y = posAttr.getY(i) + delta * (0.06 + (i % 5) * 0.012);
        if (y > 9.0) y = 0.25;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;
    }
  });

  const useRealReflector = !isSoftwareGl && quality !== 'low';
  const showVolumetricShafts = quality !== 'low';

  return (
    <group>
      {/* Atmospheric fog matching dark graphite horizon */}
      <fogExp2 attach="fog" args={['#090B10', 0.016]} />
      <color attach="background" args={['#080A0E']} />

      {/* Warm/Cool Base Illumination */}
      <hemisphereLight args={['#4DE1FF', '#12151C', 0.52]} />
      <directionalLight
        position={[10, 16, 18]}
        intensity={1.35}
        color="#FFE2C8"
        castShadow={!isSoftwareGl && quality !== 'low'}
        shadow-mapSize-width={quality === 'high' ? 1024 : 512}
        shadow-mapSize-height={quality === 'high' ? 1024 : 512}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />

      {/* Sweeping gantry spotlight */}
      <primitive object={sweepTargetRef.current} />
      {quality !== 'low' && (
        <spotLight
          ref={sweepLightRef}
          position={[0, 9.5, -8]}
          angle={0.42}
          penumbra={0.75}
          intensity={35}
          distance={46}
          color="#FF8C42"
        />
      )}

      {/* Distant welding point flicker */}
      <pointLight ref={weldLightRef} position={[9.2, 1.4, -32]} color="#FF7A2E" distance={16} decay={2} />

      {/* Wet Concrete Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -24]} receiveShadow>
        <planeGeometry args={[28, 128]} />
        {useRealReflector ? (
          <MeshReflectorMaterial
            blur={[280, 90]}
            resolution={quality === 'high' ? 512 : 256}
            mixBlur={0.85}
            mixStrength={22}
            roughness={0.58}
            roughnessMap={concrete.roughnessMap}
            map={concrete.colorMap}
            depthScale={0.45}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#1B1F28"
            metalness={0.35}
            mirror={0.45}
          />
        ) : (
          <meshPhysicalMaterial
            map={concrete.colorMap}
            roughnessMap={concrete.roughnessMap}
            color="#1E232E"
            roughness={0.32}
            metalness={0.28}
            clearcoat={0.75}
            clearcoatRoughness={0.18}
          />
        )}
      </mesh>

      {/* Subtle safety floor stripe along center aisle (offset Y by 0.02 to avoid Z-fighting) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-7.6, 0.015, -24]}>
        <planeGeometry args={[0.14, 118]} />
        <meshStandardMaterial color="#FF6A1A" emissive="#FF6A1A" emissiveIntensity={0.4} roughness={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[7.6, 0.015, -24]}>
        <planeGeometry args={[0.14, 118]} />
        <meshStandardMaterial color="#FF6A1A" emissive="#FF6A1A" emissiveIntensity={0.4} roughness={0.5} />
      </mesh>

      {/* Industrial Side Walls (corrugated dark graphite steel) */}
      <mesh position={[-11.2, 5.2, -24]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[128, 11]} />
        <meshStandardMaterial color="#11141B" roughness={0.72} metalness={0.62} />
      </mesh>
      <mesh position={[11.2, 5.2, -24]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[128, 11]} />
        <meshStandardMaterial color="#11141B" roughness={0.72} metalness={0.62} />
      </mesh>

      {/* Hangar Roof Deck */}
      <mesh position={[0, 10.9, -24]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[23, 128]} />
        <meshStandardMaterial color="#0A0C11" roughness={0.85} metalness={0.5} />
      </mesh>

      {/* Instanced Steel I-Beam Columns & Overhead Trusses */}
      <instancedMesh ref={ribsLeftRef} args={[undefined, undefined, RIB_COUNT]} castShadow>
        <boxGeometry args={[0.55, 10.6, 0.65]} />
        <meshStandardMaterial color="#1E232D" metalness={0.85} roughness={0.38} />
      </instancedMesh>
      <instancedMesh ref={ribsRightRef} args={[undefined, undefined, RIB_COUNT]} castShadow>
        <boxGeometry args={[0.55, 10.6, 0.65]} />
        <meshStandardMaterial color="#1E232D" metalness={0.85} roughness={0.38} />
      </instancedMesh>
      <instancedMesh ref={raftersRef} args={[undefined, undefined, RIB_COUNT]}>
        <boxGeometry args={[21.5, 0.55, 0.5]} />
        <meshStandardMaterial color="#181C24" metalness={0.88} roughness={0.34} />
      </instancedMesh>
      <instancedMesh ref={gantryLightsRef} args={[undefined, undefined, RIB_COUNT]}>
        <boxGeometry args={[4.2, 0.14, 0.22]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#DDEEFF"
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </instancedMesh>

      {/* Composite Overhead Gantry Crane #1 (around Z = 4) */}
      <group position={[0, 8.6, 4]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[20.5, 0.65, 0.7]} />
          <meshStandardMaterial color="#D95312" metalness={0.65} roughness={0.38} />
        </mesh>
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[20.5, 0.25, 0.9]} />
          <meshStandardMaterial color="#1E222B" metalness={0.85} roughness={0.32} />
        </mesh>
        {/* Trolley carriage */}
        <mesh position={[-2.8, -0.45, 0]}>
          <boxGeometry args={[2.1, 0.55, 1.3]} />
          <meshStandardMaterial color="#2A303D" metalness={0.85} roughness={0.3} />
        </mesh>
        {/* Hoist cables & hook block */}
        <mesh position={[-3.1, -1.6, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 2.2, 8]} />
          <meshStandardMaterial color="#9CA3AF" metalness={0.95} roughness={0.2} />
        </mesh>
        <mesh position={[-2.5, -1.6, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 2.2, 8]} />
          <meshStandardMaterial color="#9CA3AF" metalness={0.95} roughness={0.2} />
        </mesh>
        <mesh position={[-2.8, -2.75, 0]}>
          <boxGeometry args={[0.85, 0.45, 0.45]} />
          <meshStandardMaterial color="#FF6A1A" metalness={0.5} roughness={0.45} />
        </mesh>
      </group>

      {/* Composite Overhead Gantry Crane #2 (around Z = -28) */}
      <group position={[0, 8.6, -28]}>
        <mesh>
          <boxGeometry args={[20.5, 0.65, 0.7]} />
          <meshStandardMaterial color="#252B36" metalness={0.8} roughness={0.35} />
        </mesh>
        <mesh position={[3.2, -0.45, 0]}>
          <boxGeometry args={[1.9, 0.5, 1.2]} />
          <meshStandardMaterial color="#FF6A1A" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[3.2, -1.5, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.8, 8]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.2} />
        </mesh>
      </group>

      {/* Volumetric God-Ray Light Shafts */}
      {showVolumetricShafts && (
        <group>
          {[
            { pos: [-4.5, 5.2, 14] as [number, number, number], rotZ: -0.24, color: '#FF9A5C', op: 0.055 },
            { pos: [4.2, 5.2, -1] as [number, number, number], rotZ: 0.22, color: '#4DE1FF', op: 0.045 },
            { pos: [-3.8, 5.2, -20] as [number, number, number], rotZ: -0.18, color: '#4DE1FF', op: 0.04 },
            { pos: [3.6, 5.2, -37] as [number, number, number], rotZ: 0.2, color: '#FF6A1A', op: 0.05 },
          ].map((shaft, idx) => (
            <mesh key={idx} position={shaft.pos} rotation={[0, 0, shaft.rotZ]}>
              <coneGeometry args={[3.4, 11.5, 24, 1, true]} />
              <meshBasicMaterial
                color={shaft.color}
                transparent
                opacity={shaft.op}
                side={THREE.DoubleSide}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Distant Golden-Hour Harbour Backdrop at end of Hangar (Z = -84) */}
      <mesh position={[0, 5.2, -84]}>
        <planeGeometry args={[28, 12]} />
        <meshBasicMaterial color="#FFB26B" />
      </mesh>
      <mesh position={[0, 3.6, -83.5]}>
        <planeGeometry args={[28, 5.5]} />
        <meshBasicMaterial color="#FF6A1A" transparent opacity={0.42} />
      </mesh>

      {/* Floating Dust & Welding Spark Particles */}
      <points ref={particlesRef} geometry={particleGeometry}>
        <pointsMaterial
          size={0.075}
          vertexColors
          transparent
          opacity={0.68}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
