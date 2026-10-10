// Pure math. Everything here is a function of its arguments and nothing else.

const LOSS_FLOOR = 1.69;
const K_B = 1.380649e-23;
const L_SUN = 3.828e26;

/** Chinchilla (Hoffmann et al. 2022) fitted loss. N params, D tokens. */
export function chinchillaLoss(N: number, D: number): number {
  return LOSS_FLOOR + 406.4 / Math.pow(N, 0.34) + 410.7 / Math.pow(D, 0.28);
}

/** Capability rung implied by a loss. Tuned so L≈1.8 lands on "Automates AI research" (rung 12). */
export function rungFromLoss(L: number): number {
  const excess = Math.max(1e-6, L - LOSS_FLOOR);
  return 8 + 4.8 * Math.log10(1 / excess);
}

/** Landauer ceiling: bit-ops per second for the whole Sun radiated at temperature T. */
export function landauerOps(temperatureK: number): number {
  return L_SUN / (K_B * temperatureK * Math.LN2);
}

/**
 * Moore's law as a price curve. Prices halve every 4 years before the integrated
 * circuit era, every 2 until Dennard scaling ends (2006), every 3 until 2020,
 * every 6 after. Returns the price multiplier.
 */
export function mooreFactor(year: number, introYear: number): number {
  const segments: [number, number][] = [
    [1965, 4],
    [2006, 2],
    [2020, 3],
    [Infinity, 6],
  ];
  let doublings = 0;
  let from = introYear;
  for (const [until, halving] of segments) {
    if (from >= until) continue;
    const to = Math.min(year, until);
    if (to > from) doublings += (to - from) / halving;
    from = to;
    if (year <= until) break;
  }
  return Math.max(0.01, Math.pow(2, -doublings));
}

export function generatorPrice(base: number, growth: number, owned: number, moore: number): number {
  return base * Math.pow(growth, owned) * moore;
}

/** Sum of a geometric price series for buying `n` more starting at `owned`. */
export function bulkPrice(base: number, growth: number, owned: number, n: number, moore: number): number {
  if (growth === 1) return base * n * moore;
  const first = generatorPrice(base, growth, owned, moore);
  return (first * (Math.pow(growth, n) - 1)) / (growth - 1);
}

export function generalityMult(G: number): number {
  return Math.pow(1.25, G);
}

/** Expert-system upkeep: rules interact, so cost grows with the square. */
export function rulesUpkeep(rules: number, k: number): number {
  return (rules * rules) / k;
}

/** Benchmark accuracy from data, hand-built features, and learned capability. Saturates toward 1. */
export function benchmarkAccuracy(dataLog: number, features: number, learned: number): number {
  const handBuilt = 1 - Math.exp(-features / 6);
  const fromData = 1 - Math.exp(-Math.max(0, dataLog - 8) / 5);
  const score = 0.15 + 0.35 * handBuilt + 0.25 * fromData + 0.3 * learned;
  return Math.min(1, score);
}

export function log10(x: number): number {
  return x <= 0 ? 0 : Math.log10(x);
}

export function clamp(x: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, x));
}

/** Smooth approach: move `value` toward `target` with time constant `tau` over `dt`. */
export function approach(value: number, target: number, tau: number, dt: number): number {
  return target + (value - target) * Math.exp(-dt / tau);
}
