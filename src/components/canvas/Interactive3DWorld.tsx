"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { Compass3D } from "./objects/Compass3D";
import { Coffee3D } from "./objects/Coffee3D";
import { Mic3D } from "./objects/Mic3D";
import { Key3D } from "./objects/Key3D";
import { Trophy3D } from "./objects/Trophy3D";
import { Notebook3D } from "./objects/Notebook3D";
import { Phone3D } from "./objects/Phone3D";
import { FloatingObject, FLOATING_OBJECTS } from "@/data/objects";
import { useCinematic } from "@/context/CinematicContext";

function CinematicCameraController({ scrollProgress }: { scrollProgress: number }) {
  const { phase } = useCinematic();

  useFrame((state) => {
    let targetZ = 8 - scrollProgress * 6;
    let targetX = Math.sin(scrollProgress * Math.PI) * 2;
    let targetY = Math.cos(scrollProgress * Math.PI * 0.5) * 0.4;

    if (phase === "TRANSITION_PREP") {
      targetZ = 5;
    } else if (phase === "WORLD_TRANSITION") {
      targetZ = 2;
    } else if (phase === "WORLD_ACTIVE") {
      targetZ = 8 - scrollProgress * 6;
    }

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

function AtmosphericDustParticles({ scrollProgress }: { scrollProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { phase } = useCinematic();

  const [positions, colors] = React.useMemo(() => {
    const count = 3500;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#DC143C"), // Deep Crimson Red
      new THREE.Color("#FF1E40"), // Crimson Bright
      new THREE.Color("#888888"), // Charcoal Gray
      new THREE.Color("#ffffff"), // Pure White
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 28;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 28;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 28;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const speedMultiplier = phase === "WORLD_TRANSITION" ? 3.5 : phase === "TRANSITION_PREP" ? 1.8 : 1;
    pointsRef.current.rotation.x += delta * (0.015 + scrollProgress * 0.08) * speedMultiplier;
    pointsRef.current.rotation.y += delta * (0.03 + scrollProgress * 0.15) * speedMultiplier;
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors} stride={3}>
      <PointMaterial transparent vertexColors size={0.035} depthWrite={false} opacity={0.65} />
    </Points>
  );
}

interface Interactive3DWorldProps {
  scrollProgress: number;
  onSelectObject: (obj: FloatingObject) => void;
}

export const Interactive3DWorld: React.FC<Interactive3DWorldProps> = ({
  scrollProgress,
  onSelectObject,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { phase } = useCinematic();

  const getObj = (id: string) => FLOATING_OBJECTS.find((o) => o.id === id)!;
  const isWorldVisible = phase === "WORLD_TRANSITION" || phase === "WORLD_ACTIVE" || scrollProgress > 0.1;

  return (
    <div className="pointer-events-auto fixed inset-0 z-0 h-full w-full bg-background">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} color="#1A1A1A" />
        {/* Overhead Crimson Spotlight */}
        <pointLight position={[0, 8, 4]} intensity={2.2} color="#FF1E40" />
        {/* Rim Charcoal Light */}
        <pointLight position={[-8, -5, -6]} intensity={0.6} color="#5A0E1A" />

        <CinematicCameraController scrollProgress={scrollProgress} />
        <AtmosphericDustParticles scrollProgress={scrollProgress} />

        {/* 3D Floating Objects Exhibit World */}
        {isWorldVisible && (
          <group position={[0, 0, 0]}>
            <Compass3D
              position={[-2.8, 1.3, -1]}
              isHovered={hoveredId === "compass"}
              onClick={() => onSelectObject(getObj("compass"))}
            />
            <Coffee3D
              position={[2.5, 1.4, -0.8]}
              isHovered={hoveredId === "coffee"}
              onClick={() => onSelectObject(getObj("coffee"))}
            />
            <Mic3D
              position={[-2.0, -1.3, 0.2]}
              isHovered={hoveredId === "mic"}
              onClick={() => onSelectObject(getObj("mic"))}
            />
            <Key3D
              position={[2.7, -1.2, 0.1]}
              isHovered={hoveredId === "key"}
              onClick={() => onSelectObject(getObj("key"))}
            />
            <Notebook3D
              position={[0, 2.1, -1.2]}
              isHovered={hoveredId === "notebook"}
              onClick={() => onSelectObject(getObj("notebook"))}
            />
            <Trophy3D
              position={[-3.4, -0.1, -0.6]}
              isHovered={hoveredId === "trophy"}
              onClick={() => onSelectObject(getObj("trophy"))}
            />
            <Phone3D
              position={[3.3, 0.2, -0.5]}
              isHovered={hoveredId === "phone"}
              onClick={() => onSelectObject(getObj("phone"))}
            />
          </group>
        )}
      </Canvas>
    </div>
  );
};
