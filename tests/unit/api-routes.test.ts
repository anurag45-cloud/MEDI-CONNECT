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

describe("Lab Reports AI Explainer Validation & Heuristic Intelligence", () => {
  it("validates valid lab report explanation requests", async () => {
    const { explainerRequestSchema } = await import("@/lib/services/lab-explainer");
    const validPayload = {
      reportId: "lab-001",
      reportTitle: "Complete Blood Count (CBC)",
      parameters: [
        {
          name: "Hemoglobin",
          result: 11.2,
          unit: "g/dL",
          reference_range: "12.0 - 15.5",
          flag: "low" as const,
          plain_explanation: "Carries oxygen. Slightly low.",
        },
        {
          name: "White Blood Cells",
          result: 6800,
          unit: "/mcL",
          reference_range: "4,500 - 11,000",
          flag: "normal" as const,
        },
      ],
      userQuestion: "Can you explain this report simply?",
    };

    const parsed = explainerRequestSchema.safeParse(validPayload);
    expect(parsed.success).toBe(true);
  });

  it("rejects invalid flag values in lab parameters", async () => {
    const { explainerRequestSchema } = await import("@/lib/services/lab-explainer");
    const invalidPayload = {
      reportTitle: "Lipid Profile",
      parameters: [
        {
          name: "Cholesterol",
          result: 220,
          unit: "mg/dL",
          reference_range: "< 200",
          flag: "terrible", // invalid flag enum
        },
      ],
    };

    const parsed = explainerRequestSchema.safeParse(invalidPayload);
    expect(parsed.success).toBe(false);
  });

  it("produces reassuring guidance when no abnormal parameters are present", async () => {
    const { getHeuristicLabExplanation } = await import("@/lib/services/lab-explainer");
    const result = getHeuristicLabExplanation(
      "Comprehensive Metabolic Panel",
      [
        { name: "Creatinine", result: 0.9, unit: "mg/dL", reference_range: "0.6 - 1.2", flag: "normal" },
        { name: "eGFR", result: 95, unit: "mL/min", reference_range: "> 60", flag: "normal" },
      ],
      "Normal findings",
      "Is there any danger or emergency?"
    );

    expect(result.reply).toContain("Not dangerous at all");
    expect(result.audioScript).toContain("nothing dangerous");
    expect(result.keyTakeaways.length).toBeGreaterThan(0);
  });

  it("provides tailored dietary guidance for lipid panel questions", async () => {
    const { getHeuristicLabExplanation } = await import("@/lib/services/lab-explainer");
    const result = getHeuristicLabExplanation(
      "Comprehensive Lipid Profile",
      [
        { name: "Total Cholesterol", result: 228, unit: "mg/dL", reference_range: "< 200", flag: "high" },
        { name: "LDL Cholesterol", result: 148, unit: "mg/dL", reference_range: "< 100", flag: "high" },
      ],
      "Mild hyperlipidemia",
      "What should I eat or avoid in my diet?"
    );

    expect(result.reply.toLowerCase()).toContain("oats");
    expect(result.reply.toLowerCase()).toContain("fiber");
    expect(result.audioScript).toBeDefined();
    expect(result.keyTakeaways.some((t) => t.toLowerCase().includes("fiber"))).toBe(true);
  });

  it("suggests 3 clinical questions when patient asks what to ask doctor", async () => {
    const { getHeuristicLabExplanation } = await import("@/lib/services/lab-explainer");
    const result = getHeuristicLabExplanation(
      "Glycated Hemoglobin (HbA1c)",
      [
        { name: "HbA1c", result: 6.7, unit: "%", reference_range: "< 5.7", flag: "high" },
      ],
      "Prediabetes",
      "What questions should I ask my doctor?"
    );

    expect(result.reply).toContain("3 High-Yield Questions");
    expect(result.keyTakeaways.length).toBe(3);
  });
});
