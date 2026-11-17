import { describe, expect, it } from "vitest";
import { contactLink, formatDays, formatHours, formatPhone, formatTime, normalize, normalizeWhatsapp, slugify } from "@/lib/format";

describe("format", () => {
  it("builds a wa.me link with the message of the business category", () => {
    const url = new URL(contactLink({ whatsapp: "5548999990000", name: "Café & Cia", category: "Varejo" }));
    expect(url.origin + url.pathname).toBe("https://wa.me/5548999990000");
    expect(url.searchParams.get("text")).toContain("finalizar uma compra");
    expect(url.searchParams.get("text")).toContain("Café & Cia");
  });

  it("slugifies names removing accents and symbols", () => {
    expect(slugify("  Padaria São João!! ")).toBe("padaria-sao-joao");
  });

  it("normalizes accents and case", () => {
    expect(normalize("ÁguA")).toBe("agua");
  });
});

describe("phone and hours", () => {
  it("masks a Brazilian phone while typing", () => {
    expect(formatPhone("")).toBe("");
    expect(formatPhone("4")).toBe("(4");
    expect(formatPhone("48")).toBe("(48");
    expect(formatPhone("489999")).toBe("(48) 9999");
    expect(formatPhone("4899999000")).toBe("(48) 9999-9000");
    expect(formatPhone("48999990000")).toBe("(48) 99999-0000");
    expect(formatPhone("4899999000099")).toBe("(48) 99999-0000");
  });

  it("adds the country code only when missing", () => {
    expect(normalizeWhatsapp("(48) 99999-0000")).toBe("5548999990000");
    expect(normalizeWhatsapp("(48) 9999-0000")).toBe("554899990000");
    expect(normalizeWhatsapp("5548999990000")).toBe("5548999990000");
  });

  it("formats times and day ranges", () => {
    expect(formatTime("09:00")).toBe("9h");
    expect(formatTime("18:30")).toBe("18h30");
    expect(formatDays([1, 2, 3, 4, 5])).toBe("Seg a Sex");
    expect(formatDays([1, 3])).toBe("Seg, Qua");
    expect(formatDays([1, 2, 3, 4, 5, 6, 0])).toBe("Todos os dias");
    expect(formatDays([6, 0, 1])).toBe("Seg, Sáb, Dom");
    expect(formatHours([1, 2, 3, 4, 5, 6], "09:00", "18:00")).toBe("Seg a Sáb, 9h às 18h");
  });
});
