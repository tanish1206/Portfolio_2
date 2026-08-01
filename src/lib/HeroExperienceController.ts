export type HeroState =
  | "BOOT"
  | "IDLE"
  | "DISCOVERY"
  | "READY_TO_ENTER"
  | "TRANSITION_PREP"
  | "WORLD_TRANSITION"
  | "WORLD";

export type HeroListener = (state: HeroState, identityIndex: number) => void;

class HeroExperienceControllerClass {
  private currentState: HeroState = "BOOT";
  private currentIdentityIndex: number = 0;
  private isHovered: boolean = false;
  private hoverTimer: NodeJS.Timeout | null = null;
  private listeners: Set<HeroListener> = new Set();
  private hasDiscoveredFirstIdentity: boolean = false;
  private isTransitioning: boolean = false;

  public subscribe(listener: HeroListener): () => void {
    this.listeners.add(listener);
    // Notify immediate current state upon subscription
    listener(this.currentState, this.currentIdentityIndex);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.currentState, this.currentIdentityIndex));
  }

  public getState(): HeroState {
    return this.currentState;
  }

  public getIdentityIndex(): number {
    return this.currentIdentityIndex;
  }

  public hasDiscovered(): boolean {
    return this.hasDiscoveredFirstIdentity;
  }

  public initialize() {
    if (this.currentState !== "BOOT") return;
    
    // Preload image assets
    if (typeof window !== "undefined") {
      const images = [
        "/portraits/builder2.jpeg",
        "/portraits/hackathon builder2.png",
        "/portraits/full stack engineer2.jpeg",
        "/portraits/ai engineer2.jpeg",
        "/portraits/founder2.jpeg",
      ];
      images.forEach((src) => {
        const img = new window.Image();
        img.src = src;
      });
    }

    // Transition BOOT -> DISCOVERY
    this.currentState = "DISCOVERY";
    this.notify();
  }

  public onHoverEnter() {
    if (
      this.isTransitioning ||
      this.currentState === "TRANSITION_PREP" ||
      this.currentState === "WORLD_TRANSITION" ||
      this.currentState === "WORLD"
    ) {
      return;
    }

    if (this.isHovered) return;
    this.isHovered = true;

    // Clear existing timer if any
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }

    // Immediately acknowledge hover state; schedule photo advance after 350ms
    this.hoverTimer = setTimeout(() => {
      if (this.isHovered) {
        this.advanceIdentity();
      }
    }, 350);
  }

  public onHoverLeave() {
    this.isHovered = false;
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
  }

  public advanceIdentity() {
    // One hover session equals ONE transition
    this.currentIdentityIndex = (this.currentIdentityIndex + 1) % 5;
    this.hasDiscoveredFirstIdentity = true;

    if (this.currentState === "DISCOVERY" || this.currentState === "BOOT" || this.currentState === "IDLE") {
      this.currentState = "READY_TO_ENTER";
    }

    this.notify();
  }

  public unlockScroll() {
    if (this.currentState === "DISCOVERY") {
      this.currentState = "READY_TO_ENTER";
      this.notify();
    }
  }

  public prepareTransition(): boolean {
    if (this.currentState !== "READY_TO_ENTER" || this.isTransitioning) {
      return false;
    }

    this.isTransitioning = true;
    this.currentState = "TRANSITION_PREP";
    this.notify();

    // 1.5s preparation pause (camera push, spotlight tightening, portrait freeze)
    setTimeout(() => {
      this.isTransitioning = false;
    }, 1500);

    return true;
  }

  public startTransition(): boolean {
    if (this.currentState !== "TRANSITION_PREP" || this.isTransitioning) {
      return false;
    }

    this.isTransitioning = true;
    this.currentState = "WORLD_TRANSITION";
    this.notify();

    // 10-12s full cinematic sequence timeline
    setTimeout(() => {
      this.currentState = "WORLD";
      this.isTransitioning = false;
      this.notify();
    }, 10000);

    return true;
  }

  public reset() {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
    this.isHovered = false;
    this.isTransitioning = false;
    this.currentState = "DISCOVERY";
    this.notify();
  }
}

export const HeroExperienceController = new HeroExperienceControllerClass();
