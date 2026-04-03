-- Fix 1: gender column missing from application details
ALTER TABLE nesam_application_details ADD COLUMN IF NOT EXISTS gender VARCHAR(10);

-- Fix 2: percent_share missing from application details (for single-nominee MVP)
ALTER TABLE nesam_application_details ADD COLUMN IF NOT EXISTS nominee_percent_share NUMERIC(5,2) DEFAULT 100.00;

-- Fix 3: Index for fast email lookup on applications table
CREATE INDEX IF NOT EXISTS idx_applications_email ON nesam_applications(email_id);

-- Fix 4: Index on alumni master email for fast eligibility check
CREATE INDEX IF NOT EXISTS idx_alumni_email ON aa_alumni_master(email_id);
