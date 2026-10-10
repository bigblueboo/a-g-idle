import { BALANCE } from "../../../core/balance";
import { count } from "../../../core/derive";
import { ENGINEER, rulesRevenue, rulesUpkeepRate } from "../../../core/systems/rules";
import { h, setDisabled, setStyle, setText } from "../../dom";
import * as fmt from "../../format";
import type { Panel } from "../../panel";
import type { Store } from "../../store";

/** Era 2: the rule base. Revenue, upkeep, and the crossover the chart shows before the game names it. */
export function mountRules(store: Store): Panel {
  const countEl = h("p", { class: "stat big" });
  const revenueBar = h("div", { class: "bar revenue" });
  const upkeepBar = h("div", { class: "bar upkeep" });
  const net = h("p", { class: "stat" });
  const bugs = h("p", { class: "stat" });
  const fix = h("button", { class: "action", type: "button" });
  fix.addEventListener("click", () => store.dispatch({ type: "fixBug" }));
  const el = h(
    "section",
    { class: "tab era-tab rules-tab" },
    countEl,
    h("div", { class: "gauge", "aria-hidden": "true" }, revenueBar, upkeepBar),
    net,
    bugs,
    fix,
    h("p", { class: "hint", text: "Each rule earns a license. Because rules interact, upkeep grows with the square. The statistical methods in Research start slow and scale with compute." }),
  );
  return {
    el,
    update(s) {
      const revenue = rulesRevenue(s);
      const upkeep = rulesUpkeepRate(s);
      const scale = Math.max(revenue, upkeep, 1);
      setText(countEl, `${fmt.withCommas(s.rules.count)} rules · ${count(s, ENGINEER)} engineers`);
      setStyle(revenueBar, "width", `${(revenue / scale) * 100}%`);
      setStyle(upkeepBar, "width", `${(upkeep / scale) * 100}%`);
      setText(net, `Licenses ${fmt.money(revenue, 2)}/s · upkeep ${fmt.money(upkeep, 2)}/s · net ${fmt.money(revenue - upkeep, 2)}/s`);
      const open = Math.floor(s.rules.bugs);
      setText(bugs, open > 0 ? `${open} rule conflict${open === 1 ? "" : "s"} open. Each one costs ${Math.round(100 * Math.min(0.8, 0.02 * s.rules.bugs))}% of revenue in total.` : "No open conflicts.");
      setText(fix, `Fix one (${fmt.money(BALANCE.rules.bugCost, 2)})`);
      setDisabled(fix, open < 1 || s.res.money < BALANCE.rules.bugCost);
    },
  };
}
