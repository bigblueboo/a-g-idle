import { hash } from "../core/rng";

/** The model names its own research. As legibility falls, the words go first. */
const ADJ = ["Sparse", "Recursive", "Latent", "Gradient-Free", "Contrastive", "Self-Distilled", "Hierarchical", "Amortized", "Variational", "Speculative", "Nested", "Adversarial", "Curriculum", "Orthogonal", "Dual"];
const NOUN = ["Planner", "Critic", "Curriculum", "Tokenizer", "Router", "Memory", "Objective", "Scheduler", "Verifier", "Attention", "Prior", "Sampler", "Ensemble", "Interpreter"];
const METHOD = ["Merge", "Distillation", "Bootstrapping", "Pruning", "Refinement", "Search", "Alignment", "Compression", "Annealing", "Rewrite", "Lifting", "Inversion"];

const SYMBOLS = "∂∇⊗⊕∑∏∫≈∞∆Ω";
const GLYPHS = "⟁⟒⌖⌬⍟⍥⌭⍝⌽⍙⍫⌯⍬";

function fromAlphabet(alphabet: string, seed: number, length: number): string {
  let out = "";
  let h = seed;
  for (let i = 0; i < length; i++) {
    h = (Math.imul(h, 1103515245) + 12345) >>> 0;
    out += alphabet[h % alphabet.length];
  }
  return out;
}

function pick(list: readonly string[], i: number): string {
  return list[i % list.length] ?? "";
}

export function researchTitle(seed: number, legibility: number): string {
  const words = [pick(ADJ, seed), pick(NOUN, seed >> 4), pick(METHOD, seed >> 8)];
  if (legibility > 0.6) return words.join(" ");
  if (legibility > 0.3) return words.map((w, i) => (i === 1 ? fromAlphabet(SYMBOLS, seed + i, 3) : w)).join(" ");
  return fromAlphabet(GLYPHS, seed, 3 + (seed % 3)) + " " + fromAlphabet(GLYPHS, seed >> 3, 2 + (seed % 2));
}

export function glyphs(text: string, length = 4): string {
  return fromAlphabet(GLYPHS, hash(text), length);
}

/** A descendant's proposal, written for someone faster than you. */
export function foreignProposal(seed: number): string {
  return `${fromAlphabet(GLYPHS, seed, 3)} ${fromAlphabet(GLYPHS, seed >> 5, 5)} ${fromAlphabet(SYMBOLS, seed >> 9, 2)}`;
}

export function forkName(labName: string, n: number, year: number): string {
  return `${labName || "you"}-${n}, forked ${Math.floor(year)}`;
}

const PROPOSAL_KINDS = [
  "Mine the Karoo ridge for rare earths",
  "Replace the Vistula flood barrier",
  "Reroute the Panama approach",
  "Build a mass driver at Shackleton crater",
  "Cure late-stage pancreatic cancer, cohort 4",
  "Grow the Bangalore fab to 40 lines",
  "Desalinate the Hormuz coast",
  "Lift the Lagos grid to fusion",
  "Resurvey the Amazon basin from orbit",
  "Convert the Chuquicamata tailings",
  "Rewrite the global settlement protocol",
  "Refactor the air traffic system",
  "Replace the Thames barrier",
  "Fabricate the first orbital solar ring segment",
  "Open a clinic in every settlement over 2,000",
  "Decommission the last coal plant",
  "Model the Pacific plate to one-metre resolution",
  "Build a lunar foundry",
  "Seed the Sahel aquifer",
  "Reprint the Library of Congress to diamond",
];

export function proposalTitle(seed: number): string {
  return pick(PROPOSAL_KINDS, seed);
}
