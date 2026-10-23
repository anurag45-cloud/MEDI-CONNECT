import React from "react";
import { AlertTriangle, FileText, CheckCircle, ShieldAlert } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Terms of Medical Service & Platform Use
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Last updated: October 2026 | MediConnect Digital Healthcare Architecture
        </p>
      </div>

      <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-4 flex items-start gap-3 text-red-900 dark:text-red-200 text-sm">
        <AlertTriangle className="h-5 w-5 text-brand-emergency shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold">EMERGENCY NOTICE:</strong> MediConnect is not an emergency triage dispatch service. In case of acute chest pain, severe breathlessness, uncontrolled bleeding, unconsciousness, or stroke symptoms, dial national emergency lines (108 / 112 in India) immediately or proceed directly to the nearest hospital casualty department.
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-teal" />
            1. Nature of the MediConnect Platform
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            MediConnect is a digital operating platform that facilitates appointment scheduling between patients and independent licensed medical professionals, as well as bed reservation holds at affiliated hospitals in Kota, Rajasthan.
          </p>
          <p>
            MediConnect does not practice medicine. The medical advice, assessment, and treatment provided by doctors registered on the platform are the sole responsibility of the individual treating clinicians.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-sky-600" />
            2. Bed Reservation & Advance Payment Terms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            When a patient or attendant initiates a bed reservation, an atomic database hold is granted for <strong>10 minutes</strong> to complete the required <strong>50% advance deposit</strong>.
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>If the checkout is not completed within 10 minutes, the hold expires and the bed is automatically returned to the public available inventory.</li>
            <li>Upon verified payment capture, a cryptographically signed booking confirmation and QR code is issued.</li>
            <li>The remaining 50% balance is payable directly at hospital discharge or check-in.</li>
            <li>Cancellations requested at least 4 hours prior to scheduled admission time are eligible for a refund processed through the original payment method, minus gateway processing fees.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            3. Practitioner and Hospital Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            All doctors and hospitals presenting bookable services on MediConnect must undergo Super-Admin document and medical registration verification. Any account found submitting forged certificates or fraudulent credentials will be suspended immediately and reported to relevant medical licensing authorities.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
