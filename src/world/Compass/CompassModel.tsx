"use client";

import React, { useRef, Suspense, useEffect } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { useGLTF, Points } from "@react-three/drei";
import * as THREE from "three";
import { WorldPhase } from "@/world/WorldController";

/**
 * CompassModel.tsx
 *
 * Attempts to load compass.glb from /models/objects/compass.glb
 * Falls back to procedural geometry if the GLB is a placeholder or fails.
 *
 * States:
 *  MUSEUM_SETTLE / MUSEUM_IDLE — gentle idle: needle sway, micro float, dust halo
 *  COMPASS_HOVER               — tilts toward camera, needle jitter, dust intensifies
 *  COMPASS_TRANSFORM           — needle detach, glass lift, casing split
 */

// ─── PBR Materials ─────────────────────────────────────────────────────────────

const brassMat = new THREE.MeshStandardMaterial({
  color: "#8B6914",
  roughness: 0.26,
  metalness: 0.96,
  envMapIntensity: 1.4,
});

const antiqueBrassMat = new THREE.MeshStandardMaterial({
  color: "#6B5010",
  roughness: 0.36,
  metalness: 0.90,
});

const darkDialMat = new THREE.MeshStandardMaterial({
  color: "#080508",
  roughness: 0.20,
  metalness: 0.65,
});

const needleRedMat = new THREE.MeshStandardMaterial({
  color: "#B11226",
  emissive: "#8A0D1D",
  emissiveIntensity: 0.55,
  roughness: 0.28,
  metalness: 0.75,
});

const needleSilverMat = new THREE.MeshStandardMaterial({
  color: "#8A8A8A",
  roughness: 0.18,
  metalness: 0.96,
});

const glassMat = new THREE.MeshPhysicalMaterial({
  color: "#B8D4E8",
  transparent: true,
  opacity: 0.18,
  roughness: 0.04,
  metalness: 0.0,
  transmission: 0.88,
  thickness: 0.25,
  envMapIntensity: 2.0,
});

const engraveLineMat = new THREE.MeshStandardMaterial({
  color: "#3E2800",
  roughness: 0.85,
  metalness: 0.25,
});

// ─── GLB Compass ──────────────────────────────────────────────────────────────

function GLBCompass({
  phase,
  onHover,
  onClick,
}: {
  phase: WorldPhase;
  onHover: (h: boolean) => void;
  onClick: () => void;
}) {
  const { scene } = useGLTF("/models/objects/compass.glb");
  const groupRef = useRef<THREE.Group>(null);
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);

  const isTransforming = phase === "COMPASS_TRANSFORM";
  const isHovering = phase === "COMPASS_HOVER";
  const isInteractive = phase === "MUSEUM_IDLE" || phase === "COMPASS_HOVER";

  // Apply PBR materials to loaded mesh
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [clonedScene]);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    if (isTransforming) {
      groupRef.current.rotation.y += delta * 1.5;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x, 0.5, delta * 3.5
      );
    } else if (isHovering) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x, 0.2, delta * 5
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y, Math.sin(t * 1.5) * 0.12, delta * 5
      );
    } else {
      groupRef.current.position.y = Math.sin(t * 1.1) * 0.035;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x, Math.sin(t * 0.5) * 0.035, delta * 2
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y, Math.sin(t * 0.28) * 0.055, delta * 2
      );
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0, 1.3, 0]}
      scale={[0.8, 0.8, 0.8]}
      onPointerOver={isInteractive ? (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); onHover(true); } : undefined}
      onPointerOut={isInteractive ? () => onHover(false) : undefined}
      onClick={isInteractive ? (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onClick(); } : undefined}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

// ─── Procedural Compass (fallback) ────────────────────────────────────────────

