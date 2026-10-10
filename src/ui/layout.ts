import { eraDef } from "../content";
import type { State } from "../core/state";
import { attachAudio } from "../platform/audio";
import { attachHaptics } from "../platform/haptics";
import { bookmark } from "../platform/save";
import { mountButton } from "./button";
import { h, setClass, setText, show } from "./dom";
import { mountHud } from "./hud";
import { mountEnding } from "./overlays/ending";
import { mountGate } from "./overlays/gate";
import { mountSerendipity } from "./overlays/serendipity";
import { mountSettings } from "./overlays/settings";
import { mountToast } from "./overlays/toast";
import { playTransition } from "./overlays/transition";
import type { Panel } from "./panel";
import type { Store, UiState } from "./store";
import { mountBuild } from "./tabs/build";
import { mountEraTab } from "./tabs/era";
import { mountLog } from "./tabs/log";
import { mountResearch } from "./tabs/research";

type TabId = UiState["tab"];
const TAB_ORDER: TabId[] = ["build", "research", "era", "log"];
const TAB_KEYS: Record<string, TabId> = { "1": "build", "2": "research", "3": "era", "4": "log" };
const TAB_LABEL: Record<Exclude<TabId, "era">, string> = { build: "Build", research: "Research", log: "Log" };

/** Era skins are CSS. Everything keys off `data-era`, the era's current period, and the Era 6 drift. */
function applySkin(s: State, contrast: boolean): void {
  const root = document.documentElement;
  const era = eraDef(s.era);
  const period = era.periods.filter((p) => s.year >= p.from).at(-1)?.name ?? "";
  const drift = era.rewritesUi ? (1 - s.legibility).toFixed(2) : "0";
  if (root.dataset.era !== String(s.era)) root.dataset.era = String(s.era);
  if (root.dataset.period !== period) root.dataset.period = period;
  const winter = s.winter ? "1" : "";
  if (root.dataset.winter !== winter) root.dataset.winter = winter;
  if (root.style.getPropertyValue("--drift") !== drift) root.style.setProperty("--drift", drift);
  setClass(root, "contrast", contrast);
}

export function mountLayout(store: Store, root: HTMLElement): void {
  const hud = mountHud();
  const button = mountButton(store);
  const gate = mountGate(store);
  const serendipity = mountSerendipity(store);
  const ending = mountEnding(store);
  const settings = mountSettings(store);
  const toast = mountToast();
  const main = h("main", { class: "main" });
  const tabbar = h("nav", { class: "tabbar panel-plate", "aria-label": "Sections" });

  const fixed: Record<Exclude<TabId, "era">, Panel> = { build: mountBuild(store), research: mountResearch(store), log: mountLog(store) };
  let era: { id: number; panel: Panel } | null = null;
  const tabButtons = new Map<TabId, HTMLButtonElement>();

  function eraPanel(s: State): Panel {
    if (!era || era.id !== s.era) {
      era?.panel.el.remove();
      era = { id: s.era, panel: mountEraTab(store, s.era) };
      main.append(era.panel.el);
    }
    return era.panel;
  }

  for (const id of TAB_ORDER) {
    const b = h("button", { class: "tab", type: "button", "data-tab": id });
    b.addEventListener("click", () => (store.ui.tab = id));
    tabButtons.set(id, b);
    tabbar.append(b);
  }
  tabbar.append(settings.trigger);

  main.append(fixed.build.el, fixed.research.el);
  root.append(hud.el, fixed.log.el, main, gate.el, serendipity.el, button.el, tabbar, toast.el, ending.el, settings.el);
  const wide = matchMedia("(min-width: 1024px)");
  attachAudio(store);
  attachHaptics(store);

  document.addEventListener("keydown", (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    const tab = TAB_KEYS[e.key];
    if (tab) store.ui.tab = tab;
    const press = eraDef(store.state.era).press;
    if (e.key === " " && !e.repeat && (press === "tap" || press === "approve" || press === "propose" || press === "deposit")) {
      e.preventDefault();
      store.dispatch(press === "deposit" ? { type: "deposit", byte: 0 } : { type: press });
    }
    const head = store.state.queue.items[0];
    if (press === "none" && head && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
      store.dispatch({ type: "review", id: head.id, approve: e.key === "ArrowRight" });
    }
  });

  let lastEra = store.state.era;
  let lastEnding = store.state.ending;
  store.onFrame((s) => {
    applySkin(s, store.settings.contrast);
    if (s.era !== lastEra) {
      lastEra = s.era;
      playTransition(root, eraDef(s.era), Math.floor(s.year));
    }
    if (s.ending !== lastEnding) {
      lastEnding = s.ending;
      if (s.ending) bookmark(s, store.clock.now());
    }
    hud.update(s);
    button.update(s);
    gate.update(s);
    serendipity.update(s);
    ending.update(s);
    toast.update(s);
    const current = eraPanel(s);
    // On a laptop the Log is its own column; on a phone it's a tab like the others.
    const logAside = wide.matches;
    if (logAside && store.ui.tab === "log") store.ui.tab = "build";
    show(main, logAside || store.ui.tab !== "log");
    for (const id of TAB_ORDER) {
      const panel = id === "era" ? current : fixed[id];
      const on = id === store.ui.tab || (id === "log" && logAside);
      show(panel.el, on);
      if (on) panel.update(s);
      const b = tabButtons.get(id);
      if (!b) continue;
      setClass(b, "active", on);
      setText(b, id === "era" ? eraDef(s.era).tab : TAB_LABEL[id]);
      b.setAttribute("aria-current", on ? "page" : "false");
    }
    setClass(root, "no-button", eraDef(s.era).press === "none");
  });
}
