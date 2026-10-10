// Number notation changes by era (DESIGN.md §12): commas, then SI, then exponents, then glyphs.

import { glyphs } from "../content/procedural";
import type { EraId } from "../core/content-types";

const SI = ["", "K", "M", "G", "T", "P", "E", "Z", "Y", "R", "Q"];
const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";

function superscript(n: number): string {
  const s = String(Math.round(n));
  return [...s].map((c) => (c === "-" ? "⁻" : SUP[Number(c)] ?? c)).join("");
}

export function withCommas(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

export function si(n: number, digits = 1): string {
  if (!Number.isFinite(n)) return "∞";
  if (n < 1000) return n < 10 ? n.toFixed(digits) : Math.round(n).toString();
  const e = Math.min(SI.length - 1, Math.floor(Math.log10(n) / 3));
  return `${(n / Math.pow(1000, e)).toFixed(digits)}${SI[e]}`;
}

function scientific(n: number): string {
  if (n === 0) return "0";
  const e = Math.floor(Math.log10(n));
  return `${(n / Math.pow(10, e)).toFixed(1)} × 10${superscript(e)}`;
}

export function magnitude(n: number): string {
  if (n <= 0) return "10⁰";
  const o = Math.log10(n);
  const whole = Math.floor(o);
  const frac = Math.round((o - whole) * 10);
  return `10${superscript(whole)}${frac ? `·${superscript(frac)}` : ""}`;
}

type Notation = "integer" | "si" | "scientific" | "magnitude" | "glyph";

/** Number notation by era (DESIGN.md §12): commas, then SI, then exponents, then glyphs. */
const NOTATION: Record<EraId, Notation> = { 0: "integer", 1: "integer", 2: "integer", 3: "si", 4: "si", 5: "si", 6: "si", 7: "scientific", 8: "magnitude", 9: "glyph" };

const FORMAT: Record<Notation, (n: number) => string> = {
  integer: (n) => (n < 10 ? n.toFixed(1).replace(/\.0$/, "") : withCommas(n)),
  si: (n) => si(n, 2),
  scientific,
  magnitude,
  glyph: (n) => glyphs(magnitude(n), 3),
};

export function ops(n: number, era: EraId): string {
  return FORMAT[NOTATION[era]](n);
}

/** The plain-language reading behind a glyph, for long-press. */
export function opsPlain(n: number): string {
  return scientific(n);
}

const MONEY = ["", "K", "M", "B", "T", "Qa", "Qi"];

/** A sum of money without the symbol: 2.50, 4,096, 1.2M. */
export function amount(n: number): string {
  if (n < 100) return n.toFixed(2).replace(/\.00$/, "");
  if (n < 1e4) return withCommas(n);
  const e = Math.min(MONEY.length - 1, Math.floor(Math.log10(n) / 3));
  return `${(n / Math.pow(1000, e)).toFixed(1)}${MONEY[e]}`;
}

export function money(n: number, era: EraId): string {
  return era >= 7 ? "$ — deprecated" : `$${amount(n)}`;
}

/** A per-second rate: decimals when small, SI when large. */
export function rate(n: number): string {
  if (n < 10) return n.toFixed(2).replace(/\.?0+$/, "");
  return si(n, 1);
}

export function count(n: number): string {
  return n >= 1e6 ? si(n, 1) : withCommas(n);
}

export function year(y: number): string {
  return `${Math.floor(y)}.${Math.floor((y % 1) * 10)}`;
}

export function years(n: number): string {
  if (n < 1) return `${Math.round(n * 12)} months`;
  if (n < 1000) return `${n.toFixed(n < 10 ? 1 : 0)} years`;
  if (n < 1e6) return `${(n / 1e3).toFixed(1)}K years`;
  if (n < 1e9) return `${(n / 1e6).toFixed(1)}M years`;
  return `${si(n, 1)} years`;
}

export function seconds(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (n < 60) return `${Math.ceil(n)}s`;
  if (n < 3600) return `${Math.floor(n / 60)}m ${Math.ceil(n % 60)}s`;
  return `${(n / 3600).toFixed(1)}h`;
}

export function percent(n: number, digits = 0): string {
  return `${(n * 100).toFixed(digits)}%`;
}

export function watts(n: number): string {
  return `${si(n, 1)}W`;
}

export function kg(n: number): string {
  return `${si(n, 1)} kg`;
}

export function signed(n: number): string {
  return `${n >= 0 ? "+" : ""}${n}`;
}
