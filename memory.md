# Memory & Project State

## Project Overview
Cinematic Interactive Portfolio for Tanish Soni ([https://tanish-soni.vercel.app/](https://tanish-soni.vercel.app/)) built with Next.js 14, React Three Fiber / Three.js, GSAP, and Framer Motion.

## Core Philosophy & Design Guidelines
- **Not a portfolio, an interactive cinematic architectural space.**
- **Color Palette**: Primary Background (`#050505`), Secondary Background (`#101010`), Concrete Surface (`#1A1A1A`), Primary Text (`#FFFFFF`), Secondary Text (`#A8A8A8`), Primary Accent (`#B11226`), Hover Accent (`#D81E36`), Ambient Red (`rgba(177,18,38,0.15)`). (ZERO cyan or blue anywhere).
- **Aesthetics**: Dark minimal underground architectural museum, premium art gallery, luxury exhibition space.
- **Rule**: Objects become worlds. Worlds become stories. Lighting replaces navigation; curiosity replaces menus.

## Phase 2 Architectural World Hub Implementation
1. **Hero Entrance Section**: Intact. Portrait dissolve leads into a fly-through particle transition.
2. **Underground Museum Environment (`WorldHubScene.tsx`)**: Polished black specular floor, concrete pillars, volumetric crimson dust particles, deep shadows.
3. **Sequential Lighting Controller (`LightingController.tsx` & `WorldHubController.ts`)**:
   - Exhibit 1: Mechanical Brass Compass (illuminated at start; everything else in darkness).
   - Return from Career Compass unlocks Exhibit 2: Smart Bento Box (Campus Bites), then Exhibit 3: Vintage Studio Mic (HookLabs), etc.
4. **Cinematographer Camera Controller (`CameraController.tsx`)**: Weighted lerp momentum, slow push, dolly, crane, orbit. Zero snapping.
5. **Mechanical Brass Compass (`BrassCompass3D.tsx`)**:
   - Detachable needle, openable glass bezel, fragmenting casing, synthesized Web Audio API sound feedback.
   - Click transformation dollys camera into 3D drawn light pathways.
6. **Career Compass 3D Reality (`CareerCompassWorld.tsx`)**: Interactive 3D trajectory lines, spatial octahedron nodes, HUD overlay, and seamless return vector back to World Hub.

## Build Status
- Verified cleanly on Next.js 14 production build (`npm run build`).
