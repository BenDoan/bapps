const path = require('node:path');
const { test, expect } = require('./fixtures');

test('upload sessions, inspect chart statistics and reload a shared link', async ({ page }) => {
  await page.goto('/gauntlet-tracker');
  await page.locator('#fileInput').setInputFiles([
    path.join(__dirname, 'fixtures/gauntletTracker-testuser-2026-01-02-10-00.json'),
    path.join(__dirname, 'fixtures/gauntletTracker-testuser-2026-01-01-10-00.json'),
  ]);
  await expect(page.locator('#fileCount')).toHaveText('2 sessions loaded');
  await expect(page.locator('.chart-card canvas')).toHaveCount(5);
  const damage = page.locator('.chart-card').filter({ hasText: 'Damage Taken' });
  await expect(damage).toContainText('Min: 100.00');
  await expect(damage).toContainText('Avg: 150.00');
  await expect(damage).toContainText('Max: 200.00');
  const fish = page.locator('.chart-card').filter({ hasText: 'Fish Needed' });
  await expect(fish).toContainText('Avg: 7.50');
  await page.locator('#shareBtn').click();
  const shareUrl = await page.locator('#shareUrlInput').inputValue();
  expect(new URL(shareUrl).hash.length).toBeGreaterThan(1);
  await page.goto('/');
  await page.goto(shareUrl);
  await expect(page.locator('#fileCount')).toHaveText('2 sessions loaded');
  await expect(page.locator('.chart-card').filter({ hasText: 'Damage Taken' })).toContainText('Avg: 150.00');
  await page.locator('#resetBtn').click();
  await expect(page.locator('#emptyState')).toBeVisible();
  await expect(page.locator('#chartsContainer')).toBeHidden();
  await page.reload();
  await expect(page.locator('#emptyState')).toBeVisible();
});

test('demo data creates a full set of charts', async ({ page }) => {
  await page.goto('/gauntlet-tracker');
  await page.locator('#demoBtn').click();
  await expect(page.locator('#fileCount')).toHaveText('12 sessions loaded');
  await expect(page.locator('.chart-card canvas')).toHaveCount(15);
  await expect(page.locator('#emptyState')).toBeHidden();
});

test('filter uploaded sessions to the last twenty', async ({ page }) => {
  await page.goto('/gauntlet-tracker');
  await page.locator('#fileInput').setInputFiles(Array.from({ length: 24 }, (_, i) => ({
    name: `gauntletTracker-testuser-2026-01-${String(i + 1).padStart(2, '0')}-10-00.json`,
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ playerAttacks: 60, damageTaken: 240 - i * 5 })),
  })));
  await expect(page.locator('#fileCount')).toHaveText('24 sessions loaded');
  await page.locator('#last20Btn').click();
  await expect(page.locator('#fileCount')).toHaveText('20 sessions loaded (showing last 20 of 24)');
  await expect(page.locator('.chart-card').filter({ hasText: 'Damage Taken' })).toContainText('Max: 220.00');
  await page.locator('#last20Btn').click();
  await expect(page.locator('#fileCount')).toHaveText('24 sessions loaded');
});
