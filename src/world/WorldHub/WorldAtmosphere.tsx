"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * WorldAtmosphere.tsx
 * Floating dust, light fog, and volumetric particle stream.
 * All procedural — no external assets.
 */

function DustParticles() {
  const ref = useRef<THREE.Points>(null);

  const [positions, velocities] = React.useMemo(() => {
    const count = 2400;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spread dust throughout the hall
      pos[i * 3 + 0] = (Math.random() - 0.5) * 28;
      pos[i * 3 + 1] = Math.random() * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 22;
      // Very slow upward + lateral drift
      vel[i * 3 + 0] = (Math.random() - 0.5) * 0.003;
      vel[i * 3 + 1] = Math.random() * 0.002 + 0.0005;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }
    return [pos, vel];
  }, []);

  const geo = React.useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    const count = pos.length / 3;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] += velocities[i * 3 + 0];
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      pos[i * 3 + 2] += velocities[i * 3 + 2];
      // Wrap Y: if particle drifts above ceiling, reset to floor
      if (pos[i * 3 + 1] > 11) {
        pos[i * 3 + 1] = 0;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color="#D4C5A9"   // warm dust ivory
        size={0.022}
        transparent
        opacity={0.45}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/** A subtle volumetric fog plane near the floor */
function GroundFog() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.12 + Math.sin(t * 0.4) * 0.04;
    meshRef.current.rotation.y = t * 0.018;
  });
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
      <planeGeometry args={[40, 30]} />
      <meshBasicMaterial color="#3A1015" transparent opacity={0.12} depthWrite={false} />
    </mesh>
  );
}

export const WorldAtmosphere: React.FC = () => (
  <group>
    <DustParticles />
    <GroundFog />
  </group>
);
