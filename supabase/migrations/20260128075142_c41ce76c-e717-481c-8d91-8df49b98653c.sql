-- ============================================
-- SECURITY FIX: Input validation constraints
-- ============================================

-- Add constraints to moving_announcements
ALTER TABLE public.moving_announcements 
  ADD CONSTRAINT client_name_length CHECK (length(client_name) BETWEEN 2 AND 100),
  ADD CONSTRAINT client_email_length CHECK (length(client_email) <= 255),
  ADD CONSTRAINT client_phone_length CHECK (client_phone IS NULL OR length(client_phone) <= 30),
  ADD CONSTRAINT from_city_length CHECK (length(from_city) BETWEEN 2 AND 100),
  ADD CONSTRAINT to_city_length CHECK (length(to_city) BETWEEN 2 AND 100),
  ADD CONSTRAINT apartment_size_length CHECK (length(apartment_size) <= 50),
  ADD CONSTRAINT description_length CHECK (description IS NULL OR length(description) <= 2000),
  ADD CONSTRAINT volume_range CHECK (volume > 0 AND volume <= 500),
  ADD CONSTRAINT floor_range CHECK (floor >= 0 AND floor <= 100);

-- Add constraints to company_bids
ALTER TABLE public.company_bids
  ADD CONSTRAINT company_name_length CHECK (length(company_name) BETWEEN 2 AND 100),
  ADD CONSTRAINT company_email_length CHECK (length(company_email) <= 255),
  ADD CONSTRAINT company_phone_length CHECK (company_phone IS NULL OR length(company_phone) <= 30),
  ADD CONSTRAINT notes_length CHECK (notes IS NULL OR length(notes) <= 1000),
  ADD CONSTRAINT price_positive CHECK (price > 0 AND price <= 1000000);

-- ============================================
-- SECURITY FIX: Create public views with limited data
-- ============================================

-- Public view for announcements (no PII exposed)
CREATE VIEW public.announcements_public
WITH (security_invoker = on) AS
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
  created_at
FROM public.moving_announcements
WHERE status = 'active' OR status = 'expired';

-- Public view for bid summary (no company PII exposed)
CREATE VIEW public.bids_summary
WITH (security_invoker = on) AS
SELECT 
  announcement_id,
  COUNT(*) as bid_count,
  MIN(price) as lowest_price,
  MAX(price) as highest_price
FROM public.company_bids
GROUP BY announcement_id;

-- ============================================
-- SECURITY FIX: Restrict direct table access
-- ============================================

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Anyone can view active announcements" ON public.moving_announcements;
DROP POLICY IF EXISTS "Anyone can view bids on active announcements" ON public.company_bids;

-- Admins can view all announcements (including PII)
CREATE POLICY "Admins can view all announcements" 
  ON public.moving_announcements 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can view all bids
CREATE POLICY "Admins can view all bids" 
  ON public.company_bids 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

-- Grant access to public views for anonymous users
GRANT SELECT ON public.announcements_public TO anon, authenticated;
GRANT SELECT ON public.bids_summary TO anon, authenticated;