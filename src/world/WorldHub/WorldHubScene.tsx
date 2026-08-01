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
 * Single persistent R3F Canvas. Always rendering — Hero is just an overlay.
 *
 * Key settings:
 *  - shadows="soft"  for soft shadow edges
 *  - fog starts at 18m (lets us see full hall at 11m depth)
 *  - ACESFilmic tonemapping, exposure 1.15 (brightens midtones)
 *  - Museum loads during FLY_THROUGH so it's ready when camera arrives
 */

function SceneContent({ state }: { state: WorldState }) {
  const museumVisible = state.phase !== "HERO";

  return (
    <>
      <WorldCamera phase={state.phase} />
      <WorldLighting phase={state.phase} compassUnlocked={state.unlockedExhibits >= 1} />
      <WorldAtmosphere phase={state.phase} />

      {museumVisible && (
        <Suspense fallback={null}>
          <Museum phase={state.phase} />
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
      camera={{ position: [0, 1.8, 9.5], fov: 60, near: 0.1, far: 300 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
      shadows="soft"
      dpr={[1, 1.5]}
    >
      {/*
        Fog: starts at 18m, fully opaque at 70m.
        Hall is ~14m deep from camera — so walls are visible.
        Far walls dissolve into darkness naturally.
      */}
      <fog attach="fog" args={["#060102", 18, 70]} />

      <SceneContent state={worldState} />
    </Canvas>
  );
};
