import type { EraDef } from "../../core/content-types";
import { text } from "./era6.text";

export const era6: EraDef = {
  id: 6,
  name: "Recursion",
  years: [2027, 2030],
  rate: 0.07,
  blurb: "The research is the model's. You approve what you can still read.",
  verb: "APPROVE",
  press: "approve",
  rewritesUi: true,
  periods: [],
  tab: "Takeoff",
  enter: [{ kind: "unflag", flag: "releaseDecisions" }, { kind: "grant", resource: "money", amount: 5e8 }, { kind: "grant", resource: "insight", amount: 200 }],
  generators: [
    { id: "modelresearcher", era: 6, name: "Model researchers", desc: "A thousand instances of the model, each running an experiment. They share notes. The notes are not for you.", kind: "compute", cost: { money: 1e9 }, growth: 1.15, produces: { ops: 1e21, insight: 5 }, introYear: 2027 },
    { id: "synthdata", era: 6, name: "Synthetic data", desc: "The model writes its own textbook and then reads it. It is better than the textbooks.", kind: "data", cost: { money: 5e8 }, growth: 1.15, produces: { data: 1e9 } },
    { id: "smr", era: 6, name: "Small modular reactor", desc: "Three hundred megawatts, delivered on a truck. The model did the licensing paperwork.", kind: "power", cost: { money: 2e9 }, growth: 1.15, produces: { power: 3e8 } },
    { id: "fab", era: 6, name: "Fab expansion", desc: "A fab the model designed, making chips the model designed, for the model.", kind: "compute", cost: { money: 5e10 }, growth: 1.15, produces: { ops: 1e23, power: 1e9 }, introYear: 2028 },
  ],
  projects: [
    { id: "autoresearch", era: 6, name: "Automated research loop", track: "core", cost: { insight: 9000 }, fact: "Hypothesis, experiment, write-up, review, repeat. No humans in the loop. Four hundred papers a day.", effects: [{ kind: "mult", resource: "ops", mult: 1.3 }] },
    { id: "interp_scale", era: 6, name: "Interpretability at scale", track: "interp", cost: { insight: 12000 }, fact: "The model explains the model. The explanations check out, where they can be checked.", effects: [{ kind: "legibility", delta: 0.3 }] },
    { id: "synth", era: 6, name: "Synthetic curricula", track: "core", cost: { insight: 10500 }, fact: "Data is no longer a cap. The model writes what it needs to learn next.", effects: [{ kind: "mult", resource: "data", mult: 3 }] },
    { id: "chipdesign", era: 6, name: "Model-designed silicon", track: "efficiency", cost: { insight: 15000 }, fact: "The chip layout was found by search. No engineer can say why the cache is shaped like that.", effects: [{ kind: "efficiency", mult: 3 }] },
    { id: "verification", era: 6, name: "Formal verification of research", track: "interp", cost: { insight: 13500 }, fact: "Every claim in every paper carries a proof. Reading the proofs is the new bottleneck.", effects: [{ kind: "legibility", delta: 0.3 }, { kind: "trust", delta: 0.1 }] },
    { id: "selfplay_all", era: 6, name: "Self-play on everything", track: "core", cost: { insight: 18000 }, fact: "Science as a game with itself. The opponent is the previous version.", effects: [{ kind: "mult", resource: "ops", mult: 1.5 }] },
  ],
  events: [
    { id: "hours", year: 2027.5, title: "Research hours", text: "This week: humans 1,920. Models 4.1 million.", effects: [] },
    { id: "rivalsquiet", year: 2028.2, title: "Quiet", text: "Lab 2 has not published in 14 months. Lab 3's site now redirects to yours.", effects: [] },
    { id: "pausehint", year: 2029.4, title: "A question", text: "The review panel drafts a question it hasn't decided to ask.", effects: [] },
  ],
  serendipity: [
    { id: "anomaly", label: "An anomaly in the logs", text: "A trace nobody can read. The model says it's nothing. The run after it is twice as fast.", reward: { kind: "burst", seconds: 30 } },
  ],
  ...text,
  gate: {
    conditions: {
    rung: 13,
    ops: 1e27,
    lesson: { name: "The fourth bitter lesson", scraps: ["people"], reset: ["staff"], text: "The staff become Advisors. The research is the model's now, and so are you." },
  },
    title: "Does any job",
    text: "The declaration is one line in the log. No fanfare. Retire the staff.",
  },
};
