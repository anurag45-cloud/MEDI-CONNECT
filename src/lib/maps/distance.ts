/**
 * Mathematically verified Haversine formula to compute great-circle distance
 * between two coordinates on Earth in kilometers.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Approximate urban driving ETA based on Kota road conditions (~30 km/h average)
 */
export function estimateDrivingETA(distanceKm: number): { mins: number; formatted: string } {
  if (distanceKm <= 0) return { mins: 0, formatted: "Arrived" };
  const avgSpeedKmH = 30;
  const hours = distanceKm / avgSpeedKmH;
  const mins = Math.max(2, Math.round(hours * 60));

  if (mins < 60) {
    return { mins, formatted: `${mins} mins` };
  }
  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return { mins, formatted: `${hrs}h ${remainingMins}m` };
}

/**
 * Generates an external Google Maps directions link safely
 */
export function getDirectionsUrl(lat: number, lon: number, destinationName: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&destination_place_id=${encodeURIComponent(
    destinationName
  )}`;
}
