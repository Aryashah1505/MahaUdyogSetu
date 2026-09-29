-- =========================================================================
-- MahaUdyogSetu - Regulatory Knowledge Base Management, Versioning & Audit Trail
-- Migration: 20260929_regulatory_management_audit.sql
-- =========================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. ADD VERIFICATION & AUDIT COLUMNS TO EXISTING STEP 8 TABLES
-- =========================================================================
ALTER TABLE public.data_sources 
    ADD COLUMN IF NOT EXISTS verified_by TEXT,
    ADD COLUMN IF NOT EXISTS verification_notes TEXT;

ALTER TABLE public.approvals 
    ADD COLUMN IF NOT EXISTS verified_by TEXT,
    ADD COLUMN IF NOT EXISTS verification_notes TEXT,
    ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;

ALTER TABLE public.industry_approvals 
    ADD COLUMN IF NOT EXISTS verified_by TEXT,
    ADD COLUMN IF NOT EXISTS verification_notes TEXT;

ALTER TABLE public.approval_documents 
    ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'Verified',
    ADD COLUMN IF NOT EXISTS verified_by TEXT,
    ADD COLUMN IF NOT EXISTS verification_notes TEXT;

ALTER TABLE public.approval_steps 
    ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'Verified',
    ADD COLUMN IF NOT EXISTS verified_by TEXT,
    ADD COLUMN IF NOT EXISTS verification_notes TEXT;

ALTER TABLE public.approval_rules 
    ADD COLUMN IF NOT EXISTS verified_by TEXT,
    ADD COLUMN IF NOT EXISTS verification_notes TEXT,
    ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;

-- =========================================================================
-- 2. REGULATORY VERSIONS TABLE (Sequential Version History & Snapshots)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.regulatory_versions (
    id TEXT PRIMARY KEY, -- e.g. RVER-APP-MPCB-CTE-V1, RVER-UUID
    entity_type TEXT NOT NULL, -- 'approval' | 'approval_rule' | 'data_source' | 'industry_approval' | 'approval_document' | 'approval_step'
    entity_id TEXT NOT NULL,
    version_number INTEGER NOT NULL,
    previous_version INTEGER,
    change_type TEXT NOT NULL DEFAULT 'UPDATE', -- 'CREATE' | 'UPDATE' | 'VERIFY' | 'REJECT' | 'ARCHIVE' | 'RESTORE'
    changed_fields JSONB DEFAULT '[]'::jsonb,
    snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    changed_by TEXT NOT NULL DEFAULT 'REGULATORY_ADMIN',
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================================
-- 3. REGULATORY AUDIT LOG TABLE (Administrative Action Trail)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.regulatory_audit_log (
    id TEXT PRIMARY KEY, -- e.g. RAUD-UUID
    action TEXT NOT NULL, -- 'CREATE' | 'UPDATE' | 'VERIFY' | 'REJECT' | 'ARCHIVE' | 'RESTORE'
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    previous_status TEXT,
    new_status TEXT,
    changed_fields JSONB DEFAULT '[]'::jsonb,
    performed_by TEXT NOT NULL,
    reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================================
-- 4. PERFORMANCE INDEXES
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_regulatory_versions_entity ON public.regulatory_versions(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_regulatory_versions_created_at ON public.regulatory_versions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_regulatory_audit_log_entity ON public.regulatory_audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_regulatory_audit_log_action ON public.regulatory_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_regulatory_audit_log_created_at ON public.regulatory_audit_log(created_at DESC);

-- =========================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.regulatory_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regulatory_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access on regulatory_versions" ON public.regulatory_versions;
CREATE POLICY "Allow all access on regulatory_versions" ON public.regulatory_versions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access on regulatory_audit_log" ON public.regulatory_audit_log;
CREATE POLICY "Allow all access on regulatory_audit_log" ON public.regulatory_audit_log FOR ALL USING (true) WITH CHECK (true);
