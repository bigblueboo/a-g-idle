import { ERAS } from "../../../content";
import { artUrl, artUrlFor } from "../../art";
import { h, keyedList, setText } from "../../dom";
import * as fmt from "../../format";
import type { State } from "../../../core/state";
import type { Panel } from "../../panel";
import type { Store } from "../../store";

const RECENT = 4;
const ITEM_LABELS = new Map(ERAS.flatMap((e) => e.serendipity).map((d) => [d.id, d.label]));
ITEM_LABELS.set("cat", "A robot cat");
ITEM_LABELS.set("lobster", "An uploaded lobster");

/** Era 0's tab, and the collection screen under the hood: everything the player has caught. */
export function mountLogbook(store: Store): Panel {
  const tag = h("p", { class: "paper-tag", text: "1936. Set a byte. Deposit it." });
  const hint = h("p", { class: "hint", text: "The lamps suggest a byte. Set the switches to match it and DEPOSIT for ×5. The pattern changes every half minute." });
  const taps = h("p", { class: "stat" });
  const list = h("ul", { class: "logbook" });
  const empty = h("p", { class: "hint", text: "Nothing taped in yet. Things turn up." });
  const recent = h("ol", { class: "log-list recent" });
  const el = h("section", { class: "tab era-tab logbook-tab" }, tag, hint, taps, recent, h("h3", { text: "Logbook" }), list, empty);
  const recentRows = keyedList<State["log"][number], { el: HTMLElement }>(
    recent,
    (e) => `${e.t}:${e.text}`,
    (e) => {
      const art = artUrlFor(e.art);
      return { el: h("li", { class: `log-entry voice-${e.voice}${art ? " with-art" : ""}` }, h("span", { class: "log-year", text: fmt.year(e.year) }), h("span", { class: "log-text", text: e.text }), art ? h("img", { class: "log-thumb", src: art, alt: "", loading: "lazy" }) : null) };
    },
    () => {},
  );
  const rows = keyedList<string, { el: HTMLElement }>(
    list,
    (id) => id,
    (id) => {
      const art = artUrl("spot", id);
      return { el: h("li", { class: "logbook-item" }, art ? h("img", { class: "logbook-thumb", src: art, alt: "", loading: "lazy" }) : null, h("span", { text: ITEM_LABELS.get(id) ?? id })) };
    },
    () => {},
  );
  return {
    el,
    update(s) {
      setText(taps, `${fmt.withCommas(s.taps)} deposits. ${s.flags.contract ? `Machine time sold for ${fmt.money(s.res.money, 0)} so far.` : "Ten ops and someone will want to buy machine time."}`);
      recentRows.update(s.log.slice(-RECENT).reverse());
      recent.classList.toggle("hidden", s.log.length === 0);
      rows.update(s.logbook);
      empty.classList.toggle("hidden", s.logbook.length > 0);
      hint.classList.toggle("hidden", s.era !== 0 || s.taps === 0);
      tag.classList.toggle("hidden", s.taps > 0);
    },
  };
}
