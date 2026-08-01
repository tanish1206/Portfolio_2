"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { HeroExperienceController, HeroState } from "@/lib/HeroExperienceController";

interface CinematicContextType {
  heroState: HeroState;
  identityIndex: number;
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
  resetToHero: () => void;
}

const CinematicContext = createContext<CinematicContextType | undefined>(undefined);

export const CinematicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [heroState, setHeroState] = useState<HeroState>(HeroExperienceController.getState());
  const [identityIndex, setIdentityIndex] = useState<number>(HeroExperienceController.getIdentityIndex());
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    HeroExperienceController.initialize();
    const unsubscribe = HeroExperienceController.subscribe((state, index) => {
      setHeroState(state);
      setIdentityIndex(index);
    });
    return () => unsubscribe();
  }, []);

  const resetToHero = () => {
    HeroExperienceController.reset();
    setScrollProgress(0);
  };

  return (
    <CinematicContext.Provider
      value={{
        heroState,
        identityIndex,
        scrollProgress,
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
