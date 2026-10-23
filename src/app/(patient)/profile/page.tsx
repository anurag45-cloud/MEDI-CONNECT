"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  User,
  Heart,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Save,
  Edit2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEMO_USERS } from "@/lib/auth/roles";

export default function PatientProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80"
  );

  const [profile, setProfile] = useState({
    fullName: "Rohit Verma",
    email: DEMO_USERS.patient.email,
    phone: "+91 98290 55443",
    dateOfBirth: "1995-06-15",
    gender: "male",
    bloodGroup: "B+",
    address: "Flat 304, Coral Residency, Talwandi",
    city: "Kota",
    state: "Rajasthan",
    pinCode: "324005",
    heightCm: 175,
    weightKg: 72,
    allergies: "Penicillin, Sulfa drugs",
    chronicConditions: "Mild Allergic Rhinitis",
    currentMedications: "Montelukast 10mg (Seasonal)",
    pastSurgeries: "Appendectomy (2018)",
    emergencyContactName: "Sanjay Verma (Father)",
    emergencyContactPhone: "+91 98290 12345",
    insuranceProvider: "Star Health & Allied Insurance",
    insurancePolicyNumber: "SH-2024-998812",
    healthDataConsent: true,
  });

  // Calculate age from DOB
  const calculateAge = (dobString: string) => {
    if (!dobString) return null;
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Calculate BMI
  const calculateBMI = (heightCm: number, weightKg: number) => {
    if (!heightCm || !weightKg) return null;
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    return bmi.toFixed(1);
  };

  const calculatedAge = calculateAge(profile.dateOfBirth);
  const calculatedBMI = calculateBMI(profile.heightCm, profile.weightKg);

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: "text-amber-600 bg-amber-50" };
    if (bmi < 25) return { label: "Normal weight", color: "text-emerald-700 bg-emerald-50" };
    if (bmi < 30) return { label: "Overweight", color: "text-amber-600 bg-amber-50" };
    return { label: "Obese", color: "text-red-700 bg-red-50" };
  };

  const bmiInfo = calculatedBMI ? getBMICategory(parseFloat(calculatedBMI)) : null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.healthDataConsent) {
      alert("Explicit consent is required to store sensitive personal health data.");
      return;
    }
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <User className="h-6 w-6 text-brand-teal" />
            Patient Health Profile
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Personal health record encrypted and restricted to you and your treating clinicians.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Profile Updated
            </span>
          )}
          <Button
            type="button"
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="gap-1.5"
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4" /> Save Mode Active
              </>
            ) : (
              <>
                <Edit2 className="h-4 w-4" /> Edit Profile
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Demographics & Contact */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <User className="h-4 w-4 text-brand-teal" />
              Demographic & Contact Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <Image
                  src={avatarPreview}
                  alt={profile.fullName}
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full object-cover border-2 border-brand-teal"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 p-1.5 bg-brand-teal text-white rounded-full cursor-pointer hover:bg-brand-teal-hover shadow-sm">
                    <Upload className="h-3.5 w-3.5" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAvatarPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              <div className="space-y-1 text-center sm:text-left flex-1">
                <div className="text-lg font-bold text-foreground">{profile.fullName}</div>
                <div className="text-xs text-muted-foreground flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {profile.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {profile.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {profile.city}, {profile.state}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Full Name</label>
                <Input
                  disabled={!isEditing}
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Date of Birth</label>
                <div className="relative">
                  <Input
                    type="date"
                    disabled={!isEditing}
                    value={profile.dateOfBirth}
                    onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                  />
                </div>
                {calculatedAge !== null && (
                  <div className="text-[11px] text-muted-foreground">Calculated Age: {calculatedAge} years</div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Gender</label>
                <select
                  disabled={!isEditing}
                  className="flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm disabled:opacity-60"
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Blood Group</label>
                <select
                  disabled={!isEditing}
                  className="flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm disabled:opacity-60 font-semibold"
                  value={profile.bloodGroup}
                  onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground">Residential Address</label>
                <Input
                  disabled={!isEditing}
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">City</label>
                <Input
                  disabled={!isEditing}
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">State</label>
                <Input
                  disabled={!isEditing}
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">PIN Code</label>
                <Input
                  disabled={!isEditing}
                  value={profile.pinCode}
                  onChange={(e) => setProfile({ ...profile, pinCode: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Vitals & Calculated BMI */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Heart className="h-4 w-4 text-brand-teal" />
              Physical Vitals & Body Mass Index
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Height (cm)</label>
                <Input
                  type="number"
                  disabled={!isEditing}
                  value={profile.heightCm}
                  onChange={(e) => setProfile({ ...profile, heightCm: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Weight (kg)</label>
                <Input
                  type="number"
                  disabled={!isEditing}
                  value={profile.weightKg}
                  onChange={(e) => setProfile({ ...profile, weightKg: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="rounded-xl border border-border bg-muted/30 p-3 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase">Calculated BMI</div>
                  <div className="text-xl font-bold text-foreground">{calculatedBMI || "—"}</div>
                </div>
                {bmiInfo && (
                  <Badge variant="outline" className={`font-semibold text-xs ${bmiInfo.color}`}>
                    {bmiInfo.label}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Clinical History */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Clinical History & Known Allergies
            </CardTitle>
            <CardDescription className="text-xs">
              This data alerts treating doctors during prescription and emergency admission triage.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Drug & Food Allergies</label>
                <Input
                  disabled={!isEditing}
                  placeholder="e.g. Penicillin, Peanuts"
                  value={profile.allergies}
                  onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Chronic Conditions</label>
                <Input
                  disabled={!isEditing}
                  placeholder="e.g. Hypertension, Type 2 Diabetes"
                  value={profile.chronicConditions}
                  onChange={(e) => setProfile({ ...profile, chronicConditions: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Current Regular Medications</label>
                <Input
                  disabled={!isEditing}
                  placeholder="e.g. Metformin 500mg OD"
                  value={profile.currentMedications}
                  onChange={(e) => setProfile({ ...profile, currentMedications: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Past Surgeries or Major Procedures</label>
                <Input
                  disabled={!isEditing}
                  placeholder="e.g. Cholecystectomy (2020)"
                  value={profile.pastSurgeries}
                  onChange={(e) => setProfile({ ...profile, pastSurgeries: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Emergency Contact & Insurance */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-sky-600" />
              Emergency Contact & Insurance Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Primary Emergency Contact Name</label>
                <Input
                  disabled={!isEditing}
                  value={profile.emergencyContactName}
                  onChange={(e) => setProfile({ ...profile, emergencyContactName: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Emergency Contact Phone Number</label>
                <Input
                  disabled={!isEditing}
                  value={profile.emergencyContactPhone}
                  onChange={(e) => setProfile({ ...profile, emergencyContactPhone: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Health Insurance Provider</label>
                <Input
                  disabled={!isEditing}
                  value={profile.insuranceProvider}
                  onChange={(e) => setProfile({ ...profile, insuranceProvider: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Insurance Policy / Card Number</label>
                <Input
                  disabled={!isEditing}
                  value={profile.insurancePolicyNumber}
                  onChange={(e) => setProfile({ ...profile, insurancePolicyNumber: e.target.value })}
                />
              </div>
            </div>

            {/* Explicit Consent Checkbox */}
            <div className="rounded-xl border border-teal-200 dark:border-teal-900 bg-teal-50/50 dark:bg-teal-950/30 p-4 pt-3 flex items-start gap-3">
              <input
                type="checkbox"
                id="healthConsent"
                disabled={!isEditing}
                checked={profile.healthDataConsent}
                onChange={(e) => setProfile({ ...profile, healthDataConsent: e.target.checked })}
                className="mt-1 h-4 w-4 rounded text-brand-teal focus:ring-brand-teal"
              />
              <label htmlFor="healthConsent" className="text-xs text-foreground leading-relaxed cursor-pointer">
                <strong>Explicit Clinical Data Consent:</strong> I authorize MediConnect to store this personal medical profile and grant read access to attending physicians and hospital ward teams during my active consultations and inpatient admissions.
              </label>
            </div>
          </CardContent>
        </Card>

        {isEditing && (
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" />
              Save Health Profile
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
