import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { businessSchema, type Business } from "./schema";

export const loadBusinesses = (dir: string = join(process.cwd(), "content", "businesses")): Business[] => {
  const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
  const items = files.map((file) => {
    const parsed = businessSchema.safeParse(JSON.parse(readFileSync(join(dir, file), "utf8")));
    if (!parsed.success) {
      throw new Error(`Invalid business file ${file}:\n${parsed.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`).join("\n")}`);
    }
    if (`${parsed.data.slug}.json` !== file) {
      throw new Error(`Invalid business file ${file}: slug "${parsed.data.slug}" must match the file name`);
    }
    return parsed.data;
  });
  return items.sort((a, b) => a.name.localeCompare(b.name));
};
