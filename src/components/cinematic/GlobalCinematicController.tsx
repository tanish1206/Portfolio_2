"use client";

import React, { useEffect, useRef } from "react";
import { useCinematic } from "@/context/CinematicContext";
import gsap from "gsap";

export const GlobalCinematicController: React.FC = () => {
  const { phase, setPhase, setScrollProgress } = useCinematic();
  const isTransitioningRef = useRef(false);

  // Synchronize window scroll progress & restore Hero when returning to top
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(1, Math.max(0, window.scrollY / totalHeight));
        setScrollProgress(progress);
      }

      // Restore Hero section when user scrolls back to top
      if (window.scrollY <= 30 && phase !== "HERO_IDLE" && !isTransitioningRef.current) {
        setPhase("HERO_IDLE");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [phase, setPhase, setScrollProgress]);

  // Scroll triggers: Down triggers Hero -> World sequence; Up at top restores Hero
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Scroll Down from Hero Idle
      if (phase === "HERO_IDLE" && e.deltaY > 0 && !isTransitioningRef.current && window.scrollY <= 50) {
        isTransitioningRef.current = true;
        e.preventDefault();

        // 10-Step Sequential Timeline
        const tl = gsap.timeline({
          onComplete: () => {
            setPhase("WORLD_ACTIVE");
            isTransitioningRef.current = false;
          },
        });

        // Step 1 & 2: Freeze & Camera Push
        tl.to({}, {
          duration: 0.3,
          onStart: () => setPhase("HERO_FREEZE"),
        })
        .to({}, {
          duration: 0.5,
          onStart: () => setPhase("HERO_PUSH"),
        })
        // Step 3 & 4: Ambient Fade & Particle Dissolve
        .to({}, {
          duration: 0.6,
          onStart: () => setPhase("PARTICLE_DISSOLVE"),
        })
        // Step 5, 6 & 7: Fly-Through
        .to({}, {
          duration: 0.7,
          onStart: () => setPhase("FLY_THROUGH"),
        })
        // Step 8, 9 & 10: Architectural World Assembly
        .to({}, {
          duration: 0.6,
          onStart: () => setPhase("WORLD_ASSEMBLE"),
        });
      }

      // Scroll Up at top restores Hero
      if (phase !== "HERO_IDLE" && e.deltaY < 0 && window.scrollY <= 30 && !isTransitioningRef.current) {
        setPhase("HERO_IDLE");
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [phase, setPhase]);

  return null;
};
