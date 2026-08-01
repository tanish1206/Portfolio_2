"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { WorldHubState, WorldHubController } from "@/cinematic/controllers/WorldHubController";
import { BrassCompass3D } from "@/cinematic/Objects/Compass/BrassCompass3D";
import { Coffee3D } from "@/components/canvas/objects/Coffee3D"; // Used as Bento Box geometry stand-in
import { Mic3D } from "@/components/canvas/objects/Mic3D";
import { FLOATING_OBJECTS } from "@/data/objects";

interface WorldHubSceneProps {
  hubState: WorldHubState;
}

export const WorldHubScene: React.FC<WorldHubSceneProps> = ({ hubState }) => {
  const floorRef = useRef<THREE.Mesh>(null);
  const dustRef = useRef<THREE.Points>(null);

  // Atmospheric dust particles floating in the underground space
  const dustPositions = React.useMemo(() => {
    const count = 3000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 35;
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (dustRef.current) {
      dustRef.current.rotation.y += delta * 0.02;
    }
  });

  const isCompassTransforming =
    hubState.transformingExhibitId === "compass" ||
    hubState.viewMode === "TRANSITIONING_TO_PROJECT";

  const handleSelectCompass = () => {
    if (hubState.viewMode === "WORLD_HUB") {
      WorldHubController.initiateExhibitTransformation("compass");
    }
  };

  const handleSelectBento = () => {
    if (hubState.viewMode === "WORLD_HUB" && hubState.unlockedCount >= 2) {
      WorldHubController.initiateExhibitTransformation("bento");
    }
  };

  const handleSelectMic = () => {
    if (hubState.viewMode === "WORLD_HUB" && hubState.unlockedCount >= 3) {
      WorldHubController.initiateExhibitTransformation("mic");
    }
  };

  return (
    <group position={[0, -1, 0]}>
      {/* 1. Black Polished Specular Architectural Floor */}
      <mesh ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#050505"
          metalness={0.9}
          roughness={0.15}
          envMapIntensity={0.8}
        />
      </mesh>

      {/* 2. Concrete Architectural Pillars & Spatial Structure */}
      {/* Left Pillar */}
      <mesh position={[-6, 4, -4]}>
        <boxGeometry args={[1.2, 12, 1.2]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Right Pillar */}
      <mesh position={[6, 4, -4]}>
        <boxGeometry args={[1.2, 12, 1.2]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Far Museum Wall */}
      <mesh position={[0, 5, -12]}>
        <planeGeometry args={[50, 20]} />
        <meshStandardMaterial color="#101010" roughness={0.95} metalness={0.05} />
      </mesh>

      {/* 3. Volumetric Floating Dust Particles */}
      <Points ref={dustRef} positions={dustPositions} stride={3}>
        <PointMaterial
          transparent
          color="#B11226"
          size={0.035}
          depthWrite={false}
          opacity={0.35}
        />
      </Points>

      {/* 4. PHYSICAL EXHIBITS (Sequentially Illuminated) */}
      {/* Exhibit 1: Mechanical Brass Compass (Illuminated at start) */}
      <BrassCompass3D
        position={[0, 0.6, 0]}
        isTransforming={isCompassTransforming}
        isHovered={hubState.activeExhibitId === "compass"}
        onClick={handleSelectCompass}
      />

      {/* Exhibit 2: Smart Bento Box (Illuminated after Career Compass completion) */}
      {hubState.unlockedCount >= 2 && (
        <group position={[4.5, 0.6, -3.5]}>
          <Coffee3D
            position={[0, 0, 0]}
            isHovered={hubState.activeExhibitId === "bento"}
            onClick={handleSelectBento}
          />
        </group>
      )}

      {/* Exhibit 3: Vintage Studio Microphone (Illuminated after Bento completion) */}
      {hubState.unlockedCount >= 3 && (
        <group position={[-4.5, 0.6, -3.5]}>
          <Mic3D
            position={[0, 0, 0]}
            isHovered={hubState.activeExhibitId === "mic"}
            onClick={handleSelectMic}
          />
        </group>
      )}
    </group>
  );
};
