import { describe, expect, it } from "vitest";
import { filterBusinesses, groupByCategory, toSummary } from "@/lib/search";
import type { Business } from "@/lib/schema";

const make = (slug: string, name: string, category: Business["category"], service: string): Business => ({
  slug,
  name,
  category,
  services: [{ name: service }],
  hours: "9-18",
  neighborhood: "Center",
  whatsapp: "5511999990000",
  publicationConsent: true,
});

const items = [make("a", "Bakery", "Alimentação", "Bread"), make("b", "Salon", "Beleza", "Haircut")].map(toSummary);

describe("search", () => {
  it("returns everything for an empty query", () => {
    expect(filterBusinesses(items, "  ")).toHaveLength(2);
  });

  it("matches by name and by service ignoring accents", () => {
    expect(filterBusinesses(items, "bakery").map((i) => i.slug)).toEqual(["a"]);
    expect(filterBusinesses(items, "HAIRCUT").map((i) => i.slug)).toEqual(["b"]);
    expect(filterBusinesses(items, "xyz")).toEqual([]);
  });

  it("groups by category sorted alphabetically", () => {
    expect(groupByCategory(items).map(([c]) => c)).toEqual(["Alimentação", "Beleza"]);
  });
});
