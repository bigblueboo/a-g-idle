// The only place the wall clock is read. `?now=` and `?speed=` hooks live here.

export interface Clock {
  /** Wall-clock milliseconds, possibly pinned by `?now=`. */
  now(): number;
  /** Sim seconds per real second. */
  speed: number;
}

export function makeClock(params: URLSearchParams): Clock {
  const pinned = params.get("now");
  const speed = Number(params.get("speed") ?? "1") || 1;
  const base = pinned ? Date.parse(pinned) : NaN;
  const origin = performance.now();
  return {
    now: Number.isNaN(base) ? () => Date.now() : () => base + (performance.now() - origin),
    speed,
  };
}
