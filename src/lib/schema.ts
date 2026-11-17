import { z } from "zod";

export const CATEGORIES = [
  "Alimentação",
  "Automotivo",
  "Beleza",
  "Casa e Construção",
  "Educação",
  "Eventos e Festas",
  "Moda",
  "Pet",
  "Reparos e Manutenção",
  "Saúde",
  "Serviços",
  "Varejo",
] as const;

export const PAYMENT_METHODS = ["Pix", "Dinheiro", "Cartão de débito", "Cartão de crédito", "Vale-refeição", "Transferência"] as const;

export const RESERVED_SLUGS = ["cadastro", "qr", "404", "_next"] as const;

const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use letras minúsculas, números e hífens")
  .max(60)
  .refine((s) => !(RESERVED_SLUGS as readonly string[]).includes(s), "Endereço reservado");

const serviceSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do serviço").max(80, "Use até 80 caracteres"),
  price: z.number().nonnegative().max(100000).optional(),
  description: z.string().trim().max(120, "Use até 120 caracteres").optional(),
});

export const businessSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(2, "Informe o nome do negócio").max(80, "Use até 80 caracteres"),
  category: z.enum(CATEGORIES, { error: "Escolha uma categoria" }),
  description: z.string().trim().min(10, "Use ao menos 10 caracteres").max(240, "Use até 240 caracteres").optional(),
  services: z.array(serviceSchema).min(1, "Adicione ao menos um serviço").max(30, "Use até 30 serviços"),
  hours: z.string().trim().min(3, "Informe o horário").max(120, "Use até 120 caracteres"),
  neighborhood: z.string().trim().min(2, "Informe o bairro").max(60, "Use até 60 caracteres"),
  address: z.string().trim().max(160).optional(),
  photo: z.string().max(300).optional(),
  whatsapp: z.string().regex(/^\d{12,13}$/, "Informe o WhatsApp com DDD, ex.: (48) 99999-0000"),
  payments: z.array(z.enum(PAYMENT_METHODS)).max(PAYMENT_METHODS.length).optional(),
  delivery: z.boolean().optional(),
  publicationConsent: z.literal(true, { error: "A autorização de publicação é obrigatória" }),
});

export type Business = z.infer<typeof businessSchema>;
export type Service = z.infer<typeof serviceSchema>;
