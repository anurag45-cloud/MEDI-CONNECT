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
  Bell,
  CheckCheck,
  FileText,
  MapPin,
  PhoneCall,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "emergency";
  link?: string;
  read: boolean;
  created_at: string;
}

export function GlobalNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  React.useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (data.success && Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (err) {
        console.error("Failed to load notifications:", err);
      }
    }
    loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark notifications read:", err);
    }
  };

  const navLinks = [
    { href: "/", label: "Home", icon: Activity },
    { href: "/find-doctor", label: "Find Doctors", icon: Stethoscope },
    { href: "/hospitals", label: "Hospitals & Beds", icon: Building2 },
    { href: "/appointments", label: "Appointments", icon: Calendar },
    { href: "/bed-bookings", label: "Bed Bookings", icon: BedDouble },
    { href: "/lab-reports", label: "Lab Reports", icon: FileText },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile Brand Logo & Desktop Context Badge */}
        <div className="flex items-center gap-4">
          {/* Logo on mobile screens */}
          <Link
            href="/"
            className="flex md:hidden items-center gap-2 font-bold text-lg tracking-tight text-foreground hover:opacity-95 shrink-0"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-teal text-white shadow-sm">
              <Activity className="h-4 w-4" />
            </div>
            <span className="flex items-center">
              <span className="text-brand-teal">Medi</span>
              <span>Connect</span>
            </span>
          </Link>

          {/* Desktop Clinical Header Info */}
          <div className="hidden md:flex items-center gap-2.5">
            <Badge variant="outline" className="px-2.5 py-1 text-xs border-border flex items-center gap-1.5 font-medium bg-surface text-foreground">
              <MapPin className="h-3.5 w-3.5 text-brand-teal" />
              <span>Kota, Rajasthan</span>
            </Badge>
            <span className="text-xs text-muted-foreground">•</span>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Verified Doctors & Real-Time Hospital Beds</span>
            </div>
          </div>
        </div>

        {/* Right Action Icons & Menus */}
        <div className="hidden md:flex items-center gap-2">
          {/* Quick 108 Emergency Dial */}
          <a
            href="tel:108"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 hover:bg-red-100 transition-colors text-xs font-semibold mr-1"
            title="Immediate Emergency Ambulance (108)"
          >
            <PhoneCall className="h-3.5 w-3.5 text-brand-emergency" />
            <span>Emergency 108</span>
          </a>
          {/* Portals Dropdown - Set Vertically */}
          <div className="relative">
            <button
              onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
              className="flex flex-col items-center justify-center text-center gap-1 px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-150"
              aria-expanded={portalDropdownOpen}
            >
              <Shield className="h-4 w-4 text-brand-teal shrink-0" />
              <span className="text-[11px] leading-tight whitespace-nowrap flex items-center gap-0.5">
                <span>Staff Portals</span>
                <ChevronDown className="h-3 w-3" />
              </span>
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

          {/* In-App Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-emergency px-1 text-[10px] font-bold text-white shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-border bg-card p-2 shadow-xl z-50 text-xs"
                onMouseLeave={() => setNotifDropdownOpen(false)}
              >
                <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                  <div className="font-semibold text-foreground flex items-center gap-2">
                    <Bell className="h-3.5 w-3.5 text-brand-teal" />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="text-[10px] rounded-full bg-teal-100 dark:bg-teal-900/60 text-brand-teal px-1.5 py-0.2 font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[11px] text-brand-teal hover:underline flex items-center gap-1 font-medium"
                    >
                      <CheckCheck className="h-3 w-3" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-border py-1">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-muted-foreground text-xs">
                      No notifications at this time
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <Link
                        key={n.id}
                        href={n.link || "#"}
                        onClick={() => setNotifDropdownOpen(false)}
                        className={`block p-3 rounded-lg transition-colors hover:bg-muted/70 ${
                          !n.read ? "bg-teal-50/50 dark:bg-teal-950/20" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-semibold text-foreground flex items-center gap-1.5">
                            {!n.read && (
                              <span className="h-1.5 w-1.5 rounded-full bg-brand-teal shrink-0" />
                            )}
                            {n.title}
                          </div>
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            {new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-muted-foreground mt-0.5 text-[11px] leading-relaxed">
                          {n.message}
                        </p>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

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
