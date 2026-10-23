import { describe, it, expect } from "vitest";
import {
  patientProfileSchema,
  problemReportSchema,
  bedBookingFormSchema,
} from "@/lib/validation/schemas";

describe("Zod Data Schema & Input Integrity Checks", () => {
  it("validates compliant patient profile", () => {
    const validProfile = {
      fullName: "Rohit Verma",
      email: "patient@mediconnect.org",
      phone: "9829055443",
      gender: "male" as const,
      bloodGroup: "B+" as const,
      address: "Talwandi Sector 4",
      city: "Kota",
      state: "Rajasthan",
      pinCode: "324005",
      heightCm: 175,
      weightKg: 70,
      emergencyContactName: "Sanjay Verma",
      emergencyContactPhone: "9829012345",
      healthDataConsent: true,
    };

    const res = patientProfileSchema.safeParse(validProfile);
    expect(res.success).toBe(true);
  });

  it("rejects patient profile when explicit health consent is false", () => {
    const nonConsentingProfile = {
      fullName: "Rohit Verma",
      email: "patient@mediconnect.org",
      phone: "9829055443",
      gender: "male" as const,
      address: "Talwandi Sector 4",
      city: "Kota",
      state: "Rajasthan",
      pinCode: "324005",
      emergencyContactName: "Sanjay Verma",
      emergencyContactPhone: "9829012345",
      healthDataConsent: false, // Consent declined
    };

    const res = patientProfileSchema.safeParse(nonConsentingProfile);
    expect(res.success).toBe(false);
  });

  it("rejects invalid Indian PIN codes", () => {
    const badPin = {
      fullName: "Rohit Verma",
      email: "patient@mediconnect.org",
      phone: "9829055443",
      gender: "male" as const,
      address: "Talwandi Sector 4",
      city: "Kota",
      state: "Rajasthan",
      pinCode: "32400", // Only 5 digits
      emergencyContactName: "Sanjay Verma",
      emergencyContactPhone: "9829012345",
      healthDataConsent: true,
    };

    const res = patientProfileSchema.safeParse(badPin);
    expect(res.success).toBe(false);
  });

  it("validates problem report schema with required length", () => {
    const validReport = {
      category: "booking" as const,
      subject: "Appointment timing query",
      description: "My scheduled slot for tomorrow at 10 AM needs confirmation please.",
    };
    expect(problemReportSchema.safeParse(validReport).success).toBe(true);

    const tooShortReport = {
      category: "booking" as const,
      subject: "Bug",
      description: "Broken",
    };
    expect(problemReportSchema.safeParse(tooShortReport).success).toBe(false);
  });
});
