import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createRazorpayOrder } from "@/lib/payments/razorpay";
import { DEMO_DOCTORS, DEMO_HOSPITALS } from "@/lib/store/demo-data";

const createOrderSchema = z.object({
  type: z.enum(["appointment", "bed_advance"]),
  referenceId: z.string().min(1),
  expectedDays: z.number().min(1).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = createOrderSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payment request payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { type, referenceId, expectedDays } = parsed.data;
    let payablePaise = 0;
    let receiptPrefix = "rec_";

    if (type === "appointment") {
      // Find doctor and retrieve real fee from verified catalog (NEVER TRUST BROWSER AMOUNT!)
      const doctor = DEMO_DOCTORS.find((d) => d.id === referenceId);
      if (!doctor) {
        return NextResponse.json({ error: "Doctor not found or unverified" }, { status: 404 });
      }
      payablePaise = doctor.consultation_fee * 100; // in integer paise
      receiptPrefix = `apt_${doctor.id.slice(-4)}_`;
    } else if (type === "bed_advance") {
      // Bed advance calculation: 50% of (price_per_day * days)
      const days = expectedDays || 1;
      const bedPricePerDay = 1500; // General bed standard rate
      const totalCost = bedPricePerDay * days;
      const advancePayable = Math.round(totalCost * 0.5);
      payablePaise = advancePayable * 100; // in paise
      receiptPrefix = `bed_${referenceId.slice(-4)}_`;
    }

    const orderReceipt = `${receiptPrefix}${Date.now().toString().slice(-6)}`;
    const order = await createRazorpayOrder({
      amountPaise: payablePaise,
      receipt: orderReceipt,
      notes: {
        type,
        referenceId,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      keyId: order.keyId,
    });
  } catch (err) {
    console.error("Order creation failed:", err);
    return NextResponse.json(
      { error: "Payment order creation failed on server" },
      { status: 500 }
    );
  }
}
