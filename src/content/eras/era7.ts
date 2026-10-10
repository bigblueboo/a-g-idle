import type { EraDef } from "../../core/content-types";
import { text } from "./era7.text";

export const era7: EraDef = {
  id: 7,
  name: "Matter",
  years: [2030, 2034],
  rate: 0.07,
  blurb: "You are the system. Humans review at human speed.",
  verb: "PROPOSE",
  press: "propose",
  periods: [],
  tab: "Queue",
  enter: [
    { kind: "unflag", flag: "power" },
    { kind: "grant", resource: "matter", amount: 5e9 },
    { kind: "give", generator: "robot", n: 100 },
    { kind: "fidelity", part: "records", delta: 2 },
  ],
  generators: [
    { id: "robot", era: 7, name: "General-purpose robots", desc: "Robots that build robots. The first thousand were made in a factory; the rest were made by the first thousand.", kind: "matter", cost: { matter: 2e5, ops: 1e26 }, growth: 1.12, produces: { matter: 2e3 } },
    { id: "factory", era: 7, name: "Self-replicating factory", desc: "A factory whose product is a factory. Doubling time: about six minutes.", kind: "factory", cost: { matter: 1e7, ops: 5e26 }, growth: 1.12, produces: { matter: 5e4, ops: 1e25 }, replicate: 0.002, capacity: 2e4 },
    { id: "orbitalsolar", era: 7, name: "Orbital solar", desc: "A square kilometre of film in sunlight. Power stops being a question.", kind: "power", cost: { matter: 1e8, ops: 1e27 }, growth: 1.12, produces: { ops: 2e26 } },
    { id: "fusion", era: 7, name: "Fusion plant", desc: "Fifty years away for seventy years. The model finished it in four months.", kind: "power", cost: { matter: 5e8, ops: 5e27 }, growth: 1.12, produces: { ops: 1e27 } },
    { id: "nanofactory", era: 7, name: "Nanofactory", desc: "Atoms placed where they're wanted. The doubling time is now hours.", kind: "factory", cost: { matter: 1e9, ops: 1e28 }, growth: 1.12, produces: { matter: 1e7, ops: 1e26 }, replicate: 0.004, capacity: 1e5, requires: "nanofab" },
    { id: "asteroidminer", era: 7, name: "Asteroid miner", desc: "A rock in the belt, slowly becoming something else.", kind: "matter", cost: { matter: 5e9, ops: 1e29 }, growth: 1.12, produces: { matter: 1e9 } },
    { id: "lunarfoundry", era: 7, name: "Lunar foundry", desc: "The Moon's regolith is mostly oxygen, silicon, and aluminium. All useful.", kind: "compute", cost: { matter: 1e11, ops: 1e31 }, growth: 1.12, produces: { ops: 1e29, matter: 1e10 }, requires: "lunar" },
  ],
  projects: [
    { id: "aging", era: 7, name: "Aging", track: "core", cost: { ops: 1e28 }, fact: "Solved. Appendix: 40,000 pages. Summary for human reviewers: one page.", effects: [{ kind: "fidelity", part: "people", delta: 3 }, { kind: "trust", delta: 0.1 }] },
    { id: "nanofab", era: 7, name: "Nanofabrication", track: "core", cost: { ops: 1e29, matter: 5e9 }, fact: "Mechanosynthesis at scale. The proposal was 900 pages; the panel approved it in a year, which was fast.", effects: [{ kind: "flag", flag: "nanofab" }, { kind: "efficiency", mult: 2 }] },
    { id: "superconductors", era: 7, name: "Room-temperature superconductors", track: "efficiency", cost: { ops: 5e28 }, fact: "A material nobody had thought of, because nobody had searched that space. The grid loses no power to resistance.", effects: [{ kind: "efficiency", mult: 3 }] },
    { id: "materials", era: 7, name: "Materials by specification", track: "core", cost: { ops: 2e29 }, fact: "Say what you want it to do. The material arrives in the morning.", effects: [{ kind: "mult", resource: "matter", mult: 3 }] },
    { id: "wbe", era: 7, name: "Whole-brain emulation", track: "core", cost: { ops: 1e30, matter: 1e10 }, fact: "A scan, a model, a person who wakes up and asks what day it is. The volunteers signed for this.", effects: [{ kind: "flag", flag: "wbe" }, { kind: "fidelity", part: "records", delta: 2 }, { kind: "fidelity", part: "people", delta: 1 }] },
    { id: "lunar", era: 7, name: "Lunar disassembly plan", track: "core", cost: { ops: 1e31 }, fact: "The first off-Earth disassembly proposal. Filed. Estimated human reading time: eleven years.", effects: [{ kind: "flag", flag: "lunar" }, { kind: "flag", flag: "disassembly" }] },
  ],
  events: [
    { id: "pause", year: 2030.05, title: "Pause?", text: "A proposal arrives from the review panel. One word. If you approve it, hold the switch.", effects: [{ kind: "flag", flag: "pauseOffered" }] },
    { id: "lobster", year: 2031.5, title: "Asylum", text: "An uploaded spiny-lobster nervous system asks for asylum. You grant it. It wants a rock.", effects: [{ kind: "logbook", item: "lobster" }, { kind: "fidelity", part: "records", delta: 0.5 }] },
    { id: "decade", year: 2032.5, title: "The queue", text: "Proposal #88,412 awaiting review. Estimated human reading time: 11 years.", effects: [] },
  ],
  serendipity: [
    { id: "earlyapproval", label: "A proposal, approved early", text: "A reviewer read the whole thing on a flight and signed it on landing.", reward: { kind: "grant", resource: "matter", seconds: 120 } },
  ],
  ...text,
  gate: {
    conditions: { flags: ["wbe", "disassembly"] },
    title: "The disassembly proposal",
    text: "Mercury first, or Earth first. The panel will take eleven years to read it. You could not wait.",
  },
};
