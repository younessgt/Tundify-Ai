const { dark } = require("@mui/material/styles/createPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        red_1: "red",
        dark_bg_1: "#111B21",
        dark_bg_2: "#202C33",

        dark_bg_3: "#182229",
        dark_bg_4: "#222E35",
        dark_bg_5: "#233138",
        dark_bg_6: "#101A20",
        dark_bg_7: "#3e5b6b",
        dark_bg_8: "#324a57",
        dark_bg_9: "#2d3a42",
        dark_text_1: "#E9EDEF",
        dark_text_2: "#8696A0",
        dark_text_3: "#8696a0",
        dark_text_4: "#D1D6D8",
        dark_text_5: "#99BEB7",
        dark_hover_1: "#2A3942",
        dark_btn_1: "#ff5722",
        dark_btn_2: "#CC461B",
        dark_border_1: "#222D34",
        dark_border_2: "#313D45",
        dark_svg_1: "#AEBAC1",
        dark_svg_2: "#8696A0",
        dark_svg_3: "#ff5722",
      },
      screens: {
        "max-1826": { max: "1826px" },
        "max-1400": { max: "1400px" },
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
