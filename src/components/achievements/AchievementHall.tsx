"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ACHIEVEMENTS } from "@/data/achievements";
import { Trophy, Award, Rocket, ArrowLeft, Star } from "lucide-react";

interface AchievementHallProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementHall: React.FC<AchievementHallProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/90 p-4 md:p-10 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel relative flex w-full max-w-5xl flex-col rounded-3xl border border-accent-gold/30 p-6 md:p-12 shadow-[0_0_50px_rgba(255,215,0,0.1)] my-auto max-h-[90vh] overflow-y-auto"
        >
          {/* Top Bar */}
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-surface/90 pb-4 backdrop-blur-md">
            <button
              onClick={onClose}
              className="interactive-hover flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-text-secondary hover:border-accent-gold hover:text-accent-gold transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to World</span>
            </button>
            <div className="flex items-center gap-2 font-mono text-xs text-accent-gold bg-accent-gold/10 px-3 py-1.5 rounded-full border border-accent-gold/30">
              <Trophy className="h-4 w-4" />
              <span>Physical Achievement Hall</span>
            </div>
          </div>

          {/* Hero Header */}
          <div className="mt-8 space-y-3 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-gold/30 bg-accent-gold/10 px-4 py-1 text-xs text-accent-gold">
              <Star className="h-3.5 w-3.5 fill-accent-gold" />
              <span className="font-mono uppercase tracking-wider">Milestones & Honors</span>
            </div>
            <h1 className="font-space text-3xl font-bold tracking-tight text-white md:text-5xl">
              Achievement Hall
            </h1>
            <p className="max-w-xl mx-auto text-sm text-text-secondary">
              A curated physical showcase of engineering awards, ISRO research recognition, and national hackathon victories.
            </p>
          </div>

          {/* ISRO Special Showcase Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 rounded-2xl border border-accent-gold/50 bg-gradient-to-r from-amber-950/40 via-surface to-amber-950/40 p-6 md:p-8 shadow-[0_0_30px_rgba(255,215,0,0.15)] relative overflow-hidden"
          >
            <div className="absolute right-4 top-4 text-7xl opacity-10 pointer-events-none">🚀</div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-gold/20 text-accent-gold font-bold">
                    <Rocket className="h-4 w-4" />
                  </span>
                  <span className="font-mono text-xs font-bold text-accent-gold uppercase tracking-widest">
                    ISRO Flagship Recognition
                  </span>
                </div>
                <h2 className="font-space text-2xl font-bold text-white">
                  Indian Space Research Organisation (ISRO)
                </h2>
                <p className="text-xs text-text-secondary max-w-2xl leading-relaxed">
                  Recognized for space technology research, telemetry data modeling, and satellite payload analytics. Demonstrating complete systems engineering under high-stakes parameters.
                </p>
              </div>
              <div className="shrink-0 font-mono text-xs font-bold text-accent-gold bg-accent-gold/10 border border-accent-gold/30 rounded-xl p-4 text-center">
                Year: 2024
                <div className="text-[10px] text-white opacity-80 uppercase mt-1">Space Tech Honors</div>
              </div>
            </div>
          </motion.div>

          {/* Achievement Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {ACHIEVEMENTS.filter((a) => a.id !== "isro-milestone").map((ach, idx) => (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="glass-panel glass-panel-hover flex flex-col justify-between rounded-2xl p-6 border-white/10 space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface border border-white/10 text-2xl shadow-inner">
                    {ach.icon}
                  </div>
                  <span
                    className="font-mono text-[10px] font-bold uppercase tracking-wider rounded-full px-3 py-1 border"
                    style={{
                      borderColor: `${ach.badgeColor}40`,
                      color: ach.badgeColor,
                      backgroundColor: `${ach.badgeColor}10`,
                    }}
                  >
                    {ach.highlight}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-space text-lg font-bold text-white">{ach.title}</h3>
                  <p className="font-mono text-xs text-text-muted">{ach.organization} • {ach.year}</p>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">{ach.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
