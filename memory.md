# Memory & Project State

## Project Overview
Cinematic Interactive Portfolio for Tanish Soni ([https://tanish-soni.vercel.app/](https://tanish-soni.vercel.app/)) built with Next.js 14, React Three Fiber / Three.js, GSAP, and Framer Motion.

## Core Philosophy & Design Guidelines
- **Not a portfolio, an interactive cinematic film.**
- **Color Palette**: Black (`#050505`), Charcoal (`#111111`), White (`#FFFFFF`), Deep Crimson Red (`#c8281f` / `#DC143C` / `#FF1E40`). (NO cyan, NO purple, NO blue, NO neon).
- **Aesthetics**: Apple, A24, luxury watch advertisement, architectural photography, dark minimal museum.
- **Rule**: Nothing simply appears. Everything transforms into something else.

<<<<<<< HEAD
## Exact Hero Visual Layout (Matched from Reference Image)
1. **Top-Left Header**: `AI ENGINEER` / `FULL STACK DEVELOPER` / `HACKATHON BUILDER` / `PRODUCT BUILDER` + red accent bar (hidden on mobile `<640px`).
2. **Top-Right Header**: `01` / `BEGINNING` + red accent bar (hidden on mobile `<640px`).
3. **Left Margin**: Vertical `TANISH SONI` text with red glowing dot.
4. **Right Margin**: Vertical `BUILDING IDEAS INTO REALITY.` text with red glowing dot.
5. **Overhead Spotlight**: Dramatic top-center crimson radial beam shining down on head & shoulders.
6. **Center Title**: Large wide-tracked `TANISH` (White) `SONI` (Crimson Red `#c8281f`) overlapping chest level.
7. **Divider**: Horizontal line with central red cross symbol `✦`.
8. **Subtitle**: `BUILDING IDEAS INTO REALITY.` flanked by micro code snippets.
9. **Scroll Cue**: `[ SCROLL TO BEGIN ]` in bracketed red text with vertical indicator line.

## Technical Specifications
- **GSAP Timeline**: `gsap.timeline()` drives ~1.0s identity transition: Glitch Jitter (180ms) → Dissolve & Blur out (200ms) → Asset Swap → Reconstruct Blur-to-Sharp & Fade In (320ms).
- **Accessibility & Motion**: Supports `prefers-reduced-motion` (disables parallax and glitch, uses simple crossfade).
- **Mobile Responsiveness**: Scales name & portrait (`w-[420px] h-[520px]` on desktop), hides side HUD labels on small viewports, supports touch/tap triggers.
- **Return Scroll Restoration**: Automatically restores Hero state (`HERO_IDLE`) when user scrolls back to the top of the page.
=======
## Identity Cycle
1. **Builder** (`/portraits/builder.png`) - Accent: `#DC143C`
2. **Hackathon Engineer** (`/portraits/hackathon.png`) - Accent: `#FF1E40`
3. **Full Stack Engineer** (`/portraits/fullstack.png`) - Accent: `#E60026`
4. **AI Engineer** (`/portraits/ai_engineer.png`) - Accent: `#FF2A4B`
5. **Founder** (`/portraits/founder.png`) - Accent: `#D91438`
>>>>>>> parent of bbef668 (.)

## Architecture & Controllers
- **GlobalCinematicController**: Coordinates Hero timeline, Hero → World camera push & particle dissolve, scene transitions, and global state via GSAP & `CinematicContext`.
- **HeroSection**: Minimalist typography, overhead soft crimson spotlight, seamless borderless portrait blending into black, restrained 2.5° cursor tilt.
- **Interactive3DWorld**: Three.js WebGL canvas rendering atmospheric film dust particles, camera fly-through, and physical exhibit objects.

## Progress & Chat Summary
<<<<<<< HEAD
- **Refactored Hero Component**: Integrated GSAP timeline, comment block documentation, mobile responsiveness, touch triggers, and return scroll restoration.
=======
- **Hero Redesign Completed**: Built borderless portrait with soft edge feathering into pitch black, single overhead focused crimson spotlight, restrained mouse tilt, and 10-step transition sequence.
>>>>>>> parent of bbef668 (.)
- **Build Status**: Passing cleanly on Next.js 14.2.35.
