const { test, expect } = require('./fixtures');

for (const [format, timestamp] of [['seconds', '1704067200'], ['milliseconds', '1704067200000']]) {
  test(`convert ${format} to a readable UTC date`, async ({ page }) => {
    await page.goto('/epoch');
    await page.locator('#epochInput').fill(timestamp);
    await expect(page.locator('#formatBadge')).toHaveText(`Detected: ${format}`);
    await expect(page.locator('#resultValue')).toContainText('Jan 1, 2024');
    await expect(page.locator('#resultValue')).toContainText('12:00:00 AM UTC');
  });
}

test('show the current epoch and update it each second', async ({ page }) => {
  const { freezeClock } = require('./fixtures');
  await freezeClock(page);
  await page.goto('/epoch');
  await expect(page.locator('#currentSeconds')).toHaveText('1767600000');
  await expect(page.locator('#currentMillis')).toHaveText('1767600000000');
  await page.clock.runFor(1000);
  await expect(page.locator('#currentSeconds')).toHaveText('1767600001');
  await expect(page.locator('#currentMillis')).toHaveText('1767600001000');
});
