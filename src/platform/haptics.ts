import type { Store } from "../ui/store";

const PATTERN: Record<string, number | number[]> = { tap: 8, deposit: 10, buy: 15, research: [15, 30, 15], advance: [30, 40, 60], serendipity: [10, 20, 10], bypass: 40, leave: [60, 60, 120] };

/** Short ticks on Android. iOS Safari has no vibration API, so nothing happens there. */
export function attachHaptics(store: Store): void {
  if (typeof navigator.vibrate !== "function") return;
  store.onAction((a, ok) => {
    if (!ok || !store.settings.haptics) return;
    const p = PATTERN[a.type];
    if (p !== undefined) navigator.vibrate(p);
  });
}
