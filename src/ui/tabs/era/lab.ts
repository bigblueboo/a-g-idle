import { BALANCE } from "../../../core/balance";
import { hype } from "../../../core/derive";
import type { StaffT } from "../../../core/state";
import { fundingMult } from "../../../core/systems/hype";
import { h, keyedList, setClass, setStyle, setText, show } from "../../dom";
import type { Panel } from "../../panel";
import type { Store } from "../../store";

const GAUGE_MAX = 8;

/** Era 1: the lab. Who works here, and how far the public's expectation has run ahead. */
export function mountLab(store: Store): Panel {
  const expectBar = h("div", { class: "bar expect" });
  const rungBar = h("div", { class: "bar rung" });
  const gaugeText = h("p", { class: "stat" });
  const winter = h("p", { class: "winter hidden" });
  const staffList = h("ul", { class: "staff" });
  const staffEmpty = h("p", { class: "hint", text: "Nobody yet. Graduate students are cheap and labs write grants." });
  const el = h(
    "section",
    { class: "tab era-tab lab-tab" },
    h("h3", { text: "Expectation" }),
    h("div", { class: "gauge", "aria-hidden": "true" }, rungBar, expectBar),
    gaugeText,
    winter,
    h("h3", { text: "Staff" }),
    staffList,
    staffEmpty,
  );
  const rows = keyedList<StaffT, { el: HTMLElement }>(
    staffList,
    (p) => p.name,
    (p) => ({ el: h("li", {}, h("b", { text: p.name }), h("span", { text: ` ${p.role}, since ${Math.floor(p.joined)}` })) }),
    () => {},
  );
  return {
    el,
    update(s) {
      setStyle(expectBar, "width", `${Math.min(100, (s.expectation / GAUGE_MAX) * 100)}%`);
      setStyle(rungBar, "width", `${Math.min(100, (s.rung / GAUGE_MAX) * 100)}%`);
      const gap = hype(s);
      setText(gaugeText, `The public expects a machine ${gap.toFixed(1)} rung${Math.abs(gap) === 1 ? "" : "s"} ${gap >= 0 ? "ahead of" : "behind"} what you have. Funding ×${fundingMult(s).toFixed(2)}.`);
      setClass(gaugeText, "warn", gap > 2);
      show(winter, s.winter !== null);
      if (s.winter) setText(winter, `Winter since ${Math.floor(s.winter.startedYear)}. Funding ×${BALANCE.hype.winterFunding}. Ends when capability reaches ${(BALANCE.hype.winterRecovery * s.winter.targetExpectation).toFixed(1)}. Unfashionable research pays double.`);
      rows.update(s.staff);
      show(staffEmpty, s.staff.length === 0);
    },
  };
}
