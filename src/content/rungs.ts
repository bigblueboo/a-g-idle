import type { RungDef } from "../core/content-types";

/** The capability ladder. Years are when history got there; blank past the NOW line. */
export const RUNGS: readonly RungDef[] = [
  { name: "Does arithmetic", year: 1945 },
  { name: "Plays checkers", year: 1952 },
  { name: "Proves theorems", year: 1956 },
  { name: "Talks like a therapist", year: 1966 },
  { name: "Diagnoses blood infections", year: 1976 },
  { name: "Beats the world chess champion", year: 1997 },
  { name: "Recognizes cats", year: 2012 },
  { name: "Beats the world Go champion", year: 2016 },
  { name: "Writes a passable essay", year: 2020 },
  { name: "Passes the bar exam", year: 2023 },
  { name: "Writes working software", year: 2024 },
  { name: "Does a remote job", year: 2026 },
  { name: "Automates AI research" },
  { name: "Does any job" },
  { name: "Does all jobs at once" },
  { name: "Designs matter" },
  { name: "Models a human mind" },
  { name: "Models a civilization" },
  { name: "⟁⟒⌖" },
];

export const NOW_YEAR = 2026;
