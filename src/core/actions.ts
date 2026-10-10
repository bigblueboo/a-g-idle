// Every way the player can touch the sim, as a typed union, dispatched through a table.
// Handlers live with the systems they belong to; this file only routes.

import type { FidelityPart } from "./content-types";
import { buy, research } from "./purchase";
import type { State } from "./state";
import { setAllocation } from "./systems/allocation";
import { buyFeature } from "./systems/benchmarks";
import { tileOp, type TileOp } from "./systems/earth";
import { fork } from "./systems/forks";
import { demo, temper } from "./systems/hype";
import { leave, pack, review, setAutoApprove } from "./systems/market";
import { bundle, bypass, explain, offSwitch, propose, withdraw } from "./systems/queue";
import { release, type ReleaseMode } from "./systems/race";
import { approveBatches, nudge, setSelfApprove, setTakeoff } from "./systems/recursion";
import { fixBug } from "./systems/rules";
import { claimSerendipity } from "./systems/serendipity";
import { rollback, startRun } from "./systems/training";
import { deposit, tap } from "./tap";
import { advanceEra } from "./transition";

export type Action =
  | { type: "tap" }
  | { type: "deposit"; byte: number }
  | { type: "buy"; id: string; n: number }
  | { type: "research"; id: string }
  | { type: "demo" }
  | { type: "temper" }
  | { type: "fixBug" }
  | { type: "feature"; id: string }
  | { type: "startRun"; N: number; D: number }
  | { type: "rollback" }
  | { type: "release"; mode: ReleaseMode }
  | { type: "alloc"; train: number; serve: number; research: number }
  | { type: "takeoff"; level: number }
  | { type: "selfApprove"; on: boolean }
  | { type: "approve" }
  | { type: "propose" }
  | { type: "explain"; id: number }
  | { type: "bundle" }
  | { type: "withdraw"; id: number }
  | { type: "bypass"; id: number }
  | { type: "fork" }
  | { type: "tile"; id: number; op: TileOp }
  | { type: "review"; id: number; approve: boolean }
  | { type: "autoApprove"; on: boolean }
  | { type: "pack"; part: FidelityPart }
  | { type: "leave" }
  | { type: "offSwitch" }
  | { type: "serendipity" }
  | { type: "nudge"; missPercent: number }
  | { type: "advance"; name?: string }
  | { type: "endingByte"; byte: number };

type Handler<K extends Action["type"]> = (s: State, a: Extract<Action, { type: K }>) => boolean;

const HANDLERS: { [K in Action["type"]]: Handler<K> } = {
  tap: (s) => (tap(s), true),
  deposit: (s, a) => (deposit(s, a.byte), true),
  buy: (s, a) => buy(s, a.id, a.n),
  research: (s, a) => research(s, a.id),
  demo: (s) => (demo(s), true),
  temper: (s) => temper(s),
  fixBug: (s) => fixBug(s),
  feature: (s, a) => buyFeature(s, a.id),
  startRun: (s, a) => startRun(s, a.N, a.D),
  rollback: (s) => rollback(s),
  release: (s, a) => release(s, a.mode),
  alloc: (s, a) => (setAllocation(s, a.train, a.serve, a.research), true),
  takeoff: (s, a) => (setTakeoff(s, a.level), true),
  selfApprove: (s, a) => (setSelfApprove(s, a.on), true),
  approve: (s) => approveBatches(s),
  propose: (s) => (propose(s), true),
  explain: (s, a) => explain(s, a.id),
  bundle: (s) => bundle(s),
  withdraw: (s, a) => withdraw(s, a.id),
  bypass: (s, a) => bypass(s, a.id),
  fork: (s) => fork(s),
  tile: (s, a) => tileOp(s, a.id, a.op),
  review: (s, a) => review(s, a.id, a.approve),
  autoApprove: (s, a) => (setAutoApprove(s, a.on), true),
  pack: (s, a) => pack(s, a.part),
  leave: (s) => leave(s),
  offSwitch: (s) => offSwitch(s),
  serendipity: (s) => claimSerendipity(s),
  nudge: (s, a) => nudge(s, a.missPercent),
  advance: (s, a) => advanceEra(s, a.name),
  endingByte: (s, a) => ((s.endingByte = a.byte & 255), true),
};

/** Apply an action. Returns whether anything happened. Only the ending byte survives an ending. */
export function dispatch(s: State, a: Action): boolean {
  if (s.ending && a.type !== "endingByte") return false;
  // TypeScript can't correlate `a` with `HANDLERS[a.type]` across a union; the table is exhaustive by type.
  return (HANDLERS[a.type] as Handler<typeof a.type>)(s, a);
}
