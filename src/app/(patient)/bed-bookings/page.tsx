"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BedDouble,
  ShieldAlert,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  CreditCard,
  QrCode,
  Download,
  Activity,
  ArrowRight,
  Info,
  Calendar,
  User,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEMO_HOSPITALS, DEMO_BEDS } from "@/lib/store/demo-data";
import { Bed, BedBooking, BedStatus, WardType } from "@/types";

function BedBookingsContent() {
  const searchParams = useSearchParams();
  const preselectedHospitalId = searchParams.get("hospitalId") || DEMO_HOSPITALS[0].id;

  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(preselectedHospitalId);
  const [selectedWard, setSelectedWard] = useState<WardType>("general");
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);

  // Form State
  const [patientName, setPatientName] = useState("Rohit Verma");
  const [patientAge, setPatientAge] = useState<number>(31);
  const [patientGender, setPatientGender] = useState("male");
  const [patientPhone, setPatientPhone] = useState("+91 98290 55443");
  const [attendantName, setAttendantName] = useState("Sanjay Verma");
  const [attendantPhone, setAttendantPhone] = useState("+91 98290 12345");
  const [reason, setReason] = useState("Acute observation for fluctuating blood pressure");
  const [admissionDate, setAdmissionDate] = useState("2026-10-25");
  const [expectedDays, setExpectedDays] = useState<number>(3);
  const [isEmergency, setIsEmergency] = useState(false);

  // Hold & Transaction State
  const [heldBooking, setHeldBooking] = useState<{
    bookingId: string;
    bedId: string;
    holdExpiresAt: string;
    totalPrice: number;
    advancePayable: number;
    remainingBalance: number;
  } | null>(null);

  const [holdSecondsRemaining, setHoldSecondsRemaining] = useState<number>(600); // 10 minutes
  const [holdLoading, setHoldLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    bookingId: string;
    bedNumber: string;
    ward: string;
    paymentId: string;
    qrCodeUrl: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const activeHospital = DEMO_HOSPITALS.find((h) => h.id === selectedHospitalId) || DEMO_HOSPITALS[0];

  // Beds in currently selected hospital and ward
  const bedsInView = useMemo(() => {
    return DEMO_BEDS.filter(
      (b) => b.hospital_id === activeHospital.id && b.ward === selectedWard
    );
  }, [activeHospital.id, selectedWard]);

  // Overall statistics for active hospital
  const hospitalBeds = useMemo(() => {
    return DEMO_BEDS.filter((b) => b.hospital_id === activeHospital.id);
  }, [activeHospital.id]);

  const totalCount = hospitalBeds.length;
  const availableCount = hospitalBeds.filter((b) => b.status === "available").length;
  const emergencyAvailableCount = hospitalBeds.filter(
    (b) => b.ward === "emergency" && b.status === "available"
  ).length;
  const heldCount = hospitalBeds.filter((b) => b.status === "held").length;
  const bookedCount = hospitalBeds.filter((b) => b.status === "booked").length;
  const occupiedCount = hospitalBeds.filter((b) => b.status === "occupied").length;

  // 10-Minute Hold Expiry Countdown Timer
  useEffect(() => {
    if (!heldBooking) return;

    const timer = setInterval(() => {
      const remainingMs = new Date(heldBooking.holdExpiresAt).getTime() - Date.now();
      const seconds = Math.max(0, Math.floor(remainingMs / 1000));
      setHoldSecondsRemaining(seconds);

      if (seconds <= 0) {
        clearInterval(timer);
        setHeldBooking(null);
        setErrorMessage("Your 10-minute bed hold has expired. The bed was returned to available inventory.");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [heldBooking]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s.toString().padStart(2, "0")}`;
  };

  // Step 1: Acquire Atomic Hold (10 Minutes)
  const handleAcquireHold = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBed) {
      setErrorMessage("Please select a bed from the ward grid.");
      return;
    }

    setHoldLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/beds/hold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bedId: selectedBed.id,
          hospitalId: activeHospital.id,
          patientName,
          patientAge,
          patientGender,
          patientPhone,
          attendantName,
          attendantPhone,
          reason,
          admissionDate,
          expectedDays,
          isEmergency,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to acquire temporary hold");
      }

      setHeldBooking(data);
      setHoldSecondsRemaining(600);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to hold bed");
    } finally {
      setHoldLoading(false);
    }
  };

  // Step 2: Pay 50% Advance via Razorpay and Confirm
  const handlePayAdvanceAndConfirm = async () => {
    if (!heldBooking) return;
    setPaymentLoading(true);
    setErrorMessage("");

    try {
      // 1. Create order for 50% advance
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "bed_advance",
          referenceId: heldBooking.bookingId,
          expectedDays,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.error);

      // 2. Confirm held bed with payment
      const confirmRes = await fetch("/api/beds/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: heldBooking.bookingId,
          bedId: heldBooking.bedId,
          orderId: orderData.orderId,
          paymentId: `pay_rzp_bed_${Date.now().toString().slice(-6)}`,
          signature: "simulated_valid_test_signature",
        }),
      });

      const confirmData = await confirmRes.json();
      if (!confirmData.success) throw new Error(confirmData.error);

      setConfirmedBooking(confirmData);
      setHeldBooking(null);
    } catch (err: any) {
      setErrorMessage(err.message || "Payment or confirmation failed");
    } finally {
      setPaymentLoading(false);
    }
  };

  const getStatusBadge = (status: BedStatus) => {
    switch (status) {
      case "available":
        return <Badge variant="success" className="text-[10px]">AVAILABLE</Badge>;
      case "held":
        return <Badge variant="warning" className="text-[10px] animate-pulse">10-MIN HOLD</Badge>;
      case "booked":
        return <Badge variant="secondary" className="text-[10px]">RESERVED</Badge>;
      case "occupied":
        return <Badge variant="destructive" className="text-[10px]">OCCUPIED</Badge>;
      case "out_of_service":
        return <Badge variant="outline" className="text-[10px] text-muted-foreground">MAINTENANCE</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BedDouble className="h-6 w-6 text-brand-teal" />
            Hospital Bed Inventory & 50% Advance Engine
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time visual bed map across wards. Atomic 10-minute hold protects your reservation during Razorpay checkout.
          </p>
        </div>

        {/* Hospital Selector */}
        <div className="w-full sm:w-72">
          <select
            className="flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={selectedHospitalId}
            onChange={(e) => {
              setSelectedHospitalId(e.target.value);
              setSelectedBed(null);
              setHeldBooking(null);
            }}
          >
            {DEMO_HOSPITALS.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Confirmed Booking Banner with QR Code */}
      {confirmedBooking && (
        <Card className="border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/40 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="relative p-2 bg-white rounded-xl shadow-sm border border-emerald-200 shrink-0">
                <Image
                  src={confirmedBooking.qrCodeUrl}
                  alt="Booking Verification QR"
                  width={112}
                  height={112}
                  className="h-28 w-28 object-contain"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="text-xs font-semibold">
                    Bed Confirmed & Held
                  </Badge>
                  <span className="text-xs text-muted-foreground">Admission Reference: {confirmedBooking.bookingId}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Bed #{confirmedBooking.bedNumber} ({confirmedBooking.ward.toUpperCase()} WARD)
                </h3>
                <div className="text-xs text-muted-foreground">
                  Hospital: <strong>{activeHospital.name}</strong>
                </div>
                <div className="text-xs text-emerald-800 dark:text-emerald-300 font-medium pt-1">
                  50% Advance Captured ({confirmedBooking.paymentId}). Remaining 50% balance payable at hospital admission.
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert("Downloading digital admission receipt PDF...")}
                className="text-xs gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                Download PDF Receipt
              </Button>
              <Button
                size="sm"
                onClick={() => setConfirmedBooking(null)}
                className="text-xs"
              >
                Close Receipt
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Active 10-Minute Hold Warning Banner */}
      {heldBooking && (
        <div className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-pulse-subtle">
          <div className="flex items-start gap-3">
            <Clock className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-foreground flex items-center gap-2">
                <span>Temporary Bed Hold Active:</span>
                <span className="font-mono text-base text-amber-700 dark:text-amber-300 font-extrabold">
                  {formatTimer(holdSecondsRemaining)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Bed #{selectedBed?.bed_number} is locked exclusively for you. Complete 50% advance payment (₹{heldBooking.advancePayable}) before timer reaches zero to finalize admission.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={handlePayAdvanceAndConfirm}
              disabled={paymentLoading}
              className="gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs h-10 px-5 shadow-sm"
            >
              <CreditCard className="h-4 w-4" />
              <span>{paymentLoading ? "Processing Razorpay..." : `Pay ₹${heldBooking.advancePayable} Advance`}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHeldBooking(null)}
              className="text-xs h-10"
            >
              Release Hold
            </Button>
          </div>
        </div>
      )}

      {/* Ward Status Metrics Summary (Section 14.2) */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        <Card className="p-3 text-center">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase">Total Beds</div>
          <div className="text-xl font-bold text-foreground mt-0.5">{totalCount}</div>
        </Card>
        <Card className="p-3 text-center bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200">
          <div className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Available</div>
          <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">{availableCount}</div>
        </Card>
        <Card className="p-3 text-center bg-red-50/50 dark:bg-red-950/30 border-red-200">
          <div className="text-[10px] font-semibold text-red-800 dark:text-red-300 uppercase">Emergency Ready</div>
          <div className="text-xl font-bold text-brand-emergency mt-0.5">{emergencyAvailableCount}</div>
        </Card>
        <Card className="p-3 text-center bg-amber-50/50 dark:bg-amber-950/30 border-amber-200">
          <div className="text-[10px] font-semibold text-amber-800 dark:text-amber-300 uppercase">Under Hold</div>
          <div className="text-xl font-bold text-amber-700 dark:text-amber-300 mt-0.5">{heldCount}</div>
        </Card>
        <Card className="p-3 text-center bg-teal-50/50 dark:bg-teal-950/30 border-teal-200">
          <div className="text-[10px] font-semibold text-brand-teal uppercase">Reserved</div>
          <div className="text-xl font-bold text-brand-teal mt-0.5">{bookedCount}</div>
        </Card>
        <Card className="p-3 text-center bg-slate-100 dark:bg-slate-800">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase">Occupied</div>
          <div className="text-xl font-bold text-foreground mt-0.5">{occupiedCount}</div>
        </Card>
      </div>

      {/* Main Grid: Ward Visual Bed Grid & Hold Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Visual Bed Map organized by Ward */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-semibold">Ward Bed Grid Map</CardTitle>
                  <CardDescription className="text-xs">
                    Select a ward and click any available bed to initiate 10-minute hold.
                  </CardDescription>
                </div>

                {/* Ward Selector Tabs */}
                <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border text-xs">
                  <button
                    onClick={() => {
                      setSelectedWard("general");
                      setSelectedBed(null);
                    }}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                      selectedWard === "general"
                        ? "bg-surface text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    General Ward
                  </button>
                  <button
                    onClick={() => {
                      setSelectedWard("emergency");
                      setSelectedBed(null);
                    }}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                      selectedWard === "emergency"
                        ? "bg-brand-emergency text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Emergency Ward
                  </button>
                  <button
                    onClick={() => {
                      setSelectedWard("icu");
                      setSelectedBed(null);
                    }}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                      selectedWard === "icu"
                        ? "bg-surface text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    ICU Ward
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {/* Visual Bed Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {bedsInView.map((bed) => {
                  const isSelected = selectedBed?.id === bed.id;
                  const isAvail = bed.status === "available";

                  return (
                    <div
                      key={bed.id}
                      onClick={() => isAvail && setSelectedBed(bed)}
                      className={`relative p-3.5 rounded-xl border transition-all text-center flex flex-col justify-between gap-2 ${
                        isAvail
                          ? "cursor-pointer hover:border-brand-teal hover:shadow-sm bg-surface"
                          : "opacity-60 bg-muted/30 cursor-not-allowed"
                      } ${
                        isSelected
                          ? "ring-2 ring-brand-teal border-brand-teal bg-teal-50/40 dark:bg-teal-950/30"
                          : "border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-foreground">
                          {bed.bed_number}
                        </span>
                        <BedDouble
                          className={`h-4 w-4 ${
                            bed.status === "available"
                              ? "text-emerald-600"
                              : bed.status === "held"
                              ? "text-amber-500"
                              : "text-slate-400"
                          }`}
                        />
                      </div>

                      <div className="py-1">
                        {getStatusBadge(bed.status)}
                      </div>

                      <div className="text-[11px] font-semibold text-foreground border-t border-border/50 pt-1">
                        ₹{bed.price_per_day} <span className="text-[9px] font-normal text-muted-foreground">/ day</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Status Legend (Never Color Alone - Icons & Labels Included) */}
              <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Available (Bookable)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" /> 10-Min Hold
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-teal-600" /> Booked
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-600" /> Admitted Inpatient
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (5 cols): Hold Form & 50% Advance Calculation */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-semibold">Bed Admission Reservation</CardTitle>
              <CardDescription className="text-xs">
                Prefilled from patient profile. 50% advance payable now; balance at admission.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-5 space-y-4">
              {/* Selected Bed Header */}
              {selectedBed ? (
                <div className="rounded-xl border border-teal-200 dark:border-teal-900 bg-teal-50/70 dark:bg-teal-950/30 p-3.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="text-muted-foreground font-semibold">Selected Bed</div>
                    <div className="text-base font-bold text-foreground">
                      #{selectedBed.bed_number} ({selectedBed.ward.toUpperCase()} WARD)
                    </div>
                    <div className="text-[11px] text-brand-teal">{activeHospital.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-foreground">₹{selectedBed.price_per_day}</div>
                    <div className="text-[10px] text-muted-foreground">per day</div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground italic bg-muted/20">
                  Please select an available bed from the ward map on the left.
                </div>
              )}

              {errorMessage && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 p-3 text-xs text-red-800 dark:text-red-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleAcquireHold} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Patient Full Name</label>
                    <Input
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Patient Age & Gender</label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={patientAge}
                        onChange={(e) => setPatientAge(parseInt(e.target.value) || 0)}
                        className="w-20"
                        required
                      />
                      <select
                        className="flex h-10 w-full rounded-lg border border-border bg-surface px-2 py-1 text-xs"
                        value={patientGender}
                        onChange={(e) => setPatientGender(e.target.value)}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Attendant Name</label>
                    <Input
                      value={attendantName}
                      onChange={(e) => setAttendantName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Attendant Phone</label>
                    <Input
                      value={attendantPhone}
                      onChange={(e) => setAttendantPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Reason for Admission / Condition</label>
                  <Input
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Expected Admission Date</label>
                    <Input
                      type="date"
                      min="2026-10-24"
                      value={admissionDate}
                      onChange={(e) => setAdmissionDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Estimated Days of Stay</label>
                    <Input
                      type="number"
                      min="1"
                      max="60"
                      value={expectedDays}
                      onChange={(e) => setExpectedDays(parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>
                </div>

                {/* Emergency Ward Requirement Checkbox */}
                {selectedWard === "emergency" && (
                  <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-3 flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="emgReq"
                      checked={isEmergency}
                      onChange={(e) => setIsEmergency(e.target.checked)}
                      className="mt-1 h-4 w-4 text-brand-emergency rounded focus:ring-brand-emergency"
                    />
                    <label htmlFor="emgReq" className="text-xs text-red-900 dark:text-red-200 leading-relaxed cursor-pointer font-medium">
                      <strong>Emergency Ward Declaration:</strong> I confirm this admission is for an acute medical crisis or trauma. This bed hold reserves immediate ward allocation.
                    </label>
                  </div>
                )}

                {/* Section 14.5: Exact Payment Calculation Breakdown */}
                {selectedBed && (
                  <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2 text-xs">
                    <div className="font-semibold text-foreground text-xs border-b border-border pb-1.5">
                      Advance Payment Breakdown
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Rate per Day:</span>
                      <span>₹{selectedBed.price_per_day}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Duration of Stay:</span>
                      <span>{expectedDays} Days</span>
                    </div>
                    <div className="flex justify-between font-semibold text-foreground">
                      <span>Total Estimated Cost:</span>
                      <span>₹{selectedBed.price_per_day * expectedDays}</span>
                    </div>
                    <div className="flex justify-between text-brand-teal font-bold border-t border-border pt-1.5">
                      <span>50% Advance Payable Online:</span>
                      <span className="text-sm">₹{Math.round(selectedBed.price_per_day * expectedDays * 0.5)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>Remaining Balance at Discharge:</span>
                      <span>₹{selectedBed.price_per_day * expectedDays - Math.round(selectedBed.price_per_day * expectedDays * 0.5)}</span>
                    </div>
                  </div>
                )}

                {!heldBooking && (
                  <Button
                    type="submit"
                    disabled={holdLoading || !selectedBed}
                    className="w-full h-11 text-xs font-bold gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    <span>{holdLoading ? "Acquiring Hold..." : "Lock Bed (10-Minute Hold)"}</span>
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function BedBookingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading bed inventory...</div>}>
      <BedBookingsContent />
    </Suspense>
  );
}
