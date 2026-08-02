import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#050505",
          900: "#0a0808",
          800: "#120d0d",
          700: "#1c1414",
          600: "#2a1c1c",
        },
        aura: {
          50: "#fdecec",
          100: "#fbd2d2",
          200: "#f4a3a3",
          300: "#ea6f6f",
          400: "#e0454a",
          500: "#c81e2e",
          600: "#a51526",
          700: "#7f1120",
          800: "#5c0d18",
          900: "#3d0910",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
      backgroundImage: {
        "radial-glow":
          "radial-gradient(60% 50% at 50% 0%, rgba(200,30,46,0.18) 0%, rgba(5,5,5,0) 70%)",
        "aura-gradient": "linear-gradient(135deg, #e0454a 0%, #a51526 100%)",
      },
      boxShadow: {
        aura: "0 8px 30px rgba(200,30,46,0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
