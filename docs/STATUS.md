# Status

_Last updated: 2026-10-10_

## Where things are

Playable end to end: ten eras, three endings, saves with offline catch-up, a pacing bot that completes a run in ~390 active minutes with every era inside its target window. Three review cycles done (code and design); findings and what was done about them are in `docs/reviews/`.

- `src/core/` — deterministic sim. `step.ts` runs an ordered list of systems; each system is one file under `systems/`. Actions are a typed union dispatched through a handler table in `actions.ts`; handlers live with their systems. Flags go through `flags.ts`. All tunables in `balance.ts`.
- `src/content/` — the ten eras as data (`eras/eraN.ts`) with prose in `eras/eraN.text.ts` (41–42 log lines, 21–22 ticker headlines each); rungs, benchmarks, Earth regions, OOM lines, procedural titles. Eras carry `press`, `periods`, `blurb`, `rewritesUi` so the UI reads era facts rather than era numbers.
- `src/ui/` — vanilla DOM, panels built once and updated per frame (`dom.ts` has the keyed-list seam). One era panel per era under `tabs/era/`; shared widgets under `widgets/`; overlays for the gate, serendipity, rung cards, transitions, endings, settings, the away report. Charts on canvas.
- `src/skins/` — era skins as CSS custom properties keyed on `<html data-era>` plus `data-period` and `data-winter`.
- `src/bot/policy.ts` — the headless player shared by `npm run pace`, `?autoplay`, `?era=N`, and `?debug` (exposes `window.__game` for probes).

## Quality gates

`npm test` (64), `npm run test:e2e` (14 across phone and desktop), `npm run lint`, `npm run build`, `npm run pace` (fails if an era is >25% off target).

## The device (2026-10-09)

The interface is now one moulded plastic unit in ten colorways: seven-segment year, VFD compute and ticker, a 49-LED bargraph for orders of magnitude, LCD chips, spring keys with travel and LED indicators, module plates with printed labels, a CRT in Era 2. `src/skins/base.css` is the chassis, `eras.css` the colorways, `panels.css` the panels. `src/ui/readouts.ts` draws the seven-segment and LED bar. Generated art (176 pieces, see README) is wired through `src/ui/art.ts` and an optional `art` reference on log entries.

## Deploy

https://a-g-idle.charliedeck.com, Netlify site `a-g-idle-charliedeck`, built from `main` on `github.com/bigblueboo/a-g-idle`. DNS is a Netlify-managed record in the charliedeck.com zone.

## Next

- A motion pass on the era transition (staggered disassembly) and real long-press on glyph numbers.
- Listen to the audio on a device; it has only been verified not to throw.
- PWA service worker for offline play; training-run notifications.
- Hand-playtest Eras 4–6. Pacing is tuned against the bot. Likely levers: run ETA limits, legibility decay, insight costs.
- Fidelity parts are on different scales (People caps near 40; Records grows with Advisors). Normalize if the endings start leaning on it harder.
- The bot never hires knowledge engineers, so Era 2's rules mechanic is untested by pacing. A human will; verify the crossover timing by hand.
