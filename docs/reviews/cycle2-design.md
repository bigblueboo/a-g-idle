# Design review, cycle 2

_2026-10-06. Driven interactively via the `?debug` handle: the Dartmouth gate and transition, Era 2 in a winter, an Era 4 run, Era 6 near-miss nudging, Era 8 tile selection and conversion, the rung card. Laptop layout checked at 1280px._

## What cycle 1's actions bought

- The rung card shows the name, the year, history's year and the Lead. The score is visible now.
- Winter desaturates the whole interface and the Hype chip reads WINTER. The lesson is legible without a word.
- The transition carries the era's one-line thesis.
- Near-miss nudging works: fourteen misses in the button area and APPROVE moves up 40px with the model's line in the log.
- Keyboard: Space presses, 1–4 switch tabs, ← → review in Era 9.
- The laptop layout now keeps the Log in its left column.

## Found this cycle

1. **Era 1 overflowed the viewport.** A nowrap ticker inside a CSS grid child widened the page; `min-width: 0` on grid children. Fixed.
2. **Tap-to-select on the globe failed** at a 14px hit radius against 25px hexes. Fixed to use the tile radius.
3. **The nudge pulled the tab bar under the button.** Fixed: the area grows, the button rises.
4. **Leaderboard, staff, and fork rows ran name into value.** Fixed with flex rows.
5. **Serendipity could land on the HUD.** Its band is now 30–70% of the viewport.
6. **One converted tile multiplied compute 200×** and the Sahara held 16M people. Tiles rebalanced; deserts and Siberia depopulated; the consent threshold is a million residents.
7. **Era 0's narrative is invisible.** The log is a tab; a first-time player on the Build tab never sees "1 op." or the Army's contract line except as a 20-second ticker. The Panel tab is the logbook, so it should show the last few entries.
8. **Crossing an order of magnitude is silent on screen.** The meter should flash.
9. **Research is a flat list.** Era 1's whole point is two tracks, symbolic and connectionist. Group by track.

## Scores

Aesthetics 8 (winter, cards, transition blurb). Interactivity 8 (keyboard, nudging, swipe feedback). Delight 7 (cards and winter; the Dissolve glyphing exists but hasn't been seen by a person yet). Educational 8 (unchanged; the track grouping will help Era 1).

## Actions

7, 8, 9 above, this cycle.
