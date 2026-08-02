"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroSection } from "@/components/hero/HeroSection";
import { CinematicProvider, useCinematic } from "@/context/CinematicContext";
import { GlobalCinematicController } from "@/components/cinematic/GlobalCinematicController";
import { WorldHubScene } from "@/world/WorldHub/WorldHubScene";
import { WorldController, WorldState } from "@/world/WorldController";
import { CompassOverlay } from "@/world/Compass/CompassOverlay";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function PortfolioContent() {
  const { heroState } = useCinematic();
  const [worldState, setWorldState] = useState<WorldState>(WorldController.getState());
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    return WorldController.subscribe(setWorldState);
  }, []);

  // GSAP ScrollTrigger timeline driving master construction progress
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
        onUpdate: (self) => {
          WorldController.setConstructionProgress(self.progress);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Sync Hero state trigger to WorldController
  useEffect(() => {
    if (heroState === "WORLD_TRANSITION" || heroState === "WORLD") {
      if (worldState.constructionProgress === 0) {
        WorldController.beginHeroExit();
      }
    }
    if (heroState === "DISCOVERY" || heroState === "BOOT" || heroState === "IDLE") {
      if (worldState.constructionProgress > 0 && worldState.phase === "HERO") {
        WorldController.resetToHero();
      }
    }
  }, [heroState, worldState.constructionProgress, worldState.phase]);

  // Hero overlay dissolves during initial 12% of scroll construction
  const heroVisible = worldState.constructionProgress <= 0.12 && worldState.phase !== "CAREER_COMPASS";

  // Career Compass Spatial HUD only inside Career Compass world phase
  const compassOverlayVisible = worldState.phase === "CAREER_COMPASS";

  return (
    <div ref={containerRef} className="relative min-h-[600vh] w-full bg-[#050505] selection:bg-accent-crimson selection:text-white">
      <GlobalCinematicController />

      {/* Layer 0: Persistent 3D R3F Canvas Fixed to Viewport */}
      <div className="fixed inset-0 z-0">
        <WorldHubScene />
      </div>

      {/* Layer 10: Hero Section Overlay (Dissolves as scroll construction begins) */}
      <AnimatePresence>
        {heroVisible && (
          <motion.div
            key="hero-overlay"
            className="fixed inset-0 z-10 pointer-events-auto"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 - (worldState.constructionProgress / 0.12) }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
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
            className="fixed inset-0 z-30 pointer-events-none"
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
