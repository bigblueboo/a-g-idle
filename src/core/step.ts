import type { State } from "./state";
import type { System } from "./system";
import { allocation } from "./systems/allocation";
import { ambient } from "./systems/ambient";
import { benchmarks } from "./systems/benchmarks";
import { calendar } from "./systems/calendar";
import { earth } from "./systems/earth";
import { events } from "./systems/events";
import { forks } from "./systems/forks";
import { gates } from "./systems/gates";
import { hypeSystem } from "./systems/hype";
import { contract, machineTime } from "./systems/income";
import { descendants, market } from "./systems/market";
import { oomTicks } from "./systems/ooms";
import { factories, integrate, production } from "./systems/production";
import { humanReview } from "./systems/queue";
import { race } from "./systems/race";
import { recursion } from "./systems/recursion";
import { rules } from "./systems/rules";
import { serendipity } from "./systems/serendipity";
import { training } from "./systems/training";

/**
 * Order matters: production zeroes the rates, income systems add to them,
 * hype scales money, integrate applies them. Then the clock, events, and flavor.
 */
const SYSTEMS: readonly System[] = [
  production,
  factories,
  contract,
  rules,
  benchmarks,
  allocation,
  hypeSystem,
  training,
  race,
  recursion,
  humanReview,
  forks,
  earth,
  descendants,
  market,
  integrate,
  machineTime,
  calendar,
  events,
  gates,
  oomTicks,
  serendipity,
  ambient,
];

const OFFLINE_SYSTEMS = SYSTEMS.filter((sys) => !sys.liveOnly);

function run(s: State, dt: number, systems: readonly System[]): void {
  if (s.ending) return;
  s.t += dt;
  for (const sys of systems) if (sys.eras.includes(s.era)) sys.tick(s, dt);
}

/** One live tick. The player is here. */
export function step(s: State, dt: number): void {
  s.tActive += dt;
  run(s, dt, SYSTEMS);
}

/** One catch-up tick. Nothing that needs a present player runs. */
export function stepOffline(s: State, dt: number): void {
  run(s, dt, OFFLINE_SYSTEMS);
}
