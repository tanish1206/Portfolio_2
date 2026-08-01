export interface FloatingObject {
  id: string;
  name: string;
  symbol: string;
  targetWorld: string;
  shortDesc: string;
  accentColor: string;
  position: [number, number, number]; // 3D coordinates [x, y, z] in the Museum World Hub
  scale: number;
}

export const FLOATING_OBJECTS: FloatingObject[] = [
  {
    id: "compass",
    name: "Mechanical Brass Compass",
    symbol: "🧭",
    targetWorld: "career-compass",
    shortDesc: "Career Compass — AI Guidance & Career Pathway Engine",
    accentColor: "#B11226",
    position: [0, 0, 0], // Center exhibit 1
    scale: 1.2,
  },
  {
    id: "bento",
    name: "Smart Bento Box",
    symbol: "🍱",
    targetWorld: "campus-bites",
    shortDesc: "Campus Bites — Predictive Campus Dining Analytics",
    accentColor: "#D81E36",
    position: [4.5, 0.5, -3.5], // Exhibit 2
    scale: 1.1,
  },
  {
    id: "mic",
    name: "Vintage Studio Microphone",
    symbol: "🎙️",
    targetWorld: "hooklabs",
    shortDesc: "HookLabs — AI Audio & Viral Hook Generator",
    accentColor: "#B11226",
    position: [-4.5, 0.5, -3.5], // Exhibit 3
    scale: 1.1,
  },
  {
    id: "key",
    name: "Brass Key",
    symbol: "🔑",
    targetWorld: "rentlens",
    shortDesc: "RentLens — AI Blueprint & Property Valuation",
    accentColor: "#D81E36",
    position: [8.0, 1.0, -7.0], // Exhibit 4
    scale: 1.1,
  },
  {
    id: "workbench",
    name: "Engineer's Workbench",
    symbol: "🛠️",
    targetWorld: "about-me",
    shortDesc: "About Me — Engineering Journey, Mindset & Philosophy",
    accentColor: "#B11226",
    position: [-8.0, 1.0, -7.0], // Exhibit 5
    scale: 1.2,
  },
  {
    id: "trophy",
    name: "Crystal Trophy",
    symbol: "🏆",
    targetWorld: "achievements",
    shortDesc: "Achievements — ISRO Milestone, Hackathons & Honors",
    accentColor: "#D81E36",
    position: [11.5, 1.5, -10.5], // Exhibit 6
    scale: 1.2,
  },
  {
    id: "letter",
    name: "Wax-Sealed Letter",
    symbol: "✉️",
    targetWorld: "contact",
    shortDesc: "Contact — Initiate Collaboration & Direct Line",
    accentColor: "#B11226",
    position: [-11.5, 1.5, -10.5], // Exhibit 7
    scale: 1.1,
  },
];
