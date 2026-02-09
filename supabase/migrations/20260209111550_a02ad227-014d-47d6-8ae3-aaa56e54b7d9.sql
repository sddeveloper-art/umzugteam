
-- Fix security definer views by using security_invoker
DROP VIEW IF EXISTS public.announcements_public;
CREATE VIEW public.announcements_public 
WITH (security_invoker = true)
AS
SELECT 
  id,
  from_city,
  to_city,
  apartment_size,
  volume,
  floor,
  has_elevator,
  needs_packing,
  needs_assembly,
  preferred_date,
  start_date,
  end_date,
  status,
  created_at,
  items
FROM public.moving_announcements;

DROP VIEW IF EXISTS public.bids_summary;
CREATE VIEW public.bids_summary
WITH (security_invoker = true)
AS
SELECT 
  announcement_id,
  COUNT(*)::bigint AS bid_count,
  MIN(price) AS lowest_price,
  MAX(price) AS highest_price
FROM public.company_bids
GROUP BY announcement_id;

-- Grant select on views to anon and authenticated
GRANT SELECT ON public.announcements_public TO anon, authenticated;
GRANT SELECT ON public.bids_summary TO anon, authenticated;

-- Add RLS SELECT policy on moving_announcements for anon users (view needs it with security_invoker)
CREATE POLICY "Anyone can view announcements via public view"
ON public.moving_announcements
FOR SELECT
TO anon, authenticated
USING (true);

-- Add RLS SELECT policy on company_bids for anon (bids_summary view needs it)
CREATE POLICY "Anyone can view bids via summary view"
ON public.company_bids
FOR SELECT
TO anon, authenticated
USING (true);
