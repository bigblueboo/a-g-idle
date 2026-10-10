import { currentEra, lampPattern, tapValue } from "./derive";
import { once } from "./flags";
import { pushLog } from "./log";
import { hash } from "./rng";
import type { State } from "./state";

const DEPOSIT_MATCH_MULT = 5;
const REPLY_EVERY = 6;

/** The Button. Adds ops; from Era 5 the model answers every few presses. */
export function tap(s: State, mult = 1): void {
  s.taps += 1;
  s.res.ops += tapValue(s) * mult;
  const replies = currentEra(s).replies;
  if (replies.length > 0 && s.taps % REPLY_EVERY === 0) {
    pushLog(s, replies[hash(`${s.seed}:${s.taps}`) % replies.length] ?? "", "model");
  }
}

/** Era 0: a byte on the switches. Matching the lamps pays ×5. */
export function deposit(s: State, byte: number): void {
  const match = (byte & 255) === lampPattern(s);
  tap(s, match ? DEPOSIT_MATCH_MULT : 1);
  if (s.taps === 1) pushLog(s, "1 op. The lamps stay lit for a moment after the key comes up.");
  if (match && once(s, "firstMatch")) pushLog(s, "The byte matched the lamps. A program, of sorts. ×5.");
}
