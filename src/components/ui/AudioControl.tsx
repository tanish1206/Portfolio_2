"use client";

import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

export const AudioControl: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const toggleAudio = () => {
    if (!isPlaying) {
      // Initialize Web Audio API synth ambient tone
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const gain = ctx.createGain();
      gain.gain.value = 0.03; // Soft ambient volume
      gain.connect(ctx.destination);
      gainRef.current = gain;

      // Deep cinematic drone chord (55Hz A1 & 110Hz A2)
      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(55, ctx.currentTime);
      osc1.connect(gain);
      osc1.start();
      osc1Ref.current = osc1;

      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(110.5, ctx.currentTime); // Slight detune for warmth
      osc2.connect(gain);
      osc2.start();
      osc2Ref.current = osc2;

      setIsPlaying(true);
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <button
      onClick={toggleAudio}
      className="interactive-hover glass-panel fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full px-4 py-2.5 text-xs tracking-wider text-text-secondary transition-all hover:border-accent-blue/50 hover:text-white"
    >
      {isPlaying ? (
        <>
          <Volume2 className="h-4 w-4 text-accent-blue animate-pulse" />
          <span className="font-mono text-[10px] uppercase text-accent-blue">Cinematic Audio On</span>
        </>
      ) : (
        <>
          <VolumeX className="h-4 w-4 text-text-muted" />
          <span className="font-mono text-[10px] uppercase text-text-muted">Sound Off</span>
        </>
      )}
    </button>
  );
};
