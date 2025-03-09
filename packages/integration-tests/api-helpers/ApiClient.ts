import { APIRequestContext, request, expect } from '@playwright/test';
import { logger } from './Logger';

export class ApiClient {
  private apiContext: APIRequestContext;
  private baseUrl: string;

  constructor(
    apiContext: APIRequestContext,
    baseUrl: string = 'http://localhost:3001'
  ) {
    this.apiContext = apiContext;
    this.baseUrl = baseUrl;
  }

  /**
   * Get all charge points from the API
   * @returns The API response
   */
  async getChargePoints() {
    const response = await this.apiContext.get(`${this.baseUrl}/charge-point`);
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }

  /**
   * Add a new charge point via API
   * @param serialNumber The serial number to add
   * @returns The API response with status and data
   */
  async addChargePoint(serialNumber: string) {
    const response = await this.apiContext.post(
      `${this.baseUrl}/charge-point`,
      {
        data: {
          serialNumber,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return {
      status: response.status(),
      data: await response.json(),
    };
  }

  /**
   * Delete a charge point via API by serial number
   * @param serialNumber The serial number of the charge point to delete
   * @returns The API response
   */
  async deleteChargePointBySerialNumber(serialNumber: string) {
    const chargePoints = await this.getChargePoints();
    const chargePoint = chargePoints.find(
      (chargePoint) => chargePoint.serialNumber === serialNumber
    );

    return await this.deleteChargePoint(chargePoint.id);
  }

  /**
   * Delete a charge point via API
   * @param id The ID of the charge point to delete
   * @returns The API response
   */
  private async deleteChargePoint(id: string) {
    const response = await this.apiContext.delete(
      `${this.baseUrl}/charge-point/${id}`
    );
    return {
      status: response.status(),
    };
  }
}
