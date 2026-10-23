const { test, expect, freezeClock } = require('./fixtures');

test.beforeEach(async ({ page }) => {
  await freezeClock(page);
  await page.goto('/pomodoro');
});

test('pause, resume, skip to a break and reset a work session', async ({ page }) => {
  await page.locator('#descriptionInput').fill('Write browser tests');
  await page.locator('#startBtn').click();
  await expect(page.locator('#descriptionInput')).toBeDisabled();
  await page.clock.runFor(2000);
  await expect(page.locator('#display')).toHaveText('24:58');
  await page.locator('#pauseBtn').click();
  await page.clock.runFor(2000);
  await expect(page.locator('#display')).toHaveText('24:58');
  await page.locator('#startBtn').click();
  await page.clock.runFor(1000);
  await expect(page.locator('#display')).toHaveText('24:57');
  await page.locator('#skipBtn').click();
  await expect(page.locator('#status')).toHaveText('Short Break');
  await expect(page.locator('#display')).toHaveText('05:00');
  await expect(page.locator('#pomodoroCount')).toHaveText('0 pomodoros completed today');
  await page.locator('#resetBtn').click();
  await expect(page.locator('#status')).toHaveText('Work Session');
  await expect(page.locator('#display')).toHaveText('25:00');
  await expect(page.locator('#descriptionInput')).toBeEnabled();
});

test('complete work, persist history and delete a completed entry', async ({ page }) => {
  await page.locator('#descriptionInput').fill('Finish the happy-path suite');
  await page.locator('#startBtn').click();
  await page.clock.runFor(25 * 60 * 1000);
  await expect(page.locator('#pomodoroCount')).toHaveText('1 pomodoro completed today');
  await expect(page.locator('#historyBody tr')).toHaveCount(1);
  await expect(page.locator('#historyBody')).toContainText('Finish the happy-path suite');
  await expect(page.locator('#pomodoroDots .completed')).toHaveCount(1);
  await page.clock.runFor(2000);
  await expect(page.locator('#status')).toHaveText('Short Break');
  await expect(page.locator('#display')).toHaveText('05:00');
  await page.reload();
  await expect(page.locator('#historyBody')).toContainText('Finish the happy-path suite');
  await expect(page.locator('#pomodoroCount')).toHaveText('1 pomodoro completed today');
  await page.getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.locator('#historyBody')).toHaveText('No completed pomodoros yet');
  await page.reload();
  await expect(page.locator('#pomodoroCount')).toHaveText('0 pomodoros completed today');
});
