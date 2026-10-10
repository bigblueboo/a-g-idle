import { generatorDef } from "../content";
import type { EraId, GateDef, LessonReset } from "./content-types";
import { currentEra, gateSatisfied, lessonGain } from "./derive";
import { applyEffects } from "./effects";
import { eraKey } from "./flags";
import { pushLog } from "./log";
import { hash } from "./rng";
import type { State } from "./state";
import { scrapFeatures } from "./systems/benchmarks";

const SEND_OFFS = [
  "went back to teaching",
  "wrote a memoir nobody edited",
  "took the boat out and did not say where",
  "kept the office and stopped using it",
  "still answers email, slowly",
  "asked to be the last one told",
  "planted something that takes forty years",
  "said the work was the point",
];

/** L4. Everyone on the staff list becomes an Advisor, and every people generator goes. */
function retireStaff(s: State): void {
  for (const p of s.staff) {
    s.advisors.push(p);
    s.fidelity.records += 0.5;
    pushLog(s, `${p.name}, ${p.role} since ${Math.floor(p.joined)}: ${SEND_OFFS[hash(p.name) % SEND_OFFS.length]}.`, "system");
  }
  s.staff = [];
  for (const id of Object.keys(s.counts)) if (generatorDef(id).kind === "people") delete s.counts[id];
}

const RESETS: Record<LessonReset, (s: State) => void> = {
  rules: (s) => {
    s.rules.count = 0;
    s.rules.bugs = 0;
  },
  features: scrapFeatures,
  staff: retireStaff,
};

/** Scrap the hand-built paradigm. Generality is forever; the paradigm tax ends. */
function takeLesson(s: State, lesson: NonNullable<GateDef["lesson"]>): void {
  const gain = lessonGain(s);
  for (const id of Object.keys(s.counts)) {
    const g = generatorDef(id);
    if (g.era === s.era && lesson.scraps.includes(g.kind)) delete s.counts[id];
  }
  for (const r of lesson.reset) RESETS[r](s);
  s.generality += gain;
  s.handcrafted = 0;
  pushLog(s, `${lesson.name}. ${lesson.text} Generality +${gain}.`, "system");
}

/** The player's hold on the gate card. Signs the name, takes the lesson, enters the next era. */
export function advanceEra(s: State, name?: string): boolean {
  if (!gateSatisfied(s) || s.era >= 9 || s.ending) return false;
  const gate = currentEra(s).gate?.conditions;
  if (!gate) return false;
  if (gate.sign) {
    if (!name?.trim()) return false;
    s.labName = name.trim().slice(0, 24);
  }
  if (gate.lesson) takeLesson(s, gate.lesson);
  s.era = (s.era + 1) as EraId;
  s.gateReady = false;
  const next = currentEra(s);
  s.flags[eraKey(s.era)] = true;
  pushLog(s, `${Math.floor(s.year)}. ${next.name}.`, "system");
  applyEffects(s, next.enter);
  return true;
}
