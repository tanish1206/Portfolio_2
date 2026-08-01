"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type CinematicPhase =
  | "IDLE"
  | "HOVER_READY"
  | "IDENTITY_UNLOCKED"
  | "CLICK_READY"
  | "PORTRAIT_ACKNOWLEDGED"
  | "ENTER_READY"
  | "TRANSITION_PREP"
  | "WORLD_TRANSITION"
  | "WORLD_ACTIVE";

interface CinematicContextType {
  phase: CinematicPhase;
  scrollProgress: number;
  setPhase: (phase: CinematicPhase) => void;
  setScrollProgress: (progress: number) => void;
  resetToHero: () => void;
}

const CinematicContext = createContext<CinematicContextType | undefined>(undefined);

export const CinematicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [phase, setPhase] = useState<CinematicPhase>("IDLE");
  const [scrollProgress, setScrollProgress] = useState(0);

  const resetToHero = () => {
    setPhase("IDLE");
    setScrollProgress(0);
  };

  return (
    <CinematicContext.Provider
      value={{
        phase,
        scrollProgress,
        setPhase,
        setScrollProgress,
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

