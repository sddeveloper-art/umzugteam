
-- Fix PII exposure: Drop overly permissive SELECT policies on base tables
DROP POLICY IF EXISTS "Anyone can view announcements via public view" ON public.moving_announcements;
DROP POLICY IF EXISTS "Anyone can view bids via summary view" ON public.company_bids;

-- Recreate views WITHOUT security_invoker (default = runs as view owner, bypassing RLS)
-- This way views work without needing permissive base table policies
DROP VIEW IF EXISTS public.announcements_public;
DROP VIEW IF EXISTS public.bids_summary;

-- Recreate announcements_public view (no security_invoker = runs as owner)
CREATE VIEW public.announcements_public AS
SELECT 
  id, from_city, to_city, apartment_size, volume, floor,
  has_elevator, needs_packing, needs_assembly, preferred_date,
  start_date, end_date, status, created_at, items
FROM public.moving_announcements
WHERE status = 'active' OR status = 'expired';

-- Recreate bids_summary view (no security_invoker = runs as owner)
CREATE VIEW public.bids_summary AS
SELECT 
  announcement_id,
  COUNT(*)::bigint AS bid_count,
  MIN(price) AS lowest_price,
  MAX(price) AS highest_price
FROM public.company_bids
GROUP BY announcement_id;

-- Re-grant access to views for public use
GRANT SELECT ON public.announcements_public TO anon, authenticated;
GRANT SELECT ON public.bids_summary TO anon, authenticated;
