import { currentEra } from "../../core/derive";
import { hash } from "../../core/rng";
import { artUrl } from "../art";
import { h, setText, show } from "../dom";
import type { Panel } from "../panel";
import type { Store } from "../store";

/** The golden cookie. Appears at a seeded spot in the main area; a tap claims it. */
export function mountSerendipity(store: Store): Panel {
  const label = h("span");
  const art = h("img", { alt: "", class: "hidden" });
  const el = h("button", { class: "serendipity hidden", type: "button" }, art, label);
  el.addEventListener("click", () => store.dispatch({ type: "serendipity" }));
  let shownId = "";
  return {
    el,
    update(s) {
      const active = s.serendipity;
      show(el, active !== null && !s.ending);
      if (!active) {
        shownId = "";
        return;
      }
      if (active.id !== shownId) {
        shownId = active.id;
        const def = currentEra(s).serendipity.find((d) => d.id === active.id);
        setText(label, def?.label ?? "");
        const url = artUrl("spot", active.id);
        if (url) art.src = url;
        show(art, url !== undefined);
        const seed = hash(`${s.seed}:${active.expiresAt}`);
        el.style.setProperty("--x", `${15 + (seed % 60)}%`);
        el.style.setProperty("--y", `${30 + ((seed >> 8) % 40)}%`);
      }
      el.style.setProperty("--life", String(Math.max(0, (active.expiresAt - s.t) / 25)));
    },
  };
}
