/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        background: "#ffffff",
        text: "#0f172a",
      },
      spacing: {
        sm: "8px",
        md: "16px",
        lg: "24px",
      },
      borderRadius: {
        md: "10px",
      },
    },
  },
};
