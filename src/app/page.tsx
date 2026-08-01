"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroSection } from "@/components/hero/HeroSection";
import { CinematicProvider, useCinematic } from "@/context/CinematicContext";
import { GlobalCinematicController } from "@/components/cinematic/GlobalCinematicController";
import { WorldHubScene } from "@/world/WorldHub/WorldHubScene";
import { WorldController, WorldState } from "@/world/WorldController";
import { CompassOverlay } from "@/world/Compass/CompassOverlay";

function PortfolioContent() {
  const { heroState } = useCinematic();
  const [worldState, setWorldState] = useState<WorldState>(WorldController.getState());

  useEffect(() => {
    return WorldController.subscribe(setWorldState);
  }, []);

  // Sync Hero transition trigger directly to WorldController
  useEffect(() => {
    if (heroState === "WORLD_TRANSITION" || heroState === "WORLD") {
      if (worldState.phase === "HERO") {
        WorldController.beginHeroExit();
      }
    }
    if (heroState === "DISCOVERY" || heroState === "BOOT" || heroState === "IDLE") {
      if (worldState.phase !== "HERO") {
        WorldController.resetToHero();
      }
    }
  }, [heroState, worldState.phase]);

  const heroVisible =
    worldState.phase === "HERO" ||
    worldState.phase === "FLY_THROUGH";

  const compassOverlayVisible = worldState.phase === "CAREER_COMPASS";

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#050505]">
      <GlobalCinematicController />

      {/* Layer 0: Persistent 3D React Three Fiber World Hub Canvas */}
      <div className="absolute inset-0 z-0">
        <WorldHubScene />
      </div>

      {/* Layer 10: Hero Section Overlay */}
      <AnimatePresence>
        {heroVisible && (
          <motion.div
            key="hero-overlay"
            className="absolute inset-0 z-10"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: worldState.phase === "FLY_THROUGH" ? 1.5 : 0.4,
              ease: "easeInOut",
            }}
          >
            <HeroSection />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layer 30: Career Compass Spatial HUD */}
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
