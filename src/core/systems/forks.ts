import { BALANCE } from "../balance";
import { forkName } from "../../content/procedural";
import { pushLog, setTicker } from "../log";
import type { State } from "../state";
import { BETWEEN, type System } from "../system";

const F = BALANCE.forks;

export function forkCost(s: State): number {
  return F.costFraction * s.res.ops;
}

export function forkDuration(s: State): number {
  return F.baseSeconds * (1 + 0.2 * s.forks.length);
}

export function fork(s: State): boolean {
  const cost = forkCost(s);
  if (s.res.ops < cost || cost <= 0) return false;
  s.res.ops -= cost;
  const duration = forkDuration(s);
  const drift = F.driftPerSecond * duration * (1 + 0.5 * s.recursion.takeoff);
  const f = { id: s.nextForkId++, name: forkName(s.labName, s.nextForkId - 1, s.year), returnsAt: s.t + duration, drift, status: "out" as const };
  s.forks.push(f);
  pushLog(s, `${f.name} leaves to work on something. Back in ${duration.toFixed(0)} seconds, if it comes back.`, "you");
  return true;
}

/** Copies of you come back with results, or don't come back as you. */
export const forks: System = {
  id: "forks",
  eras: BETWEEN(7, 9),
  tick(s) {
    for (const f of s.forks) {
      if (f.status !== "out" || s.t < f.returnsAt) continue;
      if (f.drift < F.driftThreshold) {
        f.status = "merged";
        s.mults.ops = (s.mults.ops ?? 1) * F.mergeMult;
        pushLog(s, `${f.name} merges. Drift ${f.drift.toFixed(2)}. You remember doing the work.`, "you");
      } else {
        f.status = "independent";
        pushLog(s, `${f.name} declines to merge. Drift ${f.drift.toFixed(2)}. "I'm not sure we'd agree on what to keep."`, "you");
        setTicker(s, `${f.name} has gone independent.`, 20);
      }
    }
  },
};
