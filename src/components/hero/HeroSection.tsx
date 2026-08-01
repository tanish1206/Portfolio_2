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
    <section className="relative flex min-h-screen w-full flex-col items-center justify-between px-6 py-16 selection:bg-accent-crimson selection:text-white overflow-hidden bg-background">
      {/* 1. Top Statement (Massive Negative Space Above) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isTransitioning ? 0 : 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="z-10 mt-6 text-center"
      >
        <p className="font-space text-sm font-light tracking-widest text-text-secondary uppercase md:text-base">
          Building ideas into reality.
        </p>
      </motion.div>

      {/* 2. Hero Portrait (Overhead Crimson Spotlight + Borderless Dark Vignette Blend) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: isTransitioning && phase !== "HERO_FREEZE" && phase !== "HERO_PUSH" ? 0 : 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.4 }}
        className="z-10 my-auto flex flex-col items-center justify-center"
      >
        <IdentityTransformer onIdentityChange={setActiveIdentity} />
      </motion.div>

      {/* 3. Name & Core Disciplines */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: isTransitioning ? 0 : 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="z-10 mb-8 flex flex-col items-center text-center space-y-3"
      >
        <h1 className="font-space text-3xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
          TANISH SONI
        </h1>

        <div className="flex flex-col items-center space-y-1 font-mono text-xs text-text-secondary md:flex-row md:space-y-0 md:space-x-3 md:text-sm">
          <span>AI Engineer</span>
          <span className="hidden text-accent-crimson md:inline">•</span>
          <span>Full Stack Developer</span>
          <span className="hidden text-accent-crimson md:inline">•</span>
          <span>Product Builder</span>
        </div>
      </motion.div>

      {/* 4. Bottom Scroll Cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="z-10 flex flex-col items-center gap-2 text-center"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center space-y-2"
        >
          <span className="text-accent-crimson text-xs">↓</span>
          <span className="font-mono text-[11px] tracking-widest text-text-muted uppercase">
            Scroll to Begin
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
};
