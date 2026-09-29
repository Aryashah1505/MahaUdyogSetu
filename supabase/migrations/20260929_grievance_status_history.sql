-- =========================================================================
-- ADD STATUS_HISTORY JSONB COLUMN TO GRIEVANCES TABLE
-- =========================================================================

ALTER TABLE public.grievances 
ADD COLUMN IF NOT EXISTS status_history JSONB DEFAULT '[]'::jsonb;
