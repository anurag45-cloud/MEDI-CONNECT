import { z } from "zod";

export const patientProfileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
  pinCode: z.string().regex(/^\d{6}$/, "Must be a 6-digit Indian PIN code"),
  heightCm: z.number().min(30).max(250).optional(),
  weightKg: z.number().min(2).max(300).optional(),
  allergies: z.array(z.string()).default([]),
  chronicConditions: z.array(z.string()).default([]),
  currentMedications: z.array(z.string()).default([]),
  pastSurgeries: z.array(z.string()).default([]),
  emergencyContactName: z.string().min(2, "Emergency contact name required"),
  emergencyContactPhone: z.string().min(10, "Emergency contact phone required"),
  insuranceProvider: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  healthDataConsent: z.boolean().refine((val) => val === true, {
    message: "Explicit consent is required to store sensitive personal health data.",
  }),
});

export type PatientProfileFormValues = z.infer<typeof patientProfileSchema>;

export const problemReportSchema = z.object({
  category: z.enum(["booking", "payment", "hospital_experience", "technical", "other"]),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  relatedBookingId: z.string().optional(),
});

export type ProblemReportFormValues = z.infer<typeof problemReportSchema>;

export const doctorSearchFilterSchema = z.object({
  symptoms: z.string().min(3, "Please describe symptoms or reason for visit"),
  age: z.number().min(0).max(120).optional(),
  durationDays: z.number().min(1).max(365).optional(),
  radiusKm: z.enum(["5", "10", "25"]).default("10"),
  city: z.string().default("Kota"),
  pinCode: z.string().optional(),
});

export type DoctorSearchFilterValues = z.infer<typeof doctorSearchFilterSchema>;

export const bedBookingFormSchema = z.object({
  bedId: z.string().min(1, "Bed ID required"),
  hospitalId: z.string().min(1, "Hospital ID required"),
  patientName: z.string().min(2, "Patient name required"),
  patientAge: z.number().min(0).max(120, "Valid age required"),
  patientGender: z.enum(["male", "female", "other"]),
  patientPhone: z.string().min(10, "Patient phone number required"),
  attendantName: z.string().min(2, "Attendant name required"),
  attendantPhone: z.string().min(10, "Attendant phone number required"),
  reason: z.string().min(10, "Clinical reason / condition description required"),
  admissionDate: z.string().min(1, "Expected admission date required"),
  expectedDays: z.number().min(1, "Expected stay must be at least 1 day").max(90),
  isEmergency: z.boolean().default(false),
});

export type BedBookingFormValues = z.infer<typeof bedBookingFormSchema>;

export const aiSpecialtyResponseSchema = z.object({
  specialties: z.array(
    z.object({
      name: z.string(),
      reason: z.string(),
      urgency: z.enum(["routine", "soon", "urgent", "emergency"]),
    })
  ),
  red_flags: z.array(z.string()),
  disclaimer: z.string(),
});

export type AISpecialtyResponse = z.infer<typeof aiSpecialtyResponseSchema>;
