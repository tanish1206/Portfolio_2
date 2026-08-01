"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WorldPhase } from "@/world/WorldController";

/**
 * Museum.tsx — Environment/
 *
 * Procedural PBR Architectural Gallery.
 * Dimensions: 25m wide × 15m high × 36m deep
 * Phased arrival material reveal animation.
 */

interface MuseumProps {
  phase: WorldPhase;
}

export function CompassPedestal({ opacity = 1 }: { opacity?: number }) {
  return (
    <group position={[0, 0, 0]}>
      {/* Circular lower plinth */}
      <mesh castShadow receiveShadow position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.95, 1.05, 0.24, 32]} />
        <meshStandardMaterial
          color="#121010"
          roughness={0.85}
          metalness={0.12}
          transparent
          opacity={opacity}
        />
      </mesh>
      {/* Main concrete column */}
      <mesh castShadow receiveShadow position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.60, 0.65, 0.96, 32]} />
        <meshStandardMaterial
          color="#161414"
          roughness={0.88}
          metalness={0.10}
          transparent
          opacity={opacity}
        />
      </mesh>
      {/* Top display cap */}
      <mesh castShadow receiveShadow position={[0, 1.24, 0]}>
        <cylinderGeometry args={[0.72, 0.70, 0.08, 32]} />
        <meshStandardMaterial
          color="#1A1818"
          roughness={0.70}
          metalness={0.25}
          transparent
          opacity={opacity}
        />
      </mesh>
      {/* Polished top face reflection cap */}
      <mesh receiveShadow position={[0, 1.282, 0]}>
        <cylinderGeometry args={[0.68, 0.68, 0.005, 32]} />
        <meshStandardMaterial
          color="#080606"
          roughness={0.15}
          metalness={0.70}
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  );
}

