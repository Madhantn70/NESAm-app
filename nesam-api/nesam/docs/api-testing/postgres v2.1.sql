-- ===============================
-- EXTENSIONS
-- ===============================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===============================
-- ENUM TYPES
-- ===============================
CREATE TYPE aa_alumni_membership_type AS ENUM ('REGISTERED','LIFE','PATRON');
CREATE TYPE nesam_user_status AS ENUM ('ACTIVE','INACTIVE','BLOCKED');
CREATE TYPE address_type AS ENUM ('CORRESPONDENCE','PERMANENT');
CREATE TYPE application_status AS ENUM ('STARTED','COMPLETED','REJECTED','ABANDONED');
CREATE TYPE payment_status AS ENUM ('INITIATED','PENDING','SUCCESS','FAILED','CANCELLED','EXPIRED');
CREATE TYPE membership_status AS ENUM ('ACTIVE','IN_NOTICE_PERIOD','IN_GRACE_PERIOD','LAPSED','DECEASED');
CREATE TYPE membership_tier AS ENUM ('REGULAR','PATRON','FOUNDING','FOUNDING_PATRON');
CREATE TYPE nominee_relationship AS ENUM ('SPOUSE','SON','DAUGHTER','FATHER','MOTHER','BROTHER','SISTER','OTHER');
CREATE TYPE invoice_type AS ENUM ('MEMBERSHIP_FEE','DFC','ADVANCE_DFC','ADVANCE_DFC_TOPUP');
CREATE TYPE invoice_status AS ENUM ('OPEN','PARTIALLY_PAID','PAID');
CREATE TYPE payment_type AS ENUM ('invoice_payment','adhoc_payment');

