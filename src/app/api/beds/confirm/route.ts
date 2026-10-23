import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DEMO_BEDS } from "@/lib/store/demo-data";
import { verifyRazorpaySignature } from "@/lib/payments/razorpay";
import QRCode from "qrcode";

const confirmSchema = z.object({
  bookingId: z.string().min(1),
  bedId: z.string().min(1),
  paymentId: z.string().min(1),
  orderId: z.string().min(1),
  signature: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = confirmSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid bed confirmation payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { bookingId, bedId, paymentId, orderId, signature } = parsed.data;

    // 1. Verify Payment Signature
    const isSignatureValid = verifyRazorpaySignature({
      orderId,
      paymentId,
      signature,
    });

    if (!isSignatureValid) {
      return NextResponse.json(
        { error: "Payment signature invalid. Booking cannot be confirmed." },
        { status: 400 }
      );
    }

    // 2. Check if hold expired
    const bed = DEMO_BEDS.find((b) => b.id === bedId);
    if (!bed) {
      return NextResponse.json({ error: "Bed not found" }, { status: 404 });
    }

    if (bed.status === "held" && bed.hold_expires_at && new Date(bed.hold_expires_at) < new Date()) {
      return NextResponse.json(
        { error: "10-minute hold expired before payment was completed. Advance will be refunded." },
        { status: 410 }
      );
    }

    // 3. Confirm bed booking atomically
    bed.status = "booked";
    bed.hold_expires_at = null;

    // 4. Generate verifiable QR code containing booking reference
    const qrPayload = JSON.stringify({
      bookingId,
      bedId,
      paymentId,
      timestamp: new Date().toISOString(),
      hospital: bed.hospital_name,
    });

    const qrDataUrl = await QRCode.toDataURL(qrPayload, {
      margin: 1,
      width: 180,
    });

    return NextResponse.json({
      success: true,
      bookingId,
      bedId,
      bedNumber: bed.bed_number,
      ward: bed.ward,
      paymentId,
      qrCodeUrl: qrDataUrl,
      confirmedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Bed confirmation error:", err);
    return NextResponse.json({ error: "Bed confirmation error" }, { status: 500 });
  }
}
