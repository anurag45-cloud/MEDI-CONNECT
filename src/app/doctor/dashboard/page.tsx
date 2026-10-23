"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Stethoscope,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Wallet,
  AlertCircle,
  ArrowRight,
  User,
  Activity,
  FileText,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DEMO_DOCTORS } from "@/lib/store/demo-data";
import { Appointment } from "@/types";

export default function DoctorDashboardPage() {
  const doctor = DEMO_DOCTORS[0]; // Dr. Alok Shrivastava

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "apt-101",
      doctor_id: doctor.id,
      doctor_name: doctor.full_name,
      doctor_specialty: doctor.specialty,
      patient_id: "demo-patient-001",
      patient_name: "Rohit Verma",
      patient_phone: "+91 98290 55443",
      slot_time: "2026-10-24T10:00:00Z",
      duration_mins: 30,
      fee: doctor.consultation_fee,
      reason_for_visit: "Post-exertion palpitations & mild dyspnea",
      status: "confirmed",
      payment_status: "captured",
      clinical_notes: "Patient reports sinus tachycardia following aerobic exercise.",
      created_at: "2026-10-22T00:00:00Z",
      updated_at: "2026-10-24T00:00:00Z",
    },
    {
      id: "apt-102",
      doctor_id: doctor.id,
      doctor_name: doctor.full_name,
      doctor_specialty: doctor.specialty,
      patient_id: "usr-pat-002",
      patient_name: "Kavita Singhal",
      patient_phone: "+91 98290 77112",
      slot_time: "2026-10-24T11:00:00Z",
      duration_mins: 30,
      fee: doctor.consultation_fee,
      reason_for_visit: "Hypertension medication review & blood pressure check",
      status: "confirmed",
      payment_status: "captured",
      created_at: "2026-10-23T00:00:00Z",
      updated_at: "2026-10-24T00:00:00Z",
    },
    {
      id: "apt-103",
      doctor_id: doctor.id,
      doctor_name: doctor.full_name,
      doctor_specialty: doctor.specialty,
      patient_id: "usr-pat-003",
      patient_name: "Deepak Meena",
      patient_phone: "+91 98290 33881",
      slot_time: "2026-10-24T09:00:00Z",
      duration_mins: 30,
      fee: doctor.consultation_fee,
      reason_for_visit: "Follow-up lipid profile evaluation",
      status: "completed",
      payment_status: "captured",
      assessment: "LDL controlled on Atorvastatin 20mg.",
      created_at: "2026-10-21T00:00:00Z",
      updated_at: "2026-10-24T09:30:00Z",
    },
  ]);

  const todayCount = appointments.length;
  const completedCount = appointments.filter((a) => a.status === "completed").length;
  const pendingCount = appointments.filter((a) => a.status === "confirmed").length;
  const earningsToday = appointments.filter((a) => a.payment_status === "captured").reduce((sum, a) => sum + a.fee, 0);

  return (
    <div className="max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Doctor Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <Image
            src={doctor.photo_url || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80"}
            alt={doctor.full_name}
            width={64}
            height={64}
            className="h-16 w-16 rounded-2xl object-cover border-2 border-brand-teal shrink-0 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {doctor.full_name}
              </h1>
              <Badge variant="secondary" className="text-[10px] uppercase font-semibold">
                Verified Clinician
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {doctor.specialty} | {doctor.hospital_name} | Reg: {doctor.registration_number}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/doctor/schedule"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-surface text-xs font-semibold hover:bg-muted transition-colors"
          >
            <Calendar className="h-4 w-4 text-brand-teal" />
            <span>Manage Schedule</span>
          </Link>

          <Link
            href="/doctor/profile"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-teal text-white text-xs font-semibold hover:bg-brand-teal-hover transition-colors shadow-sm"
          >
            <User className="h-4 w-4" />
            <span>Doctor Profile</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground font-semibold uppercase">Today&apos;s Consults</div>
              <div className="text-2xl font-bold text-foreground mt-1">{todayCount}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Booked slots</div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-brand-teal dark:bg-teal-950/60 dark:text-teal-300">
              <Calendar className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground font-semibold uppercase">Pending Patients</div>
              <div className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Awaiting consultation</div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground font-semibold uppercase">Completed Today</div>
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{completedCount}</div>
              <div className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80 mt-0.5">Prescriptions finalized</div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground font-semibold uppercase">Today&apos;s Fees Collected</div>
              <div className="text-2xl font-bold text-foreground mt-1">₹{earningsToday}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Verified online payments</div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
              <Wallet className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Queue & Consultation Workspace Shortcut */}
      <Card>
        <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Today&apos;s Consultation Schedule</CardTitle>
            <CardDescription className="text-xs">
              Select an appointment to open the clinical workspace, review medical history, and record assessment notes.
            </CardDescription>
          </div>
          <Link
            href="/doctor/earnings"
            className="text-xs font-semibold text-brand-teal hover:underline"
          >
            View Earnings Ledger
          </Link>
        </CardHeader>
        <CardContent className="divide-y divide-border p-0">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-muted/20 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">{apt.patient_name}</span>
                  <Badge
                    variant={apt.status === "completed" ? "success" : "secondary"}
                    className="text-[10px] uppercase font-semibold"
                  >
                    {apt.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">({apt.patient_phone})</span>
                </div>

                <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    <Clock className="h-3.5 w-3.5 text-brand-teal" />
                    {new Date(apt.slot_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span>Reason: &quot;{apt.reason_for_visit}&quot;</span>
                  <span>Fee: ₹{apt.fee} (Paid)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/doctor/appointments/${apt.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-teal text-white text-xs font-semibold hover:bg-brand-teal-hover transition-colors shadow-sm"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Open Consultation Workspace</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
