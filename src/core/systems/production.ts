import { generatorDef } from "../../content";
import { RESOURCES } from "../content-types";
import { effectiveOps, mult } from "../derive";
import type { State } from "../state";
import { ALL_ERAS, type System } from "../system";

/**
 * First system each tick: zero the rates and fill in what generators make.
 * Income systems for each era add to `rates` after this; `integrate` applies them.
 */
export const production: System = {
  id: "production",
  eras: ALL_ERAS,
  tick(s) {
    for (const r of RESOURCES) s.rates[r] = 0;
    s.rates.ops = effectiveOps(s);
    for (const [id, n] of Object.entries(s.counts)) {
      const g = generatorDef(id);
      for (const r of RESOURCES) {
        if (r === "ops") continue;
        const per = g.produces[r];
        if (per) s.rates[r] += n * per * mult(s, r);
      }
    }
  },
};

/** Self-replicating factories: count grows at its own rate, paid in matter. */
export const factories: System = {
  id: "factories",
  eras: ALL_ERAS,
  tick(s, dt) {
    for (const [id, n] of Object.entries(s.counts)) {
      const g = generatorDef(id);
      if (!g.replicate || n <= 0) continue;
      const matterEach = g.cost.matter ?? 0;
      const wanted = n * g.replicate * dt * Math.max(0, 1 - n / (g.capacity ?? Infinity));
      const affordable = matterEach > 0 ? Math.min(wanted, s.res.matter / matterEach) : wanted;
      s.res.matter -= affordable * matterEach;
      s.counts[id] = n + affordable;
    }
  },
};

/** Last system each tick: resources grow by their rates. */
export const integrate: System = {
  id: "integrate",
  eras: ALL_ERAS,
  tick(s, dt) {
    for (const r of RESOURCES) s.res[r] = Math.max(0, s.res[r] + s.rates[r] * dt);
    s.handcrafted += s.rates.money * dt;
  },
};
