const { test, expect, freezeClock } = require('./fixtures');

test.beforeEach(async ({ page }) => {
  await freezeClock(page);
  await page.goto('/cron');
});

test('describe a weekday schedule and list the next ten runs', async ({ page }) => {
  await page.locator('#cronInput').fill('0 9 * * MON-FRI');
  await expect(page.locator('#descriptionBox')).toContainText('09:00');
  await expect(page.locator('#descriptionBox')).toContainText('Monday–Friday');
  await expect(page.locator('#nextRuns li')).toHaveCount(10);
  await expect(page.locator('.run-date').first()).toHaveText('Mon, Jan 05, 2026, 09:00');
  await expect(page.locator('.run-date').nth(4)).toHaveText('Fri, Jan 09, 2026, 09:00');
  await expect(page.locator('.run-date').nth(5)).toHaveText('Mon, Jan 12, 2026, 09:00');
});

test('choose a preset and preview a daily schedule', async ({ page }) => {
  await page.getByRole('button', { name: '@daily', exact: true }).click();
  await expect(page.locator('#cronInput')).toHaveValue('@daily');
  await expect(page.locator('#descriptionBox')).toContainText('00:00');
  await expect(page.locator('#nextRuns li')).toHaveCount(10);
  await expect(page.locator('.run-date').first()).toHaveText('Tue, Jan 06, 2026, 00:00');
  await expect(page.locator('.run-date').nth(1)).toHaveText('Wed, Jan 07, 2026, 00:00');
});
