import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DEMO_DOCTORS } from "@/lib/store/demo-data";
import { Appointment } from "@/types";

// In-memory appointments store for local sandbox/demo mode
const appointmentsStore: Appointment[] = [
  {
    id: "apt-101",
    doctor_id: "doc-001",
    doctor_name: "Dr. Alok Shrivastava",
    doctor_specialty: "Cardiology",
    patient_id: "demo-patient-001",
    patient_name: "Rohit Verma",
    patient_phone: "+91 98290 55443",
    hospital_id: "hosp-001",
    hospital_name: "Kota Heart Institute",
    slot_time: "2026-10-24T10:00:00Z",
    duration_mins: 30,
    fee: 800,
    reason_for_visit: "Post-exertion palpitations & mild dyspnea",
    status: "confirmed",
    payment_status: "captured",
    payment_id: "pay_rzp_test_88190",
    clinical_notes: "Patient reports sinus tachycardia following aerobic exercise.",
    created_at: "2026-10-22T00:00:00Z",
    updated_at: "2026-10-24T00:00:00Z",
  },
  {
    id: "apt-102",
    doctor_id: "doc-001",
    doctor_name: "Dr. Alok Shrivastava",
    doctor_specialty: "Cardiology",
    patient_id: "usr-pat-002",
    patient_name: "Kavita Singhal",
    patient_phone: "+91 98290 77112",
    hospital_id: "hosp-001",
    hospital_name: "Kota Heart Institute",
    slot_time: "2026-10-24T11:00:00Z",
    duration_mins: 30,
    fee: 800,
    reason_for_visit: "Hypertension medication review & blood pressure check",
    status: "confirmed",
    payment_status: "captured",
    created_at: "2026-10-23T00:00:00Z",
    updated_at: "2026-10-24T00:00:00Z",
  },
];

const createAppointmentSchema = z.object({
  doctorId: z.string().min(1),
  patientName: z.string().min(2),
  patientPhone: z.string().min(10),
  slotTime: z.string().min(1),
  reasonForVisit: z.string().min(3),
  patientNotes: z.string().optional(),
  paymentId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get("doctorId");
  const patientId = searchParams.get("patientId");

  const supabase = createServerSupabaseClient();
  if (supabase) {
    let query = supabase.from("appointments").select("*");
    if (doctorId) query = query.eq("doctor_id", doctorId);
    if (patientId) query = query.eq("patient_id", patientId);
    const { data, error } = await query;
    if (!error && data) {
      return NextResponse.json({ success: true, appointments: data });
    }
  }

  let filtered = appointmentsStore;
  if (doctorId) {
    filtered = filtered.filter((a) => a.doctor_id === doctorId);
  }
  return NextResponse.json({ success: true, appointments: filtered });
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = createAppointmentSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid appointment payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      doctorId,
      patientName,
      patientPhone,
      slotTime,
      reasonForVisit,
      patientNotes,
      paymentId,
    } = parsed.data;

    // 1. Anti-conflict check: Ensure slot is not already booked for this doctor
    const isConflict = appointmentsStore.some(
      (a) =>
        a.doctor_id === doctorId &&
        a.slot_time === slotTime &&
        a.status === "confirmed"
    );

    if (isConflict) {
      return NextResponse.json(
        {
          error: "Slot conflict: The selected appointment time has just been reserved by another patient. Please choose an adjacent slot.",
        },
        { status: 409 }
      );
    }

    const doctor = DEMO_DOCTORS.find((d) => d.id === doctorId) || DEMO_DOCTORS[0];

    const newAppointment: Appointment = {
      id: `apt-${Date.now().toString().slice(-4)}`,
      doctor_id: doctor.id,
      doctor_name: doctor.full_name,
      doctor_specialty: doctor.specialty,
      doctor_photo_url: doctor.photo_url,
      patient_id: "demo-patient-001",
      patient_name: patientName,
      patient_phone: patientPhone,
      hospital_id: doctor.hospital_id,
      hospital_name: doctor.hospital_name,
      slot_time: slotTime,
      duration_mins: doctor.appointment_duration_mins,
      fee: doctor.consultation_fee,
      reason_for_visit: reasonForVisit,
      patient_notes: patientNotes,
      status: "confirmed",
      payment_status: paymentId ? "captured" : "created",
      payment_id: paymentId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    appointmentsStore.unshift(newAppointment);

    return NextResponse.json({
      success: true,
      appointment: newAppointment,
      message: "Appointment confirmed and slot booked successfully.",
    });
  } catch (err) {
    console.error("Appointment creation error:", err);
    return NextResponse.json(
      { error: "Failed to book appointment" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const raw = await req.json();
    const { appointmentId, status, slotTime } = raw;

    if (!appointmentId) {
      return NextResponse.json({ error: "appointmentId required" }, { status: 400 });
    }

    const apt = appointmentsStore.find((a) => a.id === appointmentId);
    if (!apt) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    if (status) apt.status = status;
    if (slotTime) apt.slot_time = slotTime;
    apt.updated_at = new Date().toISOString();

    return NextResponse.json({
      success: true,
      appointment: apt,
      message: `Appointment ${apt.id} updated.`,
    });
  } catch (err) {
    console.error("Appointment update error:", err);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}
