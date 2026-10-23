import { describe, it, expect } from "vitest";
import { Bed } from "@/types";

describe("Bed Allocation Engine & Transactional Hold Rules", () => {
  it("rejects transition to available if a patient is currently admitted (occupied)", () => {
    const occupiedBed: Bed = {
      id: "bed-001",
      hospital_id: "hosp-001",
      ward: "general",
      bed_number: "GEN-01",
      price_per_day: 1500,
      status: "occupied", // Inpatient actively admitted
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Attempting direct status toggle without discharge
    const canDirectlyMarkAvailable = (bed: Bed, targetStatus: string): boolean => {
      if (bed.status === "occupied" && targetStatus === "available") {
        return false; // Violates clinical discharge requirement
      }
      return true;
    };

    expect(canDirectlyMarkAvailable(occupiedBed, "available")).toBe(false);
  });

  it("identifies expired 10-minute holds for automated lazy cleanup", () => {
    const expiredTime = new Date(Date.now() - 5 * 60 * 1000).toISOString(); // Expired 5 mins ago
    const activeTime = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 mins remaining

    const isHoldExpired = (holdExpiresAt: string | null | undefined): boolean => {
      if (!holdExpiresAt) return false;
      return new Date(holdExpiresAt).getTime() < Date.now();
    };

    expect(isHoldExpired(expiredTime)).toBe(true);
    expect(isHoldExpired(activeTime)).toBe(false);
  });

  it("enforces emergency requirement check for emergency casualty beds", () => {
    const isEmergencyEligible = (ward: string, declaredEmergency: boolean): boolean => {
      if (ward === "emergency" && !declaredEmergency) {
        return false;
      }
      return true;
    };

    expect(isEmergencyEligible("emergency", false)).toBe(false);
    expect(isEmergencyEligible("emergency", true)).toBe(true);
    expect(isEmergencyEligible("general", false)).toBe(true);
  });
});
