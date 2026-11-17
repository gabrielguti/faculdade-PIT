import { normalize } from "./format";
import type { Business } from "./schema";

export type BusinessSummary = Pick<Business, "slug" | "name" | "category" | "neighborhood" | "delivery"> & {
  serviceNames: string[];
};

export const toSummary = (b: Business): BusinessSummary => ({
  slug: b.slug,
  name: b.name,
  category: b.category,
  neighborhood: b.neighborhood,
  delivery: b.delivery,
  serviceNames: b.services.map((s) => s.name),
});

export const filterBusinesses = (items: BusinessSummary[], query: string): BusinessSummary[] => {
  const q = normalize(query.trim());
  if (!q) return items;
  return items.filter(
    (i) => normalize(i.name).includes(q) || i.serviceNames.some((s) => normalize(s).includes(q)),
  );
};

export const groupByCategory = (items: BusinessSummary[]): [string, BusinessSummary[]][] => {
  const groups = new Map<string, BusinessSummary[]>();
  for (const item of items) groups.set(item.category, [...(groups.get(item.category) ?? []), item]);
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
};
