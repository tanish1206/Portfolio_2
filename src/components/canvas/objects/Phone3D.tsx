"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Phone3DProps {
  position: [number, number, number];
  isHovered: boolean;
  onClick: () => void;
}

export const Phone3D: React.FC<Phone3DProps> = ({ position, isHovered, onClick }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isHovered ? 1.5 : 0.4);
      groupRef.current.rotation.z = Math.sin(Date.now() * 0.0012) * 0.06;
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
      {/* Phone Outer Chassis */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 0.95, 0.07]} />
        <meshStandardMaterial
          color={isHovered ? "#7C4DFF" : "#111111"}
          metalness={0.9}
          roughness={0.2}
          emissive={isHovered ? "#7C4DFF" : "#000000"}
          emissiveIntensity={isHovered ? 0.5 : 0}
        />
      </mesh>

      {/* Screen Glass Face */}
      <mesh position={[0, 0, 0.038]}>
        <planeGeometry args={[0.45, 0.88]} />
        <meshStandardMaterial
          color={isHovered ? "#7C4DFF" : "#000000"}
          roughness={0.1}
          emissive={isHovered ? "#7C4DFF" : "#111111"}
          emissiveIntensity={isHovered ? 0.7 : 0.2}
        />
      </mesh>
    </group>
  );
};
