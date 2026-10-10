import type { EraDef } from "../../core/content-types";
import { text } from "./era5.text";

export const era5: EraDef = {
  id: 5,
  name: "Tokens",
  years: [2020, 2027],
  rate: 0.13,
  blurb: "Loss falls as a power law. Everything is a token, including the money.",
  verb: "PROMPT",
  press: "tap",
  periods: [],
  tab: "Deploy",
  enter: [
    { kind: "alloc", train: 0.5, serve: 0.3, research: 0.2 },
    { kind: "flag", flag: "releaseDecisions" },
    { kind: "flag", flag: "power" },
    { kind: "give", generator: "ppa", n: 2 },
    { kind: "grant", resource: "money", amount: 2e6 },
  ],
  generators: [
    { id: "campus", era: 5, name: "Datacenter campus", desc: "Four buildings, a substation, and a water permit. The town council has questions.", kind: "compute", cost: { money: 5e7 }, growth: 1.15, produces: { ops: 5e17 }, introYear: 2020 },
    { id: "ppa", era: 5, name: "Power purchase agreement", desc: "A gigawatt, contracted for twenty years from a plant that hasn't been built.", kind: "power", cost: { money: 2e7 }, growth: 1.15, produces: { power: 1e9 } },
    { id: "fleet", era: 5, name: "Inference fleet", desc: "Racks that answer questions. Every answer is a few tokens of revenue and a few tokens of data.", kind: "compute", cost: { money: 2e8 }, growth: 1.15, produces: { ops: 2e18, data: 2e7 }, introYear: 2021 },
    { id: "evals", era: 5, name: "Evals team", desc: "People whose job is to find out what the model can do before someone else does.", kind: "people", cost: { money: 5e6 }, growth: 1.15, produces: { insight: 2 } },
    { id: "silicon", era: 5, name: "Custom silicon", desc: "Your own chip. Tape-out took a year and the first batch has a bug in the interconnect. The second batch doesn't.", kind: "compute", cost: { money: 5e8 }, growth: 1.15, produces: { ops: 1e19 }, introYear: 2022 },
    { id: "gwcampus", era: 5, name: "Gigawatt campus", desc: "Gas turbines on site, because the grid said five years. The model designed the cooling.", kind: "compute", cost: { money: 5e9 }, growth: 1.15, produces: { ops: 5e20, power: 1e9 }, introYear: 2025, requires: "gigawatt" },
  ],
  projects: [
    { id: "scaling_laws", era: 5, name: "Scaling laws", year: 2020, track: "core", cost: { insight: 750 }, fact: "Loss falls as a power law in parameters, data, and compute, smoothly, over seven orders of magnitude. The fog lifts off the chart.", effects: [{ kind: "flag", flag: "scalingLaws" }, { kind: "efficiency", mult: 1.3 }] },
    { id: "instruction", era: 5, name: "Instruction tuning", year: 2022, track: "core", cost: { insight: 1500 }, fact: "Fine-tune on what people actually ask, with human feedback. The model learns to answer the way people want.", effects: [{ kind: "mult", resource: "money", mult: 1.5 }] },
    { id: "chinchilla", era: 5, name: "Compute-optimal training", year: 2022, track: "efficiency", cost: { insight: 1800 }, fact: "Twenty tokens per parameter. The big models were undertrained; a smaller one with more data beats them.", effects: [{ kind: "flag", flag: "computeOptimal" }, { kind: "efficiency", mult: 1.5 }] },
    { id: "flash", era: 5, name: "Attention kernels", year: 2022, track: "efficiency", cost: { insight: 1200 }, fact: "Attention that never materializes the matrix. Memory-bound to compute-bound in one paper.", effects: [{ kind: "efficiency", mult: 2 }] },
    { id: "chat", era: 5, name: "Chat release", year: 2023, track: "core", cost: { insight: 2250 }, requires: ["instruction"], fact: "A chatbot reaches 100 million users in two months. The fastest-growing consumer product in history, by a wide margin.", effects: [{ kind: "mult", resource: "money", mult: 2 }, { kind: "trust", delta: 0.05 }] },
    { id: "interp", era: 5, name: "Feature dictionaries", year: 2024, track: "interp", cost: { insight: 3750 }, fact: "Sparse features in the activations, labeled. A map of the model, incomplete and real.", effects: [{ kind: "trust", delta: 0.1 }, { kind: "legibility", delta: 0.1 }] },
    { id: "reasoning", era: 5, name: "Reasoning models", year: 2024, track: "core", cost: { insight: 4500 }, fact: "The model thinks before it answers, out loud, for as long as it needs. Math and code benchmarks fall in a quarter.", effects: [{ kind: "mult", resource: "ops", mult: 1.4 }, { kind: "groundwork", amount: 6 }] },
    { id: "moe", era: 5, name: "Mixture of experts", year: 2024, track: "efficiency", cost: { insight: 3000 }, fact: "Only a slice of the model runs per token. Ten times the parameters at the same cost.", effects: [{ kind: "efficiency", mult: 2 }] },
    { id: "agents", era: 5, name: "Agents", year: 2025, track: "core", cost: { insight: 6000 }, requires: ["reasoning"], fact: "The model uses tools, runs code, checks its work, and comes back an hour later with a pull request.", effects: [{ kind: "mult", resource: "money", mult: 1.5 }, { kind: "flag", flag: "agents" }] },
    { id: "distill", era: 5, name: "Distillation", year: 2025, track: "efficiency", cost: { insight: 5250 }, fact: "A small model trained to imitate a big one keeps most of the capability at a tenth of the cost.", effects: [{ kind: "efficiency", mult: 2 }] },
    { id: "gigawatt", era: 5, name: "Gigawatt campus plan", year: 2026, track: "core", cost: { insight: 7500, money: 1e9 }, fact: "One site, one gigawatt, one model. The permit is the long pole.", effects: [{ kind: "flag", flag: "gigawatt" }, { kind: "mult", resource: "power", mult: 1.5 }] },
  ],
  events: [
    { id: "exportcontrols", year: 2022.8, title: "Chip export controls", text: "The best accelerators can no longer be sold to the largest market. Smuggling cases follow within a year.", effects: [] },
    { id: "powerfight", year: 2024.5, title: "The power permit", text: "The utility says five years. The campus needs it in one. Someone buys a gas plant.", effects: [] },
    { id: "now", year: 2026, title: "The present", text: "The ghost line ends here. Everything past it is a guess, including yours.", effects: [] },
  ],
  serendipity: [
    { id: "viral", label: "A post goes viral", text: "A screenshot of the model being wrong, charmingly. Sign-ups double for a day.", reward: { kind: "grant", resource: "money", seconds: 60 } },
    { id: "benchmark_leak", label: "A benchmark result leaks", text: "Someone posts your internal eval numbers. They're good. The stock moves.", reward: { kind: "burst", seconds: 30 } },
  ],
  ...text,
  gate: {
    conditions: { rung: 12 },
    title: "It can do the research",
    text: "The model proposes an experiment, runs it, and writes it up. The write-up is better than yours.",
  },
};
