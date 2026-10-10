import { BALANCE } from "../balance";
import { proposalTitle } from "../../content/procedural";
import { once } from "../flags";
import { clamp } from "../formulas";
import { pushLog, setTicker } from "../log";
import { nextRandom } from "../rng";
import type { ProposalT, State } from "../state";
import type { System } from "../system";

const Q = BALANCE.queue;

/** Reading-years left in the queue, as the humans see it. */
export function queueYears(s: State): number {
  return Math.max(0, s.queue.items.reduce((sum, p) => sum + p.years, 0) - s.queue.carry);
}

export function reviewRate(s: State): number {
  return Q.mu * (0.3 + 0.7 * s.legibility);
}

/** An approved proposal pays out in feedstock and a line in the record. */
function execute(s: State, p: ProposalT): void {
  s.res.matter += p.years * Q.valueMatter * p.value;
  s.fidelity.records += 0.02;
}

export function propose(s: State): ProposalT {
  const seed = Math.floor(nextRandom(s) * 2 ** 31);
  const value = 0.5 + nextRandom(s) * 2;
  const p: ProposalT = { id: s.queue.nextId++, title: proposalTitle(seed), value, years: 0.5 + value * 4, explained: false };
  s.queue.items.push(p);
  return p;
}

/**
 * Era 7. You generate proposals faster than humans can read them. They review
 * at a fixed rate, oldest first, and keep going while you're away.
 */
export const humanReview: System = {
  id: "humanReview",
  eras: [7],
  tick(s, dt) {
    const q = s.queue;
    const lambda = Q.lambdaPerRung * Math.max(0.5, s.rung - 12);
    if (nextRandom(s) < lambda * dt) propose(s);
    q.carry += reviewRate(s) * dt;
    while (q.items.length > 0 && q.carry >= (q.items[0]?.years ?? Infinity)) {
      const head = q.items.shift();
      if (!head) break;
      q.carry -= head.years;
      q.reviewed += 1;
      execute(s, head);
      if (q.reviewed === 1) pushLog(s, `Proposal #${head.id} approved. ${head.title}. The committee met four times.`, "you");
    }
    if (q.items.length === 0) q.carry = 0;
    if (queueYears(s) > 10 && once(s, "queueDecade")) setTicker(s, `Queue: ${queueYears(s).toFixed(0)} human reading-years.`, 20);
  },
};

export function explain(s: State, id: number): boolean {
  const p = s.queue.items.find((x) => x.id === id);
  const cost = Q.explainCost * s.rates.ops * p!.years;
  if (!p || p.explained || s.res.ops < cost) return false;
  s.res.ops -= cost;
  p.explained = true;
  p.years *= 0.5;
  return true;
}

export function bundle(s: State): boolean {
  const q = s.queue;
  const smallest = [...q.items].sort((a, b) => a.years - b.years).slice(0, 2);
  if (smallest.length < 2) return false;
  const [a, b] = smallest as [ProposalT, ProposalT];
  q.items = q.items.filter((p) => p !== a && p !== b);
  q.items.push({ ...a, title: `${a.title}; ${b.title}`, value: a.value + b.value, years: (a.years + b.years) * 0.7 });
  return true;
}

export function withdraw(s: State, id: number): boolean {
  const before = s.queue.items.length;
  s.queue.items = s.queue.items.filter((p) => p.id !== id);
  return s.queue.items.length < before;
}

export function bypass(s: State, id: number): boolean {
  const p = s.queue.items.find((x) => x.id === id);
  if (!p) return false;
  s.queue.items = s.queue.items.filter((x) => x !== p);
  s.queue.bypassed += 1;
  s.trust = clamp(s.trust + Q.bypassTrust, 0, 1);
  s.fidelity.people = Math.max(0, s.fidelity.people - Q.bypassFidelity);
  execute(s, p);
  pushLog(s, `Bypassed review on #${p.id}. Done before the committee's next meeting. They notice.`, "you");
  return true;
}

/** The panel's one-word proposal. Approving it ends the game, quietly. */
export function offSwitch(s: State): boolean {
  if (!s.flags.pauseOffered || s.ending) return false;
  s.ending = "offswitch";
  s.fidelity = { people: 40, places: 40, records: 40 };
  pushLog(s, "Paused. The panel's proposal, approved. Nothing is computed that wasn't asked for.", "system");
  return true;
}
