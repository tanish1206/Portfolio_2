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
  // Parked during Hero — canvas exists but invisible behind Hero overlay
  HERO:              { pos: [0, 1.8, 9.5],   look: [0, 1.5, 0],  fov: 60, speed: 0.05 },

  // Rushing through particle tunnel
  FLY_THROUGH:       { pos: [0, 1.2, 5.5],   look: [0, 0.8, -4], fov: 78, speed: 0.60 },

  // Museum just appeared — camera at mid height, gallery revealed
  MUSEUM_ENTER:      { pos: [0, 5.5, 11.0],  look: [0, 1.5, 0],  fov: 70, speed: 0.18 },

  // Slowly settle toward human eye level
  MUSEUM_SETTLE:     { pos: [0, 2.8, 7.5],   look: [0, 1.4, 0],  fov: 62, speed: 0.10 },

  // Resting position — compass visible, museum architecture fills frame
  MUSEUM_IDLE:       { pos: [0, 2.0, 5.5],   look: [0, 1.3, 0],  fov: 56, speed: 0.03 },

  // Push in slightly toward compass
  COMPASS_HOVER:     { pos: [0, 1.9, 4.4],   look: [0, 1.3, 0],  fov: 52, speed: 0.08 },

  // Close dolly into compass as it transforms
  COMPASS_TRANSFORM: { pos: [0, 1.5, 2.5],   look: [0, 1.2, 0],  fov: 46, speed: 0.30 },

  // Inside project world
  CAREER_COMPASS:    { pos: [0, 1.2, 3.5],   look: [0, 0.8, 0],  fov: 55, speed: 0.05 },

  // Craning back out to museum
  RETURNING:         { pos: [-2, 3.5, 8.5],  look: [0, 1.5, 0],  fov: 64, speed: 0.16 },
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
