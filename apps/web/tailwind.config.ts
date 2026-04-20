import type { Config } from "tailwindcss";

import { tailwindThemeExtension } from "../../packages/ui/src/theme";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: tailwindThemeExtension as unknown as NonNullable<Config["theme"]>["extend"]
  },
  plugins: []
};

export default config;
