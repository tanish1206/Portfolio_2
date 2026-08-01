"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type CinematicPhase =
  | "HERO_IDLE"
  | "HERO_FREEZE"
  | "HERO_PUSH"
  | "PARTICLE_DISSOLVE"
  | "FLY_THROUGH"
  | "WORLD_ASSEMBLE"
  | "WORLD_ACTIVE";

interface CinematicContextType {
  phase: CinematicPhase;
  scrollProgress: number;
  setPhase: (phase: CinematicPhase) => void;
  setScrollProgress: (progress: number) => void;
  beginWorldTransition: () => void;
  resetToHero: () => void;
}

const CinematicContext = createContext<CinematicContextType | undefined>(undefined);

export const CinematicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [phase, setPhase] = useState<CinematicPhase>("HERO_IDLE");
  const [scrollProgress, setScrollProgress] = useState(0);

  const beginWorldTransition = () => {
    if (phase !== "HERO_IDLE") return;
    setPhase("HERO_FREEZE");
  };

  const resetToHero = () => {
    setPhase("HERO_IDLE");
    setScrollProgress(0);
  };

  return (
    <CinematicContext.Provider
      value={{
        phase,
        scrollProgress,
        setPhase,
        setScrollProgress,
        beginWorldTransition,
        resetToHero,
      }}
    >
      {children}
    </CinematicContext.Provider>
  );
};

export const useCinematic = () => {
  const context = useContext(CinematicContext);
  if (!context) {
    throw new Error("useCinematic must be used within a CinematicProvider");
  }
  return context;
};
