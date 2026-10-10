import { BALANCE } from "../balance";
import { reachRung } from "../capability";
import { fmtParams } from "../fmt";
import { chinchillaLoss, rungFromLoss } from "../formulas";
import { pushLog, setTicker } from "../log";
import { nextRandom } from "../rng";
import type { RunT, State } from "../state";
import type { System } from "../system";

const T = BALANCE.training;
const HISTORY = 40;

/** Compute-optimal tokens for a parameter count (Hoffmann et al.). */
export function optimalTokens(N: number): number {
  return 20 * N;
}

export function runFlop(N: number, D: number): number {
  return 6 * N * D;
}

export function predictedLoss(N: number, D: number): number {
  return chinchillaLoss(N, D);
}

export function trainRate(s: State): number {
  return s.rates.ops * s.alloc.train * T.mfu;
}

export function runEta(s: State, run: RunT): number {
  const rate = trainRate(s);
  return rate > 0 ? (run.flop - run.progress) / rate : Infinity;
}

export function startRun(s: State, N: number, D: number): boolean {
  if (s.training.run || s.training.release || D > s.res.data) return false;
  s.training.run = { N, D, flop: runFlop(N, D), progress: 0, startedAt: s.t, spiked: false, checkpoint: 0 };
  pushLog(s, `Run ${s.training.runs + 1}: ${fmtParams(N)} parameters, ${fmtParams(D)} tokens. ${runFlop(N, D).toExponential(1)} FLOP.`);
  return true;
}

export function rollback(s: State): boolean {
  const run = s.training.run;
  if (!run || !run.spiked) return false;
  run.progress = Math.max(run.checkpoint, run.progress * (1 - T.rollbackLoss));
  run.spiked = false;
  pushLog(s, "Rolled back to the last checkpoint. The spike is gone. So are twenty minutes.");
  return true;
}

function finish(s: State, run: RunT): void {
  const loss = chinchillaLoss(run.N, run.D);
  s.training.run = null;
  s.training.runs += 1;
  s.training.bestLoss = s.training.bestLoss === null ? loss : Math.min(s.training.bestLoss, loss);
  s.training.history.push({ flop: run.flop, loss });
  if (s.training.history.length > HISTORY) s.training.history.shift();
  const rung = Math.floor(rungFromLoss(loss));
  pushLog(s, `Run ${s.training.runs} done. Loss ${loss.toFixed(3)}.`);
  if (s.flags.releaseDecisions) {
    s.training.release = { loss, rung };
    setTicker(s, "A model is ready. Ship it, eval it, or stage it.", 30);
    return;
  }
  reachRung(s, rung);
}

function diverge(s: State): void {
  s.training.run = null;
  pushLog(s, "Loss went to NaN. The run is gone. Someone suggests a smaller learning rate.");
}

/** A run makes progress at the train slice's rate, with seeded hazards. */
export const training: System = {
  id: "training",
  eras: [4, 5, 6],
  tick(s, dt) {
    const run = s.training.run;
    if (!run) return;
    run.progress += trainRate(s) * dt;
    if (run.progress >= run.flop) return finish(s, run);
    if (!run.spiked && nextRandom(s) < T.spikeRate * dt) {
      run.spiked = true;
      run.checkpoint = run.progress * 0.9;
      setTicker(s, "Loss spike. Roll back, or ride it out.", 20);
      return;
    }
    if (run.spiked && nextRandom(s) < T.divergeRate * dt) diverge(s);
  },
};
