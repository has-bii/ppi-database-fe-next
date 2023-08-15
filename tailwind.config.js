/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
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
      transitionProperty: {
        display: "display",
      },
      colors: {
        light: {
          text: "#1D1D1D",
          primary: "#ffffff",
          secondary: "#1D1D1D",
          accent: "#EF4444",
        },
        dark: {
          text: "#ffffff",
          primary: "#1F2126",
          secondary: "#1B1D21",
          accent: "#863131",
        },
      },
      backgroundImage: {
        mobile: "url('/image/mobile.svg')",
      },
      height: {
        "9/16": "56.25%",
      },
    },
  },
  plugins: [],
};
