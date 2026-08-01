"use client";

import React, { useEffect, useRef } from "react";
import { useCinematic } from "@/context/CinematicContext";
import gsap from "gsap";

export const GlobalCinematicController: React.FC = () => {
  const { phase, setPhase, setScrollProgress, resetToHero } = useCinematic();
  const phaseRef = useRef(phase);
  const isTransitioningRef = useRef(false);
  const touchStartYRef = useRef(0);

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

      if (window.scrollY <= 10 && phaseRef.current !== "IDLE" && !isTransitioningRef.current) {
        resetToHero();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [resetToHero, setScrollProgress]);

  // Rule 6: First Scroll -> Prepare transition (TRANSITION_PREP)
  const triggerTransitionPrep = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    setPhase("TRANSITION_PREP");
    
    // Hold preparation pause (1.5s camera push, spotlight tightening)
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 1800);
  };

  // Rule 7: Second Scroll -> Full ~10-12 second cinematic transition (WORLD_TRANSITION -> WORLD_ACTIVE)
  const triggerWorldTransition = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    setPhase("WORLD_TRANSITION");

    const tl = gsap.timeline({
      onComplete: () => {
        setPhase("WORLD_ACTIVE");
        isTransitioningRef.current = false;
      },
    });

    // 10-12 second cinematic timing specification
    tl.to({}, { duration: 2.0 }) // Portrait dissolve
      .to({}, { duration: 2.5 }) // Particle travel / flythrough
      .to({}, { duration: 2.5 }) // Architecture assembly
      .to({}, { duration: 1.2 }); // Mechanical Compass reveal
  };

  // Reverse restoration sequence
  const reverseCinematicSequence = () => {
    if (phaseRef.current === "IDLE" || isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    resetToHero();
    isTransitioningRef.current = false;
  };

  // Event handlers for Wheel, Touch, and Keyboard
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const current = phaseRef.current;

      if (e.deltaY > 0) {
        if (current === "ENTER_READY") {
          e.preventDefault();
          triggerTransitionPrep();
        } else if (current === "TRANSITION_PREP") {
          e.preventDefault();
          triggerWorldTransition();
        } else if (current === "IDLE" || current === "HOVER_READY" || current === "IDENTITY_UNLOCKED") {
          e.preventDefault();
          // Dispatch hint event: "Interact with the portrait first."
          window.dispatchEvent(new CustomEvent("hero:interact_hint"));
        }
      } else if (e.deltaY < 0 && window.scrollY <= 100 && current !== "IDLE") {
        e.preventDefault();
        reverseCinematicSequence();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = touchStartYRef.current - e.touches[0].clientY;
      const current = phaseRef.current;

      if (deltaY > 20) {
        if (current === "ENTER_READY") {
          e.preventDefault();
          triggerTransitionPrep();
        } else if (current === "TRANSITION_PREP") {
          e.preventDefault();
          triggerWorldTransition();
        } else if (current === "IDLE" || current === "HOVER_READY" || current === "IDENTITY_UNLOCKED") {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent("hero:interact_hint"));
        }
      } else if (deltaY < -20 && window.scrollY <= 100 && current !== "IDLE") {
        e.preventDefault();
        reverseCinematicSequence();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const current = phaseRef.current;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        if (current === "ENTER_READY") {
          e.preventDefault();
          triggerTransitionPrep();
        } else if (current === "TRANSITION_PREP") {
          e.preventDefault();
          triggerWorldTransition();
        } else if (current === "IDLE" || current === "HOVER_READY" || current === "IDENTITY_UNLOCKED") {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent("hero:interact_hint"));
        }
      } else if ((e.key === "ArrowUp" || e.key === "PageUp") && window.scrollY <= 100 && current !== "IDLE") {
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




