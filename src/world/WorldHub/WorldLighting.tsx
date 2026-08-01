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
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLeftRef = useRef<THREE.PointLight>(null);
  const rimRightRef = useRef<THREE.PointLight>(null);
  const constrLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const p = progress;
    const lerpSpeed = Math.min(delta * 5, 1);

    // 1. Primary Spotlight Ignition (50% to 65% progress)
    const spotProg = Math.min(1, Math.max(0, (p - 0.45) / 0.15));
    const baseSpot = spotProg * 22.0;
    const targetSpotIntensity = baseSpot > 0 ? baseSpot + Math.sin(t * 0.45) * 1.2 : 0;

    // 2. Wide Crimson Halo Ignition (55% to 65% progress)
    const haloProg = Math.min(1, Math.max(0, (p - 0.50) / 0.15));
    const targetHaloIntensity = haloProg * 8.5;

    // 3. Key Directional Architectural Light (10% to 100%)
    const dirProg = Math.min(1, Math.max(0, (p - 0.05) / 0.25));
    const targetDirIntensity = 0.4 + dirProg * 1.8;

    // 4. Secondary Soft Ivory Rim Lights (60% to 75% progress)
    const rimProg = Math.min(1, Math.max(0, (p - 0.30) / 0.30));
    const targetRimIntensity = 0.5 + rimProg * 2.2;

    // 5. Construction Ambient Illumination (0.05 to 1.0 progress)
    const constrProg = Math.min(1, Math.max(0, (p - 0.05) / 0.20));
    const targetAmbient = 0.50 + constrProg * 0.45; // Range 0.50 to 0.95
    const targetConstrIntensity = 1.0 + constrProg * 5.5;

    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        ambientRef.current.intensity,
        targetAmbient,
        lerpSpeed
      );
    }

    if (dirLightRef.current) {
      dirLightRef.current.intensity = THREE.MathUtils.lerp(
        dirLightRef.current.intensity,
        targetDirIntensity,
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
        targetRimIntensity * 0.85,
        lerpSpeed
      );
    }
  });

  return (
    <group>
      {/* Global Ambient — Warm Ivory fill for crystal-clear concrete visibility */}
      <ambientLight ref={ambientRef} intensity={0.65} color="#D8C4B6" />

      {/* Key Directional Architectural Sun Light — casts realistic shadows */}
      <directionalLight
        ref={dirLightRef}
        position={[12, 20, 10]}
        color="#F0E2D0"
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0003}
      />

      {/* Central Red Point Light — fills hall with crimson warmth */}
      <pointLight
        ref={constrLightRef}
        position={[0, 6, 0]}
        color="#FF2A4B"
        intensity={3.5}
        distance={35}
      />

      {/* Primary Warm Crimson Spotlight on Pedestal */}
      <spotLight
        ref={spotLightRef}
        position={[0, 15, 0.5]}
        color="#FF1E40"
        angle={0.55}
        penumbra={0.7}
        distance={35}
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
        position={[0, 12, 0]}
        color="#DC143C"
        angle={0.80}
        penumbra={0.9}
        distance={30}
        intensity={0}
      />

      {/* Secondary Soft Ivory Rim Lights for Concrete Pillars */}
      <pointLight
        ref={rimLeftRef}
        position={[-14, 9, -4]}
        color="#F8EAD8"
        intensity={1.5}
        distance={40}
      />
      <pointLight
        ref={rimRightRef}
        position={[14, 9, -4]}
        color="#F8EAD8"
        intensity={1.5}
        distance={40}
      />

      {/* Ground Warmth Fill */}
      <pointLight
        position={[0, 1.2, 2]}
        color="#8B2500"
        intensity={1.2}
        distance={18}
      />
    </group>
  );
};

