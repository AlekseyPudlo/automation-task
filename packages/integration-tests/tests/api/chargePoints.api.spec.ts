import { test, expect } from '@playwright/test';
import { ApiClient } from '../../api-helpers/ApiClient';
import {
  generateSerialNumber,
  generateSerialNumbers,
} from '../../api-helpers/chargePointHelpers';

test.describe('Charge Points API', () => {
  let apiClient: ApiClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  test('should add a new charge point', async () => {
    // Arrange
    const serialNumber = generateSerialNumber();

    // Act - Add the charge point
    const response = await apiClient.addChargePoint(serialNumber);

    // Assert - The charge point was added successfully
    expect(response.status).toBe(201);

    // Assert - The charge point exists in the list
    const chargePoints = await apiClient.getChargePoints();
    const found = chargePoints.some(
      (cp: any) => cp.serialNumber === serialNumber
    );
    expect(found).toBeTruthy();
  });

  test('should delete a charge point', async () => {
    // Arrange
    const serialNumber = generateSerialNumber();

    // Act - Add a charge point
    await apiClient.addChargePoint(serialNumber);

    // Assert - The charge point exists in the list
    const chargePoints = await apiClient.getChargePoints();
    const found = chargePoints.some(
      (cp: any) => cp.serialNumber === serialNumber
    );
    expect(found).toBeTruthy();

    // Act - Delete the charge point by serial number
    const deleted = await apiClient.deleteChargePointBySerialNumber(
      serialNumber
    );
    expect(deleted.status).toBe(204);

    // Assert - The charge point no longer exists
    const updatedChargePoints = await apiClient.getChargePoints();
    const stillExists = updatedChargePoints.some(
      (cp: any) => cp.serialNumber === serialNumber
    );

    expect(stillExists).toBeFalsy();
  });

  test('should get all charge points', async () => {
    // Arrange
    const serialNumbers = generateSerialNumbers('_1', '_2', '_3');

    // Act - Add all charge points
    for (const serialNumber of serialNumbers) {
      await apiClient.addChargePoint(serialNumber);
    }

    // Act - Get all charge points
    const chargePoints = await apiClient.getChargePoints();

    // Assert - The charge points exist in the list
    for (const sn of serialNumbers) {
      expect(
        chargePoints.some((cp: any) => cp.serialNumber === sn)
      ).toBeTruthy();
    }
  });

  test('should handle adding duplicate serial numbers', async () => {
    const serialNumber = generateSerialNumber();

    // Add the charge point first time
    const response1 = await apiClient.addChargePoint(serialNumber);
    expect(response1.status).toBe(201);

    // Try to add again - should not be successful
    const response2 = await apiClient.addChargePoint(serialNumber);
    expect(response2.status).not.toBe(201);
  });

  test('should reject adding charge point with invalid serial number format', async () => {
    // Arrange - Test with empty serial number
    const responseEmpty = await apiClient.addChargePoint('');

    // Assert - The charge point was not added successfully
    expect.soft(responseEmpty.status).not.toBe(201);

    // Arrange - Test with very long serial number
    const tooLongSN = 'SN' + '1'.repeat(100);
    const responseTooLong = await apiClient.addChargePoint(tooLongSN);

    // Assert - The charge point was not added successfully
    expect.soft(responseTooLong.status).not.toBe(201);
  });

  test('should verify structure of charge point data', async () => {
    // Arrange - Generate a serial number for the test
    const serialNumber = generateSerialNumber('_struct_test');

    // Act - Add charge point
    const response = await apiClient.addChargePoint(serialNumber);
    expect(response.status).toBe(201);

    // Assert - The structure of the returned data
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('serialNumber', serialNumber);

    // Act - Get it back and verify structure
    const chargePoints = await apiClient.getChargePoints();
    const chargePoint = chargePoints.find(
      (cp: any) => cp.serialNumber === serialNumber
    );

    // Assert - The charge point exists
    expect(chargePoint).toBeDefined();

    // Assert - The charge point has the correct structure
    expect(chargePoint).toHaveProperty('id');
    expect(chargePoint).toHaveProperty('serialNumber');
    expect(typeof chargePoint.id).toBe('string');
    expect(typeof chargePoint.serialNumber).toBe('string');
  });

  test.afterEach(async () => {
    const chargePoints = await apiClient.getChargePoints();
    for (const cp of chargePoints) {
      await apiClient.deleteChargePointBySerialNumber(cp.serialNumber);
    }
  });
});
