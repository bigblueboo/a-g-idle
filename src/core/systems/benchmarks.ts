import { BALANCE } from "../balance";
import { BENCHMARKS } from "../../content/benchmarks";
import { benchmarkAccuracy, clamp, log10 } from "../formulas";
import { pushLog } from "../log";
import type { State } from "../state";
import type { System } from "../system";

const B = BALANCE.benchmarks;

/** Learned contribution to accuracy: nothing until Deep Blue, everything by GPT-2. */
function learnedShare(s: State): number {
  return clamp((s.rung - 4) / 4, 0, 1);
}

export function featurePrice(s: State, id: string): number {
  const features = s.benchmarks[id]?.features ?? 0;
  return B.featureCost * Math.pow(B.featureGrowth, features);
}

export function initBenchmarks(s: State): void {
  for (const b of BENCHMARKS) s.benchmarks[b.id] ??= { features: 0, accuracy: 0, takenBy: null };
}

/**
 * The wall of benchmarks. Data helps all of them, hand-built features help one
 * each with diminishing returns, and the learned line does nothing until it does.
 */
export const benchmarks: System = {
  id: "benchmarks",
  eras: [3, 4],
  tick(s) {
    const dataLog = log10(s.res.data);
    const learned = learnedShare(s);
    for (const b of BENCHMARKS) {
      const st = s.benchmarks[b.id];
      if (!st) continue;
      st.accuracy = benchmarkAccuracy(dataLog, st.features, learned);
      const share = st.takenBy && st.takenBy !== "you" ? 1 - BALANCE.race.revenueShare : 1;
      s.rates.money += b.market * B.marketScale * st.accuracy * share;
    }
  },
};

export function buyFeature(s: State, id: string): boolean {
  const st = s.benchmarks[id];
  const price = featurePrice(s, id);
  if (!st || s.res.money < price) return false;
  s.res.money -= price;
  st.features += 1;
  if (st.features === 1) pushLog(s, `First hand-built feature for ${BENCHMARKS.find((b) => b.id === id)?.name ?? id}. It took a week and a whiteboard.`);
  return true;
}

export function scrapFeatures(s: State): void {
  for (const st of Object.values(s.benchmarks)) st.features = 0;
}
