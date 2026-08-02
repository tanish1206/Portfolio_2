# Memory & Project State

## Project Overview
Cinematic Interactive Portfolio for Tanish Soni ([https://tanish-soni.vercel.app/](https://tanish-soni.vercel.app/)) built with Next.js 14, React Three Fiber / Three.js, GSAP, and Framer Motion.

## Core Philosophy & Design Guidelines
- **Not a portfolio, an interactive cinematic architectural space.**
- **Color Palette**: Primary Background (`#050505`), Secondary Background (`#101010`), Concrete Surface (`#1A1A1A`), Primary Text (`#FFFFFF`), Secondary Text (`#A8A8A8`), Primary Accent (`#B11226`), Hover Accent (`#D81E36`), Ambient Red (`rgba(177,18,38,0.15)`). (ZERO cyan or blue anywhere).
- **Aesthetics**: Dark minimal underground architectural museum, premium art gallery, luxury exhibition space.
- **Rule**: Objects become worlds. Worlds become stories. Lighting replaces navigation; curiosity replaces menus.

## Phase 3.5 Architectural World Hub Refinements
1. **Lowered Ceiling Proportion**: Ceiling slab, roof trusses, and spotlight housings lowered to **9.6m** height so they are naturally framed in the resting camera composition.
2. **Premium Dark PBR Stone Floor**: Honed dark stone slate surface (`#2A2627`, `roughness 0.22`, `metalness 0.42`), slate seams, and brass expansion joints (`#B89855`).
3. **Recessed Wall Bays & Alcoves**: Perimeter concrete wall panel divisions with recessed exhibition alcoves (`x: ±11.2m`) and dark steel I-beam framing.
4. **Grounded Monumental Pillars**: Thicker proportioned fluted concrete column shafts (`radius 0.90m`), square base plinths (`1.9m × 1.9m × 0.35m`), and steel capital brackets at `9.4m`.
5. **Layered Cinematic Lighting & Atmosphere**: Dominant deep red spotlight (`#B11226`), soft neutral white rim lights, warm ambient fill (`#D8C4B6`), low-lying ground fog, and volumetric red dust rays.
6. **Master GSAP ScrollTrigger Integration**: Smooth scrubbing across `600vh` scroll height driving 60 FPS 3D construction progress (`0.0` to `1.0`).

## Build Status
- Verified cleanly via end-to-end browser subagent testing on `http://localhost:3000`.
- Verified on Next.js 14 production build (`npm run build`).
