import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bronze: {
          DEFAULT: "#CD7F32",
          dark: "#8B4513",
        },
        patina: "#6B8E7F",
        cream: "#FAF8F3",
        "warm-gray": "#D4CFC9",
        "rich-black": "#1A1A1A",
        terracotta: "#E07A5F",
        gold: "#D4AF37",
      },
      fontFamily: {
        heading: ["var(--font-cormorant)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        hero: ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        h1: ["2.5rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        h2: ["1.75rem", { lineHeight: "1.3" }],
        body: ["1.125rem", { lineHeight: "1.7" }],
        small: ["0.875rem", { lineHeight: "1.5" }],
      },
      transitionDuration: {
        "800": "800ms",
        "1200": "1200ms",
        "2000": "2000ms",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        gentle: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
      backdropBlur: {
        panel: "20px",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0, 0, 0, 0.08)",
        glow: "0 0 20px rgba(205, 127, 50, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
