-- NESAm Database Schema — PostgreSQL 16
-- Version: 1.6 (MVP-complete)
-- Changes from v1.5:
--   - Added settlement_records table (was missing, present in ER v1.5 and MySQL script)
--   - Added partial unique index enforcing INV-ML-02 (single ACTIVE/NOTICE_PERIOD per user)
--   - Added address columns to memberships (required by registration + profile update flow)
--   - Added self_declaration_accepted to memberships (required by SRS 7.3 consent flag)
--   - Added branch/department to memberships (SRS 7.3 field, future analytics)
--   - Added updated_at trigger on user_profiles (keeps timestamp accurate on PATCH /member/profile)
--   - Added FK on settlement_records.approved_by_user_uuid (referential integrity)

-- Enable UUID generator
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------
-- ENUM TYPES
-- -----------------------------------------------------

CREATE TYPE membership_status AS ENUM ('PENDING','ACTIVE','NOTICE_PERIOD','LAPSED','DECEASED');
CREATE TYPE gender_type AS ENUM ('MALE','FEMALE','OTHER');
CREATE TYPE membership_category AS ENUM ('REGULAR','PATRON');

CREATE TYPE transaction_type AS ENUM ('CREDIT','DEBIT','DEMAND');
CREATE TYPE transaction_category AS ENUM ('MEMBERSHIP_FEE','SECURITY_DEPOSIT_TOPUP','DFC_CONTRIBUTION','DEPOSIT_ADJUSTMENT','REFUND');
CREATE TYPE transaction_status AS ENUM ('INITIATED','SUCCESS','FAILED','PENDING','OVERDUE');

CREATE TYPE notification_intent AS ENUM ('ALERT','REMINDER','INFO','DEMAND');

-- -----------------------------------------------------
-- SYSTEM PARAMETERS
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS system_parameters (
  param_key VARCHAR(50) PRIMARY KEY,
  param_value VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_recalculated_at TIMESTAMP
);

-- -----------------------------------------------------
-- MASTER FEE SLABS
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS master_fee_slabs (
  slab_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  min_age INT NOT NULL,
  max_age INT NOT NULL,
  display_label VARCHAR(50) NOT NULL,
  fee_amount DECIMAL(10,2) NOT NULL,
  valid_from DATE NOT NULL,
  valid_to DATE,
  CONSTRAINT chk_fee_age_range CHECK (max_age >= min_age),
  CONSTRAINT chk_fee_amount_non_neg CHECK (fee_amount >= 0),
  CONSTRAINT chk_fee_validity CHECK (valid_to IS NULL OR valid_to >= valid_from),
  CONSTRAINT uq_fee_slab_logic UNIQUE (min_age,max_age,valid_from)
);

CREATE INDEX idx_fee_validity ON master_fee_slabs(valid_from,valid_to);

-- -----------------------------------------------------
-- MASTER DFC RATES
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS master_dfc_rates (
  rate_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  min_age INT NOT NULL,
  max_age INT NOT NULL,
  display_label VARCHAR(50) NOT NULL,
  dfc_amount DECIMAL(10,2) NOT NULL,
  valid_from DATE NOT NULL,
  valid_to DATE,
  CONSTRAINT chk_dfc_age_range CHECK (max_age >= min_age),
  CONSTRAINT chk_dfc_amount_non_neg CHECK (dfc_amount >= 0),
  CONSTRAINT chk_dfc_validity CHECK (valid_to IS NULL OR valid_to >= valid_from),
  CONSTRAINT uq_dfc_rate_logic UNIQUE (min_age,max_age,valid_from)
);

CREATE INDEX idx_dfc_validity ON master_dfc_rates(valid_from,valid_to);

