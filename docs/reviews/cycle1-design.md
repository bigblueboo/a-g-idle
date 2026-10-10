# Design review, cycle 1

_2026-10-06. Played via screenshots of every era at 390×844 and a full bot run. Scored against the brief: aesthetics, interactivity, delight, educational value._

## Aesthetics — 7/10

**Working.** Ten skins are distinguishable from a blurred screenshot: brass paper, teletype uppercase, phosphor with scanlines, grey bevels and 2005 gloss, dark notebook, chat green, violet recursion, warm serif calm, dark-glass Earth, black with a gold Sun. Notation changes with era and the HUD never wraps.

**Not yet.**
- The era transition is a blur-fade with a year. The design says the old interface *comes apart* and the new one *assembles*. (Deferred: a per-panel staggered disassembly is a polish item; the current one is clean and skippable.)
- Winters have no visual. A funding collapse should look like one: the skin goes cold and desaturated, the HUD says so.
- Era 6's "the UI rewrites itself" is only spacing and radius. Nothing moves.
- The first screen's main area is a paper tag and whitespace. Fine, but the DEPOSIT key should ask to be pressed.

## Interactivity — 7/10

**Working.** Tap, hold-for-permanent with a filling ring, bulk ×1/×10/×100/max, three coupled sliders, a draggable tappable globe, swipe-to-review, hold-to-train, self-pressing APPROVE, DEMO/TEMPER, Explain/Bundle/Withdraw/Bypass, forks, Ark packing.

**Not yet.**
- No keyboard: the design promises Space for the Button, 1–4 for tabs (done), ← → for Era 9 review.
- Era 6 near-miss tracking (the signature "Moved APPROVE 40px up. You missed it 31% of the time.") isn't built. Neither is Build reordering by use.
- Glyph numbers in Era 9 have a click-to-reveal on the HUD only; proposals need a plain-language reading too.

## Delight — 6/10

**Working.** Serendipity bobs in at a seeded spot and fades. Synthesized era-specific clicks. The switch panel returns for the ending byte. The lobster and the cat are in the logbook. Send-off lines for retired staff.

**Not yet.**
- Reaching a rung is a log line and a ticker. It should be a *card*: the rung's name, the year, the Lead in years, sliding in and out. This is the game's score mechanic and it's invisible.
- The Dissolve ending is a title and one line. The design: numbers turn to glyphs, then the log, then the panel labels. Even a ten-second progressive glyphing of the ending text would land it.
- Dissolve and Off Switch endings show no run stats. Only the Router manifest does.
- Era transitions carry no sense of *why* the paradigm changed. One line per era in the interstitial would do it.

## Educational value — 8/10

**Working.** Every project carries a dated fact. Fifty OOM lines name the machine that first did that many ops. The Lead chart draws your line against history's ghost and marks NOW. Rules upkeep vs. licenses is a visible crossover. Scaling laws turn the loss chart from fog to a line. Benchmarks show accuracy and who took them. The Bitter Lesson card states the trade.

**Not yet.**
- The hype/winter loop is the clearest historical lesson in the early game and it has no visual state beyond a chip. Pair it with the winter skin.
- The transition interstitial is the natural place for the one-sentence thesis of each era.

## Actions this cycle

1. Era 6 self-rewriting UI: count near-miss presses in the button area; past a threshold nudge the Button up and log the line. Build tab orders by purchase count in Era 6.
2. Rung cards: a toast with name, year, Lead.
3. Winter state: `data-winter` on `<html>`, cold filter, HUD chip.
4. Era blurbs in the transition.
5. Keyboard: Space presses, ← → review in Era 9.
6. Stats block on every ending; progressive glyphing on Dissolve.
7. DEPOSIT pulses until the first press.
8. Plain-language `title` on glyph proposals.
