"use client";

import React, { useEffect, useRef } from "react";
import { useCinematic } from "@/context/CinematicContext";
import gsap from "gsap";

export const GlobalCinematicController: React.FC = () => {
  const { phase, setPhase, setScrollProgress, resetToHero } = useCinematic();
  const phaseRef = useRef(phase);
  const isTransitioningRef = useRef(false);
  const touchStartYRef = useRef(0);

  // Keep phaseRef updated with latest state
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // Synchronize scroll progress & automatically restore Hero when near top
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(1, Math.max(0, window.scrollY / totalHeight));
        setScrollProgress(progress);
      }

      // If user scrolls back to the top of the page, restore Hero section
      if (window.scrollY <= 10 && phaseRef.current !== "HERO_IDLE" && !isTransitioningRef.current) {
        resetToHero();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [resetToHero, setScrollProgress]);

  // Forward transition sequence: Hero -> World
  const startCinematicSequence = () => {
    if (phaseRef.current !== "HERO_IDLE" || isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        setPhase("WORLD_ACTIVE");
        isTransitioningRef.current = false;
      },
    });

    tl.to({}, {
      duration: 0.35,
      onStart: () => setPhase("HERO_FREEZE"),
    })
    .to({}, {
      duration: 0.55,
      onStart: () => setPhase("HERO_PUSH"),
    })
    .to({}, {
      duration: 0.65,
      onStart: () => setPhase("PARTICLE_DISSOLVE"),
    })
    .to({}, {
      duration: 0.75,
      onStart: () => setPhase("FLY_THROUGH"),
    })
    .to({}, {
      duration: 0.65,
      onStart: () => setPhase("WORLD_ASSEMBLE"),
    });
  };

  // Reverse restoration sequence: World -> Hero
  const reverseCinematicSequence = () => {
    if (phaseRef.current === "HERO_IDLE" || isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        resetToHero();
        isTransitioningRef.current = false;
      },
    });

    tl.to({}, {
      duration: 0.4,
      onStart: () => setPhase("PARTICLE_DISSOLVE"),
    })
    .to({}, {
      duration: 0.4,
      onStart: () => setPhase("HERO_FREEZE"),
    });
  };

  // Event handlers for Wheel, Touch, and Keyboard
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (phaseRef.current === "HERO_IDLE" && e.deltaY > 0) {
        e.preventDefault();
        startCinematicSequence();
      } else if (phaseRef.current !== "HERO_IDLE" && e.deltaY < 0 && window.scrollY <= 100) {
        e.preventDefault();
        reverseCinematicSequence();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = touchStartYRef.current - e.touches[0].clientY;
      if (phaseRef.current === "HERO_IDLE" && deltaY > 15) {
        e.preventDefault();
        startCinematicSequence();
      } else if (phaseRef.current !== "HERO_IDLE" && deltaY < -15 && window.scrollY <= 100) {
        e.preventDefault();
        reverseCinematicSequence();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (phaseRef.current === "HERO_IDLE" && (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ")) {
        e.preventDefault();
        startCinematicSequence();
      } else if (phaseRef.current !== "HERO_IDLE" && (e.key === "ArrowUp" || e.key === "PageUp") && window.scrollY <= 100) {
        e.preventDefault();
        reverseCinematicSequence();
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
  }, []);

  return null;
};



