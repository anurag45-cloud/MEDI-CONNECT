import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { problemReportSchema } from "@/lib/validation/schemas";
import { ProblemReport } from "@/types";

// In-memory problem reports store for demo / local sandbox mode
const reportsStore: ProblemReport[] = [
  {
    id: "rep-001",
    user_id: "demo-patient-001",
    user_name: "Rohit Verma",
    user_email: "patient.demo@mediconnect.org",
    category: "booking",
    subject: "Appointment slot timing discrepancy",
    description: "Booked 10:00 AM slot for Dr. Alok Shrivastava, SMS receipt displayed 10:30 AM.",
    status: "resolved",
    admin_reply: "Slot corrected to 10:00 AM in Kota Heart Institute database. SMS gateway time synced.",
    created_at: "2026-10-20T14:30:00Z",
    updated_at: "2026-10-21T09:15:00Z",
  },
  {
    id: "rep-002",
    user_id: "usr-pat-002",
    user_name: "Sunil Gautam",
    user_email: "sunil.gautam@example.com",
    category: "payment",
    subject: "Payment verification delay during bed hold",
    description: "Network timeout occurred while holding GEN-04 bed, but advance amount was debited.",
    status: "in_progress",
    admin_reply: "Payment gateway reconciliation underway with Razorpay transaction ID.",
    created_at: "2026-10-24T06:10:00Z",
    updated_at: "2026-10-24T07:00:00Z",
  },
];

const createReportSchema = problemReportSchema.extend({
  userId: z.string().optional(),
  userName: z.string().optional(),
  userEmail: z.string().email().optional(),
});

const patchReportSchema = z.object({
  reportId: z.string().min(1),
  status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
  adminReply: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const category = searchParams.get("category");
  const status = searchParams.get("status");

  const supabase = createServerSupabaseClient();
  if (supabase) {
    let query = supabase.from("problem_reports").select("*");
    if (userId) query = query.eq("user_id", userId);
    if (category) query = query.eq("category", category);
    if (status) query = query.eq("status", status);
    const { data, error } = await query;
    if (!error && data) {
      return NextResponse.json({ success: true, reports: data });
    }
  }

  let filtered = reportsStore;
  if (userId) {
    filtered = filtered.filter((r) => r.user_id === userId);
  }
  if (category) {
    filtered = filtered.filter((r) => r.category === category);
  }
  if (status) {
    filtered = filtered.filter((r) => r.status === status);
  }

  return NextResponse.json({ success: true, reports: filtered });
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = createReportSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid report data", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      category,
      subject,
      description,
      relatedBookingId,
      userId = "demo-patient-001",
      userName = "Rohit Verma",
      userEmail = "patient.demo@mediconnect.org",
    } = parsed.data;

    const supabase = createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("problem_reports")
        .insert({
          user_id: userId,
          user_name: userName,
          user_email: userEmail,
          category,
          subject,
          description,
          related_booking_id: relatedBookingId,
          status: "open",
        })
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({
          success: true,
          report: data,
          message: "Problem report submitted successfully. Ticket created.",
        });
      }
    }

    const newReport: ProblemReport = {
      id: `rep-${Date.now().toString().slice(-4)}`,
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      category,
      subject,
      description,
      related_booking_id: relatedBookingId,
      status: "open",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    reportsStore.unshift(newReport);

    return NextResponse.json({
      success: true,
      report: newReport,
      message: "Problem report submitted successfully. Ticket created.",
    });
  } catch (err) {
    console.error("Report creation error:", err);
    return NextResponse.json(
      { error: "Failed to submit problem report" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = patchReportSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid patch data", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { reportId, status, adminReply } = parsed.data;

    const supabase = createServerSupabaseClient();
    if (supabase) {
      const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (status) updates.status = status;
      if (adminReply !== undefined) updates.admin_reply = adminReply;

      const { data, error } = await supabase
        .from("problem_reports")
        .update(updates)
        .eq("id", reportId)
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({
          success: true,
          report: data,
          message: "Report updated successfully.",
        });
      }
    }

    const target = reportsStore.find((r) => r.id === reportId);
    if (!target) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    if (status) target.status = status;
    if (adminReply !== undefined) target.admin_reply = adminReply;
    target.updated_at = new Date().toISOString();

    return NextResponse.json({
      success: true,
      report: target,
      message: `Report ${target.id} updated.`,
    });
  } catch (err) {
    console.error("Report update error:", err);
    return NextResponse.json(
      { error: "Failed to update problem report" },
      { status: 500 }
    );
  }
}
