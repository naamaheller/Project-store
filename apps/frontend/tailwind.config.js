/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          hover: "#1d4ed8",
          soft: "#dbeafe",
        },
        secondary: {
          DEFAULT: "#9333ea",
          hover: "#7e22ce",
        },
        background: {
          DEFAULT: "#ffffff",
          muted: "#f8fafc",
        },
        surface: "#ffffff",
        text: {
          DEFAULT: "#0f172a",
          muted: "#64748b",
          inverted: "#ffffff",
        },
        border: "#e5e7eb",
        success: "#16a34a",
        warning: "#f59e0b",
        error: "#dc2626",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.05)",
        md: "0 4px 6px rgba(0,0,0,0.08)",
        lg: "0 10px 15px rgba(0,0,0,0.12)",
      },
      fontSize: {
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "24px" }],
        lg: ["18px", { lineHeight: "28px" }],
        xl: ["24px", { lineHeight: "32px" }],
        "2xl": ["32px", { lineHeight: "40px" }],
      },
      fontWeight: {
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
      },
    },
  },
  plugins: [],
};
