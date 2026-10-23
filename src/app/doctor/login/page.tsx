import React from "react";
import { AuthCard } from "@/components/auth/auth-card";

export default function DoctorLoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
      <AuthCard portal="doctor" mode="login" />
    </div>
  );
}
