import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadBusinesses } from "../src/lib/businesses";
import { qrPng } from "../src/lib/qr";
import { businessUrl } from "../src/lib/site";

const main = async (): Promise<void> => {
  const outDir = join(process.cwd(), "qr-output");
  mkdirSync(outDir, { recursive: true });
  for (const business of loadBusinesses()) {
    writeFileSync(join(outDir, `${business.slug}.png`), await qrPng(businessUrl(business.slug)));
    console.log(`qr-output/${business.slug}.png`);
  }
};

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
