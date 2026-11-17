import { describe, expect, it } from "vitest";
import { businessSchema } from "@/lib/schema";

const valid = {
  slug: "my-shop",
  name: "My Shop",
  category: "Varejo",
  description: "A small shop for the neighborhood.",
  services: [{ name: "Item", price: 10 }],
  hours: "Mon-Fri 9-18",
  neighborhood: "Center",
  whatsapp: "5511999990000",
  publicationConsent: true,
};

describe("businessSchema", () => {
  it("accepts a valid business", () => {
    expect(businessSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects missing consent", () => {
    expect(businessSchema.safeParse({ ...valid, publicationConsent: false }).success).toBe(false);
  });

  it("rejects reserved and malformed slugs", () => {
    expect(businessSchema.safeParse({ ...valid, slug: "cadastro" }).success).toBe(false);
    expect(businessSchema.safeParse({ ...valid, slug: "Bad Slug" }).success).toBe(false);
  });

  it("rejects invalid whatsapp and empty services", () => {
    expect(businessSchema.safeParse({ ...valid, whatsapp: "123" }).success).toBe(false);
    expect(businessSchema.safeParse({ ...valid, services: [] }).success).toBe(false);
  });

  it("accepts payments, delivery and service description", () => {
    const result = businessSchema.safeParse({
      ...valid,
      payments: ["Dinheiro"],
      delivery: true,
      services: [{ name: "Item", description: "Detalhe" }],
    });
    expect(result.success).toBe(true);
  });

  it("rejects unknown payment methods", () => {
    expect(businessSchema.safeParse({ ...valid, payments: ["Fiado"] }).success).toBe(false);
  });

  it("rejects invalid optional fields when present", () => {
    expect(businessSchema.safeParse({ ...valid, description: "curta" }).success).toBe(false);
    expect(businessSchema.safeParse({ ...valid, photo: "x".repeat(301) }).success).toBe(false);
  });
});
