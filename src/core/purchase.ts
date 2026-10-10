import { GENERATORS, PROJECTS } from "../content";
import { FIRST_NAMES, LAST_NAMES, ROLES } from "../content/names";
import type { GeneratorDef } from "./content-types";
import { availableGenerators, availableProjects, canAfford, pay, priceOf, remainingCapacity } from "./derive";
import { applyEffects } from "./effects";
import { pushLog } from "./log";
import { hash } from "./rng";
import type { State } from "./state";

/** Staff are named until the research is the model's. */
const LAST_ERA_WITH_STAFF = 6;

function hire(s: State, g: GeneratorDef, n: number): void {
  for (let i = 0; i < n; i++) {
    const idx = s.staff.length + s.advisors.length;
    const first = FIRST_NAMES[hash(`${s.seed}:f:${idx}`) % FIRST_NAMES.length] ?? "A.";
    const last = LAST_NAMES[hash(`${s.seed}:l:${idx}`) % LAST_NAMES.length] ?? "Smith";
    s.staff.push({ name: `${first} ${last}`, role: ROLES[g.id] ?? g.name.toLowerCase(), joined: s.year });
  }
}

export function buy(s: State, id: string, n: number): boolean {
  const g = GENERATORS.get(id);
  if (!g || !availableGenerators(s).includes(g) || n > remainingCapacity(s, g)) return false;
  const price = priceOf(s, g, n);
  if (!canAfford(s, price)) return false;
  pay(s, price);
  const before = s.counts[id] ?? 0;
  s.counts[id] = before + n;
  if (g.kind === "people" && s.era <= LAST_ERA_WITH_STAFF) hire(s, g, n);
  if (before === 0) pushLog(s, g.desc, undefined, { kind: "gen", id: g.id });
  return true;
}

export function research(s: State, id: string): boolean {
  const p = PROJECTS.get(id);
  if (!p || !availableProjects(s).includes(p) || !canAfford(s, p.cost)) return false;
  pay(s, p.cost);
  s.projects[id] = true;
  pushLog(s, `${p.name}${p.year ? ` (${p.year})` : ""}. ${p.fact}`, undefined, { kind: "note", id: p.id });
  applyEffects(s, p.effects);
  return true;
}
