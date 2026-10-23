const { test, expect, freezeClock } = require('./fixtures');

test('start, stop, resume and reset the stopwatch', async ({ page }) => {
  await freezeClock(page);
  await page.goto('/stopwatch');
  await expect(page.locator('#display')).toHaveText('00:00:00');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect(page.locator('#startBtn')).toBeDisabled();
  await page.clock.runFor(3000);
  await expect(page.locator('#display')).toHaveText('00:00:03');
  await page.locator('#stopBtn').click();
  await page.clock.runFor(2000);
  await expect(page.locator('#display')).toHaveText('00:00:03');
  await page.locator('#startBtn').click();
  await page.clock.runFor(1000);
  await expect(page.locator('#display')).toHaveText('00:00:04');
  await page.locator('#resetBtn').click();
  await expect(page.locator('#display')).toHaveText('00:00:00');
  await expect(page.locator('#startBtn')).toBeEnabled();
  await expect(page.locator('#stopBtn')).toBeDisabled();
});
