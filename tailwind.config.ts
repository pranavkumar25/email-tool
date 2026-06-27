import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        // Human voice — headings & prose.
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        // System/data voice — labels, addresses, merge tags, metrics.
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      /*
       * inboxrow — a precision instrument for personal-feeling outreach.
       * Deep pine carries the brand and the "delivered / go" semantics; a warm
       * marigold spark is used sparingly for emphasis. Cool ink on faint sage
       * paper, with pure-white surfaces. Distinctions are carried by elevation,
       * weight, voice (sans vs. mono), and accent — never by color alone.
       */
      colors: {
        canvas: "#f1f3ef", // app background — faint sage paper
        surface: "#ffffff", // cards, panels
        elevated: "#ffffff", // popovers, inputs
        subtle: "#e9ece7", // faint filled areas (chips, wells)
        line: {
          DEFAULT: "#e0e4dd", // default borders / dividers
          strong: "#cad0c6", // emphasized borders, hover
        },
        ink: "#15201c", // primary text — near-black, faint evergreen cast
        muted: "#586059", // secondary text
        faint: "#869089", // tertiary text / placeholders
        // Brand + interaction accent (remapped indigo → pine, so every existing
        // `accent-*` utility re-skins for free).
        accent: {
          50: "#e8f4ee",
          100: "#cbe7d8",
          200: "#9fd2ba",
          300: "#69b594",
          400: "#379472",
          500: "#1c7a59",
          600: "#136548",
          700: "#0e5139",
          DEFAULT: "#136548",
          fg: "#ffffff",
          soft: "#e8f4ee",
        },
        // Warm spark — flags, highlights, the one place color gets loud.
        signal: {
          50: "#fdf3e3",
          100: "#f9e3bf",
          200: "#f2cd8a",
          400: "#eaa53f",
          500: "#dd8e22",
          600: "#bd7212",
          DEFAULT: "#dd8e22",
          soft: "#fdf3e3",
        },
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(21 32 28 / 0.05)",
        card: "0 1px 2px 0 rgb(21 32 28 / 0.05), 0 1px 3px 0 rgb(21 32 28 / 0.04)",
        pop: "0 16px 40px -12px rgb(21 32 28 / 0.22), 0 2px 6px -2px rgb(21 32 28 / 0.08)",
        glow: "0 1px 2px 0 rgb(19 101 72 / 0.28), 0 8px 20px -8px rgb(19 101 72 / 0.4)",
        "glow-sm": "0 1px 3px 0 rgb(19 101 72 / 0.3)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
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
        "fade-up": "fade-up 460ms cubic-bezier(0.16, 1, 0.3, 1) both",
        shimmer: "shimmer 1.6s infinite",
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
