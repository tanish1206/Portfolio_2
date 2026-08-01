"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { IdentityTransformer } from "./IdentityTransformer";
import { IDENTITIES, Identity } from "@/data/identities";

export const HeroSection: React.FC = () => {
  const [activeIdentity, setActiveIdentity] = useState<Identity>(IDENTITIES[0]);

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-between px-6 py-12 selection:bg-accent-blue selection:text-black">
      {/* Top Minimal Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="z-10 flex w-full max-w-6xl items-center justify-between"
      >
        <div className="flex flex-col">
          <span className="font-space text-lg font-bold tracking-tight text-text-primary md:text-xl">
            Tanish Soni
          </span>
          <span className="text-xs tracking-widest text-text-muted uppercase">
            AI Engineer & Product Builder
          </span>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-blue opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-blue"></span>
          </span>
          <span className="hidden font-mono text-[11px] text-text-muted sm:inline">
            Interactive Experience Mode
          </span>
        </div>
      </motion.div>

      {/* Center Hero Content with Portrait & Spotlight */}
      <div className="z-10 flex flex-col items-center justify-center my-auto space-y-8 text-center">
        {/* Subtitle / Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-space text-base font-light tracking-wide text-text-secondary md:text-2xl"
        >
          Building ideas into reality.
        </motion.p>

        {/* Identity Portrait Transformer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
        >
          <IdentityTransformer onIdentityChange={setActiveIdentity} />
        </motion.div>
      </div>

      {/* Bottom Scroll Cue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="z-10 flex flex-col items-center gap-2 text-center"
      >
        <span className="font-mono text-[10px] tracking-widest text-text-muted uppercase">
          Hover portrait to transform identity • Scroll down to enter world
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-[1px] bg-gradient-to-b from-accent-blue via-accent-blue/40 to-transparent"
        />
      </motion.div>
    </section>
  );
};
