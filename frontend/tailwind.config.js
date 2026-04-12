/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        display: ['"Syne"', '"DM Sans"', "system-ui", "sans-serif"]
      },
      colors: {
        canvas: "var(--color-canvas)",
        surface: "var(--color-surface)",
        elevated: "var(--color-elevated)",
        line: "var(--color-line)",
        ink: "var(--color-ink)",
        subtle: "var(--color-subtle)",
        accent: "var(--color-accent)",
        "accent-fg": "var(--color-accent-fg)",
        "accent-muted": "var(--color-accent-muted)",
        sidebar: "var(--color-sidebar)",
        "sidebar-line": "var(--color-sidebar-line)",
        "on-sidebar": "var(--color-on-sidebar)",
        "on-sidebar-muted": "var(--color-on-sidebar-muted)",
        glow: "var(--color-glow)"
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        lift: "var(--shadow-lift)",
        glow: "0 0 40px -8px var(--color-glow)"
      },
      borderRadius: {
        xl2: "1rem",
        "4xl": "2rem"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
        float: "float 5s ease-in-out infinite",
        shimmer: "shimmer 1.8s infinite"
      }
    }
  },
  plugins: []
};
