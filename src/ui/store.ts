import { z } from "zod";
import { dispatch, type Action } from "../core/actions";
import type { State } from "../core/state";
import type { Clock } from "../platform/clock";

export interface Settings {
  sound: boolean;
  haptics: boolean;
  contrast: boolean;
  /** Hold length for permanent actions, in ms. */
  holdMs: number;
}

const SETTINGS_KEY = "computronium:settings";
const DEFAULT_SETTINGS: Settings = { sound: true, haptics: true, contrast: false, holdMs: 900 };
const SettingsSchema = z.object({
  sound: z.boolean().default(DEFAULT_SETTINGS.sound),
  haptics: z.boolean().default(DEFAULT_SETTINGS.haptics),
  contrast: z.boolean().default(DEFAULT_SETTINGS.contrast),
  holdMs: z.number().min(300).max(5000).default(DEFAULT_SETTINGS.holdMs),
});

/** UI-only state that never goes in the save. */
export interface UiState {
  tab: "build" | "research" | "era" | "log";
  selectedTile: number | null;
}

type ActionListener = (a: Action, ok: boolean, s: State) => void;

/** Holds the sim state, routes actions through the core, and fans out frames to panels. */
export class Store {
  state: State;
  readonly ui: UiState = { tab: "build", selectedTile: null };
  settings: Settings;
  private readonly frameListeners = new Set<(s: State) => void>();
  private readonly actionListeners = new Set<ActionListener>();

  constructor(
    state: State,
    readonly clock: Clock,
    readonly params: URLSearchParams,
  ) {
    this.state = state;
    this.settings = loadSettings();
    if (params.has("silent")) this.settings = { ...this.settings, sound: false, haptics: false };
  }

  dispatch(a: Action): boolean {
    const ok = dispatch(this.state, a);
    for (const fn of this.actionListeners) fn(a, ok, this.state);
    return ok;
  }

  replace(state: State): void {
    this.state = state;
  }

  onFrame(fn: (s: State) => void): () => void {
    this.frameListeners.add(fn);
    return () => this.frameListeners.delete(fn);
  }

  onAction(fn: ActionListener): () => void {
    this.actionListeners.add(fn);
    return () => this.actionListeners.delete(fn);
  }

  frame(): void {
    for (const fn of this.frameListeners) fn(this.state);
  }

  updateSettings(patch: Partial<Settings>): void {
    this.settings = { ...this.settings, ...patch };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
    } catch {
      /* private mode */
    }
  }
}

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    const parsed = raw ? SettingsSchema.safeParse(JSON.parse(raw)) : null;
    return parsed?.success ? parsed.data : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}
