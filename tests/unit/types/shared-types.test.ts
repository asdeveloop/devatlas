import { describe, expectTypeOf, it } from "vitest";

import type { ApiSuccess, Guide, GuideRecord, Tool } from "../../../packages/types/src";

describe("shared types", () => {
  it("keeps API success payloads generic", () => {
    expectTypeOf<ApiSuccess<Guide[]>>().toEqualTypeOf<{
      data: Guide[];
      meta?: Record<string, unknown> | undefined;
    }>();
  });

  it("aligns content and database identifiers", () => {
    expectTypeOf<Guide["id"]>().toEqualTypeOf<GuideRecord["id"]>();
    expectTypeOf<Tool["categoryId"]>().toEqualTypeOf<string>();
  });
});
