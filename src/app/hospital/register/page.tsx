"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, CheckCircle2, ArrowRight, Upload } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function HospitalRegisterPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    hospitalName: "",
    adminEmail: "",
    adminPhone: "",
    licenseNumber: "",
    address: "",
    city: "Kota",
    state: "Rajasthan",
    pinCode: "324005",
    totalBeds: "50",
    emergencyAvailable: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="max-w-lg w-full text-center p-8 space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-sky-700 mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Partnership Application Received</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Thank you for registering <strong>{form.hospitalName}</strong>. The application and facility clinical establishment license ({form.licenseNumber}) are now under Super-Admin review. Status: <strong className="text-amber-600">Pending Accreditation</strong>.
          </p>
          <div className="rounded-xl bg-muted/40 p-4 text-xs text-muted-foreground text-left space-y-1">
            <div><strong>Location:</strong> {form.address}, {form.city}</div>
            <div><strong>Capacity:</strong> {form.totalBeds} Beds</div>
            <div><strong>Admin Contact:</strong> {form.adminEmail}</div>
          </div>
          <div className="pt-2">
            <Button onClick={() => router.push("/hospital/login")} className="w-full">
              Proceed to Hospital Portal
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
          <div className="flex items-center gap-2 text-sky-600 font-semibold text-sm">
            <Building2 className="h-4 w-4" />
            Healthcare Facility Application
          </div>
          <CardTitle className="text-2xl font-bold">Register Hospital on MediConnect</CardTitle>
          <CardDescription>
            Integrate live bed inventory, ward management, and patient admission coordination. Required for participating partner hospitals in Kota.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Hospital / Clinic Official Name</label>
                <Input
                  required
                  placeholder="Apex Multi-Specialty Hospital"
                  value={form.hospitalName}
                  onChange={(e) => setForm({ ...form, hospitalName: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Clinical Establishment License No.</label>
                <Input
                  required
                  placeholder="CEA/RAJ/KOTA/2021/889"
                  value={form.licenseNumber}
                  onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Hospital Admin Email</label>
                <Input
                  type="email"
                  required
                  placeholder="administrator@hospital.org"
                  value={form.adminEmail}
                  onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Emergency Helpline Phone</label>
                <Input
                  required
                  placeholder="+91 744 240 0000"
                  value={form.adminPhone}
                  onChange={(e) => setForm({ ...form, adminPhone: e.target.value })}
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold">Physical Facility Address</label>
                <Input
                  required
                  placeholder="Plot 5, Main Road, Vigyan Nagar"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">City</label>
                <Input
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Total Licensed Bed Capacity</label>
                <Input
                  type="number"
                  min="5"
                  max="1500"
                  required
                  value={form.totalBeds}
                  onChange={(e) => setForm({ ...form, totalBeds: e.target.value })}
                />
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-border p-4 text-center space-y-2 bg-muted/20">
              <Upload className="h-6 w-6 text-muted-foreground mx-auto" />
              <div className="text-xs font-semibold">Upload Clinical Establishment Registration Certificate</div>
              <p className="text-[11px] text-muted-foreground">Certified PDF or scan from Department of Medical & Health, Rajasthan.</p>
              <Button type="button" variant="outline" size="sm" className="text-xs">
                Select Document File
              </Button>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Link href="/hospital/login" className="text-xs text-muted-foreground hover:underline">
                Back to Hospital Login
              </Link>
              <Button type="submit" disabled={loading} className="gap-2">
                <span>{loading ? "Submitting Application..." : "Submit Hospital Application"}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
