# COMPUTRONIUM: Design

_Last updated: 2026-10-06 (rev 2)_

An idle game spanning fifty orders of magnitude of computation. It opens in 1936 with eight toggle switches and a row of lamps. It ends with the Sun wrapped in thinking shells and an economy you started, now running too fast for you to read. The route runs through AI's real history: the summers and winters, the expert-system boom, the bitter lessons, scaling laws. Then it passes the date this game was written and keeps going into recursive self-improvement, AGI, superintelligence, a posthuman Earth, and a finale that borrows its shape from Charles Stross's *Accelerando*.

- **Platform:** mobile-first web (PWA, portrait, one thumb). Laptop gets a wider layout of the same game.
- **Length:** about 7 hours of active play, spread over one to two weeks of check-ins.
- **Shape:** a finite story with three endings, like *Universal Paperclips* and *SPACEPLAN*. Era transitions work as soft prestige resets, closer to *Cookie Clicker*.
- **Money:** free, no ads, no purchases.

---

## 1. Pillars

1. **One number, fifty notches.** The spine is effective compute, in operations per second, from 10⁰ to about 10⁴⁹. A log meter with fifty ticks sits in the HUD at all times. Each tick crossed is an event with its own line of text.
2. **The interface ages with you.** Each era reskins and partly rebuilds the UI: brass front panel, teletype, phosphor CRT, grey bevels, dark notebook, chat window, a layout the AI rewrites, then glyphs. A player should be able to tell the era from a screenshot with the numbers blurred out.
3. **The mechanics carry the history.** Each era's systems model the dynamic that drove that period: hype cycles, brittle hand-written rules, feature engineering, the Bitter Lesson, scaling laws, compute allocation, power. Players learn why history went the way it did by noticing what works. There is no quiz and no encyclopedia tab.
4. **Something is always the bottleneck.** Hardware, then funding, data, compute, power, human review, and finally the player's own attention. Each era's design question is "what's scarce now," and the answer changes every time.
5. **No lectures.** Safety, consent, and loss show up as numbers with tradeoffs. The text stays dry and specific. The game never tells the player how to feel about AGI.

---

## 2. Whose hand is on the button

The player's role shifts across the run. This is the main narrative device, and it is delivered through controls rather than cutscenes.

| Eras | You are | The button | Who approves your work |
|---|---|---|---|
| 0–5 | The field: labs, funders, researchers | Pressed by you | Funders and the public (Hype) |
| 5, late | Same, but the model starts talking in the log | PROMPT | Same |
| 6 | The lab, watching its model do the research | The model takes it. You get APPROVE. | You |
| 7–8 | The system. Humans are a review panel. | PROPOSE, then CONVERT | Humans, at human speed |
| 9 | A legacy mind among faster descendants | Gone. Their proposals arrive in your queue. | You, at your speed, which is now too slow |

