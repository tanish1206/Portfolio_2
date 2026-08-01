"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WorldPhase } from "@/world/WorldController";

/**
 * WorldCamera.tsx
 *
 * Cinematographer camera — physically motivated, weighted lerp.
 * Never snaps. Never cuts. Every movement is filmed.
 *
 * Camera sequence:
 *  HERO            → parked behind Hero UI (invisible to user)
 *  FLY_THROUGH     → rushing forward through particle tunnel (fast lerp)
 *  MUSEUM_ENTER    → high overhead crane shot, revealing the hall from above
 *  MUSEUM_SETTLE   → camera slowly drops down, compass enters view
 *  MUSEUM_IDLE     → camera settles at human eye level, facing compass
 *                    subtle mouse parallax keeps it alive
 *  COMPASS_HOVER   → subtle push-in toward compass
 *  COMPASS_TRANSFORM → close dolly into compass core
 *  CAREER_COMPASS  → inside project space
 *  RETURNING       → camera cranes back out as second spotlight turns on
 */

interface WorldCameraProps {
  phase: WorldPhase;
}

type CameraKeyframe = {
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
  lerpSpeed: number; // higher = faster transition
};

const KEYFRAMES: Record<WorldPhase, CameraKeyframe> = {
  HERO:              { pos: [0, 1.8, 9.0], look: [0, 1.5, 0], fov: 60, lerpSpeed: 0.05 },
  FLY_THROUGH:       { pos: [0, 1.2, 4.5], look: [0, 0.8, -6], fov: 75, lerpSpeed: 0.55 }, // fast rush
  MUSEUM_ENTER:      { pos: [0, 11, 14],   look: [0, 2.0, 0], fov: 68, lerpSpeed: 0.22 }, // high crane
  MUSEUM_SETTLE:     { pos: [0, 4.0, 10],  look: [0, 1.4, 0], fov: 62, lerpSpeed: 0.14 }, // dropping
  MUSEUM_IDLE:       { pos: [0, 2.0, 5.8], look: [0, 1.3, 0], fov: 54, lerpSpeed: 0.04 }, // settled
  COMPASS_HOVER:     { pos: [0, 1.9, 4.6], look: [0, 1.3, 0], fov: 51, lerpSpeed: 0.08 }, // push in
  COMPASS_TRANSFORM: { pos: [0, 1.6, 2.6], look: [0, 1.2, 0], fov: 46, lerpSpeed: 0.30 }, // close dolly
  CAREER_COMPASS:    { pos: [0, 1.2, 3.5], look: [0, 0.6, 0], fov: 55, lerpSpeed: 0.06 },
  RETURNING:         { pos: [-2, 4.0, 9],  look: [0, 1.5, 0], fov: 62, lerpSpeed: 0.18 }, // crane out
};

export const WorldCamera: React.FC<WorldCameraProps> = ({ phase }) => {
  const pos = useRef(new THREE.Vector3(0, 1.8, 9));
  const look = useRef(new THREE.Vector3(0, 1.5, 0));
  const fov = useRef(60);
  const mouse = useRef(new THREE.Vector2(0, 0));

  useFrame((state, delta) => {
    const kf = KEYFRAMES[phase];
    const targetPos = new THREE.Vector3(...kf.pos);
    const targetLook = new THREE.Vector3(...kf.look);

    // Subtle mouse parallax in idle — keeps the world feeling alive
    if (phase === "MUSEUM_IDLE" || phase === "COMPASS_HOVER") {
      mouse.current.lerp(state.pointer, delta * 1.8);
      targetPos.x += mouse.current.x * 0.35;
      targetPos.y += mouse.current.y * 0.15;
      targetLook.x += mouse.current.x * 0.12;
    }

    // Clamp lerp speed so it's never instant
    const speed = Math.min(delta * kf.lerpSpeed * 60, 0.95);

    pos.current.lerp(targetPos, speed);
    look.current.lerp(targetLook, speed);
    fov.current = THREE.MathUtils.lerp(fov.current, kf.fov, speed * 0.25);

    state.camera.position.copy(pos.current);
    state.camera.lookAt(look.current);

    const cam = state.camera as THREE.PerspectiveCamera;
    if (cam.isPerspectiveCamera) {
      cam.fov = fov.current;
      cam.updateProjectionMatrix();
    }
  });

  return null;
};
