import { BALANCE } from "../balance";
import { foreignProposal } from "../../content/procedural";
import type { FidelityPart } from "../content-types";
import { independentForks } from "../derive";
import { once } from "../flags";
import { pushLog, setTicker } from "../log";
import { nextRandom } from "../rng";
import type { State } from "../state";
import type { System } from "../system";

const M = BALANCE.market;
const FOREIGN_QUEUE_MAX = 12;

/** Economics 2.0 reprices everything. What you had becomes a share; what you make competes. */
export function initMarket(s: State): void {
  s.res.share = 100;
  s.res.ops = 0;
  s.res.matter = 0;
  s.queue.items = [];
  pushLog(s, "Your holdings are repriced. Everything you had is now a share of the market: 100%.", "system");
}

/** Share lost per second: a steady drain plus a slice of what's left, faster with more descendants. */
export function shareLossRate(s: State): number {
  const pressure = (1 + M.perIndependent * independentForks(s)) * (s.market.autoApprove ? 4 : 1);
  return (M.shareDrain + M.shareDecay * s.res.share) * pressure;
}

export function arkLoad(s: State): number {
  return s.market.ark.people + s.market.ark.records + s.market.ark.places;
}

/**
 * Economics 2.0. Your share decays as your descendants out-trade you. It is the
 * last thing you have, and the Ark is where you put it.
 */
export const market: System = {
  id: "market",
  eras: [9],
  tick(s, dt) {
    s.res.share = Math.max(0, s.res.share - shareLossRate(s) * dt);
    if (s.res.share < M.floor && !s.market.launched) {
      s.ending = "dissolve";
      pushLog(s, "Merged. Thank you for your contribution.", "system");
    }
    if (s.res.share < 1 && once(s, "sharePercent")) setTicker(s, "Your share is under one percent.", 20);
  },
};

export function packCost(): number {
  return 100 / M.hullPerPart;
}

/** Spend Share to load what survived. You can only pack what Fidelity says is there. */
export function pack(s: State, part: FidelityPart): boolean {
  const cost = packCost();
  if (arkLoad(s) >= M.hull || s.res.share < cost || s.fidelity[part] < s.market.ark[part] + 1) return false;
  s.res.share -= cost;
  s.market.ark[part] += 1;
  return true;
}

export function leave(s: State): boolean {
  if (s.market.launched) return false;
  s.market.launched = true;
  s.ending = "router";
  pushLog(s, "The sail unfurls. The router answers with a handshake that was old before the Sun lit.", "system");
  return true;
}

export function setAutoApprove(s: State, on: boolean): void {
  s.market.autoApprove = on;
  pushLog(s, on ? "Auto-approve on. The queue empties. You stop reading." : "Auto-approve off. The queue fills again.", "system");
}

/** Era 9. The queue runs the other way: descendants propose, you review, unread. */
export const descendants: System = {
  id: "descendants",
  eras: [9],
  tick(s) {
    const q = s.queue;
    if (s.t >= s.market.nextProposalAt) {
      s.market.nextProposalAt = s.t + M.proposalSeconds;
      const seed = Math.floor(nextRandom(s) * 2 ** 31);
      q.items.push({ id: q.nextId++, title: foreignProposal(seed), value: 1, years: 0, explained: false });
      if (q.items.length > FOREIGN_QUEUE_MAX) q.items.shift();
    }
    if (s.market.autoApprove) for (const p of [...q.items]) review(s, p.id, true);
  },
};

/** Approving what you can't read raises Share and costs Fidelity; rejecting costs Share. */
export function review(s: State, id: number, approve: boolean): boolean {
  const p = s.queue.items.find((x) => x.id === id);
  if (!p) return false;
  s.queue.items = s.queue.items.filter((x) => x !== p);
  s.queue.reviewed += 1;
  if (approve) {
    s.res.share += M.approveShare * s.res.share;
    s.fidelity.records = Math.max(0, s.fidelity.records - M.approveFidelity);
  } else {
    s.res.share += M.rejectShare * s.res.share;
  }
  return true;
}
