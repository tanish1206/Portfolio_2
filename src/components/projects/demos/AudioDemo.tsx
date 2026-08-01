"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Play, Pause, Zap, BarChart2 } from "lucide-react";

export const AudioDemo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedHook, setSelectedHook] = useState(0);

  const hooks = [
    {
      title: "The 3-Second Retention Trigger",
      script: "Most engineers spend 6 months building the wrong feature. Here is why...",
      retentionScore: 94,
    },
    {
      title: "Architecture Controversy Hook",
      script: "Stop using microservices until you hit 100,000 active users...",
      retentionScore: 91,
    },
  ];

  const current = hooks[selectedHook];

  return (
    <div className="glass-panel relative flex flex-col space-y-6 rounded-2xl p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/30">
            <Mic className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-space text-lg font-bold text-white">Sub-Frame Waveform Audio Engine</h4>
            <p className="text-xs text-text-secondary">Simulate AI acoustic hook generation & sub-3s viewer retention analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-fuchsia-400 bg-fuchsia-500/10 px-3 py-1.5 rounded-full border border-fuchsia-500/20">
          <Zap className="h-3.5 w-3.5" />
          <span>Hook Retention Score: {current.retentionScore}/100</span>
        </div>
      </div>

      {/* Script & Waveform Studio */}
      <div className="space-y-4">
        <div className="flex gap-2">
          {hooks.map((h, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedHook(idx)}
              className={`interactive-hover rounded-lg border py-2 px-3 text-xs transition-all ${
                selectedHook === idx
                  ? "border-fuchsia-500 bg-fuchsia-500/10 font-semibold text-fuchsia-400"
                  : "border-white/10 bg-surface/50 text-text-muted hover:text-white"
              }`}
            >
              Hook Variant #{idx + 1}
            </button>
          ))}
        </div>

        {/* Script & Play button */}
        <div className="flex flex-col sm:flex-row items-center justify-between rounded-xl border border-white/10 bg-black/60 p-4 gap-4">
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-fuchsia-500 text-black hover:bg-fuchsia-400 shadow-[0_0_20px_rgba(224,64,251,0.4)] transition-all"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </button>
            <div className="flex flex-col">
              <span className="font-space text-sm font-bold text-white">{current.title}</span>
              <span className="text-xs text-text-secondary font-mono italic">"{current.script}"</span>
            </div>
          </div>
        </div>

        {/* Dynamic Frequency Audio Waveform */}
        <div className="flex h-24 w-full items-center justify-center gap-1 rounded-xl border border-white/10 bg-black/80 px-4">
          {Array.from({ length: 36 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                height: isPlaying
                  ? [
                      `${Math.max(15, Math.sin(i + Date.now()) * 80)}%`,
                      `${Math.max(20, Math.cos(i) * 90)}%`,
                    ]
                  : "25%",
              }}
              transition={{
                duration: 0.3,
                repeat: isPlaying ? Infinity : 0,
                repeatType: "reverse",
                delay: i * 0.02,
              }}
              className="w-1.5 rounded-full bg-gradient-to-t from-fuchsia-600 to-accent-blue opacity-80"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
