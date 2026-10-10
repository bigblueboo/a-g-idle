// Seeded, deterministic randomness. The sim never touches Math.random.

/** Advance a 32-bit RNG state stored in the save and return a float in [0,1). */
export function nextRandom(state: { rng: number }): number {
  state.rng = (state.rng + 0x6d2b79f5) >>> 0;
  let t = state.rng;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/** FNV-1a string hash, for tie-breaks and stable per-id variation. */
export function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function pick<T>(state: { rng: number }, items: readonly T[]): T {
  const item = items[Math.floor(nextRandom(state) * items.length)];
  if (item === undefined) throw new Error("pick from empty list");
  return item;
}
