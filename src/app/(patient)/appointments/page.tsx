"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  ShieldCheck,
  XCircle,
  RefreshCw,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEMO_DOCTORS } from "@/lib/store/demo-data";
import { Appointment, DoctorProfile } from "@/types";

function AppointmentsContent() {
  const searchParams = useSearchParams();
  const preselectedDoctorId = searchParams.get("doctorId");

  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    preselectedDoctorId || DEMO_DOCTORS[0].id
  );
  const [selectedDate, setSelectedDate] = useState<string>("2026-10-25");
  const [selectedSlot, setSelectedSlot] = useState<string>("10:00 AM");

  const [patientDetails, setPatientDetails] = useState({
    name: "Rohit Verma",
    phone: "+91 98290 55443",
    email: "patient.demo@mediconnect.org",
    reason: "Routine cardiovascular checkup & consultation",
    notes: "Previous allergy to Penicillin on file.",
  });

  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);
  const [conflictError, setConflictError] = useState<string>("");

  // Existing Appointments List
  const [myAppointments, setMyAppointments] = useState<Appointment[]>([
    {
      id: "apt-201",
      doctor_id: "doc-001",
      doctor_name: "Dr. Alok Shrivastava",
      doctor_specialty: "Cardiology",
      patient_id: "demo-patient-001",
      patient_name: "Rohit Verma",
      patient_phone: "+91 98290 55443",
      hospital_name: "Kota Heart Institute",
      slot_time: "2026-10-24T10:00:00Z",
      duration_mins: 30,
      fee: 800,
      reason_for_visit: "Post-exertion palpitations & mild dyspnea",
      status: "confirmed",
      payment_status: "captured",
      payment_id: "pay_rzp_test_88190",
      created_at: "2026-10-23T11:00:00Z",
      updated_at: "2026-10-23T11:00:00Z",
    },
  ]);

  useEffect(() => {
    async function loadAppointments() {
      try {
        const res = await fetch("/api/appointments?patientId=demo-patient-001");
        const data = await res.json();
        if (data.success && Array.isArray(data.appointments) && data.appointments.length > 0) {
          setMyAppointments(data.appointments);
        }
      } catch (err) {
        console.error("Failed to load appointments:", err);
      }
    }
    loadAppointments();
  }, []);

  const activeDoctor = DEMO_DOCTORS.find((d) => d.id === selectedDoctorId) || DEMO_DOCTORS[0];

  // Available slots for doctor
  const availableSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
  ];

  const handleBookAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    setConflictError("");

    try {
      // 1. Step 8 & 9: Create order and verify payment on server
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "appointment",
          referenceId: activeDoctor.id,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.error || "Order creation failed");
      }

      // Simulate client-side Razorpay test checkout and server HMAC signature verification
      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.orderId,
          paymentId: `pay_test_${Date.now().toString().slice(-6)}`,
          signature: "simulated_valid_test_signature",
          type: "appointment",
          referenceId: activeDoctor.id,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        throw new Error(verifyData.error || "Payment verification failed");
      }

      // 2. Step 10: Confirm appointment via server API with conflict checking
      const aptRes = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: activeDoctor.id,
          patientName: patientDetails.name,
          patientPhone: patientDetails.phone,
          slotTime: `${selectedDate}T${selectedSlot}:00Z`,
          reasonForVisit: patientDetails.reason,
          patientNotes: patientDetails.notes,
          paymentId: verifyData.paymentId,
        }),
      });

      const aptData = await aptRes.json();
      if (!aptRes.ok || !aptData.success) {
        throw new Error(aptData.error || "Failed to confirm appointment");
      }

      setMyAppointments((prev) => [aptData.appointment, ...prev]);
      setConfirmedBooking(aptData.appointment);
    } catch (err: any) {
      console.error("Booking failed:", err);
      setConflictError(err.message || "Slot conflict or payment failure. Please choose another time.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelAppointment = async (aptId: string) => {
    if (confirm("Are you sure you want to cancel this appointment? The consultation fee will be refunded per policy.")) {
      try {
        const res = await fetch("/api/appointments", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ appointmentId: aptId, status: "cancelled" }),
        });
        const data = await res.json();
        if (data.success) {
          setMyAppointments((prev) =>
            prev.map((a) => (a.id === aptId ? { ...a, status: "cancelled" } : a))
          );
        }
      } catch (err) {
        console.error("Cancel failed:", err);
        setMyAppointments((prev) =>
          prev.map((a) => (a.id === aptId ? { ...a, status: "cancelled" } : a))
        );
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Calendar className="h-6 w-6 text-brand-teal" />
          Schedule Consultation & Appointments
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Select verified medical specialists across Kota hospitals, choose an open slot, and complete checkout.
        </p>
      </div>

      {/* Confirmation Modal / Card */}
      {confirmedBooking && (
        <Card className="border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/40 p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                  Appointment Confirmed & Receipt Dispatched
                </h3>
                <p className="text-xs text-emerald-800 dark:text-emerald-200">
                  Appointment Reference: <strong>{confirmedBooking.id}</strong> | Payment ID: <strong>{confirmedBooking.payment_id}</strong>
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmedBooking(null)}
              className="text-xs"
            >
              Book Another
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900 text-xs">
            <div>
              <div className="text-muted-foreground font-semibold">Doctor</div>
              <div className="font-bold text-foreground">{confirmedBooking.doctor_name}</div>
              <div className="text-[11px] text-brand-teal">{confirmedBooking.doctor_specialty}</div>
            </div>
            <div>
              <div className="text-muted-foreground font-semibold">Hospital</div>
              <div className="font-bold text-foreground">{confirmedBooking.hospital_name}</div>
            </div>
            <div>
              <div className="text-muted-foreground font-semibold">Slot Date & Time</div>
              <div className="font-bold text-foreground">{selectedDate} ({selectedSlot})</div>
            </div>
            <div>
              <div className="text-muted-foreground font-semibold">Fee Paid</div>
              <div className="font-bold text-emerald-700 dark:text-emerald-300">₹{confirmedBooking.fee} (Captured)</div>
            </div>
          </div>
        </Card>
      )}

      {/* Main 2-Column Layout: Booking Form & My Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Step-by-Step Booking Form */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b border-border">
              <CardTitle className="text-base font-semibold">Book Doctor Consultation</CardTitle>
              <CardDescription className="text-xs">
                Guaranteed slot reservation with database conflict prevention.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleBookAndPay} className="space-y-6">
                {/* 1. Doctor Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Stethoscope className="h-4 w-4 text-brand-teal" />
                    1. Select Verified Specialist
                  </label>
                  <select
                    className="flex h-11 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-medium"
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                  >
                    {DEMO_DOCTORS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.full_name} — {d.specialty} ({d.hospital_name}) • ₹{d.consultation_fee}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Doctor Preview Mini-Card */}
                <div className="rounded-xl border border-border bg-muted/20 p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <Image
                      src={activeDoctor.photo_url || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80"}
                      alt={activeDoctor.full_name}
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-xl object-cover border border-border"
                    />
                    <div>
                      <div className="font-bold text-foreground">{activeDoctor.full_name}</div>
                      <div className="text-muted-foreground">{activeDoctor.qualifications.join(", ")}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-base text-foreground">₹{activeDoctor.consultation_fee}</div>
                    <div className="text-[10px] text-muted-foreground">{activeDoctor.appointment_duration_mins} min slot</div>
                  </div>
                </div>

                {/* 2. Date & Time Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-brand-teal" />
                      2. Consultation Date
                    </label>
                    <Input
                      type="date"
                      min="2026-10-24"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-brand-teal" />
                      3. Available Slot
                    </label>
                    <select
                      className="flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-semibold"
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                    >
                      {availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. Patient Details & Reason */}
                <div className="space-y-3 pt-1 border-t border-border">
                  <div className="text-xs font-semibold text-foreground">4. Patient Details & Visit Purpose</div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground">Patient Name</label>
                      <Input
                        value={patientDetails.name}
                        onChange={(e) => setPatientDetails({ ...patientDetails, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground">Contact Phone</label>
                      <Input
                        value={patientDetails.phone}
                        onChange={(e) => setPatientDetails({ ...patientDetails, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-muted-foreground">Reason for Visit / Symptoms</label>
                    <Input
                      value={patientDetails.reason}
                      onChange={(e) => setPatientDetails({ ...patientDetails, reason: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Error Banner */}
                {conflictError && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 p-3 text-xs text-red-800 dark:text-red-300">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{conflictError}</span>
                  </div>
                )}

                {/* Price Breakdown & Razorpay Checkout CTA */}
                <div className="rounded-xl border border-teal-200 dark:border-teal-900 bg-teal-50/60 dark:bg-teal-950/20 p-4 space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Doctor Consultation Fee:</span>
                    <span>₹{activeDoctor.consultation_fee}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Convenience / Platform Fee:</span>
                    <span className="text-emerald-700 font-semibold">₹0 (Free during Kota Pilot)</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-foreground border-t border-teal-200 dark:border-teal-900 pt-2">
                    <span>Total Amount Payable:</span>
                    <span className="text-base text-brand-teal">₹{activeDoctor.consultation_fee}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full h-12 text-sm font-bold gap-2 shadow-sm"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>
                    {bookingLoading
                      ? "Verifying Payment & Holding Slot..."
                      : `Pay ₹${activeDoctor.consultation_fee} via Razorpay & Confirm`}
                  </span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (5 cols): My Existing Appointments */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-brand-teal" />
                My Appointments ({myAppointments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border p-0">
              {myAppointments.map((apt) => (
                <div key={apt.id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-sm text-foreground">{apt.doctor_name}</div>
                      <div className="text-xs text-brand-teal font-medium">{apt.doctor_specialty}</div>
                      <div className="text-[11px] text-muted-foreground">{apt.hospital_name}</div>
                    </div>
                    <Badge
                      variant={apt.status === "confirmed" ? "secondary" : "destructive"}
                      className="text-[10px] uppercase font-semibold"
                    >
                      {apt.status}
                    </Badge>
                  </div>

                  <div className="rounded-lg bg-muted/40 p-2.5 text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1.5 text-foreground font-semibold">
                      <Clock className="h-3.5 w-3.5 text-brand-teal" />
                      <span>{new Date(apt.slot_time).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</span>
                    </div>
                    <div>Reason: {apt.reason_for_visit}</div>
                    <div className="text-[11px]">Ref: {apt.id} • Paid: ₹{apt.fee}</div>
                  </div>

                  {apt.status === "confirmed" && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Payment Verified
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancelAppointment(apt.id)}
                        className="text-xs h-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Cancel Booking
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading appointment schedule...</div>}>
      <AppointmentsContent />
    </Suspense>
  );
}
