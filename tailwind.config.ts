import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import { withUt } from "uploadthing/tw";

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme('colors'));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ':root': newVars,
  });
}

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx,md,mdx}",
    "./components/**/*.{ts,tsx,md,mdx}",
    "./app/**/*.{ts,tsx,md,mdx}",
    "./src/**/*.{ts,tsx,md,mdx}",
    "./posts/**/*.{ts,tsx,md,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        handwriting: ["var(--font-handwriting)"],
        monalisa: ["var(--font-monalisa)"],
      },
      colors: {
        "letter-bottom": "#68147D",
        "bg-default": "#07070C",
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-linear': 'linear-gradient(var(--tw-gradient-stops))',
        'letter-top': 'linear-gradient(360deg, #130832 0%, #722186 100%)',
        'letter-middle': 'linear-gradient(1.77deg, #1A1056 1.57%, #8F1BAC 98.43%)',
      },
      boxShadow: {
        'alt-cta': 'inset 0px 0px 10px #FFFFFF',
        cta: 'inset 0px 0px 14px #000000',
        'letter-top': '0px 0px 20px #0F0C22',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    addVariablesForColors,
    require("@tailwindcss/typography"),
    function({ addUtilities, theme }: { addUtilities: any, theme: any }) {
      const colors = flattenColorPalette(theme('colors'));
      const newUtilities: Record<string, { backgroundImage: string }> = Object.entries(colors).reduce((acc, [name, value]) => {
        if (typeof value === 'string') {
          acc[`.bg-gradient-${name}`] = {
            backgroundImage: `linear-gradient(to right, ${value}, ${value})`,
          };
        }
        return acc;
      }, {} as Record<string, { backgroundImage: string }>);
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
    function({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        '.bg-clip-text': {
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
        },
        '.text-fill-transparent': {
          '-webkit-text-fill-color': 'transparent',
        },
        '.bg-gradient-text': {
          'background-image': 'linear-gradient(to right, var(--tw-gradient-stops))',
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
          'color': 'transparent',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
} satisfies Config;

export default withUt(config);
