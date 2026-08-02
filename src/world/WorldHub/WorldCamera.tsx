"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WorldPhase } from "@/world/WorldController";

/**
 * WorldCamera.tsx
 *
 * Cinematographer camera — physically motivated, weighted lerp.
 * Documents the 26m × 42m × 9.6m exhibition hall construction.
 * Smooth dolly, crane, tilt, orbital sweep, and settlement framing:
 *  - Central exhibit (Brass Compass on Pedestal)
 *  - Lowered ceiling framing the top of the scene
 *  - Monumental concrete pillars & wall alcove depth
 */

interface WorldCameraProps {
  phase: WorldPhase;
  progress?: number;
}

type Keyframe = {
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
  speed: number;
};

const SCROLL_WAYPOINTS: { progress: number; pos: [number, number, number]; look: [number, number, number]; fov: number }[] = [
  { progress: 0.00, pos: [0, 2.2, 14.0],   look: [0, 2.0, 0],   fov: 60 }, // 0%: Hero void
  { progress: 0.10, pos: [0, 1.5, 10.5],   look: [0, 1.2, -6],  fov: 72 }, // 10%: Low dolly rushing into space
  { progress: 0.20, pos: [0, 3.0, 11.5],   look: [0, 3.2, -4],  fov: 66 }, // 20%: Floor expanding, crane tilt to rising pillars
  { progress: 0.35, pos: [-2.5, 3.6, 9.5],  look: [0, 4.2, -7],  fov: 62 }, // 35%: Orbital sweep revealing wall panel & alcove extrusion
  { progress: 0.50, pos: [2.5, 4.2, 8.0],   look: [0, 6.8, -3],  fov: 60 }, // 50%: High crane angle looking up at lowered ceiling trusses
  { progress: 0.65, pos: [0, 2.8, 7.0],    look: [0, 2.0, -2],  fov: 56 }, // 65%: Center aisle dolly as red spotlights ignite
  { progress: 0.75, pos: [-1.2, 2.3, 6.0], look: [0, 1.7, 0],   fov: 54 }, // 75%: Eye level glide revealing volumetric fog
  { progress: 0.85, pos: [1.2, 2.0, 5.4],  look: [0, 1.45, 0],  fov: 52 }, // 85%: Right orbital dolly showing stanchions & plinths
  { progress: 0.95, pos: [0, 1.95, 5.2],   look: [0, 1.32, 0],  fov: 50 }, // 95%: Direct push facing mechanical pedestal
  { progress: 1.00, pos: [0, 1.90, 4.8],   look: [0, 1.30, 0],  fov: 48 }, // 100%: Settled perspective framing pedestal, ceiling & pillars
];

const PROJECT_KEYFRAMES: Partial<Record<WorldPhase, Keyframe>> = {
  COMPASS_HOVER:     { pos: [0, 1.85, 4.2],  look: [0, 1.25, 0], fov: 48, speed: 0.08 },
  COMPASS_TRANSFORM: { pos: [0, 1.5, 2.5],   look: [0, 1.2, 0],  fov: 44, speed: 0.20 },
  CAREER_COMPASS:    { pos: [0, 1.2, 3.5],   look: [0, 0.8, 0],  fov: 55, speed: 0.05 },
  RETURNING:         { pos: [-2, 3.2, 8.0],  look: [0, 1.5, 0],  fov: 64, speed: 0.14 },
};

function getInterpolatedCamera(progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  for (let i = 0; i < SCROLL_WAYPOINTS.length - 1; i++) {
    const curr = SCROLL_WAYPOINTS[i];
    const next = SCROLL_WAYPOINTS[i + 1];
    if (p >= curr.progress && p <= next.progress) {
      const segProg = (p - curr.progress) / (next.progress - curr.progress);
      const lerpedPos: [number, number, number] = [
        THREE.MathUtils.lerp(curr.pos[0], next.pos[0], segProg),
        THREE.MathUtils.lerp(curr.pos[1], next.pos[1], segProg),
        THREE.MathUtils.lerp(curr.pos[2], next.pos[2], segProg),
      ];
      const lerpedLook: [number, number, number] = [
        THREE.MathUtils.lerp(curr.look[0], next.look[0], segProg),
        THREE.MathUtils.lerp(curr.look[1], next.look[1], segProg),
        THREE.MathUtils.lerp(curr.look[2], next.look[2], segProg),
      ];
      const lerpedFov = THREE.MathUtils.lerp(curr.fov, next.fov, segProg);
      return { pos: lerpedPos, look: lerpedLook, fov: lerpedFov };
    }
  }
  return SCROLL_WAYPOINTS[SCROLL_WAYPOINTS.length - 1];
}

export const WorldCamera: React.FC<WorldCameraProps> = ({ phase, progress = 0 }) => {
  const posRef  = useRef(new THREE.Vector3(0, 2.2, 14.0));
  const lookRef = useRef(new THREE.Vector3(0, 2.0, 0));
  const fovRef  = useRef(60);
  const mouseRef = useRef(new THREE.Vector2(0, 0));

  useFrame((state, delta) => {
    let tPos: THREE.Vector3;
    let tLook: THREE.Vector3;
    let targetFov: number;
    let speed = 0.08;

    const projKf = PROJECT_KEYFRAMES[phase];
    if (projKf) {
      tPos = new THREE.Vector3(...projKf.pos);
      tLook = new THREE.Vector3(...projKf.look);
      targetFov = projKf.fov;
      speed = projKf.speed;
    } else {
      const interpolated = getInterpolatedCamera(progress);
      tPos = new THREE.Vector3(...interpolated.pos);
      tLook = new THREE.Vector3(...interpolated.look);
      targetFov = interpolated.fov;
    }

    // Gentle mouse parallax at end of construction or hover
    if (phase === "MUSEUM_IDLE" || phase === "COMPASS_HOVER" || progress >= 0.98) {
      mouseRef.current.lerp(state.pointer, delta * 1.6);
      tPos.x  += mouseRef.current.x * 0.32;
      tPos.y  += mouseRef.current.y * 0.12;
      tLook.x += mouseRef.current.x * 0.10;
    }

    const t = Math.min(delta * speed * 60, 0.92);

    posRef.current.lerp(tPos, t);
    lookRef.current.lerp(tLook, t);
    fovRef.current = THREE.MathUtils.lerp(fovRef.current, targetFov, t * 0.22);

    state.camera.position.copy(posRef.current);
    state.camera.lookAt(lookRef.current);

    const cam = state.camera as THREE.PerspectiveCamera;
    if (cam.isPerspectiveCamera) {
      cam.fov = fovRef.current;
      cam.updateProjectionMatrix();
    }
  });

  return null;
};
