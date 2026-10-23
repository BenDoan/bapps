const { test: base, expect } = require('playwright/test');

const test = base.extend({
  // Keep analytics and live third-party services out of the test run. Tests that
  // need GitHub responses register specific fixtures after this catch-all route.
  isolatedPage: [async ({ page }, use) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route(/^https?:\/\//, route => {
      return new URL(route.request().url()).origin === 'http://127.0.0.1:4173'
        ? route.continue()
        : route.abort();
    });
    await use();
    expect(errors, 'No uncaught browser errors').toEqual([]);
  }, { auto: true }],
});

async function freezeClock(page) {
  const time = new Date('2026-01-05T08:00:00Z');
  // Install just before the target so setup time cannot put pauseAt in the past.
  await page.clock.install({ time: new Date(time.getTime() - 1000) });
  await page.clock.pauseAt(time);
}

module.exports = { test, expect, freezeClock };
