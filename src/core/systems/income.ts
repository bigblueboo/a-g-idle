import { once } from "../flags";
import { mooreFactor } from "../formulas";
import { pushLog, setTicker } from "../log";
import type { State } from "../state";
import type { System } from "../system";

const PRICE_PER_OP_1945 = 0.1;
const CONTRACT_AT_OPS = 10;

/** The first card: ten ops in, and the Army offers to buy machine time. */
export const contract: System = {
  id: "contract",
  eras: [0],
  tick(s) {
    if (s.res.ops < CONTRACT_AT_OPS || !once(s, "contract")) return;
    pushLog(s, "Ballistics Research Laboratory will buy machine time. $1 per 10 ops.", "system");
    setTicker(s, "The Army is buying machine time.", 20);
  },
};

function machineTimePrice(s: State): number {
  return PRICE_PER_OP_1945 * mooreFactor(s.year, 1945);
}

/**
 * Era 0: every op the machine has done is sold, tapped or produced. Runs after
 * `integrate`, so the sale clears the stock and the money rate is what was sold.
 */
export const machineTime: System = {
  id: "machineTime",
  eras: [0],
  tick(s, dt) {
    if (!s.flags.contract) return;
    const sold = s.res.ops * machineTimePrice(s);
    s.res.money += sold;
    s.res.ops = 0;
    s.rates.money += sold / dt;
  },
};
