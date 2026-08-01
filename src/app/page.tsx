"use client";

import React, { useEffect, useState } from "react";
import { Interactive3DWorld } from "@/components/canvas/Interactive3DWorld";
import { HeroSection } from "@/components/hero/HeroSection";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { AchievementHall } from "@/components/achievements/AchievementHall";
import { ContactExperience } from "@/components/contact/ContactExperience";
import { PROJECTS, ProjectData } from "@/data/projects";
import { CinematicProvider, useCinematic } from "@/context/CinematicContext";
import { GlobalCinematicController } from "@/components/cinematic/GlobalCinematicController";
import { WorldHubController, WorldHubState } from "@/cinematic/controllers/WorldHubController";
import { CareerCompassWorldOverlay } from "@/cinematic/Objects/CareerCompass/CareerCompassWorld";

function PortfolioContent() {
  const { scrollProgress, heroState } = useCinematic();
  const [hubState, setHubState] = useState<WorldHubState>(WorldHubController.getState());
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);
  const [isAchievementHallOpen, setIsAchievementHallOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = WorldHubController.subscribe((state) => {
      setHubState(state);
    });
    return () => unsubscribe();
  }, []);

  // Update World Hub controller when Hero transition triggers
  useEffect(() => {
    if (heroState === "WORLD_TRANSITION" || heroState === "WORLD" || scrollProgress > 0.05) {
      if (hubState.viewMode === "HERO") {
        WorldHubController.enterWorldHubFromHero();
      }
    }
  }, [heroState, scrollProgress, hubState.viewMode]);

  return (
    <div className="relative min-h-screen w-full bg-[#050505] selection:bg-[#B11226] selection:text-white">
      <GlobalCinematicController />

      {/* Interactive 3D WebGL World Hub & Career Compass Canvas */}
      <Interactive3DWorld scrollProgress={scrollProgress} onSelectObject={() => {}} />

      {/* 1. Hero Entrance Section (Spotlight & Portrait Entrance) */}
      <div
        className={`relative z-10 transition-opacity duration-1000 ${
          hubState.viewMode === "CAREER_COMPASS_WORLD" || hubState.viewMode === "PROJECT_WORLD"
            ? "pointer-events-none opacity-0"
            : "opacity-100"
        }`}
      >
        <HeroSection />
      </div>

      {/* 2. Career Compass 3D Reality Spatial Overlay */}
      {hubState.viewMode === "CAREER_COMPASS_WORLD" && <CareerCompassWorldOverlay />}

      {/* Legacy Modals for auxiliary exhibits if opened */}
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />

      <AchievementHall
        isOpen={isAchievementHallOpen}
        onClose={() => setIsAchievementHallOpen(false)}
      />

      <ContactExperience
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
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
