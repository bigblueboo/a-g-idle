import { eraDef } from "../content";
import type { Action } from "../core/actions";
import type { Press } from "../core/content-types";
import { lampPattern, tapValue } from "../core/derive";
import { fmtPeople } from "../core/fmt";
import type { State, TileT } from "../core/state";
import { remaining, tileById } from "../core/systems/earth";
import { h, setClass, setText, show } from "./dom";
import * as fmt from "./format";
import { attachHold } from "./hold";
import type { Panel } from "./panel";
import type { Store } from "./store";

const HOLD_TRAIN_MS = 110;
const NUDGE_AFTER_PRESSES = 12;
const NUDGE_MISS_RATE = 0.2;

/** Era 0: eight switches, a lamp row, and a DEPOSIT key. The lamps suggest a byte; matching it pays. */
function switchPanel(store: Store): Panel {
  let byte = 0;
  const switches = Array.from({ length: 8 }, (_, i) => {
    const bit = 7 - i;
    const sw = h("button", { class: "switch flat", type: "button", "aria-label": `Switch ${bit}`, "aria-pressed": "false" }, h("i"));
    sw.addEventListener("click", () => {
      byte ^= 1 << bit;
      sw.setAttribute("aria-pressed", String((byte >> bit) & 1));
      sw.classList.toggle("on", Boolean((byte >> bit) & 1));
    });
    return sw;
  });
  const lamps = Array.from({ length: 8 }, () => h("i", { class: "lamp" }));
  const key = h("button", { class: "button deposit", type: "button", text: "DEPOSIT" });
  key.addEventListener("click", () => store.dispatch({ type: "deposit", byte }));
  const el = h("div", { class: "panel0" }, h("div", { class: "lamps", "aria-label": "Lamps" }, ...lamps), h("div", { class: "switches" }, ...switches), key);
  return {
    el,
    update(s) {
      const pattern = lampPattern(s);
      lamps.forEach((lamp, i) => setClass(lamp, "lit", Boolean((pattern >> (7 - i)) & 1)));
      setClass(el, "match", byte === pattern);
      setClass(el, "untouched", s.taps === 0);
    },
  };
}

/** What a press does, by the era's `press`. Convert needs a selected tile and a hold. */
const PRESS_ACTION: Record<Exclude<Press, "deposit" | "none" | "convert">, Action> = {
  tap: { type: "tap" },
  approve: { type: "approve" },
  propose: { type: "propose" },
};

/** Eras 1–8: one big verb. "Hold to train" repeats the tap; Era 6 presses itself; Era 8 acts on a tile. */
function verbButton(store: Store): Panel {
  const label = h("span", { class: "verb" });
  const sub = h("span", { class: "verb-sub" });
  const btn = h("button", { class: "button verb-button", type: "button" }, label, sub);
  const tileActions = h("div", { class: "tile-actions" });
  const el = h("div", { class: "verb-area" }, btn, tileActions);
  let holdTimer = 0;
  let lastBatchAt = 0;

  const press = (): Press => eraDef(store.state.era).press;
  const selected = (): number | null => store.ui.selectedTile;

  btn.addEventListener("click", () => {
    const p = press();
    if (p === "tap" || p === "approve" || p === "propose") store.dispatch(PRESS_ACTION[p]);
  });
  btn.addEventListener("pointerdown", () => {
    if (!eraDef(store.state.era).holdToRepeat) return;
    clearInterval(holdTimer);
    holdTimer = window.setInterval(() => store.dispatch({ type: "tap" }), HOLD_TRAIN_MS);
  });
  for (const type of ["pointerup", "pointercancel", "pointerleave"]) btn.addEventListener(type, () => clearInterval(holdTimer));
  attachHold(btn, {
    ms: () => store.settings.holdMs,
    enabled: () => press() === "convert" && selected() !== null,
    onComplete: () => {
      const id = selected();
      if (id !== null) store.dispatch({ type: "tile", id, op: "convert" });
    },
  });

  const preserve = h("button", { class: "tile-op", type: "button", text: "Preserve" });
  const upload = h("button", { class: "tile-op", type: "button", text: "Offer upload" });
  const onTile = (op: "preserve" | "upload") => (): void => {
    const id = selected();
    if (id !== null) store.dispatch({ type: "tile", id, op });
  };
  preserve.addEventListener("click", onTile("preserve"));
  upload.addEventListener("click", onTile("upload"));
  tileActions.append(preserve, upload);

  const selectedTile = (s: State): TileT | undefined => {
    const id = selected();
    return id === null ? undefined : tileById(s, id);
  };

  function subText(s: State, p: Press): string {
    if (p === "approve") return s.recursion.batches.length ? `${s.recursion.batches.length} unread` : "nothing unread";
    if (p === "propose") return `${s.queue.items.length} in queue`;
    if (p === "convert") {
      const t = selectedTile(s);
      return t ? `${t.name} · ${t.state}${t.pop > 0 ? ` · ${fmtPeople(remaining(t))} people` : ""}` : "select a tile";
    }
    return `+${fmt.ops(tapValue(s), s.era)}`;
  }

  return {
    el,
    update(s) {
      const def = eraDef(s.era);
      const p = def.press;
      setText(label, def.verb);
      setText(sub, subText(s, p));
      setClass(btn, "self-press", p === "approve");
      show(tileActions, p === "convert");
      if (p === "approve" && s.recursion.nextBatchAt !== lastBatchAt) {
        lastBatchAt = s.recursion.nextBatchAt;
        btn.classList.remove("pulse");
        void btn.offsetWidth;
        btn.classList.add("pulse");
      }
      if (p === "convert") {
        const t = selectedTile(s);
        btn.disabled = !t || t.state === "converted";
        preserve.disabled = !t || t.state !== "natural";
        upload.disabled = !t || t.pop === 0 || t.state === "uploading" || t.state === "converted";
        setClass(btn, "danger", Boolean(t && remaining(t) > 1e5));
      } else if (btn.disabled) btn.disabled = false;
    },
  };
}

export function mountButton(store: Store): Panel {
  const el = h("section", { class: "button-area panel-plate" });
  const panels = { deposit: switchPanel(store), verb: verbButton(store) };
  let current: Panel | null = null;
  // Era 6: the interface watches where presses land. Misses are presses in the area that aren't on the button.
  let hits = 0;
  let misses = 0;
  el.addEventListener("pointerdown", (e) => {
    if (!eraDef(store.state.era).rewritesUi) return;
    if (e.target instanceof Element && e.target.closest(".button")) hits += 1;
    else misses += 1;
    const total = hits + misses;
    if (total >= NUDGE_AFTER_PRESSES && misses / total >= NUDGE_MISS_RATE && !store.state.flags.nudged) {
      store.dispatch({ type: "nudge", missPercent: (100 * misses) / total });
    }
  });
  return {
    el,
    update(s) {
      setClass(el, "nudged", s.flags.nudged === true);
      const p = eraDef(s.era).press;
      const next = p === "deposit" ? panels.deposit : panels.verb;
      if (next !== current) {
        current?.el.remove();
        current = next;
        el.append(next.el);
      }
      show(el, p !== "none" && !s.ending);
      next.update(s);
    },
  };
}
