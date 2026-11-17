import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("cadastro gera JSON válido e exige autorização", async ({ page }) => {
  await page.goto("/cadastro/");
  await page.getByLabel("Nome do negócio").fill("Loja Teste");
  await page.getByLabel("WhatsApp").fill("48999990000");
  await expect(page.getByLabel("WhatsApp")).toHaveValue("(48) 99999-0000");
  await page.getByLabel("Nome do serviço").fill("Corte de cabelo");
  await page.getByLabel("Preço (R$)").fill("50,00");
  await page.getByLabel("Observação").fill("Inclui lavagem");
  await expect(page.getByText("Seg a Sáb, 9h às 18h")).toBeVisible();
  await page.getByText("Mais opções").click();
  await page.getByLabel("Cartão de débito").check();
  await page.getByLabel("Faço entregas").check();

  await page.getByRole("button", { name: /Gerar/ }).click();
  await expect(page.getByTestId("form-errors")).toContainText("Autorização");

  await page.getByLabel(/Autorizo/).check();
  const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: /Gerar/ }).click()]);
  expect(download.suggestedFilename()).toBe("loja-teste.json");
  await expect(page.getByTestId("form-success")).toBeVisible();
  const sendHref = await page.getByTestId("send-whatsapp").getAttribute("href");
  expect(sendHref).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
  expect(decodeURIComponent(sendHref!)).toContain('"slug":"loja-teste"');
  const json = JSON.parse(await readFile((await download.path())!, "utf8"));
  expect(json).toMatchObject({
    slug: "loja-teste",
    whatsapp: "5548999990000",
    hours: "Seg a Sáb, 9h às 18h",
    publicationConsent: true,
    services: [{ name: "Corte de cabelo", price: 50, description: "Inclui lavagem" }],
    payments: ["Cartão de débito"],
    delivery: true,
  });
});

test("página exibe a ação de WhatsApp da categoria, formas de pagamento e JSON-LD", async ({ page }) => {
  await page.goto("/padaria-pao-da-ilha/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Padaria Pão da Ilha");

  await expect(page.getByTestId("contact-button")).toHaveText("Fazer pedido no WhatsApp");
  await expect(page.getByTestId("contact-button")).toHaveAttribute("href", /^https:\/\/wa\.me\/\d{12,13}\?text=/);
  await expect(page.getByText("Pix", { exact: true })).toBeVisible();

  const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
  expect(ld["@type"]).toBe("LocalBusiness");
  await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
});

test("página de QR exibe o código da URL do negócio", async ({ page }) => {
  await page.goto("/qr/padaria-pao-da-ilha/");
  await expect(page.getByTestId("qr-code").locator("svg")).toBeVisible();
  await expect(page.getByText("/padaria-pao-da-ilha/")).toBeVisible();
});

test("busca no índice filtra por serviço", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Padaria Pão da Ilha/ })).toBeVisible();
  await page.getByLabel(/Buscar/).fill("corte");
  await expect(page.getByRole("link", { name: /Padaria Pão da Ilha/ })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Salão Maré Alta/ })).toBeVisible();
});

for (const path of ["/", "/padaria-pao-da-ilha/", "/cadastro/", "/qr/padaria-pao-da-ilha/"]) {
  test(`axe sem violações em ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations).toEqual([]);
  });
}
