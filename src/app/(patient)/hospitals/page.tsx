"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  MapPin,
  BedDouble,
  ShieldAlert,
  Search,
  Filter,
  Navigation,
  Phone,
  Star,
  Layers,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEMO_HOSPITALS } from "@/lib/store/demo-data";
import { HospitalMap } from "@/components/shared/hospital-map";
import { calculateHaversineDistance, estimateDrivingETA } from "@/lib/maps/distance";
import { Hospital } from "@/types";

// External unpartnered facilities to satisfy Section 12 requirements
const EXTERNAL_NON_PARTNER_HOSPITALS: Hospital[] = [
  {
    id: "ext-001",
    name: "Kota District Dispensary & Primary Health Centre",
    slug: "kota-district-dispensary",
    address: "Near Old Bus Stand, Rampura",
    city: "Kota",
    state: "Rajasthan",
    pin_code: "324006",
    latitude: 25.178,
    longitude: 75.832,
    phone: "+91 744 238 1100",
    emergency_phone: "108",
    email: "rampura.phc@rajasthan.gov.in",
    is_partner: false,
    status: "verified",
    departments: ["Outpatient General Care", "Immunization"],
    facilities: ["First Aid", "OPD Consultations"],
    emergency_available: false,
    rating: 3.8,
    review_count: 42,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2026-10-24T00:00:00Z",
  },
  {
    id: "ext-002",
    name: "Sanjeevani Clinic & Nursing Home",
    slug: "sanjeevani-clinic",
    address: "Shopping Centre, Gumanpura",
    city: "Kota",
    state: "Rajasthan",
    pin_code: "324007",
    latitude: 25.165,
    longitude: 75.841,
    phone: "+91 744 239 4411",
    emergency_phone: "+91 744 239 4400",
    email: "contact@sanjeevanikota.in",
    is_partner: false,
    status: "verified",
    departments: ["General Practice", "Minor Trauma"],
    facilities: ["Day Observation", "X-Ray"],
    emergency_available: false,
    rating: 4.1,
    review_count: 67,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2026-10-24T00:00:00Z",
  },
];

