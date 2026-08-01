"use client";

import React, { useEffect, useRef } from "react";
import { useCinematic } from "@/context/CinematicContext";
import gsap from "gsap";

export const GlobalCinematicController: React.FC = () => {
  const { phase, setPhase, setScrollProgress } = useCinematic();
  const isTransitioningRef = useRef(false);
  const touchStartYRef = useRef(0);

  // Synchronize scroll progress when active
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(1, Math.max(0, window.scrollY / totalHeight));
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setScrollProgress]);

  const startCinematicSequence = () => {
    if (phase !== "HERO_IDLE" || isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    // 10-Step Sequential GSAP Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setPhase("WORLD_ACTIVE");
        isTransitioningRef.current = false;
      },
    });

    // Step 1 & 2: Freeze & Camera Push
    tl.to({}, {
      duration: 0.35,
      onStart: () => setPhase("HERO_FREEZE"),
    })
    .to({}, {
      duration: 0.55,
      onStart: () => setPhase("HERO_PUSH"),
    })
    // Step 3 & 4: Spotlight Narrows & Particle Dissolve
    .to({}, {
      duration: 0.65,
      onStart: () => setPhase("PARTICLE_DISSOLVE"),
    })
    // Step 5, 6 & 7: Fly-Through Floating Particles
    .to({}, {
      duration: 0.75,
      onStart: () => setPhase("FLY_THROUGH"),
    })
    // Step 8, 9 & 10: Architectural World Assembly & Gateway Object
    .to({}, {
      duration: 0.65,
      onStart: () => setPhase("WORLD_ASSEMBLE"),
    });
  };

  // Event handlers for Wheel, Touch, and Keyboard
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (phase === "HERO_IDLE" && e.deltaY > 0) {
        e.preventDefault();
        startCinematicSequence();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (phase === "HERO_IDLE") {
        const deltaY = touchStartYRef.current - e.touches[0].clientY;
        if (deltaY > 20) {
          e.preventDefault();
          startCinematicSequence();
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase === "HERO_IDLE" && (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ")) {
        e.preventDefault();
        startCinematicSequence();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [phase]);

  return null;
};

