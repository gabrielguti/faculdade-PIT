"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PinIcon } from "@/components/Icons";
import { CATEGORY_THEMES } from "@/lib/category";
import { slugify } from "@/lib/format";
import type { Business } from "@/lib/schema";
import { filterBusinesses, groupByCategory, type BusinessSummary } from "@/lib/search";

export function BusinessSearch({ items }: { items: BusinessSummary[] }) {
  const [query, setQuery] = useState("");
  const groups = useMemo(() => groupByCategory(filterBusinesses(items, query)), [items, query]);

  return (
    <div>
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <label htmlFor="search" className="block text-base font-semibold">
          Buscar por nome ou serviço
        </label>
        <input
          id="search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ex.: ostras, corte de cabelo, eletricista"
          className="mt-2 min-h-12 w-full rounded-xl border border-slate-400 bg-white px-4 text-base focus-visible:outline-3 focus-visible:outline-teal-700"
        />
      </div>

      <div aria-live="polite" className="mt-8 space-y-10">
        {groups.length === 0 && <p className="rounded-xl bg-white p-6 text-center ring-1 ring-slate-200">Nenhum negócio encontrado.</p>}
        {groups.map(([category, list]) => {
          const theme = CATEGORY_THEMES[category as Business["category"]];
          const headingId = `cat-${slugify(category)}`;
          return (
            <section key={category} aria-labelledby={headingId}>
              <h2 id={headingId} className="mb-4 flex items-center gap-3 text-xl font-bold">
                <span aria-hidden="true" className={`h-6 w-1.5 rounded-full ${theme.dot}`} />
                {category}
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((b) => (
                  <li key={b.slug}>
                    <Link
                      href={`/${b.slug}/`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                    >
                      <span aria-hidden="true" className={`block h-2 bg-gradient-to-r ${theme.gradient}`} />
                      <span className="flex flex-1 flex-col gap-2 p-4">
                        <span className="text-lg font-bold leading-tight group-hover:text-teal-800">{b.name}</span>
                        <span className="line-clamp-1 text-sm text-slate-700">{b.serviceNames.join(" · ")}</span>
                        <span className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-sm text-slate-700">
                          <span className="inline-flex items-center gap-1">
                            <PinIcon />
                            {b.neighborhood}
                          </span>
                          {b.delivery && <span className="font-semibold text-teal-800">Faz entregas</span>}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
