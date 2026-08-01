export type WorldViewMode =
  | "HERO"
  | "WORLD_HUB"
  | "TRANSITIONING_TO_PROJECT"
  | "CAREER_COMPASS_WORLD"
  | "PROJECT_WORLD"
  | "RETURNING_TO_HUB";

export interface WorldHubState {
  viewMode: WorldViewMode;
  unlockedCount: number; // Starts at 1 (Compass only)
  activeExhibitId: string | null;
  transformingExhibitId: string | null;
}

type WorldHubListener = (state: WorldHubState) => void;

class WorldHubControllerClass {
  private state: WorldHubState = {
    viewMode: "HERO",
    unlockedCount: 1, // Only exhibit 1 (Compass) illuminated at start
    activeExhibitId: "compass",
    transformingExhibitId: null,
  };

  private listeners: Set<WorldHubListener> = new Set();

  public subscribe(listener: WorldHubListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l({ ...this.state }));
  }

  public getState(): WorldHubState {
    return { ...this.state };
  }

  public setViewMode(mode: WorldViewMode) {
    this.state.viewMode = mode;
    this.notify();
  }

  public enterWorldHubFromHero() {
    this.state.viewMode = "WORLD_HUB";
    this.notify();
  }

  public initiateExhibitTransformation(exhibitId: string) {
    this.state.transformingExhibitId = exhibitId;
    this.state.viewMode = "TRANSITIONING_TO_PROJECT";
    this.notify();

    // After transformation animation finishes, enter full project world
    setTimeout(() => {
      if (exhibitId === "compass") {
        this.state.viewMode = "CAREER_COMPASS_WORLD";
      } else {
        this.state.viewMode = "PROJECT_WORLD";
      }
      this.state.activeExhibitId = exhibitId;
      this.state.transformingExhibitId = null;
      this.notify();
    }, 1600);
  }

  public returnToWorldHub() {
    this.state.viewMode = "RETURNING_TO_HUB";
    this.notify();

    // Unlock the next exhibit in sequence if returning from active exhibit
    if (this.state.activeExhibitId === "compass" && this.state.unlockedCount < 2) {
      this.state.unlockedCount = 2; // Unlock Bento Box
    } else if (this.state.activeExhibitId === "bento" && this.state.unlockedCount < 3) {
      this.state.unlockedCount = 3; // Unlock Mic
    } else if (this.state.activeExhibitId === "mic" && this.state.unlockedCount < 4) {
      this.state.unlockedCount = 4; // Unlock Key
    } else if (this.state.activeExhibitId === "key" && this.state.unlockedCount < 5) {
      this.state.unlockedCount = 5; // Unlock Workbench
    } else if (this.state.activeExhibitId === "workbench" && this.state.unlockedCount < 6) {
      this.state.unlockedCount = 6; // Unlock Trophy
    } else if (this.state.activeExhibitId === "trophy" && this.state.unlockedCount < 7) {
      this.state.unlockedCount = 7; // Unlock Letter
    }

    setTimeout(() => {
      this.state.viewMode = "WORLD_HUB";
      this.state.activeExhibitId = null;
      this.notify();
    }, 1200);
  }

  public focusExhibit(exhibitId: string) {
    this.state.activeExhibitId = exhibitId;
    this.notify();
  }
}

export const WorldHubController = new WorldHubControllerClass();
