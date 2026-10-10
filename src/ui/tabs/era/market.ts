import { BALANCE } from "../../../core/balance";
import type { FidelityPart } from "../../../core/content-types";
import type { ProposalT } from "../../../core/state";
import { arkLoad, packCost, shareLossRate } from "../../../core/systems/market";
import { mountShells } from "../../charts/shells";
import { h, keyedList, setClass, setDisabled, setText, show } from "../../dom";
import * as fmt from "../../format";
import { attachHold } from "../../hold";
import type { Panel } from "../../panel";
import type { Store } from "../../store";
import { mountFidelity } from "../../widgets/fidelity";
import { mountForks } from "../../widgets/forks";

const PARTS: FidelityPart[] = ["people", "places", "records"];
const SWIPE_PX = 60;

/** Era 9: the shells, the market, the inverted queue, the Ark, and the way out. */
export function mountMarket(store: Store): Panel {
  const shells = mountShells();
  const share = h("p", { class: "stat big" });
  const drain = h("p", { class: "stat" });
  const queue = h("div", { class: "proposals foreign" });
  const auto = h("button", { class: "auto-approve", type: "button" }, h("b", { text: "Auto-approve" }), h("span", { text: "Hold to stop reading." }));
  attachHold(auto, { ms: () => store.settings.holdMs, onComplete: () => store.dispatch({ type: "autoApprove", on: !store.state.market.autoApprove }) });
  const arkBox = h("div", { class: "ark hidden" });
  const arkStatus = h("p", { class: "stat" });
  const packButtons = new Map<FidelityPart, HTMLButtonElement>();
  for (const part of PARTS) {
    const b = h("button", { class: "action", type: "button" });
    b.addEventListener("click", () => store.dispatch({ type: "pack", part }));
    packButtons.set(part, b);
  }
  const leave = h("button", { class: "leave hidden", type: "button" }, h("b", { text: "LEAVE" }), h("span", { text: "Hold to unfurl the sail." }));
  attachHold(leave, { ms: () => store.settings.holdMs * 2, onComplete: () => store.dispatch({ type: "leave" }) });
  arkBox.append(h("h3", { text: "The Ark" }), arkStatus, h("div", { class: "pack-row" }, ...packButtons.values()), leave);
  const fidelity = mountFidelity();
  const forks = mountForks(store);
  const el = h("section", { class: "tab era-tab market-tab" }, shells.el, share, drain, h("h3", { text: "Proposals" }), h("p", { class: "hint", text: "Your descendants propose faster than you can read. Swipe right to approve, left to reject. Approving what you can't read raises your share and costs Fidelity." }), queue, auto, arkBox, fidelity.el, forks.el);

  const rows = keyedList<ProposalT, { el: HTMLElement }>(
    queue,
    (p) => String(p.id),
    (p) => {
      const approve = h("button", { class: "prop-btn", type: "button", text: "✓" });
      const reject = h("button", { class: "prop-btn quiet", type: "button", text: "✕" });
      approve.addEventListener("click", () => store.dispatch({ type: "review", id: p.id, approve: true }));
      reject.addEventListener("click", () => store.dispatch({ type: "review", id: p.id, approve: false }));
      const row = h("div", { class: "proposal glyph" }, reject, h("span", { class: "prop-glyphs", text: p.title, title: "A proposal in a notation you can't read. Approve to raise your share; reject to keep Fidelity." }), approve);
      let startX: number | null = null;
      row.addEventListener("pointerdown", (e) => {
        startX = e.clientX;
        row.setPointerCapture(e.pointerId);
      });
      row.addEventListener("pointermove", (e) => {
        if (startX !== null) row.style.transform = `translateX(${e.clientX - startX}px)`;
      });
      row.addEventListener("pointerup", (e) => {
        const dx = startX === null ? 0 : e.clientX - startX;
        startX = null;
        row.style.transform = "";
        if (Math.abs(dx) > SWIPE_PX) store.dispatch({ type: "review", id: p.id, approve: dx > 0 });
      });
      return { el: row };
    },
    () => {},
  );

  return {
    el,
    update(s) {
      shells.update(s);
      setText(share, `Share: ${s.res.share.toFixed(s.res.share < 1 ? 3 : 1)}%`);
      setText(drain, `Falling ${(shareLossRate(s) * 60).toFixed(2)} points a minute. ${s.market.autoApprove ? "You've stopped reading." : "The market does not wait."}`);
      rows.update(s.queue.items);
      setClass(auto, "on", s.market.autoApprove);
      show(arkBox, s.flags.ark === true);
      setText(arkStatus, `${arkLoad(s)} of ${BALANCE.market.hull} bunks filled. Each costs ${packCost().toFixed(0)} share, and you can only pack what Fidelity says is there.`);
      for (const [part, b] of packButtons) {
        setText(b, `Pack ${part} (${s.market.ark[part]}/${Math.floor(s.fidelity[part])})`);
        setDisabled(b, s.res.share < packCost() || s.fidelity[part] < s.market.ark[part] + 1 || arkLoad(s) >= BALANCE.market.hull);
      }
      show(leave, s.flags.sail === true);
      fidelity.update(s);
      forks.update(s);
    },
  };
}
