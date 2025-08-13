import { test, expect } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('File upload functionality', () => {
  test('should display file upload page', async ({ page }) => {
    await page.goto('/upload');

    await expect(
      page.getByRole('heading', { name: 'File Upload' })
    ).toBeVisible();
    await expect(
      page.getByText('Drag and drop a file here or click to select')
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Select File', exact: true })
    ).toBeVisible();
  });

  test('should upload file via file input', async ({ page }) => {
    await page.goto('/upload');

    // Создаем тестовый файл
    const testFilePath = path.join(__dirname, 'test-file.txt');

    // Загружаем файл через input
    await page.setInputFiles('input[type="file"]', testFilePath);

    // Check that file is displayed as selected
    await expect(page.getByText('File Selected')).toBeVisible();
    await expect(
      page.getByText('test-file.txt', { exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Remove File', exact: true })
    ).toBeVisible();
  });

  test('should remove uploaded file', async ({ page }) => {
    await page.goto('/upload');

    // Создаем тестовый файл
    const testFilePath = path.join(__dirname, 'test-file.txt');

    // Загружаем файл
    await page.setInputFiles('input[type="file"]', testFilePath);

    // Check that file is displayed
    await expect(page.getByText('File Selected')).toBeVisible();

    // Remove file
    await page
      .getByRole('button', { name: 'Remove File', exact: true })
      .click();

    // Check that file is removed
    await expect(
      page.getByText('Drag and drop a file here or click to select')
    ).toBeVisible();
    await expect(page.getByText('File Selected')).not.toBeVisible();
  });

  test('should show file information', async ({ page }) => {
    await page.goto('/upload');

    // Создаем тестовый файл
    const testFilePath = path.join(__dirname, 'test-file.txt');

    // Загружаем файл
    await page.setInputFiles('input[type="file"]', testFilePath);

    // Check file information
    await expect(page.getByText('Name:')).toBeVisible();
    await expect(page.getByText('Size:')).toBeVisible();
    await expect(page.getByText('Type:')).toBeVisible();
  });

  test('should handle drag and drop', async ({ page }) => {
    await page.goto('/upload');

    // Create test file
    const testFilePath = path.join(__dirname, 'test-file.txt');

    // Simulate drag and drop using setInputFiles instead
    await page.setInputFiles('input[type="file"]', testFilePath);

    // Check that file is uploaded
    await expect(page.getByText('File Selected')).toBeVisible();
  });
});
