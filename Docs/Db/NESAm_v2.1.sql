-- Enable strict mode
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+05:30";

-- Create Database Context (Safe)
CREATE DATABASE IF NOT EXISTS `nesam`;
USE `nesam`;

CREATE TABLE IF NOT EXISTS `master_membership_fee_slabs` (
  `fee_slab_id` char(36) PRIMARY KEY DEFAULT (UUID()),
  `min_age` int NOT NULL,
  `max_age` int NOT NULL,
  `display_label` varchar(50) NOT NULL,
  `membership_fee` decimal(10,2) NOT NULL,
  `valid_from` date NOT NULL,
  `valid_to` date,
  `is_active` boolean DEFAULT true,
  `created_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `modified_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

CREATE TABLE IF NOT EXISTS `master_dfc_rate_slabs` (
  `rate_slab_id` char(36) PRIMARY KEY DEFAULT (UUID()),
  `min_age` int NOT NULL,
  `max_age` int NOT NULL,
  `display_label` varchar(50) NOT NULL,
  `dfc_per_event` decimal(10,2) NOT NULL,
  `valid_from` date NOT NULL,
  `valid_to` date,
  `is_active` boolean DEFAULT true,
  `created_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `modified_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

CREATE TABLE IF NOT EXISTS `system_parameters` (
  `param_key` varchar(100) PRIMARY KEY,
  `param_value` varchar(255),
  `description` varchar(255),
  `created_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `modified_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

CREATE TABLE IF NOT EXISTS `aa_alumni_master` (
  `aa_alumni_id` char(36) PRIMARY KEY,
  `email_id` varchar(200) UNIQUE,
  `secondary_email` varchar(200),
  `full_name` varchar(255),
  `gender` varchar(10),
  `date_of_birth` date,
  `profile_type` varchar(15) NOT NULL COMMENT 'Alumnus, Faculty, Student',
  `course` varchar(45),
  `stream` varchar(60),
  `graduating_year` int,
  `mobile` varchar(20),
  `corress_address` varchar(255),
  `corress_city` varchar(100),
  `corress_state` varchar(100),
  `corress_country` varchar(100),
  `corress_pincode` varchar(20),
  `membership_type` ENUM ('REGISTERED', 'LIFE', 'PATRON') NOT NULL,
  `membership_id` varchar(50),
  `deceased` boolean DEFAULT false,
  `deceased_at` date,
  `created_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `modified_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

CREATE TABLE IF NOT EXISTS `nesam_users` (
  `nesam_user_id` char(36) PRIMARY KEY DEFAULT (UUID()),
  `aa_alumni_id` char(36),
  `full_name` varchar(255) NOT NULL,
  `email` varchar(200) UNIQUE NOT NULL COMMENT 'Primary login email in NESAm',
  `mobile` varchar(20),
  `graduating_year` int NOT NULL,
  `department` varchar(15),
  `gender` varchar(10),
  `date_of_birth` date,
  `status` ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED') NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `modified_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

CREATE TABLE IF NOT EXISTS `nesam_user_addresses` (
  `nesam_address_id` char(36) PRIMARY KEY DEFAULT (UUID()),
  `nesam_user_id` char(36) NOT NULL,
  `address_type` ENUM ('CORRESPONDENCE', 'PERMANENT') NOT NULL DEFAULT 'CORRESPONDENCE',
  `line1` varchar(255),
  `line2` varchar(255),
  `city` varchar(100),
  `state` varchar(100),
  `postal_code` varchar(20),
  `country` varchar(50),
  `created_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `modified_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

CREATE TABLE IF NOT EXISTS `nesam_applications` (
  `application_id` char(36) PRIMARY KEY DEFAULT (UUID()),
  `aa_alumni_id` char(36),
  `email_id` varchar(200) NOT NULL,
  `status` ENUM ('STARTED', 'COMPLETED', 'REJECTED', 'ABANDONED') NOT NULL,
  `started_at` datetime NOT NULL,
  `completed_at` datetime,
  `rejected_at` datetime,
  `abandoned_at` datetime,
  `notes` varchar(255),
  `created_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `modified_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

CREATE TABLE IF NOT EXISTS `nesam_application_details` (
  `application_id` char(36) PRIMARY KEY,
  `mobile` varchar(20),
  `line1` varchar(255),
  `line2` varchar(255),
  `city` varchar(100),
  `state` varchar(100),
  `postal_code` varchar(20),
  `country` varchar(50),
  `date_of_birth` date,
  `nominee_name` varchar(255) NOT NULL,
  `nominee_relationship` ENUM ('SPOUSE', 'SON', 'DAUGHTER', 'FATHER', 'MOTHER', 'BROTHER', 'SISTER', 'OTHER') NOT NULL,
  `nominee_email` varchar(200),
  `nominee_mobile` varchar(20)
);

CREATE TABLE IF NOT EXISTS `nesam_application_payments` (
  `application_payment_id` char(36) PRIMARY KEY DEFAULT (UUID()),
  `application_id` char(36),
  `amount` decimal(10,2) NOT NULL,
  `status` ENUM ('INITIATED', 'PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'EXPIRED') NOT NULL DEFAULT 'INITIATED',
  `payment_gateway` varchar(100),
  `gateway_order_id` varchar(100),
  `gateway_payment_id` varchar(100),
  `gateway_reference` varchar(100),
  `initiated_at` datetime NOT NULL,
  `completed_at` datetime,
  `failed_at` datetime,
  `expires_at` datetime,
  `failure_reason` varchar(255)
);

CREATE TABLE IF NOT EXISTS `nesam_members` (
  `nesam_membership_id` char(36) PRIMARY KEY DEFAULT (UUID()),
  `application_id` char(36) UNIQUE NOT NULL,
  `nesam_user_id` char(36) NOT NULL,
  `membership_number` varchar(100) UNIQUE NOT NULL COMMENT 'Human-friendly NESAm Member ID',
  `membership_status` ENUM ('ACTIVE', 'IN_NOTICE_PERIOD', 'IN_GRACE_PREIOD', 'LAPSED', 'DECEASED') NOT NULL,
  `nesam_tier` ENUM ('REGULAR', 'PATRON', 'FOUNDING', 'FOUNDING_PATRON') NOT NULL,
  `enrollment_date` date,
  `activation_date` date,
  `lapsed_date` date,
  `created_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `modified_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

CREATE TABLE IF NOT EXISTS `nesam_member_nominees` (
  `nominee_id` char(36) PRIMARY KEY DEFAULT (UUID()),
  `nesam_membership_id` char(36) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `relationship` ENUM ('SPOUSE', 'SON', 'DAUGHTER', 'FATHER', 'MOTHER', 'BROTHER', 'SISTER', 'OTHER') NOT NULL,
  `percent_share` decimal,
  `email` varchar(200),
  `mobile` varchar(20),
  `active` boolean,
  `created_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `modified_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

CREATE TABLE IF NOT EXISTS `invoices` (
  `invoice_id` char(36) PRIMARY KEY DEFAULT (UUID()),
  `nesam_membership_id` char(36) NOT NULL,
  `invoice_date` timestamp NOT NULL,
  `invoice_type` ENUM ('MEMBERSHIP_FEE', 'DFC', 'ADVANCE_DFC', 'ADVANCE_DFC_TOPUP') NOT NULL,
  `amount` decimal,
  `due_date` datetime,
  `status` ENUM ('OPEN', 'PARTIALLY_PAID', 'PAID'),
  `created_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `modified_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

CREATE TABLE IF NOT EXISTS `payments_received` (
  `payment_id` char(36) PRIMARY KEY DEFAULT (UUID()),
  `nesam_membership_id` char(36) NOT NULL,
  `payment_date` datetime NOT NULL,
  `payment_type` ENUM ('invoice_payment', 'adhoc_payment') NOT NULL,
  `invoice_id` char(36),
  `amount` decimal,
  `transaction_reference` varchar(100),
  `created_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `modified_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

ALTER TABLE `nesam_users` ADD FOREIGN KEY (`aa_alumni_id`) REFERENCES `aa_alumni_master` (`aa_alumni_id`);

ALTER TABLE `nesam_user_addresses` ADD FOREIGN KEY (`nesam_user_id`) REFERENCES `nesam_users` (`nesam_user_id`);

ALTER TABLE `nesam_applications` ADD FOREIGN KEY (`aa_alumni_id`) REFERENCES `aa_alumni_master` (`aa_alumni_id`);

ALTER TABLE `nesam_application_details` ADD FOREIGN KEY (`application_id`) REFERENCES `nesam_applications` (`application_id`);

ALTER TABLE `nesam_application_payments` ADD FOREIGN KEY (`application_id`) REFERENCES `nesam_applications` (`application_id`);

ALTER TABLE `nesam_members` ADD FOREIGN KEY (`application_id`) REFERENCES `nesam_applications` (`application_id`);

ALTER TABLE `nesam_members` ADD FOREIGN KEY (`nesam_user_id`) REFERENCES `nesam_users` (`nesam_user_id`);

ALTER TABLE `nesam_member_nominees` ADD FOREIGN KEY (`nesam_membership_id`) REFERENCES `nesam_members` (`nesam_membership_id`);

ALTER TABLE `invoices` ADD FOREIGN KEY (`nesam_membership_id`) REFERENCES `nesam_members` (`nesam_membership_id`);

ALTER TABLE `payments_received` ADD FOREIGN KEY (`nesam_membership_id`) REFERENCES `nesam_members` (`nesam_membership_id`);

ALTER TABLE `payments_received` ADD FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`invoice_id`);

-- Disable foreign key checks for INSERT
SET FOREIGN_KEY_CHECKS = 0;

INSERT IGNORE INTO `master_membership_fee_slabs` (`fee_slab_id`, `min_age`, `max_age`, `display_label`, `membership_fee`, `valid_from`)
VALUES
  ('e387a6e8-29c3-11f1-8547-083a8861c2e4', 0, 26, 'Upto 25 years', 2000, '2026-01-01'),
  ('e387df23-29c3-11f1-8547-083a8861c2e4', 26, 31, '26 - 30 years', 3500, '2026-01-01'),
  ('e387e0fa-29c3-11f1-8547-083a8861c2e4', 31, 36, '31 - 35 years', 5000, '2026-01-01'),
  ('e387e178-29c3-11f1-8547-083a8861c2e4', 36, 41, '36 - 40 years', 7000, '2026-01-01'),
  ('e387e1e5-29c3-11f1-8547-083a8861c2e4', 41, 46, '41 - 45 years', 9000, '2026-01-01'),
  ('e387e253-29c3-11f1-8547-083a8861c2e4', 46, 51, '46 - 50 years', 11500, '2026-01-01'),
  ('e387e2b8-29c3-11f1-8547-083a8861c2e4', 51, 56, '51- 55 years', 14000, '2026-01-01'),
  ('e387e31b-29c3-11f1-8547-083a8861c2e4', 56, 61, '55 - 60 years', 16500, '2026-01-01');
INSERT IGNORE INTO `master_dfc_rate_slabs` (`rate_slab_id`, `min_age`, `max_age`, `display_label`, `dfc_per_event`, `valid_from`)
VALUES
  ('e389556d-29c3-11f1-8547-083a8861c2e4', 0, 26, 'Upto 25 years', 100, '2026-01-01'),
  ('e38957ea-29c3-11f1-8547-083a8861c2e4', 26, 31, '26 - 30 years', 200, '2026-01-01'),
  ('e3895850-29c3-11f1-8547-083a8861c2e4', 31, 36, '31 - 35 years', 400, '2026-01-01'),
  ('e38958aa-29c3-11f1-8547-083a8861c2e4', 36, 71, 'Above 36 years', 500, '2026-01-01');
INSERT IGNORE INTO `system_parameters` (`param_key`, `param_value`, `description`)
VALUES
  ('ADVANCE_DFC_MULTIPLIER', '5', 'Multiplier for Security Deposit (e.g. 5 * DFC Rate)'),
  ('DORMANT_PERIOD_MONTHS', '3', 'Waiting period before claims are eligible'),
  ('FOUNDING_DISCOUNT_PERCENT', '10', 'Fee discount for Founding members'),
  ('FOUNDING_PATRON_DISCOUNT_PERCENT', '15', 'Cumulative discount for Founding Patrons'),
  ('FOUNDING_WINDOW_DAYS', '90', 'Number of days from launch to join as Founding Member'),
  ('NOTICE_PERIOD_DAYS', '365', 'Time before membership Lapses if dues unpaid'),
  ('PATRON_DISCOUNT_PERCENT', '5', 'Fee discount for Patron members'),
  ('PROGRAM_LAUNCH_DATE', '2026-04-14', 'Reference date for Founding Member window');

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;