import React from "react";
import { ShieldCheck, Lock, Eye, Database, Bell } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          MediConnect Privacy Policy & Data Architecture
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Effective Date: October 2026 | Technical Assessment & Data Handling Disclosure
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-brand-teal" />
            1. Scope and Implementation Reality
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            MediConnect is designed as a multi-portal healthcare management platform operating on PostgreSQL Row Level Security (RLS) and Supabase Auth. This policy honestly documents how patient personal details, medical histories, consultation notes, and transactional bed reservations are handled across the system.
          </p>
          <p>
            We do not claim formal statutory certification under international regimens (such as HIPAA or GDPR) without an independent formal third-party legal assessment. Instead, we implement defensive engineering principles: cryptographic password hashing, server-enforced role-based access control, least-privilege database policies, and atomic hold mechanisms.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="h-5 w-5 text-sky-600" />
            2. Medical Information & Patient Consent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            Patient profiles collect optional clinical fields: blood group, allergies, chronic medical conditions, current medications, past surgeries, height, weight, and emergency contacts.
          </p>
          <p>
            Patients must grant explicit consent via the profile settings toggle before health data is stored in the database. When consent is granted, this data is strictly scoped:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Only the patient can view and modify their profile via their authenticated UID.</li>
            <li>Treating clinicians obtain read-only access exclusively during active, confirmed consultations.</li>
            <li>Hospital admissions staff obtain access exclusively to patient emergency contacts and bed admission details during an active inpatient stay.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="h-5 w-5 text-amber-600" />
            3. AI Triage & Gemini Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            The Doctor Specialty Finder employs Google Gemini Flash on the backend server. Queries sent to Gemini are anonymized: no patient name, government identifier, or telephone number is passed. Gemini is configured with a strict prompt contract to classify symptoms into broad medical specialties (e.g. Cardiology, Neurology) and flag acute emergency symptoms.
          </p>
          <p className="font-semibold text-foreground">
            The AI service does not diagnose disease or author prescriptions. An explicit disclaimer is permanently displayed to all users.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5 text-purple-600" />
            4. Payments and Razorpay Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            MediConnect never stores raw credit card numbers, CVVs, or net-banking credentials on our servers. All financial transactions are processed directly through Razorpay (currently configured in test mode for demonstration and verification). Orders and HMAC signatures are cryptographically validated on our server before bookings are marked confirmed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
