import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpayWebhook } from "@/lib/payments/razorpay";

// In-memory idempotency cache for webhook event IDs to prevent duplicate processing
const processedWebhookEvents = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing x-razorpay-signature header" },
        { status: 400 }
      );
    }

    const isValid = verifyRazorpayWebhook({
      rawBody,
      signature,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid webhook HMAC signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(rawBody);
    const eventId = event.event_id || event.id;

    // Idempotency check: Reject duplicate webhooks
    if (eventId && processedWebhookEvents.has(eventId)) {
      return NextResponse.json({
        status: "ignored",
        message: "Duplicate webhook event already processed",
      });
    }

    if (eventId) {
      processedWebhookEvents.add(eventId);
    }

    // Process payment events
    switch (event.event) {
      case "payment.captured": {
        const payment = event.payload?.payment?.entity;
        console.log(`[Webhook] Payment captured: ${payment?.id}, Amount: ${payment?.amount}`);
        // Synchronize with database payment and booking status
        break;
      }
      case "payment.failed": {
        const payment = event.payload?.payment?.entity;
        console.warn(`[Webhook] Payment failed: ${payment?.id}, Error: ${payment?.error_description}`);
        break;
      }
      case "refund.processed": {
        const refund = event.payload?.refund?.entity;
        console.log(`[Webhook] Refund processed: ${refund?.id}, Payment: ${refund?.payment_id}`);
        break;
      }
      default:
        console.log(`[Webhook] Unhandled event: ${event.event}`);
    }

    return NextResponse.json({
      status: "success",
      received: true,
      eventId,
    });
  } catch (err) {
    console.error("Razorpay webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook processing error" },
      { status: 500 }
    );
  }
}
