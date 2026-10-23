import { describe, it, expect } from "vitest";
import { problemReportSchema } from "@/lib/validation/schemas";

describe("Problem Reports & Feedback Validation", () => {
  it("accepts valid problem report input", () => {
    const validData = {
      category: "booking",
      subject: "Appointment rescheduling question",
      description: "Need to change consultation time with Dr. Alok Shrivastava due to travel conflict.",
      relatedBookingId: "apt-101",
    };

    const result = problemReportSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("rejects descriptions shorter than 20 characters", () => {
    const shortDesc = {
      category: "technical",
      subject: "Page error",
      description: "Too short",
    };

    const result = problemReportSchema.safeParse(shortDesc);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("20 characters");
    }
  });

  it("rejects subjects shorter than 5 characters", () => {
    const shortSubject = {
      category: "payment",
      subject: "Pay",
      description: "Payment did not go through properly on checkout screen.",
    };

    const result = problemReportSchema.safeParse(shortSubject);
    expect(result.success).toBe(false);
  });
});

describe("Appointment Slot Conflict Checking Logic", () => {
  it("detects conflicting appointment slot for the same doctor", () => {
    const existingAppointments = [
      {
        doctor_id: "doc-001",
        slot_time: "2026-10-24T10:00:00Z",
        status: "confirmed",
      },
    ];

    const hasConflict = (doctorId: string, slotTime: string): boolean => {
      return existingAppointments.some(
        (a) =>
          a.doctor_id === doctorId &&
          a.slot_time === slotTime &&
          a.status === "confirmed"
      );
    };

    expect(hasConflict("doc-001", "2026-10-24T10:00:00Z")).toBe(true);
    expect(hasConflict("doc-001", "2026-10-24T10:30:00Z")).toBe(false);
    expect(hasConflict("doc-002", "2026-10-24T10:00:00Z")).toBe(false);
  });
});