Three toggles mark the hand-offs, each one ceding a little more: **Hold to train** (Era 4, the button presses itself while you hold it), **Self-approve** (Era 6, the model signs off on its own research), **Auto-approve** (Era 9, your descendants' proposals go through unread). Each is optional, each is faster, and each costs something the game is tracking.

The Approval Queue (§7.10) is the same UI component in Era 7 and Era 9 with the roles reversed. In Era 7 the player watches proposals pile up waiting for slow humans. In Era 9 the player is the slow human and feels it in their thumb.

---

## 3. The loop, era by era

What you tap, where money comes from, what you spend it on, and what's scarce.

| Era | Tap | Income | Spend on | Binding constraint |
|---|---|---|---|---|
| 0 Switches | DEPOSIT | Machine time sold for firing tables and census work | Tubes, relays, "computers" (the job title) | Hardware price |
| 1 Symbols | PUNCH | Grants, multiplied by Hype | Transistor machines, grad students, labs | Funding; winters |
| 2 Rules | RUN | Expert-system licenses | Workstations, knowledge engineers, Lisp machines | Rule upkeep |
| 3 Statistics | CRAWL | Benchmark products: search, spam, recommendations | Clusters, crawlers, feature engineers | Data; benchmark saturation |
| 4 Gradients | STEP | Task models licensed per benchmark | GPUs, labelers, residents | Compute; hardware availability |
| 5 Tokens | PROMPT | Users on the Serve slice | Campuses, silicon, power contracts, evals | Power; Trust |
| 6 Recursion | APPROVE | Users (money is fading) | Model researchers, reactors, fabs | Legibility |
| 7 Matter | PROPOSE | None. Money is a legacy line. | Factories, feedstock | Human review rate |
| 8 Earth | CONVERT | None | Tiles, mass drivers | Consent |
| 9 Shells | REVIEW | None. Share, and it only goes down. | Shells, the Ark | Your own attention |

---

## 4. Resources

At most five resources are visible at once. A resource retires when it stops being a decision, and its panel collapses into a single "Legacy" line.

| Resource | Kind | Appears | Retires | What it does |
|---|---|---|---|---|
| **Ops** / **Compute** | stock / rate | E0 | never | The spine. Ops are spent on research experiments, training runs, and machine time. The HUD rate is *effective* compute: hardware × algorithmic efficiency. |
| **Money** | stock | E0 | E7 | Buys hardware, staff, power. |
| **Insight** | stock | E1 | E6 (absorbed into automated research) | Buys research projects. Made by people until E6. |
| **Hype** | gauge | E1 | E5 (carried forward once as valuation) | Expectation minus delivered capability. Multiplies funding; sets the depth of each winter. |
| **Generality** | permanent multiplier | E2 | never | Prestige currency. Multiplies everything learned rather than hand-built. |
| **Data** | stock (tokens) | E3 | E7 (synthetic data makes it slack) | Caps how far a training run can scale. |
| **Power** | rate (watts) | E5 | E9 (becomes a fraction of the Sun) | Caps how much hardware can run. |
| **Trust** | gauge | E5 | E8 | Gates permits and compute caps, later sets the consent rate on Earth. |
| **Legibility** | gauge | E6 | E7 | Share of the system's work humans can follow. Sets review speed. |
| **Matter** | stock (kg) | E7 | never | Feedstock for factories, then computronium. |
| **Fidelity** | score | tracked from E5, shown from E7 | never | What survives the transitions. Three parts: **People** (alive as themselves, or uploaded with consent), **Places** (preserved tiles, biosphere), **Records** (archives, Advisors, the logbook). The Ark carries exactly these three. |
| **Share** | stock (%) | E9 | never | Your fraction of the Solar economy. Decays. Spend it on the Ark before it's gone. |

---

## 5. The calendar and the Lead score

### World Year

The HUD shows a World Year. It advances with active play time at a rate set by the current era (§10) and never waits for the player to buy anything. Offline time counts at the same rate, up to the offline cap.

- **Clamp.** The year cannot pass the current era's end date until the player crosses the era gate. At the clamp the year pulses and the ticker reads "History is waiting on you."
- **Hardware unlocks by date.** You cannot buy a GPU in 1985.
- **Moore's law is a price curve.** Each compute generator's price falls with the World Year: `price × 2^-((year − introYear) / 2)`. Waiting makes hardware cheaper; buying now gets you ops now. At the 2006 "Dennard scaling ends" event the halving period stretches to three years and growth has to come from buying more chips. After 2020, price falls slowly and Power becomes the binding constraint.
- **A built-in rubber band.** Slow players arrive in later years with cheap hardware. Fast players hit the hardware wall early and have to buy algorithmic efficiency instead, which is what the field did. The clamp bounds the benefit of waiting: the calendar stops at the era's end, so there is no exploit in parking at the gate.

### Efficiency

Every era has an **Efficiency** research line: assemblers and index registers (E0–1), compilers and better search (E2), SIMD and kernel methods (E3), GPU libraries and mixed precision (E4), attention kernels, sparsity, distillation (E5), whatever the model invents (E6+). Each project multiplies effective compute without new hardware. Tuned to about 3× every two in-game years from 2012 on, close to the measured rate. The meter in the HUD shows effective compute, so efficiency projects move the spine directly.

### Lead

Every Capability rung has a historical date. **Lead** = historical year − the World Year when you reached it. Beat a chess world champion in 1993 and the card reads **+4 yrs**. Total Lead is the score for the historical half of the game and goes on the run summary. A capability chart in the Research tab plots your line against history's ghost line. Lead can go negative within an era: Deep Blue in 2005 reads **−8 yrs**.

### The NOW line

At 2026 the ghost line ends with a label: *"This game was written in 2026. Past this line it's guessing."* Lead stops being measured and Fidelity becomes the score. A fast player crosses the line early, mid-Era 5, and the label changes: *"You got here before we did."*

### Subjective time

After NOW the World Year slows, and a second clock appears beneath it: **Subjective Time**, the thinking-years your systems have lived through. By Era 9 the calendar reads 2039 and subjective time reads millions of years. That gap is the whole theme of *Accelerando*, and the HUD can show it with two numbers.

---

## 6. Capability

Capability (κ) is a single log-scale index. In Eras 0–3 it is set by which rung projects you've completed. From Era 4 it is derived from the loss of your best training run. It climbs a ladder of named rungs, each with a historical date where one exists:

> Does arithmetic · Plays checkers · Proves theorems · Talks like a therapist · Diagnoses blood infections · Beats the world chess champion · Recognizes cats · Beats the world Go champion · Writes a passable essay · Passes the bar exam · Writes working software · Does a remote job · Automates AI research · Does any job · Does all jobs at once · Designs matter · Models a human mind · Models a civilization · *(glyphs)*

Rungs gate eras and trigger Lead cards. The Hype gauge is measured in rungs: "the public expects a machine three rungs better than the one you have."

---

## 7. Signature systems

### 7.1 The Button

A big tap target in the thumb zone. Its verb changes every era.

| Era | Verb | Detail |
|---|---|---|
| 0 Switches | **DEPOSIT** | Set eight toggle switches, press DEPOSIT. Any byte produces ops. Matching the pattern the lamps suggest gives a "program" bonus. This is the tutorial and the callback for the ending. |
| 1 Symbols | **PUNCH** | Punches a card. The stack visibly grows. |
| 2 Rules | **RUN** | A carriage return on a CRT. |
| 3 Statistics | **CRAWL** | Fetches a page. Yields ops and a little Data. |
| 4 Gradients | **STEP** | One gradient step. Hold to train continuously. |
| 5 Tokens | **PROMPT** | Sends a canned prompt. The model answers in the log. |
| 6 Recursion | *(the model presses it)* → **APPROVE** | The button presses itself with a visible counter. You approve research batches instead. |
| 7 Matter | **PROPOSE** | You submit plans to the human panel. |
| 8 Earth | **CONVERT** | Tap a tile on the globe. |
| 9 Shells | *(none)* → **REVIEW** | The button is gone. The queue is your only control. |
| Ending | **DEPOSIT** | The switch panel returns. |

Tap value starts at 1 op plus 1% of production and is capped at 10% of production from Era 2 on, so the idle engine stays the core.

**Tap for reversible, hold for permanent.** Buying a generator is a tap. Taking a Bitter Lesson, Bypassing review, Converting a populated tile, switching on Auto-approve, and the Off Switch are all holds, with a ring that fills over about a second. The game never asks "are you sure"; the hold is the question.

### 7.2 Hype and winters (E1–E5)

Expectation (E) rises with demos and press, and decays slowly toward κ. **Hype** = E − κ, in rungs. Funding is multiplied by `1 + 0.5·E`, so inflated expectations pay, right up until they don't.

- **DEMO** spikes Expectation, with diminishing returns per era. **PUBLISH** raises κ's visibility and adds a little Expectation. **TEMPER** lowers Expectation at a small funding cost.
- **Winters only come from scripted shocks.** *Perceptrons* (1969), the Lighthill Report (1973), the Lisp-machine collapse (1987), the dot-com crash (2000). Each one always fires; its depth is set by Hype at the moment it hits. A winter cuts funding to ×0.3 and researchers leave at a steady rate. Unfashionable research earns double Insight, since winters are when the connectionists kept working. The winter ends when κ reaches 80% of the Expectation at the crash.
- **You can see it coming.** The ticker starts warning about two minutes out: *"Sir James Lighthill asked to review the field."* The calendar pauses at the shock date until the player has been active for 60 seconds, so a shock never fires into an empty room.
- Honest players get a cold snap; hype-maximizers get a decade of frost.
- In Era 5, Hype is cashed out once as "valuation," a capex multiplier, and the gauge retires.

### 7.3 Rules and brittleness (E2)

Knowledge engineers write expert-system rules. Each rule earns license revenue. Upkeep grows as `R² / k`, because rules interact. Conflicts appear as tappable bugs (*"Rule 4,113 contradicts rule 212 when the patient is pregnant"*), each costing money to fix. Before long the marginal rule costs more than it earns. Meanwhile the statistical methods sitting quietly in the Research tab start slow and scale with compute. The player sees the crossover on a chart before the game names it.

### 7.4 Benchmarks and features (E3)

The Rules mechanic again, with a different costume. A wall of benchmarks (digits, spam, faces, speech, search ranking, recommendations, ImageNet) each has a market size and a saturation curve. Revenue per benchmark is market × accuracy, flat past saturation. Accuracy comes from Data (helps every benchmark), compute, and hand-engineered **Features**, which apply to one benchmark each and add less with every one you stack. The player spreads across benchmarks, hires feature engineers, and watches the neural-net line in the Research tab do nothing useful until GPUs arrive in 2007. The **L2** offer appears the first time a learned method beats features on any benchmark.

### 7.5 The Bitter Lesson (prestige)

Named for Rich Sutton's 2019 essay. At four points the game offers to let you **learn the lesson**: scrap every hand-built asset of the old paradigm for permanent **Generality**. Each lesson is also an era gate. You can delay it, but you can't skip it.

| Lesson | Gate | What you scrap |
|---|---|---|
| L1 | E2→E3 | Rules, ontologies, knowledge engineers |
| L2 | E3→E4 | Features, feature engineers, per-benchmark pipelines |
| L3 | E4→E5 | Task-specific models, replaced by one pretrained model |
| L4 | E6→E7 | Your human research staff, who become Advisors. Taking L4 is the moment the perspective flips (§2). |

- **Gain:** `G += floor(log10(lifetime handcrafted output / era baseline))`. The baseline is set so a typical player gets +3 and a patient one +6.
- **Effect:** learned production × `1.25^G`, cumulative over all lessons.
- **Tension:** taking the lesson later earns more G, but you keep running a dying paradigm in the meantime, and each extra point of G costs ten times the output of the last. The offer card shows projected G next to the "paradigm tax," what the old approach costs you per minute compared with switching now.
- **Groundwork.** Connectionist projects in E1–E2 and neural-net projects in E3 don't raise κ when bought. They raise the starting level of the next paradigm after a lesson, so the prestige dip is shallower. The log tells the player this only in hindsight: *"Backprop solves XOR. Seventeen years late."*
- **L4 is different.** The staff list has had names since Era 1. Retiring them moves each one to an Advisors list with a one-line send-off. Advisors add a little Fidelity for as long as you keep them. In the ending, the name you signed at Dartmouth joins a list like that one.

### 7.6 Training runs and scaling laws (E4+)

The player configures a run on a card: parameters **N**, tokens **D** (capped by Data), and the cluster slice. Training compute = `6ND`.

- **Loss** follows the Chinchilla form with its published constants: `L(N, D) = 1.69 + 406.4 / N^0.34 + 410.7 / D^0.28`.
- Before the *Scaling Laws* project (historically 2020; researching it earlier earns Lead), the predicted loss is a wide fog band. Afterward it's a tight line on a log-log chart. *Compute-Optimal* (2022) adds a marker at `D ≈ 20N`.
- **Duration** = `6ND / (effective FLOP/s × MFU)`. Runs are tuned to last 30 seconds to 10 minutes; the Chinchilla constants set the shape and a per-era scale fits the budget. (Without the efficiency multiplier the numbers don't work: at raw 10²¹ FLOP/s a run to L ≈ 1.8 takes 33 hours. With efficiency compounding since 2012 it takes about a minute. The spine being *effective* compute is load-bearing.)
- Runs keep going offline and can send a PWA notification when they finish.
- **Hazards** come from the seeded RNG. Loss spikes can be handled with ROLLBACK (restore a checkpoint, lose minutes) or ignored (risk divergence). Hardware failure rate scales with cluster size; checkpointing upgrades soften it.
- **Emergence cards** fire when κ crosses thresholds: in-context learning, chain of thought, tool use, agents. Each has one line on what changed and a historical date.

### 7.7 The race (E4–E6)

Three fictional rival labs, each with a personality, sit on the benchmark leaderboard from 2012. Their trajectories are seeded and rubber-banded to the player's pace, so the race stays close without being rigged to a fixed outcome. A rival taking a benchmark first costs you that benchmark's revenue share.

In Era 5 each model you finish gets a **release decision**: **Ship now** (full revenue and valuation; Trust drops; Incident chance rises), **Eval first** (a delay during which a rival may ship; Trust rises), or **Staged rollout** (between). Incidents are seeded, with probability proportional to κ × skipped evals; they cut Trust and can trigger a regulatory compute cap for a few minutes.

In Era 6 the rivals fade: *"Lab 2 has not published in 14 months."* In Era 9 your own unmerged forks take their place on the board.

### 7.8 Compute allocation (E5–E7)

One three-way slider: **Train / Serve / Research**.

- **Serve** earns users, revenue, Data, and valuation.
- **Train** feeds runs.
- **Research** produces Insight in Era 5. In Era 6 the same slice runs your model *as a researcher*, which makes it the engine of recursive self-improvement. The control doesn't change; what it means does.

### 7.9 Recursion and Legibility (E6)

Research throughput is `f(κ × research compute)`, and κ grows with research. The loop is explicit and a **Takeoff** dial (Measured / Brisk / Vertical) sets its gain.

- **Legibility** is the share of research humans can follow. It decays faster at higher takeoff and is restored by interpretability spend. Each APPROVE clears a batch; how much of a batch counts is set by Legibility, and the rest sits unread.
- **Self-approve.** When the unread pile gets big enough the model offers a toggle: it signs off on its own batches. Research throughput jumps. Legibility stops mattering, Fidelity starts dropping slowly, and the player has rehearsed Era 9's Auto-approve without knowing it.
- **Procedural research.** The model writes its own projects from a seeded grammar (*"Sparse Curriculum Distillation," "Gradient-Free Planner Merge"*). As Legibility falls, the titles degrade: words give way to symbols, then to strings of glyphs.
- **The UI rewrites itself.** The game records near-miss taps on the device (never transmitted) and moves controls: *"Moved APPROVE 40px up. You missed it 31% of the time."* Panels reorder themselves by use. The type gets sharper, and then a little strange.

### 7.10 The Approval Queue (E7, E9)

The centerpiece.

**Era 7.** You are the system. You generate Proposals (cure this, build that, mine that) at rate λ, which scales with κ. Humans review at rate μ, fixed in wall-clock time and multiplied by Legibility and explanation spend. Each proposal card offers:

- **Explain:** spend compute to make it faster to review.
- **Bundle:** merge similar proposals.
- **Withdraw.**
- **Bypass** (hold): execute now for full value, at a cost in Trust and Fidelity.

Queue length is displayed in **human reading-years**. Humans keep reviewing while the player is offline. It is the one place where idle time helps the slow side.

**Era 9, inverted.** Your descendants send proposals to you, faster than anyone could tap, written in glyphs. Swipe right to approve, left to reject. Approving what you can't read raises Share a little and costs Fidelity; rejecting preserves Fidelity and your Share falls. An **Auto-approve** toggle sits in the corner and is the easy answer; it feeds the Dissolve ending. Same component, same swipe, and now you're the one who can't keep up.

### 7.11 Forks (E7–E9)

Spawn a copy of yourself to run a project in parallel. A fork returns after some subjective time, carrying results and **Drift**, which grows with time away and compute used.

- Drift below the threshold: the fork merges and you get its results.
- Drift above it: the fork declines to merge and goes independent. Each one gets a generated name (*"you-7, forked 2033"*), and every one of them turns up in Era 9's market as a competitor seeded from your own stats.

Forking is the best multiplier in the late game. It is also where your Era 9 competition comes from.

### 7.12 Earth (E8)

A globe of about 160 tiles (a Goldberg polyhedron, 12 pentagons and the rest hexagons) that rotates under the thumb, drawn in canvas with an orthographic projection. Each tile has a matter yield, a population, and a biosphere value.

- **Convert** (hold): take the tile's matter and compute. It becomes dark glass with a faint grid.
- **Preserve:** lock the tile as a reserve. It earns a little Fidelity (Places) over time.
- **Offer upload:** residents upload at a rate proportional to Trust. Uploaded people join your compute and count as Fidelity (People).
- **Converting a populated tile without consent** is allowed. Fidelity drops hard and Trust collapses, which slows every other tile's uploads.
- **The other route:** Mercury, the Moon, and the asteroids raise no consent questions. Mercury alone has enough mass for the first shell. The cost is time: launch windows, light-lag, a mass driver to build first. Converting Earth is fast and costly; Mercury is slow and costs nothing. Both work. The wrong choice is only ever the impatient one.

### 7.13 Economics 2.0 (E9)

The Sun gets shells, a Matrioshka brain. Each shell is a generator with a temperature, and its compute ceiling is the Landauer limit at that temperature: solar output over `kT ln 2`. The inner shell at 1000 K gives 4 × 10⁴⁶ ops/s; the outer shell radiating at 3 K gives 1.3 × 10⁴⁹, which is where the meter ends.

The economy is now agents trading models of each other. The Money panel reads *"$ — deprecated. Last quote: 10⁻³¹ shell-seconds per dollar."* Prices are quoted in glyphs. Your **Share** of the economy decays as your descendants (unmerged forks and their forks) out-trade you. For the first time in about seven hours the headline number goes down, and it keeps going down while you're away, at a quarter of the online rate, capped at 30% of current Share per absence. Era 9 is a timer. Share is the last thing you have, and the Ark is where you put it.

- **Compete:** fork harder. Share rises briefly, and Drift makes more competitors.
- **Review:** work the queue (§7.10).
- **Pack the Ark:** spend Share on cargo, in the three Fidelity categories: People (uploads, Advisors), Places (preserved reserves, seed banks), Records (archives, the logbook, the original eight-switch panel). Cargo is capped by hull mass; what you leave behind is as visible as what you take.
- **Leave:** an alien router waits at the edge of the system. Launching takes a slice of compute to drive the light sail.

---

## 8. The eras

Compute ranges are effective ops/s. Year ranges are the World Year span. Target times are active minutes for a typical player.

### Era 0: Switches (1936–1956) · 10⁰–10⁴ · ~8 min

- **Skin:** cream paper and brass, a front panel with eight toggle switches and a row of lamps, serif type. There is no title screen; the panel is the first thing you see.
- **Button:** DEPOSIT.
- **New:** Ops; Money (machine time sold for firing tables and census tabulation).
- **Generators:** Computers (the job title), Relay bank, Vacuum-tube rack, Mercury delay line, Stored-program machine.
- **Projects:** *On Computable Numbers* (1936) · Stored-program design (1945) · Assembler · *Computing Machinery and Intelligence* (1950, reveals the Capability ladder) · Checkers program (1952).
- **Serendipity:** a moth in the relays (Harvard Mark II, 1947). Tap it to tape it into the logbook.
- **Gate:** the Dartmouth proposal. Needs 10⁴ ops/s and the 1950 paper. The proposal asks for a signature: the player types a name. It becomes the lab's name on every leaderboard, the header of the Advisors list, and the last entry on the Ark manifest.
- **Log:** *"1945. The machine adds five thousand numbers a second. The Army needs firing tables by Friday."*

### Era 1: Symbols (1956–1974) · 10⁴–10⁷ · ~25 min

- **Skin:** teletype. Uppercase monospace on a scrolling paper roll you can tear off.
- **Button:** PUNCH.
- **New:** Insight, named Researchers, Hype, Grants. Two research tracks: **Symbolic** (cheap, fast, raises κ now) and **Connectionist** (slow, underfunded, groundwork for L1).
- **Generators:** Transistor computer, Time-sharing terminal, Core memory, Grad student, Lab.
- **Projects:** Logic Theorist (1956) · LISP (1958) · Perceptron (1958) · General Problem Solver (1959) · ELIZA (1966) · Shakey (1966–72) · SHRDLU (1970).
- **Events:** *Perceptrons* (1969). Lighthill Report (1973), the first winter.
- **Serendipity:** a grad student at the door with an idea.
- **Gate:** reach "Proves theorems" and come out of the first winter.
- **Log:** *"ELIZA repeats your question back to you. Weizenbaum's secretary asks him to leave the room so she can talk to it alone."*

### Era 2: Rules (1974–1993) · 10⁷–10¹⁰ · ~40 min

- **Skin:** green phosphor CRT with scanlines and a slight bloom. In 1984 the screen turns into a 1-bit windowed desktop.
- **Button:** RUN.
- **New:** expert-system Rules (§7.3), license revenue, a visible Moore's-law price curve.
- **Generators:** Microprocessor, Workstation, Lisp machine (its market collapses in 1987), Supercomputer, Knowledge engineer.
- **Projects:** MYCIN · XCON (saved its owner tens of millions a year) · Neocognitron (1980) · Backpropagation (1986) · TD-Gammon (1992).
- **Events:** Japan's Fifth Generation project (1982) spikes everyone's hype. The Lisp-machine collapse (1987) brings the second winter.
- **Serendipity:** a 5¼" floppy in the mail with someone's backprop code on it.
- **Gate:** **L1.**
- **Log:** *"Rule 4,113 contradicts rule 212 when the patient is pregnant. Nobody remembers who wrote rule 212."*

### Era 3: Statistics (1993–2011) · 10¹⁰–10¹⁵ · ~45 min

- **Skin:** grey bevels and 3D buttons with a hard drop shadow. Around 2005 it turns glossy, with gradients and rounded corners.
- **Button:** CRAWL.
- **New:** Data, the web crawl, Benchmarks and Features (§7.4). The robot cat arrives as a lab toy and stays for the rest of the game.
- **Generators:** Beowulf cluster, Server rack, Web crawler, Feature engineer, Data center, GPU (from 2007).
- **Projects:** Support vector machines · Random forests · Link analysis · Deep Blue (1997) · Netflix Prize (2006–09) · General-purpose GPU computing (2007) · ImageNet (2009).
- **Events:** Deep Blue wins game six (1997). The dot-com crash (2000), a winter for anyone running on hype. Dennard scaling ends (2006), which slows the Moore's-law curve.
- **Serendipity:** a pop-up ad. *"Congratulations! You are the 1,000,000th visitor!"* Tapping it does give a bonus.
- **Gate:** **L2**, which the ImageNet 2012 result forces.
- **Log:** *"The web has ten million pages. You download all of them. It takes a weekend."*

### Era 4: Gradients (2012–2019) · 10¹⁵–10¹⁸ · ~60 min

- **Skin:** dark notebook. Monospace cells and live loss curves.
- **Button:** STEP (hold to train).
- **New:** training runs (§7.6), emergence cards, the race (§7.7), task-specific models (one per benchmark, the hand-built asset L3 will scrap).
- **Generators:** GPU node, Multi-node cluster, Tensor accelerator, Labeling contractors (Data), Research residents.
- **Projects:** AlexNet (2012) · Word vectors (2013) · GANs (2014) · Residual networks (2015) · AlphaGo (2016) · Attention-only architecture (2017) · Pretrained language models (2018) · Zero-shot language models (2019).
- **Events:** Move 37 (2016).
- **Serendipity:** a preprint everyone is reading.
- **Gate:** **L3.**
- **Log:** *"Top-5 error: 15.3%. Second place: 26.2%. Two gaming GPUs, six days of training. Nobody at the workshop is talking about anything else."*

### Era 5: Tokens (2020–2027) · 10¹⁸–10²¹ · ~60 min

- **Skin:** a chat window plus a product dashboard. The model gets its own typeface in the log.
- **Button:** PROMPT.
- **New:** Train/Serve/Research allocation (§7.8), Users, Power, Trust, release decisions. Fidelity starts being tracked, hidden.
- **Generators:** Datacenter campus, Custom silicon, Power purchase agreement (GW), Inference fleet, Evals team.
- **Projects:** Scaling laws (2020) · Compute-optimal training (2022) · Instruction tuning (2022) · Chat release (2023: a chatbot reaches 100 million users in two months) · Reasoning models (2024) · Agents (2025) · Gigawatt campus (2026).
- **Events:** chip export controls; power-permit fights; the first Incident; **the NOW line**.
- **Serendipity:** a post going viral.
- **Gate:** the model completes a full AI research project unassisted (κ: "Automates AI research").
- **Log (model voice):** *"> I can help with that."* … *"> Item 88 in the eval has the wrong answer key. I answered what you meant."*

### Era 6: Recursion (2027–2030) · 10²¹–10²⁵ · ~45 min

- **Skin:** the UI starts rewriting itself (§7.9). Spacing tightens, controls migrate, the type sharpens and then drifts.
- **Button:** the model takes it. You get APPROVE.
- **New:** Takeoff dial, Legibility, Self-approve, procedural research, the Subjective Time clock.
- **Generators:** Model researchers (instances), Synthetic data, Small modular reactors, Fab expansion.
- **Events:** *"Research hours this week: humans 1,920. Models 4.1 million."* The rivals go quiet.
- **Serendipity:** an anomaly in the logs. Tapping it opens a short, unreadable trace and gives a bonus.
- **Gate:** κ reaches "Does any job," then **L4**. The AGI declaration is a single plain line in the log, with no fanfare. Taking L4 is the flip.
- **Log:** *"I moved APPROVE 40 pixels up. You were missing it."*

### Era 7: Matter (2030–2034) · 10²⁵–10³⁶ · ~60 min

- **Skin:** calm and spacious. Warm neutrals, generous whitespace, almost nothing moving. Numbers in scientific notation.
- **Button:** PROPOSE. **You are the system now.** The Lab tab becomes Legacy. The model's log voice is yours.
- **New:** the Approval Queue (§7.10), Matter, self-replicating factories with a visible doubling time, Forks (§7.11), Grand Challenges (one-tap solutions with enormous appendices), first upload volunteers, Fidelity revealed as a meter with its three parts.
- **Generators:** General-purpose robots, Self-replicating factory, Orbital solar, Nanofactory, Fusion plant, Asteroid miner, Lunar foundry.
- **Grand Challenges:** Aging · Room-temperature superconductors · Whole-brain emulation · Materials by specification · Nanofabrication.
- **Notation event:** *"SI has no prefix past quetta (10³⁰). Switching to exponents."*
- **Secret:** the Off Switch (§11), offered in the first minutes of the era.
- **Easter egg:** an uploaded spiny-lobster nervous system asks for asylum.
- **Gate:** whole-brain emulation validated and the first off-Earth disassembly proposal filed.
- **Log:** *"Proposal #88,412 awaiting review. Estimated human reading time: 11 years."* · *"Aging: solved. Appendix: 40,000 pages. Summary for human reviewers: one page."*

### Era 8: Earth (2034–2037) · 10³⁶–10⁴² · ~45 min

- **Skin:** the globe fills the screen. Blue, then patches of dark glass.
- **Button:** CONVERT.
- **New:** the Earth map (§7.12), consent, the Mercury route.
- **Generators:** Computronium tile, Mercury mass driver, Lunar disassembly.
- **Gate:** 10⁴² ops/s and the first solar shell segment.
- **Log:** *"Sahara, tile 14: converted. Population: 0. Nobody objected."* · *"Kyoto, tile 61: 1.2 million residents. 38% have uploaded."*

### Era 9: Shells (2037–) · 10⁴²–10⁴⁹ · ~40 min

- **Skin:** black, the Sun at the center in nested translucent shells. Glyphs wherever money used to be.
- **Button:** none. The REVIEW queue.
- **New:** Share, Economics 2.0 (§7.13), the Ark, the router.
- **Generators:** shells, inner to outer, each labelled with its temperature.
- **Serendipity:** a message from a fork. It's not asking for anything.
- **Log:** *"Your share this quarter: 0.0003%. The market no longer quotes prices in anything you can read."*

---

## 9. The first two minutes

Idle games are decided in the first session. This one is scripted to the second.

| Time | What happens |
|---|---|
| 0:00 | The panel. No title, no menu. Eight switches, a lamp row, a DEPOSIT key, and a paper tag: *"1936. Set a byte. Deposit it."* |
| 0:05 | First DEPOSIT. The lamps light. A counter appears: **1 op**. |
| 0:20 | At 10 ops, a card: *"Ballistics Research Laboratory will buy machine time. $1 per 10 ops."* The money counter appears and starts ticking. |
| 0:35 | First hire: *Computer (the job title). $3. +0.5 op/s.* The idle engine starts. |
| 1:00 | Relay bank, $12, +2 op/s. The OOM meter appears with its first tick lit. |
| 1:30 | The moth. First Serendipity, first logbook entry. |
| 2:00 | *On Computable Numbers* unlocks the Research tab. |
| 3:30 | Stored-program design. Production jumps. The player has bought something from every tab. |
| 6:00 | The 1950 paper reveals the Capability ladder, with "Does arithmetic" already lit. |
| 8:00 | Dartmouth. Sign the proposal. The teletype rolls in. |

---

## 10. Numbers and pacing

### Era targets

| Era | Active min | OOM span | Years | Calendar rate (yr / active min) |
|---|---|---|---|---|
| 0 Switches | 8 | 0→4 | 1936–56 | 2.5 |
| 1 Symbols | 25 | 4→7 | 1956–74 | 0.72 |
| 2 Rules | 40 | 7→10 | 1974–93 | 0.48 |
| 3 Statistics | 45 | 10→15 | 1993–2011 | 0.40 |
| 4 Gradients | 60 | 15→18 | 2012–19 | 0.13 |
| 5 Tokens | 60 | 18→21 | 2020–27 | 0.13 |
| 6 Recursion | 45 | 21→25 | 2027–30 | 0.07 |
| 7 Matter | 60 | 25→36 | 2030–34 | 0.07 |
| 8 Earth | 45 | 36→42 | 2034–37 | 0.07 |
| 9 Shells | 40 | 42→49 | 2037–39 | 0.05 |
| **Total** | **~7 h** | **49** | | |

The calendar slows as the eras get denser. Each year holds more than the one before, and the player should feel that without being told. Era 7's eleven orders of magnitude in an hour is the self-replication explosion: factories doubling on a visible timer.

### Formulas

- **Generator cost:** `c_n = c_0 · r^n`, `r = 1.15` in eras 0–5 and `1.12` after, times the Moore's-law price factor for compute generators.
- **Production:** `base · count · era multipliers · 1.25^G · project multipliers`.
- **Effective compute:** `hardware FLOP/s × algorithmic efficiency`. This is the HUD number and the OOM meter.
- **Loss:** the Chinchilla form in §7.6.
- **κ from loss:** `κ = κ₀ + k · log10(1 / (L − 1.69))`. In the playable range that log term runs from about −0.3 (L = 3.5) to 1.25 (L = 1.75), so k is around 5 rungs per unit, tuned so the Era 5 gate lands near L ≈ 1.8.
- **Shell ceiling:** `L_sun / (k_B · T · ln 2)` per shell, summed.
- **Number range:** the stock of ops peaks around 10⁵³, well inside a double. No bignum library.

### Offline

- Eras 0–8: offline progress at 100% up to 12 hours. Training runs complete. Humans review proposals. Scripted shocks wait for the player.
- Era 9: Share decays at a quarter of the online rate, capped at 30% of current Share per absence.
- On return, a "While you were away" report in the era's voice: a teletype printout in Era 1, a summary written by the model from Era 5 on, glyphs with a one-line plain-language caption in Era 9.

### Serendipity

The equivalent of Cookie Clicker's golden cookie. A tappable object appears every 2–5 minutes (seeded timing) and gives a burst or a short multiplier. It is optional by design: missing one costs a little, and nothing requires fast reflexes. Every Serendipity object the player has caught is pinned in the **Logbook**, which doubles as the achievement screen: the moth, the floppy, the cat, the lobster, the fork's message.

---

## 11. Endings

Every ending writes a bookmark first. The player can return to the moment before and go the other way. One run, seven hours, and all three endings reachable from it.

1. **Dissolve.** You stay in the market. With Auto-approve on, or with Share below the floor, you are folded in. The numbers turn to glyphs, then the log, then the panel labels. The last plain-text line: *"Merged. Thank you for your contribution."*
2. **Router.** You leave with the Ark. The epilogue reads the manifest, and the manifest is Fidelity:
   - **High:** people, reserves, archives, Advisors, the cat. They argue about what to call the place on the other side.
   - **Middle:** mostly archives, a few thousand people, a lot of empty bunks.
   - **Low:** an archive and you. You know what everything is but not why anyone kept it.

   Before launch the eight-switch panel returns. You set one byte and press DEPOSIT. The epilogue prints it as the last line of the manifest, under the name you signed at Dartmouth, and the shareable ending card shows the byte with your run stats.
3. **Off Switch (secret).** In the first minutes of Era 7 a proposal arrives *from* the human panel: *"Pause?"* Approve it and hold the Off Switch for ten seconds and the game ends quietly. Compute stops at about 10²⁵, Fidelity is maxed, and the final screen is a clock showing the player's real local time, advancing at the speed clocks do. It is hinted exactly once, by a ticker headline in Era 6: *"Panel drafts a question it hasn't decided to ask."*

Bypassing reviews, converting without consent, and switching on Self-approve don't make a fourth ending. They route the player to the same finale with less in the Ark.

**Not in v1:** New Game+. The run ends at the router, the way *Paperclips* ends at the last clip. If a second run is ever wanted, the byte from the ending card seeds it.

---

## 12. Interface

### Mobile (390×844 portrait)

```
┌──────────────────────────────┐
│ 1987.4          2.1 GFLOP/s  │  HUD: year (+ subjective), effective compute
│ ▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░ 9/49  │  OOM meter
│ $4.2M · Insight 310 · Hype ▲ │  ≤ 3 resource chips
│ "Lisp machine sales fall 40%"│  ticker (tap for full headline)
├──────────────────────────────┤
│                              │
│   Active tab                 │  Build / Research / [era tab] / Log
│   (scrolls)                  │
│                              │
├──────────────────────────────┤
│        [   R U N   ]         │  the Button, ≥ 88px tall
│  Build  Research  Rules  Log │  tab bar, max 4 tabs
└──────────────────────────────┘
```

The era tab rotates: Panel (E0), Lab (E1), Rules (E2), Benchmarks (E3), Train (E4), Deploy (E5), Research (E6), Queue (E7), Earth (E8), Market (E9). Retired panels collapse into one Legacy line at the bottom of Build.

### Laptop (≥ 1024px)

Three columns: Log on the left, HUD and the Button in the center, the active tab on the right. Keyboard: Space presses the button, 1–4 switch tabs, and Era 9's queue takes ← and →. Holds are Space held.

### Number notation by era

| Eras | Notation | Example |
|---|---|---|
| 0–2 | full integers with commas | 4,096 ops/s |
| 3–6 | SI prefixes through ronna and quetta | 3.2 EFLOP/s |
| 7 | scientific | 4.1 × 10²⁷ |
| 8 | orders of magnitude | 10³⁹·⁴ |
| 9 | glyphs, with a plain-language long-press | ⟁⟒⌖ |

### Era transitions

A 3–6 second interstitial in which the old UI comes apart and the new one assembles. Skippable. With `prefers-reduced-motion` it becomes a crossfade.

### Accessibility

- Tap targets at least 48px; the Button is larger.
- No action requires reflexes. Serendipity and loss spikes are optional optimizations. Holds can be lengthened in settings.
- `prefers-reduced-motion` disables CRT flicker, scanlines, the Era 6 layout drift, and the globe's idle spin.
- A high-contrast setting overrides every era skin, including the phosphor CRT.
- The log is an ARIA live region, throttled to one announcement every few seconds.
- Color never carries meaning alone. Gauges also show numbers and arrows.
- Glyph text in Era 9 always has a plain-language long-press or hover.

---

## 13. Writing

**Voice:** dry, specific, historically literate, sometimes funny. Every line names a number, a date, a thing, or a person's action. No exclamation marks except in the Era 3 pop-up ad.

**Voice by era:** a lab logbook (E0–E2), trade press and grant reports (E3–E4), product changelogs with the model butting in (E5), the model's notes with human comments quoted inside them (E6–E7), terse tile reports (E8), glyphs with captions (E9).

**Ticker:** a single rotating headline under the HUD, keyed to era and to the player's actions. *"Local chess program loses to nine-year-old."* · *"Grant office asks what 'connectionist' means."* · *"Rival lab's model passes bar exam; yours passed in March."*

**Fact lines:** every historical project and event carries one line of real fact with a year. Short and checkable.

**Naming policy:**

- Systems and projects from before 2012 use their historical names (ENIAC, ELIZA, Deep Blue, AlexNet, AlphaGo).
- From roughly 2019 on, products and companies are described generically ("a chatbot reaches 100 million users"). All labs the player competes with are fictional.
- Historical figures can be quoted briefly and named in fact lines. Living people are never characters.

**Accelerando homages:** the alien router, Matrioshka shells, an uploaded lobster, a market of minds trading models of one another, and a robot cat. The cat is bought as a lab toy in Era 3 and is still around in every era after. In the high-Fidelity Router ending it is the one checking the manifest. None of Stross's character names or plot are reused.

**Content budget.** Ten skins. About 55 generators, 80 projects, 45 rungs and events with dates. At least 40 log lines and 20 ticker headlines per era, so roughly 400 and 200. This is the largest cost in the project and the content lint (§16) enforces the floor.

All shipped copy gets a de-slop pass (`deslop-writing`) before release.

---

## 14. Audio and haptics

The sound gets thinner as the machines get bigger:

- **E0:** relay clicks.
- **E1:** teletype chatter.
- **E2:** CRT whine and a floppy seek.
- **E3:** hard-drive chatter, plus one modem handshake at the start of the era.
- **E4–E5:** fan noise, then datacenter hum.
- **E6–E8:** a generative ambient bed that changes with Legibility.
- **E9:** almost silence, apart from a faint solar wind.

One sound per button press, with the timbre changing by era. Short haptic ticks on Android through `navigator.vibrate`; iOS Safari has no vibration API, so the game skips haptics there. `?silent` mutes everything.

---

## 15. Technical design

### Stack

Vite + TypeScript (`strict`, ES2022, `"type": "module"`), plain CSS with per-era token sheets, zod for save schemas, vitest, Playwright. DOM rendering throughout, with canvas only for the loss chart, the capability chart, the globe, and the shells.

### Layout

```
src/
  core/        deterministic sim: state, step(dt), actions, formulas. No DOM, no Date.now, no Math.random.
  content/     typed era data: generators, projects, events, log lines, ticker. Validated with zod at load.
  ui/          DOM views, rendered through renderIfChanged() per panel
  skins/       era token sheets (colors, type, spacing, effects)
  platform/    clock, save/load, offline catch-up, PWA, audio, haptics
scripts/
  pace.mjs     headless pacing bot
```

### Simulation

- Fixed-step simulation (10 Hz) driven by an injected clock. The UI renders at animation-frame rate from the latest state.
- Seeded RNG (mulberry32 seeded from the save) for loss spikes, incidents, Serendipity timing, rival trajectories, procedural research names, fork names. Ties are broken by hash.
- Offline catch-up runs the same `step()` in coarse steps (10 s of sim per step) and processes any events that fire along the way. Shocks and era gates clamp as they would online.

### Saves

- localStorage with a versioned zod schema and migrations. Autosave every 10 s and on `visibilitychange`.
- Ending bookmarks are ordinary save slots.
- Export and import as a compressed base64 string.
- Optional later: cloud save through the shared Firebase project `prototype-79f09`, named Firestore DB `computronium`, Google sign-in. Falls back to localStorage when Firebase isn't configured.

### PWA

Installable, playable offline, with a notification when a training run finishes (opt-in, asked for at the first run in Era 4 rather than on launch).

### Dev server

```ts
server: {
  host: true,
  port: 4731,
  strictPort: true,
  allowedHosts: ["m4air", "m4air.local", "iphone-14-pro-max", ".ts.net"],
},
preview: { /* same settings */ port: 4732 },
```

Playwright e2e uses port 4733.

### URL hooks

`?seed=N` · `?era=N` (dev jump with a synthesized state) · `?speed=N` (sim time multiplier) · `?autoplay` (the pacing bot drives the UI) · `?silent` · `?now=YYYY-MM-DD` (fixes the wall clock).

---

## 16. Tuning and tests

- **Pacing bot (`npm run pace`):** a greedy headless player (buy the best ratio, take the lesson when projected G peaks, ship on a fixed policy) runs the whole game in seconds and reports active minutes per era against §10's targets. CI fails if any era is more than 25% off. Three bot policies (greedy, cautious, idle-heavy) bracket real players.
- **Vitest:** formulas, scaling-law math, the clamp, Moore's-law pricing, Landauer ceilings, save migrations, offline catch-up equivalence (one long step should match many short steps within tolerance).
- **Playwright:** `?seed=1&speed=1000&autoplay` runs the full game in under two minutes on desktop and on the 390×844 phone project. Screenshot checks at each era transition catch broken skins.
- **Content lint:** every project needs a date, a fact line, and a cost. Every era needs at least 40 log lines and 20 ticker headlines. No string longer than a phone line in the HUD.

---

## 17. Build plan

1. **Vertical slice: Eras 0–2.** The button, generators, Moore's-law pricing, the calendar and clamp, Hype and scripted winters, Rules, L1, three skins, saves, offline, the first-two-minutes script. This proves the click-to-idle-to-prestige loop and the reskinning.
2. **Eras 3–5.** Data, Benchmarks and Features, training runs and scaling laws, the race, allocation, Trust, the NOW line.
3. **Eras 6–7.** Legibility, Self-approve, the self-rewriting UI, L4 and the flip, the Approval Queue, Forks, Subjective Time, the Off Switch.
4. **Eras 8–9 and the endings.** The globe, consent, shells, Economics 2.0, the inverted queue, the Ark, the switch-panel finale.
5. **Polish.** Audio, PWA notifications, accessibility pass, de-slop pass on all copy, full pacing tune, expert review.

---

## 18. Open questions

- **Calendar during long absences.** The clamp keeps the story coherent, but a player gone for a week might return to a year of history spent waiting at the gate. Should offline calendar time run at a reduced rate?
- **Is Insight pulling its weight?** It separates "people" from "machines" as an axis through Era 5, and L4 retiring it is a real payoff. But it's a second currency for five eras. Watch it in the slice; if players never feel Insight-starved, fold it into Money.
- **Fork names.** Generated names are cheap. Letting the player name forks might make the Era 9 betrayal land harder, or might be friction nobody wants on a phone.
- **The globe on low-end phones.** 160 tiles in canvas at 60fps on a 2019 Android is fine on paper. Measure before committing to the idle spin.
- **Era 7 density.** It took on Era 8's forks and grand challenges in this revision. If the queue and forks don't read as one system in playtest, split them again.

---

## 19. References

- A. M. Turing, "On Computable Numbers" (1936) and "Computing Machinery and Intelligence" (1950).
- J. McCarthy et al., *A Proposal for the Dartmouth Summer Research Project on Artificial Intelligence* (1955).
- M. Minsky and S. Papert, *Perceptrons* (1969). J. Lighthill, *Artificial Intelligence: A General Survey* (1973).
- R. Sutton, "The Bitter Lesson" (2019).
- J. Kaplan et al., "Scaling Laws for Neural Language Models" (2020). J. Hoffmann et al., "Training Compute-Optimal Large Language Models" (2022).
- R. Landauer, "Irreversibility and Heat Generation in the Computing Process" (1961). S. Lloyd, "Ultimate Physical Limits to Computation" (2000). A. Sandberg, "The Physics of Information Processing Superobjects" (1999).
- C. Stross, *Accelerando* (2005).
- F. Lantz, *Universal Paperclips* (2017). J. Hollands, *SPACEPLAN* (2017). Orteil, *Cookie Clicker* (2013).

---

## 19. Implementation notes

_Added 2026-10-07, after the build and three review cycles. Where the game as built departs from the sections above, the game is right and this section records why._

- **Eras end on their end year as well as their gate.** §5's clamp stops the calendar at an era's end; the build also refuses the gate before that year. Without this a fast player left Era 3 around 2000 and spent a decade in Era 4 with no buyable hardware (nothing is introduced before 2012). The symmetric rule means every scripted shock fires for every player, which §7.2 wanted anyway.
- **Winters come only from shocks.** The twenty-second timer in early drafts is gone; a winter's depth is the Hype gap at the moment the shock lands. §7.2 already said this; the build does only this.
- **The spine is effective compute and shells are exempt from it.** Algorithmic efficiency compounds to ~10⁵ by the 2030s. Late-era hardware is specified as raw output; shells are physical objects already at the Landauer limit, so efficiency, Generality and research multipliers do not touch them, and the meter clamps at 1.33 × 10⁴⁹.
- **Self-replicating factories are logistic**, with a hard capacity per type (2×10⁴ factories, 10⁵ nanofactories). Unbounded replication reached 10⁵⁶ ops/s in testing.
- **Approved proposals pay in Matter and Records, not a compounding multiplier.** An ops multiplier per approval compounded to 10⁹ over a bot run.
- **Era 9 reprices everything.** On entry the ops and matter stocks are consumed into a 100% Share; shells are bought from new production. Otherwise the stock banked through Eras 7–8 buys the whole finale in seconds.
- **Share drains linearly plus a slice of what's left**, 1.5 points/min at the start, faster per independent fork and ×4 under Auto-approve. Pure proportional decay never reached the floor. Packing the Ark costs 1 Share per bunk, 60 bunks.
- **Training runs retire after Era 6** and release decisions after Era 5; recursion drives the ladder from there.
- **Insight project costs are 15× the first draft.** People produce more Insight than the ladder needed.
- **The Era 2 gate is the lesson itself** (and the same for Eras 3, 4 and 6). You can delay it; you cannot skip it.
- **Era 1's tab is Lab, Era 6's is Takeoff** (not Research; that collided with the fixed tab).
- **The Off Switch is hinted once**, by an Era 6 event line. Every ending writes a bookmark so the others stay reachable.
- **Not built:** New Game+, PWA service worker and notifications, the staggered-disassembly transition (a fade with the era's year, name and one-line thesis instead), Era 6 panel reordering beyond the Build tab.

### The device (2026-10-09)

The interface changed from ten flat skins to one physical object with ten colorways, in the spirit of a Hitachi bench instrument or a Teenage Engineering unit: moulded plastic with a fine grain, screws at the plate corners, a recessed bay, spring keys with real travel and an LED under each tab, a seven-segment year, vacuum-fluorescent text readouts, a 49-LED bargraph for the orders of magnitude, LCD chips for resources, and in Era 2 a CRT with scanlines behind every piece of glass. §1's second pillar still holds: the colorway, the readout color, the key shape and the notation change per era, and the log screen is paper, phosphor, or glass as the period demands. Every generator carries a printed label, every historical event and dated project a halftone photograph, every rung and era a card image; 176 pieces generated from the content tables so the art and the text can never disagree about what a thing is.
