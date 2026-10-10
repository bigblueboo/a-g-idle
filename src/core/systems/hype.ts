import { BALANCE } from "../balance";
import { generatorDef } from "../../content";
import { hype } from "../derive";
import { once } from "../flags";
import { approach } from "../formulas";
import { pushLog, setTicker } from "../log";
import type { State } from "../state";
import { BETWEEN, type System } from "../system";

const H = BALANCE.hype;

/** Grants and licenses scale with what the public expects, and collapse in a winter. */
export function fundingMult(s: State): number {
  const base = 1 + H.fundingPerExpectation * Math.max(0, s.expectation);
  return s.winter ? base * H.winterFunding : base;
}

/** A scripted shock. Depth comes from how far expectation had run ahead of delivery. */
export function startWinter(s: State, name: string): void {
  const gap = hype(s);
  const target = s.expectation;
  s.expectation = s.rung;
  if (s.rung >= H.winterRecovery * target) {
    pushLog(s, `${name}. A cold snap. Expectations were close to delivery, and funding holds.`, "system");
    return;
  }
  s.winter = { targetExpectation: target, startedYear: s.year, nextLeaveAt: s.t + H.winterLeaveTau };
  pushLog(s, `${name}. Winter. Expectation was ${gap.toFixed(1)} rungs ahead of delivery. Funding ×${H.winterFunding}. People are leaving.`, "system");
  setTicker(s, `Winter. Funding ×${H.winterFunding} until capability reaches ${(H.winterRecovery * target).toFixed(1)}.`, 30);
}

function someoneLeaves(s: State): void {
  const leaver = s.staff.pop();
  if (!leaver) return;
  const id = Object.keys(s.counts).find((k) => generatorDef(k).kind === "people" && (s.counts[k] ?? 0) > 0);
  if (id) s.counts[id] = (s.counts[id] ?? 1) - 1;
  pushLog(s, `${leaver.name} leaves for industry. "There's no money in this."`);
}

/** A demo spikes expectation, less each time the gap is already wide. */
export function demo(s: State): void {
  s.expectation += H.demoDelta / (1 + Math.max(0, hype(s)));
  if (once(s, "firstDemo")) pushLog(s, "A demo. The room applauds a thing that works four times out of five.");
  else setTicker(s, `Demo. Expectation ${s.expectation.toFixed(1)}, delivery ${s.rung}.`, 8);
}

/** Telling the press what the machine can't do. Costs some funding, lowers the fall. */
export function temper(s: State): boolean {
  if (hype(s) <= 0) return false;
  s.res.money *= 1 - H.temperCost;
  s.expectation = Math.max(s.rung, s.expectation + H.temperDelta);
  pushLog(s, "You tell the press what the machine can't do. The next grant is smaller.");
  return true;
}

export const hypeSystem: System = {
  id: "hype",
  eras: BETWEEN(1, 5),
  tick(s, dt) {
    s.expectation = approach(s.expectation, s.rung, H.decayTau, dt);
    s.rates.money *= fundingMult(s);
    const w = s.winter;
    if (!w) return;
    s.rates.insight *= H.unfashionableInsight;
    if (s.rung >= H.winterRecovery * w.targetExpectation) {
      s.winter = null;
      pushLog(s, `The winter ends. ${(s.year - w.startedYear).toFixed(0)} years. Nobody announces it; the grants just come back.`, "system");
      return;
    }
    if (s.t >= w.nextLeaveAt) {
      w.nextLeaveAt = s.t + H.winterLeaveTau;
      someoneLeaves(s);
    }
  },
};
