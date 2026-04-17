export type ToolTier = "Online-Required" | "Hybrid" | "Offline-Guaranteed"

const hybridRoutes = new Set(["tools", "loan", "salary", "interest", "text-tools", "calculator"])

function getPathSegments(pathname: string | null | undefined): string[] {
  return typeof pathname === "string" ? pathname.split("/").filter(Boolean) : []
}

export function getTierByPath(pathname: string | null | undefined): ToolTier {
  const segments = getPathSegments(pathname)

  if (segments.length === 0) {
    return "Offline-Guaranteed"
  }

  const first = segments[0]
  if (!first) {
    return "Offline-Guaranteed"
  }

  if (first === "loan" || first === "finance" || first === "salary") {
    return "Hybrid"
  }

  if (first === "tools" || hybridRoutes.has(first)) {
    return "Online-Required"
  }

  if (segments.includes("offline") || segments.includes("pwa")) {
    return "Offline-Guaranteed"
  }

  return "Hybrid"
}