function ProceduralCompass({
  phase,
  onHover,
  onClick,
}: {
  phase: WorldPhase;
  onHover: (h: boolean) => void;
  onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const needleRef = useRef<THREE.Group>(null);
  const glassRef = useRef<THREE.Mesh>(null);
  const casingTopRef = useRef<THREE.Mesh>(null);
  const casingBotRef = useRef<THREE.Mesh>(null);

  const dustPos = React.useMemo(() => {
    const count = 140;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 0.65 + Math.random() * 1.0;
      pos[i * 3 + 0] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.9;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pos;
  }, []);

  const isTransforming = phase === "COMPASS_TRANSFORM";
  const isHovering = phase === "COMPASS_HOVER";
  const isInteractive = phase === "MUSEUM_IDLE" || phase === "COMPASS_HOVER";

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      if (isTransforming) {
        groupRef.current.rotation.y += delta * 1.8;
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0.55, delta * 4);
      } else if (isHovering) {
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0.22, delta * 5);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, Math.sin(t * 1.5) * 0.15, delta * 5);
      } else {
        groupRef.current.position.y = Math.sin(t * 1.2) * 0.04;
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, Math.sin(t * 0.5) * 0.04, delta * 2);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, Math.sin(t * 0.3) * 0.06, delta * 2);
      }
    }

    if (needleRef.current) {
      if (isTransforming) {
        needleRef.current.position.z = THREE.MathUtils.lerp(needleRef.current.position.z, 1.6, delta * 3.5);
        needleRef.current.rotation.z += delta * 11;
      } else if (isHovering) {
        needleRef.current.rotation.z = THREE.MathUtils.lerp(needleRef.current.rotation.z, Math.sin(t * 8) * 0.28, delta * 10);
        needleRef.current.position.z = THREE.MathUtils.lerp(needleRef.current.position.z, 0.08, delta * 5);
      } else {
        needleRef.current.rotation.z = THREE.MathUtils.lerp(
          needleRef.current.rotation.z,
          Math.sin(t * 0.85) * 0.18 + Math.cos(t * 0.55) * 0.08,
          delta * 3
        );
        needleRef.current.position.z = THREE.MathUtils.lerp(needleRef.current.position.z, 0.07, delta * 4);
      }
    }

    if (glassRef.current) {
      if (isTransforming) {
        glassRef.current.position.z = THREE.MathUtils.lerp(glassRef.current.position.z, 1.9, delta * 3);
        glassRef.current.rotation.x = THREE.MathUtils.lerp(glassRef.current.rotation.x, 0.95, delta * 3);
      } else {
        glassRef.current.position.z = THREE.MathUtils.lerp(glassRef.current.position.z, 0.15, delta * 4);
        glassRef.current.rotation.x = THREE.MathUtils.lerp(glassRef.current.rotation.x, 0, delta * 4);
      }
    }

    if (casingTopRef.current && casingBotRef.current) {
      const target = isTransforming ? 0.95 : 0;
      casingTopRef.current.position.y = THREE.MathUtils.lerp(casingTopRef.current.position.y, target, delta * 3);
      casingBotRef.current.position.y = THREE.MathUtils.lerp(casingBotRef.current.position.y, -target, delta * 3);
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0, 1.3, 0]}
      onPointerOver={isInteractive ? (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); onHover(true); } : undefined}
      onPointerOut={isInteractive ? () => onHover(false) : undefined}
      onClick={isInteractive ? (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onClick(); } : undefined}
    >
      {/* Dust halo */}
      <Points positions={dustPos} stride={3}>
        <pointsMaterial
          color={isHovering ? "#D81E36" : "#C8A870"}
          size={0.02}
          transparent
          opacity={isHovering ? 0.8 : 0.42}
          depthWrite={false}
          sizeAttenuation
        />
      </Points>

      {/* Outer Brass Bezel Ring */}
      <mesh ref={casingTopRef} castShadow>
        <torusGeometry args={[0.72, 0.09, 24, 64]} />
        <primitive object={brassMat} />
      </mesh>
      {/* Casing body */}
      <mesh ref={casingBotRef} castShadow>
        <cylinderGeometry args={[0.70, 0.70, 0.11, 64]} />
        <primitive object={antiqueBrassMat} />
      </mesh>

      {/* Dial face */}
      <mesh castShadow>
        <cylinderGeometry args={[0.66, 0.66, 0.025, 64]} />
        <primitive object={darkDialMat} />
      </mesh>

      {/* Compass rose cardinal lines */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 0.014, 0]} rotation={[0, (i * Math.PI) / 4, 0]}>
          <boxGeometry args={[0.003, 0.003, 1.28]} />
          <primitive object={engraveLineMat} />
        </mesh>
      ))}

      {/* Needle */}
      <group ref={needleRef} position={[0, 0.015, 0.07]}>
        <mesh position={[0, 0.28, 0]}>
          <coneGeometry args={[0.065, 0.56, 4]} />
          <primitive object={needleRedMat} />
        </mesh>
        <mesh position={[0, -0.28, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.065, 0.56, 4]} />
          <primitive object={needleSilverMat} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.045, 12, 12]} />
          <primitive object={brassMat} />
        </mesh>
      </group>

      {/* Glass bezel cover */}
      <mesh ref={glassRef} position={[0, 0.014, 0.15]}>
        <cylinderGeometry args={[0.70, 0.70, 0.025, 64]} />
        <primitive object={glassMat} />
      </mesh>
    </group>
  );
}

// ─── GLB Error Boundary ───────────────────────────────────────────────────────

class GLBErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// ─── CompassModel (public API) ────────────────────────────────────────────────

interface CompassModelProps {
  phase: WorldPhase;
  onHover: (isHovered: boolean) => void;
  onClick: () => void;
}

export const CompassModel: React.FC<CompassModelProps> = ({ phase, onHover, onClick }) => {
  const fallback = <ProceduralCompass phase={phase} onHover={onHover} onClick={onClick} />;

  return (
    <GLBErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <GLBCompass phase={phase} onHover={onHover} onClick={onClick} />
      </Suspense>
    </GLBErrorBoundary>
  );
};

// Preload hint for Next.js
useGLTF.preload("/models/objects/compass.glb");
