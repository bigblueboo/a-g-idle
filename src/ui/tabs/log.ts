import type { State } from "../../core/state";
import { artUrlFor } from "../art";
import { h, keyedList, setText } from "../dom";
import * as fmt from "../format";
import type { Panel } from "../panel";
import type { Store } from "../store";

const SHOWN = 80;
const ANNOUNCE_EVERY_MS = 4000;

type Entry = State["log"][number] & { key: string };

export function mountLog(store: Store): Panel {
  const list = h("ol", { class: "log-list" });
  const live = h("div", { class: "sr-only", "aria-live": "polite" });
  const el = h("section", { class: "tab log" }, list, live);
  let lastAnnounced = 0;
  let lastLen = 0;
  const rows = keyedList<Entry, { el: HTMLElement; year: HTMLElement; text: HTMLElement }>(
    list,
    (e) => e.key,
    (e) => {
      const year = h("span", { class: "log-year" });
      const text = h("span", { class: "log-text" });
      const art = artUrlFor(e.art);
      return { el: h("li", { class: `log-entry voice-${e.voice}${art ? " with-art" : ""}` }, year, text, art ? h("img", { class: "log-thumb", src: art, alt: "", loading: "lazy" }) : null), year, text };
    },
    (row, e) => {
      setText(row.year, fmt.year(e.year));
      setText(row.text, e.text);
    },
  );
  return {
    el,
    update(s) {
      if (s.log.length === lastLen) return;
      lastLen = s.log.length;
      const start = Math.max(0, s.log.length - SHOWN);
      const entries: Entry[] = [];
      for (let i = s.log.length - 1; i >= start; i--) {
        const e = s.log[i];
        if (e) entries.push({ ...e, key: `${e.t}:${e.text}` });
      }
      rows.update(entries);
      const now = store.clock.now();
      if (now - lastAnnounced > ANNOUNCE_EVERY_MS && entries[0]) {
        lastAnnounced = now;
        setText(live, entries[0].text);
      }
    },
  };
}
