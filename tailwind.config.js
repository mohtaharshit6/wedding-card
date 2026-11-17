/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        admin: {
          sidebar: "#18181b",
          primary: "#6E1414",
          gold: "#C9A24B",
        }
      }
    },
  },
  plugins: [],
}
