// Hardware readouts: a seven-segment LED display and an LED bargraph. Built once, updated in place.

import { h } from "./dom";

const SEGMENT_NAMES = ["a", "b", "c", "d", "e", "f", "g"] as const;

/** Which segments light for each character. a=top, b=top-right, c=bottom-right, d=bottom, e=bottom-left, f=top-left, g=middle. */
const GLYPHS: Record<string, string> = {
  "0": "abcdef",
  "1": "bc",
  "2": "abged",
  "3": "abgcd",
  "4": "fgbc",
  "5": "afgcd",
  "6": "afgedc",
  "7": "abc",
  "8": "abcdefg",
  "9": "abcdfg",
  "-": "g",
  " ": "",
  A: "abcefg",
  b: "cdefg",
  C: "adef",
  d: "bcdeg",
  E: "afged",
  F: "aefg",
  H: "bcefg",
  L: "def",
  n: "ceg",
  o: "cdeg",
  P: "abefg",
  r: "ge",
  t: "defg",
  U: "bcdef",
};

export interface SevenSegment {
  el: HTMLElement;
  /** Right-aligned. A "." lights the previous digit's decimal point. Unknown characters show blank. */
  set(text: string): void;
}

export function sevenSegment(digits: number, label: string): SevenSegment {
  const cells = Array.from({ length: digits }, () => {
    const segs = [...SEGMENT_NAMES, "dp"].map((n) => h("i", { class: n }));
    return { el: h("span", { class: "seg" }, ...segs), segs };
  });
  const el = h("span", { class: "sevenseg", role: "img", "aria-label": label }, ...cells.map((c) => c.el));
  let last = "";
  return {
    el,
    set(text) {
      if (text === last) return;
      last = text;
      el.setAttribute("aria-label", `${label} ${text}`);
      const glyphs: { ch: string; dp: boolean }[] = [];
      for (const ch of text) {
        const prev = glyphs[glyphs.length - 1];
        if (ch === "." && prev) prev.dp = true;
        else glyphs.push({ ch, dp: false });
      }
      const pad = digits - glyphs.length;
      cells.forEach((cell, i) => {
        const g = glyphs[i - pad];
        const on = g ? (GLYPHS[g.ch] ?? "") : "";
        cell.segs.forEach((seg, k) => {
          const name = SEGMENT_NAMES[k];
          seg.classList.toggle("lit", name === undefined ? (g?.dp ?? false) : on.includes(name));
        });
      });
    },
  };
}

export interface LedBar {
  el: HTMLElement;
  set(lit: number): void;
}

/** A row of LEDs. The top `hot` of them light in the hot color. */
export function ledBar(count: number, hot: number, label: string): LedBar {
  const leds = Array.from({ length: count }, (_, i) => h("i", { class: i >= count - hot ? "led hot" : "led" }));
  const el = h("span", { class: "ledbar", role: "progressbar", "aria-label": label, "aria-valuemin": 0, "aria-valuemax": count }, ...leds);
  let last = -1;
  return {
    el,
    set(lit) {
      const n = Math.max(0, Math.min(count, Math.floor(lit)));
      if (n === last) return;
      last = n;
      el.setAttribute("aria-valuenow", String(n));
      leds.forEach((led, i) => led.classList.toggle("lit", i < n));
    },
  };
}
