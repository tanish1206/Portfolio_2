"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { IdentityTransformer } from "./IdentityTransformer";
import { IDENTITIES, Identity } from "@/data/identities";
import { useCinematic } from "@/context/CinematicContext";

export const HeroSection: React.FC = () => {
  const [activeIdentity, setActiveIdentity] = useState<Identity>(IDENTITIES[0]);
  const { phase } = useCinematic();

  const isTransitioning = phase !== "HERO_IDLE";

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-between px-6 py-6 md:py-8 selection:bg-accent-crimson selection:text-white overflow-hidden bg-[#050505] text-neutral-300">
      
      {/* 1. TOP LEFT & RIGHT HUD ANCHORS */}
      <div className="z-20 w-full max-w-7xl flex items-start justify-between font-mono text-[10px] md:text-[11px] tracking-widest uppercase">
        {/* Top Left: Stacked Roles List */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: isTransitioning ? 0 : 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col space-y-1 text-neutral-400"
        >
          <span className={activeIdentity.id === "ai" ? "text-white font-semibold" : "opacity-60"}>AI ENGINEER</span>
          <span className={activeIdentity.id === "fullstack" ? "text-white font-semibold" : "opacity-60"}>FULL STACK DEVELOPER</span>
          <span className={activeIdentity.id === "hackathon" ? "text-white font-semibold" : "opacity-60"}>HACKATHON BUILDER</span>
          <span className={activeIdentity.id === "builder" || activeIdentity.id === "founder" ? "text-white font-semibold" : "opacity-60"}>PRODUCT BUILDER</span>
          <div className="h-[2px] w-4 bg-accent-crimson mt-1" />
        </motion.div>

        {/* Top Right: Chapter Index Anchor */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: isTransitioning ? 0 : 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-end space-y-0.5 text-neutral-400"
        >
          <span className="text-xs font-bold text-white">01</span>
          <span className="text-[10px] tracking-[0.2em] text-neutral-500">BEGINNING</span>
          <div className="h-[2px] w-4 bg-accent-crimson mt-1" />
        </motion.div>
      </div>

      {/* 2. SIDE HUD LABELS (Vertical Text with Red Glowing Dots & Micro Plus Marks) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="hidden lg:flex pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 z-20 flex-col items-center space-y-4"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-accent-crimson shadow-[0_0_8px_#DC143C]" />
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-400 [writing-mode:vertical-lr] rotate-180">
          TANISH SONI
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="hidden lg:flex pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 z-20 flex-col items-center space-y-4"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-accent-crimson shadow-[0_0_8px_#DC143C]" />
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-400 [writing-mode:vertical-lr]">
          BUILDING IDEAS INTO REALITY.
        </span>
      </motion.div>

      {/* Micro Crosshair Reticles Flanking Center Portrait Area */}
      <div className="hidden md:block pointer-events-none absolute left-1/4 top-1/2 -translate-y-1/2 z-10 text-accent-crimson/50 font-mono text-sm">
        +
      </div>
      <div className="hidden md:block pointer-events-none absolute right-1/4 top-1/2 -translate-y-1/2 z-10 text-accent-crimson/50 font-mono text-sm">
        +
      </div>

      {/* 3. MAIN CENTER COMPOSITION: SPOTLIGHT + PORTRAIT + INTERSECTING TITLE */}
      <div className="z-10 relative my-auto flex flex-col items-center justify-center w-full max-w-5xl">
        {/* Spotlit Borderless Portrait (45-50% Viewport Height) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: isTransitioning && phase !== "HERO_FREEZE" && phase !== "HERO_PUSH" ? 0 : 1,
            scale: 1,
          }}
          transition={{ duration: 1.2, delay: 0.3 }}
          style={{ willChange: "transform, opacity" }}
          className="relative z-10"
        >
          <IdentityTransformer onIdentityChange={setActiveIdentity} />
        </motion.div>

        {/* Intersecting Name Heading (Overlaps Lower Portion of Portrait) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isTransitioning ? 0 : 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ willChange: "transform, opacity" }}
          className="relative z-20 -mt-10 sm:-mt-14 md:-mt-18 lg:-mt-22 text-center pointer-events-none"
        >
          <h1 className="font-space text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-[0.22em] text-white uppercase drop-shadow-[0_12px_40px_rgba(0,0,0,0.95)]">
            TANISH <span className="text-accent-crimson">SONI</span>
          </h1>
        </motion.div>

        {/* Horizontal Line Divider with Center Crimson Cross */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: isTransitioning ? 0 : 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="relative z-20 w-48 sm:w-64 md:w-80 h-[1px] bg-neutral-800 my-4 flex items-center justify-center"
        >
          <span className="bg-[#050505] px-2 text-accent-crimson text-xs font-mono">✦</span>
        </motion.div>

        {/* Bottom Tagline & Micro HUD Snippets */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isTransitioning ? 0 : 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="relative z-20 flex items-center space-x-4 text-center"
        >
          <span className="hidden sm:inline font-mono text-[9px] text-neutral-600 tracking-widest">[ 01.10.18 ]</span>
          <p className="font-mono text-xs md:text-sm font-light tracking-[0.3em] text-neutral-400 uppercase">
            BUILDING IDEAS INTO REALITY.
          </p>
          <span className="hidden sm:inline font-mono text-[9px] text-neutral-600 tracking-widest">[ 11.01.00.01 ]</span>
        </motion.div>
      </div>

      {/* 4. BRACKETED SCROLL CUE */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="z-20 mt-auto flex flex-col items-center gap-1 text-center pb-2"
      >
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center space-y-1 font-mono text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-neutral-400"
        >
          <div className="flex items-center space-x-1">
            <span className="text-accent-crimson">[</span>
            <span className="text-neutral-300">SCROLL TO BEGIN</span>
            <span className="text-accent-crimson font-semibold">]</span>
          </div>
          <div className="h-6 w-[1px] bg-gradient-to-b from-accent-crimson to-transparent mt-1" />
        </motion.div>
      </motion.div>

    </section>
  );
};


