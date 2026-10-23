import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export function getResendClient(): Resend | null {
  if (!apiKey || apiKey.includes("yourresend")) {
    return null;
  }
  return new Resend(apiKey);
}

export async function sendTransactionalEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; messageId?: string }> {
  const client = getResendClient();

  if (client) {
    try {
      const response = await client.emails.send({
        from: "MediConnect Platform <notifications@mediconnect.org>",
        to,
        subject,
        html,
      });

      return {
        success: true,
        messageId: response.data?.id,
      };
    } catch (err) {
      console.error("Resend API error:", err);
      return { success: false };
    }
  }

  // Safe Console Simulation when RESEND_API_KEY is not configured
  console.log(`[Resend Email Mock Dispatch] To: ${to} | Subject: "${subject}"`);
  return {
    success: true,
    messageId: `sim_msg_${Date.now()}`,
  };
}

export async function sendAppointmentConfirmationEmail({
  patientEmail,
  patientName,
  doctorName,
  hospitalName,
  slotTime,
  fee,
}: {
  patientEmail: string;
  patientName: string;
  doctorName: string;
  hospitalName: string;
  slotTime: string;
  fee: number;
}) {
  return sendTransactionalEmail({
    to: patientEmail,
    subject: `Confirmed: Consultation with ${doctorName}`,
    html: `
      <h2>Appointment Confirmed</h2>
      <p>Dear ${patientName},</p>
      <p>Your consultation with <strong>${doctorName}</strong> at <strong>${hospitalName}</strong> is confirmed.</p>
      <p><strong>Scheduled Time:</strong> ${slotTime}</p>
      <p><strong>Fee Paid:</strong> ₹${fee}</p>
      <p>Please arrive 15 minutes prior to scheduled slot with relevant previous reports.</p>
    `,
  });
}

export async function sendBedConfirmationEmail({
  patientEmail,
  patientName,
  hospitalName,
  ward,
  bedNumber,
  advancePaid,
  balanceDue,
}: {
  patientEmail: string;
  patientName: string;
  hospitalName: string;
  ward: string;
  bedNumber: string;
  advancePaid: number;
  balanceDue: number;
}) {
  return sendTransactionalEmail({
    to: patientEmail,
    subject: `Confirmed: Bed Reservation at ${hospitalName}`,
    html: `
      <h2>Bed Reservation Confirmed</h2>
      <p>Dear ${patientName},</p>
      <p>Your inpatient bed reservation has been confirmed at <strong>${hospitalName}</strong>.</p>
      <p><strong>Ward:</strong> ${ward.toUpperCase()}</p>
      <p><strong>Bed Number:</strong> #${bedNumber}</p>
      <p><strong>50% Advance Paid:</strong> ₹${advancePaid}</p>
      <p><strong>Remaining Balance Due at Discharge:</strong> ₹${balanceDue}</p>
    `,
  });
}
