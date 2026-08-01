"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Mic3DProps {
  position: [number, number, number];
  isHovered: boolean;
  onClick: () => void;
}

export const Mic3D: React.FC<Mic3DProps> = ({ position, isHovered, onClick }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isHovered ? 1.5 : 0.4);
      groupRef.current.rotation.z = Math.sin(Date.now() * 0.0012) * 0.08;
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
      {/* Mic Capsule Top */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.35, 32, 16]} />
        <meshStandardMaterial
          color={isHovered ? "#E040FB" : "#333333"}
          wireframe={true}
          emissive={isHovered ? "#E040FB" : "#000000"}
          emissiveIntensity={isHovered ? 0.8 : 0}
        />
      </mesh>

      {/* Mic Body Handle */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.18, 0.14, 0.8, 32]} />
        <meshStandardMaterial color="#151515" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Mic Ring Accent */}
      <mesh position={[0, 0.15, 0]}>
        <torusGeometry args={[0.2, 0.03, 16, 32]} />
        <meshStandardMaterial color={isHovered ? "#E040FB" : "#555555"} emissive={isHovered ? "#E040FB" : "#000000"} />
      </mesh>
    </group>
  );
};
