import { describe, expect, it } from "vitest";
import { CATEGORY_ACTIONS, CATEGORY_THEMES } from "@/lib/category";
import { CATEGORIES } from "@/lib/schema";

describe("CATEGORY_THEMES", () => {
  it("defines a theme for every category", () => {
    expect(Object.keys(CATEGORY_THEMES).sort()).toEqual([...CATEGORIES].sort());
    for (const theme of Object.values(CATEGORY_THEMES)) {
      expect(theme.dot).toContain("bg-");
      expect(theme.gradient).toContain("from-");
    }
  });

  it("defines a WhatsApp action that addresses the business for every category", () => {
    expect(Object.keys(CATEGORY_ACTIONS).sort()).toEqual([...CATEGORIES].sort());
    for (const action of Object.values(CATEGORY_ACTIONS)) {
      expect(action.label).toMatch(/no WhatsApp$/);
      expect(action.message("Loja X")).toContain("Loja X");
    }
  });
});
