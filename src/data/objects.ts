export interface FloatingObject {
  id: string;
  name: string;
  symbol: string;
  targetWorld: string;
  shortDesc: string;
  accentColor: string;
  position: [number, number, number]; // 3D coordinates [x, y, z]
  scale: number;
}

export const FLOATING_OBJECTS: FloatingObject[] = [
  {
    id: "compass",
    name: "Career Compass",
    symbol: "🧭",
    targetWorld: "career-compass",
    shortDesc: "AI Career Guidance & Pathway Engine",
    accentColor: "#00E5FF",
    position: [-2.5, 1.2, 0],
    scale: 1.1,
  },
  {
    id: "coffee",
    name: "Campus Bites",
    symbol: "☕",
    targetWorld: "campus-bites",
    shortDesc: "Predictive Campus Dining Analytics & Ordering",
    accentColor: "#FF9100",
    position: [2.2, 1.5, -0.5],
    scale: 1.0,
  },
  {
    id: "mic",
    name: "HookLabs",
    symbol: "🎙️",
    targetWorld: "hooklabs",
    shortDesc: "AI Audio & Viral Hook Content Generator",
    accentColor: "#E040FB",
    position: [-1.8, -1.3, 0.5],
    scale: 1.1,
  },
  {
    id: "key",
    name: "RentLens",
    symbol: "🔑",
    targetWorld: "rentlens",
    shortDesc: "AI Property Blueprint & Valuation Platform",
    accentColor: "#00E676",
    position: [2.5, -1.1, 0.2],
    scale: 1.0,
  },
  {
    id: "notebook",
    name: "About Tanish",
    symbol: "📓",
    targetWorld: "about-me",
    shortDesc: "Engineering Journey, Mindset & Core Philosophy",
    accentColor: "#29B6F6",
    position: [0, 2.0, -1.0],
    scale: 1.2,
  },
  {
    id: "trophy",
    name: "Achievements",
    symbol: "🏆",
    targetWorld: "achievements",
    shortDesc: "ISRO Milestone, Hackathons & Honors",
    accentColor: "#FFD700",
    position: [-3.2, -0.2, -0.8],
    scale: 1.2,
  },
  {
    id: "phone",
    name: "Contact & Connect",
    symbol: "📱",
    targetWorld: "contact",
    shortDesc: "Initiate Collaboration & Direct Contact",
    accentColor: "#7C4DFF",
    position: [3.1, 0.1, -0.6],
    scale: 1.1,
  },
];
