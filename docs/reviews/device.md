# The device: art pipeline and skeuomorphic interface

_2026-10-09. A review of the change that turned ten flat skins into one moulded instrument with generated art._

## What changed

- **Art pipeline.** `scripts/art-manifest.ts` derives 176 prompts from the content tables (54 generator labels, 78 historical notes, 19 rung cards, 10 era heroes, 15 serendipity spots) in two fixed styles: a 1970s technical-manual label on cream, and a duotone halftone archival photograph. `scripts/art-lane.sh` runs shards through Codex's built-in image tool, idempotently, into gitignored `art/raw/`; `scripts/art-import.mjs` resizes with `sips` into `src/art/<kind>/<id>.jpg`. `src/ui/art.ts` resolves kind+id to a fingerprinted URL via `import.meta.glob`; a missing file means no picture, never an error.
- **Log entries carry an optional `ArtRef`.** Events, dated projects, rungs, first purchases and serendipity pass one to `pushLog`, so historical notes show their picture in the Log and on the Panel tab. Save schema gained one optional field.
- **Readouts.** `src/ui/readouts.ts`: a seven-segment display (DOM, seven `<i>` per digit plus a decimal point, ghost segments unlit) and an LED bargraph with hot top segments. The HUD uses both; compute, ticker and prices are VFD text on glass.
- **Chassis.** `base.css` rewritten: plastic grain (an SVG turbulence overlay in `overlay` blend), moulded plates with screws, a recessed bay, keys with travel and an LED under each tab, faders, slide switches, a CRT in Era 2 (scanlines in every piece of glass). `eras.css` is ten colorways of the same mould: plastic, key, LED, LCD and screen tokens per era, with `color-mix` deriving the shades.

## Code-quality findings, applied

1. **Three duplicated selector lists** for keys (base, `:active`, `:disabled`) → every `<button>` the `h()` helper makes gets `key`; a button opts out with `flat`. One rule, three opt-outs (toggles, module plates).
2. **An opt-out list of feature class names inside `dom.ts`** (`switch`, `gen-buy`, `proj-buy`) was a layering leak → the generic `flat` contract above.
3. **`hud.ts` reached `compute.parentElement`** to attach a listener → holds the glass element it built.
4. **A cast on `ticker.firstElementChild`** → the span is built first and passed in.
5. **The greedy bot exposed demo-log spam:** every DEMO wrote a log line. First demo logs; later ones go to the ticker.
6. **Chart ink was `--fg` on dark glass** (invisible in light colorways); prices were LED-blue on light plastic. Charts draw in the LED palette; prices sit in small glass windows.
7. **The HUD row aligned to the bottom**, so the subjective-time line pushed the compute readout down. Top-aligned.
8. **Lamp tokens existed only in Era 0**, so the ending's switch panel was invisible elsewhere. Defaults on `:root`.
9. **The Panel tab showed an empty paper strip** before the first log line. Hidden until there is something to print.

## Not done

- The Era 2 1984 "desktop" period and Era 3's 2005 "glossy" period are colorway swaps only; the mould doesn't change shape.
- The grain overlay is one SVG tile for all colorways; a coarser grain for the ABS eras and finer for anodized would be better.
- Screenshot baselines were regenerated once with partial art; they'll need regenerating again after the last shard lands.

## Verification

Typecheck clean. 64 unit tests. 14/14 e2e (baselines regenerated). Build passes. Pacing unchanged (the sim changed only in demo logging and the optional log field).
