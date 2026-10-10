// Tap for reversible, hold for permanent. A ring fills while the pointer is down;
// releasing early cancels. The game never asks "are you sure"; the hold is the question.

interface HoldOptions {
  ms: () => number;
  onComplete: () => void;
  enabled?: () => boolean;
}

export function attachHold(el: HTMLElement, opts: HoldOptions): void {
  let raf = 0;
  let startedAt = 0;
  let pointerId: number | null = null;

  const reset = (): void => {
    cancelAnimationFrame(raf);
    el.classList.remove("holding");
    el.style.setProperty("--hold", "0");
    pointerId = null;
  };

  const tick = (): void => {
    const progress = Math.min(1, (performance.now() - startedAt) / opts.ms());
    el.style.setProperty("--hold", progress.toFixed(3));
    if (progress >= 1) {
      reset();
      el.classList.add("held");
      setTimeout(() => el.classList.remove("held"), 400);
      opts.onComplete();
      return;
    }
    raf = requestAnimationFrame(tick);
  };

  el.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || (opts.enabled && !opts.enabled())) return;
    pointerId = e.pointerId;
    el.setPointerCapture(e.pointerId);
    startedAt = performance.now();
    el.classList.add("holding");
    raf = requestAnimationFrame(tick);
  });
  for (const type of ["pointerup", "pointercancel", "pointerleave"] as const) {
    el.addEventListener(type, (e) => {
      if (pointerId === e.pointerId) reset();
    });
  }
  el.addEventListener("keydown", (e) => {
    if ((e.key === " " || e.key === "Enter") && pointerId === null && !e.repeat) {
      pointerId = -1;
      startedAt = performance.now();
      el.classList.add("holding");
      raf = requestAnimationFrame(tick);
    }
  });
  el.addEventListener("keyup", () => {
    if (pointerId === -1) reset();
  });
  el.classList.add("hold");
}
