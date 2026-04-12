/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#edf4ff",
        card: "#f8fcff",
        primary: "#0ea5e9",
        ink: "#0b2340",
        muted: "#4a6789"
      },
      boxShadow: {
        soft: "0 1px 2px rgba(11,35,64,.06), 0 12px 36px rgba(11,35,64,.10)"
      },
      borderRadius: {
        xl2: "1rem"
      }
    }
  },
  plugins: []
};
