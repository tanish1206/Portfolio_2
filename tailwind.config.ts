import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#111111",
        "surface-border": "rgba(255, 255, 255, 0.08)",
        "accent-crimson": "#DC143C",
        "accent-crimson-bright": "#FF1E40",
        "accent-crimson-dark": "#5A0E1A",
        "accent-blue": "#FF1E40", // Retain alias mapped to Crimson for legacy safety
        "accent-gold": "#FFFFFF",
        "text-primary": "#FFFFFF",
        "text-secondary": "#A0A0A0",
        "text-muted": "#555555",
      },
      fontFamily: {
        space: ["var(--font-space-grotesk)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      animation: {
        pulseSlow: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        glitch: "glitch 0.4s ease-in-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(1deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
