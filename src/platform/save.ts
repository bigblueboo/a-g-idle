import { z } from "zod";
import { SAVE_VERSION, StateSchema, type State } from "../core/state";

const KEY = "computronium:save";
const BOOKMARK_KEY = "computronium:bookmark";

const Envelope = z.object({ version: z.number(), savedAt: z.number(), state: z.unknown() });
type Envelope = z.infer<typeof Envelope>;

function storage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Parse a save. Unknown versions fall through to a fresh game rather than a crash. */
export function parseSave(raw: string): { state: State; savedAt: number } | null {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return null;
  }
  const env = Envelope.safeParse(json);
  if (!env.success || env.data.version !== SAVE_VERSION) return null;
  const parsed = StateSchema.safeParse(env.data.state);
  return parsed.success ? { state: parsed.data, savedAt: env.data.savedAt } : null;
}

export function serialize(state: State, now: number): string {
  const env: Envelope = { version: SAVE_VERSION, savedAt: now, state };
  return JSON.stringify(env);
}

export function load(key = KEY): { state: State; savedAt: number } | null {
  const raw = storage()?.getItem(key);
  return raw ? parseSave(raw) : null;
}

export function save(state: State, now: number, key = KEY): void {
  storage()?.setItem(key, serialize(state, now));
}

export function bookmark(state: State, now: number): void {
  save(state, now, BOOKMARK_KEY);
}

export function loadBookmark(): { state: State; savedAt: number } | null {
  return load(BOOKMARK_KEY);
}

export function wipe(): void {
  storage()?.removeItem(KEY);
  storage()?.removeItem(BOOKMARK_KEY);
}

export function exportString(state: State, now: number): string {
  const bytes = new TextEncoder().encode(serialize(state, now));
  return btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(""));
}

export function importString(text: string): { state: State; savedAt: number } | null {
  try {
    const bytes = Uint8Array.from(atob(text.trim()), (c) => c.charCodeAt(0));
    return parseSave(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}
