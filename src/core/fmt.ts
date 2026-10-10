// Formatters the sim needs for its own log lines. The UI has its own, era-aware set.

export function fmtParams(n: number): string {
  const units: [number, string][] = [
    [1e12, "T"],
    [1e9, "B"],
    [1e6, "M"],
    [1e3, "K"],
  ];
  for (const [scale, suffix] of units) {
    if (n >= scale) {
      const v = n / scale;
      return `${v < 10 ? v.toFixed(1).replace(/\.0$/, "") : Math.round(v)}${suffix}`;
    }
  }
  return `${Math.round(n)}`;
}

export function fmtPeople(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return `${Math.round(n)}`;
}
