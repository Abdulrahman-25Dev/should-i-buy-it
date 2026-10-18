/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#0f172a",
          card: "#1e293b",
          border: "#334155",
          text: "#f8fafc",
          muted: "#94a3b8",
          input: "#0f172a",
        },
        light: {
          bg: "#f8fafc",
          card: "#ffffff",
          border: "#e2e8f0",
          text: "#0f172a",
          muted: "#64748b",
          input: "#f1f5f9",
        },
      },
    },
  },
  plugins: [],
};
