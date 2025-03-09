import { test, expect } from '@playwright/test';
import { ChargePointsPage } from '../../page-objects/ChargePointsPage';
import { ApiClient } from '../../api-helpers/ApiClient';
import { generateSerialNumber } from '../../api-helpers/chargePointHelpers';
import { logger } from '../../api-helpers/Logger';

test.describe('Combined UI and API Tests', () => {
  let apiClient: ApiClient;
  let chargePointsPage: ChargePointsPage;

  test.beforeEach(async ({ page, request }, testInfo) => {
    logger.setTestContext(testInfo.title);
    logger.info('Starting test');

    apiClient = new ApiClient(request);
    chargePointsPage = new ChargePointsPage(page);

    logger.debug('Navigating to Charge Points page');
    await chargePointsPage.navigate();
  });

  test('should add via API and verify in UI', async ({ page }) => {
    const serialNumber = generateSerialNumber();

    // Arrange - Add charge point using API
    await apiClient.addChargePoint(serialNumber);

    // Refresh page to see the new charge point
    await page.reload({ waitUntil: 'networkidle' });

    // Assert - Verify charge point was added in UI
    await chargePointsPage.verifyChargePointVisibility(serialNumber);
  });

  test('should add via UI and verify via API', async () => {
    const serialNumber = generateSerialNumber();

    // Arrange - Add charge point using UI
    await chargePointsPage.addChargePoint(serialNumber);

    // Assert - Verify charge point was added via API
    const chargePoints = await apiClient.getChargePoints();
    const found = chargePoints.some(
      (cp: any) => cp.serialNumber === serialNumber
    );
    expect(found).toBeTruthy();
  });

  test('should delete via UI and verify via API', async ({ page }) => {
    const serialNumber = generateSerialNumber();

    // Arrange - Add charge point using API
    await apiClient.addChargePoint(serialNumber);

    // Refresh page to see the new charge point
    await page.reload({ waitUntil: 'networkidle' });

    // Act - Delete charge point using UI
    await chargePointsPage.deleteChargePoint(serialNumber);

    // Assert - Verify charge point was deleted via API
    const chargePoints = await apiClient.getChargePoints();
    const found = chargePoints.some(
      (cp: any) => cp.serialNumber === serialNumber
    );
    expect(found).toBeFalsy();
  });

  test('should delete via API and verify in UI', async ({ page }) => {
    const serialNumber = generateSerialNumber();

    // Arrange - Add charge point using UI
    await chargePointsPage.addChargePoint(serialNumber);

    // Delete using API
    await apiClient.deleteChargePointBySerialNumber(serialNumber);

    // Refresh page to see the new charge point
    await page.reload({ waitUntil: 'networkidle' });

    // Assert - Verify charge point was deleted in UI
    await chargePointsPage.verifyChargePointVisibility(serialNumber, false);
  });

  // Cleanup
  test.afterEach(async () => {
    logger.info('Test completed');
    logger.clearTestContext();
    await chargePointsPage.deleteAllChargePoints();
  });
});
