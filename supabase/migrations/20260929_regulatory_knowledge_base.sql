-- =========================================================================
-- MahaUdyogSetu - Regulatory Knowledge Base & Approval Rule Engine Schema
-- Migration: 20260929_regulatory_knowledge_base.sql
-- =========================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. DATA SOURCES TABLE (Source Traceability & Audit Trail)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.data_sources (
    id TEXT PRIMARY KEY, -- e.g. SRC-MAHA-MPCB-2024, SRC-EIA-2006
    title TEXT NOT NULL,
    source_type TEXT NOT NULL DEFAULT 'Government Website', -- 'Government Website' | 'Government Notification' | 'Act' | 'Rules' | 'Circular' | 'Official PDF' | 'Department Portal'
    department TEXT NOT NULL,
    official_url TEXT,
    document_url TEXT,
    retrieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_verified_at TIMESTAMPTZ,
    verification_status TEXT NOT NULL DEFAULT 'Pending Verification', -- 'Draft' | 'Pending Verification' | 'Verified' | 'Archived'
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_data_sources_updated_at ON public.data_sources;
CREATE TRIGGER set_data_sources_updated_at
BEFORE UPDATE ON public.data_sources
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =========================================================================
-- 2. INDUSTRIES TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.industries (
    id TEXT PRIMARY KEY, -- e.g. IND-MFG-ENG, IND-PHARMA, IND-CHEM
    name TEXT NOT NULL UNIQUE,
    sector TEXT NOT NULL,
    sub_sector TEXT,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'Verified', -- 'Draft' | 'Pending Verification' | 'Verified' | 'Archived'
    source_id TEXT REFERENCES public.data_sources(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_industries_updated_at ON public.industries;
CREATE TRIGGER set_industries_updated_at
BEFORE UPDATE ON public.industries
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =========================================================================
-- 3. DEPARTMENTS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.departments (
    id TEXT PRIMARY KEY, -- e.g. DEPT-MPCB, DEPT-DISH, DEPT-FIRE
    name TEXT NOT NULL,
    short_name TEXT NOT NULL UNIQUE,
    authority TEXT NOT NULL,
    official_url TEXT,
    status TEXT NOT NULL DEFAULT 'Verified', -- 'Draft' | 'Pending Verification' | 'Verified' | 'Archived'
    source_id TEXT REFERENCES public.data_sources(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_departments_updated_at ON public.departments;
CREATE TRIGGER set_departments_updated_at
BEFORE UPDATE ON public.departments
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =========================================================================
-- 4. APPROVALS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.approvals (
    id TEXT PRIMARY KEY, -- e.g. APP-MPCB-CTE, APP-DISH-FACT
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    department_id TEXT NOT NULL REFERENCES public.departments(id) ON DELETE RESTRICT,
    category TEXT NOT NULL, -- e.g. Environmental & Pollution, Labor & Safety, Utility & Infrastructure
    description TEXT,
    authority TEXT NOT NULL,
    applicability TEXT,
    eligibility TEXT,
    documents TEXT[] DEFAULT '{}',
    application_process TEXT,
    official_url TEXT,
    fee TEXT, -- NULL or 'Not specified in source' if unverified/variable
    timeline TEXT, -- e.g. '21 Days' or NULL
    renewal_required BOOLEAN NOT NULL DEFAULT false,
    validity TEXT, -- e.g. '5 Years' or NULL
    legal_basis TEXT,
    status TEXT NOT NULL DEFAULT 'Verified', -- 'Draft' | 'Pending Verification' | 'Verified' | 'Archived'
    source_id TEXT REFERENCES public.data_sources(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_approvals_updated_at ON public.approvals;
CREATE TRIGGER set_approvals_updated_at
BEFORE UPDATE ON public.approvals
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =========================================================================
-- 5. INDUSTRY APPROVALS MAPPING TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.industry_approvals (
    id TEXT PRIMARY KEY, -- e.g. IA-ENG-MPCB-CTE
    industry_id TEXT NOT NULL REFERENCES public.industries(id) ON DELETE CASCADE,
    approval_id TEXT NOT NULL REFERENCES public.approvals(id) ON DELETE CASCADE,
    applicability_type TEXT NOT NULL DEFAULT 'Mandatory', -- 'Mandatory' | 'Conditional' | 'May Apply' | 'Not Applicable'
    priority INTEGER NOT NULL DEFAULT 1,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'Verified', -- 'Draft' | 'Pending Verification' | 'Verified' | 'Archived'
    source_id TEXT REFERENCES public.data_sources(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_industry_approval UNIQUE (industry_id, approval_id)
);

DROP TRIGGER IF EXISTS set_industry_approvals_updated_at ON public.industry_approvals;
CREATE TRIGGER set_industry_approvals_updated_at
BEFORE UPDATE ON public.industry_approvals
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =========================================================================
-- 6. APPROVAL DOCUMENTS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.approval_documents (
    id TEXT PRIMARY KEY, -- e.g. ADOC-MPCB-CTE-01
    approval_id TEXT NOT NULL REFERENCES public.approvals(id) ON DELETE CASCADE,
    document_name TEXT NOT NULL,
    description TEXT,
    mandatory BOOLEAN NOT NULL DEFAULT true,
    notes TEXT,
    source_id TEXT REFERENCES public.data_sources(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_approval_documents_updated_at ON public.approval_documents;
CREATE TRIGGER set_approval_documents_updated_at
BEFORE UPDATE ON public.approval_documents
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =========================================================================
-- 7. APPROVAL STEPS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.approval_steps (
    id TEXT PRIMARY KEY, -- e.g. ASTEP-MPCB-CTE-01
    approval_id TEXT NOT NULL REFERENCES public.approvals(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    step_name TEXT NOT NULL,
    description TEXT,
    official_url TEXT,
    source_id TEXT REFERENCES public.data_sources(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_approval_step UNIQUE (approval_id, step_number)
);

DROP TRIGGER IF EXISTS set_approval_steps_updated_at ON public.approval_steps;
CREATE TRIGGER set_approval_steps_updated_at
BEFORE UPDATE ON public.approval_steps
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =========================================================================
-- 8. APPROVAL RULES TABLE (Core Rule Engine Conditions)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.approval_rules (
    id TEXT PRIMARY KEY, -- e.g. ARULE-MPCB-RED, ARULE-DISH-WORKFORCE
    approval_id TEXT NOT NULL REFERENCES public.approvals(id) ON DELETE CASCADE,
    industry_id TEXT REFERENCES public.industries(id) ON DELETE CASCADE,
    condition_type TEXT NOT NULL, -- e.g. 'hazard', 'workforce_min', 'investment_min', 'stage', 'power_kw_min', 'built_up_sqft_min', 'land_type'
    condition_operator TEXT NOT NULL DEFAULT 'eq', -- 'eq' | 'gte' | 'lte' | 'gt' | 'lt' | 'in' | 'contains' | 'boolean'
    condition_value JSONB NOT NULL DEFAULT '{}'::jsonb,
    outcome TEXT NOT NULL DEFAULT 'Mandatory', -- 'Mandatory' | 'Conditional' | 'May Apply' | 'Not Applicable'
    priority INTEGER NOT NULL DEFAULT 10,
    explanation TEXT NOT NULL,
    source_id TEXT REFERENCES public.data_sources(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'Verified', -- 'Draft' | 'Pending Verification' | 'Verified' | 'Archived'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_approval_rules_updated_at ON public.approval_rules;
CREATE TRIGGER set_approval_rules_updated_at
BEFORE UPDATE ON public.approval_rules
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =========================================================================
-- 9. PERFORMANCE INDEXES
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_data_sources_status ON public.data_sources(verification_status);
CREATE INDEX IF NOT EXISTS idx_data_sources_department ON public.data_sources(department);

CREATE INDEX IF NOT EXISTS idx_industries_sector ON public.industries(sector);
CREATE INDEX IF NOT EXISTS idx_industries_status ON public.industries(status);

CREATE INDEX IF NOT EXISTS idx_departments_short_name ON public.departments(short_name);
CREATE INDEX IF NOT EXISTS idx_departments_status ON public.departments(status);

CREATE INDEX IF NOT EXISTS idx_approvals_department_id ON public.approvals(department_id);
CREATE INDEX IF NOT EXISTS idx_approvals_category ON public.approvals(category);
CREATE INDEX IF NOT EXISTS idx_approvals_code ON public.approvals(code);
CREATE INDEX IF NOT EXISTS idx_approvals_status ON public.approvals(status);

CREATE INDEX IF NOT EXISTS idx_industry_approvals_industry_id ON public.industry_approvals(industry_id);
CREATE INDEX IF NOT EXISTS idx_industry_approvals_approval_id ON public.industry_approvals(approval_id);

CREATE INDEX IF NOT EXISTS idx_approval_documents_approval_id ON public.approval_documents(approval_id);
CREATE INDEX IF NOT EXISTS idx_approval_steps_approval_id ON public.approval_steps(approval_id);

CREATE INDEX IF NOT EXISTS idx_approval_rules_approval_id ON public.approval_rules(approval_id);
CREATE INDEX IF NOT EXISTS idx_approval_rules_industry_id ON public.approval_rules(industry_id);
CREATE INDEX IF NOT EXISTS idx_approval_rules_condition_type ON public.approval_rules(condition_type);

-- =========================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on data_sources" ON public.data_sources;
CREATE POLICY "Allow public read access on data_sources" ON public.data_sources FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on industries" ON public.industries;
CREATE POLICY "Allow public read access on industries" ON public.industries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on departments" ON public.departments;
CREATE POLICY "Allow public read access on departments" ON public.departments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on approvals" ON public.approvals;
CREATE POLICY "Allow public read access on approvals" ON public.approvals FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on industry_approvals" ON public.industry_approvals;
CREATE POLICY "Allow public read access on industry_approvals" ON public.industry_approvals FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on approval_documents" ON public.approval_documents;
CREATE POLICY "Allow public read access on approval_documents" ON public.approval_documents FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on approval_steps" ON public.approval_steps;
CREATE POLICY "Allow public read access on approval_steps" ON public.approval_steps FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on approval_rules" ON public.approval_rules;
CREATE POLICY "Allow public read access on approval_rules" ON public.approval_rules FOR SELECT USING (true);

-- Allow all access for server operations
DROP POLICY IF EXISTS "Allow all access on data_sources" ON public.data_sources;
CREATE POLICY "Allow all access on data_sources" ON public.data_sources FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access on industries" ON public.industries;
CREATE POLICY "Allow all access on industries" ON public.industries FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access on departments" ON public.departments;
CREATE POLICY "Allow all access on departments" ON public.departments FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access on approvals" ON public.approvals;
CREATE POLICY "Allow all access on approvals" ON public.approvals FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access on industry_approvals" ON public.industry_approvals;
CREATE POLICY "Allow all access on industry_approvals" ON public.industry_approvals FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access on approval_documents" ON public.approval_documents;
CREATE POLICY "Allow all access on approval_documents" ON public.approval_documents FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access on approval_steps" ON public.approval_steps;
CREATE POLICY "Allow all access on approval_steps" ON public.approval_steps FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access on approval_rules" ON public.approval_rules;
CREATE POLICY "Allow all access on approval_rules" ON public.approval_rules FOR ALL USING (true) WITH CHECK (true);

-- =========================================================================
-- 11. SEED DATA (Demonstration & Traceable Regulatory Knowledge Base)
-- =========================================================================

-- Data Sources
INSERT INTO public.data_sources (id, title, source_type, department, official_url, last_verified_at, verification_status, notes)
VALUES
('SRC-MPCB-PORTAL', 'Maharashtra Pollution Control Board Consent Management System', 'Government Website', 'MPCB', 'https://mpcb.gov.in', NOW(), 'Verified', 'Statutory environmental clearance under Water & Air Acts'),
('SRC-DISH-ACT', 'Factories Act 1948 & Maharashtra Factories Rules 1963', 'Act', 'DISH', 'https://dish.maharashtra.gov.in', NOW(), 'Verified', 'Workforce safety and factory building approvals'),
('SRC-FIRE-ACT', 'Maharashtra Fire Prevention and Life Safety Measures Act 2006', 'Act', 'Maharashtra Fire Services', 'https://mahafireservice.gov.in', NOW(), 'Verified', 'Fire safety and building layout clearance'),
('SRC-MSEDCL-CODE', 'Maharashtra Electricity Regulatory Commission Supply Code Regulations', 'Rules', 'MSEDCL', 'https://www.mahadiscom.in', NOW(), 'Verified', 'Industrial power connection and substation load sanction'),
('SRC-MIDC-DCR', 'MIDC Development Control Regulations & Building Bye-Laws', 'Rules', 'MIDC', 'https://midcindia.org', NOW(), 'Verified', 'Special Planning Authority industrial building sanctions'),
('SRC-MOEF-EIA', 'EIA Notification 2006 Schedule 5(f) & 8(a)', 'Government Notification', 'MoEFCC / SEIAA', 'https://parivesh.nic.in', NOW(), 'Verified', 'Prior Environmental Clearance statutory schedule'),
('SRC-LAB-SHOPS', 'Maharashtra Shops and Establishments (Regulation of Employment and Conditions of Service) Act 2017', 'Act', 'Labour Department', 'https://mahakamgar.maharashtra.gov.in', NOW(), 'Verified', 'Intimation & registration for commercial/office premises'),
('SRC-LAB-CLRA', 'Contract Labour (Regulation and Abolition) Act 1970', 'Act', 'Labour Department', 'https://mahakamgar.maharashtra.gov.in', NOW(), 'Verified', 'Principal employer registration for contractor deployment'),
('SRC-DEMO-UNVERIFIED', 'Demo / Illustrative Advisory Requirements', 'Circular', 'Industry Association Advisory', 'https://industry.maharashtra.example.gov', NULL, 'Pending Verification', 'Demonstration entry pending official notification scrutiny')
ON CONFLICT (id) DO NOTHING;

-- Departments
INSERT INTO public.departments (id, name, short_name, authority, official_url, status, source_id)
VALUES
('DEPT-MPCB', 'Maharashtra Pollution Control Board', 'MPCB', 'Environment & Climate Change Department, GoM', 'https://mpcb.gov.in', 'Verified', 'SRC-MPCB-PORTAL'),
('DEPT-DISH', 'Directorate of Industrial Safety & Health', 'DISH', 'Labour Department, GoM', 'https://dish.maharashtra.gov.in', 'Verified', 'SRC-DISH-ACT'),
('DEPT-FIRE', 'Maharashtra Fire Services & MIDC Fire Wing', 'FIRE', 'Urban Development Department & MIDC', 'https://mahafireservice.gov.in', 'Verified', 'SRC-FIRE-ACT'),
('DEPT-MSEDCL', 'Maharashtra State Electricity Distribution Co. Ltd.', 'MSEDCL', 'Energy Department, GoM', 'https://www.mahadiscom.in', 'Verified', 'SRC-MSEDCL-CODE'),
('DEPT-MIDC', 'Maharashtra Industrial Development Corporation (SPA)', 'MIDC', 'Industries Department, GoM', 'https://midcindia.org', 'Verified', 'SRC-MIDC-DCR'),
('DEPT-SEIAA', 'State Level Environment Impact Assessment Authority', 'SEIAA', 'MoEFCC / Environment Department, GoM', 'https://parivesh.nic.in', 'Verified', 'SRC-MOEF-EIA'),
('DEPT-LABOUR', 'Labour Commissionerate Maharashtra', 'LABOUR', 'Labour Department, GoM', 'https://mahakamgar.maharashtra.gov.in', 'Verified', 'SRC-LAB-SHOPS')
ON CONFLICT (id) DO NOTHING;

-- Industries
INSERT INTO public.industries (id, name, sector, sub_sector, description, status, source_id)
VALUES
('IND-ENG', 'Engineering & Heavy Manufacturing', 'Engineering & Heavy Manufacturing', 'Precision Tooling, CNC Machining, Heavy Fabrication', 'Machinery, fabrication, auto parts, and precision equipment manufacture.', 'Verified', 'SRC-MIDC-DCR'),
('IND-AUTO', 'Automotive & EV Components', 'Automotive & EV Components', 'EV Powertrain, Auto Ancillaries, Battery Packs', 'Automobile components, EV powertrain systems and sheet metal stampings.', 'Verified', 'SRC-MIDC-DCR'),
('IND-CHEM', 'Chemicals & Petrochemicals', 'Chemicals & Petrochemicals', 'Specialty Chemicals, Industrial Resins, Polymers', 'Chemical synthesis, organic chemicals and polymer compounding.', 'Verified', 'SRC-MOEF-EIA'),
('IND-PHARMA', 'Pharmaceuticals & APIs', 'Pharmaceuticals & APIs', 'Active Pharmaceutical Ingredients, Formulations', 'Bulk drugs, active pharmaceutical intermediates and sterile formulations.', 'Verified', 'SRC-MOEF-EIA'),
('IND-FOOD', 'Food Processing & Agri Logistics', 'Food Processing & Agri Logistics', 'Agro-processing, Dairy, Cold Storage, Grain Milling', 'Post-harvest value addition, packaging and preservation facilities.', 'Verified', 'SRC-MIDC-DCR'),
('IND-TEXTILE', 'Textiles & Garment Manufacturing', 'Textiles & Garment Manufacturing', 'Weaving, Dyeing, Garmenting, Technical Textiles', 'Textile yarn processing, fabric finishing and apparel manufacturing.', 'Verified', 'SRC-MIDC-DCR'),
('IND-ELEC', 'Electronics & Semiconductor Assembly', 'Electronics', 'PCB Assembly, Embedded Systems, Semiconductor Packaging', 'High-tech electronics assembly, surface mount technology and components.', 'Verified', 'SRC-MIDC-DCR')
ON CONFLICT (id) DO NOTHING;

-- Approvals
INSERT INTO public.approvals (
    id, name, code, department_id, category, description, authority, applicability,
    eligibility, documents, application_process, official_url, fee, timeline,
    renewal_required, validity, legal_basis, status, source_id
) VALUES
(
    'APP-MPCB-CTE',
    'MPCB Consent to Establish (CTE) under Water & Air Acts',
    'MPCB-CTE-AIR-WATER',
    'DEPT-MPCB',
    'Environmental & Pollution',
    'Prior statutory environmental consent before breaking ground, erecting plant foundations or commencing civil construction.',
    'Maharashtra Pollution Control Board',
    'All manufacturing and industrial units discharging trade effluent or emitting air pollutants.',
    'Industrial unit having valid land allotment/title and detailed project report.',
    ARRAY['Land Ownership / MIDC Allotment Letter', 'Comprehensive Detailed Project Report (DPR)', 'Plant & Machinery Layout Blueprint', 'Effluent / Emission Treatment System Proposal', 'CA Capital Investment Certificate'],
    'Online submission via MPCB Single Window Portal followed by Technical Field Scrutiny.',
    'https://mpcb.gov.in',
    'Variable based on Capital Investment Slab',
    '21 Days',
    false,
    '5 Years (or until commissioning)',
    'Section 25 Water (P&CP) Act 1974 & Section 21 Air (P&CP) Act 1981',
    'Verified',
    'SRC-MPCB-PORTAL'
),
(
    'APP-MPCB-CTO',
    'MPCB Consent to Operate (CTO) under Water & Air Acts',
    'MPCB-CTO-AIR-WATER',
    'DEPT-MPCB',
    'Environmental & Pollution',
    'Statutory operating consent required before trial production or commercial commissioning.',
    'Maharashtra Pollution Control Board',
    'Operating units post installation of environmental pollution control systems.',
    'Unit must possess valid CTE and completed ETP/STP/APCD installations.',
    ARRAY['CTE Grant Copy', 'As-Built Plant Layout Drawings', 'Treated Effluent / Emission Test Report (Board Lab)', 'Hazardous Waste Storage Manifest Compliance'],
    'Online portal application accompanied by joint field inspection report.',
    'https://mpcb.gov.in',
    'Variable based on Capital Investment Slab',
    '30 Days',
    true,
    '1 to 5 Years (Renewable)',
    'Water (P&CP) Act 1974 & Air (P&CP) Act 1981',
    'Verified',
    'SRC-MPCB-PORTAL'
),
(
    'APP-DISH-FACT',
    'Factory Building Plan Approval & Registration License',
    'DISH-FACT-LIC',
    'DEPT-DISH',
    'Labor & Factory Safety',
    'Mandatory safety approval of architectural drawings, machinery layout, fire exits and worker movement pathways.',
    'Directorate of Industrial Safety & Health (DISH)',
    'Manufacturing premises employing 10 or more workers with power, or 20 without power.',
    'Industrial manufacturing units meeting workforce thresholds under Factories Act.',
    ARRAY['Architectural Building Section Drawings (Form 1)', 'Machinery Layout & Material Movement Blueprint', 'Emergency Exit & Sanitation Scheme', 'Structural Stability Certificate by Certified Person'],
    'Online single window upload, technical plan scrutiny by Inspector of Factories.',
    'https://dish.maharashtra.gov.in',
    '₹ 5,000 to ₹ 25,000 (Slab-based on HP & Workers)',
    '20 Days',
    true,
    '1 to 10 Years (Renewable)',
    'Section 6 & 7 Factories Act, 1948 and Rule 3 Maharashtra Factories Rules',
    'Verified',
    'SRC-DISH-ACT'
),
(
    'APP-FIRE-NOC',
    'Provisional Fire Safety No Objection Certificate (NOC)',
    'FIRE-PROV-NOC',
    'DEPT-FIRE',
    'Safety & Hazard',
    'Approval of fire-fighting infrastructure plans, hydrants, risers, sprinklers and emergency vehicle turning radius.',
    'Maharashtra Fire Services & MIDC Fire Wing',
    'All industrial buildings, factories, warehouses and hazardous installations.',
    'Industrial plot owners proposing building construction or occupancy.',
    ARRAY['Architectural Master Site Plan', 'Fire-Fighting Network Drawings', 'NBC 2016 Fire Safety Undertaking', 'Water Reservoir Capacity Calculations'],
    'Plan upload, scrutiny by Divisional Fire Officer, physical site verification.',
    'https://mahafireservice.gov.in',
    '₹ 10,000 to ₹ 20,000',
    '15 Days',
    false,
    'Valid during construction stage',
    'Maharashtra Fire Prevention and Life Safety Measures Act 2006',
    'Verified',
    'SRC-FIRE-ACT'
),
(
    'APP-MSEDCL-PWR',
    'Industrial Power Load Sanction (HT / LT Connection)',
    'PWR-IND-SANCTION',
    'DEPT-MSEDCL',
    'Utility & Infrastructure',
    'Technical feasibility sanction and grid allocation for industrial connected power load.',
    'Maharashtra State Electricity Distribution Co. Ltd.',
    'All industrial manufacturing and commercial operations requiring electricity feed.',
    'Applicant having registered possession/lease of plot and contractor test certificate.',
    ARRAY['Land Allotment Letter / Ownership Proof', 'Electrical Single Line Diagram (SLD)', 'Licensed Electrical Contractor Test Certificate', 'Company Incorporation & PAN'],
    'Application on Mahavitaran Single Window, distribution line feasibility survey, estimate payment, meter installation.',
    'https://www.mahadiscom.in',
    'Load security deposit & processing fee as per MERC Tariff',
    '15 Days',
    false,
    'Permanent supply (Subject to tariff agreement)',
    'Electricity Act 2003 & MERC Supply Code',
    'Verified',
    'SRC-MSEDCL-CODE'
),
(
    'APP-MIDC-BLD',
    'MIDC Industrial Building Plan Sanction & Commencement Certificate',
    'MIDC-BLD-PLAN',
    'DEPT-MIDC',
    'Municipal & Land',
    'Building plan approval and sanction to commence construction from the Special Planning Authority.',
    'MIDC Special Planning Authority (SPA)',
    'All construction in designated MIDC Industrial Parks.',
    'Plot allottees with valid lease deed and possession receipt.',
    ARRAY['MIDC Lease Deed & Possession Receipt', 'Architectural Cross-Section & Elevation Blueprints', 'Structural Engineer Design & Stability Certificate', 'Rainwater Harvesting & Parking Layout'],
    'AutoDCR submission, scrutiny by Executive Engineer, grant of Commencement Certificate.',
    'https://midcindia.org',
    'Scrutiny fee calculated per Sq. Meter built-up area',
    '21 Days',
    false,
    '3 Years (Extendable)',
    'Maharashtra Regional and Town Planning (MRTP) Act 1966 & MIDC Act 1961',
    'Verified',
    'SRC-MIDC-DCR'
),
(
    'APP-SEIAA-EC',
    'Prior Environmental Clearance (EC) — Schedule 5(f) / 8(a)',
    'MOEF-EC-2006',
    'DEPT-SEIAA',
    'Environmental & Pollution',
    'Prior statutory clearance by MoEFCC / SEIAA for notified high-impact sectors or large infrastructure built-up.',
    'State Environmental Impact Assessment Authority (SEIAA)',
    'Chemical, Bulk Drug, Petrochemical units, or projects with built-up area > 20,000 sq. meters.',
    'Projects listed under Schedule of EIA Notification 2006.',
    ARRAY['Form 1 / Form 1M & Pre-Feasibility Report', 'EIA / EMP Dossier & Baseline Environmental Monitoring Report', 'Public Hearing Minutes (if applicable)', 'Zero Liquid Discharge (ZLD) Engineering Design'],
    'Submission on Parivesh Portal, SEAC Technical Hearing, SEIAA Final Appraisal.',
    'https://parivesh.nic.in',
    '₹ 1,00,000 (Statutory appraisal fee)',
    '90 Days',
    false,
    '10 Years (Extendable)',
    'Environment (Protection) Act 1986 & EIA Notification 2006',
    'Verified',
    'SRC-MOEF-EIA'
),
(
    'APP-LAB-SHOPS',
    'Registration under Maharashtra Shops & Establishments Act, 2017',
    'LAB-SHOPS-REG',
    'DEPT-LABOUR',
    'Labor & Factory Safety',
    'Statutory registration / intimation certificate for commercial establishments and corporate offices.',
    'Labour Commissionerate Maharashtra',
    'Commercial offices, administrative headquarters and non-factory establishments.',
    'Enterprises having an operational office in Maharashtra.',
    ARRAY['Company Incorporation Certificate & PAN', 'Office Premises Proof & Utility Bill', 'Authorized Signatory Identity Proof'],
    'Instant online submission on MahaKamgar portal with automated electronic receipt generation.',
    'https://mahakamgar.maharashtra.gov.in',
    '₹ 1,000 (Form F)',
    '1 Day',
    false,
    'Permanent',
    'Maharashtra Shops and Establishments Act 2017',
    'Verified',
    'SRC-LAB-SHOPS'
),
(
    'APP-LAB-CONTRACT',
    'Principal Employer Registration under Contract Labour (R&A) Act',
    'LAB-CL-REG-01',
    'DEPT-LABOUR',
    'Labor & Factory Safety',
    'Statutory registration for establishments deploying 20 or more contract workers through contractors.',
    'Labour Commissionerate Maharashtra',
    'Establishments engaging contract labour above statutory threshold.',
    'Principal employers engaging licensed contractors.',
    ARRAY['Company PAN & Incorporation Certificate', 'Contractor Deployment Agreement Copies', 'Worker Estimate & Work Order Schedules'],
    'Online submission on MahaKamgar single window, verification by Labour Officer.',
    'https://mahakamgar.maharashtra.gov.in',
    '₹ 2,500',
    '7 Days',
    true,
    '1 Year',
    'Contract Labour (Regulation & Abolition) Act 1970',
    'Verified',
    'SRC-LAB-CLRA'
),
(
    'APP-DEMO-BOILER',
    'Steam Boiler & Pressure Vessel Registration (Demo Record)',
    'DEMO-BOILER-REG',
    'DEPT-DISH',
    'Safety & Hazard',
    'Inspection and registration of steam boilers and high pressure piping.',
    'Directorate of Steam Boilers, Maharashtra',
    'Plants with steam boilers exceeding standard volume/pressure threshold.',
    'Boiler installations in manufacturing plants.',
    ARRAY['Boiler Manufacturer Test Certificate (Form II/III)', 'Steam Pipeline Hydraulic Test Record', 'Certified Boiler Attendant Appointment'],
    'Submission to Boiler Inspectorate, physical hydraulic test, issuance of certificate.',
    'https://dish.maharashtra.gov.in',
    NULL, -- Marked NULL as exact fee requires source confirmation
    NULL, -- Marked NULL as exact timeline requires source confirmation
    true,
    '1 Year',
    'Indian Boilers Act 1923',
    'Pending Verification',
    'SRC-DEMO-UNVERIFIED'
)
ON CONFLICT (id) DO NOTHING;

-- Industry Approvals Mappings
INSERT INTO public.industry_approvals (id, industry_id, approval_id, applicability_type, priority, notes, status, source_id)
VALUES
('IA-ENG-CTE', 'IND-ENG', 'APP-MPCB-CTE', 'Mandatory', 1, 'Mandatory prior environmental clearance before plant erection.', 'Verified', 'SRC-MPCB-PORTAL'),
('IA-ENG-DISH', 'IND-ENG', 'APP-DISH-FACT', 'Conditional', 2, 'Mandatory when workforce >= 10 with power.', 'Verified', 'SRC-DISH-ACT'),
('IA-ENG-FIRE', 'IND-ENG', 'APP-FIRE-NOC', 'Mandatory', 3, 'Mandatory building fire safety clearance.', 'Verified', 'SRC-FIRE-ACT'),
('IA-ENG-MSEDCL', 'IND-ENG', 'APP-MSEDCL-PWR', 'Mandatory', 4, 'Essential utility connection for manufacturing.', 'Verified', 'SRC-MSEDCL-CODE'),
('IA-ENG-MIDC', 'IND-ENG', 'APP-MIDC-BLD', 'Conditional', 5, 'Applicable for plots in MIDC industrial zones.', 'Verified', 'SRC-MIDC-DCR'),

('IA-AUTO-CTE', 'IND-AUTO', 'APP-MPCB-CTE', 'Mandatory', 1, 'Mandatory pollution clearance for auto assembly / machining.', 'Verified', 'SRC-MPCB-PORTAL'),
('IA-AUTO-DISH', 'IND-AUTO', 'APP-DISH-FACT', 'Conditional', 2, 'Applicable when employing workforce >= 10.', 'Verified', 'SRC-DISH-ACT'),
('IA-AUTO-FIRE', 'IND-AUTO', 'APP-FIRE-NOC', 'Mandatory', 3, 'Mandatory fire safety NOC.', 'Verified', 'SRC-FIRE-ACT'),

('IA-CHEM-CTE', 'IND-CHEM', 'APP-MPCB-CTE', 'Mandatory', 1, 'Mandatory Red Category pollution clearance.', 'Verified', 'SRC-MPCB-PORTAL'),
('IA-CHEM-EC', 'IND-CHEM', 'APP-SEIAA-EC', 'Mandatory', 2, 'Mandatory Prior Environmental Clearance under EIA 2006 Item 5(f).', 'Verified', 'SRC-MOEF-EIA'),
('IA-CHEM-DISH', 'IND-CHEM', 'APP-DISH-FACT', 'Mandatory', 3, 'Major Accident Hazard (MAH) / Hazardous Factory scrutiny.', 'Verified', 'SRC-DISH-ACT'),
('IA-CHEM-FIRE', 'IND-CHEM', 'APP-FIRE-NOC', 'Mandatory', 4, 'High-hazard chemical fire safety installation.', 'Verified', 'SRC-FIRE-ACT'),

('IA-PHARMA-CTE', 'IND-PHARMA', 'APP-MPCB-CTE', 'Mandatory', 1, 'Mandatory Red Category clearance for API manufacture.', 'Verified', 'SRC-MPCB-PORTAL'),
('IA-PHARMA-EC', 'IND-PHARMA', 'APP-SEIAA-EC', 'Mandatory', 2, 'Prior EC required under Item 5(f) synthetic chemicals / bulk drugs.', 'Verified', 'SRC-MOEF-EIA'),
('IA-PHARMA-DISH', 'IND-PHARMA', 'APP-DISH-FACT', 'Mandatory', 3, 'Factory inspection and worker safety clearance.', 'Verified', 'SRC-DISH-ACT'),

('IA-FOOD-CTE', 'IND-FOOD', 'APP-MPCB-CTE', 'Mandatory', 1, 'Green/Orange category pollution clearance for food processing.', 'Verified', 'SRC-MPCB-PORTAL'),
('IA-FOOD-DISH', 'IND-FOOD', 'APP-DISH-FACT', 'Conditional', 2, 'Applicable when employing workforce >= 10.', 'Verified', 'SRC-DISH-ACT'),

('IA-TEXTILE-CTE', 'IND-TEXTILE', 'APP-MPCB-CTE', 'Mandatory', 1, 'Orange category environmental clearance for textile processing.', 'Verified', 'SRC-MPCB-PORTAL'),
('IA-TEXTILE-DISH', 'IND-TEXTILE', 'APP-DISH-FACT', 'Conditional', 2, 'Applicable for mills/garment units with >= 10 workers.', 'Verified', 'SRC-DISH-ACT'),

('IA-ELEC-CTE', 'IND-ELEC', 'APP-MPCB-CTE', 'Mandatory', 1, 'Pollution clearance for electronics manufacturing / PCB assembly.', 'Verified', 'SRC-MPCB-PORTAL'),
('IA-ELEC-SHOPS', 'IND-ELEC', 'APP-LAB-SHOPS', 'May Apply', 2, 'May apply for purely software / design offices.', 'Verified', 'SRC-LAB-SHOPS')
ON CONFLICT (industry_id, approval_id) DO NOTHING;

-- Approval Documents
INSERT INTO public.approval_documents (id, approval_id, document_name, description, mandatory, source_id)
VALUES
('DOC-MPCB-01', 'APP-MPCB-CTE', 'Certificate of Incorporation & Company PAN Card', 'Statutory company identity and legal registration proof.', true, 'SRC-MPCB-PORTAL'),
('DOC-MPCB-02', 'APP-MPCB-CTE', 'MIDC Land Allotment Letter / Possession Deed', 'Premises ownership or registered industrial lease deed.', true, 'SRC-MPCB-PORTAL'),
('DOC-MPCB-03', 'APP-MPCB-CTE', 'Detailed Project Report (DPR) & CA Capital Certificate', 'Project cost summary, machinery details and CA asset certificate.', true, 'SRC-MPCB-PORTAL'),
('DOC-MPCB-04', 'APP-MPCB-CTE', 'Effluent & Air Pollution Control Layout', 'Engineering layout for ETP/STP and chimney heights.', true, 'SRC-MPCB-PORTAL'),

('DOC-DISH-01', 'APP-DISH-FACT', 'Factory Architectural Building Section Drawings', 'Form 1 blueprints showing elevation, doorways and natural lighting.', true, 'SRC-DISH-ACT'),
('DOC-DISH-02', 'APP-DISH-FACT', 'Machinery Layout & Material Movement Blueprint', 'Clearances between machines and worker circulation pathways.', true, 'SRC-DISH-ACT'),
('DOC-DISH-03', 'APP-DISH-FACT', 'Structural Stability Certificate', 'Stability certificate issued by chartered structural engineer.', true, 'SRC-DISH-ACT'),

('DOC-FIRE-01', 'APP-FIRE-NOC', 'Architectural Site Layout with Fire Tender Driveways', 'Clear 6.0m peripheral access and turning radius layout.', true, 'SRC-FIRE-ACT'),
('DOC-FIRE-02', 'APP-FIRE-NOC', 'Fire Protection System Design (Hydrant/Sprinkler)', 'Hydraulic calculations and riser piping layout.', true, 'SRC-FIRE-ACT')
ON CONFLICT (id) DO NOTHING;

-- Approval Steps
INSERT INTO public.approval_steps (id, approval_id, step_number, step_name, description, official_url, source_id)
VALUES
('STP-MPCB-01', 'APP-MPCB-CTE', 1, 'Online Application Submission', 'Submit Common Application Form with statutory document dossier.', 'https://mpcb.gov.in', 'SRC-MPCB-PORTAL'),
('STP-MPCB-02', 'APP-MPCB-CTE', 2, 'Fee Payment & Scrutiny', 'Payment of slab fee via online gateway and officer assignment.', 'https://mpcb.gov.in', 'SRC-MPCB-PORTAL'),
('STP-MPCB-03', 'APP-MPCB-CTE', 3, 'Field Inspection & Verification', 'Sub-Regional Officer site inspection for environmental compliance.', 'https://mpcb.gov.in', 'SRC-MPCB-PORTAL'),
('STP-MPCB-04', 'APP-MPCB-CTE', 4, 'Grant of CTE Order', 'Digital issue of Consent Order with QR code verification.', 'https://mpcb.gov.in', 'SRC-MPCB-PORTAL'),

('STP-DISH-01', 'APP-DISH-FACT', 1, 'Form 1 Plan Upload', 'Upload CAD blueprints and structural stability certificates.', 'https://dish.maharashtra.gov.in', 'SRC-DISH-ACT'),
('STP-DISH-02', 'APP-DISH-FACT', 2, 'Safety Officer Scrutiny', 'Technical review of machine spacing and hazard mitigations.', 'https://dish.maharashtra.gov.in', 'SRC-DISH-ACT'),
('STP-DISH-03', 'APP-DISH-FACT', 3, 'Endorsed Plan Issuance', 'Issue of digitally signed approved factory drawings.', 'https://dish.maharashtra.gov.in', 'SRC-DISH-ACT')
ON CONFLICT (approval_id, step_number) DO NOTHING;

-- Approval Rules (Rule Engine Definitions)
INSERT INTO public.approval_rules (
    id, approval_id, industry_id, condition_type, condition_operator, condition_value,
    outcome, priority, explanation, source_id, status
) VALUES
-- Rule 1: Workforce >= 10 triggers Factory Act Registration
(
    'RULE-FACT-WORKFORCE-10',
    'APP-DISH-FACT',
    NULL,
    'workforce_min',
    'gte',
    '{"workforce": 10}'::jsonb,
    'Mandatory',
    10,
    'Mandatory under Section 6 of Factories Act, 1948 as proposed workforce reaches 10 or more workers using electric power.',
    'SRC-DISH-ACT',
    'Verified'
),
-- Rule 2: Contract Workers >= 20 triggers Contract Labour Registration
(
    'RULE-LAB-CONTRACT-20',
    'APP-LAB-CONTRACT',
    NULL,
    'contract_workers_min',
    'gte',
    '{"contractWorkers": 20}'::jsonb,
    'Mandatory',
    20,
    'Mandatory Principal Employer registration under Contract Labour Act 1970 for employing 20 or more contract workers.',
    'SRC-LAB-CLRA',
    'Verified'
),
-- Rule 3: Hazardous materials trigger Priority Fire NOC & Red Category scrutiny
(
    'RULE-HAZARD-FIRE',
    'APP-FIRE-NOC',
    NULL,
    'hazard',
    'boolean',
    '{"hazardousMaterial": true}'::jsonb,
    'Mandatory',
    15,
    'Mandatory high-hazard fire protection scrutiny under Maharashtra Fire Act for handling hazardous or flammable substances.',
    'SRC-FIRE-ACT',
    'Verified'
),
-- Rule 4: Chemicals/Pharma triggers Environmental Clearance (EC)
(
    'RULE-CHEM-EC',
    'APP-SEIAA-EC',
    'IND-CHEM',
    'industry',
    'eq',
    '{"sector": "Chemicals & Petrochemicals"}'::jsonb,
    'Mandatory',
    30,
    'Mandatory Prior Environmental Clearance (EC) under Item 5(f) of EIA Notification 2006 for synthetic organic chemicals.',
    'SRC-MOEF-EIA',
    'Verified'
),
(
    'RULE-PHARMA-EC',
    'APP-SEIAA-EC',
    'IND-PHARMA',
    'industry',
    'eq',
    '{"sector": "Pharmaceuticals & APIs"}'::jsonb,
    'Mandatory',
    30,
    'Mandatory Prior Environmental Clearance (EC) under Item 5(f) of EIA Notification 2006 for bulk drugs & APIs.',
    'SRC-MOEF-EIA',
    'Verified'
),
-- Rule 5: Large built-up area > 215,278 sq.ft (> 20,000 sq.m) triggers Building EC Item 8(a)
(
    'RULE-BUILTUP-EC',
    'APP-SEIAA-EC',
    NULL,
    'built_up_sqft_min',
    'gte',
    '{"builtUpSqFt": 215278}'::jsonb,
    'Mandatory',
    35,
    'Mandatory Prior Environmental Clearance under Item 8(a) of EIA Notification 2006 as total built-up area exceeds 20,000 sq. meters.',
    'SRC-MOEF-EIA',
    'Verified'
),
-- Rule 6: Pre-Operation / Expansion stage triggers Consent to Operate (CTO)
(
    'RULE-STAGE-CTO',
    'APP-MPCB-CTO',
    NULL,
    'stage',
    'in',
    '{"stages": ["Pre-Operation", "Expansion", "Production Ready"]}'::jsonb,
    'Mandatory',
    5,
    'Mandatory Consent to Operate (CTO) under Water & Air Acts before commencing trial run or commercial operations.',
    'SRC-MPCB-PORTAL',
    'Verified'
),
-- Rule 7: Pre-Establishment / Planning stage triggers Consent to Establish (CTE)
(
    'RULE-STAGE-CTE',
    'APP-MPCB-CTE',
    NULL,
    'stage',
    'in',
    '{"stages": ["Pre-Establishment", "Planning", "Land Acquisition", "Construction"]}'::jsonb,
    'Mandatory',
    5,
    'Mandatory Consent to Establish (CTE) under Water & Air Acts prior to site construction and plant setup.',
    'SRC-MPCB-PORTAL',
    'Verified'
),
-- Rule 8: MIDC Industrial Area triggers MIDC SPA Building Sanction
(
    'RULE-MIDC-BLD',
    'APP-MIDC-BLD',
    NULL,
    'midc_area',
    'boolean',
    '{"isMIDC": true}'::jsonb,
    'Mandatory',
    8,
    'Mandatory industrial building plan sanction from MIDC Special Planning Authority (SPA).',
    'SRC-MIDC-DCR',
    'Verified'
),
-- Rule 9: Commercial Office / IT without factory activity uses Shops Act
(
    'RULE-SHOPS-OFFICE',
    'APP-LAB-SHOPS',
    NULL,
    'nature_of_biz',
    'in',
    '{"types": ["Service / IT", "Commercial", "Office"]}'::jsonb,
    'Mandatory',
    50,
    'Statutory registration / intimation under Maharashtra Shops & Establishments Act 2017 for commercial and IT establishments.',
    'SRC-LAB-SHOPS',
    'Verified'
),
-- Rule 10: Demo Boiler Rule (Pending Verification)
(
    'RULE-DEMO-BOILER',
    'APP-DEMO-BOILER',
    NULL,
    'has_boiler',
    'boolean',
    '{"hasBoiler": true}'::jsonb,
    'Conditional',
    60,
    'Steam boiler inspection and registration under Indian Boilers Act (Demo / Pending Official Verification).',
    'SRC-DEMO-UNVERIFIED',
    'Pending Verification'
)
ON CONFLICT (id) DO NOTHING;
