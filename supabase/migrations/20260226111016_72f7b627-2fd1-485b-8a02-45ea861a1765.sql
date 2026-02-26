
-- Fix the view to use security_invoker instead of security_definer
DROP VIEW IF EXISTS public.announcements_public;
CREATE VIEW public.announcements_public
WITH (security_invoker = true)
AS
SELECT
  id, from_city, to_city, apartment_size, volume, floor,
  has_elevator, needs_packing, needs_assembly, preferred_date,
  start_date, end_date, status, created_at, items, user_id
FROM public.moving_announcements;

GRANT SELECT ON public.announcements_public TO anon, authenticated;
