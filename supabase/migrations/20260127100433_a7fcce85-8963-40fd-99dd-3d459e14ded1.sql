-- Enum for announcement status
CREATE TYPE public.announcement_status AS ENUM ('active', 'expired', 'completed');

-- Table for client moving announcements
CREATE TABLE public.moving_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  from_city TEXT NOT NULL,
  to_city TEXT NOT NULL,
  apartment_size TEXT NOT NULL,
  volume NUMERIC NOT NULL DEFAULT 20,
  floor INTEGER NOT NULL DEFAULT 0,
  has_elevator BOOLEAN NOT NULL DEFAULT false,
  needs_packing BOOLEAN NOT NULL DEFAULT false,
  needs_assembly BOOLEAN NOT NULL DEFAULT false,
  preferred_date DATE,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status announcement_status NOT NULL DEFAULT 'active',
  winner_bid_id UUID,
  notification_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for company bids
CREATE TABLE public.company_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id UUID NOT NULL REFERENCES public.moving_announcements(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_email TEXT NOT NULL,
  company_phone TEXT,
  price NUMERIC NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.moving_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_bids ENABLE ROW LEVEL SECURITY;

-- RLS Policies for moving_announcements
CREATE POLICY "Anyone can view active announcements"
ON public.moving_announcements
FOR SELECT
USING (status = 'active' OR status = 'expired');

CREATE POLICY "Anyone can create announcements"
ON public.moving_announcements
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can update announcements"
ON public.moving_announcements
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete announcements"
ON public.moving_announcements
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for company_bids
CREATE POLICY "Anyone can view bids on active announcements"
ON public.company_bids
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.moving_announcements
    WHERE id = announcement_id
    AND (status = 'active' OR status = 'expired' OR status = 'completed')
  )
);

CREATE POLICY "Anyone can submit bids on active announcements"
ON public.company_bids
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.moving_announcements
    WHERE id = announcement_id
    AND status = 'active'
    AND end_date > now()
  )
);

CREATE POLICY "Admins can update bids"
ON public.company_bids
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete bids"
ON public.company_bids
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Indexes for performance
CREATE INDEX idx_announcements_status ON public.moving_announcements(status);
CREATE INDEX idx_announcements_end_date ON public.moving_announcements(end_date);
CREATE INDEX idx_bids_announcement_id ON public.company_bids(announcement_id);
CREATE INDEX idx_bids_price ON public.company_bids(price);

-- Trigger for updated_at
CREATE TRIGGER update_announcements_updated_at
BEFORE UPDATE ON public.moving_announcements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bids_updated_at
BEFORE UPDATE ON public.company_bids
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();