"use client";

import React, { useRef, Suspense, useEffect, useMemo } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { useGLTF, Points } from "@react-three/drei";
import * as THREE from "three";
import { WorldPhase } from "@/world/WorldController";

/**
 * CompassModel.tsx
 *
 * Loads /models/objects/compass.glb (real 13MB model from user).
 * Falls back to procedural geometry if GLB fails to load.
 *
 * GLB scale is auto-normalized: bounding box is measured and
 * the model is scaled so it fits inside a ~1.2m sphere.
 */

// ─── PBR Materials for procedural fallback ────────────────────────────────────

const brassMat = new THREE.MeshStandardMaterial({
  color: "#9B7420",
  roughness: 0.24,
  metalness: 0.96,
  envMapIntensity: 1.6,
});
const antiqueBrassMat = new THREE.MeshStandardMaterial({
  color: "#7A5E14",
  roughness: 0.34,
  metalness: 0.90,
});
const darkDialMat = new THREE.MeshStandardMaterial({
  color: "#080508",
  roughness: 0.18,
  metalness: 0.65,
});
const needleRedMat = new THREE.MeshStandardMaterial({
  color: "#B11226",
  emissive: "#8A0D1D",
  emissiveIntensity: 0.65,
  roughness: 0.25,
  metalness: 0.75,
});
const needleSilverMat = new THREE.MeshStandardMaterial({
  color: "#909090",
  roughness: 0.16,
  metalness: 0.97,
});
const glassMat = new THREE.MeshPhysicalMaterial({
  color: "#C8E0F0",
  transparent: true,
  opacity: 0.16,
  roughness: 0.03,
  metalness: 0.0,
  transmission: 0.90,
  thickness: 0.3,
  envMapIntensity: 2.5,
});
const engraveLineMat = new THREE.MeshStandardMaterial({
  color: "#3E2800",
  roughness: 0.85,
  metalness: 0.25,
});

// ─── Shared animation hook ────────────────────────────────────────────────────

function useCompassAnimation(
  groupRef: React.RefObject<THREE.Group>,
  phase: WorldPhase,
  extraUpdater?: (delta: number, t: number) => void
) {
  const isTransforming = phase === "COMPASS_TRANSFORM";
  const isHovering = phase === "COMPASS_HOVER";

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (!groupRef.current) return;

    if (isTransforming) {
      groupRef.current.rotation.y += delta * 1.6;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x, 0.5, delta * 4
      );
    } else if (isHovering) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x, 0.18, delta * 5
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y, Math.sin(t * 1.5) * 0.12, delta * 5
      );
    } else {
      // Idle micro-float on top of pedestal (pedestal height = 1.28m)
      groupRef.current.position.y = 1.30 + Math.sin(t * 1.1) * 0.038;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x, Math.sin(t * 0.45) * 0.035, delta * 2
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y, Math.sin(t * 0.28) * 0.055, delta * 2
      );
    }

    extraUpdater?.(delta, t);
  });
}

// ─── Dust halo particles (shared) ────────────────────────────────────────────

function DustHalo({ active }: { active: boolean }) {
  const positions = useMemo(() => {
    const count = 160;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 0.7 + Math.random() * 1.1;
      pos[i * 3 + 0] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1.0;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pos;
  }, []);

  return (
    <Points positions={positions} stride={3}>
      <pointsMaterial
        color={active ? "#D81E36" : "#C8A870"}
        size={0.022}
        transparent
        opacity={active ? 0.85 : 0.45}
        depthWrite={false}
        sizeAttenuation
      />
    </Points>
  );
}

// ─── GLB Compass ──────────────────────────────────────────────────────────────

function GLBCompass({
  phase,
  progress = 0,
  onHover,
  onClick,
}: {
  phase: WorldPhase;
  progress?: number;
  onHover: (h: boolean) => void;
  onClick: () => void;
}) {
  const { scene } = useGLTF("/models/objects/compass.glb");
  const groupRef = useRef<THREE.Group>(null);
  const sceneRef = useRef<THREE.Group>(null);

  // Clone scene so multiple instances don't share state
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // Auto-normalize scale & enable shadows
  useEffect(() => {
    if (!sceneRef.current) return;

    const box = new THREE.Box3().setFromObject(sceneRef.current);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);

    const targetSize = 1.1;
    if (maxDim > 0) {
      const scale = targetSize / maxDim;
      sceneRef.current.scale.setScalar(scale);
    }

    const center = new THREE.Vector3();
    box.getCenter(center);
    sceneRef.current.position.set(-center.x, -center.y, -center.z);

    sceneRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material && !Array.isArray(mesh.material)) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat.metalness !== undefined) {
            mat.metalness = Math.max(mat.metalness, 0.7);
            mat.roughness = Math.min(mat.roughness, 0.45);
          }
        }
      }
    });
  }, [clonedScene]);

  const isInteractive = phase === "MUSEUM_IDLE" || phase === "COMPASS_HOVER";
  const isHovering = phase === "COMPASS_HOVER";

  useCompassAnimation(groupRef, phase);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const lerpSpeed = Math.min(delta * 4, 1);
    const assemblyProg = Math.min(1, Math.max(0, (progress - 0.95) / 0.05));
    const targetScale = assemblyProg > 0 ? assemblyProg : 0.001;
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, lerpSpeed));
  });

  return (
    <group
      ref={groupRef}
      position={[0, 1.3, 0]}
      onPointerOver={isInteractive ? (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); onHover(true); } : undefined}
      onPointerOut={isInteractive ? () => onHover(false) : undefined}
      onClick={isInteractive ? (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onClick(); } : undefined}
    >
      <DustHalo active={isHovering} />
      <group ref={sceneRef}>
        <primitive object={clonedScene} />
      </group>
    </group>
  );
}

