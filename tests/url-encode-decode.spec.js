const { test, expect } = require('./fixtures');

test('encode, swap, decode and copy a URL component', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/url-encode-decode');
  const plain = 'hello world / café?x=1&y=2';
  const encoded = 'hello%20world%20%2F%20caf%C3%A9%3Fx%3D1%26y%3D2';
  await page.locator('#input').fill(plain);
  await page.locator('#encodeBtn').click();
  await expect(page.locator('#output')).toHaveValue(encoded);
  await page.locator('#copyBtn').click();
  await expect(page.locator('#copyBtn')).toHaveText('Copied!');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(encoded);
  await page.locator('#swapBtn').click();
  await expect(page.locator('#input')).toHaveValue(encoded);
  await page.locator('#decodeBtn').click();
  await expect(page.locator('#output')).toHaveValue(plain);
  await expect(page.locator('#error')).toBeEmpty();
});
