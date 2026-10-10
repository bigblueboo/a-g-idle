// Generated art, keyed by kind and content id. Files live in src/art/<kind>/<id>.jpg and are
// imported by URL so Vite fingerprints them; a missing file simply means no picture.

import type { ArtKind, ArtRef } from "../core/content-types";

const files = import.meta.glob<string>("../art/*/*.{jpg,png,webp}", { eager: true, query: "?url", import: "default" });

export function artUrl(kind: ArtKind, id: string): string | undefined {
  return files[`../art/${kind}/${id}.jpg`] ?? files[`../art/${kind}/${id}.webp`] ?? files[`../art/${kind}/${id}.png`];
}

export function artUrlFor(ref: ArtRef | undefined): string | undefined {
  return ref ? artUrl(ref.kind, ref.id) : undefined;
}
