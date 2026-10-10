import type { EraDef } from "../../core/content-types";
import { text } from "./era2.text";

export const era2: EraDef = {
  id: 2,
  name: "Rules",
  years: [1974, 1993],
  rate: 0.48,
  blurb: "Knowledge is power. Write it down as rules, and keep writing.",
  verb: "RUN",
  press: "tap",
  periods: [{ from: 1984, name: "desktop" }],
  tab: "Rules",
  enter: [{ kind: "grant", resource: "money", amount: 3000 }],
  generators: [
    { id: "micro", era: 2, name: "Microprocessor board", desc: "An 8080 on a board. The whole machine is one chip and a power supply.", kind: "compute", cost: { money: 400 }, growth: 1.15, produces: { ops: 2e5 }, introYear: 1974 },
    { id: "engineer", era: 2, name: "Knowledge engineer", desc: "A knowledge engineer. Interviews an expert for a month and writes down what she says she does.", kind: "people", cost: { money: 1500 }, growth: 1.15, produces: { insight: 0.1 } },
    { id: "super", era: 2, name: "Supercomputer", desc: "A Cray-1. There is a bench around it, and a plaque.", kind: "compute", cost: { money: 400000 }, growth: 1.15, produces: { ops: 1.6e8 }, introYear: 1976 },
    { id: "lispm", era: 2, name: "Lisp machine", desc: "A Lisp machine. Sixty thousand dollars, and it runs Lisp in hardware. Everyone who can afford one buys one, once.", kind: "compute", cost: { money: 40000 }, growth: 1.15, produces: { ops: 8e6 }, introYear: 1980 },
    { id: "workstation", era: 2, name: "Workstation", desc: "A Sun. Unix, a big screen, a network port. It runs Lisp fine.", kind: "compute", cost: { money: 6000 }, growth: 1.15, produces: { ops: 2e6 }, introYear: 1982 },
  ],
  projects: [
    { id: "mycin", era: 2, name: "MYCIN", year: 1976, track: "symbolic", cost: { insight: 225 }, fact: "MYCIN diagnoses blood infections from 600 rules and does it as well as the specialists. It is never used on a patient; the liability question has no answer.", effects: [{ kind: "rung", rung: 4 }, { kind: "expectation", delta: 1 }] },
    { id: "prolog", era: 2, name: "Prolog", year: 1977, track: "symbolic", cost: { insight: 300 }, fact: "Logic as a programming language. Japan will bet a decade on it.", effects: [{ kind: "mult", resource: "insight", mult: 1.3 }] },
    { id: "compiler", era: 2, name: "Optimizing compiler", year: 1979, track: "efficiency", cost: { insight: 375 }, fact: "Register allocation by graph coloring. The same program, twice as fast, no new hardware.", effects: [{ kind: "efficiency", mult: 1.5 }] },
    { id: "xcon", era: 2, name: "XCON", year: 1980, track: "symbolic", cost: { insight: 450 }, fact: "XCON configures VAX orders for DEC: 2,500 rules, growing to 10,000. It saves tens of millions a year and takes a team to keep alive.", effects: [{ kind: "mult", resource: "money", mult: 1.5 }, { kind: "expectation", delta: 1 }] },
    { id: "neocognitron", era: 2, name: "Neocognitron", year: 1980, track: "connectionist", cost: { insight: 300 }, fact: "Fukushima's Neocognitron stacks layers of local feature detectors. It is a convolutional network nine years before the name.", effects: [{ kind: "groundwork", amount: 3 }] },
    { id: "risc", era: 2, name: "RISC", year: 1985, track: "efficiency", cost: { insight: 525 }, fact: "Fewer instructions, each one fast. The compiler does the work the microcode used to.", effects: [{ kind: "efficiency", mult: 1.6 }] },
    { id: "backprop", era: 2, name: "Backpropagation", year: 1986, track: "connectionist", cost: { insight: 600 }, fact: "Rumelhart, Hinton and Williams. Backpropagation trains multi-layer networks, which solves XOR, which was the whole objection.", effects: [{ kind: "groundwork", amount: 5 }, { kind: "efficiency", mult: 1.3 }] },
    { id: "tdgammon", era: 2, name: "TD-Gammon", year: 1992, track: "neural", cost: { insight: 900 }, fact: "Tesauro's TD-Gammon learns backgammon from self-play and plays at the level of the best humans. The opening theory changes.", effects: [{ kind: "groundwork", amount: 4 }, { kind: "mult", resource: "ops", mult: 1.2 }] },
  ],
  events: [
    { id: "fifth_gen", year: 1982, title: "The Fifth Generation project", text: "Japan announces a ten-year program to build machines that reason. Every other government panics and funds something.", effects: [{ kind: "expectation", delta: 2 }] },
    { id: "mac", year: 1984, title: "The Macintosh", text: "A bitmapped screen and a mouse. Within a year the CRT is a desktop.", effects: [] },
    { id: "lisp_crash", year: 1987, shock: true, warn: "Lisp-machine orders are down for the third quarter.", title: "The Lisp-machine market collapses", text: "Workstations run Lisp as well as the special hardware did, at a fifth of the price. Symbolics and LMI fold within two years.", effects: [{ kind: "shock", name: "The Lisp-machine collapse" }] },
  ],
  serendipity: [
    { id: "floppy", label: "A 5¼\" floppy in the mail", text: "Someone's backprop code, commented in Finnish. It runs.", reward: { kind: "burst", seconds: 30 } },
    { id: "conference", label: "A conference talk", text: "Someone shows a network recognizing handwritten zip codes. Half the room leaves; the other half stays late.", reward: { kind: "grant", resource: "insight", seconds: 90 } },
  ],
  ...text,
  gate: {
    conditions: {
    rung: 4,
    projects: ["backprop"],
    lesson: { name: "The first bitter lesson", scraps: ["people"], reset: ["rules"], text: "The rules go. The knowledge engineers go. What learns from data stays." },
  },
    title: "The statisticians are winning",
    text: "A thousand rules versus a thousand examples, and the examples are cheaper. Scrap the rules.",
  },
};
