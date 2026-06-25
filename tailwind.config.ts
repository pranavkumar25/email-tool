import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      /*
       * Gmail Campaigns — light, enterprise-grade email-platform design system.
       * White surfaces on a soft gray canvas, a single indigo accent, and
       * semantic tokens so every surface / text / border stays consistent.
       */
      colors: {
        canvas: "#f5f6f8", // app background
        surface: "#ffffff", // cards, panels
        elevated: "#ffffff", // popovers, inputs
        subtle: "#f1f2f5", // faint filled areas (code chips, wells)
        line: {
          DEFAULT: "#e6e7eb", // default borders / dividers
          strong: "#d3d5db", // emphasized borders, hover
        },
        ink: "#16181d", // primary text
        muted: "#5a5f6b", // secondary text
        faint: "#8b909c", // tertiary text / placeholders
        accent: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          DEFAULT: "#4f46e5",
          fg: "#ffffff",
          soft: "#eef2ff",
        },
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(16 24 40 / 0.05)",
        card: "0 1px 2px 0 rgb(16 24 40 / 0.06), 0 1px 3px 0 rgb(16 24 40 / 0.04)",
        pop: "0 12px 32px -8px rgb(16 24 40 / 0.18), 0 2px 6px -2px rgb(16 24 40 / 0.08)",
        glow: "0 1px 2px 0 rgb(79 70 229 / 0.3), 0 6px 16px -6px rgb(79 70 229 / 0.4)",
        "glow-sm": "0 1px 3px 0 rgb(79 70 229 / 0.35)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "fade-in": "fade-in 260ms cubic-bezier(0.16, 1, 0.3, 1) both",
        shimmer: "shimmer 1.6s infinite",
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
