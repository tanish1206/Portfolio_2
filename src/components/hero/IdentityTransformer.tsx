"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IDENTITIES, Identity } from "@/data/identities";
import { useCinematic } from "@/context/CinematicContext";
import { HeroExperienceController } from "@/lib/HeroExperienceController";

interface IdentityTransformerProps {
  onIdentityChange?: (identity: Identity) => void;
}

export const IdentityTransformer: React.FC<IdentityTransformerProps> = ({
  onIdentityChange,
}) => {
  const { heroState, identityIndex } = useCinematic();
  const [isGlitching, setIsGlitching] = useState(false);
  const [chromaticFlash, setChromaticFlash] = useState(false);
  const [scanLines, setScanLines] = useState<{ top: string; height: string; offset: string }[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef(identityIndex);

  const currentIdentity = IDENTITIES[identityIndex] || IDENTITIES[0];

  const isPrepped = heroState === "TRANSITION_PREP";
  const isDissolving = heroState === "WORLD_TRANSITION" || heroState === "WORLD";

  // Check prefers-reduced-motion accessibility preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  // Trigger refined Blade Runner glitch & chromatic flash on identity change
  useEffect(() => {
    if (prevIndexRef.current !== identityIndex) {
      prevIndexRef.current = identityIndex;

      if (onIdentityChange) onIdentityChange(IDENTITIES[identityIndex]);

      if (prefersReducedMotion) return;

      // 1. Initial 120ms chromatic aberration flash
      setChromaticFlash(true);
      setIsGlitching(true);

      // Generate 3-4 clean horizontal scan-line displacement bands
      const newScanLines = Array.from({ length: 3 }).map(() => ({
        top: `${Math.floor(20 + Math.random() * 60)}%`,
        height: `${Math.floor(2 + Math.random() * 4)}px`,
        offset: `${(Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 5)}px`,
      }));
      setScanLines(newScanLines);

      const flashTimer = setTimeout(() => setChromaticFlash(false), 130);
      const glitchTimer = setTimeout(() => {
        setIsGlitching(false);
        setScanLines([]);
      }, 750);

      return () => {
        clearTimeout(flashTimer);
        clearTimeout(glitchTimer);
      };
    }
  }, [identityIndex, onIdentityChange, prefersReducedMotion]);

  // Eyes follow cursor (max 2° rotX/rotY)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isPrepped || isDissolving) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const offsetX = (e.clientX - centerX) / (rect.width / 2);
    const offsetY = (e.clientY - centerY) / (rect.height / 2);

    setMouseOffset({
      x: Math.max(-2, Math.min(2, offsetX * 2)),
      y: Math.max(-2, Math.min(2, offsetY * 2)),
    });
  };

  const handleMouseEnter = () => {
    if (isPrepped || isDissolving) return;
    setIsHovered(true);
    HeroExperienceController.onHoverEnter();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseOffset({ x: 0, y: 0 });
    HeroExperienceController.onHoverLeave();
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="interactive-hover absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer select-none pointer-events-auto z-10"
    >
      {/* Volumetric Red Spotlight Beam */}
      <motion.div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[75vh] w-[85vw] max-w-[1000px] rounded-full blur-[120px] opacity-65 z-0"
        style={{
          background: `radial-gradient(ellipse at top, #FF1E40 0%, #DC143C 40%, rgba(220,20,60,0.06) 75%, transparent 92%)`,
          willChange: "transform, opacity",
        }}
        animate={{
          scale: isDissolving ? 1.8 : isHovered ? 1.15 : isGlitching ? 1.18 : 1,
          opacity: isDissolving ? 0 : isHovered ? 0.92 : 0.65,
          x: mouseOffset.x * 3,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />

      {/* Volumetric Dust Haze */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[50vh] w-[50vw] max-w-[700px] rounded-full blur-[80px] opacity-30 bg-gradient-to-b from-[#FF1E40] to-transparent z-0" />

      {/* Floating Portrait Scene Container */}
      <motion.div
        className="portrait-vignette-mask relative z-10 w-[90vw] max-w-[650px] h-[55vh] md:h-[65vh] lg:h-[70vh] pointer-events-none flex items-center justify-center rounded-2xl overflow-hidden"
        style={{ willChange: "transform, opacity, filter" }}
        animate={{
          scale: isDissolving ? 1.3 : isPrepped ? 1.15 : isHovered ? 1.04 : 1,
          opacity: isDissolving ? 0 : 1,
          y: isPrepped ? 0 : isHovered ? [0, -8, 0] : [0, -5, 0],
          rotateX: mouseOffset.y * -1,
          rotateY: mouseOffset.x,
        }}
        transition={{
          y: { duration: isHovered ? 3.5 : 6, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.6 },
          rotateX: { type: "spring", stiffness: 220, damping: 20 },
          rotateY: { type: "spring", stiffness: 220, damping: 20 },
        }}
      >
        {/* Strictly Clipped Portrait Wrapper */}
        <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdentity.id}
              initial={{
                opacity: prefersReducedMotion ? 0 : 0,
                scale: prefersReducedMotion ? 1.25 : 1.28,
                filter: prefersReducedMotion ? "blur(0px)" : "blur(5px)",
                x: chromaticFlash ? -3 : 0,
              }}
              animate={{
                opacity: 1,
                scale: 1.25,
                filter: "blur(0px)",
                x: 0,
              }}
              exit={{
                opacity: 0,
                scale: prefersReducedMotion ? 1.25 : 1.22,
                filter: prefersReducedMotion ? "blur(0px)" : "blur(5px)",
                x: chromaticFlash ? 3 : 0,
              }}
              transition={{
                duration: prefersReducedMotion ? 0.4 : 0.75,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute inset-0 h-full w-full flex items-center justify-center pointer-events-none"
              style={{ willChange: "transform, opacity, filter" }}
            >
              <Image
                src={currentIdentity.image}
                alt={currentIdentity.title}
                fill
                sizes="(max-width: 768px) 100vw, 650px"
                priority
                className={`object-contain object-top filter contrast-[1.08] brightness-[0.98] saturate-[0.95] portrait-blend-image transition-all duration-150 ${
                  chromaticFlash ? "drop-shadow-[3px_0_0_rgba(255,30,64,0.7)] drop-shadow-[-3px_0_0_rgba(0,240,255,0.7)]" : ""
                }`}
              />
            </motion.div>
          </AnimatePresence>

          {/* PROBLEM 1 & 2 FIX: Local Glitch Overlay — Clipped strictly inside Portrait Box */}
          {isGlitching && !prefersReducedMotion && (
            <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-2xl bg-[#FF1E40]/10 backdrop-blur-[1px]">
              {/* Subtle Noise Texture (65% lower opacity than previous broadcast static) */}
              <div className="absolute inset-0 bg-[radial-gradient(#FF1E40_1px,transparent_1px)] [background-size:12px_12px] opacity-15" />

              {/* 3-4 Horizontal Scan-Line Breaks */}
              {scanLines.map((line, idx) => (
                <div
                  key={idx}
                  className="absolute w-full bg-white/70 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  style={{
                    top: line.top,
                    height: line.height,
                    transform: `translateX(${line.offset})`,
                  }}
                />
              ))}

              {/* Brief Red Accent Horizon Line */}
              <div className="absolute top-1/2 h-[1px] w-full bg-[#FF1E40]/70 shadow-[0_0_10px_#FF1E40]" />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
