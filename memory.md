# Memory & Project State

## Project Overview
Cinematic Interactive Portfolio for Tanish Soni ([https://tanish-soni.vercel.app/](https://tanish-soni.vercel.app/)) built with Next.js 14, React Three Fiber / Three.js, GSAP, and Framer Motion.

## Core Philosophy & Design Guidelines
- **Not a portfolio, an interactive cinematic architectural space.**
- **Color Palette**: Primary Background (`#050505`), Secondary Background (`#101010`), Concrete Surface (`#1A1A1A`), Primary Text (`#FFFFFF`), Secondary Text (`#A8A8A8`), Primary Accent (`#B11226`), Hover Accent (`#D81E36`), Ambient Red (`rgba(177,18,38,0.15)`). (ZERO cyan or blue anywhere).
- **Aesthetics**: Dark minimal underground architectural museum, premium art gallery, luxury exhibition space.
- **Rule**: Objects become worlds. Worlds become stories. Lighting replaces navigation; curiosity replaces menus.

## Phase 3 Architectural World Hub Implementation
1. **Hero Section Mouse Hover Transition**: Instantaneous `100ms` hover trigger on central portrait image. Hovering mouse moves identity role & portrait seamlessly. Zero automatic auto-cycling on idle.
2. **Master GSAP ScrollTrigger Integration**: Smooth scrubbing timeline across `600vh` container driving normalized 3D construction progress (`0.0` to `1.0`).
3. **Monumental Industrial Exhibition Hall (`Museum.tsx`)**:
   - Proportions: 28m wide × 46m long × 14m high.
   - 0–10%: Void dissolve & red particle tunnel.
   - 10–20%: Polished dark concrete floor grows outward physically with brass seam grid lines (`#B89855`).
   - 20–35%: 10 monumental fluted concrete pillars (`14m tall`) with square base plinths and steel capital brackets rise vertically in a staggered sequence with falling construction dust.
   - 35–50%: Concrete wall panels & dark steel I-beams extrude upward to enclose boundaries.
   - 50–65%: Overhead steel roof trusses & ceiling slab seal top volume; industrial spotlight fixtures descend.
   - 65–75%: 5 Deep Cinematic Red (`#B11226`) spotlights ignite sequentially; soft white rim lights activate; floor specular reflections bloom.
   - 75–85%: Particle volumetric red light rays pierce through atmospheric fog; ground fog & dust particles drift naturally.
   - 85–95%: Steel stanchion barriers, secondary gallery plinths, floor seam plates, and cable conduits solidify realism.
   - 95–100%: Central circular stone pedestal mechanically rises; Mechanical Brass Compass fragments assemble on top; spotlight narrows.
4. **Cinematographer Camera Controller (`WorldCamera.tsx`)**: Waypoints tracking floor -> pillars -> walls -> ceiling -> lighting -> fog -> props -> pedestal settlement. Zero snapping.
5. **Strict Color Palette**: Deep Red (`#B11226`), Neutral White (`#EAEAEA`), Soft Warm Indirect Concrete Ambient (`#D8C4B6`). Zero blue/cyan.

## Build Status
- Driven by master GSAP ScrollTrigger timeline.
- Verified cleanly via end-to-end browser subagent testing on `http://localhost:3000`.
- Verified on Next.js 14 production build (`npm run build`).
