
-- Use DROP IF EXISTS + CREATE to ensure triggers exist on all tables
-- Only for the two tables where we got errors before (moving_announcements and company_bids may have been created by partial success)

DO $$
BEGIN
  -- moving_announcements updated_at trigger
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_moving_announcements_updated_at') THEN
    CREATE TRIGGER update_moving_announcements_updated_at
      BEFORE UPDATE ON public.moving_announcements
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  -- company_bids updated_at trigger
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_company_bids_updated_at') THEN
    CREATE TRIGGER update_company_bids_updated_at
      BEFORE UPDATE ON public.company_bids
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;
