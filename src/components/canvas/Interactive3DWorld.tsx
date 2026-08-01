"use client";

import React, { useEffect, useState } from "react";
import { WorldHubScene } from "@/world/WorldHub/WorldHubScene";
import { WorldHubController, WorldHubState } from "@/cinematic/controllers/WorldHubController";
import { CareerCompass3DCanvasScene } from "@/cinematic/Objects/CareerCompass/CareerCompassWorld";
import { FloatingObject } from "@/data/objects";

interface Interactive3DWorldProps {
  scrollProgress: number;
  onSelectObject: (obj: FloatingObject) => void;
}

export const Interactive3DWorld: React.FC<Interactive3DWorldProps> = () => {
  const [hubState, setHubState] = useState<WorldHubState>(WorldHubController.getState());

  useEffect(() => {
    const unsubscribe = WorldHubController.subscribe((state) => {
      setHubState(state);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="pointer-events-auto fixed inset-0 z-0 h-full w-full bg-[#050505]">
      {/* 
        Self-contained React Three Fiber World Hub 
        Includes its own Canvas, WorldCamera, WorldLighting, WorldAtmosphere, Museum, & CompassModel
      */}
      <WorldHubScene />

      {/* Spatial Career Compass Sub-Scene Overlay when active */}
      {hubState.viewMode === "CAREER_COMPASS_WORLD" && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Spatial UI overlay handled inside page.tsx */}
        </div>
      )}
    </div>
  );
};
