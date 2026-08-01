export interface ProjectData {
  id: string;
  title: string;
  tagline: string;
  accentColor: string;
  heroIcon: string;
  problem: string;
  solution: string;
  interactiveDemoType: "compass-demo" | "food-demo" | "audio-demo" | "blueprint-demo";
  architecture: {
    frontend: string[];
    backend: string[];
    aiServices: string[];
    infrastructure: string[];
  };
  journeySteps: {
    phase: string;
    title: string;
    description: string;
  }[];
  results: {
    metric: string;
    label: string;
  }[];
  techStack: string[];
  lessons: string[];
  githubUrl: string;
  liveUrl?: string;
}

export const PROJECTS: Record<string, ProjectData> = {
  "career-compass": {
    id: "career-compass",
    title: "Career Compass",
    tagline: "Navigating Uncharted Career Paths via Real-Time Intelligence & LLM Graph Modeling",
    accentColor: "#00E5FF",
    heroIcon: "🧭",
    problem: "Traditional career guidance relies on static questionnaire results and outdated job catalogs. Students and early-career developers struggle to map their actual skills against rapidly evolving market demand and AI disruptions.",
    solution: "Career Compass analyzes real-time industry job data, GitHub activity, and market shifts to build an interactive 3D skill trajectory graph, predicting personal skill gaps and engineering individualized 6-month growth roadmaps.",
    interactiveDemoType: "compass-demo",
    architecture: {
      frontend: ["Next.js 14 App Router", "React Three Fiber", "Tailwind CSS", "Framer Motion"],
      backend: ["FastAPI", "Python", "PostgreSQL", "Redis Cache"],
      aiServices: ["LangChain", "OpenAI GPT-4o Embeddings", "Pinecone Vector DB"],
      infrastructure: ["Vercel", "Docker", "AWS Lambda", "Supabase"],
    },
    journeySteps: [
      {
        phase: "Ideation",
        title: "The Skill Misalignment Problem",
        description: "Discovered during student mentoring that 80%+ of CS students were training for roles being restructured by AI.",
      },
      {
        phase: "Architecture",
        title: "Dynamic Graph vs Static Trees",
        description: "Replaced rigid static tree structures with dynamic vector embeddings mapped onto a 3D force-directed node graph.",
      },
      {
        phase: "Refinement",
        title: "Sub-Second Trajectory Computation",
        description: "Optimized graph traversal algorithms in Python to re-calculate personalized learning paths in under 250ms.",
      },
    ],
    results: [
      { metric: "12,000+", label: "Skill Nodes Processed" },
      { metric: "94.2%", label: "Trajectory Accuracy Rate" },
      { metric: "<250ms", label: "Graph Traversal Latency" },
    ],
    techStack: ["Next.js", "TypeScript", "Python", "FastAPI", "Pinecone", "LangChain", "Three.js", "TailwindCSS"],
    lessons: [
      "Vector embeddings are vastly superior to manual taxonomy tags for skill clustering.",
      "Visualizing user progress inside a 3D graph increases user retention by 3.4x over standard bullet lists.",
    ],
    githubUrl: "https://github.com/tanish1206",
    liveUrl: "https://career-compass.demo",
  },

  "campus-bites": {
    id: "campus-bites",
    title: "Campus Bites",
    tagline: "Predictive Campus Dining Analytics & Zero-Queue Food Ordering Platform",
    accentColor: "#FF9100",
    heroIcon: "☕",
    problem: "Peak dining hours at university cafeterias create 30-minute queue bottlenecks, wasting student time, causing kitchen order congestion, and generating massive daily food inventory waste.",
    solution: "Campus Bites combines a lightning-fast mobile ordering interface with a machine learning predictive demand engine that forecasts peak kitchen throughput and optimizes batch cooking schedules.",
    interactiveDemoType: "food-demo",
    architecture: {
      frontend: ["React Native", "Next.js Dashboard", "Tailwind CSS", "WebSocket Realtime"],
      backend: ["Node.js Express", "Socket.io", "MongoDB Atlas"],
      aiServices: ["Scikit-Learn Demand Predictor", "Prophet Time-Series Engine"],
      infrastructure: ["AWS EC2", "Cloudflare CDN", "Stripe Connect"],
    },
    journeySteps: [
      {
        phase: "Observation",
        title: "The Lunch Rush Bottleneck",
        description: "Mapped campus cafeteria queues manually during peak hours and identified 40% idle kitchen capacity outside peak intervals.",
      },
      {
        phase: "Build",
        title: "Predictive Kitchen Queuing",
        description: "Engineered a dynamic prep-time algorithm that throttles order intakes based on current kitchen heatmaps.",
      },
      {
        phase: "Deployment",
        title: "Campus-Wide Rollout",
        description: "Deployed across campus cafeterias, reducing peak wait times from 32 minutes down to under 4 minutes.",
      },
    ],
    results: [
      { metric: "87%", label: "Wait Time Reduction" },
      { metric: "15,000+", label: "Orders Processed" },
      { metric: "4.9/5", label: "Cafeteria Rating" },
    ],
    techStack: ["React Native", "Next.js", "Node.js", "Socket.io", "MongoDB", "Python", "TailwindCSS"],
    lessons: [
      "Real-time WebSocket synchronization is essential when handling simultaneous queue state updates.",
      "Predictive kitchen batching reduced ingredient food waste by 22%.",
    ],
    githubUrl: "https://github.com/tanish1206",
    liveUrl: "https://campus-bites.demo",
  },

  "hooklabs": {
    id: "hooklabs",
    title: "HookLabs",
    tagline: "AI Audio Synthesis & High-Retention Video Hook Generator",
    accentColor: "#E040FB",
    heroIcon: "🎙️",
    problem: "Content creators lose 65% of viewers within the first 3 seconds due to generic intros and sub-optimal audio storytelling hooks.",
    solution: "HookLabs uses AI NLP analysis and real-time audio waveform processing to analyze viral hook patterns, automatically generating killer script intros and matching studio voice synthesis.",
    interactiveDemoType: "audio-demo",
    architecture: {
      frontend: ["Next.js 14", "Web Audio API", "Framer Motion", "GSAP Timeline Editor"],
      backend: ["Python FastAPI", "Celery Queue", "Redis"],
      aiServices: ["ElevenLabs Audio API", "Whisper Alignment", "GPT-4o Hook Analyzer"],
      infrastructure: ["AWS S3", "FFmpeg Engine", "Vercel"],
    },
    journeySteps: [
      {
        phase: "Research",
        title: "Deconstructing Retention Curves",
        description: "Analyzed 500+ top-performing tech & product shorts to identify acoustic drop-off triggers.",
      },
      {
        phase: "Engineering",
        title: "Waveform Sub-Frame Alignment",
        description: "Built a browser Web Audio API waveform visualizer with millisecond precision subtitle sync.",
      },
      {
        phase: "Launch",
        title: "Creator Beta",
        description: "Tested with tech creators, boosting 3-second viewer retention rate by an average of 41%.",
      },
    ],
    results: [
      { metric: "41%", label: "Retention Boost" },
      { metric: "50,000+", label: "Audio Hooks Generated" },
      { metric: "50ms", label: "Audio Sync Precision" },
    ],
    techStack: ["Next.js", "TypeScript", "Web Audio API", "FastAPI", "FFmpeg", "OpenAI", "ElevenLabs"],
    lessons: [
      "Audio cadence and dynamic frequency changes matter more than raw visual cuts in the first 3 seconds.",
      "Client-side Web Audio synthesis reduces server processing bills by 70%.",
    ],
    githubUrl: "https://github.com/tanish1206",
    liveUrl: "https://hooklabs.demo",
  },

  "rentlens": {
    id: "rentlens",
    title: "RentLens",
    tagline: "Computer Vision Property Blueprint Analysis & Fair Value Intelligence",
    accentColor: "#00E676",
    heroIcon: "🔑",
    problem: "Home renters and buyers struggle to identify hidden floor plan defects, unadvertised room dimensions, or predatory rental pricing models from standard flat photos.",
    solution: "RentLens ingests 2D architectural blueprints and property photos, running computer vision spatial layout extraction to render 3D walkable mockups and automated fair-market pricing reports.",
    interactiveDemoType: "blueprint-demo",
    architecture: {
      frontend: ["Next.js 14", "Three.js Blueprint Viewer", "Tailwind CSS", "Chart.js"],
      backend: ["Python Flask", "OpenCV", "PyTorch"],
      aiServices: ["YOLOv8 Floor Plan Detector", "Spatial Reconstruction Model"],
      infrastructure: ["AWS SageMaker", "PostgreSQL PostGIS", "Vercel"],
    },
    journeySteps: [
      {
        phase: "Discovery",
        title: "Blueprint Distortion Issue",
        description: "Standard rental floorplans are poorly scanned 2D images with skewed angles and unreadable text.",
      },
      {
        phase: "AI Pipeline",
        title: "CV Spatial Extractor",
        description: "Trained a YOLOv8 custom model to detect wall boundaries, windows, doors, and dimensional labels.",
      },
      {
        phase: "3D Render",
        title: "Instant 3D Blueprint Extrusion",
        description: "Created an automated parser converting vector wall segments into extruded Three.js 3D meshes in <1s.",
      },
    ],
    results: [
      { metric: "98.5%", label: "Wall Detection Precision" },
      { metric: "<1.2s", label: "3D Blueprint Generation" },
      { metric: "1,500+", label: "Properties Processed" },
    ],
    techStack: ["Next.js", "Three.js", "Python", "OpenCV", "PyTorch", "YOLOv8", "TailwindCSS"],
    lessons: [
      "Spatial computer vision combined with interactive WebGL gives users immediate tangible trust in property listings.",
    ],
    githubUrl: "https://github.com/tanish1206",
    liveUrl: "https://rentlens.demo",
  },
};
