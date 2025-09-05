/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        grape: "rgb(var(--grape) / <alpha-value>)",
        white: "rgb(var(--white) / <alpha-value>)",
        color: "rgb(var(--color) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
