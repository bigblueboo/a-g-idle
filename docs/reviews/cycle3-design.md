# Design review, cycle 3

_2026-10-07. Screens not yet seen by a person: the three endings, the Era 5 release card, the Era 7 pause card, the first Panel tab after a few deposits, Era 1 Research grouped by track, the Era 9 market after proposals accumulate, settings, high contrast._

## Endings

- **Router.** Epilogue tier from Ark load, the switch panel back for one byte, the manifest with the byte on its last line under the signed name, a stats line. The lamp row was invisible outside Era 0's skin; lamp and switch tokens now have defaults on `:root`. Works.
- **Dissolve.** The text goes to glyphs a character at a time from 1.5 s in: "ᴡerged. TÖ⍝nk y⊕⊛ ⟐or your co⍉tri⟁ut⟐⍉n." It is eerie in the right way. Works.
- **Off Switch.** A title, one line, the player's real local clock, stats. Quiet. Works.

## Cards

- **Release decision** (Era 5): loss, the rung it would reach, three options each with a one-line consequence. Clear.
- **Pause?** (Era 7): one word, one line, a ten-second hold. The ring makes the length legible.
- **Rung card**: name, year, history's year, Lead. Appears over whichever tab is open.

## First minute

The Panel tab shows the last four log lines, so "1 op." and the Army's offer are read without a tab switch. The DEPOSIT key beckons until the first press. Fifteen deposits buy $1.50 against a $3 first hire: a first purchase in roughly 15–25 seconds of tapping, which is the design's target.

## Research grouped by track

Era 1's list now reads Symbolic, then Connectionist, then Efficiency, with the track label on every card. The two-ways-to-build-a-mind argument is visible on one screen.

## Accessibility

High contrast overrides every skin, including the phosphor CRT (scanlines off). All interactive targets are 44px or larger. The meter is a progressbar with a live value; the log is a polite live region throttled to one announcement per four seconds. Reduced motion disables the self-press, the toast slide, the beckon, the globe spin and the transition's disassembly.

## Open, deferred

- The era transition is still a fade with a year, name and blurb rather than a staggered disassembly. It's skippable and reads well; a motion pass could do more.
- Audio has only been verified not to throw. Nobody has heard it.
- No PWA service worker yet; the manifest and icon exist. Offline play needs the worker.
- The glyph long-press on the HUD is a click toggle; proposals use `title`. Real long-press on touch would be better.

## Scores

Aesthetics 8 · Interactivity 8 · Delight 8 (the endings land) · Educational 8.
