"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Stethoscope,
  Building2,
  Users,
  LifeBuoy,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Clock,
  Eye,
  Search,
  Filter,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"applications" | "reports" | "audits">("applications");
  const [adminNotice, setAdminNotice] = useState("");

  // Pending Applications Queue
  const [applications, setApplications] = useState([
    {
      id: "app-doc-01",
      type: "doctor",
      name: "Dr. Rajesh Sharma",
      email: "rajesh.sharma@gmail.com",
      phone: "+91 98290 99881",
      specialty: "Cardiology",
      registrationNo: "RMC/58912/2012",
      authority: "Rajasthan Medical Council",
      experience: "12 years",
      status: "pending",
      submittedAt: "2026-10-23",
    },
    {
      id: "app-hosp-01",
      type: "hospital",
      name: "Apex Multi-Specialty Hospital",
      email: "admin@apexhospital.org",
      phone: "+91 744 240 7711",
      licenseNo: "CEA/RAJ/KOTA/2021/889",
      address: "Plot 5, Main Road, Vigyan Nagar, Kota",
      capacity: "50 Beds",
      status: "pending",
      submittedAt: "2026-10-22",
    },
  ]);

  // Support Tickets Queue
  const [reports, setReports] = useState([
    {
      id: "rep-001",
      user: "Rohit Verma (patient.demo@mediconnect.org)",
      category: "booking",
      subject: "Appointment slot timing discrepancy",
      description: "Booked 10:00 AM slot for Dr. Alok Shrivastava, SMS receipt displayed 10:30 AM.",
      status: "resolved",
      adminReply: "Slot synchronized in Kota Heart Institute database to 10:00 AM.",
      submittedAt: "2026-10-20",
    },
    {
      id: "rep-002",
      user: "Sunil Gautam (patient@example.com)",
      category: "payment",
      subject: "Payment verification delay during bed hold",
      description: "Network timeout occurred while holding GEN-04 bed, but advance amount was debited.",
      status: "in_progress",
      adminReply: "",
      submittedAt: "2026-10-24",
    },
  ]);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState([
    {
      id: "aud-001",
      user: "superadmin@mediconnect.org",
      role: "super_admin",
      action: "DOCTOR_VERIFIED",
      entity: "doctors",
      entityId: "usr-doc-001",
      metadata: "Verified Dr. Alok Shrivastava with Rajasthan Medical Council register",
      timestamp: "2026-10-24 08:30:00",
    },
    {
      id: "aud-002",
      user: "system_kernel",
      role: "system",
      action: "BED_HOLD_ACQUIRED",
      entity: "beds",
      entityId: "GEN-02",
      metadata: "Atomic hold granted for 10 minutes to booking bk_hold_88200",
      timestamp: "2026-10-24 10:45:12",
    },
    {
      id: "aud-003",
      user: "admin@kotaheart.org",
      role: "hospital_admin",
      action: "PATIENT_DISCHARGED",
      entity: "admissions",
      entityId: "adm-901",
      metadata: "Patient Sunil Gautam discharged, bed GEN-04 marked available",
      timestamp: "2026-10-24 11:15:00",
    },
  ]);

  const [replyText, setReplyText] = useState("");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const handleApprove = (id: string, name: string) => {
    setApplications(
      applications.map((app) => (app.id === id ? { ...app, status: "approved" } : app))
    );
    setAdminNotice(`Approved and verified credential for ${name}. Bookable status granted.`);
    setTimeout(() => setAdminNotice(""), 4000);
  };

  const handleReject = (id: string, name: string) => {
    const reason = prompt(`Please specify rejection reason for ${name}:`);
    if (reason) {
      setApplications(
        applications.map((app) => (app.id === id ? { ...app, status: "rejected" } : app))
      );
      setAdminNotice(`Rejected application for ${name}. Reason: ${reason}`);
      setTimeout(() => setAdminNotice(""), 4000);
    }
  };

  const handleSendReply = (reportId: string) => {
    if (!replyText) return;
    setReports(
      reports.map((r) =>
        r.id === reportId ? { ...r, status: "resolved", adminReply: replyText } : r
      )
    );
    setReplyText("");
    setSelectedReportId(null);
    setAdminNotice(`Reply dispatched to patient and report marked resolved.`);
    setTimeout(() => setAdminNotice(""), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Super Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              MediConnect Platform Super-Admin Console
            </h1>
            <Badge variant="destructive" className="text-[10px] uppercase font-bold tracking-wider">
              Privileged Operations
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Supervise medical credentials, hospital licensing, user problem resolution, and immutable audit logs.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border text-xs font-semibold">
          <button
            onClick={() => setActiveTab("applications")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "applications"
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Verification Queue ({applications.filter((a) => a.status === "pending").length})
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "reports"
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Problem Reports ({reports.filter((r) => r.status !== "resolved").length})
          </button>
          <button
            onClick={() => setActiveTab("audits")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "audits"
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Audit Logs
          </button>
        </div>
      </div>

      {adminNotice && (
        <div className="flex items-center gap-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 p-3.5 text-xs text-teal-900 dark:text-teal-200">
          <CheckCircle2 className="h-4 w-4 text-brand-teal shrink-0" />
          <span>Super-Admin Action Recorded: {adminNotice}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase">Pending Verifications</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {applications.filter((a) => a.status === "pending").length}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Doctors & Hospitals</div>
        </Card>

        <Card className="p-4">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase">Verified Doctors</div>
          <div className="text-2xl font-bold text-brand-teal mt-1">30</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Across 12 Specialties</div>
        </Card>

        <Card className="p-4">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase">Accredited Hospitals</div>
          <div className="text-2xl font-bold text-foreground mt-1">8</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Kota Region Pilot</div>
        </Card>

        <Card className="p-4">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase">Open Support Tickets</div>
          <div className="text-2xl font-bold text-sky-600 mt-1">
            {reports.filter((r) => r.status !== "resolved").length}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">&lt; 24h SLA Active</div>
        </Card>
      </div>

      {/* Tab 1: Verification Applications */}
      {activeTab === "applications" && (
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base font-semibold">Practitioner & Facility Verification Queue</CardTitle>
            <CardDescription className="text-xs">
              Every applicant must be independently verified against medical council registers before becoming bookable.
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-border p-0">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs hover:bg-muted/10 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">{app.name}</span>
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {app.type}
                    </Badge>
                    <Badge
                      variant={
                        app.status === "approved"
                          ? "success"
                          : app.status === "rejected"
                          ? "destructive"
                          : "warning"
                      }
                      className="text-[10px] uppercase font-semibold"
                    >
                      {app.status}
                    </Badge>
                  </div>

                  {app.type === "doctor" ? (
                    <div className="text-muted-foreground flex flex-wrap items-center gap-3">
                      <span>Specialty: <strong className="text-foreground">{app.specialty}</strong></span>
                      <span>Reg No: <strong className="text-brand-teal">{app.registrationNo}</strong> ({app.authority})</span>
                      <span>Email: {app.email}</span>
                      <span>Submitted: {app.submittedAt}</span>
                    </div>
                  ) : (
                    <div className="text-muted-foreground flex flex-wrap items-center gap-3">
                      <span>License: <strong className="text-brand-teal">{app.licenseNo}</strong></span>
                      <span>Capacity: <strong className="text-foreground">{app.capacity}</strong></span>
                      <span>Location: {app.address}</span>
                      <span>Submitted: {app.submittedAt}</span>
                    </div>
                  )}
                </div>

                {app.status === "pending" && (
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(app.id, app.name)}
                      className="gap-1.5 text-xs font-semibold h-9"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Approve & Verify
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReject(app.id, app.name)}
                      className="gap-1.5 text-xs font-semibold h-9 text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Support & Problem Reports */}
      {activeTab === "reports" && (
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base font-semibold">User Grievances & Problem Resolution</CardTitle>
            <CardDescription className="text-xs">
              Inspect patient and hospital reports, append administrative responses, and send email resolutions.
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-border p-0">
            {reports.map((rep) => (
              <div key={rep.id} className="p-5 space-y-3 text-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{rep.subject}</span>
                      <Badge variant="outline" className="text-[10px] uppercase">
                        {rep.category}
                      </Badge>
                      <Badge
                        variant={rep.status === "resolved" ? "success" : "warning"}
                        className="text-[10px] uppercase font-semibold"
                      >
                        {rep.status}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground">From: {rep.user} | Logged: {rep.submittedAt}</div>
                  </div>

                  {rep.status !== "resolved" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedReportId(rep.id)}
                      className="text-xs h-8"
                    >
                      Resolve & Reply
                    </Button>
                  )}
                </div>

                <p className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg border border-border">
                  &quot;{rep.description}&quot;
                </p>

                {rep.adminReply && (
                  <div className="rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 p-3 text-teal-900 dark:text-teal-200 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-brand-teal">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Admin Resolution Dispatched:
                    </div>
                    <div>{rep.adminReply}</div>
                  </div>
                )}

                {/* Reply Form */}
                {selectedReportId === rep.id && (
                  <div className="pt-2 space-y-2 border-t border-border">
                    <label className="font-semibold text-foreground">Author Administrative Resolution Reply</label>
                    <Textarea
                      rows={3}
                      placeholder="Enter resolution instructions to be dispatched via email..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="text-xs"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedReportId(null)}
                        className="text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleSendReply(rep.id)}
                        className="text-xs font-semibold"
                      >
                        Dispatch Resolution
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Immutable Audit Logs */}
      {activeTab === "audits" && (
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base font-semibold">System Audit Trail & Access Logs</CardTitle>
            <CardDescription className="text-xs">
              Append-only audit ledger recording every privileged clinician verification, bed state change, and admission transaction.
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-border p-0 font-mono text-[11px]">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 space-y-1 hover:bg-muted/20 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-brand-teal">[{log.action}]</span>
                  <span className="text-muted-foreground">{log.timestamp}</span>
                </div>
                <div className="text-foreground">
                  User: <strong>{log.user}</strong> ({log.role}) → Entity: {log.entity} (#{log.entityId})
                </div>
                <div className="text-muted-foreground">{log.metadata}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
