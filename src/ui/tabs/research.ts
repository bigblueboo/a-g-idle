import { RUNGS } from "../../content/rungs";
import { leadFor, rungName, totalLead } from "../../core/capability";
import type { ProjectDef, Track } from "../../core/content-types";
import { availableProjects, canAfford } from "../../core/derive";
import { systemActive } from "../../core/system";
import { hypeSystem } from "../../core/systems/hype";
import type { State } from "../../core/state";
import { artUrl } from "../art";
import { mountLadder } from "../charts/ladder";
import { h, keyedList, setClass, setDisabled, setText, show } from "../dom";
import * as fmt from "../format";
import type { Panel } from "../panel";
import type { Store } from "../store";

const TRACK_ORDER: Track[] = ["core", "rung", "symbolic", "connectionist", "neural", "efficiency", "interp"];

const TRACK_LABEL: Record<Track, string> = {
  core: "Core",
  symbolic: "Symbolic",
  connectionist: "Connectionist",
  neural: "Neural",
  efficiency: "Efficiency",
  rung: "Capability",
  interp: "Interpretability",
};

function costText(s: State, p: ProjectDef): string {
  const era = s.era;
  return Object.entries(p.cost)
    .map(([r, v]) => (r === "money" ? fmt.money(v, era) : r === "insight" ? `${fmt.count(v)} insight` : `${fmt.ops(v, era)} ${r}`))
    .join(" + ");
}

interface Row {
  el: HTMLElement;
  buy: HTMLButtonElement;
  cost: HTMLElement;
}

export function mountResearch(store: Store): Panel {
  const ladder = mountLadder();
  const lead = h("div", { class: "lead" });
  const rungNow = h("div", { class: "rung-now" });
  const list = h("div", { class: "proj-list" });
  const hypeBar = h("div", { class: "hype-actions" });
  const demo = h("button", { class: "action", type: "button", text: "DEMO" });
  const temper = h("button", { class: "action", type: "button", text: "TEMPER" });
  demo.addEventListener("click", () => store.dispatch({ type: "demo" }));
  temper.addEventListener("click", () => store.dispatch({ type: "temper" }));
  hypeBar.append(demo, temper, h("span", { class: "hint", text: "Demos raise expectations and funding. Winters are what happens when expectations outrun delivery." }));
  const el = h("section", { class: "tab research" }, rungNow, lead, ladder.el, hypeBar, list);

  const rows = keyedList<ProjectDef, Row>(
    list,
    (p) => p.id,
    (p) => {
      const cost = h("span", { class: "proj-cost" });
      const art = artUrl("note", p.id);
      const buy = h("button", { class: "proj-buy flat", type: "button" }, art ? h("img", { class: "note-thumb", src: art, alt: "", loading: "lazy" }) : null, h("b", { text: p.name }), p.year ? h("span", { class: "proj-year", text: String(p.year) }) : null, cost);
      buy.addEventListener("click", () => store.dispatch({ type: "research", id: p.id }));
      const row = h("div", { class: `proj track-${p.track}` }, buy, h("div", { class: "proj-meta" }, h("span", { class: "track", text: TRACK_LABEL[p.track] }), h("span", { class: "proj-fact", text: p.fact })));
      return { el: row, buy, cost };
    },
    (row, p) => {
      setText(row.cost, costText(store.state, p));
      setDisabled(row.buy, !canAfford(store.state, p.cost));
    },
  );

  return {
    el,
    update(s) {
      const name = rungName(s.rung);
      const l = leadFor(s, s.rung);
      setText(rungNow, s.flags.ladder ? `Capability: ${name}${l === null ? "" : ` (${fmt.signed(l)} yrs)`}` : `Capability: ${name.toLowerCase()}`);
      setText(lead, s.flags.ladder ? `Lead ${fmt.signed(totalLead(s))} years across ${Object.keys(s.rungYears).length} of ${RUNGS.length} rungs` : "");
      show(ladder.el, s.flags.ladder === true);
      if (s.flags.ladder) ladder.update(s);
      show(hypeBar, systemActive(hypeSystem, s));
      setClass(temper, "warn", s.pendingShock !== null);
      rows.update([...availableProjects(s)].sort((a, b) => a.era - b.era || TRACK_ORDER.indexOf(a.track) - TRACK_ORDER.indexOf(b.track)));
    },
  };
}
