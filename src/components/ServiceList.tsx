import { formatPrice } from "@/lib/format";
import type { Service } from "@/lib/schema";

export function ServiceList({ services }: { services: Service[] }) {
  return (
    <ul className="divide-y divide-slate-100">
      {services.map((s) => (
        <li key={s.name} className="flex items-start justify-between gap-4 py-3">
          <span>
            <span className="font-medium">{s.name}</span>
            {s.description && <span className="block text-sm text-slate-700">{s.description}</span>}
          </span>
          <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${s.price !== undefined ? "bg-teal-50 text-teal-900" : "bg-slate-100 text-slate-800"}`}>
            {s.price !== undefined ? formatPrice(s.price) : "Sob consulta"}
          </span>
        </li>
      ))}
    </ul>
  );
}
