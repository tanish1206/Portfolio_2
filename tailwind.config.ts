import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/cinematic/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        "background-secondary": "#101010",
        surface: "#101010",
        concrete: "#1A1A1A",
        "surface-border": "rgba(255, 255, 255, 0.08)",
        "accent-crimson": "#B11226",
        "accent-crimson-bright": "#D81E36",
        "accent-crimson-dark": "#5A0E1A",
        "accent-ambient": "rgba(177, 18, 38, 0.15)",
        "text-primary": "#FFFFFF",
        "text-secondary": "#A8A8A8",
        "text-muted": "#666666",
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
