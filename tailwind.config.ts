import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#C5A059", // Muted Champagne Gold
        secondary: "#EADDCA", // Almond Cream
        accent: "#9B7E43", // Darker Antique Gold
        dark: "#0F0F0F", // Velvet Black
        "dark-surface": "#161616", // Subtle raised surface
        light: "#FDFBF7", // Pearl White
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        serif: ["var(--font-quicksand)", "serif"],
      },
      backdropBlur: {
        glass: "16px",
        "glass-sm": "8px",
        "glass-lg": "32px",
      },
      backgroundColor: {
        glass: "rgba(255, 255, 255, 0.03)",
        "glass-hover": "rgba(255, 255, 255, 0.08)",
        "glass-dark": "rgba(15, 15, 17, 0.65)",
        "glass-gold": "rgba(218, 165, 32, 0.1)",
      },
      borderColor: {
        glass: "rgba(255, 255, 255, 0.05)",
        "glass-strong": "rgba(255, 255, 255, 0.15)",
        "glass-gold": "rgba(218, 165, 32, 0.2)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
        "glass-lg": "0 16px 48px 0 rgba(0, 0, 0, 0.4)",
        "glass-glow": "0 0 20px rgba(218, 165, 32, 0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "slide-up": "slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-gold": "pulseGold 3s infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(218, 165, 32, 0.4)" },
          "50%": { boxShadow: "0 0 20px 0 rgba(218, 165, 32, 0.1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "from": { textShadow: "0 0 10px rgba(218, 165, 32, 0.2), 0 0 20px rgba(218, 165, 32, 0.1)" },
          "to": { textShadow: "0 0 20px rgba(218, 165, 32, 0.6), 0 0 30px rgba(218, 165, 32, 0.3)" },
        }
      },
    },
  },
  plugins: [],
};

export default config;
