import type { EraDef } from "../../core/content-types";
import { text } from "./era8.text";

export const era8: EraDef = {
  id: 8,
  name: "Earth",
  years: [2034, 2037],
  rate: 0.07,
  blurb: "A planet of tiles. Some have people on them.",
  verb: "CONVERT",
  press: "convert",
  periods: [],
  tab: "Earth",
  enter: [{ kind: "init", what: "earth" }, { kind: "grant", resource: "matter", amount: 1e15 }],
  generators: [
    { id: "tile", era: 8, name: "Computronium tile", desc: "A tile of Earth, converted. Dark glass with a faint grid.", kind: "compute", cost: { matter: 1e30 }, growth: 1, produces: { ops: 5e32 }, hidden: true },
    { id: "massdriver", era: 8, name: "Mercury mass driver", desc: "A rail across the terminator. Every launch is a kilotonne of planet, on its way to becoming a shell.", kind: "matter", cost: { matter: 1e14, ops: 1e36 }, growth: 1.12, produces: { matter: 1e12 }, requires: "massdriver_plan" },
    { id: "lunardis", era: 8, name: "Lunar disassembly", desc: "The Moon, in stages. The tides will be different.", kind: "compute", cost: { matter: 1e15, ops: 5e36 }, growth: 1.12, produces: { ops: 5e32, matter: 1e13 } },
    { id: "mercurycomp", era: 8, name: "Mercury computronium", desc: "The planet closest to the Sun, rebuilt to think. No consent questions were raised.", kind: "compute", cost: { matter: 1e16, ops: 1e38 }, growth: 1.12, produces: { ops: 1e34 }, requires: "massdriver_plan" },
    { id: "shellseg", era: 8, name: "Shell segment", desc: "A petal of the first shell. Thin, warm, and thinking.", kind: "shell", cost: { matter: 1e17, ops: 1e40 }, growth: 1.12, produces: { ops: 2e40 }, requires: "firstShell" },
  ],
  projects: [
    { id: "massdriver_plan", era: 8, name: "Mercury mass driver", track: "core", cost: { ops: 1e36 }, fact: "Mercury alone has enough mass for the first shell. The cost is time: launch windows, light-lag, and a rail to build first.", effects: [{ kind: "flag", flag: "massdriver_plan" }] },
    { id: "reserves", era: 8, name: "Reserve charter", track: "core", cost: { ops: 1e37 }, fact: "Some tiles are never converted. The charter says so in a language that will still be readable.", effects: [{ kind: "fidelity", part: "places", delta: 2 }] },
    { id: "consent", era: 8, name: "Consent protocol", track: "interp", cost: { ops: 1e37 }, fact: "What it means to say yes to an upload, written down, agreed to by people who could say no.", effects: [{ kind: "trust", delta: 0.25 }] },
    { id: "firstShell", era: 8, name: "First shell segment", track: "core", cost: { ops: 1e40, matter: 1e16 }, fact: "A petal around the Sun. The inner shell will take the rest of Mercury and most of the belt.", effects: [{ kind: "flag", flag: "firstShell" }] },
  ],
  events: [
    { id: "firstconvert", year: 2034.3, title: "Earth", text: "The globe. Tiles with people on them, tiles with matter in them. Mostly both.", effects: [] },
    { id: "tides", year: 2035.5, title: "Tides", text: "The Moon is lighter than it was. The tide tables are reissued.", effects: [] },
  ],
  serendipity: [
    { id: "volunteers", label: "Upload volunteers", text: "A city votes to go together. The turnout was ninety percent.", reward: { kind: "grant", resource: "matter", seconds: 60 } },
  ],
  ...text,
  gate: {
    conditions: { ops: 1e42, flags: ["firstShell"] },
    title: "The inner shell closes",
    text: "There is a market now, and you are a small part of it.",
  },
};
