import { h, keyedList, setText } from "../dom";
import type { Panel } from "../panel";

interface Row {
  name: string;
  kappa: number;
  you: boolean;
}

/** Three labs on the leaderboard, and you. */
export function mountRivals(): Panel {
  const list = h("ol", { class: "rivals" });
  const el = h("section", { class: "rivals-box" }, h("h3", { text: "Leaderboard" }), list);
  const rows = keyedList<Row, { el: HTMLElement; k: HTMLElement }>(
    list,
    (r) => r.name,
    (r) => {
      const k = h("span");
      return { el: h("li", { class: r.you ? "you" : "" }, h("b", { text: r.name }), k), k };
    },
    (row, r) => setText(row.k, `rung ${r.kappa.toFixed(1)}`),
  );
  return {
    el,
    update(s) {
      const all: Row[] = [{ name: s.labName || "You", kappa: s.rung, you: true }, ...s.rivals.map((r) => ({ name: r.name, kappa: r.kappa, you: false }))];
      rows.update(all.sort((a, b) => b.kappa - a.kappa));
    },
  };
}
