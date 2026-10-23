import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DEMO_BEDS, DEMO_HOSPITALS } from "@/lib/store/demo-data";
import { Bed } from "@/types";

const holdRequestSchema = z.object({
  bedId: z.string().min(1),
  hospitalId: z.string().min(1),
  patientName: z.string().min(2),
  patientAge: z.number().min(0).max(120),
  patientGender: z.string(),
  patientPhone: z.string().min(10),
  attendantName: z.string().min(2),
  attendantPhone: z.string().min(10),
  reason: z.string().min(5),
  admissionDate: z.string(),
  expectedDays: z.number().min(1).max(90),
  isEmergency: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = holdRequestSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid bed hold request", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      bedId,
      hospitalId,
      patientName,
      patientAge,
      patientGender,
      patientPhone,
      attendantName,
      attendantPhone,
      reason,
      admissionDate,
      expectedDays,
      isEmergency,
    } = parsed.data;

    // Check if Supabase connection is active
    const supabase = createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.rpc("hold_bed", {
        p_bed_id: bedId,
        p_patient_id: "00000000-0000-0000-0000-000000000000",
        p_patient_name: patientName,
        p_patient_age: patientAge,
        p_patient_gender: patientGender,
        p_patient_phone: patientPhone,
        p_attendant_name: attendantName,
        p_attendant_phone: attendantPhone,
        p_reason: reason,
        p_admission_date: admissionDate,
        p_expected_days: expectedDays,
        p_is_emergency: isEmergency,
      });

      if (error || !data?.success) {
        return NextResponse.json(
          { error: data?.error || error?.message || "Failed to acquire atomic bed hold" },
          { status: 409 }
        );
      }

      return NextResponse.json(data);
    }

    // In-Memory Atomic Verification for Sandbox / Local demo
    const targetBed = DEMO_BEDS.find((b) => b.id === bedId);
    if (!targetBed) {
      return NextResponse.json({ error: "Bed not found in inventory" }, { status: 404 });
    }

    // Check availability
    if (targetBed.status !== "available") {
      // Check if previous hold expired
      if (
        targetBed.status === "held" &&
        targetBed.hold_expires_at &&
        new Date(targetBed.hold_expires_at) < new Date()
      ) {
        // expired hold can be reclaimed
      } else {
        return NextResponse.json(
          { error: `Bed ${targetBed.bed_number} is currently ${targetBed.status}. Choose an available bed.` },
          { status: 409 }
        );
      }
    }

    // Emergency check
    if (targetBed.ward === "emergency" && !isEmergency) {
      return NextResponse.json(
        { error: "Emergency ward beds require an emergency booking declaration." },
        { status: 400 }
      );
    }

    // Financial calculation
    const pricePerDay = targetBed.price_per_day;
    const totalPrice = pricePerDay * expectedDays;
    const advancePayable = Math.round(totalPrice * 0.5); // 50%
    const remainingBalance = totalPrice - advancePayable; // 50%
    const holdExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes expiry
    const bookingId = `bk_hold_${Date.now().toString().slice(-6)}`;

    // Update in-memory bed
    targetBed.status = "held";
    targetBed.hold_expires_at = holdExpiresAt;
    targetBed.current_booking_id = bookingId;

    return NextResponse.json({
      success: true,
      bookingId,
      bedId: targetBed.id,
      bedNumber: targetBed.bed_number,
      ward: targetBed.ward,
      hospitalId,
      holdExpiresAt,
      pricePerDay,
      totalPrice,
      advancePayable,
      remainingBalance,
    });
  } catch (err) {
    console.error("Bed hold error:", err);
    return NextResponse.json({ error: "Internal bed hold error" }, { status: 500 });
  }
}
