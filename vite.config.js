import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from 'path';

export default defineConfig({
  
  plugins: [
    tailwindcss({
      config: {
        content: [
          "./index.html",
          "./src/**/*.{js,ts,jsx,tsx}",
        ],
        theme: {
          extend: {
            animation: {
              pop: 'pop 0.3s ease-in-out forwards',
            },
            keyframes: {
              pop: {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(0.9)' },
                '100%': { transform: 'scale(1.1)' },
              }
            },
            transitionProperty: {
              'width': 'width',
              'height': 'height',
              'spacing': 'margin, padding',
            },
          },
          fontFamily: {
        sans: ['poppins', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
        },
        plugins: [],
      }
    }),
    react()
  ],
});