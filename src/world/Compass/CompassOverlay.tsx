"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Compass, Cpu, GitBranch, Layers } from "lucide-react";
import { WorldController } from "@/world/WorldController";

/**
 * CompassOverlay.tsx
 * Minimal spatial HUD overlay shown when inside Career Compass world.
 * Everything else is 3D in the canvas.
 * Only three elements:
 *  1. Return button (top-left)
 *  2. Project title badge (top-right)
 *  3. Detail panel (bottom)
 */

const NODES = [
  {
    id: 0,
    title: "AI Trajectory Engine",
    icon: Cpu,
    body: "Analyzes developer skill vectors, market velocity and GitHub activity to generate hyper-personalized career trajectories using LLM + GraphRAG.",
    metrics: [
      { label: "Precision", value: "98.4%" },
      { label: "Latency",   value: "<120ms" },
      { label: "Stack",     value: "LLM + RAG" },
    ],
  },
  {
    id: 1,
    title: "Skill Gap Analysis",
    icon: GitBranch,
    body: "Maps current technical capabilities against target lead/senior roles and recommends precisely targeted project milestones and high-leverage skills.",
    metrics: [
      { label: "Skill Nodes", value: "5 000+" },
      { label: "Telemetry",   value: "Real-time" },
      { label: "Engine",      value: "Neo4j Graph" },
    ],
  },
  {
    id: 2,
    title: "Roadmap Synthesizer",
    icon: Layers,
    body: "Transforms career aspirations into step-by-step actionable architectural projects, hackathon recommendations, and mastery milestones.",
    metrics: [
      { label: "Adaptiveness", value: "Dynamic" },
      { label: "Satisfaction",  value: "99.1%" },
      { label: "Deploy",        value: "Vercel Edge" },
    ],
  },
];

export const CompassOverlay: React.FC = () => {
  const [activeNode, setActiveNode] = React.useState(0);
  const node = NODES[activeNode];
  const Icon = node.icon;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex flex-col justify-between p-6 md:p-10">

      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between">
        <motion.button
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="pointer-events-auto group flex items-center gap-3 rounded-full border border-white/10 bg-black/60 px-5 py-2.5 text-xs text-white backdrop-blur-md transition-all hover:border-[#B11226]/60 hover:bg-[#B11226]/15"
          onClick={() => WorldController.returnToMuseum()}
        >
          <ArrowLeft className="h-4 w-4 text-[#B11226] transition-transform group-hover:-translate-x-1" />
          <span className="font-mono tracking-widest uppercase">Return to Museum</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 rounded-full border border-[#B11226]/30 bg-[#B11226]/10 px-4 py-1.5 text-[11px] text-[#D81E36] font-mono tracking-widest uppercase"
        >
          <Compass className="h-3.5 w-3.5" />
          Career Compass
        </motion.div>
      </div>

      {/* ── Bottom Detail Panel ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="pointer-events-auto max-w-md space-y-4 rounded-2xl border border-white/10 bg-black/75 p-6 backdrop-blur-xl"
      >
        {/* Node tabs */}
        <div className="flex gap-2">
          {NODES.map((n) => (
            <button
              key={n.id}
              onClick={() => setActiveNode(n.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-mono transition-all ${
                activeNode === n.id
                  ? "bg-[#B11226] text-white"
                  : "bg-white/5 text-white/40 hover:text-white"
              }`}
            >
              {String(n.id + 1).padStart(2, "0")}
            </button>
          ))}
        </div>

        {/* Node detail */}
        <motion.div
          key={activeNode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2.5">
            <Icon className="h-4 w-4 text-[#B11226]" />
            <h3 className="font-space text-lg font-semibold text-white">{node.title}</h3>
          </div>
          <p className="text-xs leading-relaxed text-white/55">{node.body}</p>

          <div className="grid grid-cols-3 gap-2 pt-1">
            {node.metrics.map((m) => (
              <div key={m.label} className="rounded-lg bg-white/5 p-2.5">
                <div className="font-mono text-[9px] uppercase text-white/30">{m.label}</div>
                <div className="mt-0.5 font-space text-sm font-bold text-white">{m.value}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
