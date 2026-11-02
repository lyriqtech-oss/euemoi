import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--background-paper)",
        beige: {
          light: "var(--background-beige)",
          medium: "var(--background-beige-dark)",
          dark: "var(--background-beige-deep)",
        },
        accent: {
          red: "var(--accent-red)",
          redHover: "var(--accent-red-hover)",
        },
        brand: {
          brown: "var(--text-muted)",
          dark: "var(--text-primary)",
          lightBrown: "var(--brown-light)",
        },
        border: "var(--border-color)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        editorial: "0 4px 20px -2px rgba(125, 98, 82, 0.12)",
        soft: "0 2px 12px 0 rgba(23, 21, 18, 0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
