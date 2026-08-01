"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IdentityTransformer } from "./IdentityTransformer";
import { IDENTITIES, Identity } from "@/data/identities";
import { useCinematic } from "@/context/CinematicContext";

export const HeroSection: React.FC = () => {
  const [activeIdentity, setActiveIdentity] = useState<Identity>(IDENTITIES[0]);
  const [isEnterReady, setIsEnterReady] = useState(false);
  const { phase, beginWorldTransition } = useCinematic();

  const isTransitioning = phase !== "HERO_IDLE";

  // State 5 & Accessibility: Auto-unlock "ENTER THE WORLD" after 10 seconds idle fallback
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      setIsEnterReady(true);
    }, 10000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  const handlePortraitAcknowledge = () => {
    setIsEnterReady(true);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#050505] selection:bg-accent-crimson selection:text-white text-neutral-300">
      
      {/* ATMOSPHERE LAYER 1: Animated Film Grain Overlay */}
      <div className="film-grain-overlay absolute inset-0 z-40 pointer-events-none" />

      {/* ATMOSPHERE LAYER 2 & 6: Ambient Edge Vignette & Red Bounce Light */}
      <div className="pointer-events-none absolute inset-0 z-30 bg-[radial-gradient(circle_at_50%_50%,transparent_35%,rgba(5,5,5,0.65)_75%,rgba(5,5,5,0.98)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,30,64,0.035)_0%,transparent_65%)]" />

      {/* ATMOSPHERE LAYER 3: Volumetric Fog Drift */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-[45vh] w-[65vw] max-w-[750px] blur-[95px] opacity-25 bg-gradient-to-b from-[#FF1E40] to-transparent animate-fog-drift z-0" />

      {/* ATMOSPHERE LAYER 7 & 8: Handheld Camera & Lens Breathing Scene Container */}
      <motion.div
        animate={{
          y: isTransitioning ? 0 : [0, -0.6, 0],
          scale: isTransitioning ? 1 : [1, 1.0015, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
        className="relative w-full h-full"
      >
        {/* CINEMATIC FLOATING PERSON SCENE LAYER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isTransitioning && phase !== "HERO_FREEZE" && phase !== "HERO_PUSH" ? 0 : 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="absolute inset-0 z-10 w-full h-full pointer-events-auto"
        >
          <IdentityTransformer
            onIdentityChange={setActiveIdentity}
            onAcknowledge={handlePortraitAcknowledge}
          />
        </motion.div>

        {/* POSTER TYPOGRAPHY & HUD OVERLAY */}
        <div className="relative z-20 h-full w-full flex flex-col justify-between px-6 py-6 md:py-8 pointer-events-none">
          
          {/* Top Left Stacked Roles & Top Right 01/BEGINNING Index */}
          <div className="w-full max-w-7xl mx-auto flex items-start justify-between font-mono text-[10px] md:text-[11px] tracking-widest uppercase">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: isTransitioning ? 0 : 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col space-y-1 text-neutral-400 pointer-events-auto"
            >
              <span className={activeIdentity.id === "ai" ? "text-white font-semibold" : "opacity-60"}>AI ENGINEER</span>
              <span className={activeIdentity.id === "fullstack" ? "text-white font-semibold" : "opacity-60"}>FULL STACK DEVELOPER</span>
              <span className={activeIdentity.id === "hackathon" ? "text-white font-semibold" : "opacity-60"}>HACKATHON BUILDER</span>
              <span className={activeIdentity.id === "builder" || activeIdentity.id === "founder" ? "text-white font-semibold" : "opacity-60"}>PRODUCT BUILDER</span>
              <div className="h-[2px] w-4 bg-accent-crimson mt-1" />
            </motion.div>

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

          {/* Side Margin HUD Vertical Titles & Reticles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isTransitioning ? 0 : 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 flex-col items-center space-y-4"
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
            className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 flex-col items-center space-y-4"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent-crimson shadow-[0_0_8px_#DC143C]" />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-400 [writing-mode:vertical-lr]">
              BUILDING IDEAS INTO REALITY.
            </span>
          </motion.div>

          <div className="hidden md:block absolute left-1/4 top-1/2 -translate-y-1/2 z-10 text-accent-crimson/50 font-mono text-sm">
            +
          </div>
          <div className="hidden md:block absolute right-1/4 top-1/2 -translate-y-1/2 z-10 text-accent-crimson/50 font-mono text-sm">
            +
          </div>

          {/* Center Intersecting Movie Poster Typography (Overlaps Chest Level) */}
          <div className="my-auto flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isTransitioning ? 0 : 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{ willChange: "transform, opacity" }}
              className="text-center"
            >
              <h1 className="font-space text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-medium tracking-[0.24em] text-white uppercase drop-shadow-[0_14px_45px_rgba(0,0,0,0.95)]">
                TANISH <span className="text-accent-crimson">SONI</span>
              </h1>
            </motion.div>

            {/* Divider Line & Micro Data Snippets */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: isTransitioning ? 0 : 1, scaleX: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="w-48 sm:w-64 md:w-80 h-[1px] bg-neutral-800 my-4 flex items-center justify-center"
            >
              <span className="bg-[#050505] px-2 text-accent-crimson text-xs font-mono">✦</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isTransitioning ? 0 : 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="flex items-center space-x-4 text-center"
            >
              <span className="hidden sm:inline font-mono text-[9px] text-neutral-600 tracking-widest">[ 01.10.18 ]</span>
              <p className="font-mono text-xs md:text-sm font-light tracking-[0.32em] text-neutral-400 uppercase">
                BUILDING IDEAS INTO REALITY.
              </p>
              <span className="hidden sm:inline font-mono text-[9px] text-neutral-600 tracking-widest">[ 11.01.00.01 ]</span>
            </motion.div>
          </div>

          {/* STATE 5 — ENTER THE WORLD CTA (Unlocked via interaction or 10s fallback) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: isTransitioning ? 0 : isEnterReady ? 1 : 0.4,
              y: 0,
            }}
            transition={{ duration: 1 }}
            onClick={() => {
              if (isEnterReady) beginWorldTransition();
            }}
            className="flex flex-col items-center gap-1 text-center pb-2 pointer-events-auto cursor-pointer"
          >
            <motion.div
              animate={{ opacity: isEnterReady ? [0.6, 1, 0.6] : 0.4 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center space-y-1 font-mono text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-neutral-400"
            >
              <div className="flex items-center space-x-1">
                <span className="text-accent-crimson">[</span>
                <span className="text-neutral-200 font-semibold">
                  {isEnterReady ? "ENTER THE WORLD" : "HOVER PORTRAIT TO DISCOVER"}
                </span>
                <span className="text-accent-crimson font-semibold">]</span>
              </div>
              <div className="h-6 w-[1px] bg-gradient-to-b from-accent-crimson to-transparent mt-1" />
            </motion.div>
          </motion.div>

        </div>
      </motion.div>

    </section>
  );
};
