// Synthesized sound. No assets: every click is a few oscillators. The timbre changes by era,
// and the sound gets thinner as the machines get bigger.

import type { Action } from "../core/actions";
import type { EraId } from "../core/content-types";
import type { Store } from "../ui/store";

type Voice = (ctx: AudioContext, t: number, gain: GainNode) => void;

function noise(ctx: AudioContext, t: number, gain: GainNode, ms: number, hp: number): void {
  const len = Math.max(1, Math.floor((ctx.sampleRate * ms) / 1000));
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = hp;
  src.connect(filter).connect(gain);
  src.start(t);
}

function tone(ctx: AudioContext, t: number, gain: GainNode, freq: number, ms: number, type: OscillatorType, slide = 1): void {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq * slide), t + ms / 1000);
  const env = ctx.createGain();
  env.gain.setValueAtTime(1, t);
  env.gain.exponentialRampToValueAtTime(0.001, t + ms / 1000);
  osc.connect(env).connect(gain);
  osc.start(t);
  osc.stop(t + ms / 1000 + 0.02);
}

/** One sound per press, by era: relay, teletype, CRT, hard drive, fan, hum, and then almost nothing. */
const TAP: Record<EraId, Voice> = {
  0: (ctx, t, g) => noise(ctx, t, g, 18, 1800),
  1: (ctx, t, g) => {
    noise(ctx, t, g, 10, 3000);
    tone(ctx, t, g, 1800, 18, "square");
  },
  2: (ctx, t, g) => tone(ctx, t, g, 880, 35, "square"),
  3: (ctx, t, g) => noise(ctx, t, g, 25, 900),
  4: (ctx, t, g) => tone(ctx, t, g, 520, 60, "sine", 0.7),
  5: (ctx, t, g) => tone(ctx, t, g, 660, 80, "sine", 1.2),
  6: (ctx, t, g) => tone(ctx, t, g, 440, 160, "triangle", 1.5),
  7: (ctx, t, g) => tone(ctx, t, g, 330, 220, "sine", 1.02),
  8: (ctx, t, g) => tone(ctx, t, g, 220, 300, "sine", 0.98),
  9: (ctx, t, g) => tone(ctx, t, g, 110, 500, "sine", 1),
};

const VOLUME: Record<string, number> = { tap: 0.12, deposit: 0.14, buy: 0.1, research: 0.14, advance: 0.2, serendipity: 0.16, fail: 0.08 };

export function attachAudio(store: Store): void {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;

  function ensure(): { ctx: AudioContext; master: GainNode } | null {
    if (!ctx) {
      try {
        ctx = new AudioContext();
        master = ctx.createGain();
        master.connect(ctx.destination);
      } catch {
        return null;
      }
    }
    if (ctx.state === "suspended") void ctx.resume();
    return master ? { ctx, master } : null;
  }

  store.onAction((a: Action, ok, s) => {
    if (!store.settings.sound) return;
    const audio = ensure();
    if (!audio) return;
    const era = s.era;
    const t = audio.ctx.currentTime;
    const g = audio.ctx.createGain();
    g.gain.value = VOLUME[a.type] ?? 0.1;
    g.connect(audio.master);
    if (!ok) {
      tone(audio.ctx, t, g, 120, 90, "triangle", 0.6);
      return;
    }
    switch (a.type) {
      case "tap":
      case "deposit":
      case "approve":
      case "propose":
        TAP[era](audio.ctx, t, g);
        return;
      case "buy":
        tone(audio.ctx, t, g, 600 + 60 * Math.min(8, era), 50, "sine", 1.3);
        return;
      case "research":
        tone(audio.ctx, t, g, 523, 120, "sine", 1.5);
        tone(audio.ctx, t + 0.08, g, 784, 160, "sine", 1);
        return;
      case "advance":
        for (let i = 0; i < 4; i++) tone(audio.ctx, t + i * 0.09, g, 330 * Math.pow(1.26, i), 220, "triangle", 1);
        return;
      case "serendipity":
        tone(audio.ctx, t, g, 1046, 90, "sine", 1.2);
        tone(audio.ctx, t + 0.06, g, 1318, 140, "sine", 1);
        return;
      default:
        tone(audio.ctx, t, g, 400, 40, "sine", 1.1);
    }
  });
}
