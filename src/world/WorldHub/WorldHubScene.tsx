"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { WorldCamera } from "./WorldCamera";
import { WorldLighting } from "./WorldLighting";
import { WorldAtmosphere } from "./WorldAtmosphere";
import { Museum, CompassPedestal } from "@/world/Environment/Museum";
import { CompassModel } from "@/world/Compass/CompassModel";
import { WorldController, WorldState } from "@/world/WorldController";

/**
 * WorldHubScene.tsx
 *
 * The single persistent R3F Canvas for the entire portfolio world.
 * Always rendering — Hero is just an overlay that fades out.
 *
 * Composition:
 *   Camera    → WorldCamera (per-phase lerped keyframes)
 *   Lighting  → WorldLighting (breathing crimson feature spotlight)
 *   Atmosphere → WorldAtmosphere (dust, fog, spotlight particles)
 *   Env       → Museum (procedural concrete/steel/stone architecture)
 *   Exhibit 1 → CompassPedestal + CompassModel
 */

function SceneContent({ state }: { state: WorldState }) {
  // Museum & compass visible from FLY_THROUGH onward (loading during tunnel)
  const museumVisible = state.phase !== "HERO";

  return (
    <>
      <WorldCamera phase={state.phase} />
      <WorldLighting compassUnlocked={state.unlockedExhibits >= 1} />
      <WorldAtmosphere />

      {museumVisible && (
        <Suspense fallback={null}>
          <Museum />
          <CompassPedestal />
          <CompassModel
            phase={state.phase}
            onHover={(hovered) => WorldController.setHovered(hovered ? "compass" : null)}
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
      camera={{ position: [0, 1.8, 9], fov: 60, near: 0.1, far: 250 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      shadows="soft"
      dpr={[1, 1.5]}
    >
      {/*
        Fog: warm deep red, starts at 14m and fully opaque by 60m.
        This hides the far walls fading into darkness naturally.
      */}
      <fog attach="fog" args={["#080102", 14, 62]} />

      <SceneContent state={worldState} />
    </Canvas>
  );
};
