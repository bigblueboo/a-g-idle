import type { EraDef, EraId, GeneratorDef, ProjectDef } from "../core/content-types";
import { era0 } from "./eras/era0";
import { era1 } from "./eras/era1";
import { era2 } from "./eras/era2";
import { era3 } from "./eras/era3";
import { era4 } from "./eras/era4";
import { era5 } from "./eras/era5";
import { era6 } from "./eras/era6";
import { era7 } from "./eras/era7";
import { era8 } from "./eras/era8";
import { era9 } from "./eras/era9";

export const ERAS: readonly EraDef[] = [era0, era1, era2, era3, era4, era5, era6, era7, era8, era9];

export const GENERATORS: ReadonlyMap<string, GeneratorDef> = new Map(ERAS.flatMap((e) => e.generators).map((g) => [g.id, g]));
export const PROJECTS: ReadonlyMap<string, ProjectDef> = new Map(ERAS.flatMap((e) => e.projects).map((p) => [p.id, p]));

export function eraDef(id: EraId | number): EraDef {
  const e = ERAS[id];
  if (!e) throw new Error(`no era ${id}`);
  return e;
}

export function generatorDef(id: string): GeneratorDef {
  const g = GENERATORS.get(id);
  if (!g) throw new Error(`no generator ${id}`);
  return g;
}

export function projectDef(id: string): ProjectDef {
  const p = PROJECTS.get(id);
  if (!p) throw new Error(`no project ${id}`);
  return p;
}

export { RUNGS, NOW_YEAR } from "./rungs";
