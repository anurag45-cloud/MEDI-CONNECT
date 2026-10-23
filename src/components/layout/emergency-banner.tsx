"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, PhoneCall, ShieldAlert } from "lucide-react";

export function EmergencyBanner() {
  return (
    <div className="w-full bg-red-50 border-b border-red-200 dark:bg-red-950/40 dark:border-red-900/50 py-2.5 px-4 text-sm text-red-900 dark:text-red-200 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-emergency text-white">
            <AlertTriangle className="h-3.5 w-3.5" />
          </span>
          <p className="font-medium text-xs sm:text-sm">
            <strong className="font-semibold text-brand-emergency dark:text-red-400">
              Emergency Care:
            </strong>{" "}
            Immediate triage required? Call national emergency services or reserve an emergency ICU bed.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="tel:108"
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md bg-brand-emergency text-white hover:bg-red-800 transition-colors shadow-sm"
          >
            <PhoneCall className="h-3 w-3" />
            Call 108 / 112
          </a>
          <Link
            href="/hospitals?emergency=true"
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md border border-red-300 dark:border-red-800 bg-white dark:bg-red-900/30 text-red-900 dark:text-red-200 hover:bg-red-100 transition-colors"
          >
            <ShieldAlert className="h-3 w-3 text-brand-emergency" />
            Emergency Beds
          </Link>
        </div>
      </div>
    </div>
  );
}
