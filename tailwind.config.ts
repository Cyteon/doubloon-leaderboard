import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors: {
        "red": "#ec3750",
        "orange": "#ff8c37",
        "yellow": "#f1c40f",
        "green": "#33d6a6",
        "cyan": "#5bc0de",
        "blue": "#338eda",
        "purple": "#a633d6",
        "muted": "#8492a6",
        "base": "#121217",
        "text": "#f9fafc",
        "surface": "#17171d",
        "border": "#252429",
      }
    }
  },

  plugins: []
} satisfies Config;
