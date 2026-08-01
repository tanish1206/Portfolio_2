"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FLOATING_OBJECTS, FloatingObject } from "@/data/objects";
import { Sparkles, ArrowRight } from "lucide-react";

interface FloatingObjectsSceneProps {
  onSelectObject: (object: FloatingObject) => void;
}

export const FloatingObjectsScene: React.FC<FloatingObjectsSceneProps> = ({
  onSelectObject,
}) => {
  const [hoveredObject, setHoveredObject] = useState<FloatingObject | null>(null);
  const [transformingId, setTransformingId] = useState<string | null>(null);

  const handleObjectClick = (obj: FloatingObject) => {
    setTransformingId(obj.id);

    // Trigger transformation cinematic phase before opening world modal
    setTimeout(() => {
      onSelectObject(obj);
      setTransformingId(null);
    }, 900);
  };

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 py-20">
      {/* World Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="z-10 mb-16 text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-accent-blue/20 bg-accent-blue/5 px-4 py-1 text-xs text-accent-blue">
          <Sparkles className="h-3.5 w-3.5" />
          <span className="font-mono tracking-wider uppercase">Interactive Cinematic Universe</span>
        </div>
        <h2 className="font-space text-3xl font-bold tracking-tight text-white md:text-5xl">
          Discover The World
        </h2>
        <p className="max-w-md text-sm text-text-secondary">
          Click any floating object to initiate its transformation sequence into an immersive story-world.
        </p>
      </motion.div>

      {/* Floating Objects Orbital Grid */}
      <div className="z-10 grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FLOATING_OBJECTS.map((obj, idx) => {
          const isSelected = transformingId === obj.id;
          const isHovered = hoveredObject?.id === obj.id;

          return (
            <motion.div
              key={obj.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              onMouseEnter={() => setHoveredObject(obj)}
              onMouseLeave={() => setHoveredObject(null)}
              onClick={() => handleObjectClick(obj)}
              className="interactive-hover group relative cursor-pointer"
            >
              {/* Outer Glow Halo */}
              <div
                className="pointer-events-none absolute -inset-0.5 rounded-2xl opacity-0 blur-lg transition-all duration-500 group-hover:opacity-40"
                style={{
                  background: `linear-gradient(135deg, ${obj.accentColor}, transparent)`,
                }}
              />

              {/* Object Card Container */}
              <motion.div
                animate={{
                  y: isHovered ? -8 : [0, -6, 0],
                  scale: isSelected ? 1.08 : isHovered ? 1.02 : 1,
                }}
                transition={{
                  y: isHovered
                    ? { type: "spring", stiffness: 300, damping: 20 }
                    : { duration: 5 + idx, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 0.3 },
                }}
                className="glass-panel glass-panel-hover relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 md:p-8"
              >
                {/* Transformation Effect Overlay on Click */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md"
                  >
                    <motion.div
                      animate={{ rotate: 360, scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                      className="text-5xl"
                    >
                      {obj.symbol}
                    </motion.div>
                    <span
                      className="mt-3 font-mono text-xs font-semibold tracking-widest uppercase"
                      style={{ color: obj.accentColor }}
                    >
                      Transforming World...
                    </span>
                  </motion.div>
                )}

                {/* Top Symbol Icon & Accent Dot */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-xl bg-surface border border-white/10 text-3xl shadow-inner transition-transform duration-300 group-hover:scale-110"
                    style={{ borderColor: isHovered ? obj.accentColor : "rgba(255,255,255,0.1)" }}
                  >
                    {obj.symbol}
                  </div>
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: obj.accentColor }}
                  />
                </div>

                {/* Name & Narrative Short Description */}
                <div className="space-y-2">
                  <h3 className="font-space text-xl font-bold tracking-tight text-white group-hover:text-accent-blue transition-colors">
                    {obj.name}
                  </h3>
                  <p className="text-xs text-text-secondary line-clamp-2">
                    {obj.shortDesc}
                  </p>
                </div>

                {/* Bottom Action Trigger Cue */}
                <div className="mt-8 flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="font-mono text-[10px] tracking-widest text-text-muted uppercase group-hover:text-white transition-colors">
                    Enter Story
                  </span>
                  <ArrowRight
                    className="h-4 w-4 text-text-muted transition-all duration-300 group-hover:translate-x-1"
                    style={{ color: isHovered ? obj.accentColor : undefined }}
                  />
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
