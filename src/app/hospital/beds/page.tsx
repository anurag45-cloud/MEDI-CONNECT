"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BedDouble,
  ArrowLeft,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  ShieldAlert,
  AlertTriangle,
  Save,
  RotateCcw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DEMO_BEDS, DEMO_HOSPITALS } from "@/lib/store/demo-data";
import { Bed, BedStatus, WardType } from "@/types";

export default function HospitalBedsPage() {
  const hospital = DEMO_HOSPITALS[0];
  const [beds, setBeds] = useState<Bed[]>(
    DEMO_BEDS.filter((b) => b.hospital_id === hospital.id)
  );

  const [selectedWard, setSelectedWard] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [newBedNumber, setNewBedNumber] = useState("");
  const [newWard, setNewWard] = useState<WardType>("general");
  const [newPrice, setNewPrice] = useState("1500");
  const [showAddForm, setShowAddForm] = useState(false);
  const [auditNotice, setAuditNotice] = useState("");

  const filteredBeds = beds.filter((b) => {
    const matchesWard = selectedWard === "all" || b.ward === selectedWard;
    const matchesStatus = selectedStatus === "all" || b.status === selectedStatus;
    return matchesWard && matchesStatus;
  });

  const handleAddBed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBedNumber) return;

    const newBed: Bed = {
      id: `${hospital.id}-${newWard}-${Date.now().toString().slice(-4)}`,
      hospital_id: hospital.id,
      hospital_name: hospital.name,
      ward: newWard,
      bed_number: newBedNumber.toUpperCase(),
      price_per_day: parseInt(newPrice) || 1500,
      status: "available",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setBeds([...beds, newBed]);
    setNewBedNumber("");
    setShowAddForm(false);
    setAuditNotice(`Bed #${newBed.bed_number} registered to ${newWard.toUpperCase()} ward.`);
    setTimeout(() => setAuditNotice(""), 4000);
  };

  const handleStatusChange = (bedId: string, newStatus: BedStatus) => {
    const targetBed = beds.find((b) => b.id === bedId);
    if (!targetBed) return;

    // RULE 10.3: Do not mark a bed available while a patient remains admitted!
    if (targetBed.status === "occupied" && newStatus === "available") {
      alert("Validation Error: Patient is currently admitted in this bed. Formal clinical discharge must be recorded before releasing bed to available inventory.");
      return;
    }

    setBeds(
      beds.map((b) => (b.id === bedId ? { ...b, status: newStatus } : b))
    );
    setAuditNotice(`Bed #${targetBed.bed_number} status changed to ${newStatus.toUpperCase()}`);
    setTimeout(() => setAuditNotice(""), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8 space-y-6">
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
            <BedDouble className="h-5 w-5 text-brand-teal" />
            Hospital Bed Inventory & Ward Allocation
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Facility: <strong>{hospital.name}</strong> | Total Capacity: {beds.length} Inpatient Units
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="gap-1.5 text-xs font-semibold"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add New Bed Unit</span>
          </Button>
        </div>
      </div>

      {auditNotice && (
        <div className="flex items-center gap-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 p-3 text-xs text-teal-900 dark:text-teal-200">
          <CheckCircle2 className="h-4 w-4 text-brand-teal shrink-0" />
          <span>Audit Log Recorded: {auditNotice}</span>
        </div>
      )}

      {/* Add Bed Modal / Form */}
      {showAddForm && (
        <Card className="border-teal-200 dark:border-teal-900 bg-teal-50/30 p-5 space-y-4">
          <CardTitle className="text-sm font-semibold text-foreground">Register New Inpatient Bed</CardTitle>
          <form onSubmit={handleAddBed} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold">Ward Location</label>
              <select
                className="flex h-9 w-full rounded-lg border border-border bg-surface px-2.5 py-1 text-xs"
                value={newWard}
                onChange={(e) => setNewWard(e.target.value as WardType)}
              >
                <option value="general">General Ward</option>
                <option value="emergency">Emergency Casualty</option>
                <option value="icu">Intensive Care Unit (ICU)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold">Bed Identifier / Number</label>
              <Input
                placeholder="e.g. GEN-16"
                value={newBedNumber}
                onChange={(e) => setNewBedNumber(e.target.value)}
                className="h-9"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold">Price Per Day (₹ INR)</label>
              <Input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="h-9"
                required
              />
            </div>

            <div className="flex items-end gap-2">
              <Button type="submit" className="h-9 text-xs font-semibold w-full">
                Add Bed
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="h-9 text-xs"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface p-3.5 rounded-xl border border-border text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter:</span>
          </div>

          <select
            className="flex h-8 rounded-lg border border-border bg-surface px-2 py-1 text-xs"
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
          >
            <option value="all">All Wards ({beds.length})</option>
            <option value="general">General Ward</option>
            <option value="emergency">Emergency Ward</option>
            <option value="icu">ICU Ward</option>
          </select>

          <select
            className="flex h-8 rounded-lg border border-border bg-surface px-2 py-1 text-xs"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="available">Available Only</option>
            <option value="occupied">Occupied (Inpatient)</option>
            <option value="held">Under 10-Min Hold</option>
            <option value="booked">Booked</option>
          </select>
        </div>

        <div className="text-muted-foreground">
          Showing <strong>{filteredBeds.length}</strong> bed records
        </div>
      </div>

      {/* Bed Inventory Table / Grid */}
      <Card>
        <CardContent className="p-0 divide-y divide-border">
          {filteredBeds.map((bed) => (
            <div
              key={bed.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs hover:bg-muted/20 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-foreground">#{bed.bed_number}</span>
                  <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                    {bed.ward} WARD
                  </Badge>
                  <span className="font-semibold text-foreground">₹{bed.price_per_day} / day</span>
                </div>
                <div className="text-muted-foreground text-[11px]">
                  ID: {bed.id} | Status: <strong className="text-foreground uppercase">{bed.status}</strong>
                </div>
              </div>

              {/* Status Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-muted-foreground">Change Status:</span>
                <select
                  className="flex h-8 rounded-lg border border-border bg-surface px-2 py-1 text-xs font-semibold"
                  value={bed.status}
                  onChange={(e) => handleStatusChange(bed.id, e.target.value as BedStatus)}
                >
                  <option value="available">Available</option>
                  <option value="held">Held (10-Min)</option>
                  <option value="booked">Booked</option>
                  <option value="occupied">Occupied (Admitted)</option>
                  <option value="out_of_service">Out of Service</option>
                </select>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
