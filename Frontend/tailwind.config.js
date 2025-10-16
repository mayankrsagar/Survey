export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  // tailwind.config.js
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#302b63",
      },
    },
  },
  plugins: [],
};
