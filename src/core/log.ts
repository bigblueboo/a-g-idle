import { BALANCE } from "./balance";
import type { ArtRef } from "./content-types";
import type { LogVoice, State } from "./state";

const DEFAULT_VOICE: LogVoice[] = ["lab", "lab", "lab", "lab", "lab", "model", "model", "you", "you", "glyph"];

function defaultVoice(s: State): LogVoice {
  return DEFAULT_VOICE[s.era] ?? "lab";
}

export function pushLog(s: State, text: string, voice: LogVoice = defaultVoice(s), art?: ArtRef): void {
  s.log.push(art ? { t: s.t, year: s.year, text, voice, art } : { t: s.t, year: s.year, text, voice });
  if (s.log.length > BALANCE.log.max) s.log.splice(0, s.log.length - BALANCE.log.max);
}

export function setTicker(s: State, text: string, seconds: number): void {
  s.ticker = { text, until: s.t + seconds };
}

export function tickerIsFree(s: State): boolean {
  return s.t >= s.ticker.until;
}
