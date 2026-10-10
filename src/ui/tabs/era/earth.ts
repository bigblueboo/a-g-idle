import { mountGlobe } from "../../charts/globe";
import { h, setText } from "../../dom";
import * as fmt from "../../format";
import type { Panel } from "../../panel";
import type { Store } from "../../store";
import { mountFidelity } from "../../widgets/fidelity";
import { mountForks } from "../../widgets/forks";

/** Era 8: the globe. Tap a tile, then act on it with the Button. */
export function mountEarth(store: Store): Panel {
  const globe = mountGlobe((id) => (store.ui.selectedTile = id));
  const summary = h("p", { class: "stat" });
  const uploads = h("p", { class: "stat" });
  const fidelity = mountFidelity();
  const forks = mountForks(store);
  const el = h(
    "section",
    { class: "tab era-tab earth-tab" },
    globe.el,
    summary,
    uploads,
    fidelity.el,
    h("p", { class: "hint", text: "Convert takes a tile's matter and compute. Preserve locks it as a reserve. Offer upload lets residents join you at a rate set by Trust. Converting people who haven't consented is allowed. Mercury raises no such questions; it is only slower." }),
    forks.el,
  );
  return {
    el,
    update(s) {
      globe.update(s, store.ui.selectedTile);
      const t = s.earth.tiles;
      const converted = t.filter((x) => x.state === "converted").length;
      const preserved = t.filter((x) => x.state === "preserved").length;
      const pop = t.reduce((a, x) => a + x.pop, 0);
      const up = t.reduce((a, x) => a + x.uploaded, 0);
      setText(summary, `${converted} of ${t.length} tiles converted · ${preserved} preserved · trust ${fmt.percent(s.trust)}`);
      setText(uploads, `${fmt.si(up, 1)} of ${fmt.si(pop, 1)} people uploaded (${fmt.percent(pop > 0 ? up / pop : 0, 1)})`);
      fidelity.update(s);
      forks.update(s);
    },
  };
}
