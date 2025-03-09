import { test, expect } from '@playwright/test';
import { HomePage } from '../../page-objects/HomePage';

test.describe('Homepage Tests', () => {
  test('homepage has correct title and loads', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();

    // Verify the page title
    await expect(page).toHaveTitle(/React App/);

    // Verify the page loaded with its main content
    await expect(await homePage.getMainContent()).toBeVisible();
  });
});
