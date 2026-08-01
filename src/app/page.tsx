"use client";

import React, { useState, useEffect } from "react";
import { Interactive3DWorld } from "@/components/canvas/Interactive3DWorld";
import { HeroSection } from "@/components/hero/HeroSection";
import { FloatingObjectsScene } from "@/components/world/FloatingObjectsScene";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { AchievementHall } from "@/components/achievements/AchievementHall";
import { ContactExperience } from "@/components/contact/ContactExperience";
import { PROJECTS, ProjectData } from "@/data/projects";
import { FloatingObject } from "@/data/objects";
import { motion } from "framer-motion";

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);
  const [isAchievementHallOpen, setIsAchievementHallOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Synchronize viewport scroll progress with GSAP & WebGL Three.js camera controller
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(1, Math.max(0, window.scrollY / totalHeight)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div className="relative min-h-screen w-full bg-background selection:bg-accent-blue selection:text-black">
      {/* Three.js 3D WebGL Camera Controller & Interactive Object Canvas */}
      <Interactive3DWorld
        scrollProgress={scrollProgress}
        onSelectObject={handleSelectObject}
      />

      {/* 1. Hero Section (Spotlight, Minimal Typography, 5-Identity Portrait Cycle) */}
      <div className="relative z-10">
        <HeroSection />
      </div>

      {/* Cinematic Transition Bridge */}
      <div className="relative z-10 my-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="h-[1px] w-64 bg-gradient-to-r from-transparent via-accent-blue/50 to-transparent"
        />
      </div>

      {/* 2. Interactive World (3D Floating Objects + Glassmorphic Cards) */}
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
