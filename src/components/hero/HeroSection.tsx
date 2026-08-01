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
    <section className="relative flex min-h-screen w-full flex-col items-center justify-between px-6 py-8 md:py-12 selection:bg-accent-crimson selection:text-white overflow-hidden bg-[#050505]">
      {/* 1. HUD Top Navigation / Metadata Header */}
      <div className="z-20 w-full max-w-7xl flex items-center justify-between font-mono text-[11px] md:text-xs tracking-widest text-neutral-400 uppercase border-b border-white/5 pb-4">
        {/* Left Side: Professional Role Anchor */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: isTransitioning ? 0 : 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center space-x-2"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-crimson animate-pulse" />
          <span className="text-white font-medium">{activeIdentity.title}</span>
          <span className="hidden sm:inline text-neutral-600">/ PORTFOLIO ARCHITECTURE</span>
        </motion.div>

        {/* Right Side: Chapter Index Anchor */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: isTransitioning ? 0 : 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center space-x-2"
        >
          <span className="text-accent-crimson font-semibold">01</span>
          <span className="text-neutral-500">•</span>
          <span className="text-neutral-300">BEGINNING</span>
        </motion.div>
      </div>

      {/* 2. Main Composition: Overhead Spotlight + Portrait + Intersecting Title */}
      <div className="z-10 relative my-auto flex flex-col items-center justify-center w-full max-w-5xl">
        {/* Spotlit Borderless Portrait (45-50% Viewport Height) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: isTransitioning && phase !== "HERO_FREEZE" && phase !== "HERO_PUSH" ? 0 : 1,
            scale: 1,
          }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="relative z-10"
        >
          <IdentityTransformer onIdentityChange={setActiveIdentity} />
        </motion.div>

        {/* Intersecting Name Heading (Overlaps Lower Portion of Portrait) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isTransitioning ? 0 : 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative z-20 -mt-12 sm:-mt-16 md:-mt-20 lg:-mt-24 text-center pointer-events-none"
        >
          <h1 className="font-space text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[0.14em] text-white uppercase drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
            TANISH <span className="text-accent-crimson">SONI</span>
          </h1>
        </motion.div>

        {/* Bottom Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isTransitioning ? 0 : 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="relative z-20 mt-4 md:mt-6 text-center"
        >
          <p className="font-mono text-xs md:text-sm font-light tracking-[0.28em] text-neutral-400 uppercase">
            Building Ideas Into Reality.
          </p>
        </motion.div>
      </div>

      {/* 3. Subtle Scroll Cue (Slow Pulse Animation) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="z-20 mt-auto flex flex-col items-center gap-1.5 text-center"
      >
        <motion.div
          animate={{ opacity: [0.35, 1, 0.35], y: [0, 4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center space-y-1"
        >
          <span className="text-accent-crimson text-xs font-mono">↓</span>
          <span className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] text-neutral-500 uppercase">
            Scroll to Begin
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
};

