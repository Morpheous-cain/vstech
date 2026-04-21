import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "390px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        foreground: "#1e2340",
        "foreground-muted": "#6b75a8",

        indigo: {
          950: "#0d0f2e",
          900: "#1a1c5e",
          800: "#2d30a0",
          700: "#3d40c8",
          600: "#4f52e8",
          500: "#6366f1",
          400: "#818cf8",
          300: "#a5b4fc",
          200: "#c7d2fe",
          100: "#e0e7ff",
          50:  "#eef2ff",
        },

        gray: {
          50:  "#f8f9fc",
          100: "#f1f3f9",
          200: "#e4e8f4",
          300: "#cdd3e8",
          400: "#9da6c8",
          500: "#6b75a8",
          600: "#4a527a",
          700: "#343a60",
          800: "#1e2340",
          900: "#0d0f2e",
        },

        status: {
          paid:       "#10b981",
          pending:    "#f59e0b",
          cancelled:  "#ef4444",
          dispatched: "#6366f1",
        },
      },

      fontFamily: {
        display: ["DM Serif Display", "Georgia", "serif"],
        body:    ["Sora", "system-ui", "sans-serif"],
      },

      borderRadius: {
        DEFAULT: "0.75rem",
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
        full: "9999px",
      },

      animation: {
        "fade-in":  "fade-in 0.35s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        shimmer:    "shimmer 1.5s infinite",
        pulse:      "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
      },

      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.5" },
        },
      },

      boxShadow: {
        indigo:    "0 4px 20px rgba(79, 82, 232, 0.25)",
        "indigo-sm": "0 2px 10px rgba(79, 82, 232, 0.15)",
        card:      "0 2px 16px rgba(13, 15, 46, 0.08)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
