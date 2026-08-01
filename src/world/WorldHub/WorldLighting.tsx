"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * WorldLighting.tsx
 *
 * Museum-grade cinematic lighting:
 *  - Primary: deep red feature spotlight on compass pedestal
 *  - Secondary: very dim white rim fills from the sides
 *  - Architectural: warm amber accent from floor level
 *  - Zero cyan. Zero neon. Zero futuristic.
 *
 * All spotlights breathe — nothing is static.
 */

interface BreathingSpotlightProps {
  position: [number, number, number];
  targetPos: [number, number, number];
  color: string;
  baseIntensity: number;
  breatheAmp?: number;
  breatheSpeed?: number;
  angle?: number;
  penumbra?: number;
  distance?: number;
  castShadow?: boolean;
}

function BreathingSpotlight({
  position,
  targetPos,
  color,
  baseIntensity,
  breatheAmp = 0.15,
  breatheSpeed = 0.5,
  angle = 0.3,
  penumbra = 0.75,
  distance = 22,
  castShadow = false,
}: BreathingSpotlightProps) {
  const lightRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(null);

  useFrame(({ clock }) => {
    if (!lightRef.current) return;
    const t = clock.getElapsedTime();
    lightRef.current.intensity =
      baseIntensity + Math.sin(t * breatheSpeed) * breatheAmp;
    // Subtle position micro-drift for light rays
    lightRef.current.position.x = position[0] + Math.sin(t * 0.18) * 0.08;
    if (targetRef.current) {
      lightRef.current.target = targetRef.current;
      lightRef.current.target.updateMatrixWorld();
    }
  });

  return (
    <>
      <spotLight
        ref={lightRef}
        position={position}
        color={color}
        angle={angle}
        penumbra={penumbra}
        distance={distance}
        intensity={baseIntensity}
        castShadow={castShadow}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-bias={-0.0005}
      />
      <object3D ref={targetRef} position={targetPos} />
    </>
  );
}

interface WorldLightingProps {
  compassUnlocked: boolean;
}

export const WorldLighting: React.FC<WorldLightingProps> = ({ compassUnlocked }) => {
  return (
    <group>
      {/* Absolute base ambient — just enough to see silhouettes, not fill */}
      <ambientLight intensity={0.07} color="#0E0608" />

      {/* PRIMARY: Warm crimson feature spotlight over compass — the entire scene pivots around this */}
      {compassUnlocked && (
        <>
          {/* Main tight beam */}
          <BreathingSpotlight
            position={[0, 13.5, 1.2]}
            targetPos={[0, 1.3, 0]}
            color="#C01228"
            baseIntensity={7.5}
            breatheAmp={0.4}
            breatheSpeed={0.45}
            angle={0.18}
            penumbra={0.6}
            distance={20}
            castShadow
          />
          {/* Wide soft halo around the exhibit zone — makes the floor glow red */}
          <BreathingSpotlight
            position={[0, 11, 0.5]}
            targetPos={[0, 0, 0]}
            color="#6A0A18"
            baseIntensity={2.2}
            breatheAmp={0.2}
            breatheSpeed={0.3}
            angle={0.55}
            penumbra={1.0}
            distance={18}
          />
        </>
      )}

      {/* SECONDARY: Faint cool white rim from far left — reveals wall & pillar silhouettes */}
      <pointLight
        position={[-18, 8, 0]}
        color="#F0EEE8"
        intensity={0.22}
        distance={30}
      />
      {/* Faint right rim */}
      <pointLight
        position={[18, 8, 0]}
        color="#EDE8E0"
        intensity={0.14}
        distance={28}
      />

      {/* ACCENT: Very dim warm amber from floor level — gives sense of grounded warmth */}
      <pointLight
        position={[0, 0.5, 0]}
        color="#5A1A08"
        intensity={0.35}
        distance={8}
      />

      {/* Deep ceiling bounce — subtle depth cue */}
      <pointLight
        position={[0, 13.5, -4]}
        color="#0E0303"
        intensity={0.18}
        distance={25}
      />
    </group>
  );
};
