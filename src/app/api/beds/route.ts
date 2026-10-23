import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DEMO_BEDS, DEMO_HOSPITALS } from "@/lib/store/demo-data";
import { Bed, BedStatus, WardType } from "@/types";

const patchBedSchema = z.object({
  bedId: z.string().min(1),
  status: z.enum(["available", "held", "booked", "occupied", "out_of_service"]),
  hospitalId: z.string().optional(),
  dischargeNotes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const hospitalId = searchParams.get("hospitalId");
  const ward = searchParams.get("ward") as WardType | null;

  // Auto-expire held beds whose 10-minute hold window has elapsed
  const now = new Date();
  DEMO_BEDS.forEach((bed) => {
    if (bed.status === "held" && bed.hold_expires_at && new Date(bed.hold_expires_at) < now) {
      bed.status = "available";
      bed.hold_expires_at = null;
      bed.current_booking_id = null;
    }
  });

  const supabase = createServerSupabaseClient();
  if (supabase) {
    let query = supabase.from("beds").select("*");
    if (hospitalId) query = query.eq("hospital_id", hospitalId);
    if (ward) query = query.eq("ward", ward);
    const { data, error } = await query;
    if (!error && data) {
      const stats = {
        total: data.length,
        available: data.filter((b) => b.status === "available").length,
        emergencyAvailable: data.filter((b) => b.ward === "emergency" && b.status === "available").length,
        held: data.filter((b) => b.status === "held").length,
        booked: data.filter((b) => b.status === "booked").length,
        occupied: data.filter((b) => b.status === "occupied").length,
      };
      return NextResponse.json({ success: true, beds: data, stats });
    }
  }

  let beds = DEMO_BEDS;
  if (hospitalId) {
    beds = beds.filter((b) => b.hospital_id === hospitalId);
  }
  if (ward) {
    beds = beds.filter((b) => b.ward === ward);
  }

  const stats = {
    total: beds.length,
    available: beds.filter((b) => b.status === "available").length,
    emergencyAvailable: beds.filter((b) => b.ward === "emergency" && b.status === "available").length,
    held: beds.filter((b) => b.status === "held").length,
    booked: beds.filter((b) => b.status === "booked").length,
    occupied: beds.filter((b) => b.status === "occupied").length,
  };

  return NextResponse.json({
    success: true,
    beds,
    stats,
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = patchBedSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid bed update payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { bedId, status, dischargeNotes } = parsed.data;

    const bed = DEMO_BEDS.find((b) => b.id === bedId);
    if (!bed) {
      return NextResponse.json({ error: "Bed not found in inventory" }, { status: 404 });
    }

    // Safety Constraint: Occupied beds cannot be returned directly to available without discharge verification
    if (bed.status === "occupied" && status === "available" && !dischargeNotes) {
      return NextResponse.json(
        {
          error: "Safety policy: Occupied bed requires clinical discharge confirmation before returning to available inventory.",
        },
        { status: 400 }
      );
    }

    bed.status = status;
    bed.updated_at = new Date().toISOString();
    if (status === "available") {
      bed.hold_expires_at = null;
      bed.current_booking_id = null;
    }

    const supabase = createServerSupabaseClient();
    if (supabase) {
      await supabase
        .from("beds")
        .update({
          status,
          hold_expires_at: status === "available" ? null : undefined,
          current_booking_id: status === "available" ? null : undefined,
          updated_at: new Date().toISOString(),
        })
        .eq("id", bedId);
    }

    return NextResponse.json({
      success: true,
      bed,
      message: `Bed ${bed.bed_number} status updated to ${status}.`,
    });
  } catch (err) {
    console.error("Bed update error:", err);
    return NextResponse.json({ error: "Failed to update bed status" }, { status: 500 });
  }
}
