"use client";

import React, { useState, useEffect } from "react";
import { WebGLCanvas } from "@/components/canvas/WebGLCanvas";
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

  // Track window scroll progress for WebGL particle drift & camera transition
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(window.scrollY / totalHeight);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSelectObject = (obj: FloatingObject) => {
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
      {/* 3D WebGL Canvas Background */}
      <WebGLCanvas scrollProgress={scrollProgress} />

      {/* 1. Hero Section (Pure Black, Spotlight, Identity Portrait Cycle) */}
      <HeroSection />

      {/* Cinematic Transition Bridge Divider */}
      <div className="relative z-10 my-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="h-[1px] w-48 bg-gradient-to-r from-transparent via-accent-blue/40 to-transparent"
        />
      </div>

      {/* 2. Interactive Floating Objects Universe */}
      <FloatingObjectsScene onSelectObject={handleSelectObject} />

      {/* Modals & Story Worlds */}
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
        <p>© 2026 Tanish Soni • Cinematic Interactive Experience • Built with Next.js, Three.js & GSAP</p>
      </footer>
    </div>
  );
}
