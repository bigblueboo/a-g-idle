import { BALANCE } from "../balance";
import { approach, log10 } from "../formulas";
import type { State } from "../state";
import { BETWEEN, type System } from "../system";

const U = BALANCE.users;

function targetUsers(s: State): number {
  return U.perKappaServe * Math.pow(Math.max(0, s.rung - 7), 2.2) * s.alloc.serve * (0.5 + s.trust);
}

/** Insight from the research slice, before the model does the research itself. */
function researchInsight(s: State): number {
  return 0.3 * Math.max(0, log10(s.rates.ops * s.alloc.research) - 16);
}

/**
 * One slider, three slices. Serve earns users, data, revenue; Train feeds runs;
 * Research makes Insight until Era 6, when the same slice runs the model as a researcher.
 */
export const allocation: System = {
  id: "allocation",
  eras: BETWEEN(5, 7),
  tick(s, dt) {
    s.users = approach(s.users, targetUsers(s), U.churnTau, dt);
    s.rates.money += s.users * U.arpu * s.valuation;
    s.rates.data += s.users * U.dataPerUser;
    s.rates.insight += researchInsight(s);
  },
};

export function setAllocation(s: State, train: number, serve: number, research: number): void {
  const total = train + serve + research || 1;
  s.alloc = { train: train / total, serve: serve / total, research: research / total };
}
