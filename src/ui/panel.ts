import type { State } from "../core/state";

/** A mounted piece of UI. Built once; `update` runs every frame it is visible. */
export interface Panel {
  el: HTMLElement;
  update(s: State): void;
}
