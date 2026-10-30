import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const parts = [
  "01-runtime.js", "02-early-levels.js", "03-germany.js",
  "04-chase.js", "05-courier-cafe.js", "06-training.js",
  "07-engine.js", "08-controls.js",
];
const source = (await Promise.all(parts.map((name) => readFile(join(root, "js", name), "utf8")))).join("");
await writeFile(join(root, "game.js"), source, "utf8");
console.log(`Built game.js from ${parts.length} source modules.`);