function ProceduralCompass({
  phase,
  progress = 0,
  onHover,
  onClick,
}: {
  phase: WorldPhase;
  progress?: number;
  onHover: (h: boolean) => void;
  onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const needleRef = useRef<THREE.Group>(null);
  const glassRef = useRef<THREE.Mesh>(null);
  const casingTopRef = useRef<THREE.Mesh>(null);
  const casingBotRef = useRef<THREE.Mesh>(null);

  const isTransforming = phase === "COMPASS_TRANSFORM";
  const isHovering = phase === "COMPASS_HOVER";
  const isInteractive = phase === "MUSEUM_IDLE" || phase === "COMPASS_HOVER";

  useCompassAnimation(groupRef, phase, (delta, t) => {
    const assemblyProg = Math.min(1, Math.max(0, (progress - 0.95) / 0.05));

    if (groupRef.current) {
      const targetScale = assemblyProg > 0 ? assemblyProg : 0.001;
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, delta * 4));
    }

    // Assembly fragment positioning
    if (needleRef.current) {
      if (isTransforming) {
        needleRef.current.position.z = THREE.MathUtils.lerp(needleRef.current.position.z, 1.6, delta * 3.5);
        needleRef.current.rotation.z += delta * 11;
      } else if (isHovering) {
        needleRef.current.rotation.z = THREE.MathUtils.lerp(needleRef.current.rotation.z, Math.sin(t * 8) * 0.28, delta * 10);
        needleRef.current.position.z = THREE.MathUtils.lerp(needleRef.current.position.z, 0.08, delta * 5);
      } else {
        const needleAngle = THREE.MathUtils.lerp(Math.PI * 2, Math.sin(t * 0.85) * 0.18 + Math.cos(t * 0.55) * 0.08, assemblyProg);
        needleRef.current.rotation.z = THREE.MathUtils.lerp(needleRef.current.rotation.z, needleAngle, delta * 4);
        needleRef.current.position.z = THREE.MathUtils.lerp(needleRef.current.position.z, 0.07, delta * 4);
      }
    }
    // Glass
    if (glassRef.current) {
      if (isTransforming) {
        glassRef.current.position.z = THREE.MathUtils.lerp(glassRef.current.position.z, 1.9, delta * 3);
        glassRef.current.rotation.x = THREE.MathUtils.lerp(glassRef.current.rotation.x, 0.95, delta * 3);
      } else {
        glassRef.current.position.z = THREE.MathUtils.lerp(glassRef.current.position.z, 0.15, delta * 4);
        glassRef.current.rotation.x = THREE.MathUtils.lerp(glassRef.current.rotation.x, 0, delta * 4);
      }
    }
    // Casing split
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
      <DustHalo active={isHovering} />

      {/* Outer Brass Bezel Ring */}
      <mesh ref={casingTopRef} castShadow>
        <torusGeometry args={[0.72, 0.09, 24, 64]} />
        <primitive object={brassMat} />
      </mesh>
      <mesh ref={casingBotRef} castShadow>
        <cylinderGeometry args={[0.70, 0.70, 0.11, 64]} />
        <primitive object={antiqueBrassMat} />
      </mesh>
      <mesh castShadow>
        <cylinderGeometry args={[0.66, 0.66, 0.025, 64]} />
        <primitive object={darkDialMat} />
      </mesh>

      {/* Cardinal lines */}
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

      {/* Glass cover */}
      <mesh ref={glassRef} position={[0, 0.014, 0.15]}>
        <cylinderGeometry args={[0.70, 0.70, 0.025, 64]} />
        <primitive object={glassMat} />
      </mesh>
    </group>
  );
}

// ─── Error Boundary ───────────────────────────────────────────────────────────

class GLBBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { err: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { err: false };
  }
  static getDerivedStateFromError() { return { err: true }; }
  render() {
    return this.state.err ? this.props.fallback : this.props.children;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

interface CompassModelProps {
  phase: WorldPhase;
  progress?: number;
  onHover: (isHovered: boolean) => void;
  onClick: () => void;
}

export const CompassModel: React.FC<CompassModelProps> = ({ phase, progress = 0, onHover, onClick }) => {
  const fallback = <ProceduralCompass phase={phase} progress={progress} onHover={onHover} onClick={onClick} />;

  return (
    <GLBBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <GLBCompass phase={phase} progress={progress} onHover={onHover} onClick={onClick} />
      </Suspense>
    </GLBBoundary>
  );
};

useGLTF.preload("/models/objects/compass.glb");
