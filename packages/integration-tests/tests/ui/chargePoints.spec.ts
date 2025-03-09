import { test, expect } from '@playwright/test';
import { ChargePointsPage } from '../../page-objects/ChargePointsPage';
import {
  generateSerialNumber,
  generateSerialNumbers,
} from '../../api-helpers/chargePointHelpers';
import { logger } from '../../api-helpers/Logger';

test.describe('Charge Point Management', () => {
  let chargePointsPage: ChargePointsPage;

  test.beforeEach(async ({ page }, testInfo) => {
    // Set test context for logging
    logger.setTestContext(testInfo.title);
    logger.info('Starting test');

    chargePointsPage = new ChargePointsPage(page);

    logger.debug('Navigating to Charge Points page');
    await chargePointsPage.navigate();
  });

  test('should create a new charge point', async () => {
    // Arrange
    logger.info('Setting up test with new charge point');
    const serialNumber = generateSerialNumber();
    logger.info(`Generated serial number: ${serialNumber}`);

    // Act
    logger.debug(`Adding new charge point ${serialNumber}`);
    await chargePointsPage.addChargePoint(serialNumber);
    logger.debug(`Charge point ${serialNumber} added successfully`);

    // Assert
    logger.debug(
      `Verifying charge point ${serialNumber} was created successfully`
    );
    await chargePointsPage.verifyChargePointVisibility(serialNumber);
    logger.debug(`Charge point ${serialNumber} verified successfully`);
  });

  test('should delete an existing charge point', async () => {
    // Arrange
    logger.info('Setting up test with existing charge point');
    const serialNumber = generateSerialNumber();
    await chargePointsPage.addChargePoint(serialNumber);
    await chargePointsPage.verifyChargePointVisibility(serialNumber);

    // Act
    await chargePointsPage.deleteChargePoint(serialNumber);

    // Assert
    await chargePointsPage.verifyChargePointVisibility(serialNumber, false);
  });

  test('should manage multiple charge points correctly', async () => {
    // Arrange
    logger.info('Setting up test with multiple charge points');
    const serialNumbers = generateSerialNumbers('_1', '_2', '_3');

    // Act - Add multiple charge points
    for (const serialNumber of serialNumbers) {
      await chargePointsPage.addChargePoint(serialNumber);
    }

    // Assert all serial numbers are in the list
    const allChargePoints =
      await chargePointsPage.getAllChargePointsSerialNumber();

    for (const serialNumber of serialNumbers) {
      expect(allChargePoints).toContain(serialNumber);
    }
  });

  test('should verify error for empty serial numbers', async () => {
    // Arrange
    const emptySerialNumber = '';

    // Get initial count of charge points for validation
    const initialChargePoints =
      await chargePointsPage.getAllChargePointsSerialNumber();

    // Act - Attempt to add a charge point with empty serial number
    await chargePointsPage.addChargePoint(emptySerialNumber);

    // Assert - Verify error is displayed
    await chargePointsPage.verifySerialNumberError('Serial number is required');

    // Verify no new charge point was added
    const updatedChargePoints =
      await chargePointsPage.getAllChargePointsSerialNumber();
    expect(updatedChargePoints.length).toBe(initialChargePoints.length);
  });

  test('should verify error for duplicate serial numbers', async () => {
    // Arrange
    const serialNumber = generateSerialNumber();

    // Add first charge point with the serial number
    await chargePointsPage.addChargePoint(serialNumber);
    await chargePointsPage.verifyChargePointVisibility(serialNumber);

    // Act - Attempt to add a second charge point with the same serial number
    await chargePointsPage.addChargePoint(serialNumber);

    // Assert - Verify error message is displayed
    await chargePointsPage.verifySerialNumberError(
      'Serial number already exists'
    );

    // Verify the duplicate was not added (should still only be one instance)
    const chargePoints =
      await chargePointsPage.getAllChargePointsSerialNumber();
    const occurrences = chargePoints.filter((sn) => sn === serialNumber).length;
    expect(occurrences).toBe(1);
  });

  const testCases = [
    { serialNumber: 'SN123$456', description: 'dollar sign' },
    { serialNumber: 'SN123@456', description: 'at symbol' },
    { serialNumber: 'SN123#456', description: 'hash' },
    { serialNumber: 'SN123%456', description: 'percent' },
    { serialNumber: 'SN123&456', description: 'ampersand' },
  ];

  for (const { serialNumber, description } of testCases) {
    test(`should reject serial number with ${description}`, async () => {
      // Arrange && Act
      await chargePointsPage.addChargePoint(serialNumber);

      // Assert
      await chargePointsPage.verifySerialNumberError(
        'Invalid serial number format'
      );

      // Verify charge point wasn't added
      const allChargePoints =
        await chargePointsPage.getAllChargePointsSerialNumber();
      expect(allChargePoints).not.toContain(serialNumber);
    });
  }

  // Cleanup
  test.afterEach(async () => {
    logger.info('Test completed');
    logger.clearTestContext();
    await chargePointsPage.deleteAllChargePoints();
  });
});
