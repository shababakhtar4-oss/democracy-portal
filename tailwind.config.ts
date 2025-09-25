import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Base tokens
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // Primary palette
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },

        // UI components
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // Civic theme
        civic: {
          primary: "#800000", // Maroon
          "primary-light": "#a83232",
          secondary: "#3b5998", // Blue
          accent: "#0000ff", // Bright blue
          neutral: "#f5f5f5",
          surface: "#f7fafc",
        },

        // Sidebar theme
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },

      // Background gradients & patterns
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(135deg, #800000 0%, #3b5998 60%, #0000ff 100%)",
        "gradient-hero":
          "linear-gradient(120deg, #800000 0%, #3b5998 60%, #0000ff 100%)",
        "gradient-card":
          "linear-gradient(120deg, #800000cc 0%, #3b5998cc 60%, #0000ffcc 100%)",
        "pattern-dots":
          "radial-gradient(circle, #ffffff22 1px, transparent 1px)",
      },

      // Shadows
      boxShadow: {
        card: "0 4px 24px 0 rgba(59, 89, 152, 0.10), 0 1.5px 4px 0 rgba(128,0,0,0.10)",
        "card-hover": "0 8px 32px 0 rgba(59, 89, 152, 0.15), 0 2px 8px 0 rgba(128,0,0,0.15)",
        elegant: "0 2px 8px 0 rgba(0,0,0,0.08)",
      },

      // Border radius
      borderRadius: {
        lg: "1.25rem",
        md: "1rem",
        sm: "0.5rem",
      },

      // Animations
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;