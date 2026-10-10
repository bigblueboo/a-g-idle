import type { EraId } from "../../../core/content-types";
import type { Panel } from "../../panel";
import type { Store } from "../../store";
import { mountBenchmarks } from "./benchmarks";
import { mountDeploy } from "./deploy";
import { mountEarth } from "./earth";
import { mountLab } from "./lab";
import { mountLogbook } from "./logbook";
import { mountMarket } from "./market";
import { mountQueue } from "./queue";
import { mountRecursion } from "./recursion";
import { mountRules } from "./rules";
import { mountTrain } from "./train";

/** The rotating fourth tab: one panel per era, built fresh when the era changes. */
const ERA_PANELS: Record<EraId, (store: Store) => Panel> = {
  0: mountLogbook,
  1: mountLab,
  2: mountRules,
  3: mountBenchmarks,
  4: mountTrain,
  5: mountDeploy,
  6: mountRecursion,
  7: mountQueue,
  8: mountEarth,
  9: mountMarket,
};

export function mountEraTab(store: Store, era: EraId): Panel {
  return ERA_PANELS[era](store);
}
