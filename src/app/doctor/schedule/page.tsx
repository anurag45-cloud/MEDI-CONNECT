"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Plus,
  Trash2,
  ArrowLeft,
  Save,
  ShieldCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function DoctorSchedulePage() {
  const [slotDuration, setSlotDuration] = useState("30");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [weeklySchedule, setWeeklySchedule] = useState([
    { day: "Monday", active: true, start: "09:00", end: "14:00" },
    { day: "Tuesday", active: true, start: "09:00", end: "14:00" },
    { day: "Wednesday", active: true, start: "09:00", end: "14:00" },
    { day: "Thursday", active: true, start: "09:00", end: "14:00" },
    { day: "Friday", active: true, start: "09:00", end: "14:00" },
    { day: "Saturday", active: true, start: "09:30", end: "13:30" },
    { day: "Sunday", active: false, start: "10:00", end: "13:00" },
  ]);

  const handleToggleDay = (idx: number) => {
    const updated = [...weeklySchedule];
    updated[idx].active = !updated[idx].active;
    setWeeklySchedule(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
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
            <Calendar className="h-5 w-5 text-brand-teal" />
            Consultation Slots & Weekly Working Hours
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure OP consulting windows. Slots are automatically published to patients seeking appointments at Kota Heart Institute.
          </p>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Schedule Published
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base font-semibold">Slot Duration & Consultation Policies</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Consultation Slot Duration (Mins)</label>
              <select
                className="flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={slotDuration}
                onChange={(e) => setSlotDuration(e.target.value)}
              >
                <option value="15">15 minutes (Quick follow-up)</option>
                <option value="20">20 minutes (Standard OPD)</option>
                <option value="30">30 minutes (Comprehensive exam)</option>
                <option value="45">45 minutes (Specialized assessment)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Anti-Conflict Policy</label>
              <div className="h-10 rounded-lg bg-muted/40 border border-border px-3 py-2 text-xs text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-brand-teal shrink-0" />
                <span>Database UNIQUE(doctor_id, slot_time) enforced</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Day Schedule */}
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base font-semibold">Weekly Operating Schedule</CardTitle>
            <CardDescription className="text-xs">
              Toggle working days and adjust start and end consulting times.
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-border p-0">
            {weeklySchedule.map((sched, idx) => (
              <div
                key={sched.day}
                className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm"
              >
                <div className="flex items-center gap-3 w-36">
                  <input
                    type="checkbox"
                    id={`day-${idx}`}
                    checked={sched.active}
                    onChange={() => handleToggleDay(idx)}
                    className="h-4 w-4 rounded text-brand-teal focus:ring-brand-teal"
                  />
                  <label
                    htmlFor={`day-${idx}`}
                    className={`font-semibold cursor-pointer ${
                      sched.active ? "text-foreground" : "text-muted-foreground line-through"
                    }`}
                  >
                    {sched.day}
                  </label>
                </div>

                {sched.active ? (
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground">Hours:</span>
                    <Input
                      type="time"
                      value={sched.start}
                      onChange={(e) => {
                        const copy = [...weeklySchedule];
                        copy[idx].start = e.target.value;
                        setWeeklySchedule(copy);
                      }}
                      className="h-8 w-28 text-xs"
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      type="time"
                      value={sched.end}
                      onChange={(e) => {
                        const copy = [...weeklySchedule];
                        copy[idx].end = e.target.value;
                        setWeeklySchedule(copy);
                      }}
                      className="h-8 w-28 text-xs"
                    />
                    <Badge variant="secondary" className="text-[10px]">
                      Available
                    </Badge>
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground italic">
                    Weekly Off / Non-Consulting Day
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="submit" className="gap-2 font-semibold">
            <Save className="h-4 w-4" />
            <span>Publish Working Hours</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
