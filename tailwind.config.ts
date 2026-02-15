import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 12px 30px rgba(0,0,0,0.10)"
      }
    },
  },
  plugins: [],
} satisfies Config;
