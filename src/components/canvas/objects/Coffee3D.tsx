"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Coffee3DProps {
  position: [number, number, number];
  isHovered: boolean;
  onClick: () => void;
}

export const Coffee3D: React.FC<Coffee3DProps> = ({ position, isHovered, onClick }) => {
  const groupRef = useRef<THREE.Group>(null);
  const steamRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isHovered ? 1.2 : 0.3);
      groupRef.current.position.y = position[1] + Math.sin(Date.now() * 0.0015) * 0.08;
    }
    if (steamRef.current) {
      steamRef.current.rotation.y += delta * 0.2;
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
      {/* Ceramic Coffee Mug Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.45, 0.35, 0.8, 32]} />
        <meshStandardMaterial
          color={isHovered ? "#FF9100" : "#222222"}
          metalness={0.3}
          roughness={0.4}
          emissive={isHovered ? "#FF9100" : "#000000"}
          emissiveIntensity={isHovered ? 0.4 : 0}
        />
      </mesh>

      {/* Mug Handle */}
      <mesh position={[0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.22, 0.06, 16, 32]} />
        <meshStandardMaterial color={isHovered ? "#FF9100" : "#222222"} roughness={0.4} />
      </mesh>

      {/* Liquid Coffee Top */}
      <mesh position={[0, 0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.42, 32]} />
        <meshStandardMaterial color="#3d1e03" roughness={0.1} />
      </mesh>
    </group>
  );
};
