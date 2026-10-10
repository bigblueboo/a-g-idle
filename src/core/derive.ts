// Values computed from state. Nothing here mutates.

import { BALANCE } from "./balance";
import { eraDef, generatorDef, ERAS } from "../content";
import type { Cost, EraDef, GeneratorDef, LessonReset, ProjectDef, Resource } from "./content-types";
import { bulkPrice, generalityMult, landauerOps, log10, mooreFactor } from "./formulas";
import { hash } from "./rng";
import type { State } from "./state";

export function currentEra(s: State): EraDef {
  return eraDef(s.era);
}

export function count(s: State, id: string): number {
  return s.counts[id] ?? 0;
}

export function mult(s: State, key: string): number {
  return s.mults[key] ?? 1;
}

export function has(s: State, id: string): boolean {
  return s.projects[id] === true || s.flags[id] === true;
}

function opsOfKind(s: State, shells: boolean): number {
  let ops = 0;
  for (const [id, n] of Object.entries(s.counts)) {
    const g = generatorDef(id);
    if ((g.kind === "shell") === shells) ops += n * (g.produces.ops ?? 0);
  }
  return ops;
}

/** Raw hardware output before efficiency, generality, bursts, and power limits. */
function hardwareOps(s: State): number {
  return opsOfKind(s, false) * mult(s, "ops");
}

/** Shells already run at the Landauer limit for their temperature. Nothing multiplies them. */
function shellOps(s: State): number {
  return opsOfKind(s, true);
}

export function powerCap(s: State): number {
  if (!s.flags.power) return Infinity;
  let cap = 0;
  for (const [id, n] of Object.entries(s.counts)) cap += n * (generatorDef(id).produces.power ?? 0);
  return cap * mult(s, "power");
}

function opsModMult(s: State): number {
  return s.opsMod && s.t < s.opsMod.until ? s.opsMod.mult : 1;
}

export function powerUsed(s: State): number {
  return hardwareOps(s) * BALANCE.power.wattsPerOp;
}

/** Below 1 when the hardware draws more than the grid can give. */
function powerFactor(s: State): number {
  const used = powerUsed(s);
  const cap = powerCap(s);
  return used > cap ? cap / used : 1;
}

/** The Sun's whole output, radiated at the temperature of the sky. There is no more. */
const OPS_CEILING = landauerOps(3);

/** The spine: what the HUD shows and what the OOM meter measures. */
export function effectiveOps(s: State): number {
  const learned = hardwareOps(s) * s.efficiency * generalityMult(s.generality);
  return Math.min(OPS_CEILING, (learned + shellOps(s)) * opsModMult(s) * powerFactor(s));
}

export function oom(s: State): number {
  return log10(effectiveOps(s));
}

export function hype(s: State): number {
  return s.expectation - s.rung;
}

export function tapValue(s: State): number {
  const rate = s.rates.ops;
  const raw = BALANCE.tap.base + BALANCE.tap.fractionOfRate * rate;
  if (s.era < BALANCE.tap.capFromEra) return raw;
  return Math.min(raw, Math.max(BALANCE.tap.base, BALANCE.tap.capFraction * rate));
}

export function priceOf(s: State, g: GeneratorDef, n = 1): Cost {
  const moore = g.introYear === undefined ? 1 : mooreFactor(s.year, g.introYear);
  const owned = count(s, g.id);
  const out: Cost = {};
  for (const [res, base] of Object.entries(g.cost) as [Resource, number][]) {
    out[res] = bulkPrice(base, g.growth, owned, n, moore);
  }
  return out;
}

export function canAfford(s: State, cost: Cost): boolean {
  return (Object.entries(cost) as [Resource, number][]).every(([r, v]) => s.res[r] >= v);
}

export function pay(s: State, cost: Cost): void {
  for (const [r, v] of Object.entries(cost) as [Resource, number][]) s.res[r] -= v;
}

/** How many more of `g` can exist at all. */
export function remainingCapacity(s: State, g: GeneratorDef): number {
  return g.max === undefined ? Infinity : Math.max(0, g.max - count(s, g.id));
}

/** How many of `g` the player can afford right now (for ×max buttons). */
export function affordableCount(s: State, g: GeneratorDef, limit = 100): number {
  let n = 0;
  const cap = Math.min(limit, remainingCapacity(s, g));
  while (n < cap && canAfford(s, priceOf(s, g, n + 1))) n++;
  return n;
}

function requirementMet(s: State, req: string | undefined): boolean {
  return req === undefined || has(s, req);
}

export function availableGenerators(s: State): GeneratorDef[] {
  return currentEra(s).generators.filter((g) => !g.hidden && (g.introYear ?? -Infinity) <= s.year && requirementMet(s, g.requires));
}

export function legacyGenerators(s: State): GeneratorDef[] {
  return Object.keys(s.counts)
    .map(generatorDef)
    .filter((g) => g.era < s.era && count(s, g.id) > 0);
}

export function availableProjects(s: State): ProjectDef[] {
  return ERAS.slice(0, s.era + 1)
    .flatMap((e) => e.projects)
    .filter((p) => !s.projects[p.id] && (p.requires ?? []).every((r) => has(s, r)));
}

/** Research hours ratio shown in Era 6, and the general "who is doing the thinking" number. */
export function humanResearchers(s: State): number {
  return s.staff.length;
}

export function lessonGain(s: State): number {
  const baseline = BALANCE.generality.baseline[s.era] ?? 1e5;
  return Math.max(1, Math.floor(log10(Math.max(1, s.handcrafted) / baseline)));
}

/** The era's end year: the calendar clamps here, and the gate never opens before it. */
export function gateYear(s: State): number {
  return currentEra(s).years[1];
}

export function gateSatisfied(s: State): boolean {
  const gate = currentEra(s).gate;
  if (!gate || s.year < gateYear(s)) return false;
  const g = gate.conditions;
  if (g.rung !== undefined && s.rung < g.rung) return false;
  if (g.ops !== undefined && effectiveOps(s) < g.ops) return false;
  if (g.projects && !g.projects.every((p) => s.projects[p])) return false;
  if (g.flags && !g.flags.every((f) => s.flags[f])) return false;
  return true;
}

/** Era 0: the byte the lamps suggest. Changes every half minute; matching it pays ×5. */
export function lampPattern(s: State): number {
  return hash(`${s.seed}:${Math.floor(s.t / 30)}`) & 255;
}

/** Whether the era's coming Bitter Lesson will wipe this kind of hand-built work: the era in which you build it. */
export function lessonWillReset(s: State, what: LessonReset): boolean {
  return currentEra(s).gate?.conditions.lesson?.reset.includes(what) ?? false;
}

export function independentForks(s: State): number {
  return s.forks.filter((f) => f.status === "independent").length;
}

export function fidelityTotal(s: State): number {
  return s.fidelity.people + s.fidelity.places + s.fidelity.records;
}
