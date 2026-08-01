"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { WorldHubController } from "@/cinematic/controllers/WorldHubController";
import { ArrowLeft, Sparkles, Compass, Cpu, Layers, GitBranch, ExternalLink, Github } from "lucide-react";
import { AudioController } from "@/cinematic/controllers/AudioController";

// 3D Drawn Pathway Lines inside Career Compass Space
function DrawnPathwayLines() {
  const lineRef1 = useRef<THREE.Line>(null);
  const lineRef2 = useRef<THREE.Line>(null);

  const [points1, points2] = React.useMemo(() => {
    const p1: THREE.Vector3[] = [];
    const p2: THREE.Vector3[] = [];

    // Curve 1: Main Career Pathway Vector
    for (let i = 0; i <= 50; i++) {
      const t = i / 50;
      const x = -3 + t * 6;
      const y = Math.sin(t * Math.PI * 2) * 0.8;
      const z = -1.5 + Math.cos(t * Math.PI) * 1.2;
      p1.push(new THREE.Vector3(x, y, z));
    }

    // Curve 2: Secondary Branching Vector
    for (let i = 0; i <= 50; i++) {
      const t = i / 50;
      const x = -2 + t * 4;
      const y = -1.2 + Math.cos(t * Math.PI * 1.5) * 0.6;
      const z = 1.0 - t * 2.5;
      p2.push(new THREE.Vector3(x, y, z));
    }

    return [
      new THREE.BufferGeometry().setFromPoints(p1),
      new THREE.BufferGeometry().setFromPoints(p2),
    ];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (lineRef1.current) {
      lineRef1.current.rotation.y = Math.sin(time * 0.2) * 0.1;
    }
    if (lineRef2.current) {
      lineRef2.current.rotation.y = -Math.sin(time * 0.2) * 0.1;
    }
  });

  return (
    <group>
      {/* Primary Pathway Line */}
      {/* @ts-ignore line element in three */}
      <line ref={lineRef1} geometry={points1}>
        <lineBasicMaterial color="#B11226" linewidth={2} transparent opacity={0.8} />
      </line>

      {/* Secondary Branching Line */}
      {/* @ts-ignore line element in three */}
      <line ref={lineRef2} geometry={points2}>
        <lineBasicMaterial color="#D81E36" linewidth={1.5} transparent opacity={0.6} />
      </line>
    </group>
  );
}

