
-- Fix: reviews table exposes client_email publicly
-- Create a public view that excludes email, restrict base table to admins

-- Create public reviews view without email
CREATE VIEW public.reviews_public AS
SELECT 
  id, client_name, rating, comment, city, created_at, is_approved
FROM public.reviews
WHERE is_approved = true;

-- Grant access to public view
GRANT SELECT ON public.reviews_public TO anon, authenticated;

-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.reviews;
