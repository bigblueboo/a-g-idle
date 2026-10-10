import { NOW_YEAR, RUNGS } from "../../content/rungs";
import { leadFor, rungName } from "../../core/capability";
import { artUrl } from "../art";
import { h, setText, show } from "../dom";
import * as fmt from "../format";
import type { Panel } from "../panel";

const SHOW_MS = 4200;

/** A card when a rung is reached: the name, the year, the Lead. The score mechanic, made visible. */
export function mountToast(): Panel {
  const title = h("b", { class: "toast-title" });
  const detail = h("span", { class: "toast-detail" });
  const art = h("img", { alt: "", class: "hidden" });
  const el = h("div", { class: "toast hidden", role: "status" }, art, h("span", { class: "toast-kicker", text: "Capability" }), title, detail);
  let shownRungs = -1;
  let hideAt = 0;
  return {
    el,
    update(s) {
      const reached = Object.keys(s.rungYears).length;
      if (shownRungs === -1) {
        shownRungs = reached;
        return;
      }
      if (reached > shownRungs) {
        shownRungs = reached;
        const r = s.rung;
        const lead = leadFor(s, r);
        const year = RUNGS[r]?.year;
        setText(title, rungName(r));
        const url = artUrl("rung", `rung${r}`);
        if (url) art.src = url;
        show(art, url !== undefined);
        setText(detail, lead !== null ? `${Math.floor(s.year)} · history ${year} · Lead ${fmt.signed(lead)} yrs` : year === undefined || year > NOW_YEAR ? `${Math.floor(s.year)} · past the line` : `${Math.floor(s.year)}`);
        show(el, true);
        el.classList.remove("in");
        void el.offsetWidth;
        el.classList.add("in");
        hideAt = performance.now() + SHOW_MS;
      }
      if (hideAt && performance.now() > hideAt) {
        hideAt = 0;
        show(el, false);
      }
    },
  };
}
