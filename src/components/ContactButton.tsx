import { CATEGORY_ACTIONS } from "@/lib/category";
import { contactLink } from "@/lib/format";
import type { Business } from "@/lib/schema";

export function ContactButton({ business }: { business: Pick<Business, "whatsapp" | "name" | "category"> }) {
  return (
    <a
      href={contactLink(business)}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="contact-button"
      className="flex min-h-14 w-full items-center justify-center rounded-xl bg-emerald-700 px-4 text-center text-lg font-bold text-white hover:bg-emerald-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-emerald-900"
    >
      {CATEGORY_ACTIONS[business.category].label}
    </a>
  );
}
