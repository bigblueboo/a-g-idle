import { BALANCE } from "../balance";
import { BENCHMARKS, RIVAL_NAMES } from "../../content/benchmarks";
import { reachRung } from "../capability";
import { clamp } from "../formulas";
import { pushLog, setTicker } from "../log";
import { nextRandom } from "../rng";
import type { State } from "../state";
import type { System } from "../system";

const R = BALANCE.race;
const REL = BALANCE.release;

export type ReleaseMode = "ship" | "eval" | "staged";

export function initRivals(s: State): void {
  s.rivals = RIVAL_NAMES.map((name, i) => ({ name, kappa: Math.max(0, s.rung - 0.6 + 0.3 * i), pace: R.rivalPace * (0.85 + 0.15 * i), taken: 0 }));
}

function claimBenchmarks(s: State): void {
  for (const b of BENCHMARKS) {
    const st = s.benchmarks[b.id];
    if (!st || st.takenBy) continue;
    if (s.rung >= b.rung) {
      st.takenBy = "you";
      pushLog(s, `${b.name}: yours. The leaderboard updates overnight.`);
      continue;
    }
    const rival = s.rivals.find((r) => r.kappa >= b.rung);
    if (rival) {
      st.takenBy = rival.name;
      rival.taken += 1;
      pushLog(s, `${rival.name} takes ${b.name}. Their post goes up before your paper does.`);
      setTicker(s, `${rival.name} takes ${b.name}.`, 15);
    }
  }
}

/** Three labs on the leaderboard, rubber-banded so the race stays close. */
export const race: System = {
  id: "race",
  eras: [4, 5],
  tick(s, dt) {
    for (const r of s.rivals) r.kappa += r.pace * (1 + R.rubberBand * (s.rung - r.kappa)) * dt;
    claimBenchmarks(s);
  },
};

function incident(s: State): void {
  s.incidents += 1;
  s.trust = clamp(s.trust + REL.incidentTrust, 0, 1);
  s.opsMod = { until: s.t + REL.capSeconds, mult: 0.5 };
  pushLog(s, `Incident ${s.incidents}. The model did something nobody had evaluated for. A regulator caps your compute for ${REL.capSeconds} seconds.`, "system");
  setTicker(s, "Incident. Compute capped.", 20);
}

export function release(s: State, mode: ReleaseMode): boolean {
  const rel = s.training.release;
  if (!rel) return false;
  s.training.release = null;
  const incidentChance = REL.incidentBase * Math.max(1, rel.rung - 7);
  if (mode === "ship") {
    s.trust = clamp(s.trust + REL.shipTrust, 0, 1);
    s.valuation += 0.3;
    pushLog(s, "Shipped. The launch post is three paragraphs. The evals are a footnote.");
    if (nextRandom(s) < incidentChance) incident(s);
  } else if (mode === "eval") {
    s.trust = clamp(s.trust + REL.evalTrust, 0, 1);
    for (const r of s.rivals) r.kappa += 0.3;
    pushLog(s, "Held for evals. Six weeks. A rival ships something comparable in week four.");
  } else {
    s.trust = clamp(s.trust + REL.stagedTrust, 0, 1);
    s.valuation += 0.1;
    pushLog(s, "Staged rollout. Ten percent of users, then fifty, then everyone.");
    if (nextRandom(s) < incidentChance * 0.3) incident(s);
  }
  reachRung(s, rel.rung);
  return true;
}
