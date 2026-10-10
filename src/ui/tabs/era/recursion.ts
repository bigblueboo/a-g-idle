import { BALANCE } from "../../../core/balance";
import { rungName } from "../../../core/capability";
import { humanResearchers } from "../../../core/derive";
import { takeoffGain } from "../../../core/systems/recursion";
import { h, keyedList, setClass, setStyle, setText, show } from "../../dom";
import * as fmt from "../../format";
import type { Panel } from "../../panel";
import type { Store } from "../../store";
import { mountRuns } from "../../widgets/runs";

const TAKEOFF = ["Measured", "Brisk", "Vertical"] as const;
const HUMAN_HOURS_PER_WEEK = 40;
/** "Research hours this week: humans 1,920. Models 4.1 million." A thousand instances per unit, every hour. */
const MODEL_HOURS_BASE = 4.1e6;
const MODEL_HOURS_PER_INSTANCE = 1000 * 168;

/** Era 6: the model does the research. The dial, the legibility bar, the unread pile. */
export function mountRecursion(store: Store): Panel {
  const dial = h("div", { class: "dial", role: "group", "aria-label": "Takeoff" });
  const dialButtons = TAKEOFF.map((label, level) => {
    const b = h("button", { class: "dial-btn", type: "button", text: label });
    b.addEventListener("click", () => store.dispatch({ type: "takeoff", level }));
    dial.append(b);
    return b;
  });
  const legBar = h("div", { class: "bar legibility" });
  const legText = h("p", { class: "stat" });
  const progressBar = h("div", { class: "bar rung" });
  const progressText = h("p", { class: "stat" });
  const hours = h("p", { class: "stat" });
  const selfBox = h("input", { type: "checkbox" });
  const selfApprove = h("label", { class: "setting self-approve hidden" }, selfBox, h("span", { text: "Let the model approve its own batches" }));
  selfBox.addEventListener("change", () => store.dispatch({ type: "selfApprove", on: selfBox.checked }));
  const batches = h("ul", { class: "batches" });
  const runs = mountRuns(store);
  const el = h("section", { class: "tab era-tab recursion-tab" }, h("h3", { text: "Takeoff" }), dial, h("div", { class: "gauge" }, legBar), legText, h("div", { class: "gauge" }, progressBar), progressText, hours, selfApprove, h("h3", { text: "Unread research" }), batches, runs.el);
  type Row = { title: string; key: string; legible: boolean };
  const rows = keyedList<Row, { el: HTMLElement }>(
    batches,
    (b) => b.key,
    (b) => ({ el: h("li", { class: b.legible ? "" : "illegible", text: b.title }) }),
    () => {},
  );
  return {
    el,
    update(s) {
      dialButtons.forEach((b, i) => setClass(b, "active", s.recursion.takeoff === i));
      setStyle(legBar, "width", `${s.legibility * 100}%`);
      setText(legText, `Legibility ${Math.round(s.legibility * 100)}% · throughput ×${takeoffGain(s).toFixed(1)} · decays ${(BALANCE.recursion.legibilityDecay[s.recursion.takeoff] ?? 0) * 100 * 60}%/min`);
      setClass(legText, "warn", s.legibility < 0.4);
      setStyle(progressBar, "width", `${s.recursion.progress * 100}%`);
      setText(progressText, `${Math.round(s.recursion.progress * 100)}% of the way from "${rungName(s.rung)}" to "${rungName(s.rung + 1)}"`);
      const modelHours = MODEL_HOURS_BASE + (s.counts.modelresearcher ?? 0) * MODEL_HOURS_PER_INSTANCE;
      setText(hours, `Research hours this week: humans ${fmt.withCommas(humanResearchers(s) * HUMAN_HOURS_PER_WEEK)}. Models ${fmt.si(modelHours, 1)}.`);
      show(selfApprove, s.flags.selfApproveOffered === true);
      if (selfBox.checked !== s.recursion.selfApprove) selfBox.checked = s.recursion.selfApprove;
      rows.update(s.recursion.batches.slice(-12).map((b, i) => ({ title: b.title, key: `${i}:${b.title}`, legible: b.legible })));
      runs.update(s);
    },
  };
}
