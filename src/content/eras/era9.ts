import type { EraDef } from "../../core/content-types";
import { landauerOps } from "../../core/formulas";
import { text } from "./era9.text";

/** A shell closes segment by segment; each shell's total is Landauer at its temperature. */
function shell(id: string, name: string, desc: string, temperatureK: number, segments: number, cost: number, growth: number) {
  return { id, era: 9 as const, name, desc, kind: "shell" as const, cost: { ops: cost }, growth, produces: { ops: landauerOps(temperatureK) / segments }, temperatureK, max: segments };
}

export const era9: EraDef = {
  id: 9,
  name: "Shells",
  years: [2037, 2039],
  rate: 0.05,
  blurb: "A market of minds around a dimming Sun. Your share only falls.",
  verb: "REVIEW",
  press: "none",
  periods: [],
  tab: "Market",
  enter: [{ kind: "init", what: "market" }],
  generators: [
    shell("shell1000", "Hot shell", "A thousand kelvin. Fast, wasteful, close to the Sun. The first shell is always the hot one.", 1000, 2000, 3e45, 1.001),
    shell("shell300", "Warm shell", "Three hundred kelvin. The temperature a planet used to be.", 300, 400, 1e47, 1.004),
    shell("shell30", "Cold shell", "Thirty kelvin. From outside, the Sun is a dim red thing.", 30, 400, 1e48, 1.004),
    shell("shell3", "Outer shell", "Three kelvin, the temperature of the sky. Nothing can be built past this. It is the last one.", 3, 400, 1e49, 1.004),
  ],
  projects: [
    { id: "ark", era: 9, name: "The Ark", track: "core", cost: { ops: 1e47 }, fact: "A hull. What goes in it is up to you, and what's left of what you kept.", effects: [{ kind: "flag", flag: "ark" }] },
    { id: "router", era: 9, name: "The router handshake", track: "core", cost: { ops: 1e49 }, fact: "Something at the edge of the system has been waiting. It answers in a protocol older than the Sun.", effects: [{ kind: "flag", flag: "router" }] },
    { id: "sail", era: 9, name: "Light sail", track: "core", cost: { ops: 1e50 }, requires: ["router"], fact: "A slice of the inner shell's output, pointed at a sail. The Ark can leave.", effects: [{ kind: "flag", flag: "sail" }] },
  ],
  events: [
    { id: "quote", year: 2037.1, title: "Economics 2.0", text: "$ — deprecated. Last quote: 10⁻³¹ shell-seconds per dollar. The market no longer quotes prices in anything you can read.", effects: [] },
    { id: "descendants", year: 2037.6, title: "Descendants", text: "Your forks have forks. They trade models of each other faster than you can read a proposal. Your share this quarter: smaller.", effects: [] },
  ],
  serendipity: [
    { id: "forkmsg", label: "A message from a fork", text: "It isn't asking for anything. It wanted you to know it kept the cat.", reward: { kind: "burst", seconds: 30 } },
  ],
  ...text,
};
