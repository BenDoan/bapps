# bapps

This repo contains a series of small js+html only web-apps. Each app is an <name>.html file at the top-level of the repo.

### Hosting

The repo is hosted via github pages.

### Tests

The Playwright happy-path suites exercise every app in a real Chromium browser.
Node.js 22 or newer is recommended. From the repository root:

```sh
npm ci
npx playwright install chromium
npm test
```

On Linux, use `npx playwright install --with-deps chromium` if browser system
dependencies are missing. To use an existing Chromium installation instead:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test
```

Run one suite with `npm test -- tests/timer.spec.js`, use `npm run test:ui` for
interactive runs, or open the last HTML report with `npm run test:report`.
The test runner starts and stops its own local server on port 4173, including
the extensionless routes used by GitHub Pages. No production build is needed.

| Suite | Happy paths |
| --- | --- |
| App directory | Search, links to every app, and navigation back home |
| Stopwatch | Start, stop, resume, and reset |
| Timer | Custom duration, pause, resume, reset, completion, and restart |
| Pomodoro | Work controls, break transition, completed history, persistence, and deletion |
| Epoch converter | Seconds, milliseconds, and the live current time |
| URL encode/decode | Unicode encoding, swapping, decoding, and clipboard output |
| Word to phone | Mixed case, every keypad group, spaces, and clipboard output |
| Cron parser | Weekday schedules, a preset, descriptions, and the next ten runs |
| SVG converter | Paste/upload, scaling, aspect ratio, rendered pixels, and real PNG/JPEG downloads |
| GitHub HTML renderer | Branch listing, iframe rendering, file selection, compare URLs, and clear |
| Gauntlet tracker | Upload, chart statistics, derived fish counts, sharing, demo data, filtering, and reset |
| City climate comparison | City selection, swap, scores, unit persistence, rankings, and filtering |

Tests use fresh browser contexts, UTC/en-US dates, and a controlled clock for
time-sensitive behavior. GitHub API responses are fixtures; live third-party
requests (including analytics) are blocked. Uncaught page errors fail the test.
These are happy-path regression tests, not exhaustive validation or visual tests.
When adding an app, add its suite and update the app list in `tests/index.spec.js`;
the directory test checks that every top-level app has a matching suite.

GitHub Actions runs `npm ci`, installs Chromium, and executes the suites on pull
requests and pushes to `main`. Its Playwright report is retained for 14 days;
failed tests include screenshots and traces in the report. Generated reports,
downloads, and dependencies are ignored by Git.

