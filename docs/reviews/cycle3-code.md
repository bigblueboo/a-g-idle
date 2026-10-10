# Thermo-nuclear code quality review, cycle 3

_2026-10-06. Scope: everything since cycle 2, plus a sweep for casts, non-null assertions, `any`, and era literals in the UI._

## Findings

1. **Fourteen `as` casts, ten of them unnecessary.** `h("input", …)` already returns `HTMLInputElement` (the helper is generic over the tag), so `settings.ts`'s three casts and `recursion.ts`'s `querySelector("input") as HTMLInputElement` are noise; `build.ts` and `gate.ts` cast `querySelector`/`firstElementChild` results for elements they built two lines earlier and could simply hold. `globe.ts` casts `Object.fromEntries` to a palette type instead of writing the object. `button.ts` casts `e.target` instead of narrowing with `instanceof`. `procedural.ts` casts an indexed pick to `string[]` to silence `noUncheckedIndexedAccess`.
   → All removed. A `pick(list, i)` helper in `procedural.ts` returns a string.
2. **Two JSON boundaries trust their input.** `store.ts` parses settings `as Partial<Settings>`; `save.ts` parses the envelope `as Envelope`. The save *state* is zod-validated; the envelope around it and the settings aren't.
   → Both get a zod schema. Bad settings fall back to defaults; a bad envelope is a fresh game, as before.
3. **`s.era as EraId` in `state.ts` and `audio.ts`** because the schema types era as `number`.
   → The schema is a literal union 0–9, so `State["era"]` *is* `EraId` and `eraOf()` is deleted.
4. **Era numbers in the UI, three places.** `format.ts` switches on era thresholds for notation; `research.ts` shows DEMO/TEMPER for `era >= 1 && era <= 5`; `benchmarks.ts` shows the feature button for `era === 3`.
   → Notation is a per-era table (`NOTATION: Record<EraId, …>`), matching how the HUD chips are done. The hype bar asks whether the hype system runs in this era (`systemActive(hypeSystem, s)`). The feature button shows while the era's coming lesson will scrap features (`lessonWillReset(s, "features")`), which is the actual rule.
5. **`BALANCE.generality.baseline` is cast to `Record<number, number>`.** → Typed where declared.
6. **The remaining cast** is `HANDLERS[a.type] as Handler<typeof a.type>` in `actions.ts`, the standard correlated-union limitation; it stays with a comment.
7. **Bot policy keeps seven `s.era === N` blocks.** It's a test harness, not product code, and the blocks map one-to-one to era systems. Left as is; noted so nobody mistakes it for a pattern to copy.

## CSS

1,805 lines across three files; the largest is 824. Two selectors appear twice in `panels.css` (`.proj-buy`, `.leave`) as deliberate overrides after a grouped rule. Fine.

## Verdict

Approvable after the items above. No structural findings this cycle; the sweep found boundary hygiene, which is what a third pass should be finding.
