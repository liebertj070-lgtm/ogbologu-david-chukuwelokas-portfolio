import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { ZONE_WAYPOINTS } from '../../data/content';
import type { FocusTarget } from '../../types/portfolio';

interface CameraRigProps {
  scrollProgressRef: React.MutableRefObject<number>;
  focusTarget: FocusTarget | null;
  reducedMotion: boolean;
  onCameraFocusDistance?: (dist: number) => void;
}

const _camPos = new THREE.Vector3();
const _lookAt = new THREE.Vector3();
const _nextPos = new THREE.Vector3();
const _tangent = new THREE.Vector3();
const _targetQuat = new THREE.Quaternion();
const _lookMat = new THREE.Matrix4();
const _up = new THREE.Vector3(0, 1, 0);
const _rollQuat = new THREE.Quaternion();
const _zAxis = new THREE.Vector3(0, 0, 1);

export function CameraRig({
  scrollProgressRef,
  focusTarget,
  reducedMotion,
  onCameraFocusDistance,
}: CameraRigProps) {
  const { camera } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const prevScroll = useRef(0);
  const smoothScroll = useRef(0);
  const currentPos = useRef(new THREE.Vector3(...ZONE_WAYPOINTS[0].cameraPos));
  const currentLook = useRef(new THREE.Vector3(...ZONE_WAYPOINTS[0].lookAt));

  const { posCurve, lookCurve } = useMemo(() => {
    const posPoints = ZONE_WAYPOINTS.map((w) => new THREE.Vector3(...w.cameraPos));
    const lookPoints = ZONE_WAYPOINTS.map((w) => new THREE.Vector3(...w.lookAt));
    return {
      posCurve: new THREE.CatmullRomCurve3(posPoints, false, 'catmullrom', 0.45),
      lookCurve: new THREE.CatmullRomCurve3(lookPoints, false, 'catmullrom', 0.45),
    };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const tTarget = THREE.MathUtils.clamp(scrollProgressRef.current, 0, 1);

    // Smooth inertia on scroll position
    const scrollDamp = reducedMotion ? 16 : 6.5;
    smoothScroll.current = THREE.MathUtils.damp(smoothScroll.current, tTarget, scrollDamp, delta);

    const scrollSpeed = Math.abs(smoothScroll.current - prevScroll.current) / Math.max(delta, 0.001);
    prevScroll.current = smoothScroll.current;

    if (focusTarget) {
      _camPos.set(...focusTarget.cameraPos);
      _lookAt.set(...focusTarget.lookAt);
    } else {
      posCurve.getPointAt(smoothScroll.current, _camPos);
      lookCurve.getPointAt(smoothScroll.current, _lookAt);

      if (!reducedMotion) {
        const t = state.clock.elapsedTime;
        // Subtle atmospheric breathing + mouse parallax drift
        _camPos.x += pointer.current.x * 0.48 + Math.sin(t * 0.42) * 0.06;
        _camPos.y += -pointer.current.y * 0.24 + Math.cos(t * 0.55) * 0.04;
        _lookAt.x += pointer.current.x * 0.35;
        _lookAt.y += -pointer.current.y * 0.18;
      }
    }

    const rigDamp = focusTarget ? 5.2 : reducedMotion ? 12 : 5.8;
    currentPos.current.x = THREE.MathUtils.damp(currentPos.current.x, _camPos.x, rigDamp, delta);
    currentPos.current.y = THREE.MathUtils.damp(currentPos.current.y, _camPos.y, rigDamp, delta);
    currentPos.current.z = THREE.MathUtils.damp(currentPos.current.z, _camPos.z, rigDamp, delta);

    currentLook.current.x = THREE.MathUtils.damp(currentLook.current.x, _lookAt.x, rigDamp, delta);
    currentLook.current.y = THREE.MathUtils.damp(currentLook.current.y, _lookAt.y, rigDamp, delta);
    currentLook.current.z = THREE.MathUtils.damp(currentLook.current.z, _lookAt.z, rigDamp, delta);

    camera.position.copy(currentPos.current);

    // Compute look rotation + subtle banking on turns when flying along spline
    _lookMat.lookAt(currentPos.current, currentLook.current, _up);
    _targetQuat.setFromRotationMatrix(_lookMat);

    if (!focusTarget && !reducedMotion) {
      const nextT = Math.min(1, smoothScroll.current + 0.02);
      posCurve.getPointAt(nextT, _nextPos);
      _tangent.subVectors(_nextPos, _camPos);
      const bankAngle = THREE.MathUtils.clamp(-_tangent.x * 0.025 - pointer.current.x * 0.015, -0.055, 0.055);
      _rollQuat.setFromAxisAngle(_zAxis, bankAngle);
      _targetQuat.multiply(_rollQuat);
    }

    camera.quaternion.copy(_targetQuat);

    // Subtle speed-based FOV punch
    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov = focusTarget ? 42 : 48 + Math.min(7, scrollSpeed * 12);
      const nextFov = THREE.MathUtils.damp(camera.fov, targetFov, 5, delta);
      if (Math.abs(nextFov - camera.fov) > 0.01) {
        camera.fov = nextFov;
        camera.updateProjectionMatrix();
      }
    }

    if (onCameraFocusDistance) {
      onCameraFocusDistance(currentPos.current.distanceTo(currentLook.current));
    }
  });

  return null;
}
