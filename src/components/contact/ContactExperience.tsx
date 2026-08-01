"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowLeft, Mail, Github, Linkedin, CheckCircle2, PhoneCall } from "lucide-react";

interface ContactExperienceProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactExperience: React.FC<ContactExperienceProps> = ({ isOpen, onClose }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setFormSubmitted(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/90 p-4 md:p-10 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel relative flex w-full max-w-4xl flex-col rounded-3xl border border-white/10 p-6 md:p-12 shadow-2xl my-auto max-h-[90vh] overflow-y-auto"
        >
          {/* Top Bar */}
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-surface/90 pb-4 backdrop-blur-md">
            <button
              onClick={onClose}
              className="interactive-hover flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-text-secondary hover:border-white/30 hover:text-white transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to World</span>
            </button>
            <div className="flex items-center gap-2 font-mono text-xs text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/30">
              <PhoneCall className="h-4 w-4" />
              <span>End of Journey • Invitation to Connect</span>
            </div>
          </div>

          {/* Header */}
          <div className="mt-8 space-y-3 text-center">
            <h1 className="font-space text-3xl font-bold tracking-tight text-white md:text-5xl">
              Let's Build Together
            </h1>
            <p className="max-w-md mx-auto text-sm text-text-secondary">
              Whether architecting intelligent multi-agent systems, building high-impact products, or leading hackathons.
            </p>
          </div>

          {/* Contact Form / Phone Screen Container */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Contact Info & Philosophy */}
            <div className="flex flex-col justify-between space-y-6 rounded-2xl border border-white/10 bg-black/60 p-6 md:p-8">
              <div className="space-y-4">
                <span className="font-mono text-xs text-accent-blue uppercase tracking-widest">
                  Direct Channels
                </span>
                <div className="space-y-3">
                  <a
                    href="mailto:tanish.soni.connect@gmail.com"
                    className="interactive-hover flex items-center gap-3 rounded-xl border border-white/5 bg-surface/50 p-3 text-xs text-text-secondary hover:border-accent-blue hover:text-white transition-all"
                  >
                    <Mail className="h-4 w-4 text-accent-blue shrink-0" />
                    <span className="font-mono truncate">tanish.soni.connect@gmail.com</span>
                  </a>
                  <a
                    href="https://github.com/tanish1206"
                    target="_blank"
                    rel="noreferrer"
                    className="interactive-hover flex items-center gap-3 rounded-xl border border-white/5 bg-surface/50 p-3 text-xs text-text-secondary hover:border-accent-blue hover:text-white transition-all"
                  >
                    <Github className="h-4 w-4 text-white shrink-0" />
                    <span className="font-mono">github.com/tanish1206</span>
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="interactive-hover flex items-center gap-3 rounded-xl border border-white/5 bg-surface/50 p-3 text-xs text-text-secondary hover:border-accent-blue hover:text-white transition-all"
                  >
                    <Linkedin className="h-4 w-4 text-blue-400 shrink-0" />
                    <span className="font-mono">linkedin.com/in/tanish-soni</span>
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 text-xs text-text-muted">
                <p className="italic">"Engineers build products; founders build solutions that matter."</p>
              </div>
            </div>

            {/* Right: Minimal Form */}
            <div className="rounded-2xl border border-white/10 bg-black/60 p-6 md:p-8">
              {formSubmitted ? (
                <div className="flex h-full flex-col items-center justify-center space-y-3 text-center py-10">
                  <CheckCircle2 className="h-12 w-12 text-emerald-400 animate-bounce" />
                  <h3 className="font-space text-lg font-bold text-white">Transmission Received</h3>
                  <p className="text-xs text-text-secondary max-w-xs">
                    Thank you, {name}. I will respond within 24 hours.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="text-xs text-accent-blue underline pt-4"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] uppercase text-text-muted">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Vance"
                      className="w-full rounded-xl border border-white/10 bg-surface/80 px-4 py-2.5 text-xs text-white placeholder-text-muted outline-none focus:border-accent-blue transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[10px] uppercase text-text-muted">Your Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full rounded-xl border border-white/10 bg-surface/80 px-4 py-2.5 text-xs text-white placeholder-text-muted outline-none focus:border-accent-blue transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[10px] uppercase text-text-muted">Message / Proposal</label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Let's build an AI product together..."
                      className="w-full rounded-xl border border-white/10 bg-surface/80 px-4 py-2.5 text-xs text-white placeholder-text-muted outline-none focus:border-accent-blue transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="interactive-hover flex w-full items-center justify-center gap-2 rounded-xl bg-accent-blue py-3 text-xs font-bold text-black hover:bg-white transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)]"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
