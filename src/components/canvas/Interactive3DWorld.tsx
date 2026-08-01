"use client";

import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { CinematicCameraController } from "@/cinematic/controllers/CameraController";
import { LightingController } from "@/cinematic/controllers/LightingController";
import { WorldHubScene } from "@/cinematic/WorldHub/WorldHubScene";
import { CareerCompass3DCanvasScene } from "@/cinematic/Objects/CareerCompass/CareerCompassWorld";
import { WorldHubController, WorldHubState } from "@/cinematic/controllers/WorldHubController";
import { FloatingObject } from "@/data/objects";

interface Interactive3DWorldProps {
  scrollProgress: number;
  onSelectObject: (obj: FloatingObject) => void;
}

export const Interactive3DWorld: React.FC<Interactive3DWorldProps> = ({
  scrollProgress,
}) => {
  const [hubState, setHubState] = useState<WorldHubState>(WorldHubController.getState());

  useEffect(() => {
    const unsubscribe = WorldHubController.subscribe((state) => {
      setHubState(state);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="pointer-events-auto fixed inset-0 z-0 h-full w-full bg-[#050505]">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Cinematographer Camera Controller */}
        <CinematicCameraController hubState={hubState} scrollProgress={scrollProgress} />

        {/* Dynamic Architectural Crimson Spotlight System */}
        <LightingController hubState={hubState} />

        {/* Underground Museum World Hub Scene */}
        <WorldHubScene hubState={hubState} />

        {/* Career Compass 3D Reality Scene */}
        {hubState.viewMode === "CAREER_COMPASS_WORLD" && (
          <CareerCompass3DCanvasScene onSelectNode={() => {}} />
        )}
      </Canvas>
    </div>
  );
};
