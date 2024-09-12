import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      Poppins: ["Poppins", "sans-serif"],
    },
    extend: {
      backgroundImage: {
        "bg-image": "url('/assets/images/bg_image2.jpg')",
      },
      colors: {
        primary: "hsl(124, 27%, 53%)",
      },
    },
  },
  plugins: [],
};
export default config;
