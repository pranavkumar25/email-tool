import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        // One typeface — Inter carries every word (rsms.me InterVariable).
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        // Reserved for genuinely technical micro-text (keys, merge tags, code).
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
       * InboxRow — one typeface, four colors.
       * Black and white set the page; blue and red are reserved for action —
       * CTAs, links and highlights, never decoration. Neutral surfaces and
       * type are pure cool grays so the two accents stay loud.
       */
      colors: {
        canvas: "#FBFCFD", // app background — a whisper off the pure-white surface
        surface: "#FFFFFF", // cards, panels
        elevated: "#FFFFFF", // popovers, inputs
        subtle: "#F1F3F6", // faint filled areas (chips, wells)
        line: {
          DEFAULT: "#E7E9EE", // default borders / dividers
          strong: "#D4D8E0", // emphasized borders, hover
        },
        ink: "#050505", // primary text, icons & dark surfaces — brand black
        muted: "#5B616E", // secondary text
        faint: "#9AA0AD", // tertiary text / placeholders
        // Blue CTA — primary actions, links, highlights. The interaction color.
        accent: {
          50: "#EAF1FF",
          100: "#D4E2FF",
          200: "#A8C4FF",
          300: "#6E99FF",
          400: "#3470FF",
          500: "#004FFF",
          600: "#0047E6",
          700: "#003ACB",
          DEFAULT: "#004FFF",
          fg: "#FFFFFF",
          soft: "#EAF1FF",
        },
        // Red ACCENT — secondary CTAs, alerts, highlights. Used sparingly.
        signal: {
          50: "#FFECEC",
          100: "#FFD8D9",
          200: "#FFB4B5",
          300: "#FE9092",
          400: "#FD6A6D",
          500: "#FB4B4E",
          600: "#E62E31",
          700: "#C21F22",
          DEFAULT: "#FB4B4E",
          fg: "#FFFFFF",
          soft: "#FFECEC",
        },
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(5 5 5 / 0.06)",
        card: "0 1px 2px 0 rgb(5 5 5 / 0.05), 0 1px 3px 0 rgb(5 5 5 / 0.04)",
        pop: "0 16px 40px -12px rgb(5 5 5 / 0.18), 0 2px 6px -2px rgb(5 5 5 / 0.08)",
        // Blue lift for the primary CTA — the one place a shadow carries color.
        glow: "0 1px 2px 0 rgb(0 79 255 / 0.24), 0 10px 24px -10px rgb(0 79 255 / 0.45)",
        "glow-sm": "0 1px 2px 0 rgb(0 79 255 / 0.28)",
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
