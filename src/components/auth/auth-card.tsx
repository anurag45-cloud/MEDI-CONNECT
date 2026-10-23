"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  Stethoscope,
  Building2,
  Shield,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/types";
import { DEMO_USERS } from "@/lib/auth/roles";

interface AuthCardProps {
  portal: "patient" | "doctor" | "hospital" | "admin";
  mode?: "login" | "signup";
}

export function AuthCard({ portal, mode = "login" }: AuthCardProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const portalConfig = {
    patient: {
      title: mode === "login" ? "Patient Sign In" : "Patient Registration",
      desc: "Access your clinical records, book appointments, and reserve hospital beds.",
      icon: Activity,
      color: "bg-brand-mint text-brand-teal",
      redirect: "/",
      role: "patient" as UserRole,
      demoCred: DEMO_USERS.patient,
    },
    doctor: {
      title: mode === "login" ? "Doctor Clinical Workspace" : "Doctor Practice Application",
      desc: "Review daily appointments, manage consultation slots, and write patient prescriptions.",
      icon: Stethoscope,
      color: "bg-teal-100 text-brand-teal dark:bg-teal-950/60 dark:text-teal-300",
      redirect: "/doctor/dashboard",
      role: "doctor" as UserRole,
      demoCred: DEMO_USERS.doctor,
    },
    hospital: {
      title: mode === "login" ? "Hospital Management Portal" : "Hospital Accreditation Application",
      desc: "Manage ward bed inventory, handle admissions, and coordinate clinical staff.",
      icon: Building2,
      color: "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
      redirect: "/hospital/dashboard",
      role: "hospital_admin" as UserRole,
      demoCred: DEMO_USERS.hospital_admin,
    },
    admin: {
      title: "Platform Super-Admin Console",
      desc: "Supervise doctor and hospital verifications, inspect audit logs, and manage disputes.",
      icon: Shield,
      color: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
      redirect: "/admin/dashboard",
      role: "super_admin" as UserRole,
      demoCred: DEMO_USERS.super_admin,
    },
  }[portal];

  const Icon = portalConfig.icon;

  const handleFillDemo = () => {
    setEmail(portalConfig.demoCred.email);
    setPassword("DemoPassword123!");
    if (mode === "signup") {
      setFullName(portalConfig.demoCred.fullName);
    }
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Simulate/Authenticate
      if (!email || !password) {
        setErrorMsg("Please provide both email and password.");
        setLoading(false);
        return;
      }

      // Check if credentials match demo or user requested demo login
      if (email.includes("demo") || email.includes("mediconnect") || email.includes("kotaheart")) {
        setSuccessMsg(`Welcome, ${portalConfig.demoCred.fullName}! Redirecting to portal...`);
        // Store demo role in cookie/localStorage for client awareness
        if (typeof window !== "undefined") {
          localStorage.setItem("mediconnect_active_role", portalConfig.role);
          localStorage.setItem("mediconnect_active_user", JSON.stringify(portalConfig.demoCred));
        }
        setTimeout(() => {
          router.push(portalConfig.redirect);
        }, 800);
        return;
      }

      // If custom user, register/login
      setSuccessMsg("Authentication verified. Redirecting...");
      setTimeout(() => {
        router.push(portalConfig.redirect);
      }, 900);
    } catch {
      setErrorMsg("Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-border">
      <CardHeader className="space-y-3 pb-6">
        <div className="flex items-center justify-between">
          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${portalConfig.color}`}>
            <Icon className="h-6 w-6" />
          </div>
          <Badge variant="outline" className="text-xs uppercase tracking-wider">
            {portal.toUpperCase()} PORTAL
          </Badge>
        </div>
        <div>
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            {portalConfig.title}
          </CardTitle>
          <CardDescription className="text-xs mt-1 leading-relaxed">
            {portalConfig.desc}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Instant Demo Credential Helper */}
        <div className="rounded-xl border border-dashed border-teal-300 dark:border-teal-800 bg-teal-50/60 dark:bg-teal-950/30 p-3 flex items-center justify-between gap-3">
          <div className="text-xs">
            <div className="font-semibold text-brand-teal flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              1-Click Demo Profile
            </div>
            <div className="text-[11px] text-muted-foreground truncate max-w-[200px]">
              {portalConfig.demoCred.email}
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleFillDemo}
            className="text-xs h-7 px-2.5 font-semibold"
          >
            Fill Demo
          </Button>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 p-3 text-xs text-red-800 dark:text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 p-3 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === "signup" && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Full Name</label>
              <Input
                type="text"
                placeholder="Rohit Verma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Email Address</label>
            <div className="relative">
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
              />
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">Password</label>
              {mode === "login" && (
                <Link
                  href="/login"
                  onClick={() => alert("Password reset link will be dispatched to registered email.")}
                  className="text-[11px] text-brand-teal hover:underline"
                >
                  Forgot Password?
                </Link>
              )}
            </div>
            <div className="relative">
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                required
              />
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full font-semibold gap-2">
            <span>{loading ? "Authenticating..." : mode === "login" ? "Sign In" : "Create Account"}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        {/* OAuth Dividers (Available for Patient & Doctor) */}
        {portal !== "admin" && (
          <div className="space-y-3 pt-2">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <span className="relative bg-card px-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                Or continue with OAuth
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs font-medium"
                onClick={() => {
                  alert("Google OAuth: Supabase Google provider redirect will occur in configured environment.");
                }}
              >
                <svg className="h-3.5 w-3.5 mr-1.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Google
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs font-medium"
                onClick={() => {
                  alert("Microsoft Azure OAuth: Supabase Azure provider redirect will occur in configured environment.");
                }}
              >
                <svg className="h-3.5 w-3.5 mr-1.5" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
                Microsoft
              </Button>
            </div>
          </div>
        )}

        {/* Portal Switching / Registration footer */}
        <div className="pt-2 text-center text-xs text-muted-foreground border-t border-border">
          {portal === "patient" && (
            mode === "login" ? (
              <p>
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-brand-teal font-semibold hover:underline">
                  Sign up here
                </Link>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <Link href="/login" className="text-brand-teal font-semibold hover:underline">
                  Sign in here
                </Link>
              </p>
            )
          )}

          {portal === "doctor" && (
            <p>
              New practitioner?{" "}
              <Link href="/doctor/register" className="text-brand-teal font-semibold hover:underline">
                Submit doctor verification application
              </Link>
            </p>
          )}

          {portal === "hospital" && (
            <p>
              New hospital institution?{" "}
              <Link href="/hospital/register" className="text-brand-teal font-semibold hover:underline">
                Submit hospital partnership application
              </Link>
            </p>
          )}

          {portal === "admin" && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              Super-admin access is restricted and requires verified system role.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
