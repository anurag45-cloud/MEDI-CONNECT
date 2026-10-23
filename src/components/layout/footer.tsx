import React from "react";
import Link from "next/link";
import { Activity, ShieldCheck, Heart, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface text-foreground transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-teal text-white">
                <Activity className="h-4 w-4" />
              </div>
              <span>
                <span className="text-brand-teal">Medi</span>Connect
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Unified digital healthcare platform connecting patients, verified doctors, accredited hospitals, and administrators across India.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <ShieldCheck className="h-4 w-4 text-brand-teal" />
              <span>Encrypted & Role-Protected Records</span>
            </div>
          </div>

          {/* Patient Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Patient Services
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/find-doctor" className="hover:text-brand-teal transition-colors">
                  AI Specialty Finder
                </Link>
              </li>
              <li>
                <Link href="/hospitals" className="hover:text-brand-teal transition-colors">
                  Hospitals & Bed Availability
                </Link>
              </li>
              <li>
                <Link href="/appointments" className="hover:text-brand-teal transition-colors">
                  Book Consultations
                </Link>
              </li>
              <li>
                <Link href="/bed-bookings" className="hover:text-brand-teal transition-colors">
                  Reserve Hospital Bed
                </Link>
              </li>
            </ul>
          </div>

          {/* Operational Portals */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Healthcare Portals
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/doctor/login" className="hover:text-brand-teal transition-colors">
                  Doctor Login & Onboarding
                </Link>
              </li>
              <li>
                <Link href="/hospital/login" className="hover:text-brand-teal transition-colors">
                  Hospital Management Login
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-brand-teal transition-colors">
                  Platform Super-Admin Login
                </Link>
              </li>
              <li>
                <Link href="/report-problem" className="hover:text-brand-teal transition-colors">
                  Report a Problem / Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency & Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Emergency & Trust
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 text-brand-emergency font-semibold">
                <Phone className="h-4 w-4" />
                <span>Helpline: 108 / 112</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Mail className="h-3.5 w-3.5" />
                <span>support@mediconnect.org</span>
              </div>
              <div className="pt-2 flex flex-col gap-1 text-xs">
                <Link href="/privacy" className="hover:underline">
                  Privacy Policy & Data Security
                </Link>
                <Link href="/terms" className="hover:underline">
                  Terms of Medical Use & Triage
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} MediConnect Healthcare Platform. Kota Region Pilot.</p>
          <p className="flex items-center gap-1">
            Built with strict safety protocols <Heart className="h-3 w-3 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
