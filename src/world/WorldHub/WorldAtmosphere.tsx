"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * WorldAtmosphere.tsx
 *
 * Continuous ambient animation:
 *  1. Floating dust particles — per-particle drift simulation, warm ivory tones
 *  2. Ground fog plane — subtle slow rotation, opacity breathing
 *  3. Particle tunnel — transitional burst (visible during FLY_THROUGH)
 *
 * All motion is extremely subtle. Never distracting. Always alive.
 */

// ─── Floating Dust ────────────────────────────────────────────────────────────

function FloatingDust() {
  const ref = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const count = 3200;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Distribute through the whole hall volume
      positions[i * 3 + 0] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = Math.random() * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 26;

      // Extremely slow drift — barely perceptible individually
      velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.0015;
      velocities[i * 3 + 1] = Math.random() * 0.0018 + 0.0003; // always drifting upward
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.0015;
    }

    return { positions, velocities };
  }, []);

  // Build geometry once
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    const count = pos.length / 3;

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] += velocities[i * 3 + 0];
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      pos[i * 3 + 2] += velocities[i * 3 + 2];

      // Wrap: reset to floor when reaching ceiling
      if (pos[i * 3 + 1] > 12.5) {
        pos[i * 3 + 1] = 0.1;
        pos[i * 3 + 0] = (Math.random() - 0.5) * 30;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 26;
      }
    }

    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color="#C8B89A"
        size={0.018}
        transparent
        opacity={0.38}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Ground Fog ───────────────────────────────────────────────────────────────

function GroundFog() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    // Slow breathing opacity
    mat.opacity = 0.08 + Math.sin(t * 0.25) * 0.03;
    // Very slow drift rotation
    ref.current.rotation.z = t * 0.006;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <planeGeometry args={[40, 35]} />
      <meshBasicMaterial
        color="#2A0808"
        transparent
        opacity={0.08}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Red Spotlight Dust — Particles that catch the red light ──────────────────

function SpotlightDust() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 280;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Concentrated in the cone of the spotlight
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 1.2;
      const h = Math.random() * 10; // height within light shaft
      pos[i * 3 + 0] = Math.cos(angle) * r * (h / 10); // cone shape
      pos[i * 3 + 1] = h + 1.3;
      pos[i * 3 + 2] = Math.sin(angle) * r * (h / 10);
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    const t = clock.getElapsedTime();
    const count = pos.length / 3;

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= 0.002; // slowly fall
      if (pos[i * 3 + 1] < 1.3) {
        const angle = Math.random() * Math.PI * 2;
        const h = 10 + Math.random() * 2;
        const r = Math.random() * 1.2;
        pos[i * 3 + 0] = Math.cos(angle) * r * (h / 12);
        pos[i * 3 + 1] = h;
        pos[i * 3 + 2] = Math.sin(angle) * r * (h / 12);
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;

    // Gentle slow drift
    ref.current.rotation.y = Math.sin(t * 0.08) * 0.04;
  });

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color="#D81E36"
        size={0.025}
        transparent
        opacity={0.5}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export const WorldAtmosphere: React.FC = () => (
  <group>
    <FloatingDust />
    <GroundFog />
    <SpotlightDust />
  </group>
);
