
-- Allow authenticated users to insert their own transporter role only
CREATE POLICY "Users can self-assign transporter role"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND role = 'transporter');

-- Allow users to read their own roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
