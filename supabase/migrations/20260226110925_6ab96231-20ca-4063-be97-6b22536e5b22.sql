
-- Add user_id column to moving_announcements to link to authenticated users
ALTER TABLE public.moving_announcements
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_moving_announcements_user_id ON public.moving_announcements(user_id);

-- Allow authenticated users to view their own announcements
CREATE POLICY "Users can view own announcements"
ON public.moving_announcements
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow authenticated users to view bids on their own announcements
CREATE POLICY "Users can view bids on own announcements"
ON public.company_bids
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.moving_announcements
    WHERE moving_announcements.id = company_bids.announcement_id
    AND moving_announcements.user_id = auth.uid()
  )
);

-- Update announcements_public view to include user_id for filtering
DROP VIEW IF EXISTS public.announcements_public;
CREATE VIEW public.announcements_public AS
SELECT
  id, from_city, to_city, apartment_size, volume, floor,
  has_elevator, needs_packing, needs_assembly, preferred_date,
  start_date, end_date, status, created_at, items, user_id
FROM public.moving_announcements;

-- Grant access to the view
GRANT SELECT ON public.announcements_public TO anon, authenticated;
