"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Notebook3DProps {
  position: [number, number, number];
  isHovered: boolean;
  onClick: () => void;
}

export const Notebook3D: React.FC<Notebook3DProps> = ({ position, isHovered, onClick }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isHovered ? 1.2 : 0.3);
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.08;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      scale={isHovered ? 1.25 : 1}
    >
      {/* Leather Cover */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.7, 0.9, 0.12]} />
        <meshStandardMaterial
          color={isHovered ? "#29B6F6" : "#1a242d"}
          roughness={0.5}
          emissive={isHovered ? "#29B6F6" : "#000000"}
          emissiveIntensity={isHovered ? 0.4 : 0}
        />
      </mesh>

      {/* Pages Edge */}
      <mesh position={[0.02, 0, 0]}>
        <boxGeometry args={[0.66, 0.86, 0.1]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
      </mesh>

      {/* Bookmark Ribbon Accent */}
      <mesh position={[0, -0.48, 0.07]}>
        <boxGeometry args={[0.08, 0.18, 0.02]} />
        <meshStandardMaterial color={isHovered ? "#00E5FF" : "#29B6F6"} />
      </mesh>
    </group>
  );
};
