const fs = require('node:fs/promises');
const path = require('node:path');
const { test, expect } = require('./fixtures');

test('paste SVG, scale it and download a PNG', async ({ page }, testInfo) => {
  await page.goto('/svg-converter');
  await page.locator('#scale').selectOption('1');
  await page.locator('#svgInput').fill(await fs.readFile(path.join(__dirname, 'fixtures/rectangle.svg'), 'utf8'));
  await expect(page.locator('#meta')).toContainText('PNG · 40 × 20 px');
  await page.locator('#scale').selectOption('2');
  await expect(page.locator('#meta')).toContainText('PNG · 80 × 40 px');
  await expect(page.locator('#downloadBtn')).toBeEnabled();
  const pixel = await page.locator('#previewWrap img').evaluate(async image => {
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    return [...ctx.getImageData(40, 20, 1, 1).data];
  });
  expect(pixel).toEqual([255, 0, 0, 255]);
  await page.locator('#filename').fill('red-rectangle');
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#downloadBtn').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('red-rectangle.png');
  const output = testInfo.outputPath('rectangle.png');
  await download.saveAs(output);
  const bytes = await fs.readFile(output);
  expect([...bytes.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  expect(bytes.readUInt32BE(16)).toBe(80);
  expect(bytes.readUInt32BE(20)).toBe(40);
  await page.locator('#clearBtn').click();
  await expect(page.locator('#svgInput')).toHaveValue('');
  await expect(page.locator('#downloadBtn')).toBeDisabled();
});

test('upload SVG, resize with a locked aspect ratio and download JPEG', async ({ page }, testInfo) => {
  await page.goto('/svg-converter');
  await page.locator('#fileInput').setInputFiles(path.join(__dirname, 'fixtures/rectangle.svg'));
  await expect(page.locator('#meta')).toContainText('PNG · 80 × 40 px');
  await expect(page.locator('#filename')).toHaveValue('rectangle');
  await page.locator('#scale').selectOption('custom');
  await page.locator('#widthInput').fill('120');
  await expect(page.locator('#heightInput')).toHaveValue('60');
  await page.locator('#format').selectOption('image/jpeg');
  await expect(page.locator('#meta')).toContainText('JPEG · 120 × 60 px');
  await expect(page.locator('#qualityControl')).toBeVisible();
  await expect(page.locator('#transparentRow')).toBeHidden();
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#downloadBtn').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('rectangle.jpg');
  const output = testInfo.outputPath('rectangle.jpg');
  await download.saveAs(output);
  const bytes = await fs.readFile(output);
  expect([...bytes.subarray(0, 3)]).toEqual([255, 216, 255]);
  expect(await page.locator('#previewWrap img').evaluate(async image => {
    await image.decode();
    return [image.naturalWidth, image.naturalHeight];
  })).toEqual([120, 60]);
});
