# Architecture Specification

## Vision
An interactive cinematic film experience (not a traditional portfolio website).

## Tech Stack
- Next.js 14 (App Router)
- React 18 & TypeScript
- Tailwind CSS (Crimson & Charcoal Design Tokens)
- GSAP (Cinematic Timelines & Camera Transitions)
- Framer Motion (Micro-interactions)
- React Three Fiber / Three.js (WebGL 3D Interactive World & Particle Dissolve Shaders)

## Controller Architecture
- **GlobalCinematicController**: Coordinates Hero timeline, Hero → World transition, camera orchestration, scene transitions, and global animation state.
- **HeroSection**: Minimalist typography, overhead soft crimson spotlight, seamless borderless portrait blending into black, restrained 2-3° cursor tilt.
- **Interactive3DWorld**: 3D Canvas rendering atmospheric dust particles, camera fly-through, and physical exhibit objects.

## User Flow
Hero → Scroll Trigger → Freeze & Focus → Crimson Fade → Particle Dissolve → Camera Fly-Through → Dark Architectural 3D World → Exhibit Discovery → Contact Experience
