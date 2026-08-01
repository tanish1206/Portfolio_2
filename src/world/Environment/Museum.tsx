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
  progress?: number;
}

export function CompassPedestal({
  opacity = 1,
  positionY = 0,
}: {
  opacity?: number;
  positionY?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef} position={[0, positionY, 0]}>
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

export const Museum: React.FC<MuseumProps> = ({ phase, progress = 0 }) => {
  const floorMeshRef = useRef<THREE.Mesh>(null);
  const floorMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const wallGroupRef = useRef<THREE.Group>(null);
  const wallMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const pillarsGroupRef = useRef<THREE.Group>(null);
  const pillarMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const beamsGroupRef = useRef<THREE.Group>(null);
  const steelMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const pedestalGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const p = progress;
    const lerpSpeed = Math.min(delta * 5, 1);

    // 1. Floor assembly progress (10% to 20%)
    const fProg = Math.min(1, Math.max(0, (p - 0.08) / 0.12));
    if (floorMeshRef.current && floorMatRef.current) {
      const targetScaleXZ = fProg > 0 ? 0.05 + fProg * 0.95 : 0.001;
      const targetOpacity = fProg > 0 ? 0.85 + fProg * 0.15 : 0;
      floorMeshRef.current.scale.x = THREE.MathUtils.lerp(floorMeshRef.current.scale.x, targetScaleXZ, lerpSpeed);
      floorMeshRef.current.scale.y = THREE.MathUtils.lerp(floorMeshRef.current.scale.y, targetScaleXZ, lerpSpeed);
      floorMatRef.current.opacity = THREE.MathUtils.lerp(floorMatRef.current.opacity, targetOpacity, lerpSpeed);
    }

    // 2. Pillars physical growth (20% to 35%)
    const pilProg = Math.min(1, Math.max(0, (p - 0.18) / 0.17));
    if (pillarsGroupRef.current && pillarMatRef.current) {
      const targetScaleY = pilProg > 0 ? pilProg : 0.001;
      const targetOpacity = pilProg > 0 ? 0.88 + pilProg * 0.12 : 0;
      pillarsGroupRef.current.children.forEach((child) => {
        child.scale.y = THREE.MathUtils.lerp(child.scale.y, targetScaleY, lerpSpeed);
      });
      pillarMatRef.current.opacity = THREE.MathUtils.lerp(pillarMatRef.current.opacity, targetOpacity, lerpSpeed);
    }

    // 3. Walls & Beams extrusion (35% to 50%)
    const wProg = Math.min(1, Math.max(0, (p - 0.32) / 0.18));
    if (wallGroupRef.current && wallMatRef.current) {
      const targetScaleY = wProg > 0 ? wProg : 0.001;
      const targetOpacity = wProg > 0 ? 0.90 + wProg * 0.10 : 0;
      wallGroupRef.current.children.forEach((child) => {
        child.scale.y = THREE.MathUtils.lerp(child.scale.y, targetScaleY, lerpSpeed);
      });
      wallMatRef.current.opacity = THREE.MathUtils.lerp(wallMatRef.current.opacity, targetOpacity, lerpSpeed);
    }

    if (beamsGroupRef.current && steelMatRef.current) {
      const targetPosY = THREE.MathUtils.lerp(22, 14.85, wProg);
      const targetOpacity = wProg > 0 ? 0.90 + wProg * 0.10 : 0;
      beamsGroupRef.current.position.y = THREE.MathUtils.lerp(beamsGroupRef.current.position.y, targetPosY, lerpSpeed);
      steelMatRef.current.opacity = THREE.MathUtils.lerp(steelMatRef.current.opacity, targetOpacity, lerpSpeed);
    }

    // 4. Pedestal mechanical emergence (80% to 90%)
    const pedProg = Math.min(1, Math.max(0, (p - 0.78) / 0.12));
    if (pedestalGroupRef.current) {
      const targetPedY = THREE.MathUtils.lerp(-1.4, 0, pedProg);
      pedestalGroupRef.current.position.y = THREE.MathUtils.lerp(pedestalGroupRef.current.position.y, targetPedY, lerpSpeed);
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
      <mesh ref={floorMeshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
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
      <group ref={wallGroupRef}>
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
      <group ref={pillarsGroupRef}>
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
      <group ref={beamsGroupRef} position={[0, 18, 0]}>
        {[-12, -4, 4, 12].map((z, i) => (
          <mesh key={`t${i}`} position={[0, 0, z]} castShadow>
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
          <mesh key={`l${i}`} position={[x, 0, 0]} castShadow>
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

      {/* ─── Compass Concrete Pedestal (Emerges at 80-90%) ─── */}
      <group ref={pedestalGroupRef} position={[0, -1.3, 0]}>
        <CompassPedestal opacity={1} />
      </group>
    </group>
  );
};

