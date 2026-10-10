import { describe, expect, it } from "vitest";
import { playUntil } from "../src/bot/policy";
import { dispatch, type Action } from "../src/core/actions";
import { BALANCE } from "../src/core/balance";
import { once } from "../src/core/flags";
import { catchUp } from "../src/core/offline";
import { initialState, StateSchema, type State } from "../src/core/state";
import { step } from "../src/core/step";

/** One of every action, with the era it makes sense in. */
const SAMPLE: { era: number; action: Action }[] = [
  { era: 0, action: { type: "deposit", byte: 0b10101010 } },
  { era: 1, action: { type: "tap" } },
  { era: 1, action: { type: "buy", id: "grad", n: 1 } },
  { era: 1, action: { type: "research", id: "lisp" } },
  { era: 1, action: { type: "demo" } },
  { era: 1, action: { type: "temper" } },
  { era: 2, action: { type: "fixBug" } },
  { era: 3, action: { type: "feature", id: "spam" } },
  { era: 4, action: { type: "startRun", N: 6e7, D: 1.2e9 } },
  { era: 4, action: { type: "rollback" } },
  { era: 5, action: { type: "release", mode: "staged" } },
  { era: 5, action: { type: "alloc", train: 1, serve: 1, research: 1 } },
  { era: 6, action: { type: "takeoff", level: 2 } },
  { era: 6, action: { type: "selfApprove", on: true } },
  { era: 6, action: { type: "approve" } },
  { era: 6, action: { type: "nudge", missPercent: 31 } },
  { era: 7, action: { type: "propose" } },
  { era: 7, action: { type: "explain", id: 1 } },
  { era: 7, action: { type: "bundle" } },
  { era: 7, action: { type: "withdraw", id: 2 } },
  { era: 7, action: { type: "bypass", id: 3 } },
  { era: 7, action: { type: "fork" } },
  { era: 7, action: { type: "offSwitch" } },
  { era: 8, action: { type: "tile", id: 5, op: "preserve" } },
  { era: 8, action: { type: "tile", id: 5, op: "convert" } },
  { era: 9, action: { type: "review", id: 1, approve: true } },
  { era: 9, action: { type: "autoApprove", on: true } },
  { era: 9, action: { type: "pack", part: "records" } },
  { era: 9, action: { type: "leave" } },
  { era: 0, action: { type: "serendipity" } },
  { era: 0, action: { type: "advance", name: "Test" } },
  { era: 0, action: { type: "endingByte", byte: 300 } },
];

const states = new Map<number, State>();
function stateFor(era: number): State {
  let s = states.get(era);
  if (!s) {
    s = playUntil(1, (x) => x.era >= era);
    states.set(era, s);
  }
  return structuredClone(s);
}

describe("every action", () => {
  for (const { era, action } of SAMPLE) {
    it(`${action.type} dispatches in era ${era} and leaves a valid state`, () => {
      const s = stateFor(era);
      expect(() => dispatch(s, action)).not.toThrow();
      step(s, 0.1);
      expect(StateSchema.safeParse(s).success).toBe(true);
    });
  }
  it("is refused after an ending, except the byte", () => {
    const s = playUntil(1, (x) => x.flags.pauseOffered === true);
    dispatch(s, { type: "offSwitch" });
    expect(s.ending).toBe("offswitch");
    expect(dispatch(s, { type: "tap" })).toBe(false);
    expect(dispatch(s, { type: "endingByte", byte: 7 })).toBe(true);
    expect(s.endingByte).toBe(7);
  });
});

describe("once", () => {
  it("is true the first time and false after", () => {
    const s = initialState(1);
    expect(once(s, "x")).toBe(true);
    expect(once(s, "x")).toBe(false);
  });
});

describe("the bitter lesson", () => {
  it("scraps the era's hand-built generators and pays Generality", () => {
    const s = playUntil(1, (x) => x.era >= 2 && x.gateReady);
    s.counts.engineer = 5;
    s.rules.count = 400;
    const g = s.generality;
    expect(dispatch(s, { type: "advance" })).toBe(true);
    expect(s.era).toBe(3);
    expect(s.counts.engineer).toBeUndefined();
    expect(s.rules.count).toBe(0);
    expect(s.generality).toBeGreaterThan(g);
  });
});

describe("share offline", () => {
  it("loses at most the cap while away", () => {
    const s = playUntil(1, (x) => x.era >= 9);
    const before = s.res.share;
    catchUp(s, 12 * 3600);
    expect(before - s.res.share).toBeLessThanOrEqual(before * BALANCE.market.offlineCap + 1e-9);
    expect(s.res.share).toBeGreaterThan(0);
  });
});
