import { BALANCE } from "../balance";
import { currentEra } from "../derive";
import { pushLog, setTicker, tickerIsFree } from "../log";
import { nextRandom } from "../rng";
import type { State } from "../state";
import { ALL_ERAS, type System } from "../system";

const A = BALANCE.ambientLog;
const TICKER_SECONDS = 20;

/** Draw an unused line from the era's pool. Returns null once the pool is spent. */
function drawLine(s: State, pool: readonly string[], key: string): string | null {
  const used = (s.logPool[key] ??= []);
  if (used.length >= pool.length) return null;
  let i = Math.floor(nextRandom(s) * pool.length);
  while (used.includes(i)) i = (i + 1) % pool.length;
  used.push(i);
  return pool[i] ?? null;
}

/** Flavor for a present player: a log line every minute or so, a rotating headline. */
export const ambient: System = {
  id: "ambient",
  eras: ALL_ERAS,
  liveOnly: true,
  tick(s) {
    const era = currentEra(s);
    if (s.t >= s.nextAmbientAt) {
      s.nextAmbientAt = s.t + A.min + nextRandom(s) * (A.max - A.min);
      const line = drawLine(s, era.log, `log:${era.id}`);
      if (line) pushLog(s, line);
    }
    if (tickerIsFree(s)) {
      const line = era.ticker[Math.floor(nextRandom(s) * era.ticker.length)];
      if (line) setTicker(s, line, TICKER_SECONDS);
    }
  },
};
