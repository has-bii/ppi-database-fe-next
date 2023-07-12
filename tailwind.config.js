/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          "0%, 20%, 40%, 60%, 80%, 100%": { transform: "translate(0, 2px)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translate(0px, 0)" },
        },
        fade: {
          "0%": { transform: "translate(6px, 0px)", opacity: 0 },
          "20%": { opacity: 1 },
          "100%": { transform: "translate(0px, 0px)" },
        },
      },
      animation: {
        wiggle: "wiggle .5s ease-in-out",
        fade: "fade .5s ease-in-out",
      },
      colors: {
        "base-grey": "#EDEDED",
        black: "#1D1D1D",
      },
    },
  },
  plugins: [],
};
