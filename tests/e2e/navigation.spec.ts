import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between pages', async ({ page }) => {
    await page.goto('/');

    // Navigate to upload page
    await page.getByRole('link', { name: 'Upload' }).click();
    await expect(page).toHaveURL('/upload');
    await expect(
      page.getByRole('heading', { name: 'File Upload' })
    ).toBeVisible();

    // Return to home page
    await page.getByRole('link', { name: 'Feed' }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Clear' })).toBeVisible();
  });

  test('should show active navigation state', async ({ page }) => {
    await page.goto('/');

    // Check active state for home page
    const homeLink = page.getByRole('link', { name: 'Feed' });
    await expect(homeLink).toHaveClass(/bg-blue-100/);

    // Navigate to upload page
    await page.getByRole('link', { name: 'Upload' }).click();

    // Check active state for upload page
    const uploadLink = page.getByRole('link', { name: 'Upload' });
    await expect(uploadLink).toHaveClass(/bg-blue-100/);

    // Check that home page is no longer active
    await expect(homeLink).not.toHaveClass(/bg-blue-100/);
  });
});
