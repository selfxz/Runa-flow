import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vinyl: "#1a0a2e",
        gold: "#c9a84c",
        accent: "#7c3aed",
      },
      keyframes: {
        spin: { to: { transform: "rotate(360deg)" } },
        slideOut: {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(120%)", opacity: "0" },
        },
        slideInFromTop: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        }
      },
      animation: {
        "spin-vinyl": "spin 4s linear infinite",
        "spin-slow": "spin 8s linear infinite",
        "slide-out": "slideOut 0.8s ease-in-out forwards",
        "slide-in-from-top": "slideInFromTop 1s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;