export const Museum: React.FC<MuseumProps> = ({ phase }) => {
  const floorMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const wallMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const pillarMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const steelMatRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    // 1. Calculate target floor opacity
    let targetFloor = 0;
    if (
      phase === "FLOOR_REVEAL" ||
      phase === "SPOTLIGHT_ON" ||
      phase === "PILLARS_FADE" ||
      phase === "MUSEUM_SETTLE" ||
      phase === "MUSEUM_IDLE" ||
      phase === "COMPASS_HOVER" ||
      phase === "COMPASS_TRANSFORM" ||
      phase === "CAREER_COMPASS" ||
      phase === "RETURNING"
    ) {
      targetFloor = phase === "FLOOR_REVEAL" ? 0.65 : 1.0;
    }

    // 2. Calculate target architecture (pillars/walls/beams) opacity
    let targetArch = 0;
    if (
      phase === "SPOTLIGHT_ON" ||
      phase === "PILLARS_FADE" ||
      phase === "MUSEUM_SETTLE" ||
      phase === "MUSEUM_IDLE" ||
      phase === "COMPASS_HOVER" ||
      phase === "COMPASS_TRANSFORM" ||
      phase === "CAREER_COMPASS" ||
      phase === "RETURNING"
    ) {
      targetArch = phase === "SPOTLIGHT_ON" ? 0.25 : 1.0;
    }

    const t = Math.min(delta * 2.5, 1);

    if (floorMatRef.current) {
      floorMatRef.current.opacity = THREE.MathUtils.lerp(
        floorMatRef.current.opacity,
        targetFloor,
        t
      );
    }
    if (wallMatRef.current) {
      wallMatRef.current.opacity = THREE.MathUtils.lerp(
        wallMatRef.current.opacity,
        targetArch,
        t
      );
    }
    if (pillarMatRef.current) {
      pillarMatRef.current.opacity = THREE.MathUtils.lerp(
        pillarMatRef.current.opacity,
        targetArch,
        t
      );
    }
    if (steelMatRef.current) {
      steelMatRef.current.opacity = THREE.MathUtils.lerp(
        steelMatRef.current.opacity,
        targetArch,
        t
      );
    }
  });

  const pillarPositions: [number, number, number][] = [
    [-9, 0, -12],
    [9, 0, -12],
    [-9, 0, -4],
    [9, 0, -4],
    [-9, 0, 4],
    [9, 0, 4],
    [-9, 0, 12],
    [9, 0, 12],
  ];

  return (
    <group>
      {/* ─── Polished Concrete Floor (25m × 36m) ─── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          ref={floorMatRef}
          color="#0A0A0A"
          roughness={0.22}
          metalness={0.58}
          transparent
          opacity={0}
        />
      </mesh>

      {/* ─── Concrete Ceiling (15m Height) ─── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 15, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          ref={wallMatRef}
          color="#121212"
          roughness={0.95}
          metalness={0.05}
          transparent
          opacity={0}
        />
      </mesh>

      {/* ─── Walls (25m Wide Hall Boundaries) ─── */}
      <group>
        {/* Back wall */}
        <mesh position={[0, 7.5, -18]} receiveShadow>
          <planeGeometry args={[26, 15]} />
          <meshStandardMaterial
            ref={wallMatRef}
            color="#141414"
            roughness={0.96}
            metalness={0.04}
            transparent
            opacity={0}
          />
        </mesh>
        {/* Left wall */}
        <mesh position={[-12.5, 7.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[36, 15]} />
          <meshStandardMaterial
            ref={wallMatRef}
            color="#121212"
            roughness={0.96}
            metalness={0.04}
            transparent
            opacity={0}
          />
        </mesh>
        {/* Right wall */}
        <mesh position={[12.5, 7.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[36, 15]} />
          <meshStandardMaterial
            ref={wallMatRef}
            color="#121212"
            roughness={0.96}
            metalness={0.04}
            transparent
            opacity={0}
          />
        </mesh>
      </group>

      {/* ─── Tall Concrete Pillars (15m Tall) ─── */}
      <group>
        {pillarPositions.map(([x, y, z], i) => (
          <group key={i} position={[x, y, z]}>
            {/* Cylinder column */}
            <mesh castShadow receiveShadow position={[0, 7.5, 0]}>
              <cylinderGeometry args={[0.65, 0.72, 15, 24]} />
              <meshStandardMaterial
                ref={pillarMatRef}
                color="#1A1818"
                roughness={0.92}
                metalness={0.06}
                transparent
                opacity={0}
              />
            </mesh>
            {/* Steel base ring */}
            <mesh position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.85, 0.85, 0.1, 24]} />
              <meshStandardMaterial
                ref={steelMatRef}
                color="#282525"
                roughness={0.45}
                metalness={0.88}
                transparent
                opacity={0}
              />
            </mesh>
            {/* Steel capital ring */}
            <mesh position={[0, 14.95, 0]}>
              <cylinderGeometry args={[0.85, 0.85, 0.1, 24]} />
              <meshStandardMaterial
                ref={steelMatRef}
                color="#282525"
                roughness={0.45}
                metalness={0.88}
                transparent
                opacity={0}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* ─── Structural Ceiling Beams ─── */}
      <group>
        {[-12, -4, 4, 12].map((z, i) => (
          <mesh key={`t${i}`} position={[0, 14.85, z]} castShadow>
            <boxGeometry args={[25, 0.35, 0.35]} />
            <meshStandardMaterial
              ref={steelMatRef}
              color="#222020"
              roughness={0.40}
              metalness={0.85}
              transparent
              opacity={0}
            />
          </mesh>
        ))}
        {[-9, 9].map((x, i) => (
          <mesh key={`l${i}`} position={[x, 14.85, 0]} castShadow>
            <boxGeometry args={[0.30, 0.30, 36]} />
            <meshStandardMaterial
              ref={steelMatRef}
              color="#222020"
              roughness={0.40}
              metalness={0.85}
              transparent
              opacity={0}
            />
          </mesh>
        ))}
      </group>

      {/* ─── Floor Accent Inset Line ─── */}
      <group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
          <ringGeometry args={[2.8, 2.85, 64]} />
          <meshStandardMaterial color="#260C10" roughness={0.5} metalness={0.7} />
        </mesh>
      </group>

      {/* ─── Compass Concrete Pedestal ─── */}
      <CompassPedestal opacity={1} />
    </group>
  );
};

