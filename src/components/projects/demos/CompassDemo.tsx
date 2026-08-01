"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Compass, Sparkles, CheckCircle } from "lucide-react";

export const CompassDemo: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState("AI Agent Architect");
  const [isSimulating, setIsSimulating] = useState(false);

  const roles = [
    "AI Agent Architect",
    "Full Stack Systems Lead",
    "Computer Vision Engineer",
    "Product Founder",
  ];

  const skillGraphData: Record<string, { nodes: string[]; score: number; timeframe: string }> = {
    "AI Agent Architect": {
      nodes: ["LLM Orchestration", "Vector Indexing", "Multi-Agent Protocols", "PyTorch Fine-tuning"],
      score: 96.4,
      timeframe: "4 Months Roadmap",
    },
    "Full Stack Systems Lead": {
      nodes: ["Distributed DBs", "Next.js App Router", "Sub-100ms API Pipelines", "DevOps & CI/CD"],
      score: 94.1,
      timeframe: "3 Months Roadmap",
    },
    "Computer Vision Engineer": {
      nodes: ["OpenCV Boundary Extraction", "YOLOv8 Real-time Inference", "3D Mesh Extrusion", "PyTorch CUDA"],
      score: 91.8,
      timeframe: "5 Months Roadmap",
    },
    "Product Founder": {
      nodes: ["Product-Market Fit Matrix", "0-to-1 Product Design", "Growth Analytics", "Tech Stack Strategy"],
      score: 98.2,
      timeframe: "Continuous Evolution",
    },
  };

  const currentData = skillGraphData[selectedRole];

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 500);
  };

  return (
    <div className="glass-panel relative flex flex-col space-y-6 rounded-2xl p-6 md:p-8">
      {/* Demo Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-blue/10 text-accent-blue border border-accent-blue/30">
            <Compass className="h-5 w-5 animate-spin" style={{ animationDuration: "12s" }} />
          </div>
          <div>
            <h4 className="font-space text-lg font-bold text-white">Interactive Skill Graph Simulator</h4>
            <p className="text-xs text-text-secondary">Simulate real-time career pathway vector computation</p>
          </div>
        </div>
        <div className="font-mono text-xs text-accent-blue flex items-center gap-1.5 bg-accent-blue/5 px-3 py-1.5 rounded-full border border-accent-blue/20">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Realtime Trajectory Match: {currentData.score}%</span>
        </div>
      </div>

      {/* Target Role Selector */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => handleRoleSelect(role)}
            className={`interactive-hover rounded-xl border py-2.5 px-3 text-xs transition-all ${
              selectedRole === role
                ? "border-accent-blue bg-accent-blue/10 font-semibold text-accent-blue shadow-[0_0_15px_rgba(0,229,255,0.2)]"
                : "border-white/10 bg-surface/50 text-text-secondary hover:border-white/30 hover:text-white"
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Dynamic 3D Vector Nodes Visualization */}
      <div className="relative flex h-64 w-full flex-col items-center justify-center rounded-xl border border-white/10 bg-black/60 p-6 overflow-hidden">
        {/* Ambient Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:24px_24px]" />

        {isSimulating ? (
          <div className="z-10 flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-blue border-t-transparent" />
            <span className="font-mono text-xs text-accent-blue">Computing Skill Trajectory...</span>
          </div>
        ) : (
          <div className="z-10 grid w-full max-w-lg grid-cols-1 sm:grid-cols-2 gap-4">
            {currentData.nodes.map((node, i) => (
              <motion.div
                key={node}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-center gap-3 rounded-lg border border-accent-blue/30 bg-surface/90 p-3 shadow-md backdrop-blur-md"
              >
                <CheckCircle className="h-4 w-4 shrink-0 text-accent-blue" />
                <div className="flex flex-col">
                  <span className="font-space text-xs font-semibold text-white">{node}</span>
                  <span className="font-mono text-[10px] text-text-muted">Mastery Node #{i + 1}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="absolute bottom-3 left-4 font-mono text-[10px] text-text-muted">
          Trajectory Timeline: {currentData.timeframe}
        </div>
      </div>
    </div>
  );
};
