"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";

/**
 * Museum.tsx — Environment/
 *
 * Procedural PBR industrial gallery.
 * Scale: 30m wide × 14m tall × 28m deep
 * Philosophy: composition + lighting over geometry complexity.
 * Large empty areas are intentional — negative space is the design.
 */

// ─── Shared Material Instances ────────────────────────────────────────────────

const concreteMat = new THREE.MeshStandardMaterial({
  color: "#181818",
  roughness: 0.94,
  metalness: 0.04,
});

const concreteWallMat = new THREE.MeshStandardMaterial({
  color: "#141414",
  roughness: 0.96,
  metalness: 0.02,
});

// Polished dark concrete floor — reflective
const floorMat = new THREE.MeshStandardMaterial({
  color: "#0C0C0C",
  roughness: 0.18,
  metalness: 0.65,
  envMapIntensity: 1.2,
});

const steelMat = new THREE.MeshStandardMaterial({
  color: "#252525",
  roughness: 0.42,
  metalness: 0.90,
});

const stoneMat = new THREE.MeshStandardMaterial({
  color: "#111010",
  roughness: 0.82,
  metalness: 0.08,
});

// ─── Floor ────────────────────────────────────────────────────────────────────

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <primitive object={floorMat} />
    </mesh>
  );
}

// ─── Ceiling ──────────────────────────────────────────────────────────────────

function Ceiling() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 14, 0]}>
      <planeGeometry args={[80, 80]} />
      <primitive object={concreteMat} />
    </mesh>
  );
}

// ─── Walls ────────────────────────────────────────────────────────────────────

function Walls() {
  return (
    <group>
      {/* Back wall */}
      <mesh position={[0, 7, -14]} receiveShadow>
        <planeGeometry args={[32, 14]} />
        <primitive object={concreteWallMat} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-15, 7, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[28, 14]} />
        <primitive object={concreteWallMat} />
      </mesh>
      {/* Right wall */}
      <mesh position={[15, 7, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[28, 14]} />
        <primitive object={concreteWallMat} />
      </mesh>
    </group>
  );
}

// ─── Concrete Pillars ─────────────────────────────────────────────────────────

function Pillars() {
  // Two rows of pillars flanking the central hall
  const positions: [number, number, number][] = [
    [-6, 0, -8],
    [6, 0, -8],
    [-6, 0, 2],
    [6, 0, 2],
    [-12, 0, -8],
    [12, 0, -8],
    [-12, 0, 2],
    [12, 0, 2],
  ];

  return (
    <group>
      {positions.map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          {/* Cylindrical pillar — more architectural than box */}
          <mesh castShadow receiveShadow position={[0, 7, 0]}>
            <cylinderGeometry args={[0.55, 0.60, 14, 16]} />
            <primitive object={concreteMat} />
          </mesh>
          {/* Steel base ring */}
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.75, 0.75, 0.08, 16]} />
            <primitive object={steelMat} />
          </mesh>
          {/* Steel capital ring */}
          <mesh position={[0, 13.96, 0]}>
            <cylinderGeometry args={[0.75, 0.75, 0.08, 16]} />
            <primitive object={steelMat} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── Steel Ceiling Beams ──────────────────────────────────────────────────────

function CeilingBeams() {
  const transverseBeams = [
    { z: -8, w: 32 },
    { z:  2, w: 32 },
    { z: -3, w: 32 },
  ];

  const longiBeams = [
    { x: -6 },
    { x:  6 },
    { x: -12 },
    { x:  12 },
  ];

  return (
    <group>
      {transverseBeams.map(({ z, w }, i) => (
        <mesh key={`t${i}`} position={[0, 13.85, z]} castShadow>
          <boxGeometry args={[w, 0.28, 0.28]} />
          <primitive object={steelMat} />
        </mesh>
      ))}
      {longiBeams.map(({ x }, i) => (
        <mesh key={`l${i}`} position={[x, 13.85, -5.5]} castShadow>
          <boxGeometry args={[0.2, 0.24, 17]} />
          <primitive object={steelMat} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Floor Accent Lines ───────────────────────────────────────────────────────
// Thin inset lines add architectural detail without geometry complexity

function FloorAccentLines() {
  return (
    <group>
      {/* Central approach path — guides eye toward compass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, -4]}>
        <planeGeometry args={[0.025, 12]} />
        <meshStandardMaterial color="#1E1010" roughness={0.6} metalness={0.5} />
      </mesh>
      {/* Circular exhibit ring on floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[2.4, 2.46, 64]} />
        <meshStandardMaterial color="#1E1010" roughness={0.6} metalness={0.5} />
      </mesh>
    </group>
  );
}

// ─── Stone Compass Pedestal ───────────────────────────────────────────────────

export function CompassPedestal() {
  return (
    <group position={[0, 0, 0]}>
      {/* Circular lower plinth */}
      <mesh castShadow receiveShadow position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.85, 0.90, 0.24, 32]} />
        <primitive object={stoneMat} />
      </mesh>
      {/* Main column */}
      <mesh castShadow receiveShadow position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.50, 0.55, 1.0, 32]} />
        <primitive object={stoneMat} />
      </mesh>
      {/* Top display cap */}
      <mesh castShadow receiveShadow position={[0, 1.26, 0]}>
        <cylinderGeometry args={[0.62, 0.60, 0.07, 32]} />
        <primitive object={stoneMat} />
      </mesh>
      {/* Polished top face */}
      <mesh receiveShadow position={[0, 1.298, 0]}>
        <cylinderGeometry args={[0.59, 0.59, 0.01, 32]} />
        <meshStandardMaterial color="#0A0808" roughness={0.12} metalness={0.55} />
      </mesh>
    </group>
  );
}

// ─── Museum ───────────────────────────────────────────────────────────────────

export const Museum: React.FC = () => (
  <group>
    <Floor />
    <Ceiling />
    <Walls />
    <Pillars />
    <CeilingBeams />
    <FloorAccentLines />
  </group>
);
