# Memory & Project State

## Project Overview
Cinematic Interactive Portfolio for Tanish Soni ([https://tanish-soni.vercel.app/](https://tanish-soni.vercel.app/)) built with Next.js 14, React Three Fiber / Three.js, GSAP, and Framer Motion.

## Core Philosophy & Design Guidelines
- **Not a portfolio, an interactive cinematic film.**
- **Color Palette**: Black (`#050505`), Charcoal (`#111111`), White (`#FFFFFF`), Deep Crimson Red (`#DC143C` / `#FF1E40`). (NO cyan, NO purple, NO blue, NO neon).
- **Aesthetics**: Apple, A24, luxury watch advertisement, architectural photography, dark minimal museum.
- **Rule**: Nothing simply appears. Everything transforms into something else.

## Identity Cycle
1. **Builder** (`/portraits/builder.png`) - Accent: `#DC143C`
2. **Hackathon Engineer** (`/portraits/hackathon.png`) - Accent: `#FF1E40`
3. **Full Stack Engineer** (`/portraits/fullstack.png`) - Accent: `#E60026`
4. **AI Engineer** (`/portraits/ai_engineer.png`) - Accent: `#FF2A4B`
5. **Founder** (`/portraits/founder.png`) - Accent: `#D91438`

## Architecture & Controllers
- **GlobalCinematicController**: Coordinates Hero timeline, Hero → World camera push & particle dissolve, scene transitions, and global state via GSAP & `CinematicContext`.
- **HeroSection**: Minimalist typography, overhead soft crimson spotlight, seamless borderless portrait blending into black, restrained 2.5° cursor tilt.
- **Interactive3DWorld**: Three.js WebGL canvas rendering atmospheric film dust particles, camera fly-through, and physical exhibit objects.

## Progress & Chat Summary
- **Hero Redesign Completed**: Built borderless portrait with soft edge feathering into pitch black, single overhead focused crimson spotlight, restrained mouse tilt, and 10-step transition sequence.
- **Build Status**: Passing cleanly on Next.js 14.2.35.
