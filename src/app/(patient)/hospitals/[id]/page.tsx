import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Star,
  BedDouble,
  ShieldAlert,
  Navigation,
  Clock,
  CheckCircle2,
  Stethoscope,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { DEMO_HOSPITALS, DEMO_DOCTORS } from "@/lib/store/demo-data";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateHaversineDistance, estimateDrivingETA } from "@/lib/maps/distance";

interface HospitalPageProps {
  params: {
    id: string; // slug or id
  };
}

export default function HospitalDetailPage({ params }: HospitalPageProps) {
  const hospital = DEMO_HOSPITALS.find(
    (h) => h.slug === params.id || h.id === params.id
  );

  if (!hospital) {
    notFound();
  }

  // Find associated doctors
  const associatedDoctors = DEMO_DOCTORS.filter(
    (d) => d.hospital_id === hospital.id
  );

  // User location reference
  const userLoc = { lat: 25.152, lng: 75.841 };
  const distance = calculateHaversineDistance(
    userLoc.lat,
    userLoc.lng,
    hospital.latitude,
    hospital.longitude
  );
  const eta = estimateDrivingETA(distance);

  // OpenStreetMap embed URL
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${hospital.longitude - 0.03}%2C${hospital.latitude - 0.02}%2C${hospital.longitude + 0.03}%2C${hospital.latitude + 0.02}&layer=mapnik&marker=${hospital.latitude}%2C${hospital.longitude}`;

  return (
    <div className="max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-muted-foreground flex items-center gap-2">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/hospitals" className="hover:underline">Hospitals</Link>
        <span>/</span>
        <span className="text-foreground font-semibold">{hospital.name}</span>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 border-b border-border pb-8">
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {hospital.name}
            </h1>
            <Badge variant="secondary" className="font-semibold text-xs">
              Verified Partner
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-brand-teal" />
              {hospital.address}, {hospital.city}, {hospital.state} - {hospital.pin_code}
            </span>
            <span className="flex items-center gap-1 font-semibold text-brand-teal">
              <Navigation className="h-3.5 w-3.5" />
              {distance} km away (~{eta.formatted} driving ETA)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-md text-xs font-semibold">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{hospital.rating}</span>
              <span className="text-muted-foreground font-normal">({hospital.review_count} verified patient reviews)</span>
            </div>

            {hospital.emergency_available && (
              <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-transparent text-xs py-1">
                24/7 Level-1 Emergency & Trauma Unit
              </Badge>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap sm:flex-col gap-2.5 shrink-0">
          <Link
            href={`/bed-bookings?hospitalId=${hospital.id}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-teal text-white font-semibold text-sm hover:bg-brand-teal-hover transition-colors shadow-sm"
          >
            <BedDouble className="h-4 w-4" />
            <span>Book a Bed (50% Advance)</span>
          </Link>

          <a
            href={`tel:${hospital.emergency_phone}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 font-semibold text-sm hover:bg-red-100 transition-colors"
          >
            <Phone className="h-4 w-4 text-brand-emergency" />
            <span>Call Casualty ({hospital.emergency_phone})</span>
          </a>

          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-border bg-surface text-foreground font-medium text-xs hover:bg-muted transition-colors"
          >
            <Navigation className="h-3.5 w-3.5 text-brand-teal" />
            <span>Open in Google Maps</span>
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </a>
        </div>
      </div>

      {/* Bed Inventory Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-teal-50/50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground font-semibold uppercase">Total Ward Beds</div>
              <div className="text-2xl font-bold text-foreground mt-1">{hospital.total_beds}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Licensed Inpatient Capacity</div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 dark:bg-teal-900 text-brand-teal">
              <Building2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground font-semibold uppercase">Available General Beds</div>
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">
                {hospital.available_beds}
              </div>
              <div className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80 mt-0.5">₹1,500 / day (₹750 advance)</div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
              <BedDouble className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground font-semibold uppercase">ICU & Emergency Beds</div>
              <div className="text-2xl font-bold text-brand-emergency mt-1">
                {hospital.available_emergency_beds || 0}
              </div>
              <div className="text-[11px] text-red-700/80 dark:text-red-300/80 mt-0.5">Real-time emergency hold active</div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900 text-brand-emergency">
              <ShieldAlert className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Details, Map, Doctors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Departments, Facilities, Map */}
        <div className="lg:col-span-2 space-y-6">
          {/* Clinical Departments */}
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-semibold">Specialized Clinical Departments</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {hospital.departments.map((dept) => (
                  <div
                    key={dept}
                    className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-surface text-xs font-medium text-foreground"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand-teal shrink-0" />
                    <span>{dept}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Hospital Facilities */}
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-semibold">Diagnostic & Inpatient Facilities</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hospital.facilities.map((fac) => (
                  <div
                    key={fac}
                    className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-surface text-xs text-muted-foreground"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                    <span className="text-foreground">{fac}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Map Location */}
          <Card>
            <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-teal" />
                Hospital Geographic Location
              </CardTitle>
              <span className="text-xs text-muted-foreground">OpenStreetMap Navigation</span>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden h-[350px]">
              <iframe
                title="Hospital Geographic Position"
                width="100%"
                height="100%"
                className="w-full h-full border-0"
                src={osmEmbedUrl}
                loading="lazy"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Associated Doctors & Operating Hours */}
        <div className="space-y-6">
          {/* Associated Doctors */}
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-brand-teal" />
                Associated Doctors ({associatedDoctors.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border p-0">
              {associatedDoctors.map((doc) => (
                <div key={doc.id} className="p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <Image
                      src={doc.photo_url || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80"}
                      alt={doc.full_name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover border border-border"
                    />
                    <div>
                      <div className="font-semibold text-xs text-foreground">{doc.full_name}</div>
                      <div className="text-[11px] text-brand-teal font-medium">{doc.specialty}</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Fee: ₹{doc.consultation_fee} | Exp: {doc.experience_years} yrs
                  </div>
                  <Link
                    href={`/appointments?doctorId=${doc.id}`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-teal hover:underline pt-1"
                  >
                    <span>Book Consultation</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Contact & Hours */}
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-teal" />
                Working Hours & Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4 text-xs text-muted-foreground leading-relaxed">
              <div className="flex justify-between border-b border-border pb-2">
                <span>Emergency Casualty:</span>
                <span className="font-semibold text-brand-emergency">24 Hours / 7 Days</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span>OPD Consultations:</span>
                <span className="font-medium text-foreground">09:00 AM – 08:00 PM</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span>General Reception:</span>
                <span className="font-medium text-foreground">{hospital.phone}</span>
              </div>
              <div className="flex justify-between">
                <span>Email Desk:</span>
                <span className="font-medium text-foreground">{hospital.email}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
