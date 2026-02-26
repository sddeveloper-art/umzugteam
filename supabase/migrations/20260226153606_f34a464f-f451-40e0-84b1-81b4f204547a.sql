
-- Create storage bucket for announcement photos
INSERT INTO storage.buckets (id, name, public) VALUES ('announcement-photos', 'announcement-photos', true);

-- Allow anyone to upload photos (announcements can be created without auth)
CREATE POLICY "Anyone can upload announcement photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'announcement-photos');

-- Allow anyone to view announcement photos (public bucket)
CREATE POLICY "Anyone can view announcement photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'announcement-photos');

-- Allow admins to delete announcement photos
CREATE POLICY "Admins can delete announcement photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'announcement-photos' AND has_role(auth.uid(), 'admin'));

-- Add photos column to moving_announcements
ALTER TABLE public.moving_announcements
ADD COLUMN photos jsonb DEFAULT '[]'::jsonb;
