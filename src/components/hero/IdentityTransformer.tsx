"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { phase } = useCinematic();
  const currentIdentity = IDENTITIES[currentIndex];

  const isFreezing = phase === "HERO_FREEZE" || phase === "HERO_PUSH";
  const isDissolving =
    phase === "PARTICLE_DISSOLVE" ||
    phase === "FLY_THROUGH" ||
    phase === "WORLD_ASSEMBLE" ||
    phase === "WORLD_ACTIVE";

  // Restrained cursor tracking: maximum 2 degrees movement for luxury feel
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isFreezing || isDissolving) return;
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

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
    if (hoverTimerRef.current) clearInterval(hoverTimerRef.current);
  };

  // Hover cycles identities every 3s automatically while hovered or on click
  const handleMouseEnter = () => {
    if (isFreezing || isDissolving) return;
    triggerTransformation();

    if (hoverTimerRef.current) clearInterval(hoverTimerRef.current);
    hoverTimerRef.current = setInterval(() => {
      triggerTransformation();
    }, 3000);
  };

  const handleClick = () => {
    if (isFreezing || isDissolving || isGlitching) return;
    triggerTransformation();
  };

  const triggerTransformation = () => {
    setIsGlitching(true);
    setTimeout(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % IDENTITIES.length;
        if (onIdentityChange) onIdentityChange(IDENTITIES[next]);
        return next;
      });
    }, 400); // Mid-glitch image swap

    setTimeout(() => {
      setIsGlitching(false);
    }, 1000); // 1.0s complete transformation
  };

  // Notify parent of initial identity on mount
  useEffect(() => {
    if (onIdentityChange) {
      onIdentityChange(IDENTITIES[0]);
    }
    return () => {
      if (hoverTimerRef.current) clearInterval(hoverTimerRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="interactive-hover group relative flex cursor-pointer flex-col items-center justify-center select-none"
    >
      {/* 1. Overhead Deep Crimson Spotlight Cone Layer */}
      <motion.div
        className="pointer-events-none absolute -top-44 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full blur-[100px] opacity-60 z-0"
        style={{
          background: `radial-gradient(ellipse at top, #FF1E40 0%, #DC143C 45%, rgba(220,20,60,0.08) 75%, transparent 90%)`,
          willChange: "transform, opacity",
        }}
        animate={{
          scale: isDissolving ? 1.8 : isGlitching ? 1.2 : 1,
          opacity: isDissolving ? 0 : 0.6,
          x: mouseOffset.x * 3,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* 2. Volumetric Atmosphere Haze & Dust Layer */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[380px] w-[380px] rounded-full blur-[70px] opacity-30 bg-gradient-to-b from-[#FF1E40] to-transparent z-0" />

      {/* 3. Floating Cinematic Portrait Layer (45-50% Viewport Height, scale 1.25, object-fit: contain) */}
      <motion.div
        className="portrait-vignette-mask relative z-10 h-[380px] w-[300px] md:h-[480px] md:w-[380px] lg:h-[530px] lg:w-[420px] overflow-hidden"
        style={{ willChange: "transform, opacity, filter" }}
        animate={{
          scale: isDissolving ? 1.3 : phase === "HERO_PUSH" ? 1.15 : 1,
          opacity: isDissolving ? 0 : 1,
          y: isFreezing ? 0 : [0, -5, 0],
          rotateX: mouseOffset.y * -1,
          rotateY: mouseOffset.x,
        }}
        transition={{
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.6 },
          rotateX: { type: "spring", stiffness: 160, damping: 22 },
          rotateY: { type: "spring", stiffness: 160, damping: 22 },
        }}
      >
        {/* Active Identity Image with transform scale(1.25) & object-contain */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdentity.id}
            initial={{ opacity: 0, scale: 1.28, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1.25, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.22, filter: "blur(4px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-full w-full flex items-center justify-center"
            style={{ willChange: "transform, opacity, filter" }}
          >
            <Image
              src={currentIdentity.image}
              alt={currentIdentity.title}
              fill
              sizes="(max-width: 768px) 300px, (max-width: 1024px) 380px, 420px"
              priority
              className="object-contain object-top filter contrast-[1.08] brightness-[0.98] saturate-[0.95] portrait-blend-image"
            />
          </motion.div>
        </AnimatePresence>

        {/* Preload Identity Assets */}
        <div className="hidden">
          {IDENTITIES.map((identity) => (
            <Image
              key={identity.id}
              src={identity.image}
              alt={identity.title}
              width={420}
              height={530}
              priority={false}
            />
          ))}
        </div>

        {/* Glitch Overlay */}
        {isGlitching && (
          <div className="animate-glitch pointer-events-none absolute inset-0 z-20 overflow-hidden bg-accent-crimson/15 backdrop-blur-[2px]">
            <div className="absolute inset-0 bg-[radial-gradient(#FF1E40_1px,transparent_1px)] [background-size:10px_10px] opacity-50" />
            <div className="absolute top-1/3 h-[2px] w-full bg-white/80 shadow-[0_0_12px_#fff]" />
            <div className="absolute top-2/3 h-[1px] w-full bg-accent-crimson shadow-[0_0_10px_#DC143C]" />
          </div>
        )}

        {/* Feathered Dark Vignette Edge Blend */}
        <div className="pointer-events-none absolute inset-0 bg-radial-vignette opacity-95" />
      </motion.div>
    </div>
  );
};

