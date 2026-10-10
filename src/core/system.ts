import type { EraId } from "./content-types";
import type { State } from "./state";

/**
 * A system is one slice of the sim. `step` runs every system whose era list
 * includes the current era. Systems marked `liveOnly` are skipped during offline
 * catch-up: they exist for a player who is present (serendipity, ambient log).
 */
export interface System {
  id: string;
  eras: readonly EraId[];
  liveOnly?: true;
  tick(s: State, dt: number): void;
}

export const ALL_ERAS: readonly EraId[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export function systemActive(sys: System, s: State): boolean {
  return sys.eras.includes(s.era);
}
export const BETWEEN = (from: EraId, to: EraId): readonly EraId[] => ALL_ERAS.filter((e) => e >= from && e <= to);
