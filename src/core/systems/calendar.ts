import { NOW_YEAR } from "../../content/rungs";
import { currentEra, oom } from "../derive";
import { clampKey, once } from "../flags";
import { pushLog, setTicker } from "../log";
import type { State } from "../state";
import { ALL_ERAS, type System } from "../system";

/** The year the calendar may not pass right now: a pending shock, or the era's end. */
function calendarCap(s: State): number {
  const end = currentEra(s).years[1];
  return s.pendingShock ? Math.min(s.pendingShock.year, end) : end;
}

function atClamp(s: State): boolean {
  return !s.pendingShock && s.year >= currentEra(s).years[1];
}

/** Subjective years per sim second, once the systems are thinking faster than people. */
function subjectiveRate(s: State): number {
  const o = oom(s);
  return o <= 21 ? 0 : Math.pow(10, (o - 21) * 0.25) / 60;
}

export const calendar: System = {
  id: "calendar",
  eras: ALL_ERAS,
  tick(s, dt) {
    const era = currentEra(s);
    const before = s.year;
    s.year = Math.min(calendarCap(s), s.year + (era.rate / 60) * dt);
    s.subjective += subjectiveRate(s) * dt;
    if (before < NOW_YEAR && s.year >= NOW_YEAR && once(s, "now")) pushLog(s, "This game was written in 2026. Past this line it's guessing.", "system");
    if (atClamp(s) && once(s, clampKey(s.era))) setTicker(s, "History is waiting on you.", 20);
  },
};
