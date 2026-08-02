"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WorldPhase } from "@/world/WorldController";

/**
 * WorldAtmosphere.tsx
 *
 * Cinematic Atmospheric Effects:
 *  1. Volumetric Red Dust Cones under Spotlights (75%-85% progress)
 *  2. Ground Fog Rolling Plane
 *  3. Construction Debris Dust Stream (20%-50% pillar/wall growth)
 *  4. Floating Ambient Dust Particles
 *  5. Particle Tunnel transition (0%-10% hero dissolve)
 */

// ─── Volumetric Red Spotlight Rays & Dust ──────────────────────────────────────

function VolumetricLightRays({ progress = 0 }: { progress?: number }) {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);

  const { positions, baseHeights } = useMemo(() => {
    const count = 750;
    const pos = new Float32Array(count * 3);
    const baseH = new Float32Array(count);

    // 5 Spotlight cone positions along central aisle: z = [-18, -9, 0, 9, 18]
    const spotlightZs = [-18, -9, 0, 9, 18];

    for (let i = 0; i < count; i++) {
      const spotIdx = i % 5;
      const spotZ = spotlightZs[spotIdx];
      const angle = Math.random() * Math.PI * 2;
      const h = Math.random() * 12.5; // height within light shaft (0 to 12.5m)
      const r = Math.random() * (0.2 + (h / 12.5) * 2.8); // cone radius widening downward

      pos[i * 3 + 0] = Math.cos(angle) * r;
      pos[i * 3 + 1] = 13.2 - h;
      pos[i * 3 + 2] = spotZ + Math.sin(angle) * r;

      baseH[i] = h;
    }

    return { positions: pos, baseHeights: baseH };
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  useFrame(({ clock }, delta) => {
    if (!ref.current || !matRef.current) return;
    const t = clock.getElapsedTime();
    const lerpSpeed = Math.min(delta * 4, 1);

    // Fade in during ATMOSPHERE_EMERGENCE (75% to 85%)
    const atmoProg = Math.min(1, Math.max(0, (progress - 0.70) / 0.15));
    const targetOpacity = atmoProg * 0.65;

    matRef.current.opacity = THREE.MathUtils.lerp(matRef.current.opacity, targetOpacity, lerpSpeed);

    if (matRef.current.opacity > 0.01) {
      const posArr = ref.current.geometry.attributes.position.array as Float32Array;
      const count = posArr.length / 3;

      for (let i = 0; i < count; i++) {
        posArr[i * 3 + 1] -= 0.003; // fall slowly through light shaft
        if (posArr[i * 3 + 1] < 0.2) {
          posArr[i * 3 + 1] = 13.0;
        }
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
      ref.current.rotation.y = Math.sin(t * 0.06) * 0.03;
    }
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        ref={matRef}
        color="#FF1E40"
        size={0.032}
        transparent
        opacity={0}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Floating Ambient Dust ───────────────────────────────────────────────────

function FloatingDust() {
  const ref = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const count = 3500;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 28;
      positions[i * 3 + 1] = Math.random() * 13;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 44;

      velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.0012;
      velocities[i * 3 + 1] = Math.random() * 0.0015 + 0.0004;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.0012;
    }

    return { positions, velocities };
  }, []);

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

      if (pos[i * 3 + 1] > 13.5) {
        pos[i * 3 + 1] = 0.1;
        pos[i * 3 + 0] = (Math.random() - 0.5) * 28;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 44;
      }
    }

    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color="#D4C2A5"
        size={0.022}
        transparent
        opacity={0.42}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Ground Volumetric Fog Plane ──────────────────────────────────────────────

function GroundFog({ progress = 0 }: { progress?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }, delta) => {
    if (!ref.current || !matRef.current) return;
    const t = clock.getElapsedTime();
    const lerpSpeed = Math.min(delta * 4, 1);

    // Roll fog across floor starting at 75% progress
    const fogProg = Math.min(1, Math.max(0, (progress - 0.70) / 0.15));
    const targetOpacity = fogProg * (0.08 + Math.sin(t * 0.22) * 0.02);

    matRef.current.opacity = THREE.MathUtils.lerp(matRef.current.opacity, targetOpacity, lerpSpeed);
    ref.current.rotation.z = t * 0.005;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
      <planeGeometry args={[32, 48]} />
      <meshBasicMaterial
        ref={matRef}
        color="#26060A"
        transparent
        opacity={0}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Falling Construction Debris Stream (20%-50%) ─────────────────────────────

function ConstructionDebris({ progress = 0 }: { progress?: number }) {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);

  const { positions, velocities } = useMemo(() => {
    const count = 500;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 1] = Math.random() * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;

      vel[i * 3 + 0] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 1] = -(Math.random() * 0.01 + 0.004);
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    return { positions: pos, velocities: vel };
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  useFrame((_, delta) => {
    if (!ref.current || !matRef.current) return;
    const isBuilding = progress >= 0.18 && progress <= 0.52;
    const targetOpacity = isBuilding ? 0.65 : 0.0;

    matRef.current.opacity = THREE.MathUtils.lerp(matRef.current.opacity, targetOpacity, Math.min(delta * 4, 1));

    if (matRef.current.opacity > 0.01) {
      const posArr = ref.current.geometry.attributes.position.array as Float32Array;
      const count = posArr.length / 3;
      for (let i = 0; i < count; i++) {
        posArr[i * 3 + 1] += velocities[i * 3 + 1];
        if (posArr[i * 3 + 1] < 0.1) {
          posArr[i * 3 + 1] = 14;
        }
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        ref={matRef}
        color="#B89A7A"
        size={0.030}
        transparent
        opacity={0}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Transitional Hero Particle Tunnel (0%-10%) ───────────────────────────────

function ParticleTunnel({ progress = 0 }: { progress?: number }) {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);

  const { positions, velocities } = useMemo(() => {
    const count = 1400;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.2 + Math.random() * 5.0;
      pos[i * 3 + 0] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius + 1.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 35;

      vel[i * 3 + 0] = 0;
      vel[i * 3 + 1] = 0;
      vel[i * 3 + 2] = Math.random() * 0.4 + 0.2;
    }
    return { positions: pos, velocities: vel };
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  useFrame((_, delta) => {
    if (!ref.current || !matRef.current) return;
    const isTransitional = progress > 0 && progress <= 0.12;
    const targetOpacity = isTransitional ? 0.75 : 0.0;

    matRef.current.opacity = THREE.MathUtils.lerp(matRef.current.opacity, targetOpacity, Math.min(delta * 4, 1));

    if (matRef.current.opacity > 0.01) {
      const posArr = ref.current.geometry.attributes.position.array as Float32Array;
      const count = posArr.length / 3;
      for (let i = 0; i < count; i++) {
        posArr[i * 3 + 2] += velocities[i * 3 + 2];
        if (posArr[i * 3 + 2] > 20) {
          posArr[i * 3 + 2] = -20;
        }
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        ref={matRef}
        color="#B11226"
        size={0.035}
        transparent
        opacity={0}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

interface WorldAtmosphereProps {
  phase?: WorldPhase;
  progress?: number;
}

export const WorldAtmosphere: React.FC<WorldAtmosphereProps> = ({ progress = 0 }) => (
  <group>
    <ParticleTunnel progress={progress} />
    <ConstructionDebris progress={progress} />
    <FloatingDust />
    <GroundFog progress={progress} />
    <VolumetricLightRays progress={progress} />
  </group>
);
