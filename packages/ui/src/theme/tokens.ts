import { colorPalette, semanticColors } from "./colors";
import { radius } from "./radius";
import { shadows } from "./shadows";
import { spacing } from "./spacing";
import { fontFamily, fontSize, fontWeight } from "./typography";

export const designTokens = {
  colors: colorPalette,
  semanticColors,
  spacing,
  typography: {
    fontFamily,
    fontSize,
    fontWeight
  },
  radius,
  shadows
} as const;

export const lightTheme = {
  colors: semanticColors.light,
  radius,
  shadows
} as const;

export const darkTheme = {
  colors: semanticColors.dark,
  radius,
  shadows
} as const;

export type DesignTokens = typeof designTokens;
export type ThemeDefinition = typeof lightTheme;
