export type UserRole =
  | "patient"
  | "doctor"
  | "hospital_admin"
  | "hospital_staff"
  | "super_admin";

export type VerificationStatus = "pending" | "verified" | "rejected" | "suspended";

export type BedStatus =
  | "available"
  | "held"
  | "booked"
  | "occupied"
  | "out_of_service";

export type WardType = "general" | "emergency" | "icu" | "pediatric" | "maternity";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "rescheduled";

export type PaymentStatus = "created" | "captured" | "failed" | "refunded";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  date_of_birth?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  blood_group?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  avatar_url?: string;
  address?: string;
  city?: string;
  state?: string;
  pin_code?: string;
  height_cm?: number;
  weight_kg?: number;
  bmi?: number;
  allergies?: string[];
  chronic_conditions?: string[];
  current_medications?: string[];
  past_surgeries?: string[];
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  insurance_provider?: string;
  insurance_policy_number?: string;
  health_data_consent: boolean;
  created_at: string;
  updated_at: string;
}

export interface DoctorProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  photo_url?: string;
  specialty: string;
  qualifications: string[];
  registration_number: string;
  registration_authority: string;
  experience_years: number;
  languages: string[];
  biography?: string;
  consultation_fee: number;
  hospital_id?: string;
  hospital_name?: string;
  department?: string;
  status: VerificationStatus;
  rating: number;
  review_count: number;
  appointment_duration_mins: number;
  working_hours?: {
    days: string[];
    start_time: string;
    end_time: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Hospital {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  images?: string[];
  address: string;
  city: string;
  state: string;
  pin_code: string;
  latitude: number;
  longitude: number;
  phone: string;
  emergency_phone: string;
  email: string;
  is_partner: boolean;
  status: VerificationStatus;
  departments: string[];
  facilities: string[];
  emergency_available: boolean;
  rating: number;
  review_count: number;
  total_beds?: number;
  available_beds?: number;
  available_emergency_beds?: number;
  distance_km?: number;
  created_at: string;
  updated_at: string;
}

export interface Bed {
  id: string;
  hospital_id: string;
  hospital_name?: string;
  ward: WardType;
  bed_number: string;
  price_per_day: number;
  status: BedStatus;
  hold_expires_at?: string | null;
  current_booking_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface BedBooking {
  id: string;
  bed_id: string;
  hospital_id: string;
  hospital_name?: string;
  ward: WardType;
  bed_number: string;
  patient_id: string;
  patient_name: string;
  patient_age: number;
  patient_gender: string;
  patient_phone: string;
  attendant_name: string;
  attendant_phone: string;
  reason: string;
  admission_date: string;
  expected_days: number;
  is_emergency: boolean;
  price_per_day: number;
  total_price: number;
  advance_payable: number; // 50%
  remaining_balance: number; // 50%
  hold_status: "held" | "confirmed" | "expired" | "admitted" | "discharged" | "cancelled";
  payment_id?: string;
  payment_status: PaymentStatus;
  qr_code?: string;
  created_at: string;
  updated_at: string;
  discharged_at?: string;
  admitted_at?: string;
}

export interface Appointment {
  id: string;
  doctor_id: string;
  doctor_name?: string;
  doctor_specialty?: string;
  doctor_photo_url?: string;
  patient_id: string;
  patient_name: string;
  patient_phone?: string;
  hospital_id?: string;
  hospital_name?: string;
  slot_time: string; // ISO date-time
  duration_mins: number;
  fee: number;
  reason_for_visit: string;
  patient_notes?: string;
  status: AppointmentStatus;
  payment_status: PaymentStatus;
  payment_id?: string;
  clinical_notes?: string;
  assessment?: string;
  prescriptions?: string;
  follow_up_instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface ProblemReport {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  category: "booking" | "payment" | "hospital_experience" | "technical" | "other";
  subject: string;
  description: string;
  screenshot_url?: string;
  related_booking_id?: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  admin_reply?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  role?: string;
  action: string;
  entity: string;
  entity_id?: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}
