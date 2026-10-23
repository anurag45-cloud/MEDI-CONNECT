"use client";

import React from "react";
import Link from "next/link";
import {
  Wallet,
  ArrowLeft,
  Download,
  CheckCircle2,
  Clock,
  ArrowDownLeft,
  Building2,
  BedDouble,
  Activity,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HospitalFinancePage() {
  const transactions = [
    {
      id: "fin-001",
      patient: "Rohit Verma",
      description: "Bed Advance (50% Deposit) - GEN-02 (3 Days)",
      amount: 2250,
      balanceDue: 2250,
      paymentId: "pay_rzp_bed_882001",
      date: "2026-10-24 10:45 AM",
      status: "captured",
    },
    {
      id: "fin-002",
      patient: "Priyanka Joshi",
      description: "Bed Advance (50% Deposit) - EMG-04 (3 Days)",
      amount: 5250,
      balanceDue: 5250,
      paymentId: "pay_rzp_bed_881451",
      date: "2026-10-23 04:10 PM",
      status: "captured",
    },
    {
      id: "fin-003",
      patient: "Sunil Gautam",
      description: "Bed Advance (50% Deposit) - GEN-04 (3 Days)",
      amount: 2250,
      balanceDue: 2250,
      paymentId: "pay_rzp_bed_881201",
      date: "2026-10-22 09:15 AM",
      status: "captured",
    },
  ];

  const totalCollected = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalBalanceDue = transactions.reduce((sum, t) => sum + t.balanceDue, 0);

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
            <Wallet className="h-5 w-5 text-brand-teal" />
            Hospital Financial Ledger & Advance Collections
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Breakdown of collected bed deposits, pending patient discharge balances, and payment gateway reconcile state.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => alert("Exporting hospital finance report CSV...")}
          className="gap-1.5 text-xs font-semibold"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Financial CSV</span>
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-teal-50/50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900">
          <CardContent className="p-5">
            <div className="text-xs font-semibold text-muted-foreground uppercase">Verified Collections (50% Advances)</div>
            <div className="text-2xl font-bold text-brand-teal mt-1">₹{totalCollected}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Captured via Razorpay Test Gateway</div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
          <CardContent className="p-5">
            <div className="text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase">Outstanding Balances (At Discharge)</div>
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1">₹{totalBalanceDue}</div>
            <div className="text-[11px] text-amber-700/80 dark:text-amber-300/80 mt-0.5">Collectable at patient exit</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="text-xs font-semibold text-muted-foreground uppercase">Gross Booked Bed Revenue</div>
            <div className="text-2xl font-bold text-foreground mt-1">₹{totalCollected + totalBalanceDue}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Calculated across 3 admissions</div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-base font-semibold">Inpatient Bed Payment Transactions</CardTitle>
          <CardDescription className="text-xs">
            Individual admissions, advance deposits captured, and balance status.
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
                    {tx.paymentId}
                  </Badge>
                </div>
                <div className="text-muted-foreground">{tx.description}</div>
                <div className="text-[11px] text-muted-foreground">Date: {tx.date}</div>
              </div>

              <div className="flex flex-col sm:items-end gap-1 shrink-0">
                <div className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  Collected: ₹{tx.amount}
                </div>
                <div className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                  Due at Discharge: ₹{tx.balanceDue}
                </div>
                <Badge variant="success" className="text-[10px]">
                  Captured
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
