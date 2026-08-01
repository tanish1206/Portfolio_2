"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { WorldCamera } from "./WorldCamera";
import { WorldLighting } from "./WorldLighting";
import { WorldAtmosphere } from "./WorldAtmosphere";
import { Museum, CompassPedestal } from "@/world/Environment/Museum";
import { CompassModel } from "@/world/Compass/CompassModel";
import { WorldController, WorldState } from "@/world/WorldController";

/**
 * WorldHubScene.tsx
 * The primary React Three Fiber scene.
 * Fully 3D — no HTML layout inside canvas.
 * Composes: Camera + Lighting + Environment + Compass
 */

function SceneContent({ state }: { state: WorldState }) {
  const isMuseumVisible =
    state.phase !== "HERO" && state.phase !== "FLY_THROUGH";

  return (
    <>
      {/* Cinematographer Camera */}
      <WorldCamera phase={state.phase} />

      {/* Museum Lighting */}
      <WorldLighting compassUnlocked={state.unlockedExhibits >= 1} />

      {/* Atmospheric Dust & Fog */}
      <WorldAtmosphere />

      {/* Physical Museum Environment */}
      {isMuseumVisible && (
        <Suspense fallback={null}>
          <Museum />
          <CompassPedestal />
          <CompassModel
            phase={state.phase}
            onHover={(hovered) => {
              WorldController.setHovered(hovered ? "compass" : null);
            }}
            onClick={() => {
              if (state.phase === "MUSEUM_IDLE" || state.phase === "COMPASS_HOVER") {
                WorldController.beginCompassTransform();
              }
            }}
          />
        </Suspense>
      )}
    </>
  );
}

export const WorldHubScene: React.FC = () => {
  const [worldState, setWorldState] = useState<WorldState>(WorldController.getState());

  useEffect(() => {
    return WorldController.subscribe(setWorldState);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 1.8, 9], fov: 60, near: 0.1, far: 200 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: 2, // THREE.ACESFilmicToneMapping
        toneMappingExposure: 1.0,
      }}
      shadows
      dpr={[1, 1.5]}
    >
      {/* Fog — warm deep red atmospheric */}
      <fog attach="fog" args={["#0A0204", 12, 55]} />

      <SceneContent state={worldState} />
    </Canvas>
  );
};
