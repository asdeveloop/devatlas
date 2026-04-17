import { describe, expect, it, vi } from "vitest";

import { ApiClient, ApiClientError, resolveEndpoint } from "../../../packages/utils/src";

describe("API client", () => {
  it("resolves endpoint params safely", () => {
    expect(resolveEndpoint("guideBySlug", { slug: "intro-to-ai" })).toEqual({
      path: "/guides/intro-to-ai",
      method: "GET"
    });
  });

  it("sends GET requests and returns typed payloads", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [{ slug: "platform-foundation" }]
      })
    });

    vi.stubGlobal("fetch", fetchMock);

    const client = new ApiClient({ baseUrl: "https://api.devatlas.test" });
    const response = await client.get<Array<{ slug: string }>>("guides");

    expect(fetchMock).toHaveBeenCalledWith("https://api.devatlas.test/guides", {
      method: "GET",
      headers: {
        accept: "application/json"
      }
    });
    expect(response.data[0]?.slug).toBe("platform-foundation");
  });

  it("throws structured API errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({
          error: {
            code: "NOT_FOUND",
            message: "Guide not found"
          }
        })
      })
    );

    const client = new ApiClient({ baseUrl: "https://api.devatlas.test" });

    await expect(client.get("guideBySlug", { params: { slug: "missing" } })).rejects.toEqual(
      expect.objectContaining<ApiClientError>({
        name: "ApiClientError",
        status: 404,
        code: "NOT_FOUND",
        message: "Guide not found"
      })
    );
  });
});
