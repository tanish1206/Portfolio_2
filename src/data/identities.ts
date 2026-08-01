export interface Identity {
  id: string;
  title: string;
  subtitle: string;
  quote: string;
  image: string;
  accentColor: string;
  tags: string[];
}

export const IDENTITIES: Identity[] = [
  {
    id: "builder",
    title: "Builder",
    subtitle: "Architecting systems from absolute zero.",
    quote: "Code is raw material; software is the structure.",
    image: "/portraits/builder.jpg",
    accentColor: "#00E5FF",
    tags: ["Systems Architecture", "Product Design", "Scalability", "Clean Code"],
  },
  {
    id: "hackathon",
    title: "Hackathon Engineer",
    subtitle: "Turning complex challenges into working software in 24 hours.",
    quote: "Speed is the catalyst of breakthrough innovation.",
    image: "/portraits/hackathon.jpg",
    accentColor: "#FF3366",
    tags: ["National Wins", "Rapid Prototyping", "Pitching", "High Pressure"],
  },
  {
    id: "fullstack",
    title: "Full Stack Engineer",
    subtitle: "Bridging frontend elegance with robust backend pipelines.",
    quote: "Every interface is a promise; every backend keeps it.",
    image: "/portraits/fullstack.jpg",
    accentColor: "#7000FF",
    tags: ["Next.js", "Node.js", "Distributed Systems", "Database Design"],
  },
  {
    id: "ai",
    title: "AI Engineer",
    subtitle: "Training models, fine-tuning agents, and crafting intelligent workflows.",
    quote: "Intelligence is not simulated—it's engineered.",
    image: "/portraits/ai_engineer.jpg",
    accentColor: "#00FF9D",
    tags: ["LLM Agents", "PyTorch", "RAG Systems", "Predictive Analytics"],
  },
  {
    id: "founder",
    title: "Founder",
    subtitle: "Building complete platforms with market product-market fit.",
    quote: "Engineers build products; founders build solutions that matter.",
    image: "/portraits/founder.jpg",
    accentColor: "#FFD700",
    tags: ["Product Vision", "0-to-1 Growth", "Strategy", "User Impact"],
  },
];
