/**
 * WorldController.ts
 * Centralized state machine for the World Hub experience.
 * Controls camera phases, exhibit state, and progressive illumination.
 */

export type WorldPhase =
  | "HERO"            // Hero section is showing, canvas is parked behind
  | "FLY_THROUGH"     // Particle tunnel transition from Hero
  | "MUSEUM_ENTER"    // Camera flies into the museum hall — slow crane down
  | "MUSEUM_SETTLE"   // Camera slows, finds focal point on the Compass
  | "MUSEUM_IDLE"     // Visitor inside the museum, Compass illuminated, everything else dark
  | "COMPASS_HOVER"   // Visitor hovers over compass
  | "COMPASS_TRANSFORM" // Compass disassembles into Career Compass world
  | "CAREER_COMPASS"  // Inside Career Compass project world
  | "RETURNING";      // Camera pulls back to museum after exiting project world

export interface WorldState {
  phase: WorldPhase;
  unlockedExhibits: number;      // Starts at 1 (only compass). Grows as visitor explores.
  hoveredExhibitId: string | null;
  activeProjectId: string | null;
}

type WorldListener = (state: WorldState) => void;

class WorldControllerClass {
  private state: WorldState = {
    phase: "HERO",
    unlockedExhibits: 1,
    hoveredExhibitId: null,
    activeProjectId: null,
  };

  private listeners = new Set<WorldListener>();

  subscribe(listener: WorldListener): () => void {
    this.listeners.add(listener);
    listener({ ...this.state });
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const snap = { ...this.state };
    this.listeners.forEach((l) => l(snap));
  }

  getState(): WorldState {
    return { ...this.state };
  }

  /** Called from HeroExperienceController when WORLD_TRANSITION fires */
  beginHeroExit() {
    if (this.state.phase !== "HERO") return;
    this.state.phase = "FLY_THROUGH";
    this.notify();

    // After particle tunnel (~2s), begin museum reveal
    setTimeout(() => {
      this.state.phase = "MUSEUM_ENTER";
      this.notify();
    }, 2000);

    // After crane-in (~3s more), begin settle
    setTimeout(() => {
      this.state.phase = "MUSEUM_SETTLE";
      this.notify();
    }, 5000);

    // Final idle settle — visitor is free to explore
    setTimeout(() => {
      this.state.phase = "MUSEUM_IDLE";
      this.notify();
    }, 8200);
  }

  setHovered(id: string | null) {
    this.state.hoveredExhibitId = id;
    this.notify();
  }

  beginCompassTransform() {
    if (this.state.phase !== "MUSEUM_IDLE" && this.state.phase !== "COMPASS_HOVER") return;
    this.state.phase = "COMPASS_TRANSFORM";
    this.state.activeProjectId = "career-compass";
    this.notify();

    setTimeout(() => {
      this.state.phase = "CAREER_COMPASS";
      this.notify();
    }, 2600);
  }

  returnToMuseum() {
    this.state.phase = "RETURNING";
    this.state.activeProjectId = null;
    this.notify();

    // Unlock next exhibit when returning
    if (this.state.unlockedExhibits < 7) {
      this.state.unlockedExhibits += 1;
    }

    setTimeout(() => {
      this.state.phase = "MUSEUM_IDLE";
      this.notify();
    }, 2200);
  }

  resetToHero() {
    this.state = {
      phase: "HERO",
      unlockedExhibits: 1,
      hoveredExhibitId: null,
      activeProjectId: null,
    };
    this.notify();
  }
}

export const WorldController = new WorldControllerClass();
