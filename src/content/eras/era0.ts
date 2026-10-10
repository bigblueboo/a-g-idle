import type { EraDef } from "../../core/content-types";
import { text } from "./era0.text";

export const era0: EraDef = {
  id: 0,
  name: "Switches",
  years: [1936, 1956],
  rate: 2.5,
  blurb: "Eight switches, a row of lamps, and the Army's firing tables.",
  verb: "DEPOSIT",
  press: "deposit",
  periods: [],
  tab: "Panel",
  enter: [],
  generators: [
    { id: "computer", era: 0, name: "Computer", desc: "A computer, which in 1936 is a person. She has a desk, a Marchant calculator, and a stack of forms.", kind: "people", cost: { money: 3 }, growth: 1.15, produces: { ops: 0.5 } },
    { id: "relay", era: 0, name: "Relay bank", desc: "Telephone relays, borrowed from the exchange. Each click is a bit.", kind: "compute", cost: { money: 12 }, growth: 1.15, produces: { ops: 2 }, introYear: 1937 },
    { id: "tube", era: 0, name: "Vacuum-tube rack", desc: "A rack of tubes. It warms the room and fails on Tuesdays.", kind: "compute", cost: { money: 60 }, growth: 1.15, produces: { ops: 12 }, introYear: 1943 },
    { id: "delayline", era: 0, name: "Mercury delay line", desc: "Memory as sound in a tube of mercury. Five feet long, a thousand bits.", kind: "compute", cost: { money: 300 }, growth: 1.15, produces: { ops: 60 }, introYear: 1947 },
    { id: "stored", era: 0, name: "Stored-program machine", desc: "The program lives in memory with the data. It can change itself.", kind: "compute", cost: { money: 1500 }, growth: 1.15, produces: { ops: 500 }, introYear: 1948, requires: "stored_design" },
  ],
  projects: [
    { id: "computable", era: 0, name: "On Computable Numbers", year: 1936, track: "core", cost: { money: 5 }, fact: "Turing's paper defines a machine that can compute anything computable. It is a thought experiment with a tape.", effects: [{ kind: "mult", resource: "ops", mult: 1.25 }] },
    { id: "stored_design", era: 0, name: "Stored-program design", year: 1945, track: "core", cost: { money: 150 }, fact: "The EDVAC report, June 1945, describes a machine whose program is data. Von Neumann's name is on it; Eckert and Mauchly's are not.", effects: [{ kind: "mult", resource: "ops", mult: 1.5 }] },
    { id: "assembler", era: 0, name: "Assembler", year: 1949, track: "efficiency", cost: { money: 120 }, fact: "Symbolic addresses instead of binary. Nobody has to remember where the subroutine lives.", effects: [{ kind: "efficiency", mult: 1.5 }] },
    { id: "turing_test", era: 0, name: "Computing Machinery and Intelligence", year: 1950, track: "core", cost: { money: 400 }, fact: "Turing proposes the imitation game and guesses machines will pass it by 2000. He is off by about two decades.", effects: [{ kind: "flag", flag: "ladder" }] },
    { id: "checkers", era: 0, name: "Checkers program", year: 1952, track: "rung", cost: { money: 900 }, requires: ["turing_test"], fact: "Arthur Samuel's checkers program at IBM learns from its own games. By 1962 it beats a state champion.", effects: [{ kind: "rung", rung: 1 }, { kind: "groundwork", amount: 1 }] },
  ],
  events: [
    { id: "eniac", year: 1945, title: "ENIAC", text: "Eighteen thousand tubes. It computes a shell's trajectory faster than the shell flies.", effects: [{ kind: "rung", rung: 0 }] },
    { id: "transistor", year: 1947, title: "The transistor", text: "Bell Labs, December 1947. It does what a tube does, cold, and will get smaller every year for seventy years.", effects: [{ kind: "efficiency", mult: 1.2 }] },
  ],
  serendipity: [
    { id: "moth", label: "A moth in relay 70", text: "Harvard Mark II, 1947. Grace Hopper's team tapes the moth into the logbook. \"First actual case of bug being found.\"", reward: { kind: "burst", seconds: 30 } },
  ],
  ...text,
  gate: {
    conditions: { rung: 1, ops: 1e4, projects: ["turing_test"], sign: true },
    title: "The Dartmouth proposal",
    text: "Ten people, two months, 1956. \"Every aspect of learning can in principle be so precisely described that a machine can be made to simulate it.\" Sign it.",
  },
};
