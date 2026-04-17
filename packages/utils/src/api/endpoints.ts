export type ApiEndpointDefinition = {
  path: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
};

export const apiEndpoints = {
  health: {
    path: "/health",
    method: "GET"
  },
  guides: {
    path: "/guides",
    method: "GET"
  },
  guideBySlug: {
    path: "/guides/:slug",
    method: "GET"
  },
  tools: {
    path: "/tools",
    method: "GET"
  },
  toolBySlug: {
    path: "/tools/:slug",
    method: "GET"
  }
} as const satisfies Record<string, ApiEndpointDefinition>;

export type ApiEndpointKey = keyof typeof apiEndpoints;

export function resolveEndpoint(
  endpoint: ApiEndpointKey | ApiEndpointDefinition,
  params?: Record<string, string | number>
): ApiEndpointDefinition {
  const definition = typeof endpoint === "string" ? apiEndpoints[endpoint] : endpoint;

  return {
    ...definition,
    path: Object.entries(params ?? {}).reduce(
      (resolvedPath, [key, value]) => resolvedPath.replace(`:${key}`, encodeURIComponent(String(value))),
      definition.path
    )
  };
}
