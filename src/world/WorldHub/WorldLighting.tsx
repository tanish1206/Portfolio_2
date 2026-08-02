"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WorldPhase } from "@/world/WorldController";

/**
 * WorldLighting.tsx
 *
 * Cinematic Exhibition Lighting System.
 * Strict Palette:
 *  - Primary Accent: Deep Cinematic Red (#B11226)
 *  - Secondary: Neutral White (#EAEAEA)
 *  - Ambient: Warm Ivory / Indirect Shadow Fill (#D8C4B6)
 *  - ZERO cyan or blue anywhere.
 *
 * Proportionate to 9.6m lowered ceiling height.
 */

interface WorldLightingProps {
  phase: WorldPhase;
  progress?: number;
  compassUnlocked?: boolean;
}

export const WorldLighting: React.FC<WorldLightingProps> = ({ phase, progress = 0 }) => {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const mainSpotRef = useRef<THREE.SpotLight>(null);
  const mainSpotTargetRef = useRef<THREE.Object3D>(null);

  // 5 Overhead Red Spotlights along central gallery aisle (Ceiling height: 9.6m)
  const spotlightPositions: [number, number, number][] = useMemo(
    () => [
      [0, 9.2, -16],
      [0, 9.2, -8],
      [0, 9.2, 0],
      [0, 9.2, 8],
      [0, 9.2, 16],
    ],
    []
  );

  const aisleSpotRefs = useRef<(THREE.SpotLight | null)[]>([]);
  const aisleTargetRefs = useRef<(THREE.Object3D | null)[]>([]);

  // Neutral White Rim Lights for Pillars
  const rimLeftRef = useRef<THREE.PointLight>(null);
  const rimRightRef = useRef<THREE.PointLight>(null);
  const rimBackRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const p = progress;
    const lerpSpeed = Math.min(delta * 5, 1);

    // 1. Ambient & Directional Key Light Progress (0.05 to 1.0)
    // Ensures concrete architecture is fully visible and physical
    const targetAmbient = p < 0.65 ? 0.60 : 0.85;
    const targetDirIntensity = 0.5 + p * 1.5;

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

    // 2. Sequential Red Spotlight Activation (65% to 75%)
    spotlightPositions.forEach((_, idx) => {
      const spotLight = aisleSpotRefs.current[idx];
      const targetObj = aisleTargetRefs.current[idx];
      if (spotLight && targetObj) {
        // Sequential staggering across the 5 spotlights
        const startP = 0.65 + (idx / spotlightPositions.length) * 0.08;
        const spotProg = Math.min(1, Math.max(0, (p - startP) / 0.04));

        // Base red spotlight intensity with subtle organic breathing
        const baseIntensity = spotProg * 28.0;
        const finalIntensity = baseIntensity > 0 ? baseIntensity + Math.sin(t * 0.5 + idx) * 1.2 : 0;

        spotLight.intensity = THREE.MathUtils.lerp(spotLight.intensity, finalIntensity, lerpSpeed);
        spotLight.target = targetObj;
        spotLight.target.updateMatrixWorld();
      }
    });

    // 3. Central Pedestal Primary Spotlight & Spotlight Narrowing (95% to 100%)
    if (mainSpotRef.current && mainSpotTargetRef.current) {
      const spotIgnite = Math.min(1, Math.max(0, (p - 0.65) / 0.10));
      const isSettling = Math.min(1, Math.max(0, (p - 0.95) / 0.05));

      const targetAngle = THREE.MathUtils.lerp(0.55, 0.32, isSettling);
      const targetIntensity = spotIgnite * 32.0 + Math.sin(t * 0.4) * 1.5;

      mainSpotRef.current.angle = THREE.MathUtils.lerp(mainSpotRef.current.angle, targetAngle, lerpSpeed);
      mainSpotRef.current.intensity = THREE.MathUtils.lerp(mainSpotRef.current.intensity, targetIntensity, lerpSpeed);
      mainSpotRef.current.position.x = Math.sin(t * 0.15) * 0.05;
      mainSpotRef.current.target = mainSpotTargetRef.current;
      mainSpotRef.current.target.updateMatrixWorld();
    }

    // 4. Soft Neutral White Rim Lights (65% to 75%)
    const rimProg = Math.min(1, Math.max(0, (p - 0.65) / 0.10));
    const targetRimIntensity = 1.0 + rimProg * 3.5;

    if (rimLeftRef.current) {
      rimLeftRef.current.intensity = THREE.MathUtils.lerp(rimLeftRef.current.intensity, targetRimIntensity, lerpSpeed);
    }
    if (rimRightRef.current) {
      rimRightRef.current.intensity = THREE.MathUtils.lerp(rimRightRef.current.intensity, targetRimIntensity, lerpSpeed);
    }
    if (rimBackRef.current) {
      rimBackRef.current.intensity = THREE.MathUtils.lerp(rimBackRef.current.intensity, targetRimIntensity * 0.7, lerpSpeed);
    }
  });

  return (
    <group>
      {/* Global Ambient — Warm Ivory fill for crystal-clear concrete visibility */}
      <ambientLight ref={ambientRef} intensity={0.65} color="#D8C4B6" />

      {/* Key Directional Architectural Sun Light — casts realistic shadows across pillars */}
      <directionalLight
        ref={dirLightRef}
        position={[12, 18, 10]}
        color="#F5E8D8"
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0003}
      />

      {/* Primary Deep Cinematic Red Spotlight on Pedestal (Origin [0, 0, 0]) */}
      <spotLight
        ref={mainSpotRef}
        position={[0, 9.4, 0.5]}
        color="#B11226"
        angle={0.55}
        penumbra={0.75}
        distance={28}
        intensity={0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0005}
      />
      <object3D ref={mainSpotTargetRef} position={[0, 1.25, 0]} />

      {/* Sequential Overhead Deep Red Spotlights along Aisle */}
      {spotlightPositions.map(([x, y, z], idx) => (
        <React.Fragment key={`aisle-spot-frag-${idx}`}>
          <spotLight
            ref={(el) => {
              aisleSpotRefs.current[idx] = el;
            }}
            position={[x, y, z]}
            color="#B11226"
            angle={0.50}
            penumbra={0.80}
            distance={25}
            intensity={0}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-bias={-0.0005}
          />
          <object3D
            ref={(el) => {
              aisleTargetRefs.current[idx] = el;
            }}
            position={[x, 0, z]}
          />
        </React.Fragment>
      ))}

      {/* Secondary Soft Neutral White Rim Lights highlighting Concrete Pillars */}
      <pointLight
        ref={rimLeftRef}
        position={[-12.5, 6.5, 0]}
        color="#EAEAEA"
        intensity={1.0}
        distance={30}
      />
      <pointLight
        ref={rimRightRef}
        position={[12.5, 6.5, 0]}
        color="#EAEAEA"
        intensity={1.0}
        distance={30}
      />
      <pointLight
        ref={rimBackRef}
        position={[0, 6.5, -20]}
        color="#EAEAEA"
        intensity={0.7}
        distance={30}
      />
    </group>
  );
};
