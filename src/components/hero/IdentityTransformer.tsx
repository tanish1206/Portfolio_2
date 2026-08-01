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
  const isDissolving = phase === "PARTICLE_DISSOLVE" || phase === "FLY_THROUGH" || phase === "WORLD_ASSEMBLE" || phase === "WORLD_ACTIVE";

  // Mouse tilt tracking strictly limited to max 2.5 degrees for luxury feel
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isFreezing || isDissolving) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const offsetX = (e.clientX - centerX) / (rect.width / 2);
    const offsetY = (e.clientY - centerY) / (rect.height / 2);

    setMouseOffset({
      x: Math.max(-2.5, Math.min(2.5, offsetX * 2.5)),
      y: Math.max(-2.5, Math.min(2.5, offsetY * 2.5)),
    });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
    if (hoverTimerRef.current) clearInterval(hoverTimerRef.current);
  };

  // Hover cycles identities: Builder -> Hackathon -> Full Stack -> AI -> Founder -> Builder
  const handleMouseEnter = () => {
    if (isFreezing || isDissolving) return;
    triggerTransformation();

    if (hoverTimerRef.current) clearInterval(hoverTimerRef.current);
    hoverTimerRef.current = setInterval(() => {
      triggerTransformation();
    }, 2800);
  };

  const triggerTransformation = () => {
    setIsGlitching(true);
    setTimeout(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % IDENTITIES.length;
        if (onIdentityChange) onIdentityChange(IDENTITIES[next]);
        return next;
      });
    }, 400); // Mid-glitch image swap at 400ms

    setTimeout(() => {
      setIsGlitching(false);
    }, 1000); // 1.0s total transformation complete
  };

  useEffect(() => {
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
      className="interactive-hover group relative flex cursor-pointer flex-col items-center justify-center"
    >
      {/* Overhead Soft Focused Crimson Spotlight Glow */}
      <motion.div
        className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 h-[450px] w-[450px] rounded-full blur-3xl opacity-50 z-0"
        style={{
          background: `radial-gradient(circle at center, #FF1E40 0%, #DC143C 35%, transparent 70%)`,
        }}
        animate={{
          scale: isDissolving ? 1.8 : isGlitching ? 1.15 : 1,
          opacity: isDissolving ? 0 : 0.5,
        }}
        transition={{ duration: 0.8 }}
      />

      {/* Borderless Portrait Container with Micro-Breathing & Restrained 2-3° Tilt */}
      <motion.div
        className="portrait-vignette-mask relative h-[380px] w-[290px] overflow-hidden md:h-[460px] md:w-[360px] z-10"
        animate={{
          scale: isDissolving ? 1.25 : phase === "HERO_PUSH" ? 1.1 : 1,
          opacity: isDissolving ? 0 : 1,
          y: isFreezing ? 0 : [0, -4, 0],
          rotateX: mouseOffset.y * -1,
          rotateY: mouseOffset.x,
        }}
        transition={{
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.6 },
          rotateX: { type: "spring", stiffness: 200, damping: 25 },
          rotateY: { type: "spring", stiffness: 200, damping: 25 },
        }}
      >
        {/* Active Identity Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdentity.id}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-full w-full"
          >
            <Image
              src={currentIdentity.image}
              alt={currentIdentity.title}
              fill
              sizes="(max-width: 768px) 290px, 360px"
              priority
              className="object-cover object-center filter contrast-[1.08] brightness-95"
            />
          </motion.div>
        </AnimatePresence>

        {/* Cinematic Glitch Overlay in Deep Crimson / Charcoal */}
        {isGlitching && (
          <div className="animate-glitch pointer-events-none absolute inset-0 z-20 overflow-hidden bg-accent-crimson/10 backdrop-blur-[2px]">
            <div className="absolute inset-0 bg-[radial-gradient(#FF1E40_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />
            <div className="absolute top-1/3 h-[2px] w-full bg-white/70 shadow-[0_0_8px_#fff]" />
            <div className="absolute top-2/3 h-[1px] w-full bg-accent-crimson shadow-[0_0_8px_#DC143C]" />
          </div>
        )}

        {/* Soft Feathered Vignette Overlay to blend seamlessly into darkness */}
        <div className="pointer-events-none absolute inset-0 bg-radial-vignette opacity-90" />
      </motion.div>
    </div>
  );
};
