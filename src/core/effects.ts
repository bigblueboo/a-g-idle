import { reachRung } from "./capability";
import type { Effect } from "./content-types";
import { clamp } from "./formulas";
import type { State } from "./state";
import { initBenchmarks } from "./systems/benchmarks";
import { initEarth } from "./systems/earth";
import { startWinter } from "./systems/hype";
import { initMarket } from "./systems/market";
import { initRivals } from "./systems/race";

function applyEffect(s: State, e: Effect): void {
  switch (e.kind) {
    case "mult":
      s.mults[e.resource] = (s.mults[e.resource] ?? 1) * e.mult;
      return;
    case "efficiency":
      s.efficiency *= e.mult;
      return;
    case "rung":
      reachRung(s, e.rung);
      return;
    case "expectation":
      s.expectation = Math.max(0, s.expectation + e.delta);
      return;
    case "trust":
      s.trust = clamp(s.trust + e.delta, 0, 1);
      return;
    case "legibility":
      s.legibility = clamp(s.legibility + e.delta, 0, 1);
      return;
    case "fidelity":
      s.fidelity[e.part] = Math.max(0, s.fidelity[e.part] + e.delta);
      return;
    case "grant":
      s.res[e.resource] += e.amount;
      return;
    case "flag":
      s.flags[e.flag] = true;
      return;
    case "unflag":
      delete s.flags[e.flag];
      return;
    case "groundwork":
      s.groundwork += e.amount;
      return;
    case "shock":
      startWinter(s, e.name);
      return;
    case "logbook":
      if (!s.logbook.includes(e.item)) s.logbook.push(e.item);
      return;
    case "init":
      INITS[e.what](s);
      return;
    case "give":
      s.counts[e.generator] = (s.counts[e.generator] ?? 0) + e.n;
      return;
    case "alloc":
      s.alloc = { train: e.train, serve: e.serve, research: e.research };
      return;
  }
}

const INITS: Record<Extract<Effect, { kind: "init" }>["what"], (s: State) => void> = {
  benchmarks: initBenchmarks,
  rivals: initRivals,
  earth: initEarth,
  market: initMarket,
};

export function applyEffects(s: State, effects: readonly Effect[]): void {
  for (const e of effects) applyEffect(s, e);
}
