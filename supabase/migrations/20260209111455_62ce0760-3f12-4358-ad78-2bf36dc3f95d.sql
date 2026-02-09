
-- Add items column to moving_announcements
ALTER TABLE public.moving_announcements 
ADD COLUMN items jsonb DEFAULT '[]'::jsonb;

-- Add constraint to validate items is an array
ALTER TABLE public.moving_announcements 
ADD CONSTRAINT items_is_array CHECK (jsonb_typeof(items) = 'array');

-- Recreate the public view to include items
DROP VIEW IF EXISTS public.announcements_public;
CREATE VIEW public.announcements_public AS
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
  created_at,
  items
FROM public.moving_announcements;

-- Recreate the bids_summary view (unchanged but needed after view recreation)
DROP VIEW IF EXISTS public.bids_summary;
CREATE VIEW public.bids_summary AS
SELECT 
  announcement_id,
  COUNT(*)::bigint AS bid_count,
  MIN(price) AS lowest_price,
  MAX(price) AS highest_price
FROM public.company_bids
GROUP BY announcement_id;
