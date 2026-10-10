import { describe, expect, it } from "vitest";
import { bulkPrice, chinchillaLoss, generatorPrice, landauerOps, mooreFactor, rungFromLoss, rulesUpkeep } from "../src/core/formulas";

describe("chinchilla", () => {
  it("matches the published fit at the 70B/1.4T point", () => {
    expect(chinchillaLoss(7e10, 1.4e12)).toBeCloseTo(1.937, 2);
  });
  it("maps the Era 5 gate loss to the research-automation rung", () => {
    expect(Math.floor(rungFromLoss(1.8))).toBe(12);
  });
  it("maps an AlexNet-scale run to the cats rung", () => {
    expect(Math.floor(rungFromLoss(chinchillaLoss(6e7, 1.2e9)))).toBe(6);
  });
});

describe("landauer", () => {
  it("gives about 1.3e49 ops/s for the Sun at 3 K", () => {
    expect(landauerOps(3) / 1.33e49).toBeCloseTo(1, 1);
  });
  it("is hotter-is-fewer", () => {
    expect(landauerOps(1000)).toBeLessThan(landauerOps(3));
  });
});

describe("moore", () => {
  it("is 1 before the intro year", () => {
    expect(mooreFactor(1936, 1945)).toBe(1);
  });
  it("halves every two years in the integrated-circuit era", () => {
    expect(mooreFactor(1990, 1980)).toBeCloseTo(Math.pow(2, -5), 6);
  });
  it("slows after Dennard scaling ends", () => {
    const before = mooreFactor(2006, 2004);
    const after = mooreFactor(2008, 2006);
    expect(after).toBeGreaterThan(before);
  });
  it("floors at one percent", () => {
    expect(mooreFactor(2100, 1970)).toBe(0.01);
  });
});

describe("prices", () => {
  it("bulk price sums the geometric series", () => {
    const sum = [0, 1, 2].reduce((acc, n) => acc + generatorPrice(10, 1.15, n, 1), 0);
    expect(bulkPrice(10, 1.15, 0, 3, 1)).toBeCloseTo(sum, 9);
  });
  it("rules upkeep is quadratic", () => {
    expect(rulesUpkeep(200, 100) / rulesUpkeep(100, 100)).toBe(4);
  });
});
