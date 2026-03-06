
-- Transport categories enum
CREATE TYPE public.transport_category AS ENUM (
  'demenagement', 'meubles', 'voitures', 'motos', 'palettes', 
  'colis', 'fret', 'animaux', 'autres_vehicules', 'autres'
);

-- Add category to announcements
ALTER TABLE public.moving_announcements 
  ADD COLUMN IF NOT EXISTS category transport_category NOT NULL DEFAULT 'demenagement';

-- Update the public view to include category
DROP VIEW IF EXISTS public.announcements_public;
CREATE VIEW public.announcements_public 
WITH (security_invoker = true) AS
SELECT 
  id, from_city, to_city, apartment_size, volume, floor, 
  has_elevator, needs_packing, needs_assembly, preferred_date, 
  start_date, end_date, status, created_at, items, user_id, photos, category
FROM public.moving_announcements;

GRANT SELECT ON public.announcements_public TO anon, authenticated;

-- Transporters table (public profiles for transport companies)
CREATE TABLE public.transporters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  country TEXT NOT NULL DEFAULT 'DE',
  description TEXT,
  logo_url TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  categories transport_category[] NOT NULL DEFAULT '{demenagement}',
  completed_deliveries INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.transporters ENABLE ROW LEVEL SECURITY;

-- Anyone can view active transporters (public profiles)
CREATE POLICY "Anyone can view active transporters"
  ON public.transporters FOR SELECT
  USING (is_active = true);

-- Users can insert own transporter profile
CREATE POLICY "Users can insert own transporter profile"
  ON public.transporters FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update own transporter profile
CREATE POLICY "Users can update own transporter profile"
  ON public.transporters FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can manage all transporters
CREATE POLICY "Admins can manage transporters"
  ON public.transporters FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Add transporter role
-- (app_role enum already has 'admin' and 'user', we need 'transporter')
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'transporter';

-- Public transporter view with reputation
CREATE VIEW public.transporters_public AS
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

-- Link bids to transporter
ALTER TABLE public.company_bids 
  ADD COLUMN IF NOT EXISTS transporter_id UUID REFERENCES public.transporters(id);

-- Trigger to update updated_at on transporters
CREATE TRIGGER update_transporters_updated_at
  BEFORE UPDATE ON public.transporters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
