const { test, expect, freezeClock } = require('./fixtures');

test.beforeEach(async ({ page }) => {
  await freezeClock(page);
  await page.goto('/timer');
});

test('set a duration, pause, resume and reset', async ({ page }) => {
  await page.locator('#hoursInput').fill('1');
  await page.locator('#minutesInput').fill('2');
  await page.locator('#secondsInput').fill('3');
  await page.locator('#startBtn').click();
  await expect(page.locator('#display')).toHaveText('01:02:03');
  await expect(page.locator('#hoursInput')).toBeDisabled();
  await page.clock.runFor(2000);
  await expect(page.locator('#display')).toHaveText('01:02:01');
  await page.locator('#pauseBtn').click();
  await page.clock.runFor(2000);
  await expect(page.locator('#display')).toHaveText('01:02:01');
  await page.locator('#startBtn').click();
  await page.clock.runFor(1000);
  await expect(page.locator('#display')).toHaveText('01:02:00');
  await page.locator('#resetBtn').click();
  await expect(page.locator('#display')).toHaveText('01:02:03');
  await expect(page.locator('#hoursInput')).toBeEnabled();
});

test('countdown completes and can be started again', async ({ page }) => {
  await page.locator('#minutesInput').fill('0');
  await page.locator('#secondsInput').fill('3');
  await page.locator('#startBtn').click();
  await page.clock.runFor(3000);
  await expect(page.locator('#display')).toHaveText('00:00:00');
  await expect(page.locator('#display')).toHaveClass(/finished/);
  await expect(page.locator('#startBtn')).toBeEnabled();
  await expect(page.locator('#secondsInput')).toBeEnabled();
  await page.locator('#startBtn').click();
  await page.clock.runFor(1000);
  await expect(page.locator('#display')).toHaveText('00:00:02');
  await expect(page.locator('#display')).not.toHaveClass(/finished/);
});
