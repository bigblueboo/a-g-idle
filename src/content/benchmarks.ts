import type { BenchmarkDef } from "../core/content-types";

/** The wall of benchmarks. Market is $/s at perfect accuracy; rung is where it falls. */
export const BENCHMARKS: readonly BenchmarkDef[] = [
  { id: "digits", name: "Handwritten digits", market: 40, rung: 4 },
  { id: "spam", name: "Spam filtering", market: 120, rung: 5 },
  { id: "chess", name: "Chess", market: 60, rung: 5 },
  { id: "search", name: "Search ranking", market: 400, rung: 5 },
  { id: "recs", name: "Recommendations", market: 300, rung: 6 },
  { id: "speech", name: "Speech recognition", market: 250, rung: 6 },
  { id: "faces", name: "Face detection", market: 180, rung: 6 },
  { id: "imagenet", name: "ImageNet", market: 500, rung: 6 },
  { id: "go", name: "Go", market: 80, rung: 7 },
  { id: "translation", name: "Translation", market: 350, rung: 7 },
];

export const RIVAL_NAMES = ["Tessellate", "Hollis & Vane", "Nineteen Labs"] as const;
