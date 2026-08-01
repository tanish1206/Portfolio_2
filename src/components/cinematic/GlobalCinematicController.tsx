"use client";

import React, { useEffect, useRef } from "react";
import { useCinematic } from "@/context/CinematicContext";
import { HeroExperienceController, HeroState } from "@/lib/HeroExperienceController";

export const GlobalCinematicController: React.FC = () => {
  const { heroState, setScrollProgress, resetToHero } = useCinematic();
  const stateRef = useRef<HeroState>(heroState);
  const touchStartYRef = useRef(0);

  useEffect(() => {
    stateRef.current = heroState;
  }, [heroState]);

  // Synchronize scroll progress & automatically restore Hero when near top
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(1, Math.max(0, window.scrollY / totalHeight));
        setScrollProgress(progress);
      }

      if (window.scrollY <= 10 && stateRef.current !== "DISCOVERY" && stateRef.current !== "BOOT" && stateRef.current !== "IDLE") {
        resetToHero();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [resetToHero, setScrollProgress]);

  // Event handlers for Wheel, Touch, and Keyboard
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const current = stateRef.current;

      if (e.deltaY > 0) {
        // Scroll Lock: Ignore scroll until first successful hover
        if (current === "DISCOVERY" || current === "BOOT" || current === "IDLE") {
          e.preventDefault();
        } else if (current === "READY_TO_ENTER") {
          e.preventDefault();
          HeroExperienceController.prepareTransition();
        } else if (current === "TRANSITION_PREP") {
          e.preventDefault();
          HeroExperienceController.startTransition();
        }
      } else if (e.deltaY < 0 && window.scrollY <= 100 && current !== "DISCOVERY" && current !== "BOOT" && current !== "IDLE") {
        e.preventDefault();
        HeroExperienceController.reset();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = touchStartYRef.current - e.touches[0].clientY;
      const current = stateRef.current;

      if (deltaY > 20) {
        if (current === "DISCOVERY" || current === "BOOT" || current === "IDLE") {
          e.preventDefault();
        } else if (current === "READY_TO_ENTER") {
          e.preventDefault();
          HeroExperienceController.prepareTransition();
        } else if (current === "TRANSITION_PREP") {
          e.preventDefault();
          HeroExperienceController.startTransition();
        }
      } else if (deltaY < -20 && window.scrollY <= 100 && current !== "DISCOVERY" && current !== "BOOT" && current !== "IDLE") {
        e.preventDefault();
        HeroExperienceController.reset();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const current = stateRef.current;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        if (current === "DISCOVERY" || current === "BOOT" || current === "IDLE") {
          e.preventDefault();
        } else if (current === "READY_TO_ENTER") {
          e.preventDefault();
          HeroExperienceController.prepareTransition();
        } else if (current === "TRANSITION_PREP") {
          e.preventDefault();
          HeroExperienceController.startTransition();
        }
      } else if ((e.key === "ArrowUp" || e.key === "PageUp") && window.scrollY <= 100 && current !== "DISCOVERY" && current !== "BOOT" && current !== "IDLE") {
        e.preventDefault();
        HeroExperienceController.reset();
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
