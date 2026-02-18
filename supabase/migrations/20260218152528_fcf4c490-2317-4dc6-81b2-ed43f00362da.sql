
-- Recreate views with security_invoker = true

-- 1. announcements_public
CREATE OR REPLACE VIEW public.announcements_public
WITH (security_invoker = true)
AS
SELECT id, from_city, to_city, apartment_size, volume, floor, has_elevator,
       needs_packing, needs_assembly, preferred_date, start_date, end_date,
       status, created_at, items
FROM moving_announcements
WHERE status = 'active'::announcement_status OR status = 'expired'::announcement_status;

-- 2. bids_summary
CREATE OR REPLACE VIEW public.bids_summary
WITH (security_invoker = true)
AS
SELECT announcement_id,
       count(*) AS bid_count,
       min(price) AS lowest_price,
       max(price) AS highest_price
FROM company_bids
GROUP BY announcement_id;

-- 3. reviews_public
CREATE OR REPLACE VIEW public.reviews_public
WITH (security_invoker = true)
AS
SELECT id, client_name, rating, comment, city, created_at, is_approved
FROM reviews
WHERE is_approved = true;

-- Re-grant access to the views for anon and authenticated roles
GRANT SELECT ON public.announcements_public TO anon, authenticated;
GRANT SELECT ON public.bids_summary TO anon, authenticated;
GRANT SELECT ON public.reviews_public TO anon, authenticated;
