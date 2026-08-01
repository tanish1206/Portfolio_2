"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Trophy3DProps {
  position: [number, number, number];
  isHovered: boolean;
  onClick: () => void;
}

export const Trophy3D: React.FC<Trophy3DProps> = ({ position, isHovered, onClick }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isHovered ? 1.8 : 0.4);
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
      {/* Trophy Base Pedestal */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[0.6, 0.25, 0.6]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
      </mesh>

      {/* Trophy Cup Body */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.45, 0.18, 0.7, 32]} />
        <meshStandardMaterial
          color={isHovered ? "#FFD700" : "#997a00"}
          metalness={0.95}
          roughness={0.15}
          emissive={isHovered ? "#FFD700" : "#000000"}
          emissiveIntensity={isHovered ? 0.7 : 0}
        />
      </mesh>

      {/* Trophy Handles */}
      <mesh position={[0.45, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.2, 0.04, 16, 32]} />
        <meshStandardMaterial color={isHovered ? "#FFD700" : "#997a00"} metalness={0.9} />
      </mesh>
      <mesh position={[-0.45, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.2, 0.04, 16, 32]} />
        <meshStandardMaterial color={isHovered ? "#FFD700" : "#997a00"} metalness={0.9} />
      </mesh>
    </group>
  );
};
