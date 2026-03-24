/*
 * NESAm Database Schema (MySQL 8.0)
 * Version: 1.5
 * Based on SRS Version 1.19
 */

-- Enable strict mode
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+05:30";

-- Create Database Context (Safe)
CREATE DATABASE IF NOT EXISTS `nesam`;
USE `nesam`;

-- -----------------------------------------------------
-- 1. MASTER CONFIGURATION (System Brain)
-- -----------------------------------------------------

-- Table: system_parameters (Global Constants)
CREATE TABLE IF NOT EXISTS `system_parameters` (
  `param_key` VARCHAR(50) NOT NULL,
  `param_value` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255),
  `last_updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_recalculated_at` DATETIME NULL COMMENT 'Audit for batch jobs like Policy Processor',
  PRIMARY KEY (`param_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: master_fee_slabs (Membership Fees)
CREATE TABLE IF NOT EXISTS `master_fee_slabs` (
  `slab_id` CHAR(36) NOT NULL DEFAULT (UUID()),
  `min_age` INT NOT NULL,
  `max_age` INT NOT NULL,
  `display_label` VARCHAR(50) NOT NULL,
  `fee_amount` DECIMAL(10,2) NOT NULL,
  `valid_from` DATE NOT NULL,
  `valid_to` DATE NULL,
  PRIMARY KEY (`slab_id`),
  INDEX `idx_fee_validity` (`valid_from`, `valid_to`),
  CONSTRAINT `chk_fee_age_range` CHECK (`max_age` >= `min_age`),
  CONSTRAINT `chk_fee_amount_non_neg` CHECK (`fee_amount` >= 0),
  CONSTRAINT `chk_fee_validity` CHECK (`valid_to` IS NULL OR `valid_to` >= `valid_from`),
  -- Ensure uniqueness for idempotent inserts
  CONSTRAINT `uq_fee_slab_logic` UNIQUE (`min_age`, `max_age`, `valid_from`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: master_dfc_rates (Contribution Logic)
CREATE TABLE IF NOT EXISTS `master_dfc_rates` (
  `rate_id` CHAR(36) NOT NULL DEFAULT (UUID()),
  `min_age` INT NOT NULL,
  `max_age` INT NOT NULL,
  `display_label` VARCHAR(50) NOT NULL,
  `dfc_amount` DECIMAL(10,2) NOT NULL,
  `valid_from` DATE NOT NULL,
  `valid_to` DATE NULL,
  PRIMARY KEY (`rate_id`),
  INDEX `idx_dfc_validity` (`valid_from`, `valid_to`),
  CONSTRAINT `chk_dfc_age_range` CHECK (`max_age` >= `min_age`),
  CONSTRAINT `chk_dfc_amount_non_neg` CHECK (`dfc_amount` >= 0),
  CONSTRAINT `chk_dfc_validity` CHECK (`valid_to` IS NULL OR `valid_to` >= `valid_from`),
  -- Ensure uniqueness for idempotent inserts
  CONSTRAINT `uq_dfc_rate_logic` UNIQUE (`min_age`, `max_age`, `valid_from`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- 2. IDENTITY & ACCESS (User Core)
-- -----------------------------------------------------

-- Table: user_profiles
CREATE TABLE IF NOT EXISTS `user_profiles` (
  `user_uuid` CHAR(36) NOT NULL DEFAULT (UUID()),
  `mobile_number` VARCHAR(15) NOT NULL COMMENT 'Login Credential',
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NULL,
  `irttaa_id` VARCHAR(50) NULL COMMENT 'Link to Parent Association',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_uuid`),
  UNIQUE INDEX `uq_mobile` (`mobile_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- 3. MEMBERSHIP CORE (Transactional State)
-- -----------------------------------------------------

-- Table: memberships
CREATE TABLE IF NOT EXISTS `memberships` (
  `nesam_id` VARCHAR(20) NOT NULL COMMENT 'Human readable ID e.g. NES-2023-001',
  `user_uuid` CHAR(36) NOT NULL,
  `current_status` ENUM('PENDING', 'ACTIVE', 'NOTICE_PERIOD', 'LAPSED', 'DECEASED') NOT NULL DEFAULT 'PENDING',
  
  -- Application Data Snapshot
  `dob` DATE NOT NULL,
  `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
  `graduation_year` YEAR NOT NULL,
  
  -- Type & Flags
  `membership_type` ENUM('REGULAR', 'PATRON') NOT NULL,
  `is_founding_member` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_senior_exempt` BOOLEAN DEFAULT FALSE,
  
  -- Financial State
  `security_deposit_balance` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Locked Advance DFC',
  
  -- Audit
  `enrollment_date` DATE NOT NULL,
  `lapsed_date` DATE NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`nesam_id`),
  INDEX `idx_user_membership` (`user_uuid`),
  INDEX `idx_status` (`current_status`),
  CONSTRAINT `fk_membership_user` FOREIGN KEY (`user_uuid`) REFERENCES `user_profiles` (`user_uuid`) ON DELETE RESTRICT,
  CONSTRAINT `chk_deposit_non_neg` CHECK (`security_deposit_balance` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: nominees
CREATE TABLE IF NOT EXISTS `nominees` (
  `nominee_id` CHAR(36) NOT NULL DEFAULT (UUID()),
  `nesam_id` VARCHAR(20) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `relationship` VARCHAR(50) NOT NULL,
  `dob` DATE NOT NULL,
  `percentage_share` DECIMAL(5,2) NOT NULL COMMENT 'Must sum to 100 per member',
  `mobile_number` VARCHAR(15) NULL,
  PRIMARY KEY (`nominee_id`),
  CONSTRAINT `fk_nominee_member` FOREIGN KEY (`nesam_id`) REFERENCES `memberships` (`nesam_id`) ON DELETE CASCADE,
  CONSTRAINT `chk_nominee_share` CHECK (`percentage_share` >= 0 AND `percentage_share` <= 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- 4. FINANCIAL ENGINE (Ledger & Settlements)
-- -----------------------------------------------------

-- Table: transaction_ledger
CREATE TABLE IF NOT EXISTS `transaction_ledger` (
  `transaction_id` CHAR(36) NOT NULL DEFAULT (UUID()),
  `user_uuid` CHAR(36) NOT NULL,
  `nesam_id` VARCHAR(20) NOT NULL,
  
  -- Transaction Classification
  `type` ENUM('CREDIT', 'DEBIT', 'DEMAND') NOT NULL,
  `category` ENUM('MEMBERSHIP_FEE', 'SECURITY_DEPOSIT_TOPUP', 'DFC_CONTRIBUTION', 'DEPOSIT_ADJUSTMENT', 'REFUND') NOT NULL,
  
  -- Details
  `amount` DECIMAL(10,2) NOT NULL,
  `reference_id` VARCHAR(100) NULL COMMENT 'Payment Gateway ID or Deceased Member ID',
  `status` ENUM('INITIATED', 'SUCCESS', 'FAILED', 'PENDING', 'OVERDUE') NOT NULL,
  
  -- Audit
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `completed_at` DATETIME NULL,
  `receipt_url` VARCHAR(255) NULL,
  
  PRIMARY KEY (`transaction_id`),
  INDEX `idx_ledger_user` (`user_uuid`),
  INDEX `idx_ledger_status` (`status`),
  CONSTRAINT `fk_ledger_user` FOREIGN KEY (`user_uuid`) REFERENCES `user_profiles` (`user_uuid`),
  CONSTRAINT `chk_ledger_amount_non_neg` CHECK (`amount` >= 0),
  CONSTRAINT `chk_ledger_dates` CHECK (`completed_at` IS NULL OR `completed_at` >= `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: settlement_records (Payouts)
CREATE TABLE IF NOT EXISTS `settlement_records` (
  `settlement_id` CHAR(36) NOT NULL DEFAULT (UUID()),
  `deceased_nesam_id` VARCHAR(20) NOT NULL,
  
  -- Calculation Snapshot
  `gross_collection` DECIMAL(12,2) NOT NULL,
  `deducted_dues` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `net_payout` DECIMAL(12,2) NOT NULL,
  
  -- Fulfillment
  `nominee_snapshot` JSON NOT NULL COMMENT 'Frozen details of who received the money',
  `bank_reference` VARCHAR(100) NULL,
  `payment_date` DATE NULL,
  `approved_by_user_uuid` CHAR(36) NULL,
  
  PRIMARY KEY (`settlement_id`),
  CONSTRAINT `fk_settlement_member` FOREIGN KEY (`deceased_nesam_id`) REFERENCES `memberships` (`nesam_id`),
  CONSTRAINT `chk_settlement_gross_non_neg` CHECK (`gross_collection` >= 0),
  CONSTRAINT `chk_settlement_deductions_non_neg` CHECK (`deducted_dues` >= 0),
  CONSTRAINT `chk_settlement_net_non_neg` CHECK (`net_payout` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- 5. NOTIFICATION & AUDIT
-- -----------------------------------------------------

-- Table: notification_logs
CREATE TABLE IF NOT EXISTS `notification_logs` (
  `notification_id` CHAR(36) NOT NULL DEFAULT (UUID()),
  `user_uuid` CHAR(36) NOT NULL,
  `intent` ENUM('ALERT', 'REMINDER', 'INFO', 'DEMAND') NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `body` TEXT NOT NULL,
  `channel_status` JSON NOT NULL COMMENT 'e.g. {"sms": "sent", "email": "bounced"}',
  `is_read` BOOLEAN DEFAULT FALSE,
  `sent_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  INDEX `idx_notif_user` (`user_uuid`),
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_uuid`) REFERENCES `user_profiles` (`user_uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- 6. SEED DATA (Safe Insert Scripts)
-- -----------------------------------------------------

-- 6.1 System Parameters (SRS FR-WEB-17)
INSERT IGNORE INTO `system_parameters` (`param_key`, `param_value`, `description`) VALUES
('PROGRAM_LAUNCH_DATE', '2024-01-01', 'Reference date for Founding Member window'),
('FOUNDING_WINDOW_DAYS', '90', 'Number of days from launch to join as Founding Member'),
('ADVANCE_DFC_MULTIPLIER', '5', 'Multiplier for Security Deposit (e.g. 5 * DFC Rate)'),
('DORMANT_PERIOD_MONTHS', '3', 'Waiting period before claims are eligible'),
('NOTICE_PERIOD_DAYS', '365', 'Time before membership Lapses if dues unpaid'),
('PATRON_DISCOUNT_PERCENT', '5', 'Fee discount for Patron members'),
('FOUNDING_DISCOUNT_PERCENT', '10', 'Fee discount for Founding members'),
('FOUNDING_PATRON_DISCOUNT_PERCENT', '15', 'Cumulative discount for Founding Patrons');

-- 6.2 Master Fee Slabs (SRS Annexure 6.1)
INSERT IGNORE INTO `master_fee_slabs` (`slab_id`, `min_age`, `max_age`, `display_label`, `fee_amount`, `valid_from`, `valid_to`) VALUES
(UUID(), 0, 25, 'Up to 25 Years', 2000.00, '2023-01-01', NULL),
(UUID(), 26, 30, '26 - 30 Years', 3500.00, '2023-01-01', NULL),
(UUID(), 31, 35, '31 - 35 Years', 5000.00, '2023-01-01', NULL),
(UUID(), 36, 40, '36 - 40 Years', 7000.00, '2023-01-01', NULL),
(UUID(), 41, 45, '41 - 45 Years', 9000.00, '2023-01-01', NULL),
(UUID(), 46, 50, '46 - 50 Years', 11500.00, '2023-01-01', NULL),
(UUID(), 51, 55, '51 - 55 Years', 14000.00, '2023-01-01', NULL),
(UUID(), 56, 60, '56 - 60 Years', 16500.00, '2023-01-01', NULL);

-- 6.3 Master DFC Rates (SRS Annexure 6.2)
INSERT IGNORE INTO `master_dfc_rates` (`rate_id`, `min_age`, `max_age`, `display_label`, `dfc_amount`, `valid_from`, `valid_to`) VALUES
(UUID(), 0, 25, 'Up to 25 Years', 100.00, '2023-01-01', NULL),
(UUID(), 26, 30, '26 - 30 Years', 200.00, '2023-01-01', NULL),
(UUID(), 31, 35, '31 - 35 Years', 400.00, '2023-01-01', NULL),
(UUID(), 36, 70, 'Above 36 Years', 500.00, '2023-01-01', NULL);
