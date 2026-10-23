# MediConnect — Complete Digital Healthcare Platform

MediConnect is a unified, production-grade digital healthcare operating platform connecting **Patients**, **Verified Doctors**, **Accredited Hospitals**, and **Platform Administrators** through one cohesive application.

The four portals share a single backend architecture, centralized database, design system, and unified source of truth.

---

## 1. Architecture & Portals Overview

MediConnect implements four specialized portals:

| Portal | URL Path | Key Responsibilities |
|---|---|---|
| **Patient Portal** | `/` (Home), `/profile`, `/find-doctor`, `/hospitals`, `/appointments`, `/bed-bookings` | AI medical specialty triage, doctor scheduling, ward bed holds with 50% advance deposits, emergency triage guidance, and problem ticketing. |
| **Doctor Portal** | `/doctor/login`, `/doctor/register`, `/doctor/dashboard`, `/doctor/schedule`, `/doctor/appointments/[id]`, `/doctor/earnings` | OP consulting window management, conflict-free appointment queues, clinical notes workspace, patient allergy alerts, and fee settlement tracking. |
| **Hospital Portal** | `/hospital/login`, `/hospital/register`, `/hospital/dashboard`, `/hospital/beds`, `/hospital/admissions`, `/hospital/team`, `/hospital/finance` | Real-time ward bed map, admission check-in, patient discharge releasing beds transactionally, staff invitations, and financial reconciliation. |
| **Super-Admin Console** | `/admin/login`, `/admin/dashboard` | Credential verification for doctor & hospital applicants, user grievance resolution, payment dispute investigation, and immutable audit logs. |

---

## 2. Technology Stack

- **Framework**: Next.js 14+ (App Router) with strict TypeScript
- **Styling**: Tailwind CSS & CSS Variables (`#0F766E` primary teal, `#B91C1C` emergency red, `#F4F8FA` surface)
- **Database**: PostgreSQL / Supabase with Row Level Security (RLS) & Atomic Stored Functions
- **AI Triage**: Google Gemini 1.5 Flash (server-side structured JSON with bounded retry and clinical heuristic fallback)
- **Maps & Geolocation**: Haversine distance calculations with OpenStreetMap / Leaflet (fallback) and Google Maps API (preferred)
- **Payments**: Razorpay Test Mode with server-side order generation and cryptographic HMAC SHA256 signature verification
- **Emails**: Resend transactional email integration with structured fallback console logging
- **Testing**: Vitest unit & integration test suite (18 automated tests passing)

---

## 3. Environment Variables Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Required variables:

```dotenv
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Gemini Flash API Key
GEMINI_API_KEY=your-gemini-api-key

# Google Maps API (Optional: Fallback uses OpenStreetMap & Leaflet)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# Razorpay Test Mode Configuration
RAZORPAY_KEY_ID=rzp_test_yourkeyid
RAZORPAY_KEY_SECRET=yourkeysecret
RAZORPAY_WEBHOOK_SECRET=yourwebhooksecret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_yourkeyid

# Resend Email Configuration
RESEND_API_KEY=re_yourresendkey
ADMIN_EMAIL=admin@mediconnect.org

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Security Rule**: Secrets like `SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, and `GEMINI_API_KEY` are strictly server-side and never exposed to the client bundle.

---

## 4. Local Installation & Development

### Prerequisites
- Node.js 18.17+ or v20+ (developed & verified on Node v24)
- npm 10+ or compatible package manager

### Steps
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run database migrations on your Supabase project:
   Execute `supabase/migrations/20261024000000_init_mediconnect.sql` via Supabase SQL Editor.
3. Seed demonstration data:
   Execute `supabase/seed.sql` to populate Kota, Rajasthan pilot facilities (8 hospitals, 30 doctors, 20-60 beds per hospital).
4. Start development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Automated Tests & Build Verification

Run unit & integration test suite:
```bash
npm test
```
*Executes 18 automated tests across Haversine distance, Zod validation, HMAC signature verification, RBAC boundaries, and atomic bed hold logic.*

Build production bundle:
```bash
npm run build
```
*Verifies compilation, linting, and static pre-rendering across all 35 routes.*

---

## 6. One-Click Demo Credentials

For testing and rapid evaluation without external credentials, instant 1-click profiles are available on each portal's login screen:

| Role | Demo Email | Portal Route |
|---|---|---|
| **Patient** | `patient.demo@mediconnect.org` | `/login` |
| **Doctor** | `alok.shrivastava@kotaheart.org` | `/doctor/login` |
| **Hospital Admin** | `admin@kotaheart.org` | `/hospital/login` |
| **Hospital Staff** | `nurse.station@kotaheart.org` | `/hospital/login` |
| **Platform Super-Admin** | `superadmin@mediconnect.org` | `/admin/login` |

---

## 7. External Integrations & Fallback Protocol

1. **Google Gemini Flash**:
   - Analyzes reported symptoms to classify into medical specialties (e.g. Cardiology, Neurology, Pulmonology).
   - If `GEMINI_API_KEY` is not provided, the platform automatically switches to a deterministic clinical heuristic triage parser with exact matching schemas.
   - Emergency keywords (e.g., *chest pain*, *cannot breathe*, *unconscious*) instantly trigger an immediate emergency bypass banner with direct 108 casualty links.

2. **Maps (Google Maps & OpenStreetMap)**:
   - When `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is absent, the application renders OpenStreetMap with accurate Leaflet coordinates and Haversine distance calculations.

3. **Razorpay Payments**:
   - Order creation and signature validation are performed server-side with cryptographic HMAC SHA256 hashing.
   - If configured in sandbox test mode, transactions simulate valid checkout transitions and generate verified QR confirmation codes.

4. **Resend Email**:
   - Dispatches transactional booking confirmations and problem report acknowledgements. When unconfigured, messages are safely logged to the server console.

---

## 8. License & Medical Disclaimer

MediConnect is designed as a healthcare workflow and coordination platform. The AI specialty matching service does not diagnose disease or prescribe medication. Consult qualified healthcare professionals for all clinical concerns. In acute emergencies, dial national helplines (108 / 112 in India) or report to the nearest hospital casualty unit.
