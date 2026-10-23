import React from "react";
import Link from "next/link";
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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PatientDashboardPage() {
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
        {/* Card 1: Find a Doctor */}
        <Card className="hover:border-brand-teal/50 hover:shadow-md transition-all group overflow-hidden">
          <CardContent className="p-6 sm:p-8 flex flex-col justify-between h-full space-y-6">
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
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Describe symptoms in plain text to identify recommended medical specialties and book verified doctors across Kota hospitals.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground pt-1">
                <span className="px-2 py-0.5 rounded bg-muted/60">30+ Verified Clinicians</span>
                <span className="px-2 py-0.5 rounded bg-muted/60">12 Specialties</span>
                <span className="px-2 py-0.5 rounded bg-muted/60">Real-time Slots</span>
              </div>
            </div>

            <Link
              href="/find-doctor"
              className="inline-flex items-center justify-between w-full px-5 py-3 rounded-xl bg-brand-teal text-white font-semibold text-sm hover:bg-brand-teal-hover transition-colors shadow-sm"
            >
              <span>Search Doctors & Consultations</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </CardContent>
        </Card>

        {/* Card 2: Find a Hospital & Reserve a Bed */}
        <Card className="hover:border-brand-teal/50 hover:shadow-md transition-all group overflow-hidden">
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

      {/* 3. Upcoming Appointment & Active Bed Booking Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Appointments Summary */}
        <Card>
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
        <Card>
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
      </div>
    </div>
  );
}
