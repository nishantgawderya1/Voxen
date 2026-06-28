/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "#080a10",
        surface: "#0f1117",
        primary: "#cabeff",
        "on-primary": "#1c1148",
        "primary-text": "#f0eff0",
        "secondary-text": "#8b8fa8",
        outline: "#33343c",
        "card-bg": "#0f1117",
        "card-hover": "#161b27",
        "on-surface": "#e2e2eb",
        "on-surface-variant": "#a1a1aa",
        "border-subtle": "rgba(255, 255, 255, 0.07)",
        border: "rgba(255, 255, 255, 0.07)",
        tertiary: "#55ddab",
      },
      spacing: {
        section: "96px",
        "4px": "4px",
        "8px": "8px",
        "12px": "12px",
        "16px": "16px",
        "20px": "20px",
        "24px": "24px",
        "32px": "32px",
        "96px": "96px",
      },
      borderRadius: {
        card: "12px",
      },
      fontFamily: {
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        h1: ["40px", { lineHeight: "48px", fontWeight: "600" }],
        h2: ["28px", { lineHeight: "36px", fontWeight: "600" }],
        h3: ["18px", { lineHeight: "24px", fontWeight: "600" }],
        body: ["16px", { lineHeight: "24px", fontWeight: "400" }],
        label: [
          "12px",
          { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" },
        ],
      },
    },
  },
  plugins: [],
};
