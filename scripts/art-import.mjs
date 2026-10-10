// Copies generated originals from art/raw/<kind>/<id>.png into src/art/<kind>/<id>.jpg at a
// shipping size, via macOS sips. Idempotent: skips files whose output is newer than the source.
// Usage: node scripts/art-import.mjs
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/** Shipping edge in px. Labels and thumbnails render at 56–64 CSS px; heroes fill a phone's width. */
const SIZE = { gen: 256, spot: 256, note: 320, rung: 320, era: 768 };
const QUALITY = "70";
const raw = "art/raw";
let done = 0;
for (const kind of Object.keys(SIZE)) {
  const dir = join(raw, kind);
  if (!existsSync(dir)) continue;
  mkdirSync(join("src/art", kind), { recursive: true });
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".png"))) {
    const src = join(dir, file);
    const out = join("src/art", kind, file.replace(/\.png$/, ".jpg"));
    if (existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs) continue;
    execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", QUALITY, "-Z", String(SIZE[kind]), src, "--out", out], { stdio: "ignore" });
    done += 1;
  }
}
console.log(`${done} converted`);
