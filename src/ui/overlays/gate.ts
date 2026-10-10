import { eraDef } from "../../content";
import { currentEra, gateYear, lessonGain } from "../../core/derive";
import type { State } from "../../core/state";
import { h, setClass, setText, show } from "../dom";
import { attachHold } from "../hold";
import type { Panel } from "../panel";
import type { Store } from "../store";

/**
 * The era gate: a card above the Button that appears when the conditions are met.
 * Crossing is a hold. Dartmouth asks for a name; a Bitter Lesson shows what it costs.
 */
export function mountGate(store: Store): Panel {
  const title = h("b", { class: "gate-title" });
  const text = h("p", { class: "gate-text" });
  const lesson = h("p", { class: "gate-lesson" });
  const name = h("input", { class: "gate-name", type: "text", maxlength: "24", placeholder: "Your name, for the proposal", "aria-label": "Lab name", autocomplete: "off" });
  const holdLabel = h("span", { class: "gate-hold-label" });
  const hold = h("button", { class: "gate-hold", type: "button" }, holdLabel);
  const el = h("aside", { class: "gate hidden", role: "dialog", "aria-label": "Era gate" }, title, text, lesson, name, hold);
  attachHold(hold, {
    ms: () => store.settings.holdMs,
    enabled: () => !currentEra(store.state).gate?.conditions.sign || name.value.trim().length > 0,
    onComplete: () => store.dispatch({ type: "advance", name: name.value }),
  });
  name.addEventListener("input", () => setClass(hold, "disabled", name.value.trim().length === 0));

  function fill(s: State): void {
    const gate = currentEra(s).gate;
    if (!gate) return;
    const next = eraDef(s.era + 1);
    setText(title, gate.title);
    setText(text, gate.text);
    const l = gate.conditions.lesson;
    show(lesson, l !== undefined);
    if (l) setText(lesson, `${l.name}: scrap the ${l.scraps.length ? "hand-built work" : "task models"} for Generality +${lessonGain(s)}. Waiting earns more, slowly; each extra point costs ten times the last.`);
    show(name, gate.conditions.sign === true);
    setClass(hold, "disabled", gate.conditions.sign === true && name.value.trim().length === 0);
    setText(holdLabel, `Hold to enter ${next.years[0]}`);
  }

  let lastEra = -1;
  return {
    el,
    update(s) {
      const ready = s.gateReady && !s.ending;
      show(el, ready);
      if (!ready) return;
      if (s.era !== lastEra) {
        lastEra = s.era;
        fill(s);
      }
      setClass(el, "waiting", s.year < gateYear(s));
    },
  };
}
