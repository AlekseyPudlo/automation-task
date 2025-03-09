import { Page, Locator, expect } from '@playwright/test';

export class ChargePointsPage {
  private page: Page;

  // Locators
  private readonly serialNumberInputLocator =
    'input[name="input-serial-number"]';
  private readonly addButtonLocator = 'button:has-text("Add")';

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to the charge points page
   */
  async navigate() {
    await this.page.goto('/');
  }

  /**
   * Add a new charge point with the given serial number
   * @param serialNumber The serial number to add
   */
  async addChargePoint(serialNumber: string) {
    await this.page.fill(this.serialNumberInputLocator, serialNumber);
    await this.page.click(this.addButtonLocator);
  }

  /**
   * Delete a charge point with the given serial number
   * @param serialNumber The serial number to delete
   */
  async deleteChargePoint(serialNumber: string) {
    const chargePointItem = this.getChargePointLocator(serialNumber);
    await chargePointItem.locator('.list-button').click();
  }

  /**
   * Delete all charge points
   */
  async deleteAllChargePoints() {
    const chargePoints = await this.getAllChargePointsSerialNumber();
    for (const serialNumber of chargePoints) {
      await this.deleteChargePoint(serialNumber);
    }
  }

  /**
   * Get all charge points as an array of serial numbers
   * @returns Array of serial numbers
   */
  async getAllChargePointsSerialNumber(): Promise<string[]> {
    const chargePoints = this.page.getByRole('listitem').locator('.list-text');
    const count = await chargePoints.count();
    const serialNumbers: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = await chargePoints.nth(i).textContent();
      if (text) {
        serialNumbers.push(text);
      }
    }

    return serialNumbers;
  }

  /**
   * Verify the visibility or invisibility of a charge point with the given serial number
   * @param serialNumber The serial number to verify
   * @param shouldBeVisible Whether the charge point should be visible (true) or invisible (false)
   * @throws Error if the visibility condition is not met
   */
  async verifyChargePointVisibility(
    serialNumber: string,
    shouldBeVisible = true
  ): Promise<void> {
    const chargePoint = this.getChargePointLocator(serialNumber);

    if (shouldBeVisible) {
      await expect(
        chargePoint,
        `Charge point with serial number ${serialNumber} should be visible`
      ).toBeVisible();
    } else {
      await expect(
        chargePoint,
        `Charge point with serial number ${serialNumber} should NOT be visible`
      ).not.toBeVisible();
    }
  }

  /**
   * This is method will always fail in this implementation because
   * the app does not have such functionality of checking the duplications or empty SNs
   * Verify that the duplicate serial number error message is displayed
   * @returns Promise<void>
   */
  async verifySerialNumberError(text: string): Promise<void> {
    // Assuming there's an error message element with a specific selector
    const errorMessageLocator = this.page.locator('.error-message');

    // Wait for the error message to be visible
    await expect(errorMessageLocator).toBeVisible();

    // Verify the error message text (adjust the expected text as needed)
    await expect(errorMessageLocator).toContainText(text);
  }

  /**
   * Get a locator for a charge point with the given serial number
   * @param serialNumber The serial number to locate
   * @returns Playwright Locator for the charge point
   * @private
   */
  private getChargePointLocator(serialNumber: string): Locator {
    // Find list items that contain the serial number in their list-text div
    return this.page.getByRole('listitem').filter({
      has: this.page.locator('.list-text', { hasText: serialNumber }),
    });
  }
}
