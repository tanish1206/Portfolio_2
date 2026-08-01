"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { AudioController } from "@/cinematic/controllers/AudioController";

interface BrassCompass3DProps {
  position: [number, number, number];
  isTransforming: boolean;
  isHovered: boolean;
  onClick: () => void;
}

export const BrassCompass3D: React.FC<BrassCompass3DProps> = ({
  position,
  isTransforming,
  isHovered,
  onClick,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const needleRef = useRef<THREE.Mesh>(null);
  const glassRef = useRef<THREE.Mesh>(null);
  const fragmentTopRef = useRef<THREE.Mesh>(null);
  const fragmentBottomRef = useRef<THREE.Mesh>(null);
  const [internalHover, setInternalHover] = useState(false);

  // Micro dust particles dedicated around the compass
  const particlesPos = React.useMemo(() => {
    const count = 180;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 2.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
    }
    return pos;
  }, []);

  const activeHover = isHovered || internalHover;

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      if (isTransforming) {
        // Transformation state: compass tilts forward and expands
        groupRef.current.rotation.y += delta * 2.5;
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0.4, delta * 3);
      } else {
        // Idle gentle float & mechanical rotation
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          activeHover ? Math.sin(time * 2) * 0.35 + 0.2 : Math.sin(time * 0.8) * 0.15,
          delta * 4
        );
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          activeHover ? 0.25 : Math.cos(time * 0.6) * 0.08,
          delta * 4
        );
        groupRef.current.position.y = position[1] + Math.sin(time * 1.5) * 0.06;
      }
    }

    // Needle animation: gentle swaying in idle, detaches floating forward in transformation
    if (needleRef.current) {
      if (isTransforming) {
        needleRef.current.position.z = THREE.MathUtils.lerp(needleRef.current.position.z, 0.9, delta * 4);
        needleRef.current.rotation.z += delta * 12;
      } else {
        const needleAngle = activeHover ? Math.sin(time * 6) * 0.4 : Math.sin(time * 1.2) * 0.12;
        needleRef.current.rotation.z = THREE.MathUtils.lerp(needleRef.current.rotation.z, needleAngle, delta * 6);
        needleRef.current.position.z = THREE.MathUtils.lerp(needleRef.current.position.z, 0.06, delta * 4);
      }
    }

    // Glass cover lifts off during transformation
    if (glassRef.current) {
      if (isTransforming) {
        glassRef.current.position.z = THREE.MathUtils.lerp(glassRef.current.position.z, 1.4, delta * 3);
        glassRef.current.rotation.x = THREE.MathUtils.lerp(glassRef.current.rotation.x, 0.8, delta * 3);
      } else {
        glassRef.current.position.z = THREE.MathUtils.lerp(glassRef.current.position.z, 0.12, delta * 4);
        glassRef.current.rotation.x = THREE.MathUtils.lerp(glassRef.current.rotation.x, 0, delta * 4);
      }
    }

    // Casing fragments separate during transformation
    if (fragmentTopRef.current && fragmentBottomRef.current) {
      if (isTransforming) {
        fragmentTopRef.current.position.y = THREE.MathUtils.lerp(fragmentTopRef.current.position.y, 0.7, delta * 3);
        fragmentBottomRef.current.position.y = THREE.MathUtils.lerp(fragmentBottomRef.current.position.y, -0.7, delta * 3);
      } else {
        fragmentTopRef.current.position.y = THREE.MathUtils.lerp(fragmentTopRef.current.position.y, 0, delta * 4);
        fragmentBottomRef.current.position.y = THREE.MathUtils.lerp(fragmentBottomRef.current.position.y, 0, delta * 4);
      }
    }
  });

  const handleClick = (e: THREE.Event) => {
    e.stopPropagation();
    AudioController.playCompassTransformationSound();
    onClick();
  };

  const handlePointerOver = (e: THREE.Event) => {
    e.stopPropagation();
    if (!internalHover) {
      AudioController.playMetallicClick();
      setInternalHover(true);
    }
  };

  const handlePointerOut = () => {
    setInternalHover(false);
  };

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      scale={activeHover ? 1.2 : 1.0}
    >
      {/* Surrounding Micro Dust Particles */}
      <Points positions={particlesPos} stride={3}>
        <PointMaterial
          transparent
          color={activeHover ? "#D81E36" : "#A8A8A8"}
          size={0.025}
          depthWrite={false}
          opacity={activeHover ? 0.85 : 0.45}
        />
      </Points>

      {/* Main Outer Brass Bezel */}
      <mesh ref={fragmentTopRef}>
        <torusGeometry args={[0.85, 0.09, 24, 48]} />
        <meshStandardMaterial
          color="#B8860B" // Antique Brass
          metalness={0.92}
          roughness={0.25}
          emissive={activeHover ? "#B11226" : "#000000"}
          emissiveIntensity={activeHover ? 0.4 : 0}
        />
      </mesh>

      <mesh ref={fragmentBottomRef}>
        <cylinderGeometry args={[0.82, 0.82, 0.12, 48]} />
        <meshStandardMaterial
          color="#1A1A1A"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Inner Dark Dial Face */}
      <mesh position={[0, 0, 0.04]}>
        <cylinderGeometry args={[0.78, 0.78, 0.02, 48]} />
        <meshStandardMaterial
          color="#0A0A0A"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Engraved Crimson Compass Rose Lines */}
      <mesh position={[0, 0, 0.051]}>
        <ringGeometry args={[0.2, 0.75, 4]} />
        <meshBasicMaterial color="#B11226" wireframe opacity={0.6} transparent />
      </mesh>

      {/* Magnetic Detachable Needle */}
      <mesh ref={needleRef} position={[0, 0, 0.06]}>
        <coneGeometry args={[0.08, 1.1, 4]} />
        <meshStandardMaterial
          color={activeHover ? "#D81E36" : "#B11226"}
          emissive="#B11226"
          emissiveIntensity={activeHover ? 0.9 : 0.6}
          metalness={0.8}
        />
      </mesh>

      {/* Glass Bezel Cover */}
      <mesh ref={glassRef} position={[0, 0, 0.12]}>
        <cylinderGeometry args={[0.83, 0.83, 0.02, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          roughness={0.1}
          transmission={0.9}
          thickness={0.2}
        />
      </mesh>
    </group>
  );
};
