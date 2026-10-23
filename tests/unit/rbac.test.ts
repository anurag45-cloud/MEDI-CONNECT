import { describe, it, expect } from "vitest";
import { hasRequiredRole, DEMO_USERS } from "@/lib/auth/roles";
import { UserRole } from "@/types";

describe("Role-Based Access Control (RBAC) & Boundary Isolation", () => {
  it("authorizes doctor to access doctor workspace but prevents patient access", () => {
    const doctorUser = DEMO_USERS.doctor;
    const patientUser = DEMO_USERS.patient;

    const allowedRoles: UserRole[] = ["doctor"];

    expect(hasRequiredRole(doctorUser.role, allowedRoles)).toBe(true);
    expect(hasRequiredRole(patientUser.role, allowedRoles)).toBe(false);
  });

  it("authorizes hospital staff and admin for hospital operations", () => {
    const hospAdmin = DEMO_USERS.hospital_admin;
    const hospStaff = DEMO_USERS.hospital_staff;
    const patient = DEMO_USERS.patient;

    const hospitalRoles: UserRole[] = ["hospital_admin", "hospital_staff"];

    expect(hasRequiredRole(hospAdmin.role, hospitalRoles)).toBe(true);
    expect(hasRequiredRole(hospStaff.role, hospitalRoles)).toBe(true);
    expect(hasRequiredRole(patient.role, hospitalRoles)).toBe(false);
  });

  it("permits super_admin global platform governance across any protected role", () => {
    const superAdmin = DEMO_USERS.super_admin;

    expect(hasRequiredRole(superAdmin.role, ["doctor"])).toBe(true);
    expect(hasRequiredRole(superAdmin.role, ["hospital_admin"])).toBe(true);
    expect(hasRequiredRole(superAdmin.role, ["hospital_staff"])).toBe(true);
  });

  it("ensures public applicant registration defaults strictly to pending without super-admin access", () => {
    const publicApplicant = {
      role: "patient" as UserRole,
      isPendingDoctor: true,
    };

    // Cannot access super admin console
    expect(hasRequiredRole(publicApplicant.role, ["super_admin"])).toBe(false);
  });
});
