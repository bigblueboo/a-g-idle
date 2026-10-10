import { eraDef } from "../../content";
import type { EraId, GeneratorDef } from "../../core/content-types";
import { affordableCount, availableGenerators, canAfford, count, legacyGenerators, priceOf, remainingCapacity } from "../../core/derive";
import type { State } from "../../core/state";
import { artUrl } from "../art";
import { h, keyedList, setClass, setDisabled, setText, show } from "../dom";
import * as fmt from "../format";
import type { Panel } from "../panel";
import type { Store } from "../store";

type Bulk = 1 | 10 | 100 | "max";
const BULK_OPTIONS: Bulk[] = [1, 10, 100, "max"];

function costText(s: State, g: GeneratorDef, n: number): string {
  const price = priceOf(s, g, Math.max(1, n));
  const era = s.era;
  return Object.entries(price)
    .map(([r, v]) => (r === "money" ? fmt.money(v, era) : `${fmt.ops(v, era)} ${r}`))
    .join(" + ");
}

function producesText(g: GeneratorDef, era: EraId): string {
  return Object.entries(g.produces)
    .map(([r, v]) => (r === "money" ? `${fmt.money(v, era)}/s` : r === "power" ? fmt.watts(v) : r === "ops" ? `${fmt.ops(v, era)} ops/s` : `${fmt.rate(v)} ${r}/s`))
    .join(", ");
}

interface Row {
  el: HTMLElement;
  name: HTMLElement;
  owned: HTMLElement;
  cost: HTMLElement;
  rate: HTMLElement;
  buy: HTMLButtonElement;
}

export function mountBuild(store: Store): Panel {
  let bulk: Bulk = 1;
  const bulkBar = h("div", { class: "bulk", role: "group", "aria-label": "Buy quantity" });
  const bulkButtons = new Map<Bulk, HTMLButtonElement>();
  for (const b of BULK_OPTIONS) {
    const btn = h("button", { class: "bulk-btn", type: "button", text: b === "max" ? "max" : `×${b}` });
    btn.addEventListener("click", () => (bulk = b));
    bulkButtons.set(b, btn);
    bulkBar.append(btn);
  }
  const list = h("div", { class: "gen-list" });
  const legacyList = h("div", { class: "legacy-list" });
  const legacy = h("details", { class: "legacy" }, h("summary", { text: "Legacy" }), legacyList);
  const el = h("section", { class: "tab build" }, bulkBar, list, legacy);

  const rows = keyedList<GeneratorDef, Row>(
    list,
    (g) => g.id,
    (g) => {
      const name = h("b", { class: "gen-name" });
      const owned = h("span", { class: "gen-owned" });
      const cost = h("span", { class: "gen-cost" });
      const rate = h("span", { class: "gen-rate" });
      const art = artUrl("gen", g.id);
      const sticker = art ? h("img", { class: "sticker", src: art, alt: "", loading: "lazy" }) : h("span", { class: "sticker blank" });
      const buy = h("button", { class: "gen-buy flat", type: "button" }, sticker, name, owned, cost);
      const row = h("div", { class: "gen" }, buy, h("div", { class: "gen-meta" }, rate, h("span", { class: "gen-desc", text: g.desc })));
      buy.addEventListener("click", () => {
        const n = bulk === "max" ? affordableCount(store.state, g) : bulk;
        store.dispatch({ type: "buy", id: g.id, n });
      });
      return { el: row, name, owned, cost, rate, buy };
    },
    (row, g) => {
      const s = store.state;
      const n = bulk === "max" ? Math.max(1, affordableCount(s, g)) : bulk;
      setText(row.name, g.name);
      setText(row.owned, g.max ? `${fmt.count(count(s, g.id))}/${fmt.count(g.max)}` : fmt.count(count(s, g.id)));
      setText(row.cost, costText(s, g, n));
      setText(row.rate, producesText(g, s.era));
      setDisabled(row.buy, !canAfford(s, priceOf(s, g, n)) || remainingCapacity(s, g) < n);
    },
  );
  const legacyRows = keyedList<GeneratorDef, { el: HTMLElement; owned: HTMLElement }>(
    legacyList,
    (g) => g.id,
    (g) => {
      const owned = h("span");
      return { el: h("div", { class: "legacy-row" }, h("span", { text: g.name }), owned), owned };
    },
    (row, g) => setText(row.owned, fmt.count(count(store.state, g.id))),
  );

  return {
    el,
    update(s) {
      const available = availableGenerators(s);
      rows.update(eraDef(s.era).rewritesUi ? [...available].sort((a, b) => count(s, b.id) - count(s, a.id)) : available);
      const old = legacyGenerators(s);
      show(legacy, old.length > 0);
      legacyRows.update(old);
      for (const [b, btn] of bulkButtons) setClass(btn, "active", b === bulk);
    },
  };
}
