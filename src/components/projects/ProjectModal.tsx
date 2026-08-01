"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectData } from "@/data/projects";
import { X, Github, ExternalLink, Cpu, CheckCircle2, Award, ArrowLeft } from "lucide-react";
import { CompassDemo } from "./demos/CompassDemo";
import { FoodDemo } from "./demos/FoodDemo";
import { AudioDemo } from "./demos/AudioDemo";
import { BlueprintDemo } from "./demos/BlueprintDemo";

interface ProjectModalProps {
  project: ProjectData | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  const renderDemo = () => {
    switch (project.interactiveDemoType) {
      case "compass-demo":
        return <CompassDemo />;
      case "food-demo":
        return <FoodDemo />;
      case "audio-demo":
        return <AudioDemo />;
      case "blueprint-demo":
        return <BlueprintDemo />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/90 p-4 md:p-10 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel relative flex w-full max-w-5xl flex-col rounded-3xl border border-white/10 p-6 md:p-12 shadow-2xl my-auto max-h-[90vh] overflow-y-auto"
        >
          {/* Header Close & Navigation Bar */}
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-surface/90 pb-4 backdrop-blur-md">
            <button
              onClick={onClose}
              className="interactive-hover flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-text-secondary hover:border-white/30 hover:text-white transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to World</span>
            </button>
            <div className="flex items-center gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="interactive-hover flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:border-accent-blue hover:text-accent-blue transition-colors"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="interactive-hover flex items-center gap-1.5 rounded-full bg-accent-blue px-4 py-2 text-xs font-bold text-black hover:bg-white transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)]"
                >
                  <span>Live Demo</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Project Story Content */}
          <div className="mt-8 space-y-12">
            {/* 1. Hero Title & Tagline */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface px-3 py-1 text-xs">
                <span className="text-xl">{project.heroIcon}</span>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider" style={{ color: project.accentColor }}>
                  {project.title} Story Experience
                </span>
              </div>
              <h1 className="font-space text-3xl font-bold tracking-tight text-white md:text-5xl">
                {project.title}
              </h1>
              <p className="max-w-3xl text-base text-text-secondary md:text-lg leading-relaxed">
                {project.tagline}
              </p>
            </div>

            {/* 2. Problem & Solution Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel space-y-3 rounded-2xl p-6 border-red-500/20 bg-red-950/10">
                <h3 className="font-space text-sm font-bold uppercase tracking-wider text-red-400">
                  The Problem
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {project.problem}
                </p>
              </div>
              <div className="glass-panel space-y-3 rounded-2xl p-6 border-emerald-500/20 bg-emerald-950/10">
                <h3 className="font-space text-sm font-bold uppercase tracking-wider text-emerald-400">
                  The Solution
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {project.solution}
                </p>
              </div>
            </div>

            {/* 3. Interactive Live Simulation Demo */}
            <div className="space-y-4">
              <h3 className="font-space text-xl font-bold text-white">Interactive Demonstration</h3>
              {renderDemo()}
            </div>

            {/* 4. Architecture Blueprint */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-accent-blue" />
                <h3 className="font-space text-xl font-bold text-white">System Architecture</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl border border-white/10 bg-black/50 p-4 space-y-2">
                  <span className="font-mono text-[10px] text-accent-blue uppercase tracking-wider">Frontend Layer</span>
                  <ul className="space-y-1 text-xs text-text-secondary">
                    {project.architecture.frontend.map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-accent-blue shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/50 p-4 space-y-2">
                  <span className="font-mono text-[10px] text-purple-400 uppercase tracking-wider">Backend & Pipeline</span>
                  <ul className="space-y-1 text-xs text-text-secondary">
                    {project.architecture.backend.map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-purple-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/50 p-4 space-y-2">
                  <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider">AI & ML Services</span>
                  <ul className="space-y-1 text-xs text-text-secondary">
                    {project.architecture.aiServices.map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/50 p-4 space-y-2">
                  <span className="font-mono text-[10px] text-amber-400 uppercase tracking-wider">Infrastructure</span>
                  <ul className="space-y-1 text-xs text-text-secondary">
                    {project.architecture.infrastructure.map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-amber-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 5. Results & Metrics */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-accent-gold" />
                <h3 className="font-space text-xl font-bold text-white">Impact & Metrics</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {project.results.map((res, i) => (
                  <div key={i} className="rounded-2xl border border-accent-gold/30 bg-accent-gold/5 p-6 text-center space-y-1">
                    <span className="font-space text-3xl font-bold text-accent-gold">{res.metric}</span>
                    <p className="text-xs text-text-secondary font-mono">{res.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Tech Stack & Key Takeaways */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <h3 className="font-space text-sm font-bold uppercase tracking-wider text-text-muted">Technologies Utilized</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span key={tech} className="rounded-full border border-white/10 bg-surface px-3 py-1 text-xs font-mono text-text-secondary">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
