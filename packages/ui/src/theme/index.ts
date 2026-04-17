import { semanticColors } from "./colors";
import { radius } from "./radius";
import { shadows } from "./shadows";
import { spacing } from "./spacing";
import { fontFamily, fontSize } from "./typography";

export * from "./colors";
export * from "./radius";
export * from "./shadows";
export * from "./spacing";
export * from "./tokens";
export * from "./typography";

const tailwindFontFamily = {
  sans: [...fontFamily.sans],
  mono: [...fontFamily.mono]
};

const tailwindFontSize = Object.fromEntries(
  Object.entries(fontSize).map(([key, [size, config]]) => [key, [size, { ...config }]])
);

export const tailwindThemeExtension = {
  colors: {
    border: "hsl(var(--border))",
    input: "hsl(var(--input))",
    ring: "hsl(var(--ring))",
    background: "hsl(var(--background))",
    foreground: "hsl(var(--foreground))",
    primary: {
      DEFAULT: "hsl(var(--primary))",
      foreground: "hsl(var(--primary-foreground))"
    },
    secondary: {
      DEFAULT: "hsl(var(--secondary))",
      foreground: "hsl(var(--secondary-foreground))"
    },
    destructive: {
      DEFAULT: "hsl(var(--destructive))",
      foreground: "hsl(var(--destructive-foreground))"
    },
    muted: {
      DEFAULT: "hsl(var(--muted))",
      foreground: "hsl(var(--muted-foreground))"
    },
    accent: {
      DEFAULT: "hsl(var(--accent))",
      foreground: "hsl(var(--accent-foreground))"
    },
    popover: {
      DEFAULT: "hsl(var(--popover))",
      foreground: "hsl(var(--popover-foreground))"
    },
    card: {
      DEFAULT: "hsl(var(--card))",
      foreground: "hsl(var(--card-foreground))"
    },
    success: {
      DEFAULT: "hsl(var(--success))",
      foreground: "hsl(var(--success-foreground))"
    },
    warning: {
      DEFAULT: "hsl(var(--warning))",
      foreground: "hsl(var(--warning-foreground))"
    }
  },
  borderRadius: {
    lg: "var(--radius-lg)",
    md: "var(--radius-md)",
    sm: "var(--radius-sm)"
  },
  boxShadow: {
    xs: "var(--shadow-xs)",
    sm: "var(--shadow-sm)",
    md: "var(--shadow-md)",
    lg: "var(--shadow-lg)",
    xl: "var(--shadow-xl)",
    focus: "var(--shadow-focus)"
  },
  spacing,
  fontFamily: tailwindFontFamily,
  fontSize: tailwindFontSize
};

function hexToHslChannels(hex: string): string {
  const sanitized = hex.replace("#", "");
  const normalized =
    sanitized.length === 3
      ? sanitized
          .split("")
          .map((value) => `${value}${value}`)
          .join("")
      : sanitized;
  const red = Number.parseInt(normalized.slice(0, 2), 16) / 255;
  const green = Number.parseInt(normalized.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(normalized.slice(4, 6), 16) / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  const lightness = (max + min) / 2;

  if (delta === 0) {
    return `0 0% ${Math.round(lightness * 100)}%`;
  }

  const saturation =
    delta / (1 - Math.abs(2 * lightness - 1));

  let hue = 0;
  if (max === red) {
    hue = ((green - blue) / delta) % 6;
  } else if (max === green) {
    hue = (blue - red) / delta + 2;
  } else {
    hue = (red - green) / delta + 4;
  }

  const normalizedHue = Math.round(hue * 60 < 0 ? hue * 60 + 360 : hue * 60);
  const normalizedSaturation = Math.round(saturation * 1000) / 10;
  const normalizedLightness = Math.round(lightness * 1000) / 10;

  return `${normalizedHue} ${normalizedSaturation}% ${normalizedLightness}%`;
}

export function createThemeCssVariables(mode: keyof typeof semanticColors): Record<string, string> {
  const palette = semanticColors[mode];

  return {
    "--background": hexToHslChannels(palette.background),
    "--foreground": hexToHslChannels(palette.foreground),
    "--card": hexToHslChannels(palette.card),
    "--card-foreground": hexToHslChannels(palette.cardForeground),
    "--popover": hexToHslChannels(palette.popover),
    "--popover-foreground": hexToHslChannels(palette.popoverForeground),
    "--primary": hexToHslChannels(palette.primary),
    "--primary-foreground": hexToHslChannels(palette.primaryForeground),
    "--secondary": hexToHslChannels(palette.secondary),
    "--secondary-foreground": hexToHslChannels(palette.secondaryForeground),
    "--muted": hexToHslChannels(palette.muted),
    "--muted-foreground": hexToHslChannels(palette.mutedForeground),
    "--accent": hexToHslChannels(palette.accent),
    "--accent-foreground": hexToHslChannels(palette.accentForeground),
    "--destructive": hexToHslChannels(palette.destructive),
    "--destructive-foreground": hexToHslChannels("#ffffff"),
    "--border": hexToHslChannels(palette.border),
    "--input": hexToHslChannels(palette.input),
    "--ring": hexToHslChannels(palette.ring),
    "--success": hexToHslChannels(palette.success),
    "--success-foreground": hexToHslChannels("#ffffff"),
    "--warning": hexToHslChannels(palette.warning),
    "--warning-foreground": hexToHslChannels("#111827"),
    "--radius-sm": radius.sm,
    "--radius-md": radius.md,
    "--radius-lg": radius.lg,
    "--shadow-xs": shadows.xs,
    "--shadow-sm": shadows.sm,
    "--shadow-md": shadows.md,
    "--shadow-lg": shadows.lg,
    "--shadow-xl": shadows.xl,
    "--shadow-focus": shadows.focus
  };
}
