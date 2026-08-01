"use client";

import React, { useEffect } from "react";
import { useCinematic } from "@/context/CinematicContext";
import { WorldController } from "@/world/WorldController";

export const GlobalCinematicController: React.FC = () => {
  const { setScrollProgress } = useCinematic();

  // Sync window scroll progress to CinematicContext & WorldController
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      setScrollProgress(progress);
      WorldController.setConstructionProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setScrollProgress]);

  return null;
};
