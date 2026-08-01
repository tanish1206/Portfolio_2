"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WorldHubState } from "./WorldHubController";

interface LightingControllerProps {
  hubState: WorldHubState;
}

export const LightingController: React.FC<LightingControllerProps> = ({ hubState }) => {
  const spotCompassRef = useRef<THREE.SpotLight>(null);
  const spotBentoRef = useRef<THREE.SpotLight>(null);
  const spotMicRef = useRef<THREE.SpotLight>(null);

  useFrame((_, delta) => {
    // Breathing spotlight effect
    const breathe = Math.sin(Date.now() * 0.0015) * 0.3;

    // Spotlight 1: Compass (Illuminated right from start)
    if (spotCompassRef.current) {
      const targetIntensity =
        hubState.activeExhibitId === "compass" && hubState.viewMode === "WORLD_HUB"
          ? 4.2 + breathe
          : hubState.viewMode === "TRANSITIONING_TO_PROJECT"
          ? 7.0
          : 2.8 + breathe;
      spotCompassRef.current.intensity = THREE.MathUtils.lerp(
        spotCompassRef.current.intensity,
        targetIntensity,
        delta * 3
      );
    }

    // Spotlight 2: Bento Box (Only illuminated when unlockedCount >= 2)
    if (spotBentoRef.current) {
      const bentoUnlocked = hubState.unlockedCount >= 2;
      const targetIntensity = bentoUnlocked
        ? hubState.activeExhibitId === "bento"
          ? 4.5 + breathe
          : 2.2
        : 0.0; // Shrouded in total darkness until unlocked!

      spotBentoRef.current.intensity = THREE.MathUtils.lerp(
        spotBentoRef.current.intensity,
        targetIntensity,
        delta * 2
      );
    }

    // Spotlight 3: Studio Mic (Only illuminated when unlockedCount >= 3)
    if (spotMicRef.current) {
      const micUnlocked = hubState.unlockedCount >= 3;
      const targetIntensity = micUnlocked ? 2.2 : 0.0;
      spotMicRef.current.intensity = THREE.MathUtils.lerp(
        spotMicRef.current.intensity,
        targetIntensity,
        delta * 2
      );
    }
  });

  return (
    <group>
      {/* Deep Industrial Ambient Base */}
      <ambientLight intensity={0.25} color="#101010" />

      {/* Rim Warm Red Ambient Fill */}
      <pointLight position={[0, -2, -5]} intensity={0.8} color="#5A0E1A" />

      {/* Exhibit 1 Spotlight: Mechanical Brass Compass */}
      <spotLight
        ref={spotCompassRef}
        position={[0, 6.5, 1]}
        target-position={[0, 0, 0]}
        color="#B11226"
        angle={0.5}
        penumbra={0.7}
        distance={14}
        castShadow
      />

      {/* Exhibit 2 Spotlight: Smart Bento Box (Sequentially Unlocked) */}
      <spotLight
        ref={spotBentoRef}
        position={[4.5, 6.5, -2.5]}
        target-position={[4.5, 0.5, -3.5]}
        color="#D81E36"
        angle={0.45}
        penumbra={0.8}
        distance={14}
        intensity={0}
      />

      {/* Exhibit 3 Spotlight: Vintage Studio Microphone (Sequentially Unlocked) */}
      <spotLight
        ref={spotMicRef}
        position={[-4.5, 6.5, -2.5]}
        target-position={[-4.5, 0.5, -3.5]}
        color="#B11226"
        angle={0.45}
        penumbra={0.8}
        distance={14}
        intensity={0}
      />
    </group>
  );
};
