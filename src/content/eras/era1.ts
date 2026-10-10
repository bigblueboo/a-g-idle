import type { EraDef } from "../../core/content-types";
import { text } from "./era1.text";

export const era1: EraDef = {
  id: 1,
  name: "Symbols",
  years: [1956, 1974],
  rate: 0.72,
  blurb: "A name for the field, two ways to build a mind, and the first promises.",
  verb: "PUNCH",
  press: "tap",
  periods: [],
  tab: "Lab",
  enter: [{ kind: "give", generator: "lab", n: 1 }, { kind: "grant", resource: "money", amount: 600 }, { kind: "grant", resource: "insight", amount: 2 }],
  generators: [
    { id: "grad", era: 1, name: "Graduate student", desc: "A graduate student. Paid in access to the machine at three in the morning.", kind: "people", cost: { money: 40 }, growth: 1.15, produces: { insight: 0.05 } },
    { id: "transistor_machine", era: 1, name: "Transistor computer", desc: "No tubes. It runs for a week without anyone opening the cabinet.", kind: "compute", cost: { money: 250 }, growth: 1.15, produces: { ops: 300 }, introYear: 1956 },
    { id: "core", era: 1, name: "Core memory bank", desc: "Tiny ferrite rings on a wire grid, threaded by hand. It remembers when the power goes off.", kind: "compute", cost: { money: 900 }, growth: 1.15, produces: { ops: 1500 }, introYear: 1958 },
    { id: "lab", era: 1, name: "Lab", desc: "A lab. A room, a grant number, and someone to write the next proposal.", kind: "people", cost: { money: 2500 }, growth: 1.18, produces: { money: 2.5, insight: 0.3 } },
    { id: "terminal", era: 1, name: "Time-sharing terminal", desc: "A teletype in the hall. Twenty people use the machine at once and each one thinks it's theirs.", kind: "compute", cost: { money: 3000 }, growth: 1.15, produces: { ops: 6000 }, introYear: 1961 },
    { id: "mini", era: 1, name: "Minicomputer", desc: "A PDP-8. Fits in a rack, costs what a house does, and the lab owns it outright.", kind: "compute", cost: { money: 9000 }, growth: 1.15, produces: { ops: 30000 }, introYear: 1965 },
  ],
  projects: [
    { id: "logic_theorist", era: 1, name: "Logic Theorist", year: 1956, track: "symbolic", cost: { insight: 30 }, fact: "Newell, Simon and Shaw. It proves 38 theorems from Principia Mathematica and finds one proof shorter than Russell's.", effects: [{ kind: "rung", rung: 2 }, { kind: "expectation", delta: 1 }] },
    { id: "lisp", era: 1, name: "LISP", year: 1958, track: "efficiency", cost: { insight: 60 }, fact: "McCarthy's LISP. Garbage collection, recursion, code as data. Still in use.", effects: [{ kind: "efficiency", mult: 1.5 }] },
    { id: "perceptron", era: 1, name: "Perceptron", year: 1958, track: "connectionist", cost: { insight: 45 }, fact: "Rosenblatt's Mark I Perceptron learns to tell shapes apart. The Navy says it will 'walk, talk, see, write, reproduce itself.'", effects: [{ kind: "groundwork", amount: 2 }, { kind: "expectation", delta: 1.5 }] },
    { id: "gps", era: 1, name: "General Problem Solver", year: 1959, track: "symbolic", cost: { insight: 90 }, fact: "Means-ends analysis. It solves the Tower of Hanoi and not much that isn't a puzzle.", effects: [{ kind: "mult", resource: "insight", mult: 1.3 }] },
    { id: "timesharing", era: 1, name: "Time-sharing", year: 1961, track: "efficiency", cost: { insight: 75 }, fact: "CTSS at MIT. The machine serves many people at once; each thinks it's theirs.", effects: [{ kind: "efficiency", mult: 1.4 }] },
    { id: "eliza", era: 1, name: "ELIZA", year: 1966, track: "symbolic", cost: { insight: 150 }, fact: "Weizenbaum's ELIZA matches patterns and reflects them back. People confide in it. He is horrified.", effects: [{ kind: "rung", rung: 3 }, { kind: "expectation", delta: 1 }] },
    { id: "shakey", era: 1, name: "Shakey", year: 1966, track: "symbolic", cost: { insight: 210 }, fact: "SRI's Shakey plans a route and pushes a box. A task takes hours. Life magazine calls it the 'first electronic person.'", effects: [{ kind: "expectation", delta: 1 }, { kind: "mult", resource: "ops", mult: 1.2 }] },
    { id: "linnainmaa", era: 1, name: "Reverse-mode differentiation", year: 1970, track: "connectionist", cost: { insight: 120 }, fact: "Seppo Linnainmaa publishes reverse-mode automatic differentiation in his master's thesis. Nobody in AI reads it for fifteen years.", effects: [{ kind: "groundwork", amount: 3 }] },
    { id: "shrdlu", era: 1, name: "SHRDLU", year: 1970, track: "symbolic", cost: { insight: 300 }, fact: "Winograd's SHRDLU moves blocks in a world of blocks and explains why. Outside the blocks world it knows nothing.", effects: [{ kind: "mult", resource: "insight", mult: 1.3 }, { kind: "expectation", delta: 0.5 }] },
  ],
  events: [
    { id: "dartmouth", year: 1956.3, title: "Dartmouth, summer 1956", text: "Ten people, eight weeks. The field gets its name.", effects: [{ kind: "expectation", delta: 1 }] },
    { id: "perceptrons", year: 1969, shock: true, warn: "Minsky and Papert are writing a book about perceptrons.", title: "Perceptrons (1969)", text: "Minsky and Papert prove a single-layer perceptron cannot learn XOR. Funding for networks dries up for a decade.", effects: [{ kind: "shock", name: "Perceptrons" }] },
    { id: "lighthill", year: 1973, shock: true, warn: "Sir James Lighthill has been asked to review the field.", title: "The Lighthill Report", text: "\"In no part of the field have the discoveries made so far produced the major impact that was then promised.\" British AI funding ends outside two universities.", effects: [{ kind: "shock", name: "Lighthill" }] },
  ],
  serendipity: [
    { id: "gradidea", label: "A grad student at the door", text: "\"I think I can do it with a list.\" It takes a weekend. It works.", reward: { kind: "burst", seconds: 30 } },
    { id: "surplus", label: "Surplus auction", text: "A university sells a working machine for scrap value because the new one arrived.", reward: { kind: "grant", resource: "money", seconds: 60 } },
  ],
  ...text,
  gate: {
    conditions: { rung: 3 },
    title: "The expert-system business",
    text: "Feigenbaum says knowledge is power. His students are writing rules for a living.",
  },
};
