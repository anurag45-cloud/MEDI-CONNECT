import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export interface AppNotification {
  id: string;
  user_id?: string;
  role?: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "emergency";
  link?: string;
  read: boolean;
  created_at: string;
}

const notificationsStore: AppNotification[] = [
  {
    id: "notif-001",
    user_id: "demo-patient-001",
    role: "patient",
    title: "Appointment Confirmed",
    message: "Your appointment with Dr. Alok Shrivastava is scheduled for tomorrow at 10:00 AM.",
    type: "success",
    link: "/appointments",
    read: false,
    created_at: "2026-10-24T06:30:00Z",
  },
  {
    id: "notif-002",
    user_id: "demo-patient-001",
    role: "patient",
    title: "Bed Reservation Advance Paid",
    message: "50% advance for bed booking (BK-88200) confirmed. QR admission pass generated.",
    type: "info",
    link: "/bed-bookings",
    read: false,
    created_at: "2026-10-24T07:15:00Z",
  },
  {
    id: "notif-003",
    role: "doctor",
    title: "New Patient Consultation",
    message: "Rohit Verma has booked a 30-minute cardiology consultation slot.",
    type: "info",
    link: "/doctor/appointments/apt-101",
    read: false,
    created_at: "2026-10-24T07:45:00Z",
  },
  {
    id: "notif-004",
    role: "hospital_admin",
    title: "Emergency Bed Occupancy Alert",
    message: "Emergency ward occupancy reached 85% at Kota Heart Institute.",
    type: "warning",
    link: "/hospital/beds",
    read: true,
    created_at: "2026-10-23T18:00:00Z",
  },
  {
    id: "notif-005",
    role: "super_admin",
    title: "Pending Doctor Verification",
    message: "Dr. Rajesh Sharma (Cardiology) submitted medical credentials for verification.",
    type: "info",
    link: "/admin/dashboard",
    read: false,
    created_at: "2026-10-23T14:00:00Z",
  },
];

const markReadSchema = z.object({
  notificationId: z.string().optional(),
  markAllRead: z.boolean().optional(),
  userId: z.string().optional(),
  role: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const role = searchParams.get("role");

  let filtered = notificationsStore;

  if (userId) {
    filtered = filtered.filter((n) => !n.user_id || n.user_id === userId);
  } else if (role) {
    filtered = filtered.filter((n) => !n.role || n.role === role);
  }

  const unreadCount = filtered.filter((n) => !n.read).length;

  return NextResponse.json({
    success: true,
    notifications: filtered,
    unreadCount,
  });
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = markReadSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid mark read request", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { notificationId, markAllRead, userId, role } = parsed.data;

    if (markAllRead) {
      notificationsStore.forEach((n) => {
        if (userId && n.user_id === userId) n.read = true;
        else if (role && n.role === role) n.read = true;
        else if (!userId && !role) n.read = true;
      });
      return NextResponse.json({ success: true, message: "All notifications marked as read." });
    }

    if (notificationId) {
      const target = notificationsStore.find((n) => n.id === notificationId);
      if (target) {
        target.read = true;
        return NextResponse.json({ success: true, notification: target });
      }
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "notificationId or markAllRead required" }, { status: 400 });
  } catch (err) {
    console.error("Notifications mark read error:", err);
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
  }
}
