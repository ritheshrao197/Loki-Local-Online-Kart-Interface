
export type Coordinates = {
  lat: number;
  lng: number;
};

/**
 * Calculates the distance between two geographical points using the Haversine formula.
 * @param pos1 - The coordinates of the first point.
 * @param pos2 - The coordinates of the second point.
 * @returns The distance in kilometers.
 */
export function getDistance(pos1: Coordinates, pos2: Coordinates): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(pos2.lat - pos1.lat);
  const dLon = deg2rad(pos2.lng - pos1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(pos1.lat)) * Math.cos(deg2rad(pos2.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
