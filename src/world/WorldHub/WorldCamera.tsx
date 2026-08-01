"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WorldPhase } from "@/world/WorldController";

/**
 * WorldCamera.tsx
 * Cinematographer camera — physically motivated, weighted lerp.
 * Phases map to specific camera positions and looks.
 * Never snaps. Always weighted-interpolated.
 */

interface WorldCameraProps {
  phase: WorldPhase;
}

// Camera keyframes per phase
const CAMERA_STATES: Record<
  WorldPhase,
  { pos: [number, number, number]; look: [number, number, number]; fovTarget: number }
> = {
  HERO:              { pos: [0, 1.8, 9],       look: [0, 1.5, 0],   fovTarget: 60 },
  FLY_THROUGH:       { pos: [0, 1.5, 6],       look: [0, 1.0, -4],  fovTarget: 72 }, // rushing forward
  MUSEUM_ENTER:      { pos: [0, 9, 12],         look: [0, 1.0, 0],   fovTarget: 65 }, // high crane
  MUSEUM_SETTLE:     { pos: [0, 3.2, 9],        look: [0, 1.2, 0],   fovTarget: 60 }, // dropping toward floor
  MUSEUM_IDLE:       { pos: [0, 2.2, 5.5],      look: [0, 1.0, 0],   fovTarget: 55 }, // settled, compass in view
  COMPASS_HOVER:     { pos: [0, 2.0, 4.2],      look: [0, 1.0, 0],   fovTarget: 52 }, // subtle zoom in
  COMPASS_TRANSFORM: { pos: [0, 1.6, 2.4],      look: [0, 0.9, 0],   fovTarget: 48 }, // close dolly into compass
  CAREER_COMPASS:    { pos: [0, 1.2, 3.5],      look: [0, 0.6, 0],   fovTarget: 55 },
  RETURNING:         { pos: [-2.5, 3.5, 8],     look: [0, 1.5, 0],   fovTarget: 62 }, // crane back out
};

export const WorldCamera: React.FC<WorldCameraProps> = ({ phase }) => {
  const fovRef = useRef(60);
  const currentPos = useRef(new THREE.Vector3(0, 1.8, 9));
  const currentLook = useRef(new THREE.Vector3(0, 1.5, 0));

  // Add subtle mouse parallax
  const pointerOffset = useRef(new THREE.Vector2(0, 0));

  useFrame((state, delta) => {
    const cfg = CAMERA_STATES[phase];
    const targetPos = new THREE.Vector3(...cfg.pos);
    const targetLook = new THREE.Vector3(...cfg.look);

    // Mouse parallax — only in MUSEUM_IDLE to add life
    if (phase === "MUSEUM_IDLE" || phase === "COMPASS_HOVER") {
      pointerOffset.current.lerp(state.pointer, delta * 2);
      targetPos.x += pointerOffset.current.x * 0.4;
      targetPos.y += pointerOffset.current.y * 0.2;
      targetLook.x += pointerOffset.current.x * 0.15;
    }

    // Choose lerp speeds — slow transitions feel cinematic
    const lerpSpeed =
      phase === "FLY_THROUGH" ? 0.6
      : phase === "MUSEUM_ENTER" ? 0.25
      : phase === "MUSEUM_SETTLE" ? 0.18
      : phase === "COMPASS_TRANSFORM" ? 0.35
      : phase === "RETURNING" ? 0.2
      : 0.04; // MUSEUM_IDLE — very slow floating

    const smoothed = Math.min(delta * lerpSpeed * 60, 1.0);

    currentPos.current.lerp(targetPos, smoothed);
    currentLook.current.lerp(targetLook, smoothed);

    // FOV lerp
    fovRef.current = THREE.MathUtils.lerp(fovRef.current, cfg.fovTarget, smoothed * 0.3);

    state.camera.position.copy(currentPos.current);
    state.camera.lookAt(currentLook.current);
    if ((state.camera as THREE.PerspectiveCamera).fov !== undefined) {
      (state.camera as THREE.PerspectiveCamera).fov = fovRef.current;
      (state.camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    }
  });

  return null;
};
