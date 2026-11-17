import { formatPrice } from "./format";
import type { Business } from "./schema";
import { businessUrl } from "./site";

export const buildJsonLd = (b: Business, base?: string): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: b.name,
  ...(b.description ? { description: b.description } : {}),
  url: businessUrl(b.slug, base),
  telephone: `+${b.whatsapp}`,
  openingHours: b.hours,
  address: {
    "@type": "PostalAddress",
    addressLocality: b.neighborhood,
    addressRegion: "SC",
    ...(b.address ? { streetAddress: b.address } : {}),
    addressCountry: "BR",
  },
  ...(b.payments?.length ? { paymentAccepted: b.payments.join(", ") } : {}),
  ...(b.photo ? { image: b.photo } : {}),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Serviços",
    itemListElement: b.services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.name, ...(s.description ? { description: s.description } : {}) },
      ...(s.price !== undefined ? { price: s.price, priceCurrency: "BRL", description: formatPrice(s.price) } : {}),
    })),
  },
});
