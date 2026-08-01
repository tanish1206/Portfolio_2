"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IDENTITIES, Identity } from "@/data/identities";
import { useCinematic } from "@/context/CinematicContext";

interface IdentityTransformerProps {
  onIdentityChange?: (identity: Identity) => void;
  onAcknowledge?: () => void;
}

export const IdentityTransformer: React.FC<IdentityTransformerProps> = ({
  onIdentityChange,
  onAcknowledge,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const hoverDelayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const cycleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { phase } = useCinematic();
  const currentIdentity = IDENTITIES[currentIndex];

  const isFreezing = phase === "HERO_FREEZE" || phase === "HERO_PUSH";
  const isDissolving =
    phase === "PARTICLE_DISSOLVE" ||
    phase === "FLY_THROUGH" ||
    phase === "WORLD_ASSEMBLE" ||
    phase === "WORLD_ACTIVE";

  // State 1 & 2: Restrained cursor tracking & eyes following cursor (max 2°)
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
    setIsHovered(false);
    setMouseOffset({ x: 0, y: 0 });
    if (hoverDelayTimerRef.current) clearTimeout(hoverDelayTimerRef.current);
    if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
  };

  // State 2 & 3: Hover anticipate ~1s before identity sequence unlocks
  const handleMouseEnter = () => {
    if (isFreezing || isDissolving) return;
    setIsHovered(true);

    if (hoverDelayTimerRef.current) clearTimeout(hoverDelayTimerRef.current);
    if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);

    // 1-second hover anticipation delay before unlocking identity cycle
    hoverDelayTimerRef.current = setTimeout(() => {
      triggerTransformation();
      cycleIntervalRef.current = setInterval(() => {
        triggerTransformation();
      }, 3000);
    }, 1000);
  };

  // State 4: Portrait Acknowledgment ("The portrait noticed me")
  const handleClick = () => {
    if (isFreezing || isDissolving || isGlitching) return;

    // Trigger Acknowledgment pulse: Eye contact, still posture, red light pulse
    setIsAcknowledged(true);
    if (onAcknowledge) onAcknowledge();

    setTimeout(() => {
      setIsAcknowledged(false);
    }, 1500);

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
    }, 400);

    setTimeout(() => {
      setIsGlitching(false);
    }, 1000);
  };

  useEffect(() => {
    if (onIdentityChange) {
      onIdentityChange(IDENTITIES[0]);
    }
    return () => {
      if (hoverDelayTimerRef.current) clearTimeout(hoverDelayTimerRef.current);
      if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="interactive-hover absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer select-none pointer-events-auto z-10"
    >
      {/* 1. Overhead Deep Crimson Spotlight Beam (Drifts and breathes dynamically) */}
      <motion.div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[75vh] w-[85vw] max-w-[1000px] rounded-full blur-[120px] opacity-65 z-0"
        style={{
          background: `radial-gradient(ellipse at top, #FF1E40 0%, #DC143C 40%, rgba(220,20,60,0.06) 75%, transparent 92%)`,
          willChange: "transform, opacity",
        }}
        animate={{
          scale: isDissolving ? 1.8 : isAcknowledged ? 0.9 : isHovered ? 1.1 : isGlitching ? 1.2 : 1,
          opacity: isDissolving ? 0 : isHovered ? 0.8 : 0.65,
          x: mouseOffset.x * 3,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* 2. Atmospheric Volumetric Dust & Haze Layer */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[50vh] w-[50vw] max-w-[700px] rounded-full blur-[80px] opacity-30 bg-gradient-to-b from-[#FF1E40] to-transparent z-0" />

      {/* State 4 Acknowledgment Light Pulse Overlay */}
      {isAcknowledged && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.85, 0], scale: [0.9, 1.2, 1.4] }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 h-64 w-64 rounded-full bg-accent-crimson/25 blur-2xl z-20"
        />
      )}

      {/* 3. Floating Person Cinematic Layer (NO CONTAINER BOX — Scale 1.25, object-fit contain) */}
      <motion.div
        className="portrait-vignette-mask relative z-10 w-[90vw] max-w-[650px] h-[55vh] md:h-[65vh] lg:h-[70vh] pointer-events-none flex items-center justify-center"
        style={{ willChange: "transform, opacity, filter" }}
        animate={{
          scale: isDissolving ? 1.3 : phase === "HERO_PUSH" ? 1.15 : isHovered ? 1.02 : 1,
          opacity: isDissolving ? 0 : 1,
          y: isAcknowledged ? 0 : isFreezing ? 0 : [0, -6, 0],
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
        {/* Active Person Asset with transform scale(1.25) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdentity.id}
            initial={{ opacity: 0, scale: 1.28, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1.25, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.22, filter: "blur(4px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-full w-full flex items-center justify-center pointer-events-none"
            style={{ willChange: "transform, opacity, filter" }}
          >
            <Image
              src={currentIdentity.image}
              alt={currentIdentity.title}
              fill
              sizes="100vw"
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
              width={600}
              height={800}
              priority={false}
            />
          ))}
        </div>

        {/* Glitch Distortion Overlay */}
        {isGlitching && (
          <div className="animate-glitch pointer-events-none absolute inset-0 z-20 overflow-hidden bg-accent-crimson/15 backdrop-blur-[2px]">
            <div className="absolute inset-0 bg-[radial-gradient(#FF1E40_1px,transparent_1px)] [background-size:10px_10px] opacity-50" />
            <div className="absolute top-1/3 h-[2px] w-full bg-white/80 shadow-[0_0_12px_#fff]" />
            <div className="absolute top-2/3 h-[1px] w-full bg-accent-crimson shadow-[0_0_10px_#DC143C]" />
          </div>
        )}
      </motion.div>
    </div>
  );
};

