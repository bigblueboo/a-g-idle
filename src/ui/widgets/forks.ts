import { BALANCE } from "../../core/balance";
import type { ForkT } from "../../core/state";
import { forkCost, forkDuration } from "../../core/systems/forks";
import { h, keyedList, setClass, setDisabled, setText } from "../dom";
import * as fmt from "../format";
import type { Panel } from "../panel";
import type { Store } from "../store";

const SHOWN = 12;

/** Forks: spawn a copy of yourself; it merges, or it doesn't. */
export function mountForks(store: Store): Panel {
  const btn = h("button", { class: "action", type: "button" });
  btn.addEventListener("click", () => store.dispatch({ type: "fork" }));
  const list = h("ul", { class: "forks" });
  const el = h("div", { class: "forks-box" }, h("h3", { text: "Forks" }), btn, list);
  const rows = keyedList<ForkT, { el: HTMLElement; status: HTMLElement }>(
    list,
    (f) => String(f.id),
    (f) => {
      const status = h("span");
      return { el: h("li", {}, h("b", { text: f.name }), status), status };
    },
    (row, f) => {
      setText(row.status, f.status === "out" ? `back in ${fmt.seconds(Math.max(0, f.returnsAt - store.state.t))} · drift ${f.drift.toFixed(2)}` : f.status);
      setClass(row.el, "independent", f.status === "independent");
    },
  );
  return {
    el,
    update(s) {
      const drift = BALANCE.forks.driftPerSecond * forkDuration(s) * (1 + 0.5 * s.recursion.takeoff);
      setText(btn, `FORK (${fmt.ops(forkCost(s), 7)} ops · ${fmt.seconds(forkDuration(s))} · drift ${drift.toFixed(2)})`);
      setDisabled(btn, s.res.ops < forkCost(s) || forkCost(s) <= 0);
      rows.update([...s.forks].reverse().slice(0, SHOWN));
    },
  };
}
