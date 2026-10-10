import { BALANCE } from "../balance";
import { currentEra } from "../derive";
import { pushLog } from "../log";
import { nextRandom } from "../rng";
import type { State } from "../state";
import { ALL_ERAS, type System } from "../system";

const S = BALANCE.serendipity;

function scheduleSerendipity(s: State): void {
  s.nextSerendipityAt = s.t + S.min + nextRandom(s) * (S.max - S.min);
}

/** The tap. A burst multiplies ops for a while; a grant is a few seconds of a resource's rate. */
export function claimSerendipity(s: State): boolean {
  const active = s.serendipity;
  if (!active) return false;
  const def = currentEra(s).serendipity.find((d) => d.id === active.id);
  s.serendipity = null;
  scheduleSerendipity(s);
  if (!def) return false;
  if (def.reward.kind === "burst") s.opsMod = { until: s.t + def.reward.seconds, mult: S.burstMult };
  else s.res[def.reward.resource] += s.rates[def.reward.resource] * def.reward.seconds + 1;
  if (!s.logbook.includes(def.id)) s.logbook.push(def.id);
  pushLog(s, def.text, undefined, { kind: "spot", id: def.id });
  return true;
}

/** The golden cookie. Only spawns for a present player; expires on its own. */
export const serendipity: System = {
  id: "serendipity",
  eras: ALL_ERAS,
  liveOnly: true,
  tick(s) {
    if (s.serendipity) {
      if (s.t > s.serendipity.expiresAt) {
        s.serendipity = null;
        scheduleSerendipity(s);
      }
      return;
    }
    if (s.t < s.nextSerendipityAt) return;
    const pool = currentEra(s).serendipity;
    const def = pool[Math.floor(nextRandom(s) * pool.length)];
    if (!def) return;
    s.serendipity = { id: def.id, expiresAt: s.t + S.lifetime };
  },
};
