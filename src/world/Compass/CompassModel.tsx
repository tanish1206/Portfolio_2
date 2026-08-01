"use client";

import React, { useRef, useState } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Points } from "@react-three/drei";
import * as THREE from "three";
import { WorldController, WorldPhase } from "@/world/WorldController";

/**
 * CompassModel.tsx — Compass/
 * Procedural Mechanical Brass Compass.
 * No GLB required. Full PBR materials.
 *
 * States:
 *  IDLE    — gentle needle sway, micro float, particle dust halo
 *  HOVER   — compass tilts toward camera, spotlight reacts, metallic tick
 *  TRANSFORM — needle detaches, glass lifts, casing separates
 */

const brassMat = new THREE.MeshStandardMaterial({
  color: "#8B6914",
  roughness: 0.28,
  metalness: 0.95,
  envMapIntensity: 1.2,
});

const antiqueBrassMat = new THREE.MeshStandardMaterial({
  color: "#6B5010",
  roughness: 0.38,
  metalness: 0.88,
});

const darkDialMat = new THREE.MeshStandardMaterial({
  color: "#080508",
  roughness: 0.22,
  metalness: 0.6,
});

const needleRedMat = new THREE.MeshStandardMaterial({
  color: "#B11226",
  emissive: "#B11226",
  emissiveIntensity: 0.7,
  roughness: 0.3,
  metalness: 0.7,
});

const needleSilverMat = new THREE.MeshStandardMaterial({
  color: "#888888",
  roughness: 0.2,
  metalness: 0.95,
});

const glassMat = new THREE.MeshPhysicalMaterial({
  color: "#AACCDD",
  transparent: true,
  opacity: 0.22,
  roughness: 0.05,
  metalness: 0.0,
  transmission: 0.85,
  thickness: 0.2,
  envMapIntensity: 1.5,
});

interface CompassModelProps {
  phase: WorldPhase;
  onHover: (isHovered: boolean) => void;
  onClick: () => void;
}

