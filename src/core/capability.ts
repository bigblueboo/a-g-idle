import { NOW_YEAR, RUNGS } from "../content/rungs";
import { pushLog, setTicker } from "./log";
import type { State } from "./state";

export function rungName(rung: number): string {
  if (rung < 0) return "Unmeasured";
  return RUNGS[rung]?.name ?? RUNGS[RUNGS.length - 1]?.name ?? "";
}

/** Lead in years for a rung reached, or null past the NOW line / unreached. */
export function leadFor(s: State, rung: number): number | null {
  const year = RUNGS[rung]?.year;
  const reached = s.rungYears[rung];
  if (year === undefined || reached === undefined || year > NOW_YEAR) return null;
  return Math.round(year - reached);
}

export function totalLead(s: State): number {
  let lead = 0;
  for (let r = 0; r < RUNGS.length; r++) lead += leadFor(s, r) ?? 0;
  return lead;
}

/** Climb to `rung` if it's higher than where we are. Each new rung gets a card. */
export function reachRung(s: State, rung: number): boolean {
  const target = Math.min(RUNGS.length - 1, Math.floor(rung));
  if (target <= s.rung) return false;
  for (let r = s.rung + 1; r <= target; r++) {
    s.rungYears[r] = s.year;
    const lead = leadFor(s, r);
    const card = lead === null ? `Capability: ${rungName(r)}.` : `Capability: ${rungName(r)}. Lead ${lead >= 0 ? "+" : ""}${lead} yrs.`;
    pushLog(s, card, "system", { kind: "rung", id: `rung${r}` });
    setTicker(s, card, 12);
  }
  s.rung = target;
  return true;
}
