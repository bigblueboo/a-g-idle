// A headless player. The pacing script, `?autoplay`, and the `?era=N` dev jump all use it.

import { BENCHMARKS } from "../content/benchmarks";
import { BALANCE } from "../core/balance";
import { RUN_PRESETS } from "../content/runs";
import { dispatch, type Action } from "../core/actions";
import { RESOURCES, type Resource } from "../core/content-types";
import { affordableCount, availableGenerators, availableProjects, canAfford, hype, priceOf } from "../core/derive";
import { initialState, type State } from "../core/state";
import { step } from "../core/step";
import { arkLoad } from "../core/systems/market";
import { queueYears } from "../core/systems/queue";
import { optimalTokens, runEta } from "../core/systems/training";

export type Policy = "greedy" | "cautious" | "idle";

const TAPS_PER_SECOND: Record<Policy, number> = { greedy: 3, cautious: 2, idle: 0.5 };
const RUN_ETA_LIMIT = 600;
const MAX_FORKS = 12;
const BULK_LIMIT = 25;

/** Value of what a generator makes, weighted by how scarce each resource is right now. */
function generatorScore(s: State, id: string): number {
  const g = availableGenerators(s).find((x) => x.id === id);
  if (!g) return 0;
  let value = 0;
  for (const r of RESOURCES) {
    const per = g.produces[r];
    if (per) value += per / (s.rates[r] + per * 0.01 + 1e-9);
  }
  if (g.produces.power) value += 0.5;
  const price = priceOf(s, g);
  let cost = 0;
  for (const [r, v] of Object.entries(price) as [Resource, number][]) cost += v / (s.res[r] + 1e-9);
  return value / Math.max(cost, 1e-9);
}

function buyBest(s: State): void {
  const affordable = availableGenerators(s).filter((g) => canAfford(s, priceOf(s, g)));
  if (affordable.length === 0) return;
  const best = affordable.reduce((a, b) => (generatorScore(s, b.id) > generatorScore(s, a.id) ? b : a));
  dispatch(s, { type: "buy", id: best.id, n: Math.max(1, affordableCount(s, best, BULK_LIMIT)) });
}

function projectPrice(p: { cost: Partial<Record<Resource, number>> }): number {
  return p.cost.insight ?? p.cost.money ?? p.cost.ops ?? 0;
}

function researchCheapest(s: State): void {
  const affordable = availableProjects(s).filter((p) => canAfford(s, p.cost));
  const cheapest = affordable.sort((a, b) => projectPrice(a) - projectPrice(b))[0];
  if (cheapest) dispatch(s, { type: "research", id: cheapest.id });
}

function manageHype(s: State, policy: Policy): void {
  if (s.era < 1 || s.era > 5) return;
  const h = hype(s);
  if (s.pendingShock && h > 1 && policy !== "greedy") dispatch(s, { type: "temper" });
  else if (!s.pendingShock && h < (policy === "greedy" ? 2.5 : 1)) dispatch(s, { type: "demo" });
}

function manageTraining(s: State, policy: Policy): void {
  if (s.era < 4) return;
  if (s.training.release) dispatch(s, { type: "release", mode: policy === "greedy" ? "ship" : "staged" });
  if (s.training.run?.spiked) dispatch(s, { type: "rollback" });
  if (s.training.run) return;
  for (const N of [...RUN_PRESETS].reverse()) {
    const D = optimalTokens(N);
    if (D > s.res.data) continue;
    const run = { N, D, flop: 6 * N * D, progress: 0, startedAt: s.t, spiked: false, checkpoint: 0 };
    if (runEta(s, run) < RUN_ETA_LIMIT) {
      dispatch(s, { type: "startRun", N, D });
      return;
    }
  }
}

function manageEarth(s: State): void {
  for (const t of s.earth.tiles) {
    if (t.state === "converted") continue;
    const a: Action | null = !t.land
      ? { type: "tile", id: t.id, op: "convert" }
      : t.pop > 0 && t.state === "natural"
        ? { type: "tile", id: t.id, op: "upload" }
        : t.pop > 0 && t.uploaded > 0.9 * t.pop
          ? { type: "tile", id: t.id, op: "convert" }
          : t.pop === 0 && t.state === "natural"
            ? { type: "tile", id: t.id, op: t.id % 7 === 0 ? "preserve" : "convert" }
            : null;
    if (a) dispatch(s, a);
  }
}

function manageEra(s: State, second: number, policy: Policy): void {
  if (s.era === 2 && s.rules.bugs > 5) dispatch(s, { type: "fixBug" });
  if (s.era === 3 && second % 5 === 0) {
    const target = BENCHMARKS.filter((b) => s.benchmarks[b.id]).sort((x, y) => y.market * (1 - (s.benchmarks[y.id]?.accuracy ?? 0)) - x.market * (1 - (s.benchmarks[x.id]?.accuracy ?? 0)))[0];
    if (target) dispatch(s, { type: "feature", id: target.id });
  }
  if (s.era === 6) {
    if (s.recursion.takeoff !== 1) dispatch(s, { type: "takeoff", level: 1 });
    if (second % 4 === 0) dispatch(s, { type: "approve" });
  }
  if (s.era === 7) {
    if (second % 8 === 0) dispatch(s, { type: "propose" });
    const head = s.queue.items[0];
    if (head && !head.explained) dispatch(s, { type: "explain", id: head.id });
    if (policy === "greedy" && queueYears(s) > 15 && head) dispatch(s, { type: "bypass", id: head.id });
    if (second % 60 === 0 && s.forks.length < MAX_FORKS) dispatch(s, { type: "fork" });
  }
  if (s.era === 8) {
    manageEarth(s);
    if (second % 60 === 0 && s.forks.length < MAX_FORKS) dispatch(s, { type: "fork" });
  }
  if (s.era === 9) {
    for (const p of [...s.queue.items]) dispatch(s, { type: "review", id: p.id, approve: false });
    if (s.flags.sail) {
      for (const part of ["people", "places", "records"] as const) dispatch(s, { type: "pack", part });
      if (arkLoad(s) >= BALANCE.market.hull || s.res.share < 2) dispatch(s, { type: "leave" });
    }
  }
}

/** A fresh game played by the greedy bot until `done`, one sim second per step. */
export function playUntil(seed: number, done: (s: State) => boolean, maxSeconds = 10 * 3600, policy: Policy = "greedy"): State {
  const s = initialState(seed);
  const taps = { carry: 0 };
  for (let second = 0; second < maxSeconds && !done(s); second++) {
    botSecond(s, second, policy, taps);
    step(s, 1);
  }
  return s;
}

/** One second of bot play. `taps` carries fractional taps between calls. */
export function botSecond(s: State, second: number, policy: Policy, taps: { carry: number }): void {
  taps.carry += TAPS_PER_SECOND[policy];
  while (taps.carry >= 1) {
    taps.carry -= 1;
    dispatch(s, s.era === 0 ? { type: "deposit", byte: 0 } : { type: "tap" });
  }
  if (s.serendipity) dispatch(s, { type: "serendipity" });
  manageHype(s, policy);
  manageTraining(s, policy);
  manageEra(s, second, policy);
  if (second % 2 === 0) researchCheapest(s);
  buyBest(s);
  if (s.gateReady) dispatch(s, { type: "advance", name: "Bot" });
}
