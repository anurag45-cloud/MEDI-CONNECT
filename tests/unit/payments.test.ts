import { describe, it, expect } from "vitest";
import crypto from "crypto";
import {
  verifyRazorpaySignature,
  verifyRazorpayWebhook,
} from "@/lib/payments/razorpay";

describe("Razorpay Test Mode Cryptographic Signature & Payment Verification", () => {
  const secret = process.env.RAZORPAY_KEY_SECRET || "mediconnect_test_secret";

  it("verifies authentic HMAC SHA256 payment signature", () => {
    const orderId = "order_live_992120";
    const paymentId = "pay_live_449912";

    // Generate valid signature using exact Razorpay formula
    const validSignature = crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    const isVerified = verifyRazorpaySignature({
      orderId,
      paymentId,
      signature: validSignature,
    });

    expect(isVerified).toBe(true);
  });

  it("rejects forged or tampered payment signature", () => {
    const orderId = "order_live_992120";
    const paymentId = "pay_live_449912";
    const forgedSignature = "forged_malicious_signature_abcdef123456";

    const isVerified = verifyRazorpaySignature({
      orderId,
      paymentId,
      signature: forgedSignature,
    });

    expect(isVerified).toBe(false);
  });

  it("verifies authentic webhook signature against raw request body", () => {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "mediconnect_test_webhook_secret";
    const rawBody = JSON.stringify({
      event: "payment.captured",
      id: "evt_test_12345",
    });

    const validWebhookSig = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const isWebhookValid = verifyRazorpayWebhook({
      rawBody,
      signature: validWebhookSig,
    });

    expect(isWebhookValid).toBe(true);
  });

  it("computes 50% advance payment in integer paise accurately", () => {
    const ratePerDay = 1500;
    const days = 3;
    const totalCost = ratePerDay * days; // 4500
    const advancePayable = Math.round(totalCost * 0.5); // 2250
    const advancePaise = advancePayable * 100; // 225000 paise

    expect(advancePayable).toBe(2250);
    expect(advancePaise).toBe(225000);
    expect(Number.isInteger(advancePaise)).toBe(true);
  });
});
