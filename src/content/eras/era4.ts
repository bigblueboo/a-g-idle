import type { EraDef } from "../../core/content-types";
import { text } from "./era4.text";

export const era4: EraDef = {
  id: 4,
  name: "Gradients",
  years: [2012, 2020],
  rate: 0.13,
  blurb: "The gradient does the engineering. Two gaming GPUs, six days.",
  verb: "STEP",
  press: "tap",
  holdToRepeat: true,
  periods: [],
  tab: "Train",
  enter: [{ kind: "init", what: "rivals" }, { kind: "grant", resource: "money", amount: 60000 }, { kind: "alloc", train: 1, serve: 0, research: 0 }],
  generators: [
    { id: "gpunode", era: 4, name: "GPU node", desc: "Eight cards in a box that sounds like a hair dryer. It trains in six days what took a cluster six weeks.", kind: "compute", cost: { money: 8000 }, growth: 1.15, produces: { ops: 8e12 }, introYear: 2012 },
    { id: "labelers", era: 4, name: "Labeling contractors", desc: "A thousand people drawing boxes around pedestrians for cents an image.", kind: "data", cost: { money: 3000 }, growth: 1.15, produces: { data: 1e6 } },
    { id: "resident", era: 4, name: "Research resident", desc: "A resident. Came from physics, reads every preprint, sleeps under the desk during the deadline.", kind: "people", cost: { money: 20000 }, growth: 1.15, produces: { insight: 0.5 } },
    { id: "cluster", era: 4, name: "Multi-node cluster", desc: "Sixty-four nodes and a fast interconnect. Gradients cross the room in microseconds.", kind: "compute", cost: { money: 150000 }, growth: 1.15, produces: { ops: 2e14 }, introYear: 2014 },
    { id: "tpu", era: 4, name: "Tensor accelerator", desc: "A chip that does one thing. It does it at a rate that makes the GPUs look general.", kind: "compute", cost: { money: 2e6 }, growth: 1.15, produces: { ops: 5e15 }, introYear: 2016 },
    { id: "pod", era: 4, name: "Accelerator pod", desc: "A thousand accelerators wired as one. The job scheduler is the hardest code in the building.", kind: "compute", cost: { money: 3e7 }, growth: 1.15, produces: { ops: 1e17 }, introYear: 2018 },
  ],
  projects: [
    { id: "alexnet", era: 4, name: "AlexNet", year: 2012, track: "neural", cost: { insight: 1500 }, fact: "Top-5 error 15.3%. Second place 26.2%. Two gaming GPUs, six days of training.", effects: [{ kind: "mult", resource: "ops", mult: 1.5 }, { kind: "expectation", delta: 1 }] },
    { id: "word2vec", era: 4, name: "Word vectors", year: 2013, track: "neural", cost: { insight: 1800 }, fact: "King minus man plus woman is queen. Nobody fully explains why.", effects: [{ kind: "mult", resource: "data", mult: 1.5 }] },
    { id: "cudnn", era: 4, name: "GPU kernel library", year: 2014, track: "efficiency", cost: { insight: 2100 }, fact: "Hand-tuned convolutions. The same model, twice as fast, no new cards.", effects: [{ kind: "efficiency", mult: 1.5 }] },
    { id: "gan", era: 4, name: "GANs", year: 2014, track: "neural", cost: { insight: 2250 }, fact: "Two networks, one forging and one detecting. The forgeries get good.", effects: [{ kind: "expectation", delta: 1 }, { kind: "mult", resource: "money", mult: 1.2 }] },
    { id: "resnet", era: 4, name: "Residual networks", year: 2015, track: "neural", cost: { insight: 3000 }, fact: "Skip connections. A 152-layer network trains. Deeper is now just better.", effects: [{ kind: "efficiency", mult: 1.5 }] },
    { id: "alphago", era: 4, name: "AlphaGo", year: 2016, track: "rung", cost: { insight: 4500, money: 500000 }, fact: "AlphaGo beats Lee Sedol 4–1. Move 37 was played by nothing human.", effects: [{ kind: "rung", rung: 7 }, { kind: "expectation", delta: 2 }] },
    { id: "attention", era: 4, name: "Attention-only architecture", year: 2017, track: "neural", cost: { insight: 6000 }, fact: "Attention is all you need. Eight authors, one architecture, everything after.", effects: [{ kind: "efficiency", mult: 2 }, { kind: "flag", flag: "transformer" }] },
    { id: "mixedprecision", era: 4, name: "Mixed precision", year: 2017, track: "efficiency", cost: { insight: 3750 }, fact: "Sixteen-bit math where it doesn't matter, thirty-two where it does. The hardware was waiting for this.", effects: [{ kind: "efficiency", mult: 1.8 }] },
    { id: "pretrain", era: 4, name: "Pretrained language models", year: 2018, track: "neural", cost: { insight: 7500 }, requires: ["attention"], fact: "Pretrain on everything, fine-tune on the task. The task-specific model is obsolete the day it ships.", effects: [{ kind: "mult", resource: "ops", mult: 1.5 }, { kind: "groundwork", amount: 5 }] },
    { id: "zeroshot", era: 4, name: "Zero-shot language models", year: 2019, track: "neural", cost: { insight: 10500 }, requires: ["pretrain"], fact: "Ask it in English. No fine-tuning. The lab decides the full model is too dangerous to release, then releases it.", effects: [{ kind: "groundwork", amount: 5 }, { kind: "expectation", delta: 2 }] },
  ],
  events: [
    { id: "move37", year: 2016.2, title: "Move 37", text: "The commentators think it is a mistake. Lee Sedol leaves the room for fifteen minutes.", effects: [{ kind: "expectation", delta: 1 }] },
    { id: "gpushortage", year: 2017.8, title: "GPU shortage", text: "Cryptocurrency miners are buying every card. The lab's order slips a quarter.", effects: [] },
  ],
  serendipity: [
    { id: "preprint", label: "A preprint everyone is reading", text: "It was posted at midnight. By morning three labs have reproduced it.", reward: { kind: "burst", seconds: 30 } },
    { id: "kaggle", label: "A competition result", text: "Your resident wins a public leaderboard with a trick from a forum post.", reward: { kind: "grant", resource: "insight", seconds: 90 } },
  ],
  ...text,
  gate: {
    conditions: {
    rung: 7,
    projects: ["pretrain"],
    lesson: { name: "The third bitter lesson", scraps: [], reset: [], text: "One pretrained model replaces every task model. The benchmarks stop being separate problems." },
  },
    title: "One model",
    text: "Every task model you trained is a special case of the one you're about to train. Consolidate.",
  },
};
