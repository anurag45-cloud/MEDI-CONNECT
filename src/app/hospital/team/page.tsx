"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  ArrowLeft,
  Mail,
  UserPlus,
  Shield,
  CheckCircle2,
  Trash2,
  Key,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function HospitalTeamPage() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"hospital_staff" | "hospital_admin">("hospital_staff");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [notice, setNotice] = useState("");

  const [staffList, setStaffList] = useState([
    {
      id: "stf-001",
      name: "Vikas Saxena",
      email: "admin@kotaheart.org",
      role: "hospital_admin",
      permissions: ["bed_management", "admissions", "billing", "staff_invites"],
      joinedDate: "2024-01-10",
      status: "active",
    },
    {
      id: "stf-002",
      name: "Sunita Meena",
      email: "nurse.station@kotaheart.org",
      role: "hospital_staff",
      permissions: ["bed_management", "admissions"],
      joinedDate: "2024-03-15",
      status: "active",
    },
    {
      id: "stf-003",
      name: "Dr. Alok Shrivastava",
      email: "alok.shrivastava@kotaheart.org",
      role: "doctor",
      permissions: ["consultations", "prescriptions"],
      joinedDate: "2024-01-10",
      status: "verified_clinician",
    },
  ]);

  const [pendingInvitations, setPendingInvitations] = useState([
    {
      id: "inv-001",
      email: "admissions.desk@kotaheart.org",
      role: "hospital_staff",
      token: "tok_inv_882910_sec",
      expiresAt: "2026-10-31",
    },
  ]);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    // RULE 10.5: Hospital administrators cannot grant themselves super-admin permissions!
    // Role is strictly constrained to hospital_admin or hospital_staff
    const newInv = {
      id: `inv-${Date.now().toString().slice(-4)}`,
      email: inviteEmail,
      role: inviteRole,
      token: `tok_inv_${Date.now().toString().slice(-6)}`,
      expiresAt: "2026-10-31",
    };

    setPendingInvitations([...pendingInvitations, newInv]);
    setInviteEmail("");
    setShowInviteModal(false);
    setNotice(`Secure single-use invitation dispatched to ${inviteEmail}. Token valid until Oct 31, 2026.`);
    setTimeout(() => setNotice(""), 5000);
  };

  const handleRevokeInvite = (invId: string) => {
    setPendingInvitations(pendingInvitations.filter((i) => i.id !== invId));
    setNotice("Invitation token revoked.");
    setTimeout(() => setNotice(""), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <Link
            href="/hospital/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Hospital Dashboard
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-brand-teal" />
            Hospital Clinical Team & Staff Administration
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage authorized staff members, ward access permissions, and generate single-use expiring invitation tokens.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setShowInviteModal(!showInviteModal)}
          className="gap-1.5 text-xs font-semibold"
        >
          <UserPlus className="h-3.5 w-3.5" />
          <span>Invite Staff Member</span>
        </Button>
      </div>

      {notice && (
        <div className="flex items-center gap-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 p-3 text-xs text-teal-900 dark:text-teal-200">
          <CheckCircle2 className="h-4 w-4 text-brand-teal shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <Card className="border-teal-200 dark:border-teal-900 bg-teal-50/30 p-5 space-y-4">
          <CardTitle className="text-sm font-semibold text-foreground">
            Generate Secure Staff Invitation Token
          </CardTitle>
          <CardDescription className="text-xs">
            Single-use token with 7-day expiration. Staff cannot be assigned platform super-admin privileges.
          </CardDescription>

          <form onSubmit={handleSendInvite} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="space-y-1 sm:col-span-1">
              <label className="font-semibold">Staff Member Email</label>
              <Input
                type="email"
                placeholder="staff@hospital.org"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="h-9"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold">Assigned Hospital Role</label>
              <select
                className="flex h-9 w-full rounded-lg border border-border bg-surface px-2 py-1 text-xs"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as "hospital_staff" | "hospital_admin")}
              >
                <option value="hospital_staff">Hospital Staff (Ward/Admissions)</option>
                <option value="hospital_admin">Hospital Admin (Operations)</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <Button type="submit" className="h-9 text-xs font-semibold w-full">
                Dispatch Invite
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowInviteModal(false)}
                className="h-9 text-xs"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Active Staff Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-base font-semibold">Authorized Staff & Associated Doctors</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border p-0">
          {staffList.map((stf) => (
            <div
              key={stf.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">{stf.name}</span>
                  <Badge variant="secondary" className="text-[10px] uppercase font-semibold">
                    {stf.role.replace("_", " ")}
                  </Badge>
                </div>
                <div className="text-muted-foreground">
                  Email: {stf.email} | Permissions: {stf.permissions.join(", ")}
                </div>
              </div>

              <div className="text-[11px] text-muted-foreground">
                Joined: {stf.joinedDate}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {pendingInvitations.length > 0 && (
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Key className="h-4 w-4 text-brand-teal" />
              Pending Single-Use Invitation Tokens ({pendingInvitations.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border p-0">
            {pendingInvitations.map((inv) => (
              <div
                key={inv.id}
                className="p-4 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-foreground">{inv.email}</div>
                  <div className="text-[11px] text-muted-foreground">
                    Role: {inv.role} | Token: <span className="font-mono">{inv.token}</span> | Expires: {inv.expiresAt}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRevokeInvite(inv.id)}
                  className="text-xs text-red-600 hover:text-red-700 h-8"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Revoke
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
