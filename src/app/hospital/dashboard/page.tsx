"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  BedDouble,
  ShieldAlert,
  Users,
  Activity,
  ArrowRight,
  UserCheck,
  LogOut,
  Calendar,
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DEMO_HOSPITALS, DEMO_BEDS, DEMO_DOCTORS } from "@/lib/store/demo-data";

export default function HospitalDashboardPage() {
  const hospital = DEMO_HOSPITALS[0]; // Kota Heart Institute
  const hospitalBeds = DEMO_BEDS.filter((b) => b.hospital_id === hospital.id);

  const totalBeds = hospitalBeds.length;
  const availableBeds = hospitalBeds.filter((b) => b.status === "available").length;
  const heldBeds = hospitalBeds.filter((b) => b.status === "held").length;
  const bookedBeds = hospitalBeds.filter((b) => b.status === "booked").length;
  const occupiedBeds = hospitalBeds.filter((b) => b.status === "occupied").length;
  const emergencyAvailable = hospitalBeds.filter(
    (b) => b.ward === "emergency" && b.status === "available"
  ).length;

  const [activeInpatients, setActiveInpatients] = useState([
    {
      admissionId: "adm-901",
      patientName: "Sunil Gautam",
      age: 58,
      ward: "General Ward",
      bedNumber: "GEN-04",
      admittedAt: "2026-10-22 09:30 AM",
      expectedDischarge: "2026-10-25",
      treatingDoctor: "Dr. Alok Shrivastava",
      status: "admitted",
    },
    {
      admissionId: "adm-902",
      patientName: "Priyanka Joshi",
      age: 44,
      ward: "Emergency CCU",
      bedNumber: "EMG-04",
      admittedAt: "2026-10-23 04:15 PM",
      expectedDischarge: "2026-10-26",
      treatingDoctor: "Dr. Sunita Pareek",
      status: "admitted",
    },
  ]);

  return (
    <div className="max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {hospital.name}
            </h1>
            <Badge variant="secondary" className="text-[10px] uppercase font-semibold">
              Accredited Partner
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Operational Dashboard | License: CEA/RAJ/KOTA/892 | Admin Desk: Vikas Saxena
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/hospital/beds"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-teal text-white text-xs font-semibold hover:bg-brand-teal-hover transition-colors shadow-sm"
          >
            <BedDouble className="h-4 w-4" />
            <span>Manage Bed Grid</span>
          </Link>
          <Link
            href="/hospital/admissions"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-surface text-xs font-semibold hover:bg-muted transition-colors"
          >
            <UserCheck className="h-4 w-4 text-brand-teal" />
            <span>Admissions & Discharges</span>
          </Link>
          <Link
            href="/hospital/team"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-surface text-xs font-semibold hover:bg-muted transition-colors"
          >
            <Users className="h-4 w-4" />
            <span>Staff & Doctors</span>
          </Link>
        </div>
      </div>

      {/* Real-time Ward Inventory Snapshot (Section 10.1) */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        <Card className="p-4 text-center">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase">Licensed Beds</div>
          <div className="text-2xl font-bold text-foreground mt-1">{totalBeds}</div>
        </Card>

        <Card className="p-4 text-center bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200">
          <div className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Available</div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{availableBeds}</div>
        </Card>

        <Card className="p-4 text-center bg-red-50/50 dark:bg-red-950/30 border-red-200">
          <div className="text-[10px] font-semibold text-red-800 dark:text-red-300 uppercase">Emergency Ready</div>
          <div className="text-2xl font-bold text-brand-emergency mt-1">{emergencyAvailable}</div>
        </Card>

        <Card className="p-4 text-center bg-amber-50/50 dark:bg-amber-950/30 border-amber-200">
          <div className="text-[10px] font-semibold text-amber-800 dark:text-amber-300 uppercase">Held (10-Min)</div>
          <div className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1">{heldBeds}</div>
        </Card>

        <Card className="p-4 text-center bg-teal-50/50 dark:bg-teal-950/30 border-teal-200">
          <div className="text-[10px] font-semibold text-brand-teal uppercase">Reserved/Booked</div>
          <div className="text-2xl font-bold text-brand-teal mt-1">{bookedBeds}</div>
        </Card>

        <Card className="p-4 text-center bg-slate-100 dark:bg-slate-800">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase">Admitted Inpatients</div>
          <div className="text-2xl font-bold text-foreground mt-1">{occupiedBeds}</div>
        </Card>
      </div>

      {/* Main Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Inpatient Ward Admissions */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Active Inpatient Ward Admissions</CardTitle>
                <CardDescription className="text-xs">
                  Patients currently occupying beds. Discharge releases bed atomically back to inventory.
                </CardDescription>
              </div>
              <Link
                href="/hospital/admissions"
                className="text-xs font-semibold text-brand-teal hover:underline inline-flex items-center gap-1"
              >
                Full Admissions Queue <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="divide-y divide-border p-0">
              {activeInpatients.map((adm) => (
                <div key={adm.admissionId} className="p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-foreground flex items-center gap-2">
                      <span>{adm.patientName} ({adm.age} yrs)</span>
                      <Badge variant="outline" className="text-[10px] uppercase">
                        {adm.admissionId}
                      </Badge>
                    </div>
                    <Badge variant="destructive" className="text-[10px] uppercase font-semibold">
                      INPATIENT ADMITTED
                    </Badge>
                  </div>

                  <div className="text-muted-foreground grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    <div>Ward: <strong className="text-foreground">{adm.ward}</strong></div>
                    <div>Bed: <strong className="text-brand-teal font-mono">#{adm.bedNumber}</strong></div>
                    <div>Doctor: <strong className="text-foreground">{adm.treatingDoctor}</strong></div>
                    <div>Admitted: {adm.admittedAt}</div>
                    <div>Expected Discharge: {adm.expectedDischarge}</div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <Link
                      href="/hospital/admissions"
                      className="text-xs font-semibold text-brand-teal hover:underline"
                    >
                      Process Discharge & Release Bed →
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Associated Doctors & Finance Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Wallet className="h-4 w-4 text-brand-teal" />
                Hospital Financial Ledger
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-3 text-xs leading-relaxed">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Today&apos;s Bed Advances:</span>
                <span className="font-bold text-foreground">₹28,500</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Discharge Balances Due:</span>
                <span className="font-bold text-amber-600">₹14,000</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">OPD Appointments Revenue:</span>
                <span className="font-bold text-foreground">₹16,400</span>
              </div>
              <div className="pt-1">
                <Link
                  href="/hospital/finance"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-teal hover:underline"
                >
                  <span>View Detailed Finance & Settlement Report</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-brand-teal" />
                Departmental Clinicians (3)
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border p-0 text-xs">
              <div className="p-3">
                <div className="font-semibold text-foreground">Dr. Alok Shrivastava</div>
                <div className="text-[11px] text-brand-teal">Head of Cardiology</div>
              </div>
              <div className="p-3">
                <div className="font-semibold text-foreground">Dr. Sunita Pareek</div>
                <div className="text-[11px] text-brand-teal">Consultant Cardiologist</div>
              </div>
              <div className="p-3">
                <div className="font-semibold text-foreground">Dr. Rajeshwar Mittal</div>
                <div className="text-[11px] text-brand-teal">Visiting Orthopedic Surgeon</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
