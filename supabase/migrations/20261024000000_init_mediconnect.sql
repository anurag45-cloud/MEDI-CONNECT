-- MediConnect PostgreSQL Schema & Row Level Security
-- Migration: 20261024000000_init_mediconnect.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. PROFILES & ROLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  blood_group TEXT CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  avatar_url TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pin_code TEXT,
  height_cm NUMERIC,
  weight_kg NUMERIC,
  bmi NUMERIC,
  allergies TEXT[] DEFAULT '{}',
  chronic_conditions TEXT[] DEFAULT '{}',
  current_medications TEXT[] DEFAULT '{}',
  past_surgeries TEXT[] DEFAULT '{}',
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  insurance_provider TEXT,
  insurance_policy_number TEXT,
  health_data_consent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('patient', 'doctor', 'hospital_admin', 'hospital_staff', 'super_admin')),
  hospital_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role, hospital_id)
);

-- ============================================================================
-- 2. HOSPITALS & HOSPITAL STAFF
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pin_code TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  phone TEXT NOT NULL,
  emergency_phone TEXT NOT NULL,
  email TEXT NOT NULL,
  is_partner BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected', 'suspended')),
  departments TEXT[] DEFAULT '{}',
  facilities TEXT[] DEFAULT '{}',
  emergency_available BOOLEAN DEFAULT FALSE,
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hospital_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hospital_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_name TEXT NOT NULL,
  admin_email TEXT NOT NULL,
  admin_phone TEXT NOT NULL,
  license_number TEXT NOT NULL,
  document_url TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hospital_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('hospital_admin', 'hospital_staff')),
  permissions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(hospital_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.hospital_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('hospital_admin', 'hospital_staff')),
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. DOCTORS & SCHEDULES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  photo_url TEXT,
  specialty TEXT NOT NULL,
  qualifications TEXT[] NOT NULL,
  registration_number TEXT NOT NULL,
  registration_authority TEXT NOT NULL,
  experience_years INTEGER NOT NULL,
  languages TEXT[] DEFAULT '{}',
  biography TEXT,
  consultation_fee INTEGER NOT NULL,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
  department TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected', 'suspended')),
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  appointment_duration_mins INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.doctor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  specialty TEXT NOT NULL,
  qualifications TEXT[] DEFAULT '{}',
  registration_number TEXT NOT NULL,
  certificate_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.doctor_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration_mins INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.doctor_availability_exceptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  exception_date DATE NOT NULL,
  is_available BOOLEAN DEFAULT FALSE,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. APPOINTMENTS & CONSULTATION WORKSPACE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slot_time TIMESTAMPTZ NOT NULL,
  duration_mins INTEGER DEFAULT 30,
  fee INTEGER NOT NULL,
  reason_for_visit TEXT NOT NULL,
  patient_notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'rescheduled')),
  payment_status TEXT DEFAULT 'created' CHECK (payment_status IN ('created', 'captured', 'failed', 'refunded')),
  payment_id TEXT,
  clinical_notes TEXT,
  assessment TEXT,
  prescriptions TEXT,
  follow_up_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(doctor_id, slot_time)
);

-- ============================================================================
-- 5. BEDS & BED RESERVATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.beds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
  ward TEXT NOT NULL CHECK (ward IN ('general', 'emergency', 'icu', 'pediatric', 'maternity')),
  bed_number TEXT NOT NULL,
  price_per_day INTEGER NOT NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'held', 'booked', 'occupied', 'out_of_service')),
  hold_expires_at TIMESTAMPTZ,
  current_booking_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(hospital_id, ward, bed_number)
);

