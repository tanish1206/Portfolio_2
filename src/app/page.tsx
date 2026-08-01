"use client";

import React, { useState } from "react";
import { Interactive3DWorld } from "@/components/canvas/Interactive3DWorld";
import { HeroSection } from "@/components/hero/HeroSection";
import { FloatingObjectsScene } from "@/components/world/FloatingObjectsScene";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { AchievementHall } from "@/components/achievements/AchievementHall";
import { ContactExperience } from "@/components/contact/ContactExperience";
import { PROJECTS, ProjectData } from "@/data/projects";
import { FloatingObject } from "@/data/objects";
import { motion } from "framer-motion";
import { CinematicProvider, useCinematic } from "@/context/CinematicContext";
import { GlobalCinematicController } from "@/components/cinematic/GlobalCinematicController";

function PortfolioContent() {
  const { scrollProgress } = useCinematic();
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);
  const [isAchievementHallOpen, setIsAchievementHallOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleSelectObject = (obj: FloatingObject) => {
    if (!obj) return;
    if (obj.targetWorld === "achievements") {
      setIsAchievementHallOpen(true);
    } else if (obj.targetWorld === "contact" || obj.targetWorld === "about-me") {
      setIsContactOpen(true);
    } else if (PROJECTS[obj.targetWorld]) {
      setActiveProject(PROJECTS[obj.targetWorld]);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-background selection:bg-accent-crimson selection:text-white">
      <GlobalCinematicController />

      {/* 3D WebGL Camera Controller & Interactive Object Canvas */}
      <Interactive3DWorld
        scrollProgress={scrollProgress}
        onSelectObject={handleSelectObject}
      />

      {/* 1. Hero Section (Spotlight, Minimal Typography, Borderless Portrait) */}
      <div className="relative z-10">
        <HeroSection />
      </div>

      {/* Cinematic Transition Bridge */}
      <div className="relative z-10 my-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="h-[1px] w-48 bg-gradient-to-r from-transparent via-accent-crimson/50 to-transparent"
        />
      </div>

      {/* 2. Interactive World (3D Floating Objects + Exhibits) */}
      <div className="relative z-10">
        <FloatingObjectsScene onSelectObject={handleSelectObject} />
      </div>

      {/* Story-Worlds & Modals */}
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

      {/* Minimal Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-xs text-text-muted font-mono">
        <p>© 2026 Tanish Soni • Cinematic Interactive Web Experience • Built with Next.js 14, Three.js & GSAP</p>
      </footer>
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
