"use client";

import React, { useState } from "react";
import { LifeBuoy, Send, CheckCircle2, AlertCircle, Clock, ShieldCheck, Upload } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ProblemReport } from "@/types";

export default function ReportProblemPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [recentReports, setRecentReports] = useState<ProblemReport[]>([
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
  ]);

  const [form, setForm] = useState({
    category: "booking" as ProblemReport["category"],
    subject: "",
    description: "",
    relatedBookingId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const newReport: ProblemReport = {
        id: `rep-${Date.now().toString().slice(-4)}`,
        user_id: "demo-patient-001",
        user_name: "Rohit Verma",
        user_email: "patient.demo@mediconnect.org",
        category: form.category,
        subject: form.subject,
        description: form.description,
        related_booking_id: form.relatedBookingId || undefined,
        status: "open",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setRecentReports([newReport, ...recentReports]);
      setLoading(false);
      setSuccess(true);
      setForm({
        category: "booking",
        subject: "",
        description: "",
        relatedBookingId: "",
      });
      setTimeout(() => setSuccess(false), 5000);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <LifeBuoy className="h-6 w-6 text-brand-teal" />
          Report a Problem & Grievance
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Submit technical bugs, billing questions, or hospital experience feedback directly to platform operations.
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 text-xs text-emerald-800 dark:text-emerald-200">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <div>
            <div className="font-semibold">Support Ticket Submitted Successfully</div>
            <div>A confirmation receipt has been dispatched to patient.demo@mediconnect.org. Support SLA: &lt; 24 hours.</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ticket Submission Form */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Submit New Issue</CardTitle>
            <CardDescription className="text-xs">
              All tickets are auditable and monitored by the Chief Medical Officer operations desk.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Category</label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as ProblemReport["category"] })}
                  >
                    <option value="booking">Appointment Booking</option>
                    <option value="payment">Payment & Refund</option>
                    <option value="hospital_experience">Hospital & Bed Experience</option>
                    <option value="technical">Technical Glitch</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Related Booking ID (Optional)</label>
                  <Input
                    placeholder="e.g. bk-9921 or apt-4410"
                    value={form.relatedBookingId}
                    onChange={(e) => setForm({ ...form, relatedBookingId: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Subject / Brief Summary</label>
                <Input
                  required
                  placeholder="e.g. Payment deducted but bed hold showed timeout"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Detailed Description</label>
                <Textarea
                  required
                  rows={4}
                  placeholder="Please provide details including timestamps, doctor/hospital name, and steps taken..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="rounded-xl border border-dashed border-border p-3 text-center space-y-1 bg-muted/20">
                <Upload className="h-5 w-5 text-muted-foreground mx-auto" />
                <div className="text-xs font-medium">Attach Screenshot or Payment Receipt (Optional)</div>
                <Button type="button" variant="outline" size="sm" className="text-xs h-7">
                  Choose File
                </Button>
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" disabled={loading} className="gap-2">
                  <Send className="h-4 w-4" />
                  <span>{loading ? "Submitting..." : "Send Problem Report"}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Support Info & SLA */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand-teal" />
                Platform Escalation Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground leading-relaxed">
              <p>
                <strong>Payment Inquiries:</strong> Unconfirmed charges with Razorpay are checked within 4 hours.
              </p>
              <p>
                <strong>Clinical Feedback:</strong> Hospital complaints are logged with the respective medical superintendent.
              </p>
              <div className="border-t border-border pt-2 mt-2">
                <div className="text-[11px] font-semibold text-foreground">Urgent Contact:</div>
                <div className="text-brand-teal font-semibold">support@mediconnect.org</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Report History */}
      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4 text-brand-teal" />
            My Ticket History & Status
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border p-0">
          {recentReports.map((report) => (
            <div key={report.id} className="p-4 sm:p-5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-foreground">{report.subject}</span>
                  <Badge variant="outline" className="text-[10px] uppercase">
                    {report.category}
                  </Badge>
                </div>
                <Badge
                  variant={
                    report.status === "resolved"
                      ? "success"
                      : report.status === "in_progress"
                      ? "warning"
                      : "secondary"
                  }
                  className="text-xs capitalize"
                >
                  {report.status.replace("_", " ")}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{report.description}</p>

              {report.admin_reply && (
                <div className="rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 p-3 text-xs text-teal-900 dark:text-teal-200 space-y-1 mt-2">
                  <div className="font-semibold flex items-center gap-1.5 text-brand-teal">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Admin Resolution:
                  </div>
                  <div>{report.admin_reply}</div>
                </div>
              )}

              <div className="text-[10px] text-muted-foreground pt-1">
                Ticket ID: {report.id} | Logged: {new Date(report.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
