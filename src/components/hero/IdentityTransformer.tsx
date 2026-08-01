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
  const [isHovered, setIsHovered] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef(identityIndex);

  const currentIdentity = IDENTITIES[identityIndex] || IDENTITIES[0];

  const isPrepped = heroState === "TRANSITION_PREP";
  const isDissolving = heroState === "WORLD_TRANSITION" || heroState === "WORLD";

  // Trigger brief glitch overlay when controller advances identityIndex
  useEffect(() => {
    if (prevIndexRef.current !== identityIndex) {
      prevIndexRef.current = identityIndex;
      setIsGlitching(true);
      if (onIdentityChange) onIdentityChange(IDENTITIES[identityIndex]);
      const timer = setTimeout(() => setIsGlitching(false), 800);
      return () => clearTimeout(timer);
    }
  }, [identityIndex, onIdentityChange]);

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
    // Delegate hover event to HeroExperienceController
    HeroExperienceController.onHoverEnter();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseOffset({ x: 0, y: 0 });
    // Delegate leave event to HeroExperienceController
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
      {/* Volumetric Spotlight Beam */}
      <motion.div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[75vh] w-[85vw] max-w-[1000px] rounded-full blur-[120px] opacity-65 z-0"
        style={{
          background: `radial-gradient(ellipse at top, #FF1E40 0%, #DC143C 40%, rgba(220,20,60,0.06) 75%, transparent 92%)`,
          willChange: "transform, opacity",
        }}
        animate={{
          scale: isDissolving ? 1.8 : isHovered ? 1.15 : isGlitching ? 1.2 : 1,
          opacity: isDissolving ? 0 : isHovered ? 0.92 : 0.65,
          x: mouseOffset.x * 3,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />

      {/* Atmospheric Volumetric Dust Haze */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[50vh] w-[50vw] max-w-[700px] rounded-full blur-[80px] opacity-30 bg-gradient-to-b from-[#FF1E40] to-transparent z-0" />

      {/* Floating Portrait Scene Layer (Scale 1.25, object-fit contain) */}
      <motion.div
        className="portrait-vignette-mask relative z-10 w-[90vw] max-w-[650px] h-[55vh] md:h-[65vh] lg:h-[70vh] pointer-events-none flex items-center justify-center"
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
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdentity.id}
            initial={{ opacity: 0, scale: 1.28, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1.25, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.22, filter: "blur(4px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
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
