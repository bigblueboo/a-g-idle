import { rungName } from "../../../core/capability";
import { powerCap, powerUsed } from "../../../core/derive";
import type { State } from "../../../core/state";
import type { ReleaseMode } from "../../../core/systems/race";
import { h, setDisabled, setStyle, setText, show } from "../../dom";
import * as fmt from "../../format";
import type { Panel } from "../../panel";
import type { Store } from "../../store";
import { mountRivals } from "../../widgets/rivals";
import { mountRuns } from "../../widgets/runs";

const SLICES = ["train", "serve", "research"] as const;

/** Era 5: one slider with three slices, the release decision, users, power, trust. */
export function mountDeploy(store: Store): Panel {
  const sliders = new Map<(typeof SLICES)[number], { input: HTMLInputElement; out: HTMLOutputElement }>();
  const sliceBox = h("div", { class: "alloc" });
  const value = (slice: (typeof SLICES)[number]): number => Number(sliders.get(slice)?.input.value ?? 0);
  for (const slice of SLICES) {
    const input = h("input", { type: "range", min: "0", max: "100", step: "1", "aria-label": `${slice} slice` });
    const out = h("output");
    input.addEventListener("input", () => store.dispatch({ type: "alloc", train: value("train"), serve: value("serve"), research: value("research") }));
    sliders.set(slice, { input, out });
    sliceBox.append(h("label", { class: "alloc-row" }, h("span", { class: "alloc-name", text: slice }), input, out));
  }
  const users = h("p", { class: "stat" });
  const power = h("p", { class: "stat" });
  const powerBar = h("div", { class: "bar power" });
  const release = h("div", { class: "release hidden" });
  const releaseText = h("p", { class: "stat" });
  const modes: [ReleaseMode, string, string][] = [
    ["ship", "SHIP NOW", "Full revenue now. Trust falls. Incidents happen."],
    ["staged", "STAGED", "Ten percent, then fifty, then everyone."],
    ["eval", "EVAL FIRST", "Six weeks. Trust rises. A rival may ship first."],
  ];
  release.append(h("h3", { text: "A model is ready" }), releaseText);
  for (const [mode, label, desc] of modes) {
    const b = h("button", { class: `action release-${mode}`, type: "button" }, h("b", { text: label }), h("span", { text: desc }));
    b.addEventListener("click", () => store.dispatch({ type: "release", mode }));
    release.append(b);
  }
  const runs = mountRuns(store);
  const rivals = mountRivals();
  const el = h("section", { class: "tab era-tab deploy-tab" }, release, h("h3", { text: "Compute allocation" }), sliceBox, users, h("div", { class: "gauge" }, powerBar), power, runs.el, rivals.el);

  let syncedAlloc = "";
  function syncSliders(s: State): void {
    const sig = `${s.alloc.train.toFixed(2)}:${s.alloc.serve.toFixed(2)}:${s.alloc.research.toFixed(2)}`;
    if (sig === syncedAlloc) return;
    syncedAlloc = sig;
    for (const slice of SLICES) {
      const row = sliders.get(slice);
      if (!row || document.activeElement === row.input) continue;
      row.input.value = String(Math.round(s.alloc[slice] * 100));
      row.out.textContent = `${Math.round(s.alloc[slice] * 100)}%`;
    }
  }

  return {
    el,
    update(s) {
      syncSliders(s);
      setText(users, `${fmt.si(s.users, 1)} users · ${fmt.money(s.rates.money, 5)}/s · valuation ×${s.valuation.toFixed(1)} · trust ${fmt.percent(s.trust)} · incidents ${s.incidents}`);
      const used = powerUsed(s);
      const cap = powerCap(s);
      setStyle(powerBar, "width", `${Math.min(100, (used / Math.max(cap, 1)) * 100)}%`);
      powerBar.classList.toggle("over", used > cap);
      setText(power, `Power ${fmt.watts(used)} of ${fmt.watts(cap)}${used > cap ? " · hardware is throttled; buy power" : ""}`);
      const rel = s.training.release;
      show(release, rel !== null);
      if (rel) setText(releaseText, `Loss ${rel.loss.toFixed(3)}. It would reach "${rungName(rel.rung)}".`);
      for (const b of release.querySelectorAll("button")) setDisabled(b, rel === null);
      runs.update(s);
      rivals.update(s);
    },
  };
}
