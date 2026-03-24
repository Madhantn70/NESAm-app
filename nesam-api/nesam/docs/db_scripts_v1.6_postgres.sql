/*
 * NESAm Database Schema (PostGreSQL 16.0)
 * Version: 1.6
 * Based on SRS Version 1.19
 */

-- Enable strict mode
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+05:30";

-- Create Database Context (Safe)
CREATEDB IF NOT EXISTS "nesam";
USE "nesam";

-- -----------------------------------------------------
-- 1. MASTER CONFIGURATION (System Brain)
-- -----------------------------------------------------

-- Table: system_parameters (Global Constants)
CREATE TABLE IF NOT EXISTS "system_parameters" (
  "param_key" VARCHAR(50) NOT NULL,
  "param_value" VARCHAR(255) NOT NULL,
  "description" VARCHAR(255),
  "last_updated_at" TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
  "last_recalculated_at" TIMESTAMP  NULL,
  PRIMARY KEY ("param_key")
);

COMMENT ON COLUMN "system_parameters".last_recalculated_at IS 'Audit for batch jobs like Policy Processor';

-- Table: master_fee_slabs (Membership Fees)
CREATE TABLE IF NOT EXISTS "master_fee_slabs" (
  "slab_id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "min_age" INT NOT NULL,
  "max_age" INT NOT NULL,
  "display_label" VARCHAR(50) NOT NULL,
  "fee_amount" DECIMAL(10,2) NOT NULL,
  "valid_from" DATE NOT NULL,
  "valid_to" DATE NULL,
  PRIMARY KEY ("slab_id"),
  CONSTRAINT "chk_fee_age_range" CHECK ("max_age" >= "min_age"),
  CONSTRAINT "chk_fee_amount_non_neg" CHECK ("fee_amount" >= 0),
  CONSTRAINT "chk_fee_validity" CHECK ("valid_to" IS NULL OR "valid_to" >= "valid_from"),
  -- Ensure uniqueness for idempotent inserts
  CONSTRAINT "uq_fee_slab_logic" UNIQUE ("min_age", "max_age", "valid_from")
) ;

CREATE INDEX "idx_fee_validity" ON "master_fee_slabs" ("valid_from", "valid_to");

-- Table: master_dfc_rates (Contribution Logic)
CREATE TABLE IF NOT EXISTS "master_dfc_rates" (
  "rate_id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "min_age" INT NOT NULL,
  "max_age" INT NOT NULL,
  "display_label" VARCHAR(50) NOT NULL,
  "dfc_amount" DECIMAL(10,2) NOT NULL,
  "valid_from" DATE NOT NULL,
  "valid_to" DATE NULL,
  PRIMARY KEY ("rate_id"),
  CONSTRAINT "chk_dfc_age_range" CHECK ("max_age" >= "min_age"),
  CONSTRAINT "chk_dfc_amount_non_neg" CHECK ("dfc_amount" >= 0),
  CONSTRAINT "chk_dfc_validity" CHECK ("valid_to" IS NULL OR "valid_to" >= "valid_from"),
  -- Ensure uniqueness for idempotent inserts
  CONSTRAINT "uq_dfc_rate_logic" UNIQUE ("min_age", "max_age", "valid_from")
);

CREATE INDEX "idx_dfc_validity" ON master_dfc_rates ("valid_from", "valid_to");

-- -----------------------------------------------------
-- 2. IDENTITY & ACCESS (User Core)
-- -----------------------------------------------------

-- Table: user_profiles
CREATE TABLE IF NOT EXISTS "user_profiles" (
  "user_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
  "mobile_number" VARCHAR(15) NOT NULL,
  "full_name" VARCHAR(100) NOT NULL,
  "email" VARCHAR(100) NULL,
  "irttaa_id" VARCHAR(50) NULL ,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("user_uuid"),
  UNIQUE("mobile_number")
);

CREATE INDEX "uq_mobile" ON "user_profiles" ("mobile_number");

 COMMENT ON COLUMN "user_profiles".mobile_number IS 'Login Credential';

 COMMENT ON COLUMN "user_profiles".irttaa_id IS 'Link to Parent Association';

-- -----------------------------------------------------
-- 3. MEMBERSHIP CORE (Transactional State)
-- -----------------------------------------------------

-- Table: memberships
-- PostgreSQL requires ENUM types to be defined separately
CREATE TYPE membership_status AS ENUM ('PENDING', 'ACTIVE', 'NOTICE_PERIOD', 'LAPSED', 'DECEASED');
CREATE TYPE gender_type AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE membership_category AS ENUM ('REGULAR', 'PATRON');

