/**
 * Translation scaffold — reads en.json and creates stub files for other locales.
 * Run: bun run scripts/translate.ts
 *
 * In production, this would call a translation API (DeepL, Google Translate, etc.)
 * For now it copies the English keys as placeholders.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const MESSAGES_DIR = join(import.meta.dirname ?? ".", "../src/i18n/messages");
const SOURCE_LOCALE = "en";
const TARGET_LOCALES = ["fr", "es", "de", "pt"];

function main() {
  const sourcePath = join(MESSAGES_DIR, `${SOURCE_LOCALE}.json`);
  const source = JSON.parse(readFileSync(sourcePath, "utf-8"));

  for (const locale of TARGET_LOCALES) {
    const targetPath = join(MESSAGES_DIR, `${locale}.json`);

    if (existsSync(targetPath)) {
      console.log(`[skip] ${locale}.json already exists`);
      continue;
    }

    writeFileSync(targetPath, JSON.stringify(source, null, 2) + "\n", "utf-8");
    console.log(`[created] ${locale}.json (stub from English)`);
  }

  console.log("\nDone. Translate the stub files or integrate a translation API.");
}

main();
