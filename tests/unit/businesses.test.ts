import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadBusinesses } from "@/lib/businesses";
import { buildJsonLd } from "@/lib/jsonld";
import { qrPng, qrSvg } from "@/lib/qr";

describe("loadBusinesses", () => {
  it("loads and validates the bundled examples", () => {
    const list = loadBusinesses();
    expect(list.length).toBeGreaterThanOrEqual(2);
  });

  it("throws on invalid JSON content", () => {
    const dir = mkdtempSync(join(tmpdir(), "biz-"));
    writeFileSync(join(dir, "bad.json"), JSON.stringify({ slug: "bad" }));
    expect(() => loadBusinesses(dir)).toThrow(/Invalid business file bad.json/);
  });

  it("throws when the slug does not match the file name", () => {
    const dir = mkdtempSync(join(tmpdir(), "biz-"));
    const [first] = loadBusinesses();
    writeFileSync(join(dir, "other.json"), JSON.stringify(first));
    expect(() => loadBusinesses(dir)).toThrow(/must match the file name/);
  });
});

describe("jsonld and qr", () => {
  it("builds a LocalBusiness JSON-LD", () => {
    const [first] = loadBusinesses();
    const ld = buildJsonLd(first!, "https://example.com");
    expect(ld["@type"]).toBe("LocalBusiness");
    expect(ld.url).toBe(`https://example.com/${first!.slug}/`);
  });

  it("includes payments and service description in the JSON-LD", () => {
    const bakery = loadBusinesses().find((b) => b.slug === "padaria-pao-da-ilha")!;
    const ld = buildJsonLd(bakery, "https://example.com");
    expect(ld.paymentAccepted).toContain("Dinheiro");
    expect(ld).not.toHaveProperty("sameAs");
    expect(JSON.stringify(ld.hasOfferCatalog)).toContain(bakery.services[0]!.description);
  });

  it("renders an SVG QR code", async () => {
    expect(await qrSvg("https://example.com")).toContain("<svg");
  });

  it("renders a PNG QR code", async () => {
    const png = await qrPng("https://example.com");
    expect(png.subarray(1, 4).toString()).toBe("PNG");
  });
});