export const CompassModel: React.FC<CompassModelProps> = ({ phase, onHover, onClick }) => {
  const groupRef = useRef<THREE.Group>(null);
  const needleRef = useRef<THREE.Group>(null);
  const glassRef = useRef<THREE.Mesh>(null);
  const casingTopRef = useRef<THREE.Mesh>(null);
  const casingBotRef = useRef<THREE.Mesh>(null);

  // Dust halo around the compass
  const dustPos = React.useMemo(() => {
    const count = 120;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 0.6 + Math.random() * 0.9;
      pos[i * 3 + 0] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.8;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pos;
  }, []);

  const isTransforming = phase === "COMPASS_TRANSFORM";
  const isHovering = phase === "COMPASS_HOVER";
  const isInteractive = phase === "MUSEUM_IDLE" || phase === "COMPASS_HOVER";

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    // ── Main group ──────────────────────────────────────────────────────────
    if (groupRef.current) {
      if (isTransforming) {
        // Tilt forward & spin during transformation
        groupRef.current.rotation.y += delta * 1.8;
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x, 0.55, delta * 4
        );
      } else if (isHovering) {
        // Subtle tilt toward camera
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x, 0.22, delta * 5
        );
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y, Math.sin(t * 1.5) * 0.15, delta * 5
        );
      } else {
        // Idle micro-float
        groupRef.current.position.y = Math.sin(t * 1.2) * 0.04;
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x, Math.sin(t * 0.5) * 0.04, delta * 2
        );
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y, Math.sin(t * 0.3) * 0.06, delta * 2
        );
      }
    }

    // ── Needle ──────────────────────────────────────────────────────────────
    if (needleRef.current) {
      if (isTransforming) {
        // Detach upward + spin
        needleRef.current.position.z = THREE.MathUtils.lerp(
          needleRef.current.position.z, 1.4, delta * 3.5
        );
        needleRef.current.rotation.z += delta * 10;
      } else if (isHovering) {
        // Jitter reaction
        needleRef.current.rotation.z = THREE.MathUtils.lerp(
          needleRef.current.rotation.z, Math.sin(t * 8) * 0.25, delta * 10
        );
        needleRef.current.position.z = THREE.MathUtils.lerp(
          needleRef.current.position.z, 0.08, delta * 5
        );
      } else {
        // Slow magnetic drift
        needleRef.current.rotation.z = THREE.MathUtils.lerp(
          needleRef.current.rotation.z,
          Math.sin(t * 0.8) * 0.18 + Math.cos(t * 0.5) * 0.08,
          delta * 3
        );
        needleRef.current.position.z = THREE.MathUtils.lerp(
          needleRef.current.position.z, 0.07, delta * 4
        );
      }
    }

    // ── Glass cover ──────────────────────────────────────────────────────────
    if (glassRef.current) {
      if (isTransforming) {
        glassRef.current.position.z = THREE.MathUtils.lerp(
          glassRef.current.position.z, 1.8, delta * 3
        );
        glassRef.current.rotation.x = THREE.MathUtils.lerp(
          glassRef.current.rotation.x, 0.9, delta * 3
        );
      } else {
        glassRef.current.position.z = THREE.MathUtils.lerp(glassRef.current.position.z, 0.15, delta * 4);
        glassRef.current.rotation.x = THREE.MathUtils.lerp(glassRef.current.rotation.x, 0, delta * 4);
      }
    }

    // ── Casing halves (split apart on transform) ─────────────────────────────
    if (casingTopRef.current && casingBotRef.current) {
      const target = isTransforming ? 0.9 : 0;
      casingTopRef.current.position.y = THREE.MathUtils.lerp(casingTopRef.current.position.y, target, delta * 3);
      casingBotRef.current.position.y = THREE.MathUtils.lerp(casingBotRef.current.position.y, -target, delta * 3);
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0, 1.26, 0]}
      onPointerOver={isInteractive ? (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); onHover(true); } : undefined}
      onPointerOut={isInteractive ? () => onHover(false) : undefined}
      onClick={isInteractive ? (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onClick(); } : undefined}
    >
      {/* ── Dust halo ── */}
      <Points positions={dustPos} stride={3}>
        <pointsMaterial
          color={isHovering ? "#D81E36" : "#C8A870"}
          size={0.018}
          transparent
          opacity={isHovering ? 0.75 : 0.4}
          depthWrite={false}
          sizeAttenuation
        />
      </Points>

      {/* ── Outer Brass Bezel Ring ── */}
      <mesh ref={casingTopRef} castShadow>
        <torusGeometry args={[0.72, 0.09, 24, 64]} />
        <primitive object={brassMat} />
      </mesh>
      <mesh ref={casingBotRef} castShadow>
        <cylinderGeometry args={[0.70, 0.70, 0.11, 64]} />
        <primitive object={antiqueBrassMat} />
      </mesh>

      {/* ── Dial Face ── */}
      <mesh castShadow>
        <cylinderGeometry args={[0.66, 0.66, 0.025, 64]} />
        <primitive object={darkDialMat} />
      </mesh>

      {/* ── Compass Rose Engrave (4 lines) ── */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[0, 0.014, 0]}
          rotation={[0, (i * Math.PI) / 4, 0]}
        >
          <boxGeometry args={[0.003, 0.003, 1.28]} />
          <meshStandardMaterial color="#5A3800" roughness={0.8} metalness={0.3} />
        </mesh>
      ))}

      {/* ── Needle ── */}
      <group ref={needleRef} position={[0, 0.015, 0.07]}>
        {/* North half — red */}
        <mesh position={[0, 0.28, 0]}>
          <coneGeometry args={[0.065, 0.56, 4]} />
          <primitive object={needleRedMat} />
        </mesh>
        {/* South half — silver */}
        <mesh position={[0, -0.28, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.065, 0.56, 4]} />
          <primitive object={needleSilverMat} />
        </mesh>
        {/* Center pivot pin */}
        <mesh>
          <sphereGeometry args={[0.045, 12, 12]} />
          <primitive object={brassMat} />
        </mesh>
      </group>

      {/* ── Glass Bezel Cover ── */}
      <mesh ref={glassRef} position={[0, 0.014, 0.15]}>
        <cylinderGeometry args={[0.70, 0.70, 0.025, 64]} />
        <primitive object={glassMat} />
      </mesh>
    </group>
  );
};
