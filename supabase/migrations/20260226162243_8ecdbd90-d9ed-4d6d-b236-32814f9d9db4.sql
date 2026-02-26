
-- Fix: Recreate company_reputation view with security_invoker
DROP VIEW IF EXISTS public.company_reputation;
CREATE OR REPLACE VIEW public.company_reputation WITH (security_invoker = true) AS
SELECT
  company_name,
  COUNT(*) as total_ratings,
  ROUND(AVG(rating), 1) as avg_rating,
  COUNT(*) FILTER (WHERE rating >= 4) as positive_ratings
FROM public.company_ratings
GROUP BY company_name;

GRANT SELECT ON public.company_reputation TO anon, authenticated;
