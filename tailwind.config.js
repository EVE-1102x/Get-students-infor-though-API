/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: "rgba(var(--background))",
        border: "rgba(var(--border))",
        grape: "rgba(var(--grape))",
        white: "rgba(var(--white))",
      },
    },
  },
  plugins: [],
};
