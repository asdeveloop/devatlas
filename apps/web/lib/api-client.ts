import { AiClient, CategoriesClient, GuidesClient, HttpClient, TagsClient, ToolsClient } from '@devatlas/api-client';

import { webEnv } from './env';

export const webHttpClient = new HttpClient({
  baseUrl: webEnv.apiBaseUrl,
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
});

export const aiClient = new AiClient(webHttpClient);
export const categoriesClient = new CategoriesClient(webHttpClient);
export const guidesClient = new GuidesClient(webHttpClient);
export const tagsClient = new TagsClient(webHttpClient);
export const toolsClient = new ToolsClient(webHttpClient);
