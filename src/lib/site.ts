export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://vitrine-digital.vercel.app").replace(/\/$/, "");
export const ADMIN_WHATSAPP = (process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "").replace(/\D/g, "");
export const SITE_NAME = "Vitrine Digital do Bairro";
export const REGION_NEIGHBORHOOD = "Ribeirão da Ilha";
export const REGION = "Ribeirão da Ilha, Florianópolis - SC";

export const businessUrl = (slug: string, base: string = SITE_URL): string => `${base}/${slug}/`;
