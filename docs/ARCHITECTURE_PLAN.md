# MediConnect Architecture & Implementation Plan

## 1. Repository Assessment
- **Initial State**: Empty directory (`c:\Users\DELL\Desktop\TECHFEST 2`).
- **Target Stack**: Next.js 14 App Router, TypeScript (strict), Tailwind CSS, Supabase (PostgreSQL, Auth, RLS, Storage, Realtime), Gemini AI Flash, Razorpay Test Mode, Resend Email, Leaflet/OpenStreetMap with Google Maps fallback, Vitest.
- **Goal**: Full four-portal healthcare operating platform connecting Patients, Doctors, Hospitals, and Super-Administrators.

## 2. Proposed Folder Structure
```text
mediconnect/
├── src/
│   ├── app/
│   │   ├── (public)/              # Landing, login, signup, privacy, terms
│   │   ├── (patient)/             # Patient dashboard, find-doctor, hospitals, appointments, bed-bookings, profile, report-problem
│   │   ├── doctor/                # Doctor login, register, dashboard, schedule, appointments, profile, earnings
│   │   ├── hospital/              # Hospital login, register, dashboard, beds, admissions, team, finance
│   │   ├── admin/                 # Super-admin login, dashboard, verifications, reports, payments, audit logs
│   │   └── api/                   # Server endpoints (AI, appointments, beds, payments, webhooks, reports)
│   ├── components/
│   │   ├── ui/                    # Base design system primitives (button, card, dialog, badge, input, etc.)
│   │   ├── layout/                # Global navigation, footers, emergency banner, portal headers
│   │   ├── patient/               # Patient-specific interactive components
│   │   ├── doctor/                # Doctor-specific schedules & consultation workspace
│   │   ├── hospital/              # Bed grid, ward visualizer, admissions manager
│   │   ├── admin/                 # Audit tables, approval workflows, report resolution
│   │   └── shared/                # Maps, QR viewer, payment checkout, notifications
│   ├── lib/
│   │   ├── supabase/              # Browser client, server client, service-role admin client
│   │   ├── auth/                  # RBAC session guards, permissions, portal routing
│   │   ├── validation/            # Zod schemas for all forms & endpoints
│   │   ├── payments/              # Razorpay order creator, signature verifier, refund handler
│   │   ├── email/                 # Resend transactional email templates
│   │   ├── maps/                  # Unified geocoding & map provider (Google Maps + Leaflet fallback)
│   │   ├── ai/                    # Gemini Flash specialty classifier & triage guardrails
│   │   └── store/                 # Demo / fallback state store with Kota dataset
│   ├── types/                     # Shared domain models & database types
│   └── middleware.ts              # Route protection & role enforcement
├── supabase/
│   ├── migrations/                # Versioned SQL migrations (schema, RLS, functions)
│   └── seed.sql                   # Realistic Kota, Rajasthan demonstration dataset
├── tests/
│   ├── unit/                      # Validation, calculation, and auth tests
│   └── integration/               # Transactional bed holds & payment verification
├── .env.example
├── BUILD_STATUS.md
└── package.json
```

## 3. Phase-by-Phase Execution Plan
- **Phase 1: Audit & Design Foundation**: Setup styling tokens, CSS variables (light/dark), semantic color palette, shared UI primitives, compact patient header, emergency banner, accessible global navigation.
- **Phase 2: Database & Seed Data**: Write full SQL migrations covering 21+ tables, atomic functions (`hold_bed`, `confirm_bed_booking`, `release_expired_holds`), RLS policies, indexes, and comprehensive Kota seed data (8 hospitals, 30 doctors, 12 specialties, 20-60 beds per hospital).
- **Phase 3: Authentication & Multi-Portal RBAC**: Patient, Doctor, Hospital Staff, and Super-Admin authentication, role verification, session management, middleware guards, and application onboarding.
- **Phase 4: Patient Profile & Problem Reports**: Profile management with medical details, BMI, emergency contact, consent, storage uploads, settings, and problem report ticketing with email receipts.
- **Phase 5: Hospital Discovery & Maps**: Verified partner beds vs external non-partnered hospitals, OpenStreetMap / Leaflet interactive map with Google Maps API fallback, Haversine distance calculations, hospital detail profiles.
- **Phase 6: Doctor Discovery & Doctor Portal**: Gemini Flash medical specialty triage, verified doctor directory, calendar slots, doctor dashboard, consultation workspace, and earnings ledger.
- **Phase 7: Appointment Booking & Payments**: Conflict-safe booking, Razorpay test mode checkout, HMAC signature verification, rescheduling, cancellation, and receipt generator.
- **Phase 8: Bed Booking Engine**: Visual ward bed grid, atomic PostgreSQL holds, 50% advance payment calculation, Realtime status synchronization, QR verification, and hospital check-in/discharge.
- **Phase 9: Hospital Management & Platform Super-Admin**: Hospital ward management, staff invitations, admissions queue, admin review of doctor/hospital registrations, payment dispute resolution, and audit logs.
- **Phase 10: Notifications, Verification & Automated Tests**: Resend transactional emails, Vitest unit and integration test suite, comprehensive README with setup guide and test payment instructions.
