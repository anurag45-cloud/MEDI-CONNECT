"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Stethoscope,
  Sparkles,
  AlertTriangle,
  Search,
  Filter,
  Star,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  ShieldAlert,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEMO_DOCTORS } from "@/lib/store/demo-data";
import { DoctorProfile } from "@/types";
import { AISpecialtyResponse } from "@/lib/validation/schemas";

export default function FindDoctorPage() {
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState<string>("");
  const [duration, setDuration] = useState<string>("3");
  const [radius, setRadius] = useState<string>("10");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AISpecialtyResponse | null>(null);

  // Filters
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [maxFee, setMaxFee] = useState<number>(1000);
  const [minRating, setMinRating] = useState<number>(4.0);

  // Check for immediate emergency text before even submitting AI
  const hasImmediateEmergencyKeywords = useMemo(() => {
    const text = symptoms.toLowerCase();
    return (
      text.includes("chest pain") ||
      text.includes("heart attack") ||
      text.includes("cannot breathe") ||
      text.includes("unconscious") ||
      text.includes("severe bleeding") ||
      text.includes("stroke")
    );
  }, [symptoms]);

  const handleAnalyzeSymptoms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/ai/specialty-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms,
          age: age ? parseInt(age) : undefined,
          durationDays: duration ? parseInt(duration) : undefined,
        }),
      });

      if (res.ok) {
        const data: AISpecialtyResponse = await res.json();
        setAiResult(data);
        if (data.specialties && data.specialties.length > 0) {
          // Pre-filter catalog by the primary suggested specialty
          setSelectedSpecialty(data.specialties[0].name);
        }
      }
    } catch (err) {
      console.error("AI Specialty analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Filter verified doctors from catalog
  const filteredDoctors = useMemo(() => {
    return DEMO_DOCTORS.filter((doc) => {
      const matchesSpecialty =
        selectedSpecialty === "all" ||
        doc.specialty.toLowerCase() === selectedSpecialty.toLowerCase();

      const matchesFee = doc.consultation_fee <= maxFee;
      const matchesRating = doc.rating >= minRating;

      return matchesSpecialty && matchesFee && matchesRating;
    });
  }, [selectedSpecialty, maxFee, minRating]);

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return <Badge variant="destructive" className="bg-red-600 text-white animate-pulse">EMERGENCY ATTENTION</Badge>;
      case "urgent":
        return <Badge variant="destructive" className="bg-amber-600 text-white">Urgent Evaluation</Badge>;
      case "soon":
        return <Badge variant="secondary" className="bg-teal-100 text-brand-teal">Consult Within 48 Hours</Badge>;
      default:
        return <Badge variant="outline">Routine Consultation</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-border pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-brand-teal" />
          AI Doctor Discovery & Clinical Triage
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Describe what you are experiencing to receive specialty matching powered by Gemini Flash, or browse verified doctors in Kota.
        </p>
      </div>

      {/* Immediate Emergency Warning Banner (Section 8: Show immediately without lengthy form completion) */}
      {hasImmediateEmergencyKeywords && (
        <div className="rounded-xl border border-red-300 dark:border-red-900 bg-red-100 dark:bg-red-950/80 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-red-900 dark:text-red-100 shadow-md">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-6 w-6 text-brand-emergency shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm sm:text-base">Acute Emergency Warning Detected</div>
              <div className="text-xs leading-relaxed mt-0.5">
                Your described symptoms may indicate a time-critical medical emergency. Do not wait for an online appointment.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="tel:108"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-emergency text-white text-xs font-bold hover:bg-red-800 transition-colors shadow-sm"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              Dial 108 Casualty
            </a>
            <Link
              href="/hospitals?emergency=true"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 text-red-900 dark:text-red-200 border border-red-300 text-xs font-semibold hover:bg-red-50 transition-colors"
            >
              Emergency Beds
            </Link>
          </div>
        </div>
      )}

      {/* AI Triage Card */}
      <Card className="border-teal-200 dark:border-teal-900 bg-gradient-to-br from-white via-teal-50/20 to-teal-100/30 dark:from-slate-900 dark:via-slate-900 dark:to-teal-950/20 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
              <Sparkles className="h-5 w-5 text-brand-teal" />
              Describe Health Concern or Symptoms
            </CardTitle>
            <Badge variant="secondary" className="gap-1 text-xs">
              <Sparkles className="h-3 w-3 text-brand-teal" />
              Gemini Flash Server-Side
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Enter your symptoms in plain words. The assistant identifies recommended medical specialties without prescribing or diagnosing.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleAnalyzeSymptoms} className="space-y-4">
            <div className="space-y-1">
              <Input
                placeholder="e.g. Constant throbbing headache for 3 days with sensitivity to light and mild nausea..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="h-12 text-sm bg-surface"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Patient Age (Optional)</label>
                <Input
                  type="number"
                  min="0"
                  max="120"
                  placeholder="e.g. 28"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Duration (Days)</label>
                <Input
                  type="number"
                  min="1"
                  max="365"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Search Radius</label>
                <select
                  className="flex h-9 w-full rounded-lg border border-border bg-surface px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                >
                  <option value="5">5 km radius</option>
                  <option value="10">10 km radius (Kota Central)</option>
                  <option value="25">25 km (Greater Kota Area)</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  type="submit"
                  disabled={isAnalyzing}
                  className="w-full h-9 font-semibold text-xs gap-2"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{isAnalyzing ? "Analyzing..." : "Find Appropriate Specialty"}</span>
                </Button>
              </div>
            </div>
          </form>

          {/* AI Result Presentation (Section 8 Contract) */}
          {aiResult && (
            <div className="mt-6 pt-5 border-t border-border space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-teal" />
                  Recommended Clinical Specialties
                </div>
                {aiResult.specialties[0] && getUrgencyBadge(aiResult.specialties[0].urgency)}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {aiResult.specialties.map((spec, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedSpecialty(spec.name)}
                    className="cursor-pointer rounded-xl border border-teal-200 dark:border-teal-900 bg-surface p-3.5 space-y-1.5 hover:border-brand-teal transition-all shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm text-brand-teal">{spec.name}</div>
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                        Urgency: {spec.urgency}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{spec.reason}</p>
                    <div className="text-[11px] font-semibold text-brand-teal hover:underline pt-1 inline-flex items-center gap-1">
                      Filter Doctors for {spec.name} <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                ))}
              </div>

              {aiResult.red_flags.length > 0 && (
                <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 p-3 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <div className="font-semibold flex items-center gap-1 text-amber-800 dark:text-amber-300">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Clinician Flagged Red Signs:
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 pl-2 text-[11px]">
                    {aiResult.red_flags.map((rf, idx) => (
                      <li key={idx}>{rf}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Mandatory Disclaimer from Section 8 */}
              <div className="text-[11px] text-muted-foreground italic bg-muted/40 p-2.5 rounded-lg border border-border">
                <strong>Medical Disclaimer:</strong> {aiResult.disclaimer}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Catalog Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface p-4 rounded-xl border border-border shadow-sm">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter By:</span>
          </div>

          <select
            className="flex h-9 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            <option value="all">All Specialties ({DEMO_DOCTORS.length})</option>
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

          <select
            className="flex h-9 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium focus-visible:outline-none"
            value={maxFee}
            onChange={(e) => setMaxFee(parseInt(e.target.value))}
          >
            <option value="1200">Max Fee: ₹1,200</option>
            <option value="800">Max Fee: ₹800</option>
            <option value="600">Max Fee: ₹600</option>
          </select>
        </div>

        <div className="text-xs text-muted-foreground">
          Showing <strong className="text-foreground">{filteredDoctors.length}</strong> verified doctors in Kota
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.map((doc) => (
          <Card key={doc.id} className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-5 sm:p-6 space-y-4">
              <div className="flex items-start gap-4">
                <Image
                  src={doc.photo_url || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80"}
                  alt={doc.full_name}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-2xl object-cover border border-border shrink-0 shadow-sm"
                />

                <div className="space-y-1 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-bold text-base text-foreground leading-snug">
                      {doc.full_name}
                    </h2>
                    <Badge variant="secondary" className="text-[10px] uppercase font-semibold">
                      Verified
                    </Badge>
                  </div>

                  <div className="text-xs font-semibold text-brand-teal">{doc.specialty}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {doc.qualifications.join(" • ")}
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-muted/30 p-3 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-foreground font-medium">
                  <MapPin className="h-3.5 w-3.5 text-brand-teal shrink-0" />
                  <span className="truncate">{doc.hospital_name}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/60">
                  <span>Reg: {doc.registration_number}</span>
                  <span>{doc.experience_years} years experience</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {doc.biography}
              </p>

              {/* Consultation fee, Rating & Action */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground font-semibold">Consultation Fee</div>
                  <div className="text-base font-bold text-foreground">₹{doc.consultation_fee}</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-2 py-1 rounded-md">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{doc.rating}</span>
                    <span className="text-[10px] text-muted-foreground font-normal">({doc.review_count})</span>
                  </div>

                  <Link
                    href={`/appointments?doctorId=${doc.id}`}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-brand-teal text-white font-semibold text-xs hover:bg-brand-teal-hover transition-colors shadow-sm"
                  >
                    <span>Book Slot</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
