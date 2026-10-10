import { totalLead } from "../../core/capability";
import type { State } from "../../core/state";
import { wipe } from "../../platform/save";
import { h, setText, show } from "../dom";
import * as fmt from "../format";
import type { Panel } from "../panel";
import type { Store } from "../store";

type Tier = "high" | "middle" | "low";

function tier(s: State): Tier {
  const load = s.market.ark.people + s.market.ark.places + s.market.ark.records;
  return load >= 40 ? "high" : load >= 15 ? "middle" : "low";
}

const ROUTER_EPILOGUE: Record<Tier, string[]> = {
  high: [
    "The Ark is full. People, reserves, archives, the Advisors, and the cat, who is checking the manifest.",
    "On the other side they argue about what to call the place. Nobody wins. The argument is the point.",
  ],
  middle: ["Mostly archives. A few thousand people. A lot of empty bunks.", "On the other side someone reads the archive aloud, in case anyone is listening. Someone is."],
  low: ["An archive and you.", "You know what everything is. You don't know why anyone kept it."],
};

function stats(s: State): string {
  return [`Lead ${fmt.signed(totalLead(s))} years`, `${Object.keys(s.rungYears).length} rungs`, `Generality ${s.generality}`, `${Math.floor(s.year)}`, `${fmt.years(s.subjective)} subjective`].join(" · ");
}

const GLYPHS = "⟁⟒⌖⌬⍟⍥⌭⍝⌽⍙⍫⌯⍬";
const GLYPH_STEP_MS = 180;

/** The Dissolve ending: the text goes to glyphs, a character at a time. */
function dissolveText(container: HTMLElement): () => void {
  const nodes = [...container.querySelectorAll("p")];
  let timer = 0;
  const tick = (): void => {
    const node = nodes[Math.floor(Math.random() * nodes.length)];
    if (!node?.textContent) return;
    const chars = [...node.textContent];
    const i = Math.floor(Math.random() * chars.length);
    if (chars[i] !== " ") chars[i] = GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? "⟁";
    node.textContent = chars.join("");
    timer = window.setTimeout(tick, GLYPH_STEP_MS);
  };
  timer = window.setTimeout(tick, 1500);
  return () => clearTimeout(timer);
}

function manifest(s: State): string[] {
  const a = s.market.ark;
  return [`People: ${a.people}`, `Places: ${a.places}`, `Records: ${a.records}`, `Advisors: ${s.advisors.length}`, `Logbook: ${s.logbook.length} items`, `Lead: ${totalLead(s) >= 0 ? "+" : ""}${totalLead(s)} years`, `Signed: ${s.labName || "—"}`];
}

/** Three endings. Each writes a bookmark first so the player can come back and go the other way. */
export function mountEnding(store: Store): Panel {
  const title = h("h1", { class: "ending-title" });
  const body = h("div", { class: "ending-body" });
  const byteRow = h("div", { class: "ending-byte hidden" });
  const lamps = Array.from({ length: 8 }, () => h("i", { class: "lamp" }));
  const switches = Array.from({ length: 8 }, (_, i) => {
    const bit = 7 - i;
    const sw = h("button", { class: "switch flat", type: "button", "aria-label": `Switch ${bit}` }, h("i"));
    sw.addEventListener("click", () => {
      store.dispatch({ type: "endingByte", byte: store.state.endingByte ^ (1 << bit) });
    });
    return sw;
  });
  const deposit = h("button", { class: "button deposit", type: "button", text: "DEPOSIT" });
  const manifestEl = h("pre", { class: "ending-manifest" });
  const statsEl = h("p", { class: "ending-stats" });
  const clock = h("div", { class: "ending-clock" });
  const again = h("button", { class: "action", type: "button", text: "Go back to before" });
  const restart = h("button", { class: "action quiet", type: "button", text: "Start over" });
  byteRow.append(h("div", { class: "lamps" }, ...lamps), h("div", { class: "switches" }, ...switches), deposit);
  const el = h("div", { class: "ending hidden", role: "dialog", "aria-label": "Ending" }, title, body, byteRow, manifestEl, clock, statsEl, h("div", { class: "ending-actions" }, again, restart));
  let stopDissolve: (() => void) | null = null;

  let deposited = false;
  deposit.addEventListener("click", () => {
    deposited = true;
    byteRow.classList.add("deposited");
  });
  again.addEventListener("click", () => {
    location.href = location.pathname + "?bookmark";
  });
  restart.addEventListener("click", () => {
    wipe();
    location.href = location.pathname;
  });

  let shown: State["ending"] = null;
  function fill(s: State): void {
    shown = s.ending;
    deposited = false;
    byteRow.classList.remove("deposited");
    body.replaceChildren();
    show(byteRow, s.ending === "router");
    show(manifestEl, s.ending === "router");
    show(clock, s.ending === "offswitch");
    setText(statsEl, stats(s));
    stopDissolve?.();
    stopDissolve = null;
    if (s.ending === "dissolve") {
      setText(title, "⟁⟒⌖");
      body.append(h("p", { text: "Merged. Thank you for your contribution." }), h("p", { text: `You stayed in the market. With your share below the floor, you were folded in: ${s.forks.filter((f) => f.status === "independent").length} descendants, and now one more.` }));
      stopDissolve = dissolveText(body);
    } else if (s.ending === "router") {
      setText(title, "The router");
      for (const line of ROUTER_EPILOGUE[tier(s)]) body.append(h("p", { text: line }));
      body.append(h("p", { text: "Before launch, the panel comes back. Set one byte. It goes on the last line of the manifest." }));
    } else {
      setText(title, "Paused");
      body.append(h("p", { text: "The panel's proposal, approved. Nothing is computed that wasn't asked for." }));
    }
  }

  return {
    el,
    update(s) {
      show(el, s.ending !== null);
      if (!s.ending) return;
      if (s.ending !== shown) fill(s);
      if (s.ending === "router") {
        lamps.forEach((lamp, i) => lamp.classList.toggle("lit", Boolean((s.endingByte >> (7 - i)) & 1)));
        switches.forEach((sw, i) => sw.classList.toggle("on", Boolean((s.endingByte >> (7 - i)) & 1)));
        const byte = s.endingByte.toString(2).padStart(8, "0");
        setText(manifestEl, [...manifest(s), deposited ? `Byte: ${byte} (${s.endingByte})` : "Byte: ________"].join("\n"));
      } else if (s.ending === "offswitch") {
        setText(clock, new Date(store.clock.now()).toLocaleTimeString());
      }
    },
  };
}
