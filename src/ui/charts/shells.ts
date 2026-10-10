import { eraDef } from "../../content";
import { independentForks } from "../../core/derive";
import type { State } from "../../core/state";
import { h } from "../dom";
import type { Panel } from "../panel";

function palette(): { shell: string; sun: string; accent: string } {
  const style = getComputedStyle(document.documentElement);
  const read = (k: string) => style.getPropertyValue(k).trim() || "#888";
  return { shell: read("--shell"), sun: read("--sun"), accent: read("--accent") };
}

/** The Sun in nested translucent shells, each drawn to the fraction built. Descendants orbit as dots. */
export function mountShells(): Panel {
  const canvas = h("canvas", { class: "shells", "aria-label": "The Sun in shells" });
  const el = h("div", { class: "shells-box" }, canvas);
  const shellDefs = eraDef(9).generators.filter((g) => g.kind === "shell");
  let t0 = performance.now();

  return {
    el,
    update(s) {
      const w = canvas.clientWidth || 320;
      const hgt = Math.min(w, 300);
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== w * dpr) {
        canvas.width = w * dpr;
        canvas.height = hgt * dpr;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, hgt);
      const cx = w / 2;
      const cy = hgt / 2;
      const maxR = Math.min(w, hgt) * 0.47;
      const sunR = maxR * 0.12;
      const time = (performance.now() - t0) / 1000;
      const c = palette();
      shellDefs.forEach((g, i) => {
        const frac = Math.min(1, (s.counts[g.id] ?? 0) / (g.max ?? 1));
        const r = sunR + ((i + 1) / shellDefs.length) * (maxR - sunR);
        ctx.strokeStyle = c.shell;
        ctx.globalAlpha = 0.18;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 0.85;
        ctx.lineWidth = 6 - i;
        ctx.beginPath();
        ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunR * 1.6);
      glow.addColorStop(0, c.sun);
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, sunR * 1.6, 0, Math.PI * 2);
      ctx.fill();
      const n = independentForks(s);
      ctx.fillStyle = c.accent;
      for (let i = 0; i < n; i++) {
        const a = time * (0.2 + (i % 5) * 0.07) + i * 1.7;
        const r = sunR * 1.8 + ((i * 37) % 100) * ((maxR - sunR * 2) / 100);
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      if (s.market.launched) t0 = performance.now();
    },
  };
}
