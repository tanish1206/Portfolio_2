/**
 * WorldController.ts
 * Centralized state machine for the World Hub experience.
 * Controls camera phases, exhibit state, and progressive illumination.
 */

export type WorldPhase =
  | "HERO"              // Hero section active (0% progress)
  | "FLY_THROUGH"       // Particles & dark tunnel (0% - 10%)
  | "FLOOR_REVEAL"      // Floor assembling from particles outward (10% - 20%)
  | "PILLARS_FADE"      // Concrete pillars physically growing upward (20% - 35%)
  | "WALLS_BEAMS"       // Concrete walls extrude & steel beams lower (35% - 50%)
  | "SPOTLIGHT_ON"      // Red spotlights ignite sequentially (50% - 65%)
  | "ATMOSPHERE_EMERGENCE" // Volumetric fog & floating dust illuminate (65% - 80%)
  | "PEDESTAL_EMERGENCE"// Circular stone pedestal mechanically rises (80% - 90%)
  | "COMPASS_ASSEMBLY"  // Mechanical brass compass fragments fly & assemble (90% - 99%)
  | "MUSEUM_IDLE"       // World construction complete (100%), pure architectural silence
  | "COMPASS_HOVER"     // Visitor hover over compass
  | "COMPASS_TRANSFORM" // Disassemble animation into project world
  | "CAREER_COMPASS"    // Inside Career Compass world
  | "RETURNING";        // Camera pull-back

export interface WorldState {
  phase: WorldPhase;
  unlockedExhibits: number;
  hoveredExhibitId: string | null;
  activeProjectId: string | null;
  constructionProgress: number; // 0.0 to 1.0 normalized scroll progress
}

type WorldListener = (state: WorldState) => void;

class WorldControllerClass {
  private state: WorldState = {
    phase: "HERO",
    unlockedExhibits: 1,
    hoveredExhibitId: null,
    activeProjectId: null,
    constructionProgress: 0,
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

  /**
   * Directly updates normalized construction progress (0.0 to 1.0)
   * mapped from scroll movement.
   */
  setConstructionProgress(progress: number) {
    const p = Math.max(0, Math.min(1, progress));
    this.state.constructionProgress = p;

    if (this.state.phase === "CAREER_COMPASS" || this.state.phase === "COMPASS_TRANSFORM") {
      this.notify();
      return;
    }

    if (p === 0) {
      this.state.phase = "HERO";
    } else if (p <= 0.10) {
      this.state.phase = "FLY_THROUGH";
    } else if (p <= 0.20) {
      this.state.phase = "FLOOR_REVEAL";
    } else if (p <= 0.35) {
      this.state.phase = "PILLARS_FADE";
    } else if (p <= 0.50) {
      this.state.phase = "WALLS_BEAMS";
    } else if (p <= 0.65) {
      this.state.phase = "SPOTLIGHT_ON";
    } else if (p <= 0.80) {
      this.state.phase = "ATMOSPHERE_EMERGENCE";
    } else if (p <= 0.90) {
      this.state.phase = "PEDESTAL_EMERGENCE";
    } else if (p < 1.00) {
      this.state.phase = "COMPASS_ASSEMBLY";
    } else {
      this.state.phase = "MUSEUM_IDLE";
    }

    this.notify();
  }

  /** Called when user triggers auto-scroll or hero transition action */
  beginHeroExit() {
    if (this.state.constructionProgress > 0) return;
    this.setConstructionProgress(0.01);
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
      constructionProgress: 0,
    };
    this.notify();
  }
}

export const WorldController = new WorldControllerClass();
