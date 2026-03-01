import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        line: {
          green: "#06C755",
          "green-dark": "#05a648",
          bg: "#7494C0",
        },
        dashboard: {
          bg: "#0f172a",
          card: "#1e293b",
          "card-hover": "#334155",
          border: "#334155",
        },
      },
    },
  },
  plugins: [],
};
export default config;
