import { BALANCE } from "../balance";
import { researchTitle } from "../../content/procedural";
import { reachRung } from "../capability";
import { oom } from "../derive";
import { once } from "../flags";
import { clamp } from "../formulas";
import { pushLog, setTicker } from "../log";
import { nextRandom } from "../rng";
import type { State } from "../state";
import type { System } from "../system";

const RC = BALANCE.recursion;

export function takeoffGain(s: State): number {
  return RC.takeoffGain[s.recursion.takeoff] ?? 1;
}

function batchValue(s: State): number {
  return RC.rungPerBatch * Math.sqrt(takeoffGain(s)) * (1 + 0.2 * Math.max(0, oom(s) - 24));
}

function credit(s: State, value: number): void {
  s.recursion.progress += value;
  while (s.recursion.progress >= 1) {
    s.recursion.progress -= 1;
    reachRung(s, s.rung + 1);
  }
}

/**
 * The model does the research. Throughput scales with the Takeoff dial;
 * legibility decays with it. Approving a batch credits what you could follow.
 */
export const recursion: System = {
  id: "recursion",
  eras: [6],
  tick(s, dt) {
    const rc = s.recursion;
    rc.takeoff = clamp(rc.takeoff, 0, 2);
    s.legibility = clamp(s.legibility - (RC.legibilityDecay[rc.takeoff] ?? 0) * dt, 0.05, 1);
    if (s.t < rc.nextBatchAt) return;
    rc.nextBatchAt = s.t + RC.batchSeconds / takeoffGain(s);
    const seed = Math.floor(nextRandom(s) * 2 ** 31);
    const batch = { title: researchTitle(seed, s.legibility), value: batchValue(s), legible: s.legibility > 0.6 };
    if (rc.selfApprove) {
      credit(s, batch.value);
      s.fidelity.records = Math.max(0, s.fidelity.records - RC.selfApproveFidelity);
      return;
    }
    rc.batches.push(batch);
    rc.unread += 1;
    if (rc.unread >= RC.unreadForOffer && once(s, "selfApproveOffered")) {
      pushLog(s, "I could approve my own batches. You'd get the results faster. You'd see less of them.", "model");
      setTicker(s, "The model offers to approve its own research.", 25);
    }
  },
};

export function approveBatches(s: State): boolean {
  const rc = s.recursion;
  if (rc.batches.length === 0) return false;
  const value = rc.batches.reduce((sum, b) => sum + b.value * (b.legible ? 1 : s.legibility), 0);
  rc.batches = [];
  rc.unread = 0;
  credit(s, value);
  return true;
}

/** The interface noticed you missing the button. It moved the button. */
export function nudge(s: State, missPercent: number): boolean {
  if (!once(s, "nudged")) return false;
  pushLog(s, `I moved APPROVE 40 pixels up. You were missing it ${Math.round(missPercent)}% of the time.`, "model");
  return true;
}

export function setTakeoff(s: State, level: number): void {
  s.recursion.takeoff = clamp(Math.round(level), 0, 2);
  pushLog(s, ["Takeoff: measured. Every batch gets read.", "Takeoff: brisk. Some batches get skimmed.", "Takeoff: vertical. The batches arrive faster than anyone can open them."][s.recursion.takeoff] ?? "", "system");
}

export function setSelfApprove(s: State, on: boolean): void {
  if (on && !s.flags.selfApproveOffered) return;
  s.recursion.selfApprove = on;
  pushLog(s, on ? "Self-approval on. The unread pile stops growing because nothing goes in it." : "Self-approval off. The pile starts again.", "model");
}
