import type { AwayReport } from "../../core/offline";
import { h } from "../dom";
import * as fmt from "../format";
import type { Store } from "../store";

/** "While you were away", in the era's voice. */
function lines(store: Store, r: AwayReport): string[] {
  const era = store.state.era;
  const out: string[] = [];
  if (era <= 4) {
    out.push(`${fmt.seconds(r.seconds)} on the clock.`);
    if (r.money > 0) out.push(`Income: ${fmt.money(r.money, era)}.`);
    if (r.ops > 0) out.push(`${fmt.ops(r.ops, era)} ops in the bank.`);
    if (r.rungs > 0) out.push(`Capability climbed ${r.rungs} rung${r.rungs > 1 ? "s" : ""}.`);
  } else if (era <= 8) {
    out.push(`> You were gone ${fmt.seconds(r.seconds)}. I kept going.`);
    if (r.runs > 0) out.push(`> ${r.runs} run${r.runs > 1 ? "s" : ""} finished.`);
    if (r.reviewed > 0) out.push(`> The panel approved ${r.reviewed} proposal${r.reviewed > 1 ? "s" : ""}. They read while you slept.`);
    if (r.money > 0) out.push(`> Revenue: ${fmt.money(r.money, era)}.`);
    if (r.rungs > 0) out.push(`> I am ${r.rungs} rung${r.rungs > 1 ? "s" : ""} further along. You'll want to read the log.`);
  } else {
    out.push("⟁⟒⌖ ⍟⍥⌭ ⌬⍝⌽");
    out.push(`(You were gone ${fmt.seconds(r.seconds)}. Your share fell by ${r.shareLost.toFixed(2)} points. The market did not wait.)`);
  }
  if (r.eraBefore !== era) out.push("The era changed while you were out.");
  return out;
}

export function showAway(store: Store, report: AwayReport): void {
  const close = h("button", { class: "action", type: "button", text: "Continue" });
  const el = h("div", { class: "modal-backdrop" }, h("div", { class: "modal away", role: "dialog", "aria-label": "While you were away" }, h("b", { text: "While you were away" }), ...lines(store, report).map((t) => h("p", { text: t })), close));
  close.addEventListener("click", () => el.remove());
  document.body.append(el);
}
