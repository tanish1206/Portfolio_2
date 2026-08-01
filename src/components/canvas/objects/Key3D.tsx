"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Key3DProps {
  position: [number, number, number];
  isHovered: boolean;
  onClick: () => void;
}

export const Key3D: React.FC<Key3DProps> = ({ position, isHovered, onClick }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isHovered ? 2.0 : 0.5);
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.12;
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
      {/* Key Ring Top */}
      <mesh position={[0, 0.5, 0]}>
        <torusGeometry args={[0.3, 0.08, 16, 32]} />
        <meshStandardMaterial
          color={isHovered ? "#00E676" : "#223322"}
          metalness={0.9}
          roughness={0.2}
          emissive={isHovered ? "#00E676" : "#000000"}
          emissiveIntensity={isHovered ? 0.6 : 0}
        />
      </mesh>

      {/* Key Shaft */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 1.0, 16]} />
        <meshStandardMaterial color={isHovered ? "#00E676" : "#444444"} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Key Teeth */}
      <mesh position={[0.12, -0.5, 0]}>
        <boxGeometry args={[0.2, 0.1, 0.06]} />
        <meshStandardMaterial color={isHovered ? "#00E676" : "#444444"} metalness={0.9} />
      </mesh>
      <mesh position={[0.1, -0.35, 0]}>
        <boxGeometry args={[0.16, 0.08, 0.06]} />
        <meshStandardMaterial color={isHovered ? "#00E676" : "#444444"} metalness={0.9} />
      </mesh>
    </group>
  );
};
