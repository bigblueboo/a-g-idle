# Thermo-nuclear code quality review, cycle 1

_2026-10-06. Scope: the whole tree (no commits yet). Reviewer: in-model, per `thermo-nuclear-code-quality-review`._

## Structural regressions / missed judo

1. **Action handlers in the wrong layer.** `core/actions.ts` holds `tap`, `deposit`, `hire`, `buy`, `research`, `demo`, `temper`, `claimSerendipity`, `offSwitch` as private functions plus a 70-line `switch`. Hype actions belong in `systems/hype.ts`, the serendipity claim in `systems/serendipity.ts`, purchases in their own module, the Off Switch in the queue system where "Pause?" is offered. The dispatcher becomes a typed table `{ [K in Action["type"]]: Handler }`, so the switch disappears and adding an action is one line in one place.
   → **Fix:** `core/purchase.ts`, `core/tap.ts`; handlers moved; `actions.ts` is the union + table.

2. **The "once" pattern is copied eight times.** `if (!s.flags.x) { s.flags.x = true; … }` appears in calendar (×2), income, recursion, queue, market, actions, events. One `once(s, key)` helper deletes every branch and makes the intent legible.
   → **Fix:** `core/flags.ts` with `once()` and `eventKey()`; all sites converted.

3. **Era numbers leaking into the UI.** `button.ts` switches on `s.era` to decide what a press does; `layout.ts` knows 1984 means "desktop" and 2005 means "glossy". The HUD already does this right (a per-era table). The Button's verb is content, so the press should be too; skin periods are content.
   → **Fix:** `EraDef.press` and `EraDef.periods`; `button.ts` and `layout.ts` read them. No era literals remain in `ui/`.

4. **`flags` carries three concerns under one string namespace:** event-fired markers (`ev:`, `warn:`), one-shot notices, and content unlocks. Not worth splitting the record (save compatibility, and they are all "has this happened"), but key construction must live in one place.
   → **Fix:** `eventKey()`/`warnKey()` in `core/flags.ts`; notices go through `once()`.

5. **State carries derived or constant data.** `uiDrift` is `1 − legibility`; `market.hull` never changes; `Proposal.foreign` is never read; `training.notified` is never used.
   → **Fix:** all four removed; hull moves to `BALANCE.market.hull`.

6. **Three copies of "let the bot play until…"**: `app.ts` (`synthesize`), `tests/sim.test.ts` (`playTo`), `scripts/pace.ts`.
   → **Fix:** `playUntil()` in `bot/policy.ts`; all three use it.

7. **Content hacks:** `gate: { flags: ["never"] }` on the last era; `requires: "never"` to hide the Earth tile generator.
   → **Fix:** `gate` is optional; `hidden: true` on generators the sim creates.

8. **`reachRung` special-cases rung 0** because the initial rung is 0 but unreached.
   → **Fix:** initial rung is −1 ("unmeasured"); the loop is `for (r = s.rung + 1; r <= target; r++)`.

9. **Shared widgets inside era files.** `mountFidelity`/`mountForks` live in `tabs/era/queue.ts`, `mountRivals`/`mountRuns` in `tabs/era/runs.ts`, and three other eras import them.
   → **Fix:** `ui/widgets/{fidelity,forks,rivals,runs}.ts`.

10. **Side effect in a render path:** `ending.ts` writes the save bookmark inside `fill()` during `update`.
    → **Fix:** `layout.ts` bookmarks when `s.ending` transitions, next to the era-transition detection.

11. **E9 review logic in `queue.ts`.** `descendants` and `review` mutate Share and Fidelity; they are market concerns.
    → **Fix:** moved to `systems/market.ts`; `queue.ts` is Era 7 only.

## Boundaries, types, dead code

12. `ResourceRecord` in `state.ts` is built with `Object.fromEntries(...) as Record<…>`. Six keys; write the literal.
13. Dead: `mulberry32`, `SEA_NAMES`, `ERA_IDS`, `memo`, `isBought`, `projectYear`, `TILE_GENERATOR` export, `machineTimePrice` export, balance `grants`, `demoDiminish`, `interpRestore`, `release.evalDelay`, `queue.valueOps`. `fidelityTotal` exists but `hud.ts` and `pace.ts` sum the parts inline.
14. `hud.ts` runs `querySelector` every frame for the meter's aria value; hold the element.
15. `fmtParams` (training.ts) and `fmtPeople` (earth.ts) are formatters inside core systems. They feed log lines, so they stay in core, but they belong together: `core/fmt.ts`.

## File size

Largest TS file is 218 lines (`actions.ts`, shrinking). CSS files are 697/582/366. Nothing near 1k.

## Verdict

Not approvable as-is on items 1–3 (handler layering, the copied once-pattern, era literals in the UI). Everything above is applied in this cycle.
