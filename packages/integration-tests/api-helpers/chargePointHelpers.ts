/**
 * Helper functions for charge point testing
 */

/**
 * Generates a unique serial number for testing charge points
 * @param suffix Optional suffix to append to the serial number
 * @returns A unique serial number
 */
export const generateSerialNumber = (suffix = '') =>
  `SN${Date.now().toString().slice(-6)}${suffix}`;

/**
 * Generates multiple unique serial numbers for testing charge points
 * @param suffixes Optional suffixes to append to the serial numbers
 * @returns An array of unique serial numbers
 */
export const generateSerialNumbers = (...suffixes: string[]) =>
  suffixes.map((suffix) => generateSerialNumber(suffix));
