"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { IdentityTransformer } from "./IdentityTransformer";
import { IDENTITIES, Identity } from "@/data/identities";
import { useCinematic } from "@/context/CinematicContext";

export const HeroSection: React.FC = () => {
  const [, setActiveIdentity] = useState<Identity>(IDENTITIES[0]);
  const { phase } = useCinematic();

  const isTransitioning = phase !== "HERO_IDLE";

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-between px-4 py-8 selection:bg-accent-crimson selection:text-white overflow-hidden bg-[#050505] text-white">
      {/* 1. Dramatic Crimson Spotlight Cone from Top Center */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-600/35 via-red-950/15 to-transparent blur-2xl z-0" />

      {/* 2. Top-Left Corner Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isTransitioning ? 0 : 1, x: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute top-8 left-8 z-20 flex flex-col space-y-1 font-mono text-[10px] tracking-widest text-white/70 uppercase"
      >
        <span>AI ENGINEER</span>
        <span>FULL STACK DEVELOPER</span>
        <span>HACKATHON BUILDER</span>
        <span>PRODUCT BUILDER</span>
        <div className="mt-1 h-[2px] w-6 bg-red-600/80" />
      </motion.div>

      {/* 3. Top-Right Corner Header */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: isTransitioning ? 0 : 1, x: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute top-8 right-8 z-20 flex flex-col items-end space-y-1 font-mono text-right text-[10px] tracking-widest text-white/70 uppercase"
      >
        <span className="text-sm font-bold text-white">01</span>
        <span className="text-[10px] text-white/60">BEGINNING</span>
        <div className="mt-1 h-[2px] w-6 bg-red-600/80" />
      </motion.div>

      {/* 4. Left Margin Vertical Label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 items-center space-x-3 [writing-mode:vertical-lr] rotate-180 font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-red-600 shadow-[0_0_8px_#DC143C]" />
        <span>TANISH SONI</span>
      </motion.div>

      {/* 5. Right Margin Vertical Label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 items-center space-x-3 [writing-mode:vertical-lr] font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-red-600 shadow-[0_0_8px_#DC143C]" />
        <span>BUILDING IDEAS INTO REALITY.</span>
      </motion.div>

      {/* 6. Mid-Screen Alignment Crosshairs (+) */}
      <div className="hidden md:block pointer-events-none absolute left-24 top-1/2 -translate-y-1/2 z-10 font-mono text-xs text-red-600/50">
        +
      </div>
      <div className="hidden md:block pointer-events-none absolute right-24 top-1/2 -translate-y-1/2 z-10 font-mono text-xs text-red-600/50">
        +
      </div>

      {/* 7. Center Hero Portrait & Overlapping Typography Area */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center w-full max-w-5xl">
        {/* Portrait Component */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: isTransitioning && phase !== "HERO_FREEZE" && phase !== "HERO_PUSH" ? 0 : 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="relative flex justify-center"
        >
          <IdentityTransformer onIdentityChange={setActiveIdentity} />
        </motion.div>

        {/* TANISH SONI Large Spaced Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isTransitioning ? 0 : 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="-mt-12 md:-mt-16 z-20 flex items-center justify-center space-x-4 md:space-x-8 font-space text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-[0.3em] md:tracking-[0.4em]"
        >
          <span className="text-white">TANISH</span>
          <span className="text-red-600 drop-shadow-[0_0_20px_rgba(220,20,60,0.4)]">SONI</span>
        </motion.div>

        {/* Divider with Red Cross Symbol & Micro Code Details */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isTransitioning ? 0 : 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-6 flex flex-col items-center space-y-4 w-full max-w-xl px-4"
        >
          {/* Line with Cross Accent */}
          <div className="flex items-center justify-center space-x-4 w-full">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-red-600/40 to-red-600/70" />
            <span className="text-red-600 text-xs font-mono">✦</span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-red-600/70 via-red-600/40 to-transparent" />
          </div>

          {/* Subtitle & Micro Tech Specs */}
          <div className="flex items-center justify-between w-full font-mono text-[9px] md:text-[11px] text-white/50 tracking-[0.25em] uppercase">
            <span className="hidden sm:inline text-white/30 text-[8px]">01.10.18 • CODE</span>
            <span className="text-center font-space text-white/90 text-xs md:text-sm tracking-[0.3em]">
              BUILDING IDEAS INTO REALITY.
            </span>
            <span className="hidden sm:inline text-white/30 text-[8px]">110101001 • SYS</span>
          </div>
        </motion.div>
      </div>

      {/* 8. Bottom Bracketed Scroll Cue */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isTransitioning ? 0 : 1, y: 0 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="z-20 flex flex-col items-center space-y-2 mb-2"
      >
        <div className="font-mono text-[10px] md:text-[11px] tracking-widest text-red-500/90 uppercase flex items-center space-x-1">
          <span className="text-red-600">[</span>
          <span className="text-white/80">SCROLL TO BEGIN</span>
          <span className="text-red-600">]</span>
        </div>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="h-10 w-[1px] bg-gradient-to-b from-red-600 via-red-600/40 to-transparent"
        />
      </motion.div>
    </section>
  );
};
