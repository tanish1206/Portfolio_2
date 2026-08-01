/**
 * WorldController.ts
 * Centralized state machine for the World Hub experience.
 * Controls camera phases, exhibit state, and progressive illumination.
 */

export type WorldPhase =
  | "HERO"              // Hero section active
  | "FLY_THROUGH"       // Particles surround camera (0 - 1.4s)
  | "DARK_TRAVERSE"     // Camera rushing through dark void (1.4s - 2.8s)
  | "FOG_APPEAR"        // Faint fog materializes (2.8s - 4.2s)
  | "FLOOR_REVEAL"      // Concrete floor slowly materializes (4.2s - 5.6s)
  | "SPOTLIGHT_ON"      // Red spotlight switches on (5.6s - 7.0s)
  | "PILLARS_FADE"      // Concrete pillars & dust fade into view (7.0s - 8.5s)
  | "MUSEUM_SETTLE"     // Large hall framed, camera slows toward compass (8.5s - 10.0s)
  | "MUSEUM_IDLE"       // Settled architectural exhibition room
  | "COMPASS_HOVER"     // Visitor hover over compass
  | "COMPASS_TRANSFORM" // Disassemble animation into project world
  | "CAREER_COMPASS"    // Inside Career Compass world
  | "RETURNING";        // Camera pull-back

export interface WorldState {
  phase: WorldPhase;
  unlockedExhibits: number;
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

    // Cinematic sequence timeline
    setTimeout(() => { this.state.phase = "DARK_TRAVERSE"; this.notify(); }, 1400);
    setTimeout(() => { this.state.phase = "FOG_APPEAR"; this.notify(); }, 2800);
    setTimeout(() => { this.state.phase = "FLOOR_REVEAL"; this.notify(); }, 4200);
    setTimeout(() => { this.state.phase = "SPOTLIGHT_ON"; this.notify(); }, 5600);
    setTimeout(() => { this.state.phase = "PILLARS_FADE"; this.notify(); }, 7000);
    setTimeout(() => { this.state.phase = "MUSEUM_SETTLE"; this.notify(); }, 8500);
    setTimeout(() => { this.state.phase = "MUSEUM_IDLE"; this.notify(); }, 10000);
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
