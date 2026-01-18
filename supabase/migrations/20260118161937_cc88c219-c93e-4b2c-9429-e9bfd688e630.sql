-- Create function to update timestamps (if not exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create app_role enum for admin roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table (secure role management)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create competitors table with simulated prices
CREATE TABLE public.competitors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  base_price_multiplier DECIMAL(3,2) NOT NULL DEFAULT 1.15,
  distance_price_multiplier DECIMAL(3,2) NOT NULL DEFAULT 1.20,
  floor_price_multiplier DECIMAL(3,2) NOT NULL DEFAULT 1.10,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS for user_roles: only admins can view
CREATE POLICY "Admins can view user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Public can read active competitors (for price comparison display)
CREATE POLICY "Anyone can view active competitors"
ON public.competitors
FOR SELECT
USING (is_active = true);

-- Only admins can insert/update/delete competitors
CREATE POLICY "Admins can insert competitors"
ON public.competitors
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update competitors"
ON public.competitors
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete competitors"
ON public.competitors
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_competitors_updated_at
BEFORE UPDATE ON public.competitors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample competitors with price multipliers (simulated data)
INSERT INTO public.competitors (name, base_price_multiplier, distance_price_multiplier, floor_price_multiplier) VALUES
('Günstig Umzüge Berlin', 1.25, 1.30, 1.15),
('Express Umzug GmbH', 1.35, 1.25, 1.20),
('City Move Service', 1.20, 1.35, 1.25),
('Schnell & Sicher Umzüge', 1.30, 1.20, 1.18),
('Top Umzug Deutschland', 1.40, 1.28, 1.22);