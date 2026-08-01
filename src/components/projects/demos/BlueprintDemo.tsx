"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Key, Eye, Layers, Check } from "lucide-react";

export const BlueprintDemo: React.FC = () => {
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");
  const [detectedWalls, setDetectedWalls] = useState(true);

  return (
    <div className="glass-panel relative flex flex-col space-y-6 rounded-2xl p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-space text-lg font-bold text-white">Computer Vision Blueprint Parser</h4>
            <p className="text-xs text-text-secondary">Simulate 2D floorplan wall detection to extruded 3D blueprint</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === "2d" ? "3d" : "2d")}
            className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-mono text-xs text-emerald-400 hover:bg-emerald-500/20 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            Switch to {viewMode === "2d" ? "3D Extrusion" : "2D Vector Blueprint"}
          </button>
        </div>
      </div>

      {/* Blueprint Canvas Viewport */}
      <div className="relative flex h-64 w-full flex-col items-center justify-center rounded-xl border border-white/10 bg-black/80 p-6 overflow-hidden">
        {/* Architectural Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98115_1px,transparent_1px),linear-gradient(to_bottom,#10b98115_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Blueprint Room Outline */}
        <motion.div
          animate={{
            rotateX: viewMode === "3d" ? 55 : 0,
            rotateZ: viewMode === "3d" ? -25 : 0,
            scale: viewMode === "3d" ? 0.9 : 1,
          }}
          transition={{ duration: 0.8, type: "spring", damping: 20 }}
          className="relative h-44 w-64 rounded-lg border-2 border-emerald-400/80 bg-emerald-950/20 p-4 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
        >
          {/* Inner Room Boundaries */}
          <div className="flex h-full w-full justify-between border-dashed border-emerald-400/40 p-2">
            <div className="flex flex-col justify-between">
              <span className="font-mono text-[9px] text-emerald-400">Master Suite (14' x 12')</span>
              <span className="font-mono text-[9px] text-emerald-400/70">Living Area (18' x 16')</span>
            </div>
            <div className="flex flex-col justify-end">
              <span className="font-mono text-[9px] text-emerald-400">Balcony View</span>
            </div>
          </div>

          {/* 3D Extruded Wall Pillars */}
          {viewMode === "3d" && (
            <div className="pointer-events-none absolute inset-0 rounded-lg border-t-8 border-l-8 border-emerald-400/60 shadow-[0_-10px_25px_rgba(16,185,129,0.3)]" />
          )}
        </motion.div>

        {/* Bottom Metrics Bar */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between font-mono text-[10px] text-text-muted">
          <span className="flex items-center gap-1 text-emerald-400">
            <Check className="h-3 w-3" /> YOLOv8 Spatial Confidence: 98.5%
          </span>
          <span>Fair Market Value Estimate: $2,450/mo</span>
        </div>
      </div>
    </div>
  );
};
