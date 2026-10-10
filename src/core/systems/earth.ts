import { BALANCE } from "../balance";
import { fibonacciSphere, regionAt, REGIONS, seaName, TILE_COUNT } from "../../content/earth";
import { fmtPeople } from "../fmt";
import { clamp } from "../formulas";
import { pushLog, setTicker } from "../log";
import type { State, TileT } from "../state";
import type { System } from "../system";

const E = BALANCE.earth;
const TILE_GENERATOR = "tile";
const WORLD_POP = 8e9;
/** Below this many residents a tile counts as empty: they were told, and nobody objected. */
const CONSENT_THRESHOLD = 1e6;
/** Fidelity (People) if everyone on Earth comes through. */
const PEOPLE_SCALE = 40;

export type TileOp = "convert" | "preserve" | "upload";

export function initEarth(s: State): void {
  if (s.earth.tiles.length > 0) return;
  const points = fibonacciSphere(TILE_COUNT);
  const perRegion = new Map<string, number>();
  for (const p of points) {
    const r = regionAt(p.lat, p.lon);
    if (r) perRegion.set(r.name, (perRegion.get(r.name) ?? 0) + 1);
  }
  const seen = new Map<string, number>();
  const covered = REGIONS.filter((r) => perRegion.has(r.name)).reduce((sum, r) => sum + r.pop, 0) * 1e6;
  const popScale = covered > 0 ? WORLD_POP / covered : 1;
  s.earth.tiles = points.map((p, id) => {
    const r = regionAt(p.lat, p.lon);
    const base = r ? r.name : seaName(p.lat, p.lon);
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    const share = r ? 1 / (perRegion.get(r.name) ?? 1) : 0;
    return {
      id,
      name: `${base} ${n}`,
      lat: p.lat,
      lon: p.lon,
      land: r !== undefined,
      pop: r ? r.pop * 1e6 * share * popScale : 0,
      bio: r ? r.bio : 0.3,
      matter: E.tileMatter,
      state: "natural" as const,
      uploaded: 0,
    };
  });
}

export function tileById(s: State, id: number): TileT | undefined {
  return s.earth.tiles[id];
}

export function remaining(t: TileT): number {
  return Math.max(0, t.pop - t.uploaded);
}

/** Uploads proceed at a rate set by Trust; reserves earn a little Fidelity. */
export const earth: System = {
  id: "earth",
  eras: [8],
  tick(s, dt) {
    for (const t of s.earth.tiles) {
      if (t.state === "uploading") {
        const delta = remaining(t) * E.uploadRate * s.trust * dt;
        t.uploaded += delta;
        s.fidelity.people += (delta / WORLD_POP) * PEOPLE_SCALE;
      } else if (t.state === "preserved") {
        s.fidelity.places += t.bio * E.preserveFidelity * dt;
      }
    }
  },
};

function convert(s: State, t: TileT): void {
  const left = remaining(t);
  if (left > CONSENT_THRESHOLD) {
    s.fidelity.people = Math.max(0, s.fidelity.people - (left / WORLD_POP) * PEOPLE_SCALE * E.convertNoConsentFidelity * 10);
    s.trust = clamp(s.trust + E.convertTrust, 0, 1);
    pushLog(s, `${t.name}: converted. ${fmtPeople(left)} residents did not consent. Nobody will again.`, "you");
    setTicker(s, "Trust collapses.", 20);
  } else {
    pushLog(s, `${t.name}: converted. Population ${fmtPeople(left)}. ${left > 0 ? "They were told." : "Nobody objected."}`, "you");
  }
  t.state = "converted";
  s.counts[TILE_GENERATOR] = (s.counts[TILE_GENERATOR] ?? 0) + 1;
  s.res.matter += t.matter;
}

export function tileOp(s: State, id: number, op: TileOp): boolean {
  const t = tileById(s, id);
  if (!t || t.state === "converted") return false;
  if (op === "convert") convert(s, t);
  else if (op === "preserve" && t.state !== "preserved") {
    t.state = "preserved";
    pushLog(s, `${t.name}: reserve. Nothing is built here.`, "you");
  } else if (op === "upload" && t.pop > 0 && t.state !== "uploading") {
    t.state = "uploading";
    pushLog(s, `${t.name}: the offer stands. ${fmtPeople(t.pop)} people. Uptake depends on whether they trust you.`, "you");
  } else return false;
  return true;
}
