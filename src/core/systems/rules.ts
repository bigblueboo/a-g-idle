import { BALANCE } from "../balance";
import { count } from "../derive";
import { rulesUpkeep } from "../formulas";
import { pushLog } from "../log";
import type { State } from "../state";
import type { System } from "../system";

const R = BALANCE.rules;
export const ENGINEER = "engineer";

function bugDrag(s: State): number {
  return Math.min(0.8, 0.02 * s.rules.bugs);
}

export function rulesRevenue(s: State): number {
  return s.rules.count * R.license * (1 - bugDrag(s));
}

export function rulesUpkeepRate(s: State): number {
  return rulesUpkeep(s.rules.count, R.k);
}

/**
 * Expert systems. Engineers write rules, rules earn licenses, and because rules
 * interact, upkeep grows with the square. The crossover is visible on the chart
 * well before the game says anything about it.
 */
export const rules: System = {
  id: "rules",
  eras: [2],
  tick(s, dt) {
    const written = count(s, ENGINEER) * R.perEngineer * dt;
    const before = s.rules.count;
    s.rules.count += written;
    s.rules.bugs += rulesUpkeep(s.rules.count, R.k) * R.bugRate * dt;
    s.rates.money += rulesRevenue(s) - rulesUpkeepRate(s);
    if (before < 100 && s.rules.count >= 100) pushLog(s, "One hundred rules. The sales team wants a brochure.");
    if (before < 1000 && s.rules.count >= 1000) pushLog(s, "A thousand rules. Nobody at the company has read all of them.");
  },
};

export function fixBug(s: State): boolean {
  if (s.rules.bugs < 1 || s.res.money < R.bugCost) return false;
  s.res.money -= R.bugCost;
  s.rules.bugs -= 1;
  return true;
}
