"use client";

import React, { useRef } from "react";
import * as THREE from "three";

/**
 * Museum.tsx — Environment/
 * Procedural industrial museum geometry.
 * Built with PBR materials (MeshStandardMaterial).
 * Scale: ~26m wide × 15m tall × 24m deep
 * No external model required.
 */

// Shared materials — only defined once to avoid re-creation
const concreteMat = new THREE.MeshStandardMaterial({
  color: "#1C1C1C",
  roughness: 0.92,
  metalness: 0.05,
});

const darkConcreteFloorMat = new THREE.MeshStandardMaterial({
  color: "#0E0E0E",
  roughness: 0.3,
  metalness: 0.55,
  envMapIntensity: 0.8,
});

const steelMat = new THREE.MeshStandardMaterial({
  color: "#2A2A2A",
  roughness: 0.45,
  metalness: 0.88,
});

const stonePedestalMat = new THREE.MeshStandardMaterial({
  color: "#1A1212",
  roughness: 0.78,
  metalness: 0.12,
});

function MuseumFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <primitive object={darkConcreteFloorMat} />
    </mesh>
  );
}

function MuseumCeiling() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 15, 0]}>
      <planeGeometry args={[60, 60]} />
      <primitive object={concreteMat} />
    </mesh>
  );
}

function MuseumWalls() {
  return (
    <group>
      {/* Far back wall */}
      <mesh position={[0, 7.5, -12]} receiveShadow>
        <planeGeometry args={[28, 15]} />
        <primitive object={concreteMat} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-14, 7.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[24, 15]} />
        <primitive object={concreteMat} />
      </mesh>
      {/* Right wall */}
      <mesh position={[14, 7.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[24, 15]} />
        <primitive object={concreteMat} />
      </mesh>
    </group>
  );
}

function IndustrialPillars() {
  const positions: [number, number, number][] = [
    [-5.5, 0, -6],
    [5.5, 0, -6],
    [-5.5, 0, 4],
    [5.5, 0, 4],
    [-11, 0, -6],
    [11, 0, -6],
  ];
  return (
    <group>
      {positions.map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          {/* Concrete pillar body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.1, 15, 1.1]} />
            <primitive object={concreteMat} />
          </mesh>
          {/* Steel base plate */}
          <mesh position={[0, -7.3, 0]}>
            <boxGeometry args={[1.5, 0.15, 1.5]} />
            <primitive object={steelMat} />
          </mesh>
          {/* Steel capital plate */}
          <mesh position={[0, 7.3, 0]}>
            <boxGeometry args={[1.5, 0.15, 1.5]} />
            <primitive object={steelMat} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function SteelBeams() {
  // Horizontal beams connecting pillar tops
  const beams: { pos: [number, number, number]; size: [number, number, number] }[] = [
    { pos: [0, 14.6, -6],   size: [24, 0.22, 0.22] },
    { pos: [-5.5, 14.6, -1], size: [0.22, 0.22, 10] },
    { pos: [5.5, 14.6, -1],  size: [0.22, 0.22, 10] },
  ];
  return (
    <group>
      {beams.map(({ pos, size }, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={size} />
          <primitive object={steelMat} />
        </mesh>
      ))}
    </group>
  );
}

/** Stone pedestal that the Compass sits on */
export function CompassPedestal() {
  return (
    <group position={[0, 0, 0]}>
      {/* Lower plinth */}
      <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
        <boxGeometry args={[1.4, 0.5, 1.4]} />
        <primitive object={stonePedestalMat} />
      </mesh>
      {/* Upper narrower column */}
      <mesh castShadow receiveShadow position={[0, 0.85, 0]}>
        <boxGeometry args={[0.9, 0.7, 0.9]} />
        <primitive object={stonePedestalMat} />
      </mesh>
      {/* Flat top display surface */}
      <mesh castShadow receiveShadow position={[0, 1.22, 0]}>
        <boxGeometry args={[1.05, 0.06, 1.05]} />
        <meshStandardMaterial color="#0A0808" roughness={0.25} metalness={0.4} />
      </mesh>
    </group>
  );
}

export const Museum: React.FC = () => (
  <group>
    <MuseumFloor />
    <MuseumCeiling />
    <MuseumWalls />
    <IndustrialPillars />
    <SteelBeams />
  </group>
);
