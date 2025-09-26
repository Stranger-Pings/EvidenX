/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        destructive: "var(--destructive)",
        "destructive-foreground": "var(--destructive-foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        "audio-primary": "#3b82f6", // blue
        "audio-secondary": "#9333ea", // purple
        contradiction: "#ef4444", // red
        "contradiction-muted": "#fee2e2",
        "contradiction-border": "#fca5a5",
        similarity: "#22c55e", // green
        "similarity-muted": "#dcfce7",
        "similarity-border": "#86efac",
        "gray-area": "#facc15", // yellow
        "gray-area-muted": "#fef9c3",
        "gray-area-border": "#fde047",
      },
      borderRadius: {
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
      },
      fontWeight: {
        medium: "var(--font-weight-medium)",
        normal: "var(--font-weight-normal)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
