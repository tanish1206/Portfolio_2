"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleField({ scrollProgress }: { scrollProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate 2500 random 3D particle positions
  const [positions, colors] = useMemo(() => {
    const count = 2500;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const colorPalette = [
      new THREE.Color("#00E5FF"), // Electric Blue
      new THREE.Color("#FFD700"), // Warm Gold
      new THREE.Color("#7000FF"), // Deep Violet
      new THREE.Color("#ffffff"), // Pure White
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      col[i * 3] = randomColor.r;
      col[i * 3 + 1] = randomColor.g;
      col[i * 3 + 2] = randomColor.b;
    }

    return [pos, col];
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    // Slow ambient rotation
    pointsRef.current.rotation.x += delta * 0.03;
    pointsRef.current.rotation.y += delta * 0.05;

    // React to scroll progress (camera push-in + particle drift)
    pointsRef.current.position.z = THREE.MathUtils.lerp(
      pointsRef.current.position.z,
      scrollProgress * 5,
      0.05
    );
  });

  return (
    <group position={[0, 0, 0]}>
      <Points ref={pointsRef} positions={positions} colors={colors} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          vertexColors
          size={0.035}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.7}
        />
      </Points>
    </group>
  );
}

interface WebGLCanvasProps {
  scrollProgress?: number;
}

export const WebGLCanvas: React.FC<WebGLCanvasProps> = ({ scrollProgress = 0 }) => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-70">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <ParticleField scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
};