CREATE TABLE IF NOT EXISTS "memberships" (
  -- PostgreSQL uses COMMENT ON TABLE/COLUMN commands instead of inline COMMENT
  "nesam_id" VARCHAR(20) NOT NULL,
  "user_uuid" UUID NOT NULL, -- Recommended to use UUID type instead of CHAR(36)
  "current_status" membership_status NOT NULL DEFAULT 'PENDING',

  -- Application Data Snapshot
  "dob" DATE NOT NULL,
  "gender" gender_type NOT NULL,
  "graduation_year" INTEGER NOT NULL, -- PostgreSQL has no YEAR type; INTEGER + CHECK is the standard

  -- Type & Flags
  "membership_type" membership_category NOT NULL,
  "is_founding_member" BOOLEAN NOT NULL DEFAULT FALSE,
  "is_senior_exempt" BOOLEAN DEFAULT FALSE,

  -- Financial State
  "security_deposit_balance" DECIMAL(10,2) NOT NULL DEFAULT 0.00,

  -- Audit
  "enrollment_date" DATE NOT NULL,
  "lapsed_date" DATE NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY ("nesam_id"),
  CONSTRAINT "fk_membership_user" FOREIGN KEY ("user_uuid") REFERENCES "user_profiles" ("user_uuid") ON DELETE RESTRICT,
  CONSTRAINT "chk_deposit_non_neg" CHECK ("security_deposit_balance" >= 0),
  CONSTRAINT "chk_valid_year" CHECK ("graduation_year" BETWEEN 1901 AND 2155)
);

-- Comments in PostgreSQL are applied after table creation
COMMENT ON COLUMN "memberships"."nesam_id" IS 'Human readable ID e.g. NES-2023-001';
COMMENT ON COLUMN "memberships"."security_deposit_balance" IS 'Locked Advance DFC';

-- Indexes are created as separate statements
CREATE INDEX "idx_user_membership" ON "memberships" ("user_uuid");
CREATE INDEX "idx_status" ON "memberships" ("current_status");

-- 1. Define ENUM Types (Must be created before the tables)
CREATE TYPE transaction_type AS ENUM ('CREDIT', 'DEBIT', 'DEMAND');
CREATE TYPE transaction_category AS ENUM ('MEMBERSHIP_FEE', 'SECURITY_DEPOSIT_TOPUP', 'DFC_CONTRIBUTION', 'DEPOSIT_ADJUSTMENT', 'REFUND');
CREATE TYPE transaction_status AS ENUM ('INITIATED', 'SUCCESS', 'FAILED', 'PENDING', 'OVERDUE');
CREATE TYPE notification_intent AS ENUM ('ALERT', 'REMINDER', 'INFO', 'DEMAND');

-- 2. Table: nominees
CREATE TABLE IF NOT EXISTS "nominees" (
  "nominee_id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "nesam_id" VARCHAR(20) NOT NULL,
  "full_name" VARCHAR(100) NOT NULL,
  "relationship" VARCHAR(50) NOT NULL,
  "dob" DATE NOT NULL,
  "percentage_share" DECIMAL(5,2) NOT NULL,
  "mobile_number" VARCHAR(15) NULL,
  PRIMARY KEY ("nominee_id"),
  CONSTRAINT "fk_nominee_member" FOREIGN KEY ("nesam_id") REFERENCES "memberships" ("nesam_id") ON DELETE CASCADE,
  CONSTRAINT "chk_nominee_share" CHECK ("percentage_share" >= 0 AND "percentage_share" <= 100)
);

COMMENT ON COLUMN "nominees"."percentage_share" IS 'Must sum to 100 per member';

-- 3. Table: transaction_ledger
CREATE TABLE IF NOT EXISTS "transaction_ledger" (
  "transaction_id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_uuid" UUID NOT NULL,
  "nesam_id" VARCHAR(20) NOT NULL,

  -- Transaction Classification
  "type" transaction_type NOT NULL,
  "category" transaction_category NOT NULL,

  -- Details
  "amount" DECIMAL(10,2) NOT NULL,
  "reference_id" VARCHAR(100) NULL,
  "status" transaction_status NOT NULL,

  -- Audit
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "completed_at" TIMESTAMP NULL,
  "receipt_url" VARCHAR(255) NULL,

  PRIMARY KEY ("transaction_id"),
  CONSTRAINT "fk_ledger_user" FOREIGN KEY ("user_uuid") REFERENCES "user_profiles" ("user_uuid"),
  CONSTRAINT "chk_ledger_amount_non_neg" CHECK ("amount" >= 0),
  CONSTRAINT "chk_ledger_dates" CHECK ("completed_at" IS NULL OR "completed_at" >= "created_at")
);

