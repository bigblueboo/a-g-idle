import { h } from "../../dom";
import type { Panel } from "../../panel";
import type { Store } from "../../store";
import { mountRivals } from "../../widgets/rivals";
import { mountRuns } from "../../widgets/runs";

/** Era 4: runs and the leaderboard. */
export function mountTrain(store: Store): Panel {
  const runs = mountRuns(store);
  const rivals = mountRivals();
  const el = h("section", { class: "tab era-tab train-tab" }, runs.el, rivals.el);
  return {
    el,
    update(s) {
      runs.update(s);
      rivals.update(s);
    },
  };
}
