/**
 * IDENTITY TRANSFORMER COMPONENT
 * Timing Specification (~1.0s total sequence using GSAP):
 *   - Phase 1 (0 - 180ms): Glitch jitter & red/cyan chromatic flash flickers
 *   - Phase 2 (180ms - 380ms): Dissolve, blur & fade out current portrait
 *   - Phase 3 (380ms): Asset swap to next identity (Builder -> Hackathon -> Full Stack -> AI -> Founder -> Builder)
 *   - Phase 4 (380ms - 700ms): Reconstruct, blur-to-sharp & fade in new portrait
 *   - Phase 5 (700ms - 1000ms): Stabilize spotlight & identity badge indicator
 *
 * Uses GSAP timelines (gsap.timeline()) for precise 60fps ticker optimization.
 */

"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { IDENTITIES, Identity } from "@/data/identities";
import { useCinematic } from "@/context/CinematicContext";

interface IdentityTransformerProps {
  onIdentityChange?: (identity: Identity) => void;
}

export const IdentityTransformer: React.FC<IdentityTransformerProps> = ({
  onIdentityChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const hoverIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { phase } = useCinematic();
  const currentIdentity = IDENTITIES[currentIndex];

  const isFreezing = phase === "HERO_FREEZE" || phase === "HERO_PUSH";
  const isDissolving = phase === "PARTICLE_DISSOLVE" || phase === "FLY_THROUGH" || phase === "WORLD_ASSEMBLE" || phase === "WORLD_ACTIVE";

  // Check prefers-reduced-motion preference on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setIsReducedMotion(mediaQuery.matches);
      const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // GSAP-powered identity transformation timeline (~1.0s execution)
  const triggerTransformation = () => {
    if (timelineRef.current && timelineRef.current.isActive()) return;

    if (isReducedMotion) {
      // Simple crossfade for reduced motion users
      setCurrentIndex((prev) => {
        const next = (prev + 1) % IDENTITIES.length;
        if (onIdentityChange) onIdentityChange(IDENTITIES[next]);
        return next;
      });
      return;
    }

    setIsGlitching(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsGlitching(false);
      },
    });
    timelineRef.current = tl;

    // Step 1: Rapid position-jitter & chromatic flash (0 - 180ms)
    if (portraitRef.current) {
      tl.to(portraitRef.current, {
        x: () => (Math.random() - 0.5) * 8,
        y: () => (Math.random() - 0.5) * 8,
        duration: 0.04,
        repeat: 4,
        yoyo: true,
        ease: "none",
      })
      // Step 2: Dissolve out (180 - 380ms)
      .to(portraitRef.current, {
        opacity: 0.15,
        filter: "blur(12px) contrast(1.4)",
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          // Step 3: Swap image asset mid-dissolve
          setCurrentIndex((prev) => {
            const next = (prev + 1) % IDENTITIES.length;
            if (onIdentityChange) onIdentityChange(IDENTITIES[next]);
            return next;
          });
        },
      })
      // Step 4: Reconstruct - blur to sharp & fade in (380 - 700ms)
      .to(portraitRef.current, {
        opacity: 1,
        filter: "blur(0px) contrast(1.08)",
        x: 0,
        y: 0,
        duration: 0.32,
        ease: "power2.out",
      });
    }
  };

  // Mouse Parallax (Damped lerp max ~3.5° rotateX/Y + slight spotlight shift)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isFreezing || isDissolving || isReducedMotion) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const offsetX = (e.clientX - centerX) / (rect.width / 2);
    const offsetY = (e.clientY - centerY) / (rect.height / 2);

    setMouseOffset({
      x: Math.max(-3.5, Math.min(3.5, offsetX * 3.5)),
      y: Math.max(-3.5, Math.min(3.5, offsetY * 3.5)),
    });

    if (spotlightRef.current) {
      gsap.to(spotlightRef.current, {
        x: offsetX * 25,
        y: offsetY * 15,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
    if (spotlightRef.current) {
      gsap.to(spotlightRef.current, { x: 0, y: 0, duration: 0.8, ease: "power2.out" });
    }
    if (hoverIntervalRef.current) clearInterval(hoverIntervalRef.current);
  };

  const handleMouseEnter = () => {
    if (isFreezing || isDissolving) return;
    triggerTransformation();

    if (hoverIntervalRef.current) clearInterval(hoverIntervalRef.current);
    hoverIntervalRef.current = setInterval(() => {
      triggerTransformation();
    }, 2800);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={triggerTransformation} // Touch & Click fallback trigger
      className="interactive-hover group relative flex cursor-pointer flex-col items-center justify-center select-none"
    >
      {/* Overhead Soft Focused Crimson Spotlight Glow */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full blur-3xl opacity-50 z-0 transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at center, #FF1E40 0%, #DC143C 35%, transparent 70%)`,
          opacity: isDissolving ? 0 : 0.5,
        }}
      />

      {/* Borderless Portrait Container (Desktop: 420x520px, Responsive Mobile Scale) */}
      <motion.div
        ref={portraitRef}
        className="portrait-vignette-mask relative h-[380px] w-[290px] sm:h-[440px] sm:w-[350px] md:h-[520px] md:w-[420px] overflow-hidden z-10"
        animate={{
          scale: isDissolving ? 1.25 : phase === "HERO_PUSH" ? 1.1 : 1,
          opacity: isDissolving ? 0 : 1,
          y: isFreezing || isReducedMotion ? 0 : [0, -5, 0],
          rotateX: isReducedMotion ? 0 : mouseOffset.y * -1,
          rotateY: isReducedMotion ? 0 : mouseOffset.x,
        }}
        transition={{
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.6 },
          rotateX: { type: "spring", stiffness: 180, damping: 22 },
          rotateY: { type: "spring", stiffness: 180, damping: 22 },
        }}
      >
        {/* Active Identity Image */}
        <div className="absolute inset-0 h-full w-full">
          <Image
            src={currentIdentity.image}
            alt={currentIdentity.title}
            fill
            sizes="(max-width: 768px) 320px, 420px"
            priority
            className="object-cover object-center filter contrast-[1.08] brightness-95 transition-all duration-300"
          />
        </div>

        {/* Cinematic Glitch & Chromatic Overlay */}
        {isGlitching && !isReducedMotion && (
          <div className="animate-glitch pointer-events-none absolute inset-0 z-20 overflow-hidden bg-accent-crimson/15 backdrop-blur-[2px]">
            <div className="absolute inset-0 bg-[radial-gradient(#FF1E40_1px,transparent_1px)] [background-size:10px_10px] opacity-50" />
            <div className="absolute top-1/4 h-[2px] w-full bg-white/80 shadow-[0_0_10px_#fff]" />
            <div className="absolute top-2/3 h-[2px] w-full bg-red-600 shadow-[0_0_10px_#DC143C]" />
          </div>
        )}

        {/* Soft Feathered Vignette Overlay to blend seamlessly into darkness */}
        <div className="pointer-events-none absolute inset-0 bg-radial-vignette opacity-90" />
      </motion.div>

      {/* Monospace Small Caps Identity Badge Under Portrait */}
      <motion.div
        animate={{ opacity: isDissolving ? 0 : 1 }}
        className="z-20 mt-3 flex items-center space-x-2 font-mono text-[10px] md:text-xs tracking-[0.25em] text-red-500/90 uppercase"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
        <span>[ IDENTITY: {currentIdentity.title} ]</span>
      </motion.div>
    </div>
  );
};
