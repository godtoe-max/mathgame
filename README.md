# Lilly’s Little Wilds — Math World Map

A teaching-first math game for Lilly, with Maggie Jr. as her companion. The main screen is a connected map of numbered animal levels, inspired by the progression of a classic world-map platform game.

## Play locally

Run `node serve.cjs`, then visit http://localhost:4173. Stop with Ctrl+C. Use the same address/browser to keep saved progress. Opening index.html directly also works, although file-based browser storage varies.

## How the path works

1. **Addition Meadow** — counting strategies, place value, regrouping and missing totals.
2. **Subtraction Woods** — counting back, differences, regrouping and missing amounts.
3. **Multiplication Sands** — equal groups, times-table strategies and missing factors.
4. **Division Gardens** — fair sharing, related facts and larger divisions.

Each world has twelve numbered levels (48 total). Click an available marker to enter its animal task. Learn a strategy, practice together, then try independently. Regular levels require five tasks and two independent successes. The final checkpoint in each world requires seven tasks and three independent successes: 248 tasks across the full route. Hints and mistakes never cost stars. The next marker opens when the current level is clear; all twelve levels open the next math world. Cleared levels remain available for practice.

The difficulty setting chooses the starting arithmetic tier; later levels grow harder. Higher tiers include four-digit addition/subtraction, multiplication factors up to35, and exact division totals up to1200. Later tasks include two steps. Worked examples, optional complete hints and place-value counters help Lilly learn the methods.

Math Challenge is always available. Clearing the entire path opens Number Trail, Lantern Shop, and Fair Share Picnic. These games repeat without timers and save their scores.

## Topic progression

Addition covers counting on, making ten, doubles, tens/ones, regrouping, three collections, hundreds, crossing a hundred, missing addends, two-step plans, review, and a checkpoint.

Subtraction covers counting back, crossing ten, comparing collections, tens/ones, regrouping, taking from a hundred, larger collections, crossing zeroes, missing amounts used, missing starting amounts, restocking, and a checkpoint.

Multiplication and division build equal-group understanding through2,5,10,3,4,6 and9, then larger numbers, missing factors/group counts, two-step tasks and checkpoints.

## Saved progress

Progress stays in browser localStorage under lilly-little-wilds-v1. The expanded math map has its own version3 progress record, separate from old adventure quests. On the first upgrade from an adventure or version1 map save, the new path starts uncleared; stars, learned strategies and the historical adventure records stay saved. This prevents an old Bunny quest from automatically clearing the first map level. Genuine version2 map progress from the shorter path is carried forward: each old world’s three levels map to its first three expanded levels. Completed levels stay cleared and partial work stays partial. Version3 saves keep their level records and taught strategies. Future math worlds open once their preceding worlds are clear. Reset clears local progress after confirmation. Changing difficulty keeps cleared levels.

## Files

- index.html/style.css: world-map screen, mission preview, teaching dialogs and games.
- path.js: forty-eight ordered levels, four world gates, old-save migration and animal identities.
- curriculum.js: 48 topic profiles, constrained problem generators, worked examples and targeted hints.
- map.js: level-marker rendering and Lilly/Maggie movement between markers.
- app.js: saved progress, level teaching and completion flow.
- math.js/lessons.js: arithmetic generation, mastery rules and worked strategies.
- story.js: reusable animal tasks and their saved progress; its old chapter gate functions are retained for historical data/tests and do not control the map.
- arcade.js: endless challenge and three repeatable games.
- world.js and *-v1 files: retained former adventure implementations, excluded from the current runtime.

## Verification

Run these local checks:

`node math.test.cjs`
`node story.test.cjs`
`node path.test.cjs`
`node curriculum.test.cjs`
`node app.test.cjs`

Browser checks require Playwright and Microsoft Edge, with the local server running. Set PLAYWRIGHT_MODULE to an installed Playwright module path if necessary:

`node browser.test.cjs` (runs path.browser.test.cjs)
`node migration.browser.test.cjs`
`node layout.browser.test.cjs`
`node package.test.cjs` (after build)

The path acceptance test plays all forty-eight levels /248 tasks, all world gates, compound hints, partial progress after reload, counters, endless challenge, repeated hardest minigames, harder settings, replay, reset, and phone layouts. Migration checks cover both old adventure saves and previously imported map saves, proving the first level starts uncleared and earned map completion persists. Desktop/phone screenshots are written under tests/artifacts. The original arithmetic suites cover4800 generated one/two-step cases. Curriculum checks cover9600 additional problems and worked examples, including missing numbers and checkpoints. Previous free-roaming browser checks are archived under tests/legacy for reference and do not apply to this navigation.

## Local package

Run `node build.cjs` to refresh dist with runtime files and the six illustrations. Tests, documentation and historical implementations are excluded. The build output is generated locally and is not committed.

Maggie’s profile walking pose remains an acknowledged art refinement; existing sprites are preserved.
