"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WorldPhase } from "@/world/WorldController";

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
  phase: WorldPhase;
  progress?: number;
  compassUnlocked?: boolean;
}

export const WorldLighting: React.FC<WorldLightingProps> = ({ phase, progress = 0 }) => {
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const haloLightRef = useRef<THREE.SpotLight>(null);
  const spotTargetRef = useRef<THREE.Object3D>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const rimLeftRef = useRef<THREE.PointLight>(null);
  const rimRightRef = useRef<THREE.PointLight>(null);
  const constrLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const p = progress;
    const lerpSpeed = Math.min(delta * 4, 1);

    // 1. Primary Spotlight Ignition (50% to 65% progress)
    const spotProg = Math.min(1, Math.max(0, (p - 0.50) / 0.12));
    const baseSpot = spotProg * 14.0;
    const targetSpotIntensity = baseSpot > 0 ? baseSpot + Math.sin(t * 0.45) * 0.6 : 0;

    // 2. Wide Crimson Halo Ignition (55% to 65% progress)
    const haloProg = Math.min(1, Math.max(0, (p - 0.55) / 0.10));
    const targetHaloIntensity = haloProg * 5.5;

    // 3. Secondary Soft Ivory Rim Lights (60% to 75% progress)
    const rimProg = Math.min(1, Math.max(0, (p - 0.60) / 0.12));
    const targetRimIntensity = rimProg * 0.85;

    // 4. Construction Ambient Illumination (0.05 to 1.0 progress)
    // Ensures floor, pillars, and walls are clearly visible as they physically assemble
    const constrProg = Math.min(1, Math.max(0, (p - 0.05) / 0.20));
    const targetAmbient = 0.25 + constrProg * 0.35; // Range 0.25 to 0.60
    const targetConstrIntensity = constrProg * 3.5;

    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        ambientRef.current.intensity,
        targetAmbient,
        lerpSpeed
      );
    }

    if (constrLightRef.current) {
      constrLightRef.current.intensity = THREE.MathUtils.lerp(
        constrLightRef.current.intensity,
        targetConstrIntensity,
        lerpSpeed
      );
    }

    if (spotLightRef.current && spotTargetRef.current) {
      spotLightRef.current.intensity = THREE.MathUtils.lerp(
        spotLightRef.current.intensity,
        targetSpotIntensity,
        lerpSpeed
      );
      // Micro spotlight position drift for atmospheric realism
      spotLightRef.current.position.x = Math.sin(t * 0.20) * 0.08;
      spotLightRef.current.target = spotTargetRef.current;
      spotLightRef.current.target.updateMatrixWorld();
    }

    if (haloLightRef.current) {
      haloLightRef.current.intensity = THREE.MathUtils.lerp(
        haloLightRef.current.intensity,
        targetHaloIntensity,
        lerpSpeed
      );
    }

    if (rimLeftRef.current) {
      rimLeftRef.current.intensity = THREE.MathUtils.lerp(
        rimLeftRef.current.intensity,
        targetRimIntensity,
        lerpSpeed
      );
    }
    if (rimRightRef.current) {
      rimRightRef.current.intensity = THREE.MathUtils.lerp(
        rimRightRef.current.intensity,
        targetRimIntensity * 0.75,
        lerpSpeed
      );
    }
  });

  return (
    <group>
      {/* Tertiary: Ambient fill — warm dark crimson for architectural visibility */}
      <ambientLight ref={ambientRef} intensity={0.35} color="#351216" />

      {/* Central Construction Red Point Light — illuminates floor & growing pillars */}
      <pointLight
        ref={constrLightRef}
        position={[0, 4.5, 0]}
        color="#FF1E40"
        intensity={0}
        distance={28}
      />

      {/* Primary: Warm Crimson Spotlight on Pedestal */}
      <spotLight
        ref={spotLightRef}
        position={[0, 14.2, 0.5]}
        color="#FF1E40"
        angle={0.24}
        penumbra={0.55}
        distance={28}
        intensity={0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0005}
      />
      <object3D ref={spotTargetRef} position={[0, 1.25, 0]} />

      {/* Wide floor halo glow */}
      <spotLight
        ref={haloLightRef}
        position={[0, 10, 0]}
        color="#DC143C"
        angle={0.65}
        penumbra={1.0}
        distance={22}
        intensity={0}
      />

      {/* Secondary: Soft white/ivory rim lighting for concrete pillars */}
      <pointLight
        ref={rimLeftRef}
        position={[-13, 8, -4]}
        color="#E5DACB"
        intensity={0}
        distance={35}
      />
      <pointLight
        ref={rimRightRef}
        position={[13, 8, -4]}
        color="#DDD4C8"
        intensity={0}
        distance={35}
      />

      {/* Ground warmth fill */}
      <pointLight
        position={[0, 0.9, 1.5]}
        color="#52150D"
        intensity={0.6}
        distance={14}
      />
    </group>
  );
};

