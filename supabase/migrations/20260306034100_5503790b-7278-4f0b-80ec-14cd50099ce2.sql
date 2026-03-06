
-- Fix transporters_public view to use security_invoker
DROP VIEW IF EXISTS public.transporters_public;
CREATE VIEW public.transporters_public 
WITH (security_invoker = true) AS
SELECT 
  t.id,
  t.company_name,
  t.contact_name,
  t.city,
  t.country,
  t.description,
  t.logo_url,
  t.is_verified,
  t.categories,
  t.completed_deliveries,
  t.created_at,
  COALESCE(cr.avg_rating, 0) AS avg_rating,
  COALESCE(cr.total_ratings, 0) AS total_ratings
FROM public.transporters t
LEFT JOIN public.company_reputation cr ON cr.company_name = t.company_name
WHERE t.is_active = true;

GRANT SELECT ON public.transporters_public TO anon, authenticated;
