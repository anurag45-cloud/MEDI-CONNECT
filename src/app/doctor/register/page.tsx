"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Stethoscope, CheckCircle2, FileText, ArrowRight, Upload } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function DoctorRegisterPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialty: "Cardiology",
    qualifications: "",
    registrationNumber: "",
    registrationAuthority: "Rajasthan Medical Council",
    experienceYears: "5",
    consultationFee: "600",
    biography: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate application dispatch to admin queue
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="max-w-lg w-full text-center p-8 space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Application Received</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Thank you, Dr. {form.fullName}. Your practitioner credential verification has been queued for Super-Admin review. Status: <strong className="text-amber-600">Pending Verification</strong>.
          </p>
          <div className="rounded-xl bg-muted/40 p-4 text-xs text-muted-foreground text-left space-y-1">
            <div><strong>Registration:</strong> {form.registrationNumber} ({form.registrationAuthority})</div>
            <div><strong>Specialty:</strong> {form.specialty}</div>
            <div><strong>Email:</strong> {form.email}</div>
          </div>
          <div className="pt-2">
            <Button onClick={() => router.push("/doctor/login")} className="w-full">
              Proceed to Doctor Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <Card className="shadow-md">
        <CardHeader className="border-b border-border space-y-2">
          <div className="flex items-center gap-2 text-brand-teal font-semibold text-sm">
            <Stethoscope className="h-4 w-4" />
            Practitioner Registration
          </div>
          <CardTitle className="text-2xl font-bold">Apply for MediConnect Doctor Credential</CardTitle>
          <CardDescription>
            Join accredited hospitals in Kota, Rajasthan. Applications are verified against state medical council registers before clinical access is granted.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Doctor Full Name (with prefix)</label>
                <Input
                  required
                  placeholder="Dr. Rajesh Sharma"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Email Address</label>
                <Input
                  type="email"
                  required
                  placeholder="doctor@hospital.org"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Contact Phone</label>
                <Input
                  required
                  placeholder="+91 98290 00000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Specialty</label>
                <select
                  className="flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Gynecology">Gynecology</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Pulmonology">Pulmonology</option>
                  <option value="Gastroenterology">Gastroenterology</option>
                  <option value="ENT">ENT</option>
                  <option value="Ophthalmology">Ophthalmology</option>
                  <option value="Psychiatry">Psychiatry</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Degrees & Qualifications</label>
                <Input
                  required
                  placeholder="MBBS, MD, DM"
                  value={form.qualifications}
                  onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Medical Registration No.</label>
                <Input
                  required
                  placeholder="RMC/12345/2012"
                  value={form.registrationNumber}
                  onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Registration Authority</label>
                <Input
                  required
                  placeholder="Rajasthan Medical Council"
                  value={form.registrationAuthority}
                  onChange={(e) => setForm({ ...form, registrationAuthority: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Experience (Years)</label>
                <Input
                  type="number"
                  min="1"
                  max="60"
                  required
                  value={form.experienceYears}
                  onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Professional Biography & Special Interests</label>
              <Textarea
                placeholder="Brief summary of clinical background, clinical fellowships, and patient focus..."
                value={form.biography}
                onChange={(e) => setForm({ ...form, biography: e.target.value })}
              />
            </div>

            <div className="rounded-xl border border-dashed border-border p-4 text-center space-y-2 bg-muted/20">
              <Upload className="h-6 w-6 text-muted-foreground mx-auto" />
              <div className="text-xs font-semibold">Upload Medical Council Certificate (PDF or JPG)</div>
              <p className="text-[11px] text-muted-foreground">Proof of current registration is required for platform verification.</p>
              <Button type="button" variant="outline" size="sm" className="text-xs">
                Select Certificate File
              </Button>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Link href="/doctor/login" className="text-xs text-muted-foreground hover:underline">
                Back to Doctor Login
              </Link>
              <Button type="submit" disabled={loading} className="gap-2">
                <span>{loading ? "Submitting Application..." : "Submit Doctor Application"}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
