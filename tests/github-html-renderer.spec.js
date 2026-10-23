const { test, expect } = require('./fixtures');

test.beforeEach(async ({ page }) => {
  await page.route('https://api.github.com/repos/example/site/git/trees/**', route => route.fulfill({
    json: { tree: [
      { type: 'blob', path: 'index.html' },
      { type: 'blob', path: 'nested/about.html' },
      { type: 'blob', path: 'README.md' },
      { type: 'tree', path: 'nested' },
    ] },
  }));
  await page.route('https://api.github.com/repos/example/site/compare/**', route => route.fulfill({
    json: { files: [{ filename: 'nested/about.html' }] },
  }));
  await page.route('https://raw.githubusercontent.com/example/site/**', route => {
    const title = route.request().url().endsWith('nested/about.html') ? 'About fixture' : 'Home fixture';
    return route.fulfill({
      contentType: 'text/html',
      body: `<!DOCTYPE html><html><head><title>${title}</title></head><body><h1>${title}</h1></body></html>`,
    });
  });
  await page.goto('/github-html-renderer');
});

test('fetch branch HTML files, render a selection and clear it', async ({ page }) => {
  await page.locator('#branchInput').fill('example/site/main');
  await page.locator('#fetchBtn').click();
  await expect(page.locator('#fileSelect option')).toHaveText(['index.html', 'nested/about.html']);
  await expect(page.frameLocator('#renderFrame').getByRole('heading')).toHaveText('Home fixture');
  await page.locator('#fileSelect').selectOption('nested/about.html');
  await page.locator('#renderBtn').click();
  await expect(page.frameLocator('#renderFrame').getByRole('heading')).toHaveText('About fixture');
  await expect(page.locator('#renderTitle')).toHaveText('Rendering: nested/about.html');
  await expect(page.frameLocator('#renderFrame').locator('base')).toHaveAttribute('href', 'https://raw.githubusercontent.com/example/site/main/');
  await page.locator('#clearBtn').click();
  await expect(page.locator('#branchInput')).toHaveValue('');
  await expect(page.locator('#fileSelect')).toBeDisabled();
  await expect(page.locator('#renderSection')).toBeHidden();
});

test('compare URL marks changed files and renders the changed file first', async ({ page }) => {
  await page.locator('#branchInput').fill('https://github.com/example/site/compare/feature/ui');
  await page.locator('#fetchBtn').click();
  await expect(page.locator('#fileSelect')).toHaveValue('nested/about.html');
  await expect(page.locator('#fileSelect option:checked')).toHaveText('nested/about.html (changed)');
  await expect(page.frameLocator('#renderFrame').getByRole('heading')).toHaveText('About fixture');
  await expect(page.frameLocator('#renderFrame').locator('base')).toHaveAttribute('href', 'https://raw.githubusercontent.com/example/site/feature/ui/');
});
