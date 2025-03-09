import { Page } from '@playwright/test';

export class HomePage {
  private page: Page;

  // Locators
  private readonly mainContentLocator = 'body';

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to the home page
   */
  async navigate() {
    await this.page.goto('/');
  }

  /**
   * Get the main content element
   */
  async getMainContent() {
    return this.page.locator(this.mainContentLocator);
  }
}
