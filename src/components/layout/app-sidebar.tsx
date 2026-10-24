"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Stethoscope,
  Building2,
  Calendar,
  BedDouble,
  FileText,
  Shield,
  User,
  PhoneCall,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AppSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainNavLinks = [
    { href: "/", label: "Home", icon: Activity },
    { href: "/find-doctor", label: "Find Doctors", icon: Stethoscope },
    { href: "/hospitals", label: "Hospitals & Beds", icon: Building2 },
    { href: "/appointments", label: "Appointments", icon: Calendar },
    { href: "/bed-bookings", label: "Bed Bookings", icon: BedDouble },
    { href: "/lab-reports", label: "Lab Reports", icon: FileText, isAi: true },
  ];

  const portalLinks = [
    { href: "/doctor/dashboard", label: "Doctor Portal", icon: Stethoscope, color: "text-brand-teal" },
    { href: "/hospital/dashboard", label: "Hospital Portal", icon: Building2, color: "text-sky-600" },
    { href: "/admin/dashboard", label: "Admin Console", icon: Shield, color: "text-amber-600" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-border bg-card/60 backdrop-blur-md transition-all duration-200 z-30 shrink-0 sticky top-0 h-screen ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border shrink-0">
        <Link
          href="/"
          className={`flex items-center gap-2.5 font-bold tracking-tight text-foreground hover:opacity-95 overflow-hidden ${
            isCollapsed ? "justify-center w-full" : ""
          }`}
          title="MediConnect"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-teal text-white shadow-sm shrink-0">
            <Activity className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <span className="flex items-center text-lg whitespace-nowrap">
              <span className="text-brand-teal">Medi</span>
              <span>Connect</span>
            </span>
          )}
        </Link>
      </div>

      {/* Vertical Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Main Section */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Patient Navigation
            </div>
          )}
          {mainNavLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                title={link.label}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                  active
                    ? "bg-brand-mint text-brand-teal font-semibold dark:bg-teal-950/70 dark:text-teal-300 shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                } ${isCollapsed ? "justify-center px-0" : ""}`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? "text-brand-teal dark:text-teal-300" : ""}`} />
                {!isCollapsed && (
                  <span className="flex-1 whitespace-nowrap flex items-center justify-between">
                    <span>{link.label}</span>
                    {link.isAi && (
                      <span className="px-1.5 py-0.2 rounded-md bg-teal-100 dark:bg-teal-900/60 text-[9px] font-bold text-brand-teal flex items-center gap-0.5">
                        <Sparkles className="h-2.5 w-2.5" />
                        AI
                      </span>
                    )}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Staff Portals Section (Vertically Stacked) */}
        <div className="space-y-1 pt-2 border-t border-border/60">
          {!isCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Staff Portals
            </div>
          )}
          {portalLinks.map((portal) => {
            const Icon = portal.icon;
            const active = isActive(portal.href);
            return (
              <Link
                key={portal.href}
                href={portal.href}
                title={portal.label}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  active
                    ? "bg-muted text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                } ${isCollapsed ? "justify-center px-0" : ""}`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${portal.color}`} />
                {!isCollapsed && <span className="whitespace-nowrap">{portal.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Emergency Alert Card */}
        {!isCollapsed && (
          <div className="p-3 rounded-xl bg-red-50/70 dark:bg-red-950/30 border border-red-200/70 dark:border-red-900/40 space-y-1.5 text-xs">
            <div className="font-semibold text-red-700 dark:text-red-300 flex items-center gap-1.5 text-[11px]">
              <PhoneCall className="h-3.5 w-3.5" />
              <span>Kota Ambulance Helpline</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              24x7 Government emergency ambulance dispatch.
            </p>
            <a
              href="tel:108"
              className="inline-flex items-center justify-center w-full py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] transition-colors"
            >
              Emergency 108
            </a>
          </div>
        )}
      </div>

      {/* Footer Area with Profile and Collapse Button */}
      <div className="p-3 border-t border-border shrink-0 flex items-center justify-between gap-2">
        <Link
          href="/profile"
          className={`flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-muted transition-colors text-xs text-foreground flex-1 overflow-hidden ${
            isCollapsed ? "justify-center" : ""
          }`}
          title="Patient Profile"
        >
          <div className="h-8 w-8 rounded-full bg-brand-mint text-brand-teal dark:bg-teal-950/70 dark:text-teal-300 flex items-center justify-center shrink-0 font-bold text-xs">
            RV
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-xs truncate">Rohit Verma</div>
              <div className="text-[10px] text-muted-foreground truncate">Patient #1042</div>
            </div>
          )}
        </Link>

        {/* Collapse / Expand Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
}
