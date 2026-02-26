
-- Create company_ratings table
CREATE TABLE public.company_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id uuid NOT NULL REFERENCES public.moving_announcements(id) ON DELETE CASCADE,
  bid_id uuid NOT NULL REFERENCES public.company_bids(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  company_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(announcement_id, user_id)
);

-- Enable RLS
ALTER TABLE public.company_ratings ENABLE ROW LEVEL SECURITY;

-- Users can rate companies on their own completed announcements
CREATE POLICY "Users can create own ratings"
ON public.company_ratings FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.moving_announcements
    WHERE id = announcement_id
    AND user_id = auth.uid()
    AND status = 'completed'
  )
);

-- Users can view own ratings
CREATE POLICY "Users can view own ratings"
ON public.company_ratings FOR SELECT
USING (auth.uid() = user_id);

-- Anyone can view all ratings (public feedback)
CREATE POLICY "Anyone can view ratings"
ON public.company_ratings FOR SELECT
USING (true);

-- Admins can manage ratings
CREATE POLICY "Admins can manage ratings"
ON public.company_ratings FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Create a public view for company reputation (average ratings)
CREATE OR REPLACE VIEW public.company_reputation AS
SELECT
  company_name,
  COUNT(*) as total_ratings,
  ROUND(AVG(rating), 1) as avg_rating,
  COUNT(*) FILTER (WHERE rating >= 4) as positive_ratings
FROM public.company_ratings
GROUP BY company_name;

GRANT SELECT ON public.company_reputation TO anon, authenticated;
