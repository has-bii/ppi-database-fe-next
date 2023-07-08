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
      },
      animation: {
        wiggle: "wiggle .5s ease-in-out",
      },
    },
  },
  plugins: [],
};