-- -----------------------------------------------------
-- USER PROFILES
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS user_profiles (
  user_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mobile_number VARCHAR(15) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  irttaa_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Auto-update updated_at on user_profiles whenever a row is modified.
-- Required so PATCH /member/profile (FR-MA-21) keeps the timestamp accurate.
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- -----------------------------------------------------
-- MEMBERSHIPS
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS memberships (
  nesam_id VARCHAR(20) PRIMARY KEY,
  user_uuid UUID NOT NULL,
  current_status membership_status DEFAULT 'PENDING',

  dob DATE NOT NULL,
  gender gender_type NOT NULL,
  graduation_year INT NOT NULL,

  membership_type membership_category NOT NULL,
  is_founding_member BOOLEAN DEFAULT FALSE,
  is_senior_exempt BOOLEAN DEFAULT FALSE,

  -- Address fields (collected during registration, updatable via PATCH /member/profile — FR-MA-21)
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city          VARCHAR(100),
  state         VARCHAR(100),
  pin_code      VARCHAR(10),
  country       VARCHAR(50) DEFAULT 'India',

  -- Consent flag (SRS 7.3 — must be TRUE before registration can complete)
  self_declaration_accepted BOOLEAN NOT NULL DEFAULT FALSE,

  -- Branch/department (SRS 7.3 — record keeping; not blocking for MVP flow)
  branch VARCHAR(100),

  security_deposit_balance DECIMAL(10,2) DEFAULT 0.00,

  enrollment_date DATE NOT NULL,
  lapsed_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_membership_user
  FOREIGN KEY(user_uuid) REFERENCES user_profiles(user_uuid),

  CONSTRAINT chk_deposit_non_neg CHECK (security_deposit_balance >= 0),
  CONSTRAINT chk_valid_year CHECK (graduation_year BETWEEN 1901 AND 2155)
);

CREATE INDEX idx_user_membership ON memberships(user_uuid);
CREATE INDEX idx_status ON memberships(current_status);

-- INV-ML-02: A user may have only one ACTIVE or NOTICE_PERIOD membership at a time.
-- Partial unique index — only rows in these two statuses are considered.
CREATE UNIQUE INDEX uq_one_active_membership
  ON memberships(user_uuid)
  WHERE current_status IN ('ACTIVE','NOTICE_PERIOD');

-- -----------------------------------------------------
-- NOMINEES
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS nominees (
  nominee_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nesam_id VARCHAR(20) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  relationship VARCHAR(50) NOT NULL,
  dob DATE NOT NULL,
  percentage_share DECIMAL(5,2) NOT NULL,
  mobile_number VARCHAR(15),

  CONSTRAINT fk_nominee_member
  FOREIGN KEY(nesam_id) REFERENCES memberships(nesam_id)
  ON DELETE CASCADE,

  CONSTRAINT chk_nominee_share
  CHECK (percentage_share >= 0 AND percentage_share <= 100)
);

-- -----------------------------------------------------
-- TRANSACTION LEDGER
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS transaction_ledger (
  transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_uuid UUID NOT NULL,
  nesam_id VARCHAR(20) NOT NULL,

  type transaction_type NOT NULL,
  category transaction_category NOT NULL,

  amount DECIMAL(10,2) NOT NULL,
  reference_id VARCHAR(100),
  status transaction_status NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  receipt_url VARCHAR(255),

  CONSTRAINT fk_ledger_user
  FOREIGN KEY(user_uuid) REFERENCES user_profiles(user_uuid),

  CONSTRAINT chk_ledger_amount_non_neg CHECK (amount >= 0),
  CONSTRAINT chk_ledger_dates CHECK (completed_at IS NULL OR completed_at >= created_at)
);

CREATE INDEX idx_ledger_user ON transaction_ledger(user_uuid);
CREATE INDEX idx_ledger_status ON transaction_ledger(status);

-- -----------------------------------------------------
-- SETTLEMENT RECORDS
-- Added: was in ER v1.5 and MySQL schema but missing from postgres.sql
-- Required by: POST /admin/settlements/{nesamId}/authorize (INV-AU-02)
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS settlement_records (
  settlement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deceased_nesam_id VARCHAR(20) NOT NULL,

  gross_collection DECIMAL(12,2) NOT NULL,
  deducted_dues DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  net_payout DECIMAL(12,2) NOT NULL,

  nominee_snapshot JSONB NOT NULL,
  bank_reference VARCHAR(100),
  payment_date DATE,
  approved_by_user_uuid UUID,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_settlement_member
  FOREIGN KEY(deceased_nesam_id) REFERENCES memberships(nesam_id),

  CONSTRAINT fk_settlement_approver
  FOREIGN KEY(approved_by_user_uuid) REFERENCES user_profiles(user_uuid),

  CONSTRAINT chk_settlement_gross_non_neg CHECK (gross_collection >= 0),
  CONSTRAINT chk_settlement_deductions_non_neg CHECK (deducted_dues >= 0),
  CONSTRAINT chk_settlement_net_non_neg CHECK (net_payout >= 0),
  CONSTRAINT chk_settlement_net_calc CHECK (net_payout = gross_collection - deducted_dues)
);

CREATE INDEX idx_settlement_deceased ON settlement_records(deceased_nesam_id);

-- -----------------------------------------------------
-- NOTIFICATION LOGS
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS notification_logs (
  notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_uuid UUID NOT NULL,
  intent notification_intent NOT NULL,
  title VARCHAR(100) NOT NULL,
  body TEXT NOT NULL,
  channel_status JSONB NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_notif_user
  FOREIGN KEY(user_uuid) REFERENCES user_profiles(user_uuid)
);

CREATE INDEX idx_notif_user ON notification_logs(user_uuid);

-- -----------------------------------------------------
-- SEED DATA
-- -----------------------------------------------------

-- System parameters (FR-WEB-17)
INSERT INTO system_parameters (param_key, param_value, description) VALUES
  ('PROGRAM_LAUNCH_DATE',            '2025-02-16', 'Soft-launch date of NESAm program'),
  ('FOUNDING_WINDOW_DAYS',           '90',         'Days from launch within which members are Founding Members'),
  ('ADVANCE_DFC_MULTIPLIER',         '5',          'Multiplier applied to DFC rate to calculate Security Deposit'),
  ('DORMANT_PERIOD_MONTHS',          '3',          'Months post-enrollment before death claims are eligible'),
  ('NOTICE_PERIOD_DAYS',             '365',        'Days a membership stays active after first missed DFC payment'),
  ('GRACE_PERIOD_DAYS',              '15',         'Days after Notice Period before membership lapses'),
  ('PATRON_DISCOUNT_PERCENT',        '5',          'Discount % on membership fee for Patron Members'),
  ('FOUNDING_DISCOUNT_PERCENT',      '10',         'Discount % on membership fee for Founding Members'),
  ('FOUNDING_PATRON_DISCOUNT_PERCENT','15',        'Cumulative discount % for Founding Patron Members')
ON CONFLICT (param_key) DO NOTHING;

-- Master fee slabs (SRS Annexure 6.1)
INSERT INTO master_fee_slabs (min_age, max_age, display_label, fee_amount, valid_from, valid_to) VALUES
  (0,  25, 'Up to 25 Years', 2000.00, '2023-01-01', NULL),
  (26, 30, '26 - 30 Years',  3500.00, '2023-01-01', NULL),
  (31, 35, '31 - 35 Years',  5000.00, '2023-01-01', NULL),
  (36, 40, '36 - 40 Years',  7000.00, '2023-01-01', NULL),
  (41, 45, '41 - 45 Years',  9000.00, '2023-01-01', NULL),
  (46, 50, '46 - 50 Years', 11500.00, '2023-01-01', NULL),
  (51, 55, '51 - 55 Years', 14000.00, '2023-01-01', NULL),
  (56, 60, '56 - 60 Years', 16500.00, '2023-01-01', NULL)
ON CONFLICT (min_age, max_age, valid_from) DO NOTHING;

-- Master DFC rates (SRS Annexure 6.2)
INSERT INTO master_dfc_rates (min_age, max_age, display_label, dfc_amount, valid_from, valid_to) VALUES
  (0,  25, 'Up to 25 Years', 100.00, '2023-01-01', NULL),
  (26, 30, '26 - 30 Years',  200.00, '2023-01-01', NULL),
  (31, 35, '31 - 35 Years',  400.00, '2023-01-01', NULL),
  (36, 70, 'Above 36 Years', 500.00, '2023-01-01', NULL)
ON CONFLICT (min_age, max_age, valid_from) DO NOTHING;