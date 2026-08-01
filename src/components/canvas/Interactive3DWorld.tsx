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

function CinematicCameraController({ scrollProgress }: { scrollProgress: number }) {
  useFrame((state) => {
    // Camera Push-in and Orbit Timeline
    // Phase 4 sequence: Push in -> Orbit 45deg -> Particles fly past -> Enter 3D universe
    const targetZ = THREE.MathUtils.lerp(8, 2 - scrollProgress * 6, 0.08);
    const targetX = THREE.MathUtils.lerp(0, Math.sin(scrollProgress * Math.PI) * 3, 0.08);
    const targetY = THREE.MathUtils.lerp(0, Math.cos(scrollProgress * Math.PI * 0.5) * 0.5, 0.08);

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

function ParticleVortex({ scrollProgress }: { scrollProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = React.useMemo(() => {
    const count = 3000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [new THREE.Color("#00E5FF"), new THREE.Color("#FFD700"), new THREE.Color("#7000FF"), new THREE.Color("#ffffff")];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.x += delta * (0.02 + scrollProgress * 0.1);
    pointsRef.current.rotation.y += delta * (0.04 + scrollProgress * 0.2);
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors} stride={3}>
      <PointMaterial transparent vertexColors size={0.04} depthWrite={false} opacity={0.75} />
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

  const getObj = (id: string) => FLOATING_OBJECTS.find((o) => o.id === id)!;

  return (
    <div className="pointer-events-auto fixed inset-0 z-0 h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#00E5FF" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#FFD700" />

        <CinematicCameraController scrollProgress={scrollProgress} />
        <ParticleVortex scrollProgress={scrollProgress} />

        {/* 3D Floating Objects Universe */}
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
      </Canvas>
    </div>
  );
};
