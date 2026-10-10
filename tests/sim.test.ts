import { describe, expect, it } from "vitest";
import { playUntil } from "../src/bot/policy";
import { dispatch } from "../src/core/actions";
import { effectiveOps, gateSatisfied } from "../src/core/derive";
import { catchUp } from "../src/core/offline";
import { initialState, StateSchema, type State } from "../src/core/state";
import { step, stepOffline } from "../src/core/step";
import { parseSave, serialize } from "../src/platform/save";

function playTo(era: number, seed = 1): State {
  return playUntil(seed, (s) => s.era >= era, 8 * 3600);
}

describe("determinism", () => {
  it("two runs with the same seed and inputs produce the same state", () => {
    const a = playTo(2);
    const b = playTo(2);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
  it("different seeds differ", () => {
    expect(JSON.stringify(playTo(1))).not.toBe(JSON.stringify(playTo(2)));
  });
});

describe("era 0", () => {
  it("earns money after the contract and can reach Dartmouth", () => {
    const s = initialState(1);
    for (let i = 0; i < 12; i++) dispatch(s, { type: "deposit", byte: 0 });
    step(s, 0.1);
    expect(s.flags.contract).toBe(true);
    step(s, 0.1);
    expect(s.res.money).toBeGreaterThan(0);
    const done = playTo(1);
    expect(done.era).toBe(1);
    expect(done.labName).toBe("Bot");
  });
  it("does not open the gate before the era's end year", () => {
    const s = initialState(1);
    s.rung = 1;
    s.projects.turing_test = true;
    s.counts.stored = 100;
    step(s, 0.1);
    expect(effectiveOps(s)).toBeGreaterThan(1e4);
    expect(gateSatisfied(s)).toBe(false);
    s.year = 1956;
    expect(gateSatisfied(s)).toBe(true);
  });
});

describe("offline catch-up", () => {
  it("approximates many short steps with coarse ones", () => {
    const base = playTo(2);
    const fine = structuredClone(base);
    const coarse = structuredClone(base);
    for (let i = 0; i < 600; i++) stepOffline(fine, 1);
    catchUp(coarse, 600);
    expect(coarse.res.money / fine.res.money).toBeCloseTo(1, 1);
    expect(coarse.year).toBeCloseTo(fine.year, 3);
  });
  it("caps at twelve hours and reports what happened", () => {
    const s = playTo(1);
    const report = catchUp(s, 100 * 3600);
    expect(report.seconds).toBe(12 * 3600);
    expect(report.money).toBeGreaterThan(0);
  });
  it("skips live-only systems", () => {
    const s = playTo(1);
    s.serendipity = null;
    s.nextSerendipityAt = 0;
    catchUp(s, 3600);
    expect(s.serendipity).toBeNull();
  });
});

describe("saves", () => {
  it("round-trips through the schema", () => {
    const s = playTo(2);
    const parsed = parseSave(serialize(s, 123));
    expect(parsed?.savedAt).toBe(123);
    expect(JSON.stringify(parsed?.state)).toBe(JSON.stringify(s));
  });
  it("validates the initial state", () => {
    expect(StateSchema.safeParse(initialState(7)).success).toBe(true);
  });
});

describe("the whole run", () => {
  it("reaches an ending with the greedy bot", () => {
    const s = playUntil(3, (x) => x.ending !== null, 9 * 3600);
    expect(s.ending).not.toBeNull();
    expect(s.rung).toBeGreaterThanOrEqual(15);
  }, 120_000);
});
