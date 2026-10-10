import { BALANCE } from "./balance";
import type { State } from "./state";
import { stepOffline } from "./step";

const CHUNK = 10;
const M = BALANCE.market;

export interface AwayReport {
  seconds: number;
  ops: number;
  money: number;
  rungs: number;
  runs: number;
  reviewed: number;
  shareLost: number;
  eraBefore: number;
}

/**
 * Replay the time the player was gone in coarse steps. Share, the one number
 * that falls while you're away, falls slower offline and never more than a cap.
 */
export function catchUp(s: State, elapsedSeconds: number): AwayReport {
  const seconds = Math.min(Math.max(0, elapsedSeconds), BALANCE.offlineCapSeconds);
  const before = { ops: s.res.ops, money: s.res.money, rung: s.rung, runs: s.training.runs, reviewed: s.queue.reviewed, share: s.res.share, era: s.era };
  for (let left = seconds; left > 0; left -= CHUNK) stepOffline(s, Math.min(CHUNK, left));
  if (before.share > 0) {
    const lost = Math.min((before.share - s.res.share) * M.offlineFraction, before.share * M.offlineCap);
    s.res.share = before.share - Math.max(0, lost);
  }
  return {
    seconds,
    ops: s.res.ops - before.ops,
    money: s.res.money - before.money,
    rungs: s.rung - before.rung,
    runs: s.training.runs - before.runs,
    reviewed: s.queue.reviewed - before.reviewed,
    shareLost: before.share - s.res.share,
    eraBefore: before.era,
  };
}
