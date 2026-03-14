CREATE POLICY "Users can update own announcements"
ON public.moving_announcements
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);