import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";
import typographyPlugin from "@tailwindcss/typography";

const config: Config = {
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
        // Premium neon palette
        'neon-mint': '#00FF94',
        'neon-cyan': '#00D4FF',
        'neon-purple': '#A855F7',
        'neon-pink': '#FF006E',
        'warm-gold': '#FFD700',

        // Legacy support
        'neon-green': '#00FF94',
        'cyan-accent': '#00D4FF',
        'deep-black': '#000000',
        'dark-gray': '#0A0A0A',

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
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
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'system-ui',
          'sans-serif',
        ],
        display: [
          '"Space Grotesk"',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          '"SF Mono"',
          'Monaco',
          'Consolas',
          '"Courier New"',
          'monospace',
        ],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.0625rem', letterSpacing: '0em' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '-0.001em' }],
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '-0.002em' }],
        'lg': ['1.125rem', { lineHeight: '1.625rem', letterSpacing: '-0.003em' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.005em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.008em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.011em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.014em' }],
        '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.019em' }],
        '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.022em' }],
        '7xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        '8xl': ['6rem', { lineHeight: '1.05', letterSpacing: '-0.028em' }],
        '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.031em' }],
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 255, 148, 0.4), 0 0 40px rgba(0, 255, 148, 0.2)',
        'neon-lg': '0 0 30px rgba(0, 255, 148, 0.5), 0 0 60px rgba(0, 255, 148, 0.3)',
        'neon-sm': '0 0 10px rgba(0, 255, 148, 0.3)',
        'neon-cyan': '0 0 20px rgba(0, 212, 255, 0.4), 0 0 40px rgba(0, 212, 255, 0.2)',
        'neon-purple': '0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.2)',
        'card-hover': '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 60px rgba(0, 255, 148, 0.15)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'elevated': '0 50px 100px -20px rgba(0, 0, 0, 0.9)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #00FF94 0%, #00D4FF 50%, #A855F7 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0a0a0a 0%, #000000 100%)',
        'gradient-glow': 'radial-gradient(ellipse at center, rgba(0, 255, 148, 0.15) 0%, transparent 70%)',
        'aurora': 'radial-gradient(ellipse 80% 50% at 20% 20%, rgba(0, 255, 148, 0.1) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(0, 212, 255, 0.1) 0%, transparent 50%)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(1deg)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 255, 148, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 255, 148, 0.6)" },
        },
        slideRight: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(calc(100% - 5rem))" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "rotate-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "rotate-reverse": {
          from: { transform: "rotate(360deg)" },
          to: { transform: "rotate(0deg)" },
        },
        morph: {
          "0%, 100%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "25%": { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" },
          "50%": { borderRadius: "50% 60% 30% 60% / 30% 60% 70% 40%" },
          "75%": { borderRadius: "60% 40% 60% 40% / 40% 50% 60% 50%" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "border-flow": {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "200% 0%" },
        },
        aurora: {
          "0%": { transform: "rotate(0deg) scale(1)", filter: "hue-rotate(0deg)" },
          "50%": { transform: "rotate(180deg) scale(1.2)", filter: "hue-rotate(30deg)" },
          "100%": { transform: "rotate(360deg) scale(1)", filter: "hue-rotate(0deg)" },
        },
        "reveal-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "reveal-scale": {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "phone-float": {
          "0%, 100%": { transform: "translateY(0) rotateY(0deg)" },
          "50%": { transform: "translateY(-15px) rotateY(2deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slideRight": "slideRight 1.5s linear infinite",
        "shimmer": "shimmer 2s linear infinite",
        "rotate-slow": "rotate-slow 20s linear infinite",
        "rotate-reverse": "rotate-reverse 15s linear infinite",
        "morph": "morph 8s ease-in-out infinite",
        "gradient": "gradient-shift 8s ease infinite",
        "border-flow": "border-flow 8s linear infinite",
        "aurora": "aurora 20s linear infinite",
        "reveal-up": "reveal-up 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards",
        "reveal-scale": "reveal-scale 0.6s cubic-bezier(0.19, 1, 0.22, 1) forwards",
        "phone-float": "phone-float 6s ease-in-out infinite",
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'out-quint': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [animatePlugin, typographyPlugin],
};

export default config;
