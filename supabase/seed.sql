-- MediConnect Idempotent Kota Demonstration Seed Data
-- Database: PostgreSQL / Supabase

-- 1. HOSPITALS
INSERT INTO public.hospitals (
  id, name, slug, address, city, state, pin_code, latitude, longitude,
  phone, emergency_phone, email, is_partner, status, departments, facilities,
  emergency_available, rating, review_count
) VALUES
(
  'a0000000-0000-0000-0000-000000000001',
  'Kota Heart Institute & Multispecialty Centre',
  'kota-heart-institute',
  '10-A, Jhalawar Road, Indraprastha Industrial Area',
  'Kota', 'Rajasthan', '324005',
  25.1583, 75.8450,
  '+91 744 242 5555', '+91 744 242 9999', 'emergency@kotaheart.org',
  TRUE, 'verified',
  ARRAY['Cardiology', 'Cardiothoracic Surgery', 'Critical Care', 'Interventional Radiology'],
  ARRAY['24/7 Cardiac Cath Lab', 'Advanced CCU', 'Cardiac Ambulance', 'In-house Pathology', 'Blood Bank'],
  TRUE, 4.8, 312
),
(
  'a0000000-0000-0000-0000-000000000002',
  'Sudha Hospital & Medical Research Institute',
  'sudha-hospital',
  'Plot 11, Talwandi Medical Corridor',
  'Kota', 'Rajasthan', '324005',
  25.1480, 75.8390,
  '+91 744 240 1000', '+91 744 240 9111', 'desk@sudhahospital.in',
  TRUE, 'verified',
  ARRAY['Neurology', 'Neurosurgery', 'General Medicine', 'Gastroenterology'],
  ARRAY['1.5T MRI', '64 Slice CT', 'Level 3 ICU', 'Dialysis Unit'],
  TRUE, 4.7, 245
),
(
  'a0000000-0000-0000-0000-000000000003',
  'Bharat Vikas Parishad Multi-Specialty Hospital',
  'bharat-vikas-parishad',
  'Sector 1, Vigyan Nagar',
  'Kota', 'Rajasthan', '324005',
  25.1390, 75.8310,
  '+91 744 243 3222', '+91 744 243 3108', 'care@bvpkotahospital.org',
  TRUE, 'verified',
  ARRAY['Orthopedics', 'Joint Replacement', 'Pulmonology', 'General Surgery'],
  ARRAY['Laminar Air Flow Modular OTs', 'Trauma ICU', 'Physiotherapy Complex'],
  TRUE, 4.6, 189
),
(
  'a0000000-0000-0000-0000-000000000004',
  'MBS Hospital & Government Medical College',
  'mbs-govt-hospital',
  'Medical Enclave, Nayapura',
  'Kota', 'Rajasthan', '324001',
  25.1880, 75.8390,
  '+91 744 232 4001', '+91 744 232 4108', 'emergency@mbshospital.rajasthan.gov.in',
  TRUE, 'verified',
  ARRAY['Emergency Medicine', 'General Medicine', 'Pediatrics', 'Obstetrics & Gynecology', 'Psychiatry'],
  ARRAY['Regional Trauma Centre', 'Central Blood Bank', 'Pediatric ICU', 'Burn Unit'],
  TRUE, 4.3, 512
),
(
  'a0000000-0000-0000-0000-000000000005',
  'Jay Kay Mother & Child Care Hospital',
  'jay-kay-hospital',
  'Scheme 5, Dadabari',
  'Kota', 'Rajasthan', '324009',
  25.1610, 75.8200,
  '+91 744 250 8800', '+91 744 250 8888', 'info@jaykaypediatrics.org',
  TRUE, 'verified',
  ARRAY['Pediatrics', 'Neonatology', 'Obstetrics & Gynecology', 'Pediatric Surgery'],
  ARRAY['Level 3 NICU', 'Pediatric Emergency', 'Fetal Medicine Clinic'],
  TRUE, 4.9, 174
),
(
  'a0000000-0000-0000-0000-000000000006',
  'Maitri Hospital & Neuro Care',
  'maitri-neuro-hospital',
  'Block B, Mahaveer Nagar Extension',
  'Kota', 'Rajasthan', '324005',
  25.1420, 75.8520,
  '+91 744 247 1200', '+91 744 247 9108', 'care@maitrineuro.in',
  TRUE, 'verified',
  ARRAY['Neurology', 'Stroke Centre', 'Psychiatry', 'Dermatology'],
  ARRAY['Stroke Interventional Unit', 'Sleep Lab', 'Digital EEG/EMG'],
  TRUE, 4.7, 142
),
(
  'a0000000-0000-0000-0000-000000000007',
  'Mittal Orthopaedic & Trauma Centre',
  'mittal-orthopaedic-centre',
  'Station Road, Chawani Circle',
  'Kota', 'Rajasthan', '324007',
  25.1710, 75.8480,
  '+91 744 236 4111', '+91 744 236 4999', 'trauma@mittalortho.com',
  TRUE, 'verified',
  ARRAY['Orthopedics', 'Trauma Surgery', 'Spine Surgery', 'Sports Medicine'],
  ARRAY['Computer Navigated Surgery', 'Advanced Fracture Care Unit', 'Rehabilitation Gymnasium'],
  TRUE, 4.6, 168
),
(
  'a0000000-0000-0000-0000-000000000008',
  'City Care Multi-Specialty Hospital',
  'city-care-hospital',
  'Chambal Bridge Road, Kunhari',
  'Kota', 'Rajasthan', '324008',
  25.2050, 75.8350,
  '+91 744 285 2200', '+91 744 285 2911', 'info@citycarekota.com',
  TRUE, 'verified',
  ARRAY['General Medicine', 'Ophthalmology', 'ENT', 'Dermatology', 'Gastroenterology'],
  ARRAY['Daycare Surgery Centre', 'Microscopic ENT Unit', 'Ophthalmic Laser OT'],
  FALSE, 4.5, 98
)
ON CONFLICT (slug) DO NOTHING;

