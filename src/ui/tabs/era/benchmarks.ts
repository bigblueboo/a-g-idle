import { BENCHMARKS } from "../../../content/benchmarks";
import type { BenchmarkDef } from "../../../core/content-types";
import { lessonWillReset } from "../../../core/derive";
import { featurePrice } from "../../../core/systems/benchmarks";
import { h, keyedList, setClass, setDisabled, setStyle, setText, show } from "../../dom";
import * as fmt from "../../format";
import type { Panel } from "../../panel";
import type { Store } from "../../store";

interface Row {
  el: HTMLElement;
  bar: HTMLElement;
  acc: HTMLElement;
  taken: HTMLElement;
  feature: HTMLButtonElement;
}

/** The wall of benchmarks (Eras 3–4). Features are hand-built and per-benchmark; data helps all. */
export function mountBenchmarks(store: Store): Panel {
  const list = h("div", { class: "bench-list" });
  const hint = h("p", { class: "hint", text: "Revenue is market × accuracy. A feature helps one benchmark and adds less than the last. Data helps all of them. The learned line does nothing until it does." });
  const el = h("section", { class: "tab era-tab bench-tab" }, list, hint);
  const rows = keyedList<BenchmarkDef, Row>(
    list,
    (b) => b.id,
    (b) => {
      const bar = h("div", { class: "bar acc" });
      const acc = h("span", { class: "bench-acc" });
      const taken = h("span", { class: "bench-taken" });
      const feature = h("button", { class: "bench-feature", type: "button" });
      feature.addEventListener("click", () => store.dispatch({ type: "feature", id: b.id }));
      const row = h("div", { class: "bench" }, h("div", { class: "bench-head" }, h("b", { text: b.name }), h("span", { class: "bench-market", text: `${fmt.money(b.market, 3)}/s` }), taken), h("div", { class: "gauge" }, bar), h("div", { class: "bench-foot" }, acc, feature));
      return { el: row, bar, acc, taken, feature };
    },
    (row, b) => {
      const s = store.state;
      const st = s.benchmarks[b.id];
      if (!st) return;
      setStyle(row.bar, "width", `${st.accuracy * 100}%`);
      setText(row.acc, `${fmt.percent(st.accuracy, 1)} · ${st.features} feature${st.features === 1 ? "" : "s"}`);
      setText(row.taken, st.takenBy ? (st.takenBy === "you" ? "yours" : `taken by ${st.takenBy}`) : "");
      setClass(row.taken, "lost", st.takenBy !== null && st.takenBy !== "you");
      show(row.feature, lessonWillReset(s, "features"));
      setText(row.feature, `+ feature ${fmt.money(featurePrice(s, b.id), 3)}`);
      setDisabled(row.feature, s.res.money < featurePrice(s, b.id));
    },
  );
  return {
    el,
    update() {
      rows.update(BENCHMARKS);
    },
  };
}
