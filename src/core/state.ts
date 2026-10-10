import { z } from "zod";

export const SAVE_VERSION = 1;

const num = z.number();
const ResourceRecord = z.object({ ops: num, money: num, insight: num, data: num, matter: num, share: num });

const Staff = z.object({ name: z.string(), role: z.string(), joined: num });

const Winter = z.object({ targetExpectation: num, startedYear: num, nextLeaveAt: num });

const Run = z.object({
  N: num,
  D: num,
  flop: num,
  progress: num,
  startedAt: num,
  spiked: z.boolean(),
  checkpoint: num,
});

const Release = z.object({ loss: num, rung: num });

const Rival = z.object({ name: z.string(), kappa: num, pace: num, taken: num });

const Benchmark = z.object({ features: num, accuracy: num, takenBy: z.string().nullable() });

const Batch = z.object({ title: z.string(), value: num, legible: z.boolean() });

const Proposal = z.object({
  id: num,
  title: z.string(),
  value: num,
  years: num,
  explained: z.boolean(),
});

const Fork = z.object({
  id: num,
  name: z.string(),
  returnsAt: num,
  drift: num,
  status: z.enum(["out", "merged", "independent"]),
});

const Tile = z.object({
  id: num,
  name: z.string(),
  lat: num,
  lon: num,
  land: z.boolean(),
  pop: num,
  bio: num,
  matter: num,
  state: z.enum(["natural", "preserved", "uploading", "converted"]),
  uploaded: num,
});

const ArtRef = z.object({ kind: z.enum(["gen", "note", "rung", "era", "spot"]), id: z.string() });

const LogEntry = z.object({ t: num, year: num, text: z.string(), voice: z.enum(["lab", "model", "you", "glyph", "system"]), art: ArtRef.optional() });

const Era = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6), z.literal(7), z.literal(8), z.literal(9)]);

export const StateSchema = z.object({
  version: z.literal(SAVE_VERSION),
  seed: num,
  rng: num,
  labName: z.string(),
  era: Era,
  /** Sim seconds, including offline catch-up. */
  t: num,
  /** Seconds the player was actually present. */
  tActive: num,
  taps: num,
  year: num,
  subjective: num,
  res: ResourceRecord,
  rates: ResourceRecord,
  counts: z.record(z.string(), num),
  projects: z.record(z.string(), z.literal(true)),
  flags: z.record(z.string(), z.literal(true)),
  mults: z.record(z.string(), num),
  efficiency: num,
  generality: num,
  groundwork: num,
  /** Lifetime output of the current hand-built paradigm, for the next lesson's G. */
  handcrafted: num,
  /** Capability ladder index. −1 until the first rung. */
  rung: num,
  rungYears: z.record(z.string(), num),
  oomSeen: num,
  expectation: num,
  winter: Winter.nullable(),
  valuation: num,
  trust: num,
  legibility: num,
  fidelity: z.object({ people: num, places: num, records: num }),
  staff: z.array(Staff),
  advisors: z.array(Staff),
  rules: z.object({ count: num, bugs: num }),
  benchmarks: z.record(z.string(), Benchmark),
  rivals: z.array(Rival),
  training: z.object({ run: Run.nullable(), bestLoss: num.nullable(), runs: num, release: Release.nullable(), history: z.array(z.object({ flop: num, loss: num })) }),
  alloc: z.object({ train: num, serve: num, research: num }),
  users: num,
  incidents: num,
  recursion: z.object({ takeoff: num.int().min(0).max(2), selfApprove: z.boolean(), batches: z.array(Batch), unread: num, progress: num, nextBatchAt: num }),
  queue: z.object({ items: z.array(Proposal), nextId: num, reviewed: num, bypassed: num, carry: num }),
  forks: z.array(Fork),
  nextForkId: num,
  earth: z.object({ tiles: z.array(Tile) }),
  market: z.object({
    autoApprove: z.boolean(),
    ark: z.object({ people: num, places: num, records: num }),
    launched: z.boolean(),
    nextProposalAt: num,
  }),
  pendingShock: z.object({ id: z.string(), year: num, firesAt: num }).nullable(),
  gateReady: z.boolean(),
  ending: z.enum(["dissolve", "router", "offswitch"]).nullable(),
  endingByte: num,
  log: z.array(LogEntry),
  logbook: z.array(z.string()),
  logPool: z.record(z.string(), z.array(num)),
  nextAmbientAt: num,
  ticker: z.object({ text: z.string(), until: num }),
  serendipity: z.object({ id: z.string(), expiresAt: num }).nullable(),
  nextSerendipityAt: num,
  opsMod: z.object({ until: num, mult: num }).nullable(),
});

export type State = z.infer<typeof StateSchema>;
export type LogVoice = z.infer<typeof LogEntry>["voice"];
export type ProposalT = z.infer<typeof Proposal>;
export type ForkT = z.infer<typeof Fork>;
export type TileT = z.infer<typeof Tile>;
export type RunT = z.infer<typeof Run>;
export type StaffT = z.infer<typeof Staff>;

export function initialState(seed: number): State {
  const zero = { ops: 0, money: 0, insight: 0, data: 0, matter: 0, share: 0 };
  return {
    version: SAVE_VERSION,
    seed,
    rng: seed >>> 0,
    labName: "",
    era: 0,
    t: 0,
    tActive: 0,
    taps: 0,
    year: 1936,
    subjective: 0,
    res: { ...zero },
    rates: { ...zero },
    counts: {},
    projects: {},
    flags: {},
    mults: {},
    efficiency: 1,
    generality: 0,
    groundwork: 0,
    handcrafted: 0,
    rung: -1,
    rungYears: {},
    oomSeen: 0,
    expectation: 0,
    winter: null,
    valuation: 1,
    trust: 0.6,
    legibility: 1,
    fidelity: { people: 0, places: 0, records: 0 },
    staff: [],
    advisors: [],
    rules: { count: 0, bugs: 0 },
    benchmarks: {},
    rivals: [],
    training: { run: null, bestLoss: null, runs: 0, release: null, history: [] },
    alloc: { train: 0.5, serve: 0.3, research: 0.2 },
    users: 0,
    incidents: 0,
    recursion: { takeoff: 0, selfApprove: false, batches: [], unread: 0, progress: 0, nextBatchAt: 0 },
    queue: { items: [], nextId: 1, reviewed: 0, bypassed: 0, carry: 0 },
    forks: [],
    nextForkId: 1,
    earth: { tiles: [] },
    market: { autoApprove: false, ark: { people: 0, places: 0, records: 0 }, launched: false, nextProposalAt: 0 },
    pendingShock: null,
    gateReady: false,
    ending: null,
    endingByte: 0,
    log: [],
    logbook: [],
    logPool: {},
    nextAmbientAt: 40,
    ticker: { text: "", until: 0 },
    serendipity: null,
    nextSerendipityAt: 90,
    opsMod: null,
  };
}