-- 2. SAMPLE DOCTORS
INSERT INTO public.doctors (
  id, full_name, email, phone, specialty, qualifications,
  registration_number, registration_authority, experience_years, languages,
  biography, consultation_fee, hospital_id, department, status, rating, review_count
) VALUES
(
  'b0000000-0000-0000-0000-000000000001',
  'Dr. Alok Shrivastava', 'alok.shrivastava@kotaheart.org', '+91 98290 11001',
  'Cardiology', ARRAY['MBBS (AIIMS)', 'MD (Medicine)', 'DM (Cardiology)'],
  'RMC/48912/2006', 'Rajasthan Medical Council', 18, ARRAY['Hindi', 'English'],
  'Chief Interventional Cardiologist specializing in primary coronary angioplasty and cardiac pacemaker implantation.',
  800, 'a0000000-0000-0000-0000-000000000001', 'Cardiology', 'verified', 4.9, 245
),
(
  'b0000000-0000-0000-0000-000000000002',
  'Dr. Sunita Pareek', 'sunita.pareek@kotaheart.org', '+91 98290 11002',
  'Cardiology', ARRAY['MBBS (SMS Jaipur)', 'MD (Medicine)', 'DNB (Cardiology)'],
  'RMC/52104/2009', 'Rajasthan Medical Council', 15, ARRAY['Hindi', 'English', 'Marwari'],
  'Consultant Non-Invasive Cardiologist with focus on preventive cardiology and 3D echocardiography.',
  700, 'a0000000-0000-0000-0000-000000000001', 'Cardiology', 'verified', 4.8, 178
),
(
  'b0000000-0000-0000-0000-000000000003',
  'Dr. Manish Mathur', 'manish.mathur@sudhahospital.in', '+91 98290 11004',
  'Neurology', ARRAY['MBBS (AIIMS)', 'MD (Medicine)', 'DM (Neurology, NIMHANS)'],
  'RMC/44319/2004', 'Rajasthan Medical Council', 20, ARRAY['Hindi', 'English'],
  'Neurology specialist in hyperacute ischemic stroke thrombolysis and refractory epilepsy.',
  900, 'a0000000-0000-0000-0000-000000000002', 'Neurology', 'verified', 4.9, 220
),
(
  'b0000000-0000-0000-0000-000000000004',
  'Dr. Rajeshwar Mittal', 'dr.mittal@mittalortho.com', '+91 98290 11006',
  'Orthopedics', ARRAY['MBBS', 'MS (Orthopaedics)', 'MCh (Joint Replacement, UK)'],
  'RMC/36102/2000', 'Rajasthan Medical Council', 24, ARRAY['Hindi', 'English'],
  'Pioneer in robotic total knee & hip arthroplasty in Hadoti region.',
  800, 'a0000000-0000-0000-0000-000000000007', 'Orthopedics', 'verified', 4.9, 360
)
ON CONFLICT (id) DO NOTHING;

-- 3. BEDS (Sample for Kota Heart Institute)
INSERT INTO public.beds (hospital_id, ward, bed_number, price_per_day, status)
VALUES
('a0000000-0000-0000-0000-000000000001', 'emergency', 'EMG-01', 3500, 'available'),
('a0000000-0000-0000-0000-000000000001', 'emergency', 'EMG-02', 3500, 'available'),
('a0000000-0000-0000-0000-000000000001', 'emergency', 'EMG-03', 3500, 'available'),
('a0000000-0000-0000-0000-000000000001', 'emergency', 'EMG-04', 3500, 'occupied'),
('a0000000-0000-0000-0000-000000000001', 'general', 'GEN-01', 1500, 'available'),
('a0000000-0000-0000-0000-000000000001', 'general', 'GEN-02', 1500, 'available'),
('a0000000-0000-0000-0000-000000000001', 'general', 'GEN-03', 1500, 'available'),
('a0000000-0000-0000-0000-000000000001', 'general', 'GEN-04', 1500, 'occupied'),
('a0000000-0000-0000-0000-000000000001', 'icu', 'ICU-01', 6000, 'available'),
('a0000000-0000-0000-0000-000000000001', 'icu', 'ICU-02', 6000, 'occupied')
ON CONFLICT (hospital_id, ward, bed_number) DO NOTHING;
