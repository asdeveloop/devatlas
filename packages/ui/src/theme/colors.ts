export const colorPalette = {
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617"
  },
  blue: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554"
  },
  cyan: {
    50: "#ecfeff",
    100: "#cffafe",
    200: "#a5f3fc",
    300: "#67e8f9",
    400: "#22d3ee",
    500: "#06b6d4",
    600: "#0891b2",
    700: "#0e7490",
    800: "#155e75",
    900: "#164e63",
    950: "#083344"
  },
  emerald: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
    950: "#022c22"
  },
  amber: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
    950: "#451a03"
  },
  rose: {
    50: "#fff1f2",
    100: "#ffe4e6",
    200: "#fecdd3",
    300: "#fda4af",
    400: "#fb7185",
    500: "#f43f5e",
    600: "#e11d48",
    700: "#be123c",
    800: "#9f1239",
    900: "#881337",
    950: "#4c0519"
  },
  white: "#ffffff",
  black: "#020617"
} as const;

export const semanticColors = {
  light: {
    background: colorPalette.slate[50],
    foreground: colorPalette.slate[900],
    card: colorPalette.white,
    cardForeground: colorPalette.slate[900],
    popover: colorPalette.white,
    popoverForeground: colorPalette.slate[900],
    primary: colorPalette.blue[600],
    primaryForeground: colorPalette.white,
    secondary: colorPalette.slate[100],
    secondaryForeground: colorPalette.slate[900],
    muted: colorPalette.slate[100],
    mutedForeground: colorPalette.slate[600],
    accent: colorPalette.cyan[100],
    accentForeground: colorPalette.slate[900],
    destructive: colorPalette.rose[600],
    border: colorPalette.slate[200],
    input: colorPalette.slate[200],
    ring: colorPalette.blue[500],
    success: colorPalette.emerald[600],
    warning: colorPalette.amber[500]
  },
  dark: {
    background: colorPalette.slate[950],
    foreground: colorPalette.slate[50],
    card: colorPalette.slate[900],
    cardForeground: colorPalette.slate[50],
    popover: colorPalette.slate[900],
    popoverForeground: colorPalette.slate[50],
    primary: colorPalette.blue[400],
    primaryForeground: colorPalette.slate[950],
    secondary: colorPalette.slate[800],
    secondaryForeground: colorPalette.slate[50],
    muted: colorPalette.slate[800],
    mutedForeground: colorPalette.slate[400],
    accent: colorPalette.cyan[900],
    accentForeground: colorPalette.slate[50],
    destructive: colorPalette.rose[500],
    border: colorPalette.slate[800],
    input: colorPalette.slate[800],
    ring: colorPalette.blue[400],
    success: colorPalette.emerald[500],
    warning: colorPalette.amber[400]
  }
} as const;

export type ColorPalette = typeof colorPalette;
export type SemanticColorScale = typeof semanticColors.light;
