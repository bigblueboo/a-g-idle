// The one place flag keys are built. Flags record things that have happened: an event
// fired, a notice shown, a content unlock reached.

import type { EventDef } from "./content-types";
import type { State } from "./state";

/** True the first time, false after. For notices and offers that happen once per run. */
export function once(s: State, key: string): boolean {
  if (s.flags[key]) return false;
  s.flags[key] = true;
  return true;
}

export function eventKey(e: EventDef): string {
  return `ev:${e.id}`;
}

export function warnKey(e: EventDef): string {
  return `warn:${e.id}`;
}

export function eraKey(era: number): string {
  return `era:${era}`;
}

export function clampKey(era: number): string {
  return `clamp:${era}`;
}
