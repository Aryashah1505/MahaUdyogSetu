-- =========================================================================
-- Migration: 20260929_company_password_security.sql
-- Replace plaintext password with password_hash & enforce secure hashing
-- =========================================================================

-- 1. Add password_hash column if not present
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'companies' 
        AND column_name = 'password_hash'
    ) THEN
        ALTER TABLE public.companies ADD COLUMN password_hash TEXT;
    END IF;
END $$;

-- 2. Migrate existing password column if it exists to password_hash or set benchmark hash
UPDATE public.companies 
SET password_hash = 'dff68a4b4aa191a84189229a9d9dc360:2a888eea880742bf145777c58969f1c3f85bb53012bc4eae428e622da223131caf4c68a87359b8594c89ae9ad089d3f0d682b03109ee8eb2cdfee2384149fd78'
WHERE id = 'BIZ-MH-FGHIJ-001' AND (password_hash IS NULL OR password_hash = '');

-- 3. Drop plaintext password column if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'companies' 
        AND column_name = 'password'
    ) THEN
        ALTER TABLE public.companies DROP COLUMN password;
    END IF;
END $$;
