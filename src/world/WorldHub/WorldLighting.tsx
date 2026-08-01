"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * WorldLighting.tsx
 * Museum-grade lighting:
 *  - Warm crimson featured spotlight on the compass pedestal
 *  - Soft white rim fills from deep corners
 *  - Volumetric breathing intensity
 *  - Absolute darkness everywhere else
 */

function BreathingSpotlight({
  position,
  target,
  color,
  baseIntensity,
  breatheAmount = 0.2,
  breatheSpeed = 0.6,
  angle = 0.35,
  penumbra = 0.7,
  distance = 18,
}: {
  position: [number, number, number];
  target: [number, number, number];
  color: string;
  baseIntensity: number;
  breatheAmount?: number;
  breatheSpeed?: number;
  angle?: number;
  penumbra?: number;
  distance?: number;
}) {
  const lightRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(null);

  useFrame(({ clock }) => {
    if (!lightRef.current) return;
    const t = clock.getElapsedTime();
    lightRef.current.intensity = baseIntensity + Math.sin(t * breatheSpeed) * breatheAmount;
    if (targetRef.current) {
      lightRef.current.target = targetRef.current;
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
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
      />
      {/* invisible target object */}
      <object3D ref={targetRef} position={target} />
    </>
  );
}

export const WorldLighting: React.FC<{ compassUnlocked: boolean }> = ({ compassUnlocked }) => {
  return (
    <group>
      {/* Absolute minimum ambient — keeps geometry from being invisible black silhouettes */}
      <ambientLight intensity={0.08} color="#120608" />

      {/* Main feature spotlight — Compass pedestal. Warm crimson. Breathing. */}
      {compassUnlocked && (
        <BreathingSpotlight
          position={[0, 11, 1.5]}
          target={[0, 0.9, 0]}
          color="#C41230"
          baseIntensity={6.0}
          breatheAmount={0.5}
          breatheSpeed={0.55}
          angle={0.22}
          penumbra={0.65}
          distance={22}
        />
      )}

      {/* Very dim secondary warm key from left — reveals wall concrete texture */}
      <pointLight
        position={[-12, 7, -3]}
        color="#6B2020"
        intensity={0.9}
        distance={22}
      />

      {/* Even dimmer right rim fill */}
      <pointLight
        position={[12, 5, -3]}
        color="#4A1515"
        intensity={0.55}
        distance={20}
      />

      {/* Deep ceiling bounce — barely visible, gives sense of depth */}
      <pointLight
        position={[0, 14, -5]}
        color="#1A0505"
        intensity={0.3}
        distance={28}
      />
    </group>
  );
};
