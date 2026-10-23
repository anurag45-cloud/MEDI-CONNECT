import { describe, it, expect } from "vitest";
import { calculateHaversineDistance, estimateDrivingETA } from "@/lib/maps/distance";

describe("Haversine Distance & Urban Routing Calculations", () => {
  it("calculates exact zero distance between identical coordinates", () => {
    const dist = calculateHaversineDistance(25.18, 75.83, 25.18, 75.83);
    expect(dist).toBe(0);
  });

  it("calculates accurate distance between Kota Heart Institute and MBS Hospital", () => {
    // Kota Heart: 25.1583, 75.8450
    // MBS Hospital: 25.1880, 75.8390
    const dist = calculateHaversineDistance(25.1583, 75.8450, 25.1880, 75.8390);
    // Great circle distance is ~3.4 km
    expect(dist).toBeGreaterThan(3.0);
    expect(dist).toBeLessThan(4.0);
  });

  it("estimates realistic driving ETA based on urban Kota traffic", () => {
    const eta1 = estimateDrivingETA(3.5);
    expect(eta1.mins).toBeGreaterThanOrEqual(5);
    expect(eta1.formatted).toContain("mins");

    const etaZero = estimateDrivingETA(0);
    expect(etaZero.formatted).toBe("Arrived");
  });
});
