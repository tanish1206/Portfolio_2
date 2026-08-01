"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WorldHubState } from "./WorldHubController";

interface CameraControllerProps {
  hubState: WorldHubState;
  scrollProgress: number;
}

export const CinematicCameraController: React.FC<CameraControllerProps> = ({
  hubState,
  scrollProgress,
}) => {
  const currentTargetPos = useRef(new THREE.Vector3(0, 0, 8));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const target = new THREE.Vector3();
    const lookAtTarget = new THREE.Vector3(0, 0, 0);

    // Calculate mouse momentum offset for subtle organic movement
    const mouseX = (state.pointer.x || 0) * 0.4;
    const mouseY = (state.pointer.y || 0) * 0.4;

    switch (hubState.viewMode) {
      case "HERO":
        target.set(mouseX * 0.8, mouseY * 0.4, 8 - scrollProgress * 4);
        lookAtTarget.set(0, 0, 0);
        break;

      case "WORLD_HUB":
      case "RETURNING_TO_HUB":
        // Camera positioned in the dark architectural hall, focusing on active spotlight
        if (hubState.activeExhibitId === "compass" || !hubState.activeExhibitId) {
          target.set(mouseX, 1.2 + mouseY * 0.3, 4.2);
          lookAtTarget.set(0, 0, 0);
        } else if (hubState.activeExhibitId === "bento") {
          target.set(4.5 + mouseX, 1.6, 0.5);
          lookAtTarget.set(4.5, 0.5, -3.5);
        } else {
          target.set(mouseX * 1.5, 2.0, 6.0);
          lookAtTarget.set(0, 0, 0);
        }
        break;

      case "TRANSITIONING_TO_PROJECT":
        // Slow cinematic push & dolly forward into compass core
        target.set(0, 0.3, 1.4);
        lookAtTarget.set(0, 0.1, 0);
        break;

      case "CAREER_COMPASS_WORLD":
        // Cinematic orbit inside Career Compass 3D reality
        const time = state.clock.getElapsedTime();
        const orbitRadius = 3.5;
        target.set(
          Math.sin(time * 0.25) * orbitRadius + mouseX * 0.5,
          0.8 + Math.cos(time * 0.2) * 0.4 + mouseY * 0.5,
          Math.cos(time * 0.25) * orbitRadius
        );
        lookAtTarget.set(0, 0, 0);
        break;

      default:
        target.set(0, 1.5, 5);
        lookAtTarget.set(0, 0, 0);
        break;
    }

    // Heavy physically-motivated lerp smoothing (never snap)
    const lerpSpeed = hubState.viewMode === "TRANSITIONING_TO_PROJECT" ? 0.04 : 0.035;

    currentTargetPos.current.lerp(target, Math.min(delta * (lerpSpeed * 60), 0.1));
    currentLookAt.current.lerp(lookAtTarget, Math.min(delta * (lerpSpeed * 60), 0.1));

    state.camera.position.copy(currentTargetPos.current);
    state.camera.lookAt(currentLookAt.current);
  });

  return null;
};
