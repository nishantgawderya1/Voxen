/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // All tokens are RGB channel triples set in index.css and flipped
        // between .dark / .light, so Tailwind opacity modifiers keep working.
        bg: "rgb(var(--c-bg) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        surface2: "rgb(var(--c-surface-2) / <alpha-value>)",
        elevated: "rgb(var(--c-elevated) / <alpha-value>)",
        line: "rgb(var(--c-line) / <alpha-value>)",
        text: "rgb(var(--c-text) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        primary: "rgb(var(--c-primary) / <alpha-value>)",
        "primary-fg": "rgb(var(--c-primary-fg) / <alpha-value>)",
        accent: "rgb(var(--c-accent) / <alpha-value>)",
        mint: "rgb(var(--c-mint) / <alpha-value>)",
        danger: "rgb(var(--c-danger) / <alpha-value>)",

        // Back-compat aliases used by a few older class names.
        background: "rgb(var(--c-bg) / <alpha-value>)",
        "primary-text": "rgb(var(--c-text) / <alpha-value>)",
        "secondary-text": "rgb(var(--c-muted) / <alpha-value>)",
        "on-surface": "rgb(var(--c-text) / <alpha-value>)",
        "on-surface-variant": "rgb(var(--c-muted) / <alpha-value>)",
        "on-primary": "rgb(var(--c-primary-fg) / <alpha-value>)",
        outline: "rgb(var(--c-line) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ['"Space Grotesk"', "Inter", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      borderRadius: {
        card: "16px",
        xl2: "20px",
      },
      maxWidth: {
        base: "1160px",
      },
      opacity: {
        6: "0.06",
        8: "0.08",
        12: "0.12",
        15: "0.15",
        18: "0.18",
      },
      boxShadow: {
        glow: "0 0 0 1px rgb(var(--c-primary) / 0.35), 0 20px 60px -20px rgb(var(--c-primary) / 0.5)",
        soft: "0 24px 60px -24px rgb(var(--c-shadow) / 0.55)",
        card: "0 1px 0 0 rgb(var(--c-line) / 0.6), 0 24px 48px -32px rgb(var(--c-shadow) / 0.5)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        drift: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(4%,-6%) scale(1.1)" },
          "66%": { transform: "translate(-5%,4%) scale(0.95)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseRing: {
          "0%": { boxShadow: "0 0 0 0 rgb(var(--c-primary) / 0.5)" },
          "70%": { boxShadow: "0 0 0 14px rgb(var(--c-primary) / 0)" },
          "100%": { boxShadow: "0 0 0 0 rgb(var(--c-primary) / 0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards",
        float: "float 6s ease-in-out infinite",
        drift: "drift 22s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite",
        pulseRing: "pulseRing 2s ease-out infinite",
        marquee: "marquee 28s linear infinite",
        spinSlow: "spinSlow 18s linear infinite",
      },
    },
  },
  plugins: [],
};
