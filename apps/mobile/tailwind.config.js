/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#06469B",
        primaryDark: "#063E89",
        cyan: "#10A9CF",
        surface: "#FFFFFF",
        background: "#F5F8FC",
        textPrimary: "#172033",
        textSecondary: "#5A6473",
        success: "#107C41",
        warning: "#D97706",
        danger: "#DC2626",
        border: "#E2E8F0"
      },
      borderRadius: {
        'card': '24px',
        'pill': '9999px'
      }
    },
  },
  plugins: [],
}
