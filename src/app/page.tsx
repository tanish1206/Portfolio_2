"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroSection } from "@/components/hero/HeroSection";
import { CinematicProvider, useCinematic } from "@/context/CinematicContext";
import { GlobalCinematicController } from "@/components/cinematic/GlobalCinematicController";
import { WorldHubScene } from "@/world/WorldHub/WorldHubScene";
import { WorldController, WorldState } from "@/world/WorldController";
import { CompassOverlay } from "@/world/Compass/CompassOverlay";

/**
 * page.tsx — The entire experience in one fixed viewport.
 *
 * Layer order (z-index):
 *   0  — WorldHubScene (R3F Canvas) — fills full viewport, always rendering
 *   10 — HeroSection — fades out on WORLD_TRANSITION
 *   30 — CompassOverlay — fades in only when inside Career Compass world
 */

function PortfolioContent() {
  const { heroState } = useCinematic();
  const [worldState, setWorldState] = useState<WorldState>(WorldController.getState());

  // Subscribe to WorldController
  useEffect(() => {
    return WorldController.subscribe(setWorldState);
  }, []);

  // Bridge: when Hero fires WORLD_TRANSITION → tell WorldController
  useEffect(() => {
    if (heroState === "WORLD_TRANSITION") {
      WorldController.beginHeroExit();
    }
    if (heroState === "DISCOVERY" || heroState === "BOOT") {
      WorldController.resetToHero();
    }
  }, [heroState]);

  const heroVisible =
    worldState.phase === "HERO" ||
    worldState.phase === "FLY_THROUGH";

  const compassOverlayVisible = worldState.phase === "CAREER_COMPASS";

  return (
    // Fixed root — fills the entire viewport. No scroll.
    <div className="fixed inset-0 overflow-hidden bg-[#050505]">
      <GlobalCinematicController />

      {/* ── Layer 0: 3D World Hub Canvas (always rendering) ── */}
      <div className="absolute inset-0 z-0">
        <WorldHubScene />
      </div>

      {/* ── Layer 10: Hero Overlay (fades out as visitor enters museum) ── */}
      <AnimatePresence>
        {heroVisible && (
          <motion.div
            key="hero-overlay"
            className="absolute inset-0 z-10"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: worldState.phase === "FLY_THROUGH" ? 1.6 : 0.4,
              ease: "easeInOut",
            }}
          >
            <HeroSection />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Layer 30: Career Compass Spatial HUD ── */}
      <AnimatePresence>
        {compassOverlayVisible && (
          <motion.div
            key="compass-overlay"
            className="absolute inset-0 z-30 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            <CompassOverlay />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  return (
    <CinematicProvider>
      <PortfolioContent />
    </CinematicProvider>
  );
}
