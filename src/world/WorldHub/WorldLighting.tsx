"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * WorldLighting.tsx
 *
 * Museum-grade cinematic lighting.
 * The key insight: the environment MUST be faintly visible so visitors
 * understand they're inside a physical space. Total darkness hides the architecture.
 *
 * Hierarchy:
 *  1. Global ambient — just enough to see concrete silhouettes (~0.35)
 *  2. Primary spotlight — tight crimson beam on compass pedestal
 *  3. Wide red halo — fills floor zone with deep red glow
 *  4. White rim fills — left/right, reveal pillar/wall edges
 *  5. Warm floor bounce — grounding warmth from below
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
    // Micro position drift — makes light rays shift subtly
    lightRef.current.position.x = position[0] + Math.sin(t * 0.18) * 0.06;
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
      {/*
        Global ambient — critical: must be high enough that visitors
        see the concrete walls, pillars, and floor.
        This is a MUSEUM, not a black void.
        0.38 gives dark-but-visible, like a real gallery at night.
      */}
      <ambientLight intensity={0.38} color="#1A0D0D" />

      {/* PRIMARY: Tight crimson feature spotlight — THE focal point */}
      {compassUnlocked && (
        <>
          {/* Main narrow beam — sharp cone on pedestal */}
          <BreathingSpotlight
            position={[0, 13.2, 1.5]}
            targetPos={[0, 1.3, 0]}
            color="#CC1530"
            baseIntensity={9.0}
            breatheAmp={0.5}
            breatheSpeed={0.42}
            angle={0.20}
            penumbra={0.55}
            distance={22}
            castShadow
          />
          {/* Wide halo — red floor glow around exhibit zone */}
          <BreathingSpotlight
            position={[0, 9, 1.0]}
            targetPos={[0, 0, 0]}
            color="#7A0F1E"
            baseIntensity={3.5}
            breatheAmp={0.3}
            breatheSpeed={0.28}
            angle={0.65}
            penumbra={1.0}
            distance={20}
          />
        </>
      )}

      {/* White rim left — reveals left wall & pillar silhouettes */}
      <pointLight
        position={[-16, 7, -3]}
        color="#E8E0D5"
        intensity={0.55}
        distance={32}
      />
      {/* White rim right */}
      <pointLight
        position={[16, 7, -3]}
        color="#DDD5C8"
        intensity={0.40}
        distance={30}
      />

      {/* Warm amber from floor level — grounding warmth */}
      <pointLight
        position={[0, 0.8, 2]}
        color="#6B2A0A"
        intensity={0.7}
        distance={10}
      />

      {/* Very faint blue-cold ceiling fill — contrast to red warmth, gives depth */}
      <pointLight
        position={[0, 13, -6]}
        color="#151522"
        intensity={0.25}
        distance={28}
      />

      {/* Pillar accent lights — barely visible warm highlights */}
      <pointLight position={[-6, 4, -8]} color="#3A1A08" intensity={0.4} distance={8} />
      <pointLight position={[6, 4, -8]} color="#3A1A08" intensity={0.4} distance={8} />
    </group>
  );
};
