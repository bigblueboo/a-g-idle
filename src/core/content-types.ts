// Contracts between the content layer and the sim. Content is data; these are its shapes.

export const RESOURCES = ["ops", "money", "insight", "data", "matter", "share"] as const;

/** A picture that goes with a line in the log: generated art under src/art/<kind>/<id>. */
export type ArtKind = "gen" | "note" | "rung" | "era" | "spot";
export interface ArtRef {
  kind: ArtKind;
  id: string;
}
export type Resource = (typeof RESOURCES)[number];
export type Cost = Partial<Record<Resource, number>>;

export type EraId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type GeneratorKind = "compute" | "people" | "data" | "power" | "matter" | "shell" | "factory";

export interface GeneratorDef {
  id: string;
  era: EraId;
  name: string;
  desc: string;
  kind: GeneratorKind;
  cost: Cost;
  /** Price growth per unit owned. */
  growth: number;
  /** What one unit produces per second. */
  produces: Partial<Record<Resource | "power", number>>;
  /** Hardware only: first year it can be bought; price then follows Moore's law. */
  introYear?: number;
  /** Shells: radiating temperature in K, which sets the Landauer ceiling. */
  temperatureK?: number;
  /** The most that can ever be owned. A shell closes when its segments are all built. */
  max?: number;
  /** Only the sim creates these (converted Earth tiles). Never listed for sale. */
  hidden?: true;
  /** Factories: fraction of own count added per second (doubling time = ln2/rate). */
  replicate?: number;
  /** Factories: the count replication cannot grow past. Feedstock runs out. */
  capacity?: number;
  requires?: string;
}

export type FidelityPart = "people" | "places" | "records";

export type Effect =
  | { kind: "mult"; resource: Resource | "power"; mult: number }
  | { kind: "efficiency"; mult: number }
  | { kind: "rung"; rung: number }
  | { kind: "expectation"; delta: number }
  | { kind: "trust"; delta: number }
  | { kind: "legibility"; delta: number }
  | { kind: "fidelity"; part: FidelityPart; delta: number }
  | { kind: "grant"; resource: Resource; amount: number }
  | { kind: "flag"; flag: string }
  | { kind: "unflag"; flag: string }
  | { kind: "groundwork"; amount: number }
  | { kind: "shock"; name: string }
  | { kind: "logbook"; item: string }
  | { kind: "init"; what: "benchmarks" | "rivals" | "earth" | "market" }
  | { kind: "give"; generator: string; n: number }
  | { kind: "alloc"; train: number; serve: number; research: number };

/** State a Bitter Lesson wipes besides generator counts. */
export type LessonReset = "rules" | "features" | "staff";

export type Track = "core" | "symbolic" | "connectionist" | "efficiency" | "rung" | "neural" | "interp";

export interface ProjectDef {
  id: string;
  era: EraId;
  name: string;
  /** Historical year, when there is one. Earns Lead if reached earlier. */
  year?: number;
  fact: string;
  cost: Cost;
  track: Track;
  effects: Effect[];
  requires?: string[];
}

export interface EventDef {
  id: string;
  year: number;
  title: string;
  text: string;
  /** A shock pauses the calendar until the player has been present 60 s, then fires. */
  shock?: boolean;
  warn?: string;
  effects: Effect[];
}

interface SerendipityDef {
  id: string;
  label: string;
  text: string;
  /** Multiplier on ops for `seconds`, or a one-shot grant. */
  reward: { kind: "burst"; seconds: number } | { kind: "grant"; resource: Resource; seconds: number };
}

export interface GateDef {
  rung?: number;
  ops?: number;
  projects?: string[];
  flags?: string[];
  /** Taking the Bitter Lesson is the gate. Scraps generators of these kinds. */
  lesson?: { name: string; scraps: GeneratorKind[]; reset: LessonReset[]; text: string };
  /** Asks the player to sign a name before the transition. */
  sign?: boolean;
}

/** What the Button does when pressed, by era. */
export type Press = "deposit" | "tap" | "approve" | "propose" | "convert" | "none";

export interface RungDef {
  name: string;
  year?: number;
}

export interface BenchmarkDef {
  id: string;
  name: string;
  /** Revenue per second at 100% accuracy. */
  market: number;
  /** Capability rung at which a lab is said to have "taken" it. */
  rung: number;
}

export interface EraDef {
  id: EraId;
  name: string;
  years: [number, number];
  /** World years per active minute. */
  rate: number;
  /** One line for the transition: what this era is about. */
  blurb: string;
  verb: string;
  press: Press;
  /** Era 6: the model rearranges the interface around how you use it. */
  rewritesUi?: true;
  /** Era 4: holding the Button repeats the tap. */
  holdToRepeat?: true;
  tab: string;
  /** Skin changes inside the era, by year: Era 2's 1984 desktop, Era 3's 2005 gloss. */
  periods: { from: number; name: string }[];
  /** Applied once, when the era begins. */
  enter: Effect[];
  generators: GeneratorDef[];
  projects: ProjectDef[];
  events: EventDef[];
  serendipity: SerendipityDef[];
  /** Ambient log pool; drawn without replacement every minute or so. */
  log: string[];
  ticker: string[];
  /** What the model says back when prompted. Empty before it can talk. */
  replies: string[];
  /** Absent on the last era. */
  gate?: { conditions: GateDef; title: string; text: string };
}
