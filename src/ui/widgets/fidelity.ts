import { h, setText } from "../dom";
import type { Panel } from "../panel";

const PARTS = ["people", "places", "records"] as const;

/** The Fidelity meter: three parts, revealed in Era 7. */
export function mountFidelity(): Panel {
  const values = { people: h("b"), places: h("b"), records: h("b") };
  const el = h("div", { class: "fidelity" }, ...PARTS.map((k) => h("span", { class: "fidelity-part" }, h("span", { text: k }), values[k])));
  return {
    el,
    update(s) {
      for (const k of PARTS) setText(values[k], s.fidelity[k].toFixed(1));
    },
  };
}
