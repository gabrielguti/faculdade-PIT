import type { Business } from "./schema";

export const submissionMessage = (business: Business): string =>
  [
    "Olá! Quero cadastrar meu negócio na Vitrine Digital do Bairro.",
    "",
    `Negócio: ${business.name}`,
    `Arquivo: ${business.slug}.json`,
    "",
    "```",
    JSON.stringify(business),
    "```",
  ].join("\n");

export const submissionLink = (business: Business, adminNumber: string): string =>
  `https://wa.me/${adminNumber}?text=${encodeURIComponent(submissionMessage(business))}`;
