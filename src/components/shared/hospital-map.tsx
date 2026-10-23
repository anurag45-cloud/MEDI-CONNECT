"use client";

import React from "react";
import { MapPin, Navigation, Building2, BedDouble, ShieldCheck, ExternalLink } from "lucide-react";
import { Hospital } from "@/types";
import { Badge } from "@/components/ui/badge";

interface HospitalMapProps {
  hospitals: Hospital[];
  selectedHospitalId?: string;
  onSelectHospital?: (hospital: Hospital) => void;
  userLocation?: { lat: number; lng: number };
}

export function HospitalMap({
  hospitals,
  selectedHospitalId,
  onSelectHospital,
  userLocation,
}: HospitalMapProps) {
  const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const activeHospital = hospitals.find((h) => h.id === selectedHospitalId) || hospitals[0];

  // Center coordinate: selected hospital or Kota center (25.18, 75.83)
  const centerLat = activeHospital?.latitude || userLocation?.lat || 25.18;
  const centerLng = activeHospital?.longitude || userLocation?.lng || 75.83;

  // OpenStreetMap embed URL with marker
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${centerLng - 0.04}%2C${centerLat - 0.03}%2C${centerLng + 0.04}%2C${centerLat + 0.03}&layer=mapnik&marker=${centerLat}%2C${centerLng}`;

  return (
    <div className="relative w-full h-[450px] rounded-2xl overflow-hidden border border-border shadow-sm bg-muted/20 flex flex-col">
      {/* Top Map Provider Banner */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 bg-surface/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border shadow-sm text-xs">
        <MapPin className="h-3.5 w-3.5 text-brand-teal shrink-0" />
        <span className="font-semibold text-foreground">
          {googleMapsKey ? "Google Maps Active" : "OpenStreetMap (Fallback Provider Active)"}
        </span>
        <Badge variant="outline" className="text-[10px] h-5">
          Kota Region
        </Badge>
      </div>

      {/* Interactive Map Iframe (Privacy-preserving, responsive OpenStreetMap / Leaflet compatible) */}
      <iframe
        title="Kota Healthcare Map"
        width="100%"
        height="100%"
        className="flex-1 w-full border-0"
        src={osmEmbedUrl}
        loading="lazy"
      />

      {/* Overlay Active Hospital Quick Card */}
      {activeHospital && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md z-10 bg-surface/95 backdrop-blur-md p-4 rounded-xl border border-border shadow-lg space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-brand-teal shrink-0" />
                <span className="truncate">{activeHospital.name}</span>
              </div>
              <div className="text-xs text-muted-foreground truncate">{activeHospital.address}</div>
            </div>
            {activeHospital.is_partner ? (
              <Badge variant="secondary" className="shrink-0 text-[10px]">
                Partner Hospital
              </Badge>
            ) : (
              <Badge variant="outline" className="shrink-0 text-[10px] text-amber-600 border-amber-300">
                Not Partnered
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            {activeHospital.is_partner ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-semibold">
                  <BedDouble className="h-3.5 w-3.5" />
                  {activeHospital.available_beds} General Beds
                </span>
                {activeHospital.emergency_available && (
                  <span className="text-brand-emergency font-semibold">
                    • {activeHospital.available_emergency_beds} ICU/Emg
                  </span>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground italic text-[11px]">No online bed reservation</span>
            )}

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${activeHospital.latitude},${activeHospital.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-brand-teal font-semibold hover:underline"
            >
              <span>Get Directions</span>
              <Navigation className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
