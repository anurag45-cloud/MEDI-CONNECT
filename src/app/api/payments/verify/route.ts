import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyRazorpaySignature } from "@/lib/payments/razorpay";

const verifySchema = z.object({
  orderId: z.string().min(1),
  paymentId: z.string().min(1),
  signature: z.string().min(1),
  type: z.enum(["appointment", "bed_advance"]),
  referenceId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = verifySchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payment verification payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { orderId, paymentId, signature, type, referenceId } = parsed.data;

    // Cryptographic HMAC SHA256 Signature Verification
    const isValid = verifyRazorpaySignature({
      orderId,
      paymentId,
      signature,
    });

    if (!isValid) {
      console.warn("Payment signature verification failed for order:", orderId);
      return NextResponse.json(
        { error: "Cryptographic payment signature verification failed" },
        { status: 400 }
      );
    }

    // Payment is mathematically verified
    return NextResponse.json({
      success: true,
      message: "Payment cryptographically verified",
      paymentId,
      orderId,
      verifiedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Payment verification route error:", err);
    return NextResponse.json(
      { error: "Payment verification error" },
      { status: 500 }
    );
  }
}
