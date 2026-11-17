import { describe, expect, it } from "vitest";
import { loadBusinesses } from "@/lib/businesses";
import { submissionLink, submissionMessage } from "@/lib/submission";

describe("submission", () => {
  const [business] = loadBusinesses();

  it("builds a message with the business name, file name and parseable JSON", () => {
    const message = submissionMessage(business!);
    expect(message).toContain(`Negócio: ${business!.name}`);
    expect(message).toContain(`Arquivo: ${business!.slug}.json`);
    const json = message.split("```")[1]!.trim();
    expect(JSON.parse(json)).toEqual(business);
  });

  it("builds a wa.me link to the admin number carrying the message", () => {
    const url = new URL(submissionLink(business!, "5511999999999"));
    expect(url.origin + url.pathname).toBe("https://wa.me/5511999999999");
    expect(url.searchParams.get("text")).toBe(submissionMessage(business!));
  });
});
