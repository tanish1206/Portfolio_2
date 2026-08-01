"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WorldPhase } from "@/world/WorldController";

/**
 * WorldCamera.tsx
 *
 * Cinematographer camera — physically motivated, weighted lerp.
 * Every movement is filmed. Nothing snaps or cuts.
 *
 * Sequence after Hero:
 *  FLY_THROUGH   → rushing forward at low level (fast)
 *  MUSEUM_ENTER  → appear inside hall, slightly elevated, wide FOV (slow drift in)
 *  MUSEUM_SETTLE → camera moves to human eye level, compass enters frame
 *  MUSEUM_IDLE   → settled, slight parallax from mouse movement
 */

interface WorldCameraProps {
  phase: WorldPhase;
}

type Keyframe = {
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
  speed: number;
};

const KEYFRAMES: Record<WorldPhase, Keyframe> = {
  // Parked during Hero — canvas exists behind overlay
  HERO:              { pos: [0, 2.0, 12.0],  look: [0, 1.8, 0],  fov: 60, speed: 0.05 },

  // Phase 2: Rushing forward through darkness with particles surrounding camera
  FLY_THROUGH:       { pos: [0, 1.4, 8.5],   look: [0, 1.2, -4], fov: 76, speed: 0.25 },

  // Phase 3: Moving through darkness
  DARK_TRAVERSE:     { pos: [0, 2.8, 14.0],  look: [0, 2.0, -6], fov: 72, speed: 0.18 },

  // Phase 4: Faint fog materializes — elevated wide view
  FOG_APPEAR:        { pos: [0, 4.2, 12.5],  look: [0, 1.8, 0],  fov: 68, speed: 0.14 },

  // Phase 5: Concrete floor materializes — slow crane forward
  FLOOR_REVEAL:      { pos: [0, 3.5, 10.0],  look: [0, 1.5, 0],  fov: 64, speed: 0.12 },

  // Phase 6: Red spotlight switches on pedestal
  SPOTLIGHT_ON:      { pos: [0, 2.8, 8.0],   look: [0, 1.4, 0],  fov: 60, speed: 0.10 },

  // Phase 7-8: Concrete pillars & dust fade into view
  PILLARS_FADE:      { pos: [0, 2.3, 6.6],   look: [0, 1.3, 0],  fov: 56, speed: 0.08 },

  // Phase 9-10: Large architectural hall framing, camera slows down
  MUSEUM_SETTLE:     { pos: [0, 2.0, 5.5],   look: [0, 1.25, 0], fov: 54, speed: 0.05 },

  // Phase 11-12: Camera settles at eye level, compass illuminated
  MUSEUM_IDLE:       { pos: [0, 2.0, 5.2],   look: [0, 1.25, 0], fov: 52, speed: 0.03 },

  // Push in toward compass on hover
  COMPASS_HOVER:     { pos: [0, 1.9, 4.4],   look: [0, 1.25, 0], fov: 48, speed: 0.08 },

  // Close dolly into compass as it transforms
  COMPASS_TRANSFORM: { pos: [0, 1.5, 2.5],   look: [0, 1.2, 0],  fov: 44, speed: 0.20 },

  // Inside project world
  CAREER_COMPASS:    { pos: [0, 1.2, 3.5],   look: [0, 0.8, 0],  fov: 55, speed: 0.05 },

  // Pull back out to hall
  RETURNING:         { pos: [-2, 3.5, 8.5],  look: [0, 1.5, 0],  fov: 64, speed: 0.14 },
};

export const WorldCamera: React.FC<WorldCameraProps> = ({ phase }) => {
  const posRef  = useRef(new THREE.Vector3(0, 1.8, 9.5));
  const lookRef = useRef(new THREE.Vector3(0, 1.5, 0));
  const fovRef  = useRef(60);
  const mouseRef = useRef(new THREE.Vector2(0, 0));

  useFrame((state, delta) => {
    const kf = KEYFRAMES[phase];
    const tPos  = new THREE.Vector3(...kf.pos);
    const tLook = new THREE.Vector3(...kf.look);

    // Mouse parallax — idle + hover only
    if (phase === "MUSEUM_IDLE" || phase === "COMPASS_HOVER") {
      mouseRef.current.lerp(state.pointer, delta * 1.6);
      tPos.x  += mouseRef.current.x * 0.32;
      tPos.y  += mouseRef.current.y * 0.12;
      tLook.x += mouseRef.current.x * 0.10;
    }

    // Weighted lerp — clamp so it never fully snaps on first frame
    const t = Math.min(delta * kf.speed * 60, 0.92);

    posRef.current.lerp(tPos, t);
    lookRef.current.lerp(tLook, t);
    fovRef.current = THREE.MathUtils.lerp(fovRef.current, kf.fov, t * 0.22);

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
