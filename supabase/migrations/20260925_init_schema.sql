-- MahaUdyogSetu Database Schema

-- 1. Companies Table
CREATE TABLE IF NOT EXISTS public.companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    business_type TEXT DEFAULT 'Private Limited',
    cin TEXT,
    pan TEXT,
    gstin TEXT,
    mobile TEXT,
    email TEXT,
    state TEXT DEFAULT 'Maharashtra',
    district TEXT DEFAULT 'Nashik',
    address TEXT,
    sector TEXT,
    scale TEXT DEFAULT 'Medium',
    investment_crores NUMERIC DEFAULT 0,
    workforce INTEGER DEFAULT 0,
    connected_power_kw NUMERIC DEFAULT 0,
    handles_hazardous BOOLEAN DEFAULT false,
    land_type TEXT DEFAULT 'Industrial Park (Allotted)',
    stage TEXT DEFAULT 'Pre-Establishment',
    profile_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Applications / Clearances Table
CREATE TABLE IF NOT EXISTS public.clearance_applications (
    id TEXT PRIMARY KEY,
    company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    category TEXT,
    sla_days INTEGER DEFAULT 15,
    days_elapsed INTEGER DEFAULT 0,
    risk_tier TEXT DEFAULT 'LOW',
    fast_track BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'not_started',
    stage_name TEXT,
    fee_amount NUMERIC DEFAULT 0,
    required_docs JSONB DEFAULT '[]'::jsonb,
    submitted_docs JSONB DEFAULT '[]'::jsonb,
    certificate_number TEXT,
    validity_expiry TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Document Vault Table
CREATE TABLE IF NOT EXISTS public.document_vault (
    id TEXT PRIMARY KEY,
    company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    file_type TEXT DEFAULT 'PDF',
    category TEXT DEFAULT 'Statutory',
    file_size TEXT,
    upload_date DATE DEFAULT CURRENT_DATE,
    expiry_date TEXT,
    status TEXT DEFAULT 'verified',
    validation_score INTEGER DEFAULT 98,
    checklist_results JSONB DEFAULT '[]'::jsonb,
    linked_approvals JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clearance_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_vault ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for single window demo
CREATE POLICY "Allow public all access on companies" ON public.companies FOR ALL USING (true);
CREATE POLICY "Allow public all access on clearance_applications" ON public.clearance_applications FOR ALL USING (true);
CREATE POLICY "Allow public all access on document_vault" ON public.document_vault FOR ALL USING (true);
