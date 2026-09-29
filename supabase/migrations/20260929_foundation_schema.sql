-- =========================================================================
-- MahaUdyogSetu (Maharashtra Industry Bridge) - Core Database Foundation
-- Migration: 20260929_foundation_schema.sql
-- =========================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper function for auto-updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================================================================
-- 1. COMPANIES TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.companies (
    id TEXT PRIMARY KEY, -- e.g. BIZ-MH-FGHIJ-001 or UUID
    name TEXT NOT NULL,
    business_type TEXT DEFAULT 'Private Limited',
    cin TEXT UNIQUE,
    pan TEXT NOT NULL,
    gstin TEXT NOT NULL,
    udyam_registration TEXT,
    authorized_person_name TEXT,
    authorized_person_designation TEXT,
    mobile TEXT,
    email TEXT,
    password TEXT,
    sector TEXT NOT NULL DEFAULT 'Engineering & Heavy Manufacturing',
    activity_description TEXT,
    state TEXT NOT NULL DEFAULT 'Maharashtra',
    district TEXT NOT NULL DEFAULT 'Nashik',
    taluka TEXT DEFAULT 'Ambad',
    village TEXT,
    plot_number TEXT,
    pincode TEXT DEFAULT '422010',
    address TEXT DEFAULT 'MIDC Industrial Area, Maharashtra',
    scale TEXT NOT NULL DEFAULT 'Medium',
    investment_crores NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    built_up_area_sq_ft NUMERIC(12, 2) DEFAULT 0.00,
    workforce INTEGER NOT NULL DEFAULT 0,
    contract_workers_count INTEGER DEFAULT 0,
    connected_power_kw NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    is_midc BOOLEAN DEFAULT true,
    handles_hazardous BOOLEAN DEFAULT false,
    hazard_details TEXT,
    hazard_control_measures TEXT,
    has_boiler BOOLEAN DEFAULT false,
    boiler_capacity_tph NUMERIC(8, 2) DEFAULT 0.00,
    dg_set_kva NUMERIC(8, 2) DEFAULT 0.00,
    water_extraction_kld NUMERIC(8, 2) DEFAULT 0.00,
    land_type TEXT DEFAULT 'Industrial Park (Allotted)',
    stage TEXT DEFAULT 'Pre-Establishment',
    is_profile_complete BOOLEAN DEFAULT false,
    raw_materials TEXT[] DEFAULT '{}',
    finished_products TEXT[] DEFAULT '{}',
    by_products TEXT[] DEFAULT '{}',
    profile_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for companies updated_at
DROP TRIGGER IF EXISTS set_companies_updated_at ON public.companies;
CREATE TRIGGER set_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =========================================================================
-- 2. APPLICATIONS TABLE (Statutory Approvals, NOCs & Clearances)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.applications (
    id TEXT PRIMARY KEY, -- e.g. APP-PCB-01, APP-DISH-01 or MH-SWC-2026-001
    company_id TEXT NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    code TEXT NOT NULL, -- e.g. PCB-CTE-01, FIRE-NOC-01
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    category TEXT,
    sla_days INTEGER NOT NULL DEFAULT 21,
    days_elapsed INTEGER NOT NULL DEFAULT 0,
    risk_tier TEXT NOT NULL DEFAULT 'MEDIUM',
    fast_track BOOLEAN DEFAULT false,
    status TEXT NOT NULL DEFAULT 'not_started',
    required_docs TEXT[] DEFAULT '{}',
    submitted_docs TEXT[] DEFAULT '{}',
    submitted_date TIMESTAMPTZ,
    applied_date TIMESTAMPTZ,
    approval_date TIMESTAMPTZ,
    certificate_number TEXT,
    validity_expiry TIMESTAMPTZ,
    payment_status TEXT DEFAULT 'pending',
    payment_mode TEXT,
    transaction_id TEXT,
    fee_amount NUMERIC(10, 2) DEFAULT 0.00,
    stage_name TEXT DEFAULT 'Pre-Establishment',
    queries JSONB DEFAULT '[]'::jsonb,
    inspection JSONB DEFAULT '{}'::jsonb,
    status_history JSONB DEFAULT '[]'::jsonb,
    verified_doc_details JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_applications_updated_at ON public.applications;
CREATE TRIGGER set_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =========================================================================
-- 3. DOCUMENTS TABLE (Single Document Vault Metadata)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.documents (
    id TEXT PRIMARY KEY, -- e.g. DOC-101 or UUID
    company_id TEXT NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    application_id TEXT REFERENCES public.applications(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    file_type TEXT NOT NULL DEFAULT 'application/pdf',
    file_size TEXT DEFAULT '1.5 MB',
    storage_path TEXT,
    category TEXT NOT NULL DEFAULT 'Company / Identity',
    status TEXT NOT NULL DEFAULT 'pending', -- 'verified' | 'needs_correction' | 'pending'
    validation_score INTEGER DEFAULT 0,
    checklist_results JSONB DEFAULT '[]'::jsonb,
    missing_or_invalid_items TEXT[] DEFAULT '{}',
    correction_guidance TEXT,
    linked_approvals TEXT[] DEFAULT '{}',
    used_by TEXT[] DEFAULT '{}',
    verified_at TIMESTAMPTZ,
    verified_by TEXT,
    expiry_date TIMESTAMPTZ,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_documents_updated_at ON public.documents;
CREATE TRIGGER set_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =========================================================================
-- 4. GRIEVANCES & QUERIES TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.grievances (
    id TEXT PRIMARY KEY, -- e.g. MGV-2026-102458 or MQY-2026-309114
    company_id TEXT REFERENCES public.companies(id) ON DELETE SET NULL,
    application_id TEXT REFERENCES public.applications(id) ON DELETE SET NULL,
    type TEXT NOT NULL DEFAULT 'grievance', -- 'grievance' | 'query'
    business_name TEXT NOT NULL,
    applicant_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT NOT NULL,
    application_number TEXT,
    service_type TEXT NOT NULL,
    department TEXT NOT NULL,
    district TEXT NOT NULL,
    taluka TEXT,
    midc_area TEXT,
    category TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'Normal', -- 'Normal' | 'Important' | 'Urgent'
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    documents JSONB DEFAULT '[]'::jsonb,
    notify_sms BOOLEAN DEFAULT true,
    notify_email BOOLEAN DEFAULT true,
    notify_portal BOOLEAN DEFAULT true,
    status TEXT NOT NULL DEFAULT 'Submitted', -- 'Submitted' | 'Under Initial Review' | 'Assigned to Department' | 'Department Action' | 'Resolution Provided' | 'Closed'
    assigned_officer TEXT,
    department_response TEXT,
    expected_sla_days INTEGER DEFAULT 7,
    rts_escalation_level TEXT,
    submitted_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolution_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_grievances_updated_at ON public.grievances;
CREATE TRIGGER set_grievances_updated_at
BEFORE UPDATE ON public.grievances
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =========================================================================
-- 5. FEEDBACK TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.feedback (
    id TEXT PRIMARY KEY, -- e.g. MUS-FB-2026-000124
    company_id TEXT REFERENCES public.companies(id) ON DELETE SET NULL,
    feedback_type TEXT NOT NULL,
    related_module TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    message TEXT NOT NULL,
    application_ref TEXT,
    name TEXT,
    mobile TEXT,
    email TEXT,
    status TEXT NOT NULL DEFAULT 'Submitted', -- 'Submitted' | 'Under Review' | 'Responded' | 'Closed'
    department_response TEXT,
    response_date TIMESTAMPTZ,
    replies JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_feedback_updated_at ON public.feedback;
CREATE TRIGGER set_feedback_updated_at
BEFORE UPDATE ON public.feedback
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =========================================================================
-- 6. INVESTMENT PLANS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.invest_plans (
    id TEXT PRIMARY KEY, -- e.g. PLAN-MH-2026-001 or UUID
    company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    industry_sector TEXT NOT NULL,
    location TEXT NOT NULL,
    investment_cr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    calculated_results JSONB DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'active', -- 'draft' | 'active' | 'archived'
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_invest_plans_updated_at ON public.invest_plans;
CREATE TRIGGER set_invest_plans_updated_at
BEFORE UPDATE ON public.invest_plans
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =========================================================================
-- 7. PERFORMANCE INDEXES
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_companies_pan ON public.companies(pan);
CREATE INDEX IF NOT EXISTS idx_companies_cin ON public.companies(cin);
CREATE INDEX IF NOT EXISTS idx_companies_mobile ON public.companies(mobile);
CREATE INDEX IF NOT EXISTS idx_companies_sector ON public.companies(sector);

CREATE INDEX IF NOT EXISTS idx_applications_company_id ON public.applications(company_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_department ON public.applications(department);
CREATE INDEX IF NOT EXISTS idx_applications_code ON public.applications(code);

CREATE INDEX IF NOT EXISTS idx_documents_company_id ON public.documents(company_id);
CREATE INDEX IF NOT EXISTS idx_documents_application_id ON public.documents(application_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_category ON public.documents(category);

CREATE INDEX IF NOT EXISTS idx_grievances_company_id ON public.grievances(company_id);
CREATE INDEX IF NOT EXISTS idx_grievances_status ON public.grievances(status);
CREATE INDEX IF NOT EXISTS idx_grievances_department ON public.grievances(department);
CREATE INDEX IF NOT EXISTS idx_grievances_type ON public.grievances(type);

CREATE INDEX IF NOT EXISTS idx_feedback_company_id ON public.feedback(company_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON public.feedback(rating);

CREATE INDEX IF NOT EXISTS idx_invest_plans_company_id ON public.invest_plans(company_id);

-- =========================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invest_plans ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow service role full access on companies" ON public.companies;
DROP POLICY IF EXISTS "Allow anon read/write on companies" ON public.companies;

DROP POLICY IF EXISTS "Allow service role full access on applications" ON public.applications;
DROP POLICY IF EXISTS "Allow anon read/write on applications" ON public.applications;

DROP POLICY IF EXISTS "Allow service role full access on documents" ON public.documents;
DROP POLICY IF EXISTS "Allow anon read/write on documents" ON public.documents;

DROP POLICY IF EXISTS "Allow service role full access on grievances" ON public.grievances;
DROP POLICY IF EXISTS "Allow anon read/write on grievances" ON public.grievances;

DROP POLICY IF EXISTS "Allow service role full access on feedback" ON public.feedback;
DROP POLICY IF EXISTS "Allow anon read/write on feedback" ON public.feedback;

DROP POLICY IF EXISTS "Allow service role full access on invest_plans" ON public.invest_plans;
DROP POLICY IF EXISTS "Allow anon read/write on invest_plans" ON public.invest_plans;

-- RLS Policies for MahaUdyogSetu single window access
CREATE POLICY "Allow public all access on companies" ON public.companies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on applications" ON public.applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on documents" ON public.documents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on grievances" ON public.grievances FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on feedback" ON public.feedback FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on invest_plans" ON public.invest_plans FOR ALL USING (true) WITH CHECK (true);

-- =========================================================================
-- 9. SEED BENCHMARK COMPANY & REFERENCE RECORDS
-- =========================================================================
INSERT INTO public.companies (
    id, name, business_type, cin, pan, gstin, mobile, email, password,
    state, district, taluka, address, sector, scale, investment_crores,
    workforce, connected_power_kw, handles_hazardous, land_type, stage,
    is_profile_complete, profile_data
) VALUES (
    'BIZ-MH-FGHIJ-001',
    'Western Maharashtra Engineering Private Limited',
    'Private Limited',
    'U28990MH2026PTC654321',
    'FGHIJ5678K',
    '27FGHIJ5678K1Z8',
    '9123456780',
    'contact@westernmahaengineering.example',
    'Password@123',
    'Maharashtra',
    'Nashik',
    'Ambad',
    'Plot No. 18, Ambad MIDC, Ambad Industrial Estate, Nashik, Maharashtra – 422010',
    'Engineering & Heavy Manufacturing',
    'Medium',
    18.50,
    75,
    350.00,
    false,
    'Industrial Park (Allotted)',
    'Pre-Establishment',
    true,
    '{"name": "Western Maharashtra Engineering Private Limited", "district": "Nashik", "scale": "Medium"}'::jsonb
) ON CONFLICT (id) DO NOTHING;
