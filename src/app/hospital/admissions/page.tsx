"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UserCheck,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldCheck,
  UserX,
  FileText,
  AlertCircle,
  BedDouble,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface AdmissionRecord {
  id: string;
  bookingRef: string;
  patientName: string;
  age: number;
  phone: string;
  attendant: string;
  ward: string;
  bedNumber: string;
  admissionDate: string;
  status: "reserved" | "admitted" | "discharged";
  admittedAt?: string;
  dischargedAt?: string;
  admissionNotes?: string;
  dischargeNotes?: string;
  advancePaid: number;
  balanceDue: number;
}

export default function HospitalAdmissionsPage() {
  const [admissions, setAdmissions] = useState<AdmissionRecord[]>([
    {
      id: "adm-901",
      bookingRef: "bk_hold_88120",
      patientName: "Sunil Gautam",
      age: 58,
      phone: "+91 98290 88219",
      attendant: "Rekha Gautam (+91 98290 88220)",
      ward: "General Ward",
      bedNumber: "GEN-04",
      admissionDate: "2026-10-22",
      status: "admitted",
      admittedAt: "2026-10-22 09:30 AM",
      admissionNotes: "Admitted under Dr. Alok Shrivastava for telemetry monitoring.",
      advancePaid: 2250,
      balanceDue: 2250,
    },
    {
      id: "adm-902",
      bookingRef: "bk_hold_88145",
      patientName: "Priyanka Joshi",
      age: 44,
      phone: "+91 98290 11982",
      attendant: "Manish Joshi (+91 98290 11983)",
      ward: "Emergency CCU",
      bedNumber: "EMG-04",
      admissionDate: "2026-10-23",
      status: "admitted",
      admittedAt: "2026-10-23 04:15 PM",
      admissionNotes: "Admitted via casualty for acute unstable angina observation.",
      advancePaid: 5250,
      balanceDue: 5250,
    },
    {
      id: "adm-903",
      bookingRef: "bk_hold_88200",
      patientName: "Rohit Verma",
      age: 31,
      phone: "+91 98290 55443",
      attendant: "Sanjay Verma (+91 98290 12345)",
      ward: "General Ward",
      bedNumber: "GEN-02",
      admissionDate: "2026-10-25",
      status: "reserved",
      advancePaid: 2250,
      balanceDue: 2250,
    },
  ]);

  const [auditMessage, setAuditMessage] = useState("");

  const handleCheckIn = (admId: string) => {
    const timeNow = new Date().toLocaleString([], { dateStyle: "short", timeStyle: "short" });
    setAdmissions(
      admissions.map((a) =>
        a.id === admId ? { ...a, status: "admitted", admittedAt: timeNow } : a
      )
    );
    setAuditMessage(`Check-in recorded for admission ${admId}. Bed state locked as OCCUPIED.`);
    setTimeout(() => setAuditMessage(""), 4000);
  };

  const handleDischarge = (admId: string) => {
    const target = admissions.find((a) => a.id === admId);
    if (!target) return;

    if (
      confirm(
        `Confirm discharge for ${target.patientName}? This will settle the remaining balance of ₹${target.balanceDue} and transactionally release Bed #${target.bedNumber} back to available inventory.`
      )
    ) {
      const timeNow = new Date().toLocaleString([], { dateStyle: "short", timeStyle: "short" });
      setAdmissions(
        admissions.map((a) =>
          a.id === admId ? { ...a, status: "discharged", dischargedAt: timeNow } : a
        )
      );
      setAuditMessage(`Discharge finalized for ${target.patientName}. Bed #${target.bedNumber} released to inventory.`);
      setTimeout(() => setAuditMessage(""), 5000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <Link
            href="/hospital/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Hospital Dashboard
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-brand-teal" />
            Patient Inpatient Admissions & Discharge Desk
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Record physical check-ins, verify 50% advance receipts, and execute transactional bed release at discharge.
          </p>
        </div>
      </div>

      {auditMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 p-3.5 text-xs text-teal-900 dark:text-teal-200">
          <CheckCircle2 className="h-4 w-4 text-brand-teal shrink-0" />
          <span>{auditMessage}</span>
        </div>
      )}

      {/* Admissions List */}
      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-base font-semibold">Active Admissions & Reservations Queue</CardTitle>
          <CardDescription className="text-xs">
            Review booked reservations awaiting check-in, current inpatients, and discharge records.
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border p-0">
          {admissions.map((adm) => (
            <div
              key={adm.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs hover:bg-muted/10 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">{adm.patientName}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {adm.age} yrs • {adm.phone}
                  </Badge>
                  <Badge
                    variant={
                      adm.status === "admitted"
                        ? "destructive"
                        : adm.status === "reserved"
                        ? "secondary"
                        : "success"
                    }
                    className="text-[10px] uppercase font-semibold"
                  >
                    {adm.status}
                  </Badge>
                </div>

                <div className="text-muted-foreground flex flex-wrap items-center gap-3">
                  <span>
                    Location: <strong className="text-foreground">{adm.ward} (Bed #{adm.bedNumber})</strong>
                  </span>
                  <span>Attendant: {adm.attendant}</span>
                  <span>Booking Ref: {adm.bookingRef}</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground pt-0.5">
                  <span>Advance Paid: <strong className="text-emerald-700">₹{adm.advancePaid}</strong></span>
                  <span>Balance Due at Discharge: <strong className="text-amber-700">₹{adm.balanceDue}</strong></span>
                  {adm.admittedAt && <span>Admitted: {adm.admittedAt}</span>}
                  {adm.dischargedAt && <span>Discharged: {adm.dischargedAt}</span>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {adm.status === "reserved" && (
                  <Button
                    size="sm"
                    onClick={() => handleCheckIn(adm.id)}
                    className="gap-1.5 text-xs font-semibold h-9"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>Check-In Patient</span>
                  </Button>
                )}

                {adm.status === "admitted" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDischarge(adm.id)}
                    className="gap-1.5 text-xs font-semibold h-9 text-red-700 border-red-300 hover:bg-red-50"
                  >
                    <UserX className="h-3.5 w-3.5" />
                    <span>Discharge & Release Bed</span>
                  </Button>
                )}

                {adm.status === "discharged" && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Discharged & Bed Released
                  </span>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
