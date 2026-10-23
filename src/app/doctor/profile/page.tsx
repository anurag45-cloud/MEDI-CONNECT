"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Stethoscope,
  ArrowLeft,
  CheckCircle2,
  Save,
  ShieldCheck,
  Building2,
  Clock,
  User,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DEMO_DOCTORS } from "@/lib/store/demo-data";

export default function DoctorProfilePage() {
  const initialDoctor = DEMO_DOCTORS[0]; // Dr. Alok Shrivastava
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [form, setForm] = useState({
    fullName: initialDoctor.full_name,
    email: initialDoctor.email,
    phone: initialDoctor.phone,
    specialty: initialDoctor.specialty,
    qualifications: initialDoctor.qualifications.join(", "),
    registrationNumber: initialDoctor.registration_number,
    registrationAuthority: initialDoctor.registration_authority,
    experienceYears: initialDoctor.experience_years.toString(),
    consultationFee: initialDoctor.consultation_fee.toString(),
    hospitalName: initialDoctor.hospital_name || "Kota Heart Institute",
    biography: initialDoctor.biography || "",
    status: initialDoctor.status,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <Link
            href="/doctor/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Doctor Dashboard
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-brand-teal" />
            Doctor Professional Profile & Credentials
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Public medical credentials, affiliated hospital, consultation fees, and state council registration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Credentials Updated
            </span>
          )}
          <Badge variant="secondary" className="gap-1 font-semibold text-xs">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-teal" />
            Status: {form.status.toUpperCase()}
          </Badge>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base font-semibold">Doctor Demographics & Practice Registration</CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Practitioner Full Name</label>
                <Input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Registered Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Practice Phone</label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Primary Specialty</label>
                <Input
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Medical Registration Number</label>
                <Input
                  value={form.registrationNumber}
                  disabled
                  className="bg-muted/40 font-mono text-xs"
                />
                <span className="text-[10px] text-muted-foreground">Locked: Verified by State Medical Council</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Registration Authority</label>
                <Input
                  value={form.registrationAuthority}
                  disabled
                  className="bg-muted/40 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Degrees & Qualifications</label>
                <Input
                  value={form.qualifications}
                  onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Clinical Experience (Years)</label>
                <Input
                  type="number"
                  value={form.experienceYears}
                  onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Consultation Fee (₹ INR)</label>
                <Input
                  type="number"
                  value={form.consultationFee}
                  onChange={(e) => setForm({ ...form, consultationFee: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Associated Hospital</label>
                <Input
                  value={form.hospitalName}
                  disabled
                  className="bg-muted/40 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-xs font-semibold">Professional Biography</label>
              <Textarea
                rows={4}
                value={form.biography}
                onChange={(e) => setForm({ ...form, biography: e.target.value })}
                required
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" className="gap-2 font-semibold">
                <Save className="h-4 w-4" />
                <span>Save Profile Changes</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