-- ===============================
-- TRIGGER FUNCTION
-- ===============================
CREATE OR REPLACE FUNCTION update_modified_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.modified_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===============================
-- MASTER TABLES
-- ===============================
CREATE TABLE master_membership_fee_slabs (
  fee_slab_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  min_age INT NOT NULL,
  max_age INT NOT NULL,
  display_label VARCHAR(50) NOT NULL,
  membership_fee NUMERIC(10,2) NOT NULL,
  valid_from DATE NOT NULL,
  valid_to DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE master_dfc_rate_slabs (
  rate_slab_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  min_age INT NOT NULL,
  max_age INT NOT NULL,
  display_label VARCHAR(50) NOT NULL,
  dfc_per_event NUMERIC(10,2) NOT NULL,
  valid_from DATE NOT NULL,
  valid_to DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE system_parameters (
  param_key VARCHAR(100) PRIMARY KEY,
  param_value VARCHAR(255),
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- CORE TABLES
-- ===============================
CREATE TABLE aa_alumni_master (
  aa_alumni_id UUID PRIMARY KEY,
  email_id VARCHAR(200) UNIQUE,
  secondary_email VARCHAR(200),
  full_name VARCHAR(255),
  gender VARCHAR(10),
  date_of_birth DATE,
  profile_type VARCHAR(15) NOT NULL,
  course VARCHAR(45),
  stream VARCHAR(60),
  graduating_year INT,
  mobile VARCHAR(20),
  corress_address VARCHAR(255),
  corress_city VARCHAR(100),
  corress_state VARCHAR(100),
  corress_country VARCHAR(100),
  corress_pincode VARCHAR(20),
  membership_type aa_alumni_membership_type NOT NULL,
  membership_id VARCHAR(50),
  deceased BOOLEAN DEFAULT FALSE,
  deceased_at DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE nesam_users (
  nesam_user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aa_alumni_id UUID,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  mobile VARCHAR(20),
  graduating_year INT NOT NULL,
  department VARCHAR(15),
  gender VARCHAR(10),
  date_of_birth DATE,
  status nesam_user_status DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE nesam_user_addresses (
  nesam_address_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nesam_user_id UUID NOT NULL,
  address_type address_type DEFAULT 'CORRESPONDENCE',
  line1 VARCHAR(255),
  line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- APPLICATION FLOW
-- ===============================
CREATE TABLE nesam_applications (
  application_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aa_alumni_id UUID,
  email_id VARCHAR(200) NOT NULL,
  status application_status NOT NULL,
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  rejected_at TIMESTAMP,
  abandoned_at TIMESTAMP,
  notes VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE nesam_application_details (
  application_id UUID PRIMARY KEY,
  mobile VARCHAR(20),
  line1 VARCHAR(255),
  line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(50),
  date_of_birth DATE,
  nominee_name VARCHAR(255) NOT NULL,
  nominee_relationship nominee_relationship NOT NULL,
  nominee_email VARCHAR(200),
  nominee_mobile VARCHAR(20)
);

CREATE TABLE nesam_application_payments (
  application_payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID,
  amount NUMERIC(10,2) NOT NULL,
  status payment_status DEFAULT 'INITIATED',
  payment_gateway VARCHAR(100),
  gateway_order_id VARCHAR(100),
  gateway_payment_id VARCHAR(100),
  gateway_reference VARCHAR(100),
  initiated_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  failed_at TIMESTAMP,
  expires_at TIMESTAMP,
  failure_reason VARCHAR(255)
);

-- ===============================
-- MEMBERSHIP
-- ===============================
CREATE TABLE nesam_members (
  nesam_membership_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID UNIQUE NOT NULL,
  nesam_user_id UUID NOT NULL,
  membership_number VARCHAR(100) UNIQUE NOT NULL,
  membership_status membership_status NOT NULL,
  nesam_tier membership_tier NOT NULL,
  enrollment_date DATE,
  activation_date DATE,
  lapsed_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE nesam_member_nominees (
  nominee_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nesam_membership_id UUID NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  relationship nominee_relationship NOT NULL,
  percent_share NUMERIC,
  email VARCHAR(200),
  mobile VARCHAR(20),
  active BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- BILLING
-- ===============================
CREATE TABLE invoices (
  invoice_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nesam_membership_id UUID NOT NULL,
  invoice_date TIMESTAMP NOT NULL,
  invoice_type invoice_type NOT NULL,
  amount NUMERIC,
  due_date TIMESTAMP,
  status invoice_status,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments_received (
  payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nesam_membership_id UUID NOT NULL,
  payment_date TIMESTAMP NOT NULL,
  payment_type payment_type NOT NULL,
  invoice_id UUID,
  amount NUMERIC,
  transaction_reference VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- FOREIGN KEYS
-- ===============================
ALTER TABLE nesam_users ADD FOREIGN KEY (aa_alumni_id) REFERENCES aa_alumni_master(aa_alumni_id);
ALTER TABLE nesam_user_addresses ADD FOREIGN KEY (nesam_user_id) REFERENCES nesam_users(nesam_user_id);
ALTER TABLE nesam_applications ADD FOREIGN KEY (aa_alumni_id) REFERENCES aa_alumni_master(aa_alumni_id);
ALTER TABLE nesam_application_details ADD FOREIGN KEY (application_id) REFERENCES nesam_applications(application_id);
ALTER TABLE nesam_application_payments ADD FOREIGN KEY (application_id) REFERENCES nesam_applications(application_id);
ALTER TABLE nesam_members ADD FOREIGN KEY (application_id) REFERENCES nesam_applications(application_id);
ALTER TABLE nesam_members ADD FOREIGN KEY (nesam_user_id) REFERENCES nesam_users(nesam_user_id);
ALTER TABLE nesam_member_nominees ADD FOREIGN KEY (nesam_membership_id) REFERENCES nesam_members(nesam_membership_id);
ALTER TABLE invoices ADD FOREIGN KEY (nesam_membership_id) REFERENCES nesam_members(nesam_membership_id);
ALTER TABLE payments_received ADD FOREIGN KEY (nesam_membership_id) REFERENCES nesam_members(nesam_membership_id);
ALTER TABLE payments_received ADD FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id);

-- ===============================
-- INDEXES (IMPORTANT 🔥)
-- ===============================
CREATE INDEX idx_users_email ON nesam_users(email);
CREATE INDEX idx_users_alumni_id ON nesam_users(aa_alumni_id);
CREATE INDEX idx_applications_alumni ON nesam_applications(aa_alumni_id);
CREATE INDEX idx_members_user ON nesam_members(nesam_user_id);
CREATE INDEX idx_payments_membership ON payments_received(nesam_membership_id);

-- ===============================
-- TRIGGERS (AUTO UPDATE modified_at)
-- ===============================
CREATE TRIGGER trg_users BEFORE UPDATE ON nesam_users FOR EACH ROW EXECUTE FUNCTION update_modified_at();
CREATE TRIGGER trg_members BEFORE UPDATE ON nesam_members FOR EACH ROW EXECUTE FUNCTION update_modified_at();
CREATE TRIGGER trg_invoices BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_modified_at();