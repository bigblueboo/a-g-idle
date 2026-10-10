import type { ProposalT } from "../../../core/state";
import { queueYears, reviewRate } from "../../../core/systems/queue";
import { mountFidelity } from "../../widgets/fidelity";
import { mountForks } from "../../widgets/forks";
import { h, keyedList, setDisabled, setText, show } from "../../dom";
import * as fmt from "../../format";
import { attachHold } from "../../hold";
import type { Panel } from "../../panel";
import type { Store } from "../../store";

interface Row {
  el: HTMLElement;
  years: HTMLElement;
  explain: HTMLButtonElement;
  bypass: HTMLButtonElement;
}

/** Era 7: your proposals, their reviewers, and the reading-years between. */
export function mountQueue(store: Store): Panel {
  const stats = h("p", { class: "stat big" });
  const sub = h("p", { class: "stat" });
  const bundle = h("button", { class: "action", type: "button", text: "BUNDLE two smallest" });
  bundle.addEventListener("click", () => store.dispatch({ type: "bundle" }));
  const list = h("div", { class: "proposals" });
  const off = h("button", { class: "off-switch hidden", type: "button" }, h("b", { text: "Pause?" }), h("span", { text: "A proposal from the panel. Hold to approve it." }));
  attachHold(off, { ms: () => 10_000, onComplete: () => store.dispatch({ type: "offSwitch" }) });
  const fidelity = mountFidelity();
  const forks = mountForks(store);
  const el = h("section", { class: "tab era-tab queue-tab" }, off, stats, sub, fidelity.el, bundle, list, forks.el);
  const rows = keyedList<ProposalT, Row>(
    list,
    (p) => String(p.id),
    (p) => {
      const years = h("span", { class: "prop-years" });
      const explain = h("button", { class: "prop-btn", type: "button", text: "Explain" });
      const withdraw = h("button", { class: "prop-btn quiet", type: "button", text: "Withdraw" });
      const bypass = h("button", { class: "prop-btn danger", type: "button", text: "Bypass" });
      explain.addEventListener("click", () => store.dispatch({ type: "explain", id: p.id }));
      withdraw.addEventListener("click", () => store.dispatch({ type: "withdraw", id: p.id }));
      attachHold(bypass, { ms: () => store.settings.holdMs, onComplete: () => store.dispatch({ type: "bypass", id: p.id }) });
      const row = h("div", { class: "proposal" }, h("div", { class: "prop-head" }, h("b", { text: `#${p.id}` }), h("span", { text: p.title }), years), h("div", { class: "prop-actions" }, explain, withdraw, bypass));
      return { el: row, years, explain, bypass };
    },
    (row, p) => {
      setText(row.years, `${fmt.years(p.years)}${p.explained ? " · explained" : ""}`);
      setDisabled(row.explain, p.explained);
    },
  );
  return {
    el,
    update(s) {
      setText(stats, `Queue: ${fmt.years(queueYears(s))} of human reading`);
      setText(sub, `${s.queue.items.length} waiting · ${s.queue.reviewed} approved · ${s.queue.bypassed} bypassed · humans read ${(reviewRate(s) * 60).toFixed(1)} years/min`);
      show(off, s.flags.pauseOffered === true);
      setDisabled(bundle, s.queue.items.length < 2);
      rows.update(s.queue.items.slice(0, 10));
      fidelity.update(s);
      forks.update(s);
    },
  };
}
