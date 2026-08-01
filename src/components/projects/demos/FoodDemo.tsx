"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Coffee, Clock, ShoppingBag, TrendingUp } from "lucide-react";

export const FoodDemo: React.FC = () => {
  const [orderState, setOrderState] = useState<"idle" | "preparing" | "ready">("idle");
  const [queueCount, setQueueCount] = useState(3);

  const placeOrder = () => {
    setOrderState("preparing");
    setTimeout(() => {
      setOrderState("ready");
    }, 2000);
  };

  const resetDemo = () => {
    setOrderState("idle");
    setQueueCount((prev) => (prev > 1 ? prev - 1 : 4));
  };

  return (
    <div className="glass-panel relative flex flex-col space-y-6 rounded-2xl p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Coffee className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-space text-lg font-bold text-white">Predictive Order & Kitchen Heatmap</h4>
            <p className="text-xs text-text-secondary">Simulate live queue throttling & automated kitchen batching</p>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Current Prep Time: 3.5 Mins (87% Faster)</span>
        </div>
      </div>

      {/* Live Order Simulation Screen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Mobile App Simulator */}
        <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-black/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-space text-xs font-bold text-white uppercase tracking-wider">Campus Cafe Menu</span>
            <span className="font-mono text-[10px] text-amber-400">Queue: {queueCount} Orders Ahead</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg border border-white/5 bg-surface/80 p-3">
              <div>
                <p className="text-xs font-semibold text-white">Cold Brew Espresso & Artisan Wrap</p>
                <p className="text-[10px] text-text-muted">Estimated Prep: 3 Mins</p>
              </div>
              <span className="font-mono text-xs font-bold text-amber-400">$6.50</span>
            </div>
          </div>

          {orderState === "idle" && (
            <button
              onClick={placeOrder}
              className="interactive-hover flex items-center justify-center gap-2 w-full rounded-xl bg-amber-500 py-3 text-xs font-bold text-black hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]"
            >
              <ShoppingBag className="h-4 w-4" />
              Simulate Instant Order
            </button>
          )}

          {orderState === "preparing" && (
            <div className="flex items-center justify-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 py-3 text-xs font-mono text-amber-400">
              <Clock className="h-4 w-4 animate-spin" />
              Kitchen Prep In Progress (Batch #42)...
            </div>
          )}

          {orderState === "ready" && (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 py-3 text-xs font-mono font-bold text-emerald-400">
                Order Ready for Locker Pickup #08!
              </div>
              <button
                onClick={resetDemo}
                className="w-full text-center text-[10px] text-text-muted hover:text-white underline"
              >
                Reset Order Simulator
              </button>
            </div>
          )}
        </div>

        {/* Right: Kitchen Heatmap Engine */}
        <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-black/60 p-5 space-y-4">
          <span className="font-space text-xs font-bold text-white uppercase tracking-wider">Predictive Kitchen Heatmap</span>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-text-secondary mb-1">
                <span>Cafeteria Kitchen Throughput Capacity</span>
                <span className="font-mono text-amber-400">78% Optimal</span>
              </div>
              <div className="h-2 w-full rounded-full bg-surface">
                <motion.div
                  initial={{ width: "20%" }}
                  animate={{ width: "78%" }}
                  transition={{ duration: 1 }}
                  className="h-2 rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500"
                />
              </div>
            </div>

            <div className="rounded-lg border border-white/5 bg-surface/50 p-3 space-y-2 text-xs text-text-secondary">
              <div className="flex justify-between">
                <span>Peak Hour Prediction:</span>
                <span className="font-mono text-white">12:30 PM - 1:15 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Batch Cooking Savings:</span>
                <span className="font-mono text-emerald-400">-22% Food Waste</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
