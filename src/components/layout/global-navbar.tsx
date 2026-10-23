"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Calendar,
  Building2,
  Stethoscope,
  BedDouble,
  User,
  Menu,
  X,
  Shield,
  LifeBuoy,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";

export function GlobalNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", icon: Activity },
    { href: "/find-doctor", label: "Find Doctors", icon: Stethoscope },
    { href: "/hospitals", label: "Hospitals & Beds", icon: Building2 },
    { href: "/appointments", label: "Appointments", icon: Calendar },
    { href: "/bed-bookings", label: "Bed Bookings", icon: BedDouble },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-foreground hover:opacity-95"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-teal text-white shadow-sm">
              <Activity className="h-5 w-5" />
            </div>
            <span className="flex items-center">
              <span className="text-brand-teal">Medi</span>
              <span>Connect</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? "bg-brand-mint text-brand-teal font-semibold dark:bg-teal-950/60 dark:text-teal-300"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Icons & Menus */}
        <div className="hidden md:flex items-center gap-2">
          {/* Portals Dropdown */}
          <div className="relative">
            <button
              onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-surface hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-expanded={portalDropdownOpen}
            >
              <Shield className="h-3.5 w-3.5 text-brand-teal" />
              <span>Staff Portals</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            {portalDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-card p-1.5 shadow-lg z-50 text-xs"
                onMouseLeave={() => setPortalDropdownOpen(false)}
              >
                <div className="px-2 py-1.5 font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">
                  Select Healthcare Portal
                </div>
                <Link
                  href="/doctor/dashboard"
                  onClick={() => setPortalDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-muted text-foreground transition-colors"
                >
                  <Stethoscope className="h-4 w-4 text-brand-teal" />
                  <div>
                    <div className="font-medium">Doctor Workspace</div>
                    <div className="text-[10px] text-muted-foreground">Manage consults & slots</div>
                  </div>
                </Link>
                <Link
                  href="/hospital/dashboard"
                  onClick={() => setPortalDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-muted text-foreground transition-colors"
                >
                  <Building2 className="h-4 w-4 text-sky-600" />
                  <div>
                    <div className="font-medium">Hospital Management</div>
                    <div className="text-[10px] text-muted-foreground">Bed inventory & admissions</div>
                  </div>
                </Link>
                <Link
                  href="/admin/dashboard"
                  onClick={() => setPortalDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-muted text-foreground transition-colors"
                >
                  <Shield className="h-4 w-4 text-amber-600" />
                  <div>
                    <div className="font-medium">Platform Admin</div>
                    <div className="text-[10px] text-muted-foreground">Verification & audits</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <ThemeToggle />

          {/* User Profile / Report Problem shortcut */}
          <Link
            href="/report-problem"
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
            title="Report a Problem"
          >
            <LifeBuoy className="h-4 w-4" />
          </Link>

          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 pl-2 pr-3 py-1.5 text-xs font-semibold rounded-lg bg-surface border border-border text-foreground hover:bg-muted transition-colors"
          >
            <User className="h-4 w-4 text-brand-teal" />
            <span>My Account</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 pt-3 pb-6 space-y-2">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg ${
                    active
                      ? "bg-brand-mint text-brand-teal font-semibold dark:bg-teal-950/60"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-border space-y-1">
            <div className="px-3 py-1 text-xs font-semibold uppercase text-muted-foreground">
              Portals & Operations
            </div>
            <Link
              href="/doctor/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg"
            >
              <Stethoscope className="h-4 w-4 text-brand-teal" />
              Doctor Portal
            </Link>
            <Link
              href="/hospital/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg"
            >
              <Building2 className="h-4 w-4 text-sky-600" />
              Hospital Portal
            </Link>
            <Link
              href="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg"
            >
              <Shield className="h-4 w-4 text-amber-600" />
              Super Admin Console
            </Link>
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg"
            >
              <User className="h-4 w-4 text-brand-teal" />
              Patient Profile
            </Link>
            <Link
              href="/report-problem"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg"
            >
              <LifeBuoy className="h-4 w-4 text-slate-500" />
              Report an Issue
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
