// Headless pacing check. Plays the whole game with a bot policy and reports minutes per era.
// Usage: npm run pace [-- --policy greedy|cautious|idle] [--seed N] [--quiet]

import { ERAS } from "../src/content";
import { botSecond, type Policy } from "../src/bot/policy";
import { currentEra, fidelityTotal } from "../src/core/derive";
import { initialState } from "../src/core/state";
import { step } from "../src/core/step";

const args = process.argv.slice(2);
const flag = (name: string, fallback: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? (args[i + 1] ?? fallback) : fallback;
};
const policy = flag("policy", "greedy") as Policy;
const seed = Number(flag("seed", "1"));
const quiet = args.includes("--quiet");

/** Active minutes a typical player should spend per era (DESIGN.md §10). */
const TARGET_MINUTES = [8, 25, 40, 45, 60, 60, 45, 60, 45, 30];
const MAX_MINUTES = 90;
const TOLERANCE = 0.25;

const s = initialState(seed);
const minutes: number[] = Array(10).fill(0);
const taps = { carry: 0 };
let second = 0;
let stuck = false;

while (!s.ending) {
  const era = s.era;
  botSecond(s, second, policy, taps);
  step(s, 1);
  minutes[era] = (minutes[era] ?? 0) + 1 / 60;
  second += 1;
  if ((minutes[era] ?? 0) > MAX_MINUTES) {
    stuck = true;
    console.log(`stuck in era ${era} (${currentEra(s).name}) after ${MAX_MINUTES} min: year ${s.year.toFixed(1)}, rung ${s.rung}, ops ${s.rates.ops.toExponential(2)}, money ${s.res.money.toExponential(2)}, insight ${s.res.insight.toFixed(0)}, data ${s.res.data.toExponential(1)}`);
    if (!quiet) console.log(s.log.slice(-12).map((l) => `  ${l.year.toFixed(1)} ${l.text}`).join("\n"));
    break;
  }
}

console.log(`policy=${policy} seed=${seed} ending=${s.ending ?? "none"} total=${(second / 60).toFixed(0)} min`);
console.log("era  name        min   target  status");
let failed = stuck;
for (let e = 0; e <= 9; e++) {
  const m = minutes[e] ?? 0;
  const target = TARGET_MINUTES[e] ?? 0;
  const off = (m - target) / target;
  const ok = m > 0 && Math.abs(off) <= TOLERANCE;
  if (!ok) failed = true;
  const status = m === 0 ? "unreached" : ok ? "ok" : off > 0 ? `slow +${(off * 100).toFixed(0)}%` : `fast ${(off * 100).toFixed(0)}%`;
  console.log(`${e}    ${ERAS[e]?.name.padEnd(11)} ${m.toFixed(1).padStart(5)}   ${String(target).padStart(3)}    ${status}`);
}
console.log(`rungs ${Object.keys(s.rungYears).length}, generality ${s.generality}, fidelity ${fidelityTotal(s).toFixed(1)}`);
process.exitCode = failed ? 1 : 0;
