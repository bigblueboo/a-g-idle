// Builds art/manifest.json: one image prompt per generator, event, rung, era, and serendipity item,
// in a consistent printed-label style, so an image-generation run can produce the whole set.
// Usage: npx tsx scripts/art-manifest.ts

import { mkdirSync, writeFileSync } from "node:fs";
import { ERAS } from "../src/content";
import { RUNGS } from "../src/content/rungs";

const ACCENT: Record<number, string> = {
  0: "brass orange #b8732a",
  1: "steel blue #1f5f8b",
  2: "phosphor green #3fbf5a",
  3: "navy #0a246a",
  4: "signal orange #ff8c42",
  5: "teal green #10a37f",
  6: "violet #8b6cf0",
  7: "umber #8a6d4e",
  8: "cyan #3aa8d8",
  9: "gold #d9a83a",
};

const LABEL_STYLE = (accent: string) =>
  `Style: a small spot illustration printed on an equipment label. 1970s technical-manual line art, black ink with two flat halftone tones (warm grey and ${accent}), on a plain cream #f3ead8 background. Centered subject, generous margin, no text, no lettering, no border, no frame, square composition.`;

const NOTE_STYLE = (accent: string) =>
  `Style: an archival photograph reproduced as a halftone print in a 1970s technical magazine, monochrome duotone in warm grey and ${accent}, visible dot screen, grainy, slightly faded. No text, no captions, no lettering, square composition.`;

const decade = (y: number): string => `${Math.floor(y / 10) * 10}s`;

interface Entry {
  kind: "gen" | "note" | "rung" | "era" | "spot";
  id: string;
  name: string;
  prompt: string;
}

const entries: Entry[] = [];

for (const era of ERAS) {
  const accent = ACCENT[era.id] ?? "warm grey";
  for (const g of era.generators) {
    entries.push({ kind: "gen", id: g.id, name: g.name, prompt: `Subject: ${g.name}, ${decade(g.introYear ?? era.years[0])}. ${g.desc} ${LABEL_STYLE(accent)}` });
  }
  for (const e of era.events) {
    entries.push({ kind: "note", id: e.id, name: e.title, prompt: `Subject: ${e.title}, ${Math.floor(e.year)}. ${e.text} ${NOTE_STYLE(accent)}` });
  }
  for (const d of era.serendipity) {
    entries.push({ kind: "spot", id: d.id, name: d.label, prompt: `Subject: ${d.label}. ${d.text} ${LABEL_STYLE(accent)}` });
  }
  entries.push({ kind: "era", id: `era${era.id}`, name: era.name, prompt: `Subject: ${era.name}, ${era.years[0]}. ${era.blurb} A wide establishing scene of the technology of that moment. ${NOTE_STYLE(accent)}` });
}

RUNGS.forEach((r, i) => {
  const eraForYear = ERAS.find((e) => (r.year ?? 2040) < e.years[1]) ?? ERAS[9];
  const accent = ACCENT[eraForYear?.id ?? 9] ?? "warm grey";
  entries.push({ kind: "rung", id: `rung${i}`, name: r.name, prompt: `Subject: a machine that ${r.name.toLowerCase()}${r.year ? `, ${r.year}` : ", far future"}. ${NOTE_STYLE(accent)}` });
});

// Historical projects, as notes: everything with a year, which is the pre-2027 canon.
for (const era of ERAS) {
  const accent = ACCENT[era.id] ?? "warm grey";
  for (const p of era.projects) {
    if (p.year === undefined) continue;
    entries.push({ kind: "note", id: p.id, name: p.name, prompt: `Subject: ${p.name}, ${p.year}. ${p.fact} ${NOTE_STYLE(accent)}` });
  }
}

mkdirSync("art", { recursive: true });
writeFileSync("art/manifest.json", JSON.stringify(entries, null, 2));
const counts = entries.reduce<Record<string, number>>((acc, e) => ((acc[e.kind] = (acc[e.kind] ?? 0) + 1), acc), {});
console.log(`${entries.length} entries`, counts);
