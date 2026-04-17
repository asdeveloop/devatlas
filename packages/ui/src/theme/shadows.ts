export const shadows = {
  xs: "0 1px 2px 0 rgb(15 23 42 / 0.05)",
  sm: "0 1px 3px 0 rgb(15 23 42 / 0.1), 0 1px 2px -1px rgb(15 23 42 / 0.08)",
  md: "0 10px 20px -8px rgb(15 23 42 / 0.16), 0 6px 10px -6px rgb(15 23 42 / 0.12)",
  lg: "0 18px 36px -12px rgb(15 23 42 / 0.18), 0 10px 16px -10px rgb(15 23 42 / 0.12)",
  xl: "0 28px 48px -20px rgb(15 23 42 / 0.24)",
  focus: "0 0 0 3px rgb(59 130 246 / 0.35)"
} as const;

export type ShadowScale = typeof shadows;
