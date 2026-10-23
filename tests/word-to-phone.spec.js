const { test, expect } = require('./fixtures');

test('convert mixed-case words and spaces and copy the phone number', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/word-to-phone');
  await page.locator('#wordInput').fill('Hello World');
  await expect(page.locator('#result')).toHaveText('43556096753');
  await page.locator('#copyBtn').click();
  await expect(page.locator('#copyBtn')).toHaveText('Copied!');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('43556096753');
  await page.locator('#wordInput').fill('abc def ghi jkl mno pqrs tuv wxyz');
  await expect(page.locator('#result')).toHaveText('222033304440555066607777088809999');
  await page.locator('#wordInput').fill('');
  await expect(page.locator('#result')).toHaveText('-');
  await expect(page.locator('#copyBtn')).toBeDisabled();
});
