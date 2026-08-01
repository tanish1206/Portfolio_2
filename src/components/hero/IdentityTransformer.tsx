"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IDENTITIES, Identity } from "@/data/identities";

interface IdentityTransformerProps {
  onIdentityChange?: (identity: Identity) => void;
}

export const IdentityTransformer: React.FC<IdentityTransformerProps> = ({
  onIdentityChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentIdentity = IDENTITIES[currentIndex];

  // Mouse head & eye tracking handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const offsetX = (e.clientX - centerX) / (rect.width / 2);
    const offsetY = (e.clientY - centerY) / (rect.height / 2);

    setMouseOffset({
      x: Math.max(-12, Math.min(12, offsetX * 12)),
      y: Math.max(-12, Math.min(12, offsetY * 12)),
    });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
    setIsHovered(false);
    if (hoverTimerRef.current) {
      clearInterval(hoverTimerRef.current);
    }
  };

  // Hover triggers identity cycle: Builder -> Hackathon -> Full Stack -> AI -> Founder -> Builder
  const handleMouseEnter = () => {
    setIsHovered(true);
    triggerTransformation();

    // Auto-cycle every 2.8s while hovered
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
    }, 400); // Mid-glitch image swap

    setTimeout(() => {
      setIsGlitching(false);
    }, 1000); // 1.0s cinematic transition complete
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
      {/* Soft Ambient Spotlight Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-10 rounded-full blur-3xl opacity-30"
        style={{
          background: `radial-gradient(circle, ${currentIdentity.accentColor} 0%, transparent 70%)`,
        }}
        animate={{
          scale: isHovered ? 1.2 : 1,
          opacity: isHovered ? 0.45 : 0.25,
        }}
        transition={{ duration: 0.8 }}
      />

      {/* Hero Portrait Container with Procedural Breathing & Mouse Eye-Tracking */}
      <motion.div
        className="relative h-[340px] w-[270px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl md:h-[420px] md:w-[330px]"
        animate={{
          y: [0, -6, 0],
          rotateX: mouseOffset.y * -0.5,
          rotateY: mouseOffset.x * 0.5,
        }}
        transition={{
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          rotateX: { type: "spring", stiffness: 300, damping: 20 },
          rotateY: { type: "spring", stiffness: 300, damping: 20 },
        }}
      >
        {/* Active Identity Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdentity.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-full w-full"
          >
            <Image
              src={currentIdentity.image}
              alt={currentIdentity.title}
              fill
              sizes="(max-width: 768px) 270px, 330px"
              priority
              className="object-cover object-center filter contrast-105 brightness-95 transition-all duration-700"
            />
          </motion.div>
        </AnimatePresence>

        {/* Glitch & Particle Dissolve Shader Overlay */}
        {isGlitching && (
          <div className="animate-glitch pointer-events-none absolute inset-0 z-20 overflow-hidden bg-accent-blue/10 backdrop-blur-[2px]">
            <div className="absolute inset-0 bg-[radial-gradient(#00E5FF_1px,transparent_1px)] [background-size:12px_12px] opacity-60" />
            <div className="absolute top-1/4 h-[2px] w-full bg-white/60 shadow-[0_0_8px_#fff]" />
            <div className="absolute top-2/3 h-[1px] w-full bg-accent-blue shadow-[0_0_8px_#00E5FF]" />
          </div>
        )}

        {/* Subtle Vignette Frame */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
      </motion.div>

      {/* Identity Stage Badge */}
      <motion.div
        className="mt-6 flex flex-col items-center space-y-1 text-center z-10"
        animate={{ opacity: isGlitching ? 0.4 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-surface/80 px-3 py-1 text-xs backdrop-blur-md">
          <span
            className="h-2 w-2 rounded-full animate-ping"
            style={{ backgroundColor: currentIdentity.accentColor }}
          />
          <span
            className="font-mono text-[11px] font-medium tracking-widest uppercase"
            style={{ color: currentIdentity.accentColor }}
          >
            Identity: {currentIdentity.title}
          </span>
        </div>
        <p className="max-w-xs text-xs text-text-secondary opacity-80">
          {currentIdentity.subtitle}
        </p>
      </motion.div>
    </div>
  );
};