CREATE TABLE IF NOT EXISTS public.bed_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bed_id UUID NOT NULL REFERENCES public.beds(id) ON DELETE CASCADE,
  hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  patient_age INTEGER NOT NULL,
  patient_gender TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  attendant_name TEXT NOT NULL,
  attendant_phone TEXT NOT NULL,
  reason TEXT NOT NULL,
  admission_date TIMESTAMPTZ NOT NULL,
  expected_days INTEGER NOT NULL CHECK (expected_days > 0),
  is_emergency BOOLEAN DEFAULT FALSE,
  price_per_day INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  advance_payable INTEGER NOT NULL,
  remaining_balance INTEGER NOT NULL,
  hold_status TEXT DEFAULT 'held' CHECK (hold_status IN ('held', 'confirmed', 'expired', 'admitted', 'discharged', 'cancelled')),
  payment_id TEXT,
  payment_status TEXT DEFAULT 'created' CHECK (payment_status IN ('created', 'captured', 'failed', 'refunded')),
  qr_code TEXT,
  admitted_at TIMESTAMPTZ,
  discharged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Circular foreign key on beds(current_booking_id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_beds_current_booking'
  ) THEN
    ALTER TABLE public.beds
    ADD CONSTRAINT fk_beds_current_booking
    FOREIGN KEY (current_booking_id) REFERENCES public.bed_bookings(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.admissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES public.bed_bookings(id) ON DELETE CASCADE,
  bed_id UUID NOT NULL REFERENCES public.beds(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  admitted_by UUID REFERENCES auth.users(id),
  discharged_by UUID REFERENCES auth.users(id),
  admission_notes TEXT,
  discharge_notes TEXT,
  admitted_at TIMESTAMPTZ DEFAULT NOW(),
  discharged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. PAYMENTS, REPORTS & AUDIT LOGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id TEXT UNIQUE NOT NULL,
  payment_id TEXT UNIQUE,
  signature TEXT,
  amount INTEGER NOT NULL, -- in paise
  currency TEXT DEFAULT 'INR',
  type TEXT NOT NULL CHECK (type IN ('appointment', 'bed_advance')),
  reference_id UUID NOT NULL,
  status TEXT DEFAULT 'created' CHECK (status IN ('created', 'captured', 'failed', 'refunded')),
  refund_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.problem_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('booking', 'payment', 'hospital_experience', 'technical', 'other')),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  screenshot_url TEXT,
  related_booking_id TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  admin_reply TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  idempotency_key TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  role TEXT,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. ATOMIC TRANSACTIONAL FUNCTIONS
-- ============================================================================

-- Function: Release Expired Holds
CREATE OR REPLACE FUNCTION public.release_expired_holds()
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  -- Update bookings that were held and are past expiration
  UPDATE public.bed_bookings
  SET hold_status = 'expired',
      updated_at = NOW()
  WHERE hold_status = 'held'
    AND created_at + INTERVAL '10 minutes' < NOW();

  -- Release the corresponding beds
  UPDATE public.beds
  SET status = 'available',
      hold_expires_at = NULL,
      current_booking_id = NULL,
      updated_at = NOW()
  WHERE status = 'held'
    AND hold_expires_at < NOW();

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Atomic Bed Hold
CREATE OR REPLACE FUNCTION public.hold_bed(
  p_bed_id UUID,
  p_patient_id UUID,
  p_patient_name TEXT,
  p_patient_age INTEGER,
  p_patient_gender TEXT,
  p_patient_phone TEXT,
  p_attendant_name TEXT,
  p_attendant_phone TEXT,
  p_reason TEXT,
  p_admission_date TIMESTAMPTZ,
  p_expected_days INTEGER,
  p_is_emergency BOOLEAN
)
RETURNS JSONB AS $$
DECLARE
  v_bed RECORD;
  v_hospital RECORD;
  v_hold_expires TIMESTAMPTZ;
  v_total_price INTEGER;
  v_advance_payable INTEGER;
  v_remaining_balance INTEGER;
  v_booking_id UUID;
BEGIN
  -- Lazy clean up expired holds first
  PERFORM public.release_expired_holds();

  -- Lock the bed row for update
  SELECT * INTO v_bed
  FROM public.beds
  WHERE id = p_bed_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Bed not found');
  END IF;

  -- Ensure bed is available or previous hold expired
  IF v_bed.status <> 'available' THEN
    IF v_bed.status = 'held' AND v_bed.hold_expires_at < NOW() THEN
      -- safe to re-acquire expired hold
      NULL;
    ELSE
      RETURN jsonb_build_object('success', false, 'error', 'Bed is not available for booking');
    END IF;
  END IF;

  -- Emergency validation: If emergency ward bed, ensure emergency requirement
  IF v_bed.ward = 'emergency' AND NOT p_is_emergency THEN
    RETURN jsonb_build_object('success', false, 'error', 'Emergency ward beds require an emergency booking declaration');
  END IF;

  -- Calculate prices
  v_total_price := v_bed.price_per_day * p_expected_days;
  v_advance_payable := ROUND(v_total_price * 0.50);
  v_remaining_balance := v_total_price - v_advance_payable;
  v_hold_expires := NOW() + INTERVAL '10 minutes';

  -- Create bed booking record
  INSERT INTO public.bed_bookings (
    bed_id,
    hospital_id,
    patient_id,
    patient_name,
    patient_age,
    patient_gender,
    patient_phone,
    attendant_name,
    attendant_phone,
    reason,
    admission_date,
    expected_days,
    is_emergency,
    price_per_day,
    total_price,
    advance_payable,
    remaining_balance,
    hold_status,
    created_at,
    updated_at
  ) VALUES (
    v_bed.id,
    v_bed.hospital_id,
    p_patient_id,
    p_patient_name,
    p_patient_age,
    p_patient_gender,
    p_patient_phone,
    p_attendant_name,
    p_attendant_phone,
    p_reason,
    p_admission_date,
    p_expected_days,
    p_is_emergency,
    v_bed.price_per_day,
    v_total_price,
    v_advance_payable,
    v_remaining_balance,
    'held',
    NOW(),
    NOW()
  )
  RETURNING id INTO v_booking_id;

  -- Update bed with hold details
  UPDATE public.beds
  SET status = 'held',
      hold_expires_at = v_hold_expires,
      current_booking_id = v_booking_id,
      updated_at = NOW()
  WHERE id = v_bed.id;

  RETURN jsonb_build_object(
    'success', true,
    'booking_id', v_booking_id,
    'hold_expires_at', v_hold_expires,
    'total_price', v_total_price,
    'advance_payable', v_advance_payable,
    'remaining_balance', v_remaining_balance
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Confirm Bed Booking
CREATE OR REPLACE FUNCTION public.confirm_bed_booking(
  p_booking_id UUID,
  p_payment_id TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_booking RECORD;
  v_bed RECORD;
BEGIN
  SELECT * INTO v_booking
  FROM public.bed_bookings
  WHERE id = p_booking_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Booking record not found');
  END IF;

  SELECT * INTO v_bed
  FROM public.beds
  WHERE id = v_booking.bed_id
  FOR UPDATE;

  IF v_booking.hold_status = 'confirmed' THEN
    RETURN jsonb_build_object('success', true, 'message', 'Booking already confirmed', 'booking_id', v_booking.id);
  END IF;

  IF v_booking.hold_status <> 'held' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Booking hold has expired or is invalid');
  END IF;

  IF v_bed.hold_expires_at < NOW() THEN
    UPDATE public.bed_bookings SET hold_status = 'expired', updated_at = NOW() WHERE id = v_booking.id;
    UPDATE public.beds SET status = 'available', hold_expires_at = NULL, current_booking_id = NULL WHERE id = v_bed.id;
    RETURN jsonb_build_object('success', false, 'error', 'Hold time expired before confirmation');
  END IF;

  -- Confirm booking
  UPDATE public.bed_bookings
  SET hold_status = 'confirmed',
      payment_status = 'captured',
      payment_id = p_payment_id,
      updated_at = NOW()
  WHERE id = v_booking.id;

  -- Mark bed as booked
  UPDATE public.beds
  SET status = 'booked',
      hold_expires_at = NULL,
      updated_at = NOW()
  WHERE id = v_bed.id;

  RETURN jsonb_build_object('success', true, 'booking_id', v_booking.id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospital_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospital_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospital_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospital_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_availability_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bed_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: Is Super Admin
CREATE OR REPLACE FUNCTION public.is_super_admin(p_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = p_user_id AND role = 'super_admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles Policies
CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_super_admin(auth.uid()));

CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- User Roles Policies
CREATE POLICY "Users read own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id OR public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins manage roles" ON public.user_roles
  FOR ALL USING (public.is_super_admin(auth.uid()));

-- Hospitals Policies
CREATE POLICY "Public read verified hospitals" ON public.hospitals
  FOR SELECT USING (status = 'verified' OR public.is_super_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.hospital_staff WHERE hospital_id = hospitals.id AND user_id = auth.uid()
  ));

CREATE POLICY "Staff manage hospital" ON public.hospitals
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.hospital_staff WHERE hospital_id = hospitals.id AND user_id = auth.uid() AND role = 'hospital_admin'
  ) OR public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins insert hospital" ON public.hospitals
  FOR INSERT WITH CHECK (public.is_super_admin(auth.uid()));

-- Doctors Policies
CREATE POLICY "Public read verified doctors" ON public.doctors
  FOR SELECT USING (status = 'verified' OR user_id = auth.uid() OR public.is_super_admin(auth.uid()));

CREATE POLICY "Doctors update own profile" ON public.doctors
  FOR UPDATE USING (user_id = auth.uid() OR public.is_super_admin(auth.uid()));

CREATE POLICY "Doctors insert own record" ON public.doctors
  FOR INSERT WITH CHECK (user_id = auth.uid() OR public.is_super_admin(auth.uid()));

-- Schedules Policies
CREATE POLICY "Public read active schedules" ON public.doctor_schedules
  FOR SELECT USING (TRUE);

CREATE POLICY "Doctors manage schedules" ON public.doctor_schedules
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.doctors WHERE id = doctor_schedules.doctor_id AND user_id = auth.uid()
  ) OR public.is_super_admin(auth.uid()));