COMMENT ON COLUMN "transaction_ledger"."reference_id" IS 'Payment Gateway ID or Deceased Member ID';

CREATE INDEX "idx_ledger_user" ON "transaction_ledger" ("user_uuid");
CREATE INDEX "idx_ledger_status" ON "transaction_ledger" ("status");

-- 4. Table: notification_logs
CREATE TABLE IF NOT EXISTS "notification_logs" (
  "notification_id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_uuid" UUID NOT NULL,
  "intent" notification_intent NOT NULL,
  "title" VARCHAR(100) NOT NULL,
  "body" TEXT NOT NULL,
  "channel_status" JSONB NOT NULL, -- JSONB is preferred over JSON in Postgres for performance
  "is_read" BOOLEAN DEFAULT FALSE,
  "sent_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("notification_id"),
  CONSTRAINT "fk_notif_user" FOREIGN KEY ("user_uuid") REFERENCES "user_profiles" ("user_uuid")
);

COMMENT ON COLUMN "notification_logs"."channel_status" IS 'e.g. {"sms": "sent", "email": "bounced"}';

CREATE INDEX "idx_notif_user" ON "notification_logs" ("user_uuid");
-- -----------------------------------------------------
-- 6. SEED DATA (Safe Insert Scripts)
-- -----------------------------------------------------

-- 6.1 System Parameters (SRS FR-WEB-17)
INSERT IGNORE INTO "system_parameters" ("param_key", "param_value", "description") VALUES
("PROGRAM_LAUNCH_DATE", "2024-01-01", "Reference date for Founding Member window"),
("FOUNDING_WINDOW_DAYS", "90", "Number of days from launch to join as Founding Member"),
("ADVANCE_DFC_MULTIPLIER", "5", "Multiplier for Security Deposit (e.g. 5 * DFC Rate)"),
("DORMANT_PERIOD_MONTHS", "3", "Waiting period before claims are eligible"),
("NOTICE_PERIOD_DAYS", "365", "Time before membership Lapses if dues unpaid"),
("PATRON_DISCOUNT_PERCENT", "5", "Fee discount for Patron members"),
("FOUNDING_DISCOUNT_PERCENT", "10", "Fee discount for Founding members"),
("FOUNDING_PATRON_DISCOUNT_PERCENT", "15", "Cumulative discount for Founding Patrons");

-- 6.2 Master Fee Slabs (SRS Annexure 6.1)
INSERT IGNORE INTO "master_fee_slabs" ("slab_id", "min_age", "max_age", "display_label", "fee_amount", "valid_from", "valid_to") VALUES
(UUID(), 0, 25, "Up to 25 Years", 2000.00, "2023-01-01", NULL),
(UUID(), 26, 30, "26 - 30 Years", 3500.00, "2023-01-01", NULL),
(UUID(), 31, 35, "31 - 35 Years", 5000.00, "2023-01-01", NULL),
(UUID(), 36, 40, "36 - 40 Years", 7000.00, "2023-01-01", NULL),
(UUID(), 41, 45, "41 - 45 Years", 9000.00, "2023-01-01", NULL),
(UUID(), 46, 50, "46 - 50 Years", 11500.00, "2023-01-01", NULL),
(UUID(), 51, 55, "51 - 55 Years", 14000.00, "2023-01-01", NULL),
(UUID(), 56, 60, "56 - 60 Years", 16500.00, "2023-01-01", NULL);

-- 6.3 Master DFC Rates (SRS Annexure 6.2)
INSERT IGNORE INTO "master_dfc_rates" ("rate_id", "min_age", "max_age", "display_label", "dfc_amount", "valid_from", "valid_to") VALUES
(UUID(), 0, 25, "Up to 25 Years", 100.00, "2023-01-01", NULL),
(UUID(), 26, 30, "26 - 30 Years", 200.00, "2023-01-01", NULL),
(UUID(), 31, 35, "31 - 35 Years", 400.00, "2023-01-01", NULL),
(UUID(), 36, 70, "Above 36 Years", 500.00, "2023-01-01", NULL);
