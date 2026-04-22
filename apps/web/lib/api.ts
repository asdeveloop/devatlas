import { guidesClient, toolsClient } from './api-client';

export async function fetchGuides(query?: Record<string, string | number | undefined>) {
  const response = await guidesClient.list(query);
  return {
    items: response.data,
    meta: response.meta,
  };
}

export async function fetchGuide(slug: string) {
  const response = await guidesClient.getBySlug(slug);
  return response.data;
}

export async function fetchTools(query?: Record<string, string | number | undefined>) {
  const response = await toolsClient.list(query);
  return {
    items: response.data,
    meta: response.meta,
  };
}
