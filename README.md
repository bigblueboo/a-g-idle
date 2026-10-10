# Computronium

An idle game about building AGI. It opens in 1936 with eight toggle switches and a lamp panel, and ends with the Sun wrapped in thinking shells and an economy you started running too fast for you to read. The route runs through AI's real history: the summers and winters, expert systems, the bitter lessons, scaling laws. Then it passes the date the game was written and keeps going. Fifty orders of magnitude of compute, ten eras, ten interfaces, three endings. The design is in [DESIGN.md](DESIGN.md).

## Run

```
npm install
npm run dev
```

Opens on port 4731, reachable on the Tailscale network as `http://m4air:4731`. Production preview is `npm run preview` on 4732.

Dev hooks on the URL: `?era=N` jumps a fresh game to an era, `?speed=N` multiplies sim time, `?autoplay` lets the bot play, `?seed=N` fixes the seed, `?fresh` ignores the save, `?silent` mutes, `?now=ISO` pins the wall clock.

## Art

The pictures on module labels, research cards, rung cards, era transitions and log entries are generated: `npm run art:manifest` writes one prompt per generator, event, project, rung, era and serendipity item (176, in a printed-label style) to `art/manifest.json`; `scripts/art-lane.sh <shard…>` runs them through Codex's built-in image tool into `art/raw/` (gitignored); `npm run art:import` resizes the originals into `src/art/<kind>/<id>.jpg`, which the UI picks up by id. A missing file just means no picture.

## Quality gates

```
npm test            # vitest: formulas, determinism, offline catch-up, saves, content
npm run test:e2e    # playwright: first screen, era renders, a full bot run, save/away report
npm run lint        # tsc --noEmit
npm run build
npm run pace        # headless pacing bot; fails if any era is >25% off its target minutes
```
