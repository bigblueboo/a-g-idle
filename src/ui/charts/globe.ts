import type { State, TileT } from "../../core/state";
import { h } from "../dom";

const DEG = Math.PI / 180;
const IDLE_SPIN = 0.08;

interface Projected {
  x: number;
  y: number;
  z: number;
  tile: TileT;
}

interface Palette {
  glass: string;
  reserve: string;
  upload: string;
  land: string;
  seaTile: string;
  sea: string;
  accent: string;
  grid: string;
}

/** The era's colors, read once per frame. */
function palette(): Palette {
  const style = getComputedStyle(document.documentElement);
  const read = (k: string): string => style.getPropertyValue(k).trim() || "#888";
  return { glass: read("--glass"), reserve: read("--reserve"), upload: read("--upload"), land: read("--land"), seaTile: read("--sea-tile"), sea: read("--sea"), accent: read("--accent"), grid: read("--grid") };
}

/**
 * A rotating globe of 160 tiles, orthographic, on canvas. Drag to rotate, tap to select.
 * Idle spin stops under reduced motion.
 */
export function mountGlobe(onSelect: (id: number) => void): { el: HTMLElement; update(s: State, selected: number | null): void } {
  const canvas = h("canvas", { class: "globe", "aria-label": "Earth, as tiles. Tap a tile to select it." });
  const el = h("div", { class: "globe-box" }, canvas);
  let lon0 = 0;
  let lat0 = 20;
  let dragging = false;
  let moved = false;
  let lastX = 0;
  let lastY = 0;
  let projected: Projected[] = [];
  let tileRadius = 14;
  let lastFrame = performance.now();
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  canvas.addEventListener("pointerdown", (e) => {
    dragging = true;
    moved = false;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
    lon0 -= dx * 0.5;
    lat0 = Math.max(-80, Math.min(80, lat0 + dy * 0.5));
    lastX = e.clientX;
    lastY = e.clientY;
  });
  canvas.addEventListener("pointerup", (e) => {
    dragging = false;
    if (moved) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    let best: Projected | null = null;
    let bestD = tileRadius;
    for (const p of projected) {
      if (p.z < 0) continue;
      const d = Math.hypot(p.x - px, p.y - py);
      if (d < bestD) {
        bestD = d;
        best = p;
      }
    }
    if (best) onSelect(best.tile.id);
  });

  function project(tiles: readonly TileT[], w: number, hgt: number): Projected[] {
    const r = Math.min(w, hgt) * 0.46;
    const cx = w / 2;
    const cy = hgt / 2;
    const cosLat0 = Math.cos(lat0 * DEG);
    const sinLat0 = Math.sin(lat0 * DEG);
    return tiles.map((t) => {
      const lat = t.lat * DEG;
      const lon = (t.lon - lon0) * DEG;
      const cosLat = Math.cos(lat);
      const x = cosLat * Math.sin(lon);
      const y = Math.sin(lat) * cosLat0 - cosLat * Math.cos(lon) * sinLat0;
      const z = Math.sin(lat) * sinLat0 + cosLat * Math.cos(lon) * cosLat0;
      return { x: cx + x * r, y: cy - y * r, z, tile: t };
    });
  }

  function fill(t: TileT, c: Palette): string {
    if (t.state === "converted") return c.glass;
    if (t.state === "preserved") return c.reserve;
    if (t.state === "uploading") return c.upload;
    return t.land ? c.land : c.seaTile;
  }

  function draw(s: State, selected: number | null): void {
    const w = canvas.clientWidth || 320;
    const hgt = Math.min(w, 360);
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== w * dpr) {
      canvas.width = w * dpr;
      canvas.height = hgt * dpr;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, hgt);
    const c = palette();
    const r = Math.min(w, hgt) * 0.46;
    ctx.fillStyle = c.sea;
    ctx.beginPath();
    ctx.arc(w / 2, hgt / 2, r, 0, Math.PI * 2);
    ctx.fill();
    projected = project(s.earth.tiles, w, hgt);
    const tileR = r * 0.15;
    tileRadius = tileR;
    for (const p of [...projected].sort((a, b) => a.z - b.z)) {
      if (p.z < 0) continue;
      const scale = 0.55 + 0.45 * p.z;
      ctx.fillStyle = fill(p.tile, c);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
        const px = p.x + Math.cos(a) * tileR * scale;
        const py = p.y + Math.sin(a) * tileR * scale;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      if (p.tile.id === selected) {
        ctx.strokeStyle = c.accent;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      if (p.tile.state === "converted") {
        ctx.strokeStyle = c.grid;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  return {
    el,
    update(s, selected) {
      const now = performance.now();
      if (!dragging && !reduced) lon0 += IDLE_SPIN * ((now - lastFrame) / 16);
      lastFrame = now;
      draw(s, selected);
    },
  };
}
