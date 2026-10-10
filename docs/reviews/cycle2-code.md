# Thermo-nuclear code quality review, cycle 2

_2026-10-06. Scope: everything since cycle 1, plus a second pass over the UI, which was written fastest._

## Findings

1. **`hud.ts` formats money and then strips the symbol with a regex** to put it in a chip labelled "$". The formatter should have a symbol-free form.
   → `fmt.amount()` is the number; `fmt.money()` is `$` + amount.
2. **`layout.ts` uses `press === "approve"` as a proxy for "this era rewrites the UI".** That's the wrong field; it happens to coincide. → `era.rewritesUi`.
3. **`globe.ts` calls `getComputedStyle` per tile per frame** (160 × 5 reads at 60 fps) and `shells.ts` per shell. → Read the palette once per draw.
4. **`queue.ts` (UI) checks a `pauseDeclined` flag nothing sets.** Dead branch. → Removed.
5. **`button.ts` has four `selected()!` non-null assertions.** → Bind once, test once.
6. **`deploy.ts` finds a slider's `<output>` via `nextElementSibling`.** Fragile DOM coupling. → Hold the reference.
7. **`save.ts` has `fresh()`, an identity wrapper around `initialState`,** and encodes with the deprecated `escape`/`unescape`. → Deleted; `TextEncoder` + base64.
8. **`BALANCE.earth.tileOps` is read only by content** (`era8.ts`) to build a generator. A balance constant that exists to be copied into content is content. → The number lives in `era8.ts`.
9. **`recursion.ts` (UI) computed "research hours" inline with two magic numbers and an always-true ternary.** → Named constants, one line.
10. **The Era 9 swipe gives no motion feedback** (functional, not quality, but it's a two-line fix in the same file).

## Tests

No test exercised the action table as a whole. `tests/actions.test.ts` dispatches every action type into a synthesized state for its era and asserts nothing throws and the state still validates against the schema; it also covers `once()`, the lesson's scrap-and-G path, and the offline Share cap.

## Still open from cycle 1

Nothing. All eleven items landed and the suite is green.

## Verdict

Approvable after the items above; none is structural. The architecture from cycle 1 held: content is data, systems are files, the UI reads era facts from `EraDef` rather than era numbers.
