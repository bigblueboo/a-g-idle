# Cycle 4: gates that hadn't been run

_2026-10-07. A short cycle. Cycles 1–3 left two quality gates unexercised and a sweep's worth of hygiene._

## Code

1. **`npm run build` had never run.** It passes: 255 KB JS (85 KB gzipped), 24 KB CSS, no bignum library, no external fonts.
2. **E2E had only run on the phone project.** On the desktop project one test failed because it clicked the Log tab, which is hidden at laptop width (the Log is a column there). The test now clicks the tab only when it's visible. 14/14 pass across both projects.
3. **Twenty-three exports nothing imports** after three refactors, one of them (`FROM`) dead. All made module-private; `FROM` deleted.
4. **Unknown ids threw inside the sim.** `buy("nothing")` reached `generatorDef()` and threw. Actions are user-facing input, so `buy` and `research` now return `false` for ids the content doesn't know, like every other refused action.

## Design

5. **Audio verified to run**, not just to load: sound on, four eras, taps, buys, a refused action's thud. No errors. Still unheard by a person.
6. **De-slop check on all shipped strings.** No stock phrases ("not just", "delve", "seamless", "journey", …) anywhere in content or UI. Three balanced triads across ~430 lines of era prose, inside the house limit.

## Verdict

Approvable. Four cycles total; the fourth found gates, not structure, which is the right place to stop.
