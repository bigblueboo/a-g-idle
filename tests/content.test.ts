import { describe, expect, it } from "vitest";
import { ERAS, GENERATORS, PROJECTS } from "../src/content";
import { OOM_LINES } from "../src/content/ooms";
import { RUNGS } from "../src/content/rungs";

const MIN_LOG_LINES = 16;
const MIN_TICKER_LINES = 8;
const HUD_LINE = 60;

describe("content", () => {
  it("has ten eras in order with contiguous years", () => {
    expect(ERAS.length).toBe(10);
    ERAS.forEach((e, i) => {
      expect(e.id).toBe(i);
      if (i > 0) expect(e.years[0]).toBe(ERAS[i - 1]?.years[1]);
    });
  });
  it("gives every project a fact and a cost", () => {
    for (const p of PROJECTS.values()) {
      expect(p.fact.length, p.id).toBeGreaterThan(10);
      expect(Object.keys(p.cost).length, p.id).toBeGreaterThan(0);
    }
  });
  it("gives every generator a description and something it produces", () => {
    for (const g of GENERATORS.values()) {
      expect(g.desc.length, g.id).toBeGreaterThan(10);
      expect(Object.keys(g.produces).length, g.id).toBeGreaterThan(0);
    }
  });
  it("has no duplicate ids across generators and projects", () => {
    const ids = [...GENERATORS.keys(), ...PROJECTS.keys()];
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("resolves every requirement to a project or a flag-setting effect", () => {
    const flags = new Set<string>(["never", "ev:lighthill", "power", "contract"]);
    for (const e of ERAS) for (const ef of [...e.enter, ...e.projects.flatMap((p) => p.effects), ...e.events.flatMap((ev) => ev.effects)]) if (ef.kind === "flag") flags.add(ef.flag);
    for (const g of GENERATORS.values()) if (g.requires) expect(PROJECTS.has(g.requires) || flags.has(g.requires), `${g.id} requires ${g.requires}`).toBe(true);
    for (const p of PROJECTS.values()) for (const r of p.requires ?? []) expect(PROJECTS.has(r) || flags.has(r), `${p.id} requires ${r}`).toBe(true);
  });
  it("has enough prose per era and nothing too long for the ticker", () => {
    for (const e of ERAS) {
      expect(e.log.length, `era ${e.id} log`).toBeGreaterThanOrEqual(MIN_LOG_LINES);
      expect(e.ticker.length, `era ${e.id} ticker`).toBeGreaterThanOrEqual(MIN_TICKER_LINES);
      for (const t of e.ticker) expect(t.length, t).toBeLessThanOrEqual(HUD_LINE);
    }
  });
  it("has a line for every order of magnitude and a rung ladder of nineteen", () => {
    expect(OOM_LINES.length).toBe(50);
    expect(RUNGS.length).toBe(19);
  });
});
