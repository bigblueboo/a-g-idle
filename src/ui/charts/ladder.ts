import { NOW_YEAR, RUNGS } from "../../content/rungs";
import type { State } from "../../core/state";
import { h } from "../dom";
import type { Panel } from "../panel";

const X0 = 1940;
const X1 = 2040;
const PAD = { l: 28, r: 8, t: 8, b: 18 };

function css(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#888";
}

/** Capability over time: your line against history's ghost line, and the NOW line where the ghost ends. */
export function mountLadder(): Panel {
  const canvas = h("canvas", { class: "chart ladder", "aria-label": "Capability over time, yours versus history" });
  const el = h("div", { class: "chart-box" }, canvas);
  let signature = "";

  function draw(s: State): void {
    const w = canvas.clientWidth || 320;
    const hgt = 160;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = hgt * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    const x = (year: number) => PAD.l + ((year - X0) / (X1 - X0)) * (w - PAD.l - PAD.r);
    const y = (rung: number) => hgt - PAD.b - (rung / (RUNGS.length - 1)) * (hgt - PAD.t - PAD.b);
    ctx.clearRect(0, 0, w, hgt);
    ctx.font = "10px system-ui, sans-serif";
    ctx.fillStyle = css("--led-soft");
    ctx.strokeStyle = css("--led-soft");
    ctx.lineWidth = 1;
    for (const yr of [1950, 1975, 2000, 2025]) {
      ctx.fillText(String(yr), x(yr) - 12, hgt - 4);
      ctx.beginPath();
      ctx.moveTo(x(yr), PAD.t);
      ctx.lineTo(x(yr), hgt - PAD.b);
      ctx.globalAlpha = 0.25;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    // History's ghost line.
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    let first = true;
    RUNGS.forEach((r, i) => {
      if (r.year === undefined || r.year > NOW_YEAR) return;
      if (first) ctx.moveTo(x(r.year), y(i));
      else ctx.lineTo(x(r.year), y(i));
      first = false;
    });
    ctx.stroke();
    ctx.setLineDash([]);
    // NOW.
    ctx.strokeStyle = css("--led-hot");
    ctx.beginPath();
    ctx.moveTo(x(NOW_YEAR), PAD.t);
    ctx.lineTo(x(NOW_YEAR), hgt - PAD.b);
    ctx.stroke();
    ctx.fillStyle = css("--led-hot");
    ctx.fillText("now", x(NOW_YEAR) + 3, PAD.t + 10);
    // Your line.
    ctx.strokeStyle = css("--led");
    ctx.lineWidth = 2;
    ctx.beginPath();
    first = true;
    for (let r = 0; r < RUNGS.length; r++) {
      const yr = s.rungYears[r];
      if (yr === undefined) continue;
      if (first) ctx.moveTo(x(yr), y(r));
      else ctx.lineTo(x(yr), y(r));
      first = false;
    }
    if (!first) ctx.lineTo(x(Math.min(s.year, X1)), y(s.rung));
    ctx.stroke();
    ctx.fillStyle = css("--led-soft");
    ctx.fillText("rung", 2, PAD.t + 10);
  }

  return {
    el,
    update(s) {
      const sig = `${Object.keys(s.rungYears).length}:${Math.floor(s.year)}:${canvas.clientWidth}`;
      if (sig === signature) return;
      signature = sig;
      draw(s);
    },
  };
}
