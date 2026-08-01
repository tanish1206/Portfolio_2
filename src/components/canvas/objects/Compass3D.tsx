"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Compass3DProps {
  position: [number, number, number];
  isHovered: boolean;
  onClick: () => void;
}

export const Compass3D: React.FC<Compass3DProps> = ({ position, isHovered, onClick }) => {
  const groupRef = useRef<THREE.Group>(null);
  const needleRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isHovered ? 1.5 : 0.4);
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
    }
    if (needleRef.current) {
      needleRef.current.rotation.z += delta * (isHovered ? 4 : 1);
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
      {/* Outer Metallic Ring */}
      <mesh>
        <torusGeometry args={[0.7, 0.08, 16, 32]} />
        <meshStandardMaterial
          color={isHovered ? "#00E5FF" : "#1a3644"}
          metalness={0.8}
          roughness={0.2}
          emissive={isHovered ? "#00E5FF" : "#000000"}
          emissiveIntensity={isHovered ? 0.6 : 0}
        />
      </mesh>

      {/* Inner Compass Dial Face */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.04, 32]} />
        <meshStandardMaterial color="#0b131e" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Compass Needle */}
      <mesh ref={needleRef} position={[0, 0, 0.05]}>
        <coneGeometry args={[0.1, 0.9, 4]} />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
};