-- Appointments Policies
CREATE POLICY "Users read own appointments" ON public.appointments
  FOR SELECT USING (
    patient_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.doctors WHERE id = appointments.doctor_id AND user_id = auth.uid())
    OR public.is_super_admin(auth.uid())
  );

CREATE POLICY "Patients insert appointments" ON public.appointments
  FOR INSERT WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Clinicians and patients update appointments" ON public.appointments
  FOR UPDATE USING (
    patient_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.doctors WHERE id = appointments.doctor_id AND user_id = auth.uid())
    OR public.is_super_admin(auth.uid())
  );

-- Beds Policies
CREATE POLICY "Public read beds" ON public.beds
  FOR SELECT USING (TRUE);

CREATE POLICY "Hospital staff manage beds" ON public.beds
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.hospital_staff WHERE hospital_id = beds.hospital_id AND user_id = auth.uid()
  ) OR public.is_super_admin(auth.uid()));

-- Bed Bookings Policies
CREATE POLICY "Users read own bed bookings" ON public.bed_bookings
  FOR SELECT USING (
    patient_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.hospital_staff WHERE hospital_id = bed_bookings.hospital_id AND user_id = auth.uid())
    OR public.is_super_admin(auth.uid())
  );

CREATE POLICY "Patients insert bed bookings" ON public.bed_bookings
  FOR INSERT WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Hospital staff and patients update bookings" ON public.bed_bookings
  FOR UPDATE USING (
    patient_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.hospital_staff WHERE hospital_id = bed_bookings.hospital_id AND user_id = auth.uid())
    OR public.is_super_admin(auth.uid())
  );

-- Payments Policies
CREATE POLICY "Users read own payments" ON public.payments
  FOR SELECT USING (user_id = auth.uid() OR public.is_super_admin(auth.uid()));

CREATE POLICY "Users insert payments" ON public.payments
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Reports Policies
CREATE POLICY "Users read own reports" ON public.problem_reports
  FOR SELECT USING (user_id = auth.uid() OR public.is_super_admin(auth.uid()));

CREATE POLICY "Users insert reports" ON public.problem_reports
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Super admins update reports" ON public.problem_reports
  FOR UPDATE USING (public.is_super_admin(auth.uid()));

-- Notifications Policies
CREATE POLICY "Users manage own notifications" ON public.notifications
  FOR ALL USING (user_id = auth.uid());

-- Audit Logs Policies
CREATE POLICY "Super admins read audit logs" ON public.audit_logs
  FOR SELECT USING (public.is_super_admin(auth.uid()));

CREATE POLICY "System inserts audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (TRUE);
