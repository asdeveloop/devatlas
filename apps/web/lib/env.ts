export const webEnv = {
  appName: "DevAtlas",
  apiBaseUrl: process.env["NEXT_PUBLIC_API_BASE_URL"] ?? "http://localhost:3001"
} as const;
