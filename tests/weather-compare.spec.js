const { test, expect } = require('./fixtures');

test('choose two cities, compare scores and swap them', async ({ page }) => {
  await page.goto('/weather-compare');
  await expect(page.locator('#cardA .city-name')).toHaveText('Denver, CO');
  await expect(page.locator('#cardB .city-name')).toHaveText('Miami, FL');
  await page.locator('#cityA').fill('San Diego');
  await page.locator('#listA [role="option"]').first().click();
  await expect(page.locator('#cardA .city-name')).toHaveText('San Diego, CA');
  await expect(page).toHaveURL(/#san-diego-ca\/miami-fl$/);
  const scoreRow = page.locator('#statsTable tr').filter({ hasText: 'BenFactor (100 = perfect)' });
  const scoreA = await scoreRow.locator('.val-a').first().textContent();
  const scoreB = await scoreRow.locator('.val-b').first().textContent();
  expect(Number(scoreA)).toBeGreaterThan(Number(scoreB));
  await expect(page.locator('#statsTable')).toContainText('overnight low part (weight 0.5)');
  await expect(page.locator('#charts canvas').first()).toBeVisible();
  await page.locator('#swapBtn').click();
  await expect(page.locator('#cardA .city-name')).toHaveText('Miami, FL');
  await expect(page.locator('#cardB .city-name')).toHaveText('San Diego, CA');
  await expect(scoreRow.locator('.val-a').first()).toHaveText(scoreB);
  await expect(scoreRow.locator('.val-b').first()).toHaveText(scoreA);
  await page.reload();
  await expect(page.locator('#cardA .city-name')).toHaveText('Miami, FL');
  await expect(page.locator('#cardB .city-name')).toHaveText('San Diego, CA');
});

test('change units and retain the preference without changing BenFactor', async ({ page }) => {
  await page.goto('/weather-compare');
  const tempRow = page.locator('#statsTable tr').filter({ hasText: /^Average daily high \(year\)/ });
  const scoreRow = page.locator('#statsTable tr').filter({ hasText: 'BenFactor (100 = perfect)' });
  const score = await scoreRow.locator('.val-a').first().textContent();
  await expect(tempRow.locator('.val-a').first()).toContainText('°F');
  await page.locator('#unitBtn').click();
  await expect(tempRow.locator('.val-a').first()).toContainText('°C');
  await expect(scoreRow.locator('.val-a').first()).toHaveText(score);
  await page.reload();
  await expect(tempRow.locator('.val-a').first()).toContainText('°C');
  await expect(scoreRow.locator('.val-a').first()).toHaveText(score);
});

test('rank, reverse, filter and select a city for comparison', async ({ page }) => {
  await page.goto('/weather-compare#rankings');
  await expect(page.locator('#rankList .rank-row')).toHaveCount(202);
  await expect(page.locator('#mapDots circle').first()).toBeVisible();
  const bestFirst = (await page.locator('.rank-score').allTextContents()).map(Number);
  expect(bestFirst.every(score => Number.isFinite(score) && score >= 0 && score <= 100)).toBe(true);
  expect(bestFirst).toEqual([...bestFirst].sort((a, b) => b - a));
  await page.locator('#rankOrderBtn').click();
  const worstFirst = (await page.locator('.rank-score').allTextContents()).map(Number);
  expect(worstFirst).toEqual([...bestFirst].reverse());
  await page.locator('#rankFilter').fill('San Diego');
  await expect(page.locator('#rankList .rank-row')).toHaveCount(1);
  await expect(page.locator('#rankCount')).toHaveText('1 of 202 cities');
  await page.locator('#rankList .rank-row').click();
  await expect(page.locator('#viewCompare')).toBeVisible();
  await expect(page.locator('#cardA .city-name')).toHaveText('San Diego, CA');
});
