import { chinchillaLoss } from "../../core/formulas";
import type { State } from "../../core/state";
import { h } from "../dom";
import type { Panel } from "../panel";

const LOG_X0 = 16;
const LOG_X1 = 30;
const Y0 = 1.6;
const Y1 = 5;
const PAD = { l: 30, r: 8, t: 8, b: 18 };

function css(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#888";
}

/** Loss against compute, log-log. A fog band before the scaling-laws paper; a tight line after. */
export function mountLoss(): Panel {
  const canvas = h("canvas", { class: "chart loss", "aria-label": "Loss versus training compute" });
  const el = h("div", { class: "chart-box" }, canvas);
  let signature = "";

  function draw(s: State): void {
    const w = canvas.clientWidth || 320;
    const hgt = 150;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = hgt * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    const x = (logFlop: number) => PAD.l + ((logFlop - LOG_X0) / (LOG_X1 - LOG_X0)) * (w - PAD.l - PAD.r);
    const y = (loss: number) => hgt - PAD.b - ((Math.log(loss) - Math.log(Y0)) / (Math.log(Y1) - Math.log(Y0))) * (hgt - PAD.t - PAD.b);
    ctx.clearRect(0, 0, w, hgt);
    ctx.font = "10px system-ui, sans-serif";
    ctx.fillStyle = css("--led-soft");
    for (const e of [18, 22, 26, 30]) ctx.fillText(`1e${e}`, x(e) - 10, hgt - 4);
    for (const l of [2, 3, 4]) ctx.fillText(String(l), 4, y(l) + 3);
    // Compute-optimal curve: D = 20N, so flop = 120 N^2.
    const tight = s.flags.scalingLaws === true;
    ctx.strokeStyle = css("--led-hot");
    ctx.lineWidth = tight ? 1.5 : 10;
    ctx.globalAlpha = tight ? 0.9 : 0.15;
    ctx.beginPath();
    for (let e = LOG_X0; e <= LOG_X1; e += 0.25) {
      const N = Math.sqrt(Math.pow(10, e) / 120);
      const loss = chinchillaLoss(N, 20 * N);
      if (e === LOG_X0) ctx.moveTo(x(e), y(loss));
      else ctx.lineTo(x(e), y(loss));
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = css("--led");
    for (const r of s.training.history) {
      ctx.beginPath();
      ctx.arc(x(Math.log10(r.flop)), y(r.loss), 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = css("--led-soft");
    ctx.fillText(tight ? "loss, predicted" : "loss, roughly", PAD.l + 2, PAD.t + 10);
  }

  return {
    el,
    update(s) {
      const sig = `${s.training.history.length}:${s.flags.scalingLaws ? 1 : 0}:${canvas.clientWidth}`;
      if (sig === signature) return;
      signature = sig;
      draw(s);
    },
  };
}
