import { RUN_PRESETS } from "../../content/runs";
import { fmtParams } from "../../core/fmt";
import type { State } from "../../core/state";
import { optimalTokens, predictedLoss, runEta, runFlop, trainRate } from "../../core/systems/training";
import { mountLoss } from "../charts/loss";
import { h, setClass, setDisabled, setStyle, setText, show } from "../dom";
import * as fmt from "../format";
import type { Panel } from "../panel";
import type { Store } from "../store";

/** Run configuration, progress, hazards, and the loss chart. Shared by the Train, Deploy and Takeoff tabs. */
export function mountRuns(store: Store): Panel {
  let chosen = RUN_PRESETS[0] ?? 6e7;
  const presets = h("div", { class: "presets", role: "group", "aria-label": "Parameter count" });
  const presetButtons = new Map<number, HTMLButtonElement>();
  for (const N of RUN_PRESETS) {
    const b = h("button", { class: "preset", type: "button", text: fmtParams(N) });
    b.addEventListener("click", () => (chosen = N));
    presetButtons.set(N, b);
    presets.append(b);
  }
  const plan = h("p", { class: "stat" });
  const start = h("button", { class: "action", type: "button", text: "START RUN" });
  start.addEventListener("click", () => store.dispatch({ type: "startRun", N: chosen, D: optimalTokens(chosen) }));
  const progress = h("div", { class: "bar run" });
  const runText = h("p", { class: "stat" });
  const rollback = h("button", { class: "action warn", type: "button", text: "ROLLBACK" });
  rollback.addEventListener("click", () => store.dispatch({ type: "rollback" }));
  const runBox = h("div", { class: "run-box hidden" }, h("div", { class: "gauge" }, progress), runText, rollback);
  const chart = mountLoss();
  const el = h("section", { class: "runs" }, h("h3", { text: "Training run" }), presets, plan, start, runBox, chart.el);

  function planText(s: State): string {
    const D = optimalTokens(chosen);
    const flop = runFlop(chosen, D);
    const rate = trainRate(s);
    const eta = rate > 0 ? flop / rate : Infinity;
    const loss = predictedLoss(chosen, D);
    const lossText = s.flags.scalingLaws ? `loss ≈ ${loss.toFixed(2)}` : `loss somewhere between ${(loss * 0.85).toFixed(1)} and ${(loss * 1.25).toFixed(1)}`;
    const dataOk = D <= s.res.data;
    return `${fmtParams(chosen)} params · ${fmtParams(D)} tokens${dataOk ? "" : " (not enough data)"} · ${flop.toExponential(1)} FLOP · ${fmt.seconds(eta)} · ${lossText}`;
  }

  return {
    el,
    update(s) {
      for (const [N, b] of presetButtons) {
        setClass(b, "active", N === chosen);
        setClass(b, "unaffordable", optimalTokens(N) > s.res.data);
      }
      setText(plan, planText(s));
      const run = s.training.run;
      setDisabled(start, run !== null || s.training.release !== null || optimalTokens(chosen) > s.res.data);
      show(runBox, run !== null);
      if (run) {
        setStyle(progress, "width", `${(run.progress / run.flop) * 100}%`);
        setClass(progress, "spiked", run.spiked);
        setText(runText, `${fmtParams(run.N)} params · ${fmt.percent(run.progress / run.flop)} · ${fmt.seconds(runEta(s, run))} left${run.spiked ? " · LOSS SPIKE" : ""}`);
        show(rollback, run.spiked);
      }
      chart.update(s);
    },
  };
}
