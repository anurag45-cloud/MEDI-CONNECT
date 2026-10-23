import { UserRole } from "@/types";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  hospitalId?: string;
  isDemo?: boolean;
}

export const DEMO_USERS: Record<UserRole, AuthUser> = {
  patient: {
    id: "demo-patient-001",
    email: "patient.demo@mediconnect.org",
    role: "patient",
    fullName: "Rohit Verma",
    isDemo: true,
  },
  doctor: {
    id: "usr-doc-001",
    email: "alok.shrivastava@kotaheart.org",
    role: "doctor",
    fullName: "Dr. Alok Shrivastava",
    hospitalId: "hosp-001",
    isDemo: true,
  },
  hospital_admin: {
    id: "demo-hosp-admin-001",
    email: "admin@kotaheart.org",
    role: "hospital_admin",
    fullName: "Vikas Saxena (Hospital Ops)",
    hospitalId: "hosp-001",
    isDemo: true,
  },
  hospital_staff: {
    id: "demo-hosp-staff-001",
    email: "nurse.station@kotaheart.org",
    role: "hospital_staff",
    fullName: "Sunita Meena (Ward Incharge)",
    hospitalId: "hosp-001",
    isDemo: true,
  },
  super_admin: {
    id: "demo-super-admin-001",
    email: "superadmin@mediconnect.org",
    role: "super_admin",
    fullName: "Chief Medical Officer Admin",
    isDemo: true,
  },
};

export function hasRequiredRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  if (userRole === "super_admin") return true;
  return allowedRoles.includes(userRole);
}
