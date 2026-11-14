/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: "#F7F5EF",
        parchmentDark: "#EEEADD",
        ink: "#30251D",
        accentOrange: "#CC6600",
        electricBlue: "#1193D4",
        pixelYellow: "#E6B800",
        riskRed: "#B8452A",
        riskAmber: "#D97706",
        riskGreen: "#006E32",
        cardBg: "#FFFFFF",
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
        pixel: ["'Press Start 2P'", "monospace"],
      },
      boxShadow: {
        retro: "4px 4px 0px #30251D",
        retroLg: "6px 6px 0px #30251D",
        retroYellow: "4px 4px 0px #E6B800",
        retroBlue: "4px 4px 0px #1193D4",
      },
    },
  },
  plugins: [],
}
