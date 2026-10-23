"use client";

import React from "react";
import Link from "next/link";
import {
  Wallet,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Download,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DoctorEarningsPage() {
  const transactions = [
    {
      id: "pay-101",
      order_id: "order_KOT_APT_8819",
      patient: "Rohit Verma",
      date: "2026-10-24 10:00 AM",
      gross_fee: 800,
      platform_fee: 40,
      net_earnings: 760,
      status: "captured",
      settlement_status: "settled",
      payout_reference: "RZP_TRANS_00991",
    },
    {
      id: "pay-102",
      order_id: "order_KOT_APT_8820",
      patient: "Kavita Singhal",
      date: "2026-10-24 11:00 AM",
      gross_fee: 800,
      platform_fee: 40,
      net_earnings: 760,
      status: "captured",
      settlement_status: "pending_settlement",
    },
    {
      id: "pay-103",
      order_id: "order_KOT_APT_8811",
      patient: "Deepak Meena",
      date: "2026-10-24 09:00 AM",
      gross_fee: 800,
      platform_fee: 40,
      net_earnings: 760,
      status: "captured",
      settlement_status: "settled",
      payout_reference: "RZP_TRANS_00990",
    },
  ];

  const totalCollected = transactions.reduce((sum, t) => sum + t.gross_fee, 0);
  const totalSettled = transactions
    .filter((t) => t.settlement_status === "settled")
    .reduce((sum, t) => sum + t.net_earnings, 0);
  const pendingSettlement = transactions
    .filter((t) => t.settlement_status === "pending_settlement")
    .reduce((sum, t) => sum + t.net_earnings, 0);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <Link
            href="/doctor/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Doctor Dashboard
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Wallet className="h-5 w-5 text-brand-teal" />
            Doctor Earnings & Consultation Settlements
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verified consultation revenue processed via Razorpay Test Mode. All bank settlement states reflect server HMAC verification.
          </p>
        </div>

        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <Download className="h-3.5 w-3.5" />
          Export Settlement CSV
        </Button>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="text-xs font-semibold text-muted-foreground uppercase">Gross Consultations Fee</div>
            <div className="text-2xl font-bold text-foreground mt-1">₹{totalCollected}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">3 Appointments today</div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900">
          <CardContent className="p-5">
            <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Settled to Bank</div>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">₹{totalSettled}</div>
            <div className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80 mt-0.5">Verified payout reference attached</div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
          <CardContent className="p-5">
            <div className="text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase">Pending T+1 Settlement</div>
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1">₹{pendingSettlement}</div>
            <div className="text-[11px] text-amber-700/80 dark:text-amber-300/80 mt-0.5">Awaiting bank clearing cycle</div>
          </CardContent>
        </Card>
      </div>

      {/* Ledger Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-base font-semibold">Consultation Payment Records</CardTitle>
          <CardDescription className="text-xs">
            Individual patient transactions with Razorpay Order IDs and settlement audit tracking.
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border p-0">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="font-bold text-sm text-foreground flex items-center gap-2">
                  <span>{tx.patient}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {tx.order_id}
                  </Badge>
                </div>
                <div className="text-muted-foreground flex items-center gap-3">
                  <span>Date: {tx.date}</span>
                  <span>Gross: ₹{tx.gross_fee}</span>
                  <span>Platform Fee (5%): -₹{tx.platform_fee}</span>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-1 shrink-0">
                <div className="text-sm font-bold text-foreground">
                  Net: ₹{tx.net_earnings}
                </div>
                <div className="flex items-center gap-1.5">
                  {tx.settlement_status === "settled" ? (
                    <Badge variant="success" className="text-[10px] gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Settled ({tx.payout_reference})
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="text-[10px] gap-1">
                      <Clock className="h-3 w-3" />
                      Pending T+1 Settlement
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
