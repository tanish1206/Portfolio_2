"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WorldPhase } from "@/world/WorldController";

/**
 * WorldAtmosphere.tsx
 *
 * Cinematic Atmospheric Effects:
 *  1. Translucent Volumetric Deep Red Light Shaft Cones (75%-85% progress)
 *  2. Ground Fog Rolling Plane
 *  3. Construction Debris Dust Stream (20%-50% pillar/wall growth)
 *  4. Floating Ambient Dust Particles
 *  5. Particle Tunnel transition (0%-10% hero dissolve)
 */

// ─── Volumetric Light Shaft Cones ─────────────────────────────────────────────

function VolumetricLightShafts({ progress = 0 }: { progress?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const shaftPositions: [number, number, number][] = useMemo(
    () => [
      [0, 6.75, -18],
      [0, 6.75, -9],
      [0, 6.75, 0],
      [0, 6.75, 9],
      [0, 6.75, 18],
    ],
    []
  );

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const lerpSpeed = Math.min(delta * 4, 1);

    // Fade in during ATMOSPHERE_EMERGENCE (75% to 85%)
    const atmoProg = Math.min(1, Math.max(0, (progress - 0.70) / 0.15));
    const targetOpacity = atmoProg * 0.12;

    groupRef.current.children.forEach((mesh, idx) => {
      const mat = (mesh as THREE.Mesh).material as THREE.MeshBasicMaterial;
      if (mat) {
        const breathe = Math.sin(t * 0.6 + idx * 1.2) * 0.02;
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, Math.max(0, targetOpacity + breathe), lerpSpeed);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {shaftPositions.map(([x, y, z], idx) => (
        <mesh key={`shaft-${idx}`} position={[x, y, z]}>
          <cylinderGeometry args={[0.35, 3.8, 13.5, 32, 1, true]} />
          <meshBasicMaterial
            color="#B11226"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
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
    const targetOpacity = fogProg * (0.12 + Math.sin(t * 0.22) * 0.03);

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

// ─── Spotlight Dust Catchers ──────────────────────────────────────────────────

function SpotlightDust() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 400;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 1.5;
      const h = Math.random() * 12;
      pos[i * 3 + 0] = Math.cos(angle) * r * (h / 12);
      pos[i * 3 + 1] = h + 1.2;
      pos[i * 3 + 2] = Math.sin(angle) * r * (h / 12);
    }
    return pos;
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    const t = clock.getElapsedTime();
    const count = pos.length / 3;

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= 0.0025;
      if (pos[i * 3 + 1] < 1.2) {
        const angle = Math.random() * Math.PI * 2;
        const h = 11 + Math.random() * 2;
        const r = Math.random() * 1.5;
        pos[i * 3 + 0] = Math.cos(angle) * r * (h / 13);
        pos[i * 3 + 1] = h;
        pos[i * 3 + 2] = Math.sin(angle) * r * (h / 13);
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y = Math.sin(t * 0.08) * 0.05;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color="#B11226"
        size={0.028}
        transparent
        opacity={0.55}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
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
    <VolumetricLightShafts progress={progress} />
    <SpotlightDust />
  </group>
);