// Interactive 3D Nodes along the drawn career pathways
function Pathway3DNodes({ onSelectNode }: { onSelectNode: (index: number) => void }) {
  const node1 = useRef<THREE.Mesh>(null);
  const node2 = useRef<THREE.Mesh>(null);
  const node3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (node1.current) node1.current.rotation.y = time * 0.8;
    if (node2.current) node2.current.rotation.y = time * 1.0;
    if (node3.current) node3.current.rotation.y = time * 0.6;
  });

  return (
    <group>
      {/* Node 1: AI Guidance Engine */}
      <mesh
        ref={node1}
        position={[-2.2, 0.4, -1]}
        onClick={(e) => {
          e.stopPropagation();
          AudioController.playMetallicClick();
          onSelectNode(0);
        }}
      >
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial color="#B11226" emissive="#B11226" emissiveIntensity={0.8} />
      </mesh>

      {/* Node 2: Skill Trajectory Mapping */}
      <mesh
        ref={node2}
        position={[0, -0.6, 0.2]}
        onClick={(e) => {
          e.stopPropagation();
          AudioController.playMetallicClick();
          onSelectNode(1);
        }}
      >
        <octahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial color="#D81E36" emissive="#D81E36" emissiveIntensity={0.8} />
      </mesh>

      {/* Node 3: Intelligent Roadmap Synthesizer */}
      <mesh
        ref={node3}
        position={[2.2, 0.8, -1.2]}
        onClick={(e) => {
          e.stopPropagation();
          AudioController.playMetallicClick();
          onSelectNode(2);
        }}
      >
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial color="#B11226" emissive="#B11226" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

export const CareerCompass3DCanvasScene: React.FC<{ onSelectNode: (idx: number) => void }> = ({
  onSelectNode,
}) => {
  const particlesPos = React.useMemo(() => {
    const count = 1200;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return pos;
  }, []);

  return (
    <group>
      <DrawnPathwayLines />
      <Pathway3DNodes onSelectNode={onSelectNode} />

      {/* Ambient Pathway Stream Particles */}
      <Points positions={particlesPos} stride={3}>
        <PointMaterial
          transparent
          color="#B11226"
          size={0.03}
          depthWrite={false}
          opacity={0.5}
        />
      </Points>
    </group>
  );
};

// Spatial HUD overlay for the Career Compass 3D Reality
export const CareerCompassWorldOverlay: React.FC = () => {
  const [selectedNodeIdx, setSelectedNodeIdx] = useState<number>(0);

  const nodes = [
    {
      title: "AI Career Trajectory Engine",
      icon: Cpu,
      detail:
        "Analyzes skill vectors, market velocity, and developer profiles to generate dynamic, hyper-personalized career trajectories.",
      metrics: [
        { label: "Accuracy Vector", value: "98.4%" },
        { label: "Pathway Processing", value: "<120ms" },
        { label: "Architecture", value: "LLM + Graph RAG" },
      ],
    },
    {
      title: "Real-time Skill Gap Analysis",
      icon: GitBranch,
      detail:
        "Maps current technical capabilities against target senior & lead roles to recommend precise project milestones and high-leverage competencies.",
      metrics: [
        { label: "Skill Taxonomy", value: "5,000+ Nodes" },
        { label: "Telemetry", value: "Real-time" },
        { label: "Graph Engine", value: "Neo4j / Spatial" },
      ],
    },
    {
      title: "Intelligent Roadmap Synthesizer",
      icon: Layers,
      detail:
        "Transforms complex career aspirations into step-by-step actionable architectural projects, hackathons, and mastery milestones.",
      metrics: [
        { label: "Milestone Precision", value: "Adaptive" },
        { label: "User Satisfaction", value: "99.1%" },
        { label: "Deployment", value: "Edge Vercel" },
      ],
    },
  ];

  const currentNode = nodes[selectedNodeIdx];

  const handleReturnToHub = () => {
    AudioController.playMetallicClick();
    WorldHubController.returnToWorldHub();
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-6 md:p-12">
      {/* Top Header HUD Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between pointer-events-auto"
      >
        <button
          onClick={handleReturnToHub}
          className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-[#101010]/80 px-5 py-2.5 text-xs text-text-primary backdrop-blur-md transition-all hover:border-[#B11226] hover:bg-[#B11226]/20"
        >
          <ArrowLeft className="h-4 w-4 text-[#B11226] transition-transform group-hover:-translate-x-1" />
          <span className="font-mono tracking-wider uppercase">Return to World Hub</span>
        </button>

        <div className="hidden sm:flex items-center gap-3 rounded-full border border-[#B11226]/30 bg-[#B11226]/10 px-4 py-1.5 text-xs text-[#D81E36]">
          <Compass className="h-4 w-4 animate-spin-slow" />
          <span className="font-mono tracking-widest uppercase">Career Compass Reality Active</span>
        </div>
      </motion.div>

      {/* Main Bottom HUD Display Panel */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="pointer-events-auto max-w-xl rounded-2xl border border-white/10 bg-[#101010]/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6"
      >
        {/* Node Switcher Tabs */}
        <div className="flex gap-2 border-b border-white/10 pb-4 overflow-x-auto">
          {nodes.map((n, idx) => {
            const Icon = n.icon;
            const isSelected = selectedNodeIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => {
                  AudioController.playMetallicClick();
                  setSelectedNodeIdx(idx);
                }}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-mono transition-all ${
                  isSelected
                    ? "bg-[#B11226] text-white shadow-lg"
                    : "bg-[#1A1A1A] text-text-secondary hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>0{idx + 1}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Node Details */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedNodeIdx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#D81E36] mb-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span>EXHIBIT WORLD 01 // CAREER COMPASS</span>
              </div>
              <h2 className="font-space text-2xl md:text-3xl font-bold text-white">
                {currentNode.title}
              </h2>
            </div>

            <p className="text-xs md:text-sm text-[#A8A8A8] leading-relaxed">
              {currentNode.detail}
            </p>

            {/* Architectural Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {currentNode.metrics.map((m, idx) => (
                <div key={idx} className="rounded-lg bg-[#1A1A1A] p-3 border border-white/5">
                  <div className="font-mono text-[10px] uppercase text-[#666666]">{m.label}</div>
                  <div className="font-space text-sm font-bold text-white mt-0.5">{m.value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Project Links Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
          <div className="flex gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-text-secondary hover:text-[#D81E36] transition-colors font-mono"
            >
              <Github className="h-3.5 w-3.5" />
              <span>Source Repository</span>
            </a>
            <a
              href="https://tanish-soni.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-text-secondary hover:text-[#D81E36] transition-colors font-mono"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Live Engine</span>
            </a>
          </div>

          <span className="font-mono text-[10px] text-[#666666]">
            3D ARCHITECTURAL WORLD
          </span>
        </div>
      </motion.div>
    </div>
  );
};