export default function HospitalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEmergencyOnly, setFilterEmergencyOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "map">("list");
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>("hosp-001");

  // User reference coordinate in Kota (e.g. Talwandi Circle, 25.15, 75.84)
  const userLocation = { lat: 25.152, lng: 75.841 };

  // Combine partner hospitals and external hospitals
  const allHospitals: Hospital[] = useMemo(() => {
    const combined = [...DEMO_HOSPITALS, ...EXTERNAL_NON_PARTNER_HOSPITALS];
    return combined.map((hosp) => {
      const distance = calculateHaversineDistance(
        userLocation.lat,
        userLocation.lng,
        hosp.latitude,
        hosp.longitude
      );
      return {
        ...hosp,
        distance_km: distance,
      };
    });
  }, [userLocation.lat, userLocation.lng]);

  const filteredHospitals = useMemo(() => {
    return allHospitals
      .filter((hosp) => {
        const matchesSearch =
          hosp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hosp.departments.some((d) => d.toLowerCase().includes(searchTerm.toLowerCase())) ||
          hosp.address.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesEmergency = filterEmergencyOnly ? hosp.emergency_available : true;

        return matchesSearch && matchesEmergency;
      })
      .sort((a, b) => (a.distance_km || 0) - (b.distance_km || 0));
  }, [allHospitals, searchTerm, filterEmergencyOnly]);

  return (
    <div className="max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Page Title & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Building2 className="h-6 w-6 text-brand-teal" />
            Hospitals & Live Ward Beds
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time bed availability for accredited partner facilities in Kota, Rajasthan, and public healthcare directories.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-muted/40 p-1 rounded-xl border border-border">
          <button
            onClick={() => setActiveTab("list")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === "list"
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setActiveTab("map")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === "map"
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Interactive Map
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Input
            placeholder="Search by hospital name, specialty (e.g. Cardiology, NICU), or street..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-11"
          />
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
        </div>

        <Button
          type="button"
          variant={filterEmergencyOnly ? "emergency" : "outline"}
          onClick={() => setFilterEmergencyOnly(!filterEmergencyOnly)}
          className="h-11 px-4 text-xs font-semibold shrink-0 gap-1.5 w-full sm:w-auto"
        >
          <ShieldAlert className="h-4 w-4" />
          <span>Emergency / ICU Only</span>
        </Button>
      </div>

      {/* Interactive Map Section if Tab is "map" */}
      {activeTab === "map" && (
        <div className="space-y-4">
          <HospitalMap
            hospitals={filteredHospitals}
            selectedHospitalId={selectedHospitalId}
            onSelectHospital={(h) => setSelectedHospitalId(h.id)}
            userLocation={userLocation}
          />
        </div>
      )}

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredHospitals.map((hospital) => {
          const eta = hospital.distance_km ? estimateDrivingETA(hospital.distance_km) : null;

          return (
            <Card
              key={hospital.id}
              className={`overflow-hidden transition-all duration-200 hover:shadow-md ${
                selectedHospitalId === hospital.id ? "ring-2 ring-brand-teal" : ""
              }`}
            >
              <div className="p-5 sm:p-6 space-y-4">
                {/* Header row: Name, distance, partner badge */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-foreground hover:text-brand-teal transition-colors">
                        <Link href={`/hospitals/${hospital.slug}`}>{hospital.name}</Link>
                      </h2>
                    </div>

                    <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate">{hospital.address}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {hospital.is_partner ? (
                      <Badge variant="secondary" className="text-[10px] uppercase font-semibold">
                        Partner Facility
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-amber-700 dark:text-amber-300 border-amber-300">
                        Not Partnered — No Online Booking
                      </Badge>
                    )}

                    {hospital.distance_km && (
                      <div className="text-[11px] font-semibold text-brand-teal flex items-center gap-1">
                        <Navigation className="h-3 w-3" />
                        <span>{hospital.distance_km} km ({eta?.formatted})</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rating & Emergency tag */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded font-semibold">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{hospital.rating}</span>
                    <span className="text-[10px] text-muted-foreground">({hospital.review_count})</span>
                  </div>

                  {hospital.emergency_available ? (
                    <Badge variant="destructive" className="text-[10px] font-semibold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-transparent">
                      24/7 Emergency & Trauma Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] text-muted-foreground">
                      OPD / Daytime Facility
                    </Badge>
                  )}
                </div>

                {/* Live Bed Inventory Counters (For Partner Hospitals Only) */}
                {hospital.is_partner ? (
                  <div className="grid grid-cols-2 gap-3 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/60 p-3">
                    <div>
                      <div className="text-[11px] text-muted-foreground font-medium">Available General Beds</div>
                      <div className="text-xl font-bold text-brand-teal flex items-center gap-1.5 mt-0.5">
                        <BedDouble className="h-4 w-4" />
                        <span>{hospital.available_beds}</span>
                        <span className="text-xs font-normal text-muted-foreground">/ {hospital.total_beds} total</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] text-muted-foreground font-medium">Emergency / ICU Beds</div>
                      <div className="text-xl font-bold text-brand-emergency flex items-center gap-1.5 mt-0.5">
                        <ShieldAlert className="h-4 w-4" />
                        <span>{hospital.available_emergency_beds || 0}</span>
                        <span className="text-xs font-normal text-muted-foreground">ready now</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-border bg-muted/20 p-3 text-xs text-muted-foreground italic">
                    External facility directory listing. Please call reception directly to inquire about bed availability.
                  </div>
                )}

                {/* Specialties tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {hospital.departments.slice(0, 4).map((dept) => (
                    <span
                      key={dept}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground"
                    >
                      {dept}
                    </span>
                  ))}
                  {hospital.departments.length > 4 && (
                    <span className="text-[11px] px-2 py-0.5 text-muted-foreground">
                      +{hospital.departments.length - 4} more
                    </span>
                  )}
                </div>

                {/* Actions row */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <a
                    href={`tel:${hospital.emergency_phone}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-emergency hover:underline"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>{hospital.emergency_phone}</span>
                  </a>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedHospitalId(hospital.id);
                        setActiveTab("map");
                      }}
                      className="text-xs h-8"
                    >
                      Locate on Map
                    </Button>

                    <Link
                      href={`/hospitals/${hospital.slug}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-teal text-white hover:bg-brand-teal-hover transition-colors shadow-sm"
                    >
                      <span>{hospital.is_partner ? "View Beds & Book" : "View Details"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
