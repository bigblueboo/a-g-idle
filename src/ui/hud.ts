import { NOW_YEAR } from "../content/rungs";
import { BALANCE } from "../core/balance";
import type { EraId } from "../core/content-types";
import { effectiveOps, fidelityTotal, hype, oom, powerCap, powerUsed } from "../core/derive";
import { clampKey } from "../core/flags";
import type { State } from "../core/state";
import { arkLoad } from "../core/systems/market";
import { queueYears } from "../core/systems/queue";
import { h, setClass, setText, show } from "./dom";
import * as fmt from "./format";
import type { Panel } from "./panel";
import { ledBar, sevenSegment } from "./readouts";

interface Chip {
  label: string;
  value(s: State): string;
  warn?(s: State): boolean;
}

const money: Chip = { label: "$", value: (s) => fmt.amount(s.res.money) };
const insight: Chip = { label: "Insight", value: (s) => fmt.count(s.res.insight) };
const hypeChip: Chip = { label: "Hype", value: (s) => (s.winter ? "WINTER" : `${hype(s) >= 0 ? "▲" : "▼"} ${Math.abs(hype(s)).toFixed(1)}`), warn: (s) => hype(s) > 2 || s.winter !== null };
const data: Chip = { label: "Data", value: (s) => `${fmt.si(s.res.data, 1)} tok` };
const power: Chip = { label: "Power", value: (s) => `${fmt.watts(powerUsed(s))} / ${fmt.watts(powerCap(s))}`, warn: (s) => powerUsed(s) > powerCap(s) };
const trust: Chip = { label: "Trust", value: (s) => fmt.percent(s.trust), warn: (s) => s.trust < 0.3 };
const legibility: Chip = { label: "Legible", value: (s) => fmt.percent(s.legibility), warn: (s) => s.legibility < 0.4 };
const matter: Chip = { label: "Matter", value: (s) => fmt.kg(s.res.matter) };
const fidelity: Chip = { label: "Fidelity", value: (s) => fidelityTotal(s).toFixed(1) };
const queue: Chip = { label: "Queue", value: (s) => fmt.years(queueYears(s)) };
const share: Chip = { label: "Share", value: (s) => `${s.res.share.toFixed(s.res.share < 1 ? 3 : 1)}%`, warn: (s) => s.res.share < 5 };
const ark: Chip = { label: "Ark", value: (s) => `${arkLoad(s)}/${BALANCE.market.hull}` };

const CHIPS: Record<EraId, Chip[]> = {
  0: [money],
  1: [money, insight, hypeChip],
  2: [money, insight, hypeChip],
  3: [money, insight, data],
  4: [money, insight, data],
  5: [money, power, trust],
  6: [money, legibility, trust],
  7: [matter, queue, fidelity],
  8: [matter, trust, fidelity],
  9: [share, fidelity, ark],
};

/** The top four LEDs of the bargraph run hot: the last orders of magnitude before the Landauer limit. */
const HOT_LEDS = 4;

/**
 * The instrument panel: a seven-segment year, a VFD compute readout, an LED bargraph
 * for orders of magnitude, LCD chips for the era's resources, and a VFD ticker.
 */
export function mountHud(): Panel {
  const year = sevenSegment(6, "Year");
  const subjective = h("span", { class: "hud-subjective" });
  const compute = h("span", { class: "vfd" });
  const computeLong = h("span", { class: "vfd dim hidden" });
  const computeGlass = h("span", { class: "glass hud-compute" }, compute, computeLong);
  const meter = ledBar(BALANCE.oom.max, HOT_LEDS, "Orders of magnitude of compute");
  const meterBox = h("div", { class: "meter" }, meter.el);
  const chips = h("div", { class: "hud-chips" });
  const tickerText = h("span", { class: "vfd dim", role: "status" });
  const ticker = h("div", { class: "glass wide hud-ticker" }, tickerText);
  const el = h(
    "header",
    { class: "hud panel-plate" },
    h(
      "div",
      { class: "hud-row" },
      h("div", { class: "hud-block" }, h("span", { class: "engrave", text: "Year" }), h("span", { class: "glass hud-year" }, year.el), subjective),
      h("div", { class: "hud-block hud-right" }, h("span", { class: "engrave", text: "Compute" }), computeGlass),
    ),
    meterBox,
    chips,
    ticker,
  );
  const chipEls = new Map<Chip, { el: HTMLElement; value: HTMLElement }>();
  let chipEra = -1;
  let lastTick = -1;

  function rebuildChips(era: EraId): void {
    chipEra = era;
    chips.replaceChildren();
    chipEls.clear();
    for (const c of CHIPS[era]) {
      const value = h("b");
      const chip = h("span", { class: "chip" }, h("span", { class: "chip-label" }, c.label), value);
      chips.append(chip);
      chipEls.set(c, { el: chip, value });
    }
  }

  computeGlass.addEventListener("click", () => {
    computeLong.classList.toggle("hidden");
    compute.classList.toggle("hidden");
  });

  return {
    el,
    update(s) {
      const era = s.era;
      if (era !== chipEra) rebuildChips(era);
      year.set(fmt.year(s.year));
      show(subjective, s.year >= NOW_YEAR && s.subjective > 0.01);
      setText(subjective, `${fmt.years(s.subjective)} subjective`);
      const o = oom(s);
      const tick = Math.floor(o);
      if (lastTick !== -1 && tick > lastTick) {
        meterBox.classList.remove("crossed");
        void meterBox.offsetWidth;
        meterBox.classList.add("crossed");
      }
      lastTick = tick;
      setText(compute, `${fmt.ops(effectiveOps(s), era)} ops/s`);
      setText(computeLong, fmt.opsPlain(effectiveOps(s)));
      meter.set(o);
      for (const [c, row] of chipEls) {
        setText(row.value, c.value(s));
        setClass(row.el, "warn", c.warn?.(s) ?? false);
      }
      setText(tickerText, s.ticker.text);
      setClass(el, "clamped", s.flags[clampKey(s.era)] === true && !s.gateReady);
    },
  };
}
