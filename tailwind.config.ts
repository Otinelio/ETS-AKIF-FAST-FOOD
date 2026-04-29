import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F5F0E4",
        "akif-red": "#D42B2B",
        "akif-blue": "#1B3A8C",
        "akif-black": "#1A1A1A",
        "akif-orange": "#F07A2A",
      },
      fontFamily: {
        bebas: ['"Bebas Neue"', 'sans-serif'],
        lora: ['"Lora"', 'serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
