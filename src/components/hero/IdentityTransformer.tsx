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
      {/* Overhead Soft Focused Crimson Spotlight Beam */}
      <motion.div
        className="pointer-events-none absolute -top-36 left-1/2 -translate-x-1/2 h-[480px] w-[480px] rounded-full blur-[90px] opacity-50 z-0"
        style={{
          background: `radial-gradient(circle at center, #FF1E40 0%, #DC143C 40%, rgba(220,20,60,0.1) 70%, transparent 85%)`,
        }}
        animate={{
          scale: isDissolving ? 1.8 : isGlitching ? 1.2 : 1,
          opacity: isDissolving ? 0 : 0.5,
          x: mouseOffset.x * 4 - 240,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Atmospheric Haze Layer */}
      <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-[350px] w-[350px] rounded-full blur-[60px] opacity-25 bg-gradient-to-b from-[#FF1E40] to-transparent z-0" />

      {/* Borderless Portrait Container with Micro-Breathing & Restrained 2° Tilt */}
      <motion.div
        className="portrait-vignette-mask relative z-10 h-[380px] w-[290px] overflow-hidden md:h-[480px] md:w-[370px] lg:h-[520px] lg:w-[400px]"
        animate={{
          scale: isDissolving ? 1.25 : phase === "HERO_PUSH" ? 1.1 : 1,
          opacity: isDissolving ? 0 : 1,
          y: isFreezing ? 0 : [0, -6, 0],
          rotateX: mouseOffset.y * -1,
          rotateY: mouseOffset.x,
        }}
        transition={{
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.6 },
          rotateX: { type: "spring", stiffness: 180, damping: 24 },
          rotateY: { type: "spring", stiffness: 180, damping: 24 },
        }}
      >
        {/* Active Identity Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdentity.id}
            initial={{ opacity: 0, scale: 1.04, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-full w-full"
          >
            <Image
              src={currentIdentity.image}
              alt={currentIdentity.title}
              fill
              sizes="(max-width: 768px) 290px, (max-width: 1024px) 370px, 400px"
              priority
              className="object-cover object-top filter contrast-[1.1] brightness-[0.92] saturate-[0.95]"
            />
          </motion.div>
        </AnimatePresence>

        {/* Preload Next & Previous Identity Images */}
        <div className="hidden">
          {IDENTITIES.map((identity) => (
            <Image
              key={identity.id}
              src={identity.image}
              alt={identity.title}
              width={400}
              height={520}
              priority={false}
            />
          ))}
        </div>

        {/* Cinematic Glitch Overlay in Crimson / Soft Charcoal */}
        {isGlitching && (
          <div className="animate-glitch pointer-events-none absolute inset-0 z-20 overflow-hidden bg-accent-crimson/15 backdrop-blur-[2px]">
            <div className="absolute inset-0 bg-[radial-gradient(#FF1E40_1px,transparent_1px)] [background-size:10px_10px] opacity-50" />
            <div className="absolute top-1/3 h-[2px] w-full bg-white/80 shadow-[0_0_12px_#fff]" />
            <div className="absolute top-2/3 h-[1px] w-full bg-accent-crimson shadow-[0_0_10px_#DC143C]" />
          </div>
        )}

        {/* Soft Feathered Vignette & Light Wrap Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-radial-vignette opacity-95" />
      </motion.div>
    </div>
  );
};

