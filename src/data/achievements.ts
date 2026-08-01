export interface AchievementItem {
  id: string;
  title: string;
  category: "ISRO" | "Hackathon" | "Leadership" | "Certification";
  organization: string;
  year: string;
  description: string;
  highlight: string;
  icon: string;
  badgeColor: string;
}

export const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: "isro-milestone",
    title: "ISRO Space Tech & Satellite Research Recognition",
    category: "ISRO",
    organization: "Indian Space Research Organisation (ISRO)",
    year: "2024",
    description: "Selected and recognized for outstanding contribution in space technology research, telemetry analytics, and satellite payload data modeling.",
    highlight: "Space Tech Excellence",
    icon: "🚀",
    badgeColor: "#FFD700",
  },
  {
    id: "national-hackathon-1",
    title: "1st Place Winner - National AI Innovation Hackathon",
    category: "Hackathon",
    organization: "National Innovation Council",
    year: "2024",
    description: "Built an autonomous real-time emergency response dispatch system using low-latency LLM multi-agents in 36 straight hours.",
    highlight: "National Winner",
    icon: "🏆",
    badgeColor: "#00E5FF",
  },
  {
    id: "national-hackathon-2",
    title: "Grand Champion - Smart Product Buildathon",
    category: "Hackathon",
    organization: "Tech-Forge India",
    year: "2023",
    description: "Architected Campus Bites & predictive inventory engine under extreme 24-hour constraints, outperforming 250+ teams.",
    highlight: "Grand Champion",
    icon: "🥇",
    badgeColor: "#FF9100",
  },
  {
    id: "community-lead",
    title: "AI & Full Stack Lead Architect",
    category: "Leadership",
    organization: "Developer Student Club & Open Source Collective",
    year: "2023 - Present",
    description: "Mentored 500+ aspiring builders, conducted hands-on AI workshops, and spearheaded open-source full-stack platform developments.",
    highlight: "500+ Mentored",
    icon: "⚡",
    badgeColor: "#E040FB",
  },
  {
    id: "ai-certification",
    title: "Deep Learning & Generative AI Systems Specialist",
    category: "Certification",
    organization: "DeepLearning.AI & NVIDIA Developer Program",
    year: "2023",
    description: "Advanced certification covering multi-modal Transformers, RAG vector pipelines, and LLM fine-tuning methodologies.",
    highlight: "Advanced Specialist",
    icon: "📜",
    badgeColor: "#00E676",
  },
];
