import type { EraDef } from "../../core/content-types";
import { text } from "./era3.text";

export const era3: EraDef = {
  id: 3,
  name: "Statistics",
  years: [1993, 2012],
  rate: 0.4,
  blurb: "Enough examples beat any rule. Crawl the web and count.",
  verb: "CRAWL",
  press: "tap",
  periods: [{ from: 2005, name: "glossy" }],
  tab: "Benchmarks",
  enter: [{ kind: "init", what: "benchmarks" }, { kind: "grant", resource: "money", amount: 8000 }, { kind: "grant", resource: "data", amount: 1e6 }, { kind: "logbook", item: "cat" }],
  generators: [
    { id: "crawler", era: 3, name: "Web crawler", desc: "A crawler. It fetches a page, follows the links, and never sleeps. The web has ten million pages and you intend to have all of them.", kind: "data", cost: { money: 800 }, growth: 1.15, produces: { data: 1e4 }, introYear: 1993 },
    { id: "beowulf", era: 3, name: "Beowulf cluster", desc: "Sixteen cheap PCs and an Ethernet switch. It out-benchmarks the machine with the plaque.", kind: "compute", cost: { money: 3000 }, growth: 1.15, produces: { ops: 5e8 }, introYear: 1994 },
    { id: "featureeng", era: 3, name: "Feature engineer", desc: "A feature engineer. Knows which pixels matter for faces and which words matter for spam, and will tell you for a salary.", kind: "people", cost: { money: 5000 }, growth: 1.15, produces: { insight: 0.2 } },
    { id: "rack", era: 3, name: "Server rack", desc: "Forty-two units of beige. The crawl now lives here.", kind: "compute", cost: { money: 12000 }, growth: 1.15, produces: { ops: 4e9, data: 5e4 }, introYear: 1998 },
    { id: "datacenter", era: 3, name: "Data center", desc: "A building with a substation. Nobody who works here has seen the servers.", kind: "compute", cost: { money: 250000 }, growth: 1.15, produces: { ops: 1e11, data: 1e6 }, introYear: 2003 },
    { id: "gpu", era: 3, name: "GPU", desc: "A graphics card, bought for the matrix multiplies. The games are incidental.", kind: "compute", cost: { money: 1500 }, growth: 1.15, produces: { ops: 1e12 }, introYear: 2007, requires: "gpgpu" },
  ],
  projects: [
    { id: "svm", era: 3, name: "Support vector machines", year: 1995, track: "core", cost: { insight: 450 }, fact: "Cortes and Vapnik. For a decade, the thing to beat.", effects: [{ kind: "mult", resource: "money", mult: 1.3 }] },
    { id: "deepblue", era: 3, name: "Deep Blue", year: 1997, track: "rung", cost: { insight: 900, money: 40000 }, fact: "Deep Blue beats Kasparov 3½–2½. Two hundred million positions a second, and a book of openings.", effects: [{ kind: "rung", rung: 5 }, { kind: "expectation", delta: 2 }] },
    { id: "lstm", era: 3, name: "LSTM", year: 1997, track: "neural", cost: { insight: 600 }, fact: "Hochreiter and Schmidhuber's LSTM. Memory that lasts. Twenty years before it is everywhere.", effects: [{ kind: "groundwork", amount: 4 }] },
    { id: "pagerank", era: 3, name: "Link analysis", year: 1998, track: "core", cost: { insight: 750 }, fact: "The web ranks itself. A page is important if important pages link to it.", effects: [{ kind: "mult", resource: "data", mult: 2 }, { kind: "mult", resource: "money", mult: 1.5 }] },
    { id: "randomforest", era: 3, name: "Random forests", year: 2001, track: "core", cost: { insight: 600 }, fact: "Breiman's random forests. Hundreds of bad trees vote and are right.", effects: [{ kind: "mult", resource: "money", mult: 1.3 }] },
    { id: "mapreduce", era: 3, name: "MapReduce", year: 2004, track: "efficiency", cost: { insight: 675 }, fact: "The cluster is one computer if you write it that way.", effects: [{ kind: "efficiency", mult: 1.6 }] },
    { id: "netflix", era: 3, name: "Netflix Prize", year: 2006, track: "core", cost: { insight: 750 }, fact: "A million dollars for 10% better recommendations. Three years, thousands of teams, and the winning blend is never deployed.", effects: [{ kind: "mult", resource: "money", mult: 1.3 }] },
    { id: "gpgpu", era: 3, name: "General-purpose GPU computing", year: 2007, track: "efficiency", cost: { insight: 1050 }, fact: "CUDA. A graphics card becomes a general-purpose processor, if you can write the kernels.", effects: [{ kind: "flag", flag: "gpgpu" }, { kind: "efficiency", mult: 2 }] },
    { id: "imagenet", era: 3, name: "ImageNet", year: 2009, track: "core", cost: { insight: 1200, data: 5e7 }, fact: "Fei-Fei Li's ImageNet: 14 million labeled images, labeled by hand. The benchmark that ends the argument.", effects: [{ kind: "flag", flag: "imagenet" }, { kind: "mult", resource: "data", mult: 2 }] },
  ],
  events: [
    { id: "gamesix", year: 1997.4, title: "Game six", text: "Kasparov resigns after nineteen moves. He accuses IBM of cheating. IBM retires the machine.", effects: [{ kind: "expectation", delta: 1 }] },
    { id: "dotcom", year: 2000.2, shock: true, warn: "The NASDAQ is at five thousand.", title: "The dot-com crash", text: "Five trillion dollars of market value gone in two years. The crawlers keep crawling.", effects: [{ kind: "shock", name: "The dot-com crash" }] },
    { id: "dennard", year: 2006, title: "Dennard scaling ends", text: "Transistors stop getting cheaper to run as they shrink. Clock speeds freeze near 4 GHz. Growth now comes from more cores.", effects: [] },
  ],
  serendipity: [
    { id: "popup", label: "Congratulations! You are the 1,000,000th visitor!", text: "You click it. It is, against all odds, a working link to a dataset.", reward: { kind: "grant", resource: "data", seconds: 120 } },
    { id: "cat", label: "A robot cat", text: "Someone brought a robot cat to the lab. It sits on the warm rack. It stays.", reward: { kind: "burst", seconds: 30 } },
  ],
  ...text,
  gate: {
    conditions: {
    rung: 5,
    projects: ["imagenet", "gpgpu"],
    lesson: { name: "The second bitter lesson", scraps: ["people"], reset: ["features"], text: "The features go. The feature engineers go. The network learns its own." },
  },
    title: "ImageNet 2012",
    text: "A convolutional network cuts the error rate by ten points. Everyone else's method is a footnote. Scrap the features.",
  },
};
