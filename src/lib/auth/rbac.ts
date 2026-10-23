import { UserRole } from "@/types";
import { AuthUser, DEMO_USERS, hasRequiredRole } from "./roles";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export { DEMO_USERS, hasRequiredRole, type AuthUser };

/**
 * Server-side session & role resolver.
 * Inspects active Supabase session or active demo cookie.
 */
export async function getAuthenticatedUser(): Promise<AuthUser | null> {
  const supabase = createServerSupabaseClient();

  if (supabase) {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (user && !error) {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role, hospital_id")
        .eq("user_id", user.id);

      const primaryRole = (roles?.[0]?.role as UserRole) || "patient";
      const hospitalId = roles?.[0]?.hospital_id;

      return {
        id: user.id,
        email: user.email || "",
        role: primaryRole,
        fullName: user.user_metadata?.full_name || "Authorized User",
        hospitalId,
        isDemo: false,
      };
    }
  }

  return null;
}
