import type { EraDef } from "../../core/content-types";
import { artUrl } from "../art";
import { h } from "../dom";

const DURATION_MS = 3200;

/** Era change: the old interface comes apart and the new one assembles. Skippable; a crossfade under reduced motion. */
export function playTransition(root: HTMLElement, era: EraDef, year: number): void {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hero = artUrl("era", `era${era.id}`);
  const el = h("div", { class: `transition${reduced ? " reduced" : ""}`, role: "status" }, hero ? h("img", { class: "transition-hero", src: hero, alt: "" }) : null, h("div", { class: "transition-year", text: String(year) }), h("div", { class: "transition-name", text: era.name }), h("div", { class: "transition-blurb", text: era.blurb }), h("div", { class: "transition-skip", text: "tap to skip" }));
  const done = (): void => el.remove();
  el.addEventListener("click", done);
  root.append(el);
  root.classList.add("in-transition");
  setTimeout(() => {
    root.classList.remove("in-transition");
    done();
  }, reduced ? 800 : DURATION_MS);
}
