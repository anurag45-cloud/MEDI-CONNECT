"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  Building2,
  Calendar,
  BedDouble,
  ArrowRight,
  ShieldCheck,
  Clock,
  MapPin,
  Sparkles,
  Search,
  ShieldAlert,
  PhoneCall,
  CheckCircle2,
  FileText,
  Bot,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const QUICK_SYMPTOMS = [
  "Chest Pain",
  "Severe Headache",
  "Skin Rash",
  "Knee / Joint Pain",
  "Fever & Cough",
];

export default function PatientDashboardPage() {
  const router = useRouter();
  const [symptomText, setSymptomText] = useState("");

  const isEmergency = useMemo(() => {
    const text = symptomText.toLowerCase();
    return (
      text.includes("chest pain") ||
      text.includes("heart attack") ||
      text.includes("cannot breathe") ||
      text.includes("unconscious") ||
      text.includes("stroke") ||
      text.includes("severe bleeding")
    );
  }, [symptomText]);

  const handleSearchDoctor = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (symptomText.trim()) {
      router.push(`/find-doctor?symptoms=${encodeURIComponent(symptomText.trim())}`);
    } else {
      router.push("/find-doctor");
    }
  };

  const handleSelectQuickSymptom = (symptom: string) => {
    setSymptomText(symptom);
    router.push(`/find-doctor?symptoms=${encodeURIComponent(symptom)}`);
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Concise Personalized Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Welcome to MediConnect
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Access Kota verified medical specialists, real-time hospital beds, and clinical records.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1 font-medium text-xs flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-brand-teal" />
            <span>Region: Kota, Rajasthan</span>
          </Badge>
          <Badge variant="outline" className="px-3 py-1 text-xs text-muted-foreground">
            Pilot Active
          </Badge>
        </div>
      </div>

      {/* 2. Two Primary Cards: Find a Doctor & Find a Hospital */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Find a Doctor with Interactive Symptom Input & AI Triage */}
        <Card className="hover:border-brand-teal/50 hover:shadow-md transition-all group overflow-hidden border-border bg-surface">
          <CardContent className="p-6 sm:p-8 flex flex-col justify-between h-full space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-mint text-brand-teal dark:bg-teal-950/70 dark:text-teal-300">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="h-3 w-3 text-brand-teal" />
                  Gemini AI Triage
                </Badge>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground group-hover:text-brand-teal transition-colors">
                  Find a Doctor
                </h2>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  Describe symptoms in plain text to identify recommended medical specialties and book verified doctors across Kota hospitals.
                </p>
              </div>

              {/* Interactive Symptom Input Directly Inside Card */}
              <form onSubmit={handleSearchDoctor} className="space-y-2.5 pt-1">
                <div className="relative">
                  <Input
                    placeholder="Type symptoms (e.g. chest discomfort, headache, knee pain)..."
                    value={symptomText}
                    onChange={(e) => setSymptomText(e.target.value)}
                    className="h-11 pr-10 text-xs sm:text-sm bg-surface border-border focus:border-brand-teal"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 p-1.5 rounded-lg bg-brand-teal text-white hover:bg-brand-teal-hover transition-colors"
                    title="Search & Analyze"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Popular Symptom Pills */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-[11px] font-semibold text-muted-foreground">Quick:</span>
                  {QUICK_SYMPTOMS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleSelectQuickSymptom(tag)}
                      className="px-2 py-0.5 rounded-md bg-muted/60 hover:bg-brand-mint hover:text-brand-teal text-[11px] text-muted-foreground transition-colors border border-border/50"
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Immediate Emergency Alert if acute keywords detected */}
                {isEmergency && (
                  <div className="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 p-2.5 text-xs text-red-900 dark:text-red-200 flex items-center justify-between gap-2 animate-pulse">
                    <span className="font-semibold flex items-center gap-1.5">
                      <ShieldAlert className="h-4 w-4 text-brand-emergency shrink-0" />
                      Critical emergency detected!
                    </span>
                    <a
                      href="tel:108"
                      className="px-2.5 py-1 rounded bg-brand-emergency text-white font-bold hover:bg-red-800 text-[11px] shrink-0"
                    >
                      Dial 108
                    </a>
                  </div>
                )}
              </form>

              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground pt-1">
                <span className="px-2 py-0.5 rounded bg-muted/60">30+ Verified Clinicians</span>
                <span className="px-2 py-0.5 rounded bg-muted/60">12 Specialties</span>
                <span className="px-2 py-0.5 rounded bg-muted/60">Real-time Slots</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => handleSearchDoctor()}
              className="inline-flex items-center justify-between w-full px-5 py-3 rounded-xl bg-brand-teal text-white font-semibold text-sm hover:bg-brand-teal-hover transition-colors shadow-sm"
            >
              <span>{symptomText.trim() ? "Analyze Symptoms & Match Doctors" : "Search Doctors & Consultations"}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </CardContent>
        </Card>

        {/* Card 2: Find a Hospital & Reserve a Bed */}
        <Card className="hover:border-brand-teal/50 hover:shadow-md transition-all group overflow-hidden border-border bg-surface">
          <CardContent className="p-6 sm:p-8 flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300">
                  <Building2 className="h-6 w-6" />
                </div>
                <Badge variant="outline" className="border-sky-300 text-sky-700 dark:text-sky-300">
                  Live Bed Tracking
                </Badge>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground group-hover:text-brand-teal transition-colors">
                  Find a Hospital & Bed
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Locate nearby accredited hospitals in Kota, view live ward bed availability, and place a verified 50% advance bed hold.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground pt-1">
                <span className="px-2 py-0.5 rounded bg-muted/60">8 Accredited Hospitals</span>
                <span className="px-2 py-0.5 rounded bg-muted/60">General & Emergency Beds</span>
                <span className="px-2 py-0.5 rounded bg-muted/60">OpenStreetMap & Google Maps</span>
              </div>
            </div>

            <Link
              href="/hospitals"
              className="inline-flex items-center justify-between w-full px-5 py-3 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold text-sm hover:bg-slate-800 dark:hover:bg-white transition-colors shadow-sm"
            >
              <span>Explore Hospitals & Live Beds</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* 3. Consultations, Beds & Lab Reports Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Appointments Summary */}
        <Card className="border-border bg-surface">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 font-semibold text-base text-foreground">
                <Calendar className="h-4 w-4 text-brand-teal" />
                <span>Upcoming Appointments</span>
              </div>
              <Link
                href="/appointments"
                className="text-xs font-semibold text-brand-teal hover:underline inline-flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="rounded-xl border border-dashed border-border bg-muted/20 p-5 text-center space-y-2">
              <Clock className="h-7 w-7 text-muted-foreground mx-auto" />
              <div className="text-sm font-medium text-foreground">No upcoming consultations</div>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Need to see a specialist? Book a clinic or video consultation slot.
              </p>
              <div className="pt-2">
                <Link
                  href="/find-doctor"
                  className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-surface border border-border hover:bg-muted text-foreground transition-colors"
                >
                  Schedule Appointment
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bed Bookings Summary */}
        <Card className="border-border bg-surface">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 font-semibold text-base text-foreground">
                <BedDouble className="h-4 w-4 text-sky-600" />
                <span>Active Bed Reservations</span>
              </div>
              <Link
                href="/bed-bookings"
                className="text-xs font-semibold text-brand-teal hover:underline inline-flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="rounded-xl border border-dashed border-border bg-muted/20 p-5 text-center space-y-2">
              <ShieldCheck className="h-7 w-7 text-muted-foreground mx-auto" />
              <div className="text-sm font-medium text-foreground">No active bed holds or admissions</div>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Real-time bed reservations include a 10-minute hold and instant QR confirmation.
              </p>
              <div className="pt-2">
                <Link
                  href="/hospitals"
                  className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-surface border border-border hover:bg-muted text-foreground transition-colors"
                >
                  View Ward Inventory
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lab Reports & AI Explainer Summary */}
        <Card className="border-border bg-surface hover:border-brand-teal/40 transition-colors">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 font-semibold text-base text-foreground">
                <FileText className="h-4 w-4 text-brand-teal" />
                <span>Previous Lab Reports</span>
              </div>
              <Link
                href="/lab-reports"
                className="text-xs font-semibold text-brand-teal hover:underline inline-flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">Complete Blood Count (CBC)</span>
                  <Badge variant="outline" className="text-[10px] bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200">
                    1 Flag to Review
                  </Badge>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Kota Central Diagnostic Laboratory • Oct 22, 2026
                </div>
              </div>

              {/* Real-time AI Chatbot Feature Highlight */}
              <div className="rounded-xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/70 dark:bg-teal-950/30 p-3 text-xs space-y-1">
                <div className="font-semibold text-brand-teal flex items-center gap-1.5">
                  <Bot className="h-3.5 w-3.5" />
                  <span>Real-Time MediBot Assistant</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Translates confusing lab jargon into simple, warm human terms and answers your health questions.
                </p>
              </div>

              <div className="pt-1">
                <Link
                  href="/lab-reports"
                  className="inline-flex items-center justify-center w-full px-3 py-2 text-xs font-semibold rounded-lg bg-brand-teal text-white hover:bg-brand-teal-hover transition-colors shadow-xs gap-1.5"
                >
                  <span>Open Reports & Chat with AI</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
