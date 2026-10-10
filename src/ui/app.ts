import { botSecond, playUntil } from "../bot/policy";
import { catchUp, type AwayReport } from "../core/offline";
import { initialState, type State } from "../core/state";
import { step } from "../core/step";
import { makeClock } from "../platform/clock";
import { load, loadBookmark, save } from "../platform/save";
import { mountLayout } from "./layout";
import { showAway } from "./overlays/away";
import { Store } from "./store";

const DT = 0.1;
/** Past this much accumulated sim time in one frame, replay it as offline time. */
const LIVE_BACKLOG = 30;
const AUTOSAVE_MS = 10_000;
const AWAY_MIN_SECONDS = 60;

function initialLoad(params: URLSearchParams, now: number): { state: State; away: AwayReport | null } {
  const seed = Number(params.get("seed")) || (now & 0x7fffffff);
  const jump = params.get("era");
  if (jump !== null) return { state: playUntil(seed, (s) => s.era >= Number(jump)), away: null };
  if (params.has("bookmark")) {
    const marked = loadBookmark();
    if (marked) return { state: marked.state, away: null };
  }
  const saved = params.has("fresh") ? null : load();
  if (!saved) return { state: initialState(seed), away: null };
  const elapsed = (now - saved.savedAt) / 1000;
  return { state: saved.state, away: elapsed > AWAY_MIN_SECONDS ? catchUp(saved.state, elapsed) : null };
}

/** `?debug` exposes the store and a bot step for probes and e2e. */
declare global {
  interface Window {
    __game?: { store: Store; botSecond(): void };
  }
}

export function start(root: HTMLElement): void {
  const params = new URLSearchParams(location.search);
  const clock = makeClock(params);
  const { state, away } = initialLoad(params, clock.now());
  const store = new Store(state, clock, params);
  mountLayout(store, root);
  if (away) showAway(store, away);

  const autoplay = params.has("autoplay");
  const taps = { carry: 0 };
  let botSeconds = 0;
  if (params.has("debug")) window.__game = { store, botSecond: () => botSecond(store.state, botSeconds++, "greedy", taps) };
  let last = performance.now();
  let backlog = 0;

  function frame(now: number): void {
    backlog += ((now - last) / 1000) * clock.speed;
    last = now;
    if (backlog > LIVE_BACKLOG) {
      catchUp(store.state, backlog);
      backlog = 0;
    }
    while (backlog >= DT) {
      step(store.state, DT);
      backlog -= DT;
      if (autoplay && Math.floor(store.state.t) > botSeconds) {
        botSeconds = Math.floor(store.state.t);
        botSecond(store.state, botSeconds, "greedy", taps);
      }
    }
    store.frame();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  const persist = (): void => save(store.state, clock.now());
  setInterval(persist, AUTOSAVE_MS);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") persist();
    else last = performance.now();
  });
  window.addEventListener("pagehide", persist);
}
