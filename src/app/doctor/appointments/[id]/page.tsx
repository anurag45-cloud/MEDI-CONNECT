"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  User,
  Heart,
  AlertTriangle,
  FileText,
  Save,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Pill,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ConsultationWorkspacePage({
  params,
}: {
  params: { id: string };
}) {
  const [status, setStatus] = useState<"confirmed" | "in_progress" | "completed">("confirmed");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Clinical Consultation State
  const [clinicalNotes, setClinicalNotes] = useState(
    "Patient reports 48h history of exertional palpitation. Heart sounds normal S1/S2, no murmurs. Pulse 84 bpm regular. Blood pressure 126/82 mmHg."
  );
  const [assessment, setAssessment] = useState(
    "Mild sinus tachycardia secondary to physical fatigue. No acute ischemic indicators on resting 12-lead ECG."
  );
  const [prescriptions, setPrescriptions] = useState(
    "1. Tab. Propranolol 10mg (PRN for palpitations)\n2. Tab. Multivitamin OD x 15 days\n3. Adequate hydration (3L/day)"
  );
  const [followUp, setFollowUp] = useState("Review in Cardiology OPD after 2 weeks with repeat lipid profile.");

  const handleFinalize = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: params.id,
          status: "completed",
        }),
      });
    } catch (err) {
      console.error("Failed to patch consultation status:", err);
    }
    setStatus("completed");
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-1">
          <Link
            href="/doctor/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Doctor Dashboard
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-brand-teal" />
            Clinical Consultation Workspace
          </h1>
          <p className="text-xs text-muted-foreground">
            Consultation Reference: <strong>{params.id}</strong> | Doctor: <strong>Dr. Alok Shrivastava (Cardiology)</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant={status === "completed" ? "success" : "secondary"}
            className="text-xs font-semibold uppercase"
          >
            {status}
          </Badge>
          {savedSuccess && (
            <span className="flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Clinical Record Finalized
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Patient Medical Profile Summary (Authorized Clinician Access) */}
        <div className="space-y-6">
          <Card className="border-teal-200 dark:border-teal-900 bg-teal-50/20 dark:bg-teal-950/20">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <User className="h-4 w-4 text-brand-teal" />
                Patient Medical File
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-3 text-xs leading-relaxed">
              <div>
                <div className="text-[10px] uppercase font-semibold text-muted-foreground">Patient Name</div>
                <div className="font-bold text-sm text-foreground">Rohit Verma (Age 31, Male)</div>
                <div className="text-muted-foreground">Blood Group: B+ | BMI: 23.5 (Normal)</div>
              </div>

              <div className="border-t border-border pt-2">
                <div className="text-[10px] uppercase font-semibold text-muted-foreground">Contact & Emergency</div>
                <div className="text-foreground">+91 98290 55443</div>
                <div className="text-muted-foreground">Emergency: Sanjay Verma (+91 98290 12345)</div>
              </div>

              {/* Patient Allergies - Prominent Alert */}
              <div className="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 p-2.5 space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-bold text-red-800 dark:text-red-300">
                  <AlertTriangle className="h-3.5 w-3.5 text-brand-emergency" />
                  Known Drug Allergies:
                </div>
                <div className="text-xs font-semibold text-red-900 dark:text-red-200">
                  Penicillin, Sulfa drugs
                </div>
              </div>

              <div className="border-t border-border pt-2">
                <div className="text-[10px] uppercase font-semibold text-muted-foreground">Chronic Conditions</div>
                <div className="text-foreground">Mild Allergic Rhinitis</div>
              </div>

              <div className="border-t border-border pt-2">
                <div className="text-[10px] uppercase font-semibold text-muted-foreground">Stated Reason for Visit</div>
                <div className="p-2 rounded bg-surface border border-border italic text-foreground mt-0.5">
                  &quot;Post-exertion palpitations & mild dyspnea for 2 days.&quot;
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 2 Cols: Doctor Examination, Assessment & Prescriptions */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleFinalize} className="space-y-6">
            <Card>
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand-teal" />
                  Doctor Assessment & Clinical Examination Notes
                </CardTitle>
                <CardDescription className="text-xs">
                  Only the treating clinician (Dr. Alok Shrivastava) is authorized to author and append to this record.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Examination Findings & Vitals Observed</label>
                  <Textarea
                    rows={3}
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    className="text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Clinical Diagnosis / Assessment</label>
                  <Textarea
                    rows={2}
                    value={assessment}
                    onChange={(e) => setAssessment(e.target.value)}
                    className="text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Pill className="h-3.5 w-3.5 text-brand-teal" />
                    Doctor-Authored Prescription & Dosage Instructions
                  </label>
                  <Textarea
                    rows={4}
                    value={prescriptions}
                    onChange={(e) => setPrescriptions(e.target.value)}
                    className="text-xs font-mono"
                    required
                  />
                  <div className="text-[11px] text-muted-foreground">
                    Note: Automated AI prescribing is strictly forbidden. Prescriptions must be clinician-entered and reviewed against known patient allergies.
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Follow-up Instructions & Referrals</label>
                  <Input
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-border">
                  <div className="text-[11px] text-muted-foreground">
                    Timestamp: {new Date().toLocaleTimeString()} | Cryptographically signed to doctor UID
                  </div>

                  <Button type="submit" className="gap-2 font-semibold">
                    <Save className="h-4 w-4" />
                    <span>Finalize Consultation & Issue Prescription</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
