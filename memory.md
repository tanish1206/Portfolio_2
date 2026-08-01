# Memory & Project State

## Project Overview
Cinematic Interactive Portfolio for Tanish Soni ([https://tanish-soni.vercel.app/](https://tanish-soni.vercel.app/)) built with Next.js 14, React Three Fiber / Three.js, GSAP, and Framer Motion.

## Core Philosophy & Design Guidelines
- **Not a portfolio, an interactive cinematic film.**
- **Color Palette**: Black, Charcoal, White, Deep Crimson Red. (NO cyan, NO purple, NO blue, NO neon).
- **Aesthetics**: Apple, A24, luxury watch advertisement, architectural photography, dark minimal museum.
- **Rule**: Nothing simply appears. Everything transforms into something else.

## Identity Cycle
1. **Builder** (`/portraits/builder.png`) - Accent: Deep Crimson Red
2. **Hackathon Engineer** (`/portraits/hackathon.png`)
3. **Full Stack Engineer** (`/portraits/fullstack.png`)
4. **AI Engineer** (`/portraits/ai_engineer.png`)
5. **Founder** (`/portraits/founder.png`)

## Architecture & Controllers
- **GlobalCinematicController**: Coordinates Hero timeline, Hero → World camera push & particle dissolve, scene transitions, and global state.
- **HeroSection**: Minimalist typography, overhead soft crimson spotlight, seamless borderless portrait blending into black, restrained 2-3° cursor tilt.
- **Interactive3DWorld**: Three.js WebGL canvas for particle dissolution, volumetric dust/fog, and 3D exhibit objects (Compass, Coffee Cup, Microphone, Key, Notebook, Trophy, Phone).

## Progress & Chat Summary
- **Current Milestone**: Hero Redesign & Global Cinematic Controller Architecture.
- **Uploaded Assets**: All 5 high-res portrait photos mapped cleanly in `public/portraits/` (`builder.png`, `hackathon.png`, `fullstack.png`, `ai_engineer.png`, `founder.png`).
- **Build Status**: Passing cleanly on Next.js 14.2.35.
