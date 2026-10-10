import { BALANCE } from "../balance";
import type { EventDef } from "../content-types";
import { currentEra } from "../derive";
import { applyEffects } from "../effects";
import { eventKey, once, warnKey } from "../flags";
import { pushLog, setTicker } from "../log";
import type { State } from "../state";
import { ALL_ERAS, type System } from "../system";

function fire(s: State, e: EventDef): void {
  s.flags[eventKey(e)] = true;
  s.pendingShock = null;
  pushLog(s, `${e.title}. ${e.text}`, "system", { kind: "note", id: e.id });
  applyEffects(s, e.effects);
}

/**
 * Dated events fire when the calendar reaches them. A shock first pauses the
 * calendar and warns, then fires once the player has been present for a while,
 * so a winter never lands on an empty room.
 */
export const events: System = {
  id: "events",
  eras: ALL_ERAS,
  tick(s) {
    const era = currentEra(s);
    const warnLead = 2 * era.rate;
    for (const e of era.events) {
      if (s.flags[eventKey(e)]) continue;
      if (e.warn && s.year >= e.year - warnLead && once(s, warnKey(e))) setTicker(s, e.warn, 40);
      if (s.year < e.year) continue;
      if (!e.shock) {
        fire(s, e);
        continue;
      }
      if (!s.pendingShock) {
        s.pendingShock = { id: e.id, year: e.year, firesAt: s.tActive + BALANCE.shockDelay };
      } else if (s.pendingShock.id === e.id && s.tActive >= s.pendingShock.firesAt) {
        fire(s, e);
      }
      return;
    }
  },
};
