const fs = require('node:fs');
const path = require('node:path');
const { test, expect } = require('./fixtures');

const apps = [
  'cron', 'epoch', 'gauntlet-tracker', 'github-html-renderer', 'pomodoro',
  'stopwatch', 'svg-converter', 'timer', 'url-encode-decode',
  'weather-compare', 'word-to-phone',
];

test('every app has a suite and a working directory link', async ({ page }) => {
  const htmlApps = fs.readdirSync(path.resolve(__dirname, '..'))
    .filter(file => file.endsWith('.html') && file !== 'index.html')
    .map(file => file.replace('.html', '')).sort();
  expect(htmlApps, 'Add happy-path coverage when adding an app').toEqual(apps);
  for (const app of apps) {
    expect(fs.existsSync(path.join(__dirname, `${app}.spec.js`))).toBe(true);
  }
  await page.goto('/');
  await expect(page.locator('#appsGrid .app-card')).toHaveCount(apps.length);
  for (const app of apps) {
    await page.locator(`.app-card[href="${app}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/${app}(?:#.*)?$`));
    await expect(page.getByTitle('Back to apps', { exact: true })).toBeVisible();
    await page.getByTitle('Back to apps', { exact: true }).click();
    await expect(page.locator('#appsGrid .app-card')).toHaveCount(apps.length);
  }
});

test('search finds an app by name and description and can be cleared', async ({ page }) => {
  await page.goto('/');
  await page.locator('#searchInput').fill('STOPWATCH');
  await expect(page.locator('.app-card')).toHaveCount(1);
  await expect(page.locator('.app-name')).toHaveText('Stopwatch');
  await page.locator('#searchInput').fill('countdown');
  await expect(page.locator('.app-name')).toHaveText('Timer');
  await page.locator('#searchInput').fill('');
  await expect(page.locator('.app-card')).toHaveCount(apps.length);
});
