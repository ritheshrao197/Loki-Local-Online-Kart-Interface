
import { getDistance, type Coordinates } from './location';

// Mocking toBeCloseTo if it's not available in the environment
if (typeof expect.toBeCloseTo === 'undefined') {
  expect.extend({
    toBeCloseTo(received, expected, precision = 2) {
      const pass = Math.abs(expected - received) < Math.pow(10, -precision) / 2;
      if (pass) {
        return {
          message: () => `expected ${received} not to be close to ${expected}`,
          pass: true,
        };
      } else {
        return {
          message: () => `expected ${received} to be close to ${expected}`,
          pass: false,
        };
      }
    },
  });
}


describe('getDistance', () => {
  it('should return 0 for the same coordinates', () => {
    const pos1: Coordinates = { lat: 52.52, lng: 13.405 };
    const pos2: Coordinates = { lat: 52.52, lng: 13.405 };
    expect(getDistance(pos1, pos2)).toBe(0);
  });

  it('should calculate the distance between two points correctly', () => {
    // Approx distance between Paris and New York
    const paris: Coordinates = { lat: 48.8566, lng: 2.3522 };
    const newYork: Coordinates = { lat: 40.7128, lng: -74.0060 };
    const expectedDistance = 5837; // in kilometers
    
    // Using a custom matcher if toBeCloseTo is not available
    const calculatedDistance = getDistance(paris, newYork);
    expect(Math.round(calculatedDistance)).toBe(expectedDistance);
  });

  it('should handle coordinates across the equator', () => {
    const north: Coordinates = { lat: 10, lng: 0 };
    const south: Coordinates = { lat: -10, lng: 0 };
    const expectedDistance = 2223; // Approx 20 degrees * 111.19 km/deg
    expect(getDistance(north, south)).toBeCloseTo(expectedDistance, 0);
  });
  
  it('should handle coordinates across the prime meridian', () => {
    const west: Coordinates = { lat: 0, lng: -10 };
    const east: Coordinates = { lat: 0, lng: 10 };
    const expectedDistance = 2223; // Approx 20 degrees * 111.19 km/deg
    expect(getDistance(west, east)).toBeCloseTo(expectedDistance, 0);
  });
});
