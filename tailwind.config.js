/** @type {import('tailwindcss').Config} */
const { colors } = require("./src/theme/colors");
const { typography } = require("./src/theme/typography");

module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        mainBg: colors.background,
        surface: colors.surface,
        brand: colors.primary,
        line: colors.border,
        "text-muted": colors.textSecondary,
        "text-dark": colors.textDark,
      },
      fontFamily: {
        bold: [typography.fonts.bold],
        regular: [typography.fonts.regular],
        light: [typography.fonts.light],
      },
      fontSize: {
        h1: [typography.sizes.xl + "px", "40px"],
        body: [typography.sizes.lg + "px", "24px"],
        label: [typography.sizes.sm + "px", "20px"],
      },
    },
  },
  plugins: [],
};
