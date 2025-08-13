import { test, expect } from '@playwright/test';

test.describe('Posts functionality', () => {
  test('should display posts feed', async ({ page }) => {
    await page.goto('/');

    // Ждем загрузки постов
    await page.waitForSelector('[data-testid="post-card"]', { timeout: 10000 });

    // Проверяем, что посты отображаются
    const posts = await page.locator('[data-testid="post-card"]').count();
    expect(posts).toBeGreaterThan(0);
  });

  test('should create new post', async ({ page }) => {
    await page.goto('/');

    // Fill the post creation form
    await page.getByLabel('Title').fill('Test Post');
    await page.getByLabel('Author').fill('Test Author');
    await page.getByLabel('Content').fill('Test post content');

    // Submit the form
    await page.getByRole('button', { name: 'Create Post' }).click();

    // Wait for successful creation
    await expect(page.getByText('Post created successfully!')).toBeVisible();

    // Check that the form is cleared
    await expect(page.getByLabel('Title')).toHaveValue('');
    await expect(page.getByLabel('Author')).toHaveValue('');
    await expect(page.getByLabel('Content')).toHaveValue('');
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/');

    // Try to submit empty form
    await page.getByRole('button', { name: 'Create Post' }).click();

    // Check validation errors
    await expect(page.getByText('Title is required')).toBeVisible();
    await expect(page.getByText('Content is required')).toBeVisible();
    await expect(page.getByText('Author name is required')).toBeVisible();
  });

  test('should like and unlike posts', async ({ page }) => {
    await page.goto('/');

    // Ждем загрузки постов
    await page.waitForSelector('[data-testid="post-card"]', { timeout: 10000 });

    // Находим первый пост и его кнопку лайка
    const firstPost = page.locator('[data-testid="post-card"]').first();
    const likeButton = firstPost.locator('button').first();

    // Лайкаем пост
    await likeButton.click();

    // Проверяем, что количество лайков увеличилось
    await expect(likeButton).toHaveClass(/bg-red-100/);

    // Убираем лайк
    await likeButton.click();

    // Проверяем, что количество лайков вернулось к исходному
    await expect(likeButton).toHaveClass(/bg-gray-100/);
  });
});
