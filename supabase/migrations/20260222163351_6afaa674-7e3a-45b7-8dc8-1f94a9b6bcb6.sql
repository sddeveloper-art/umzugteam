
-- Fix: Remove Authorization header with service role key from notify_new_bid trigger
CREATE OR REPLACE FUNCTION public.notify_new_bid()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  payload json;
BEGIN
  -- Build the payload
  payload := json_build_object(
    'type', 'INSERT',
    'table', 'company_bids',
    'schema', 'public',
    'record', json_build_object(
      'id', NEW.id,
      'announcement_id', NEW.announcement_id,
      'company_name', NEW.company_name,
      'company_email', NEW.company_email,
      'price', NEW.price,
      'notes', NEW.notes,
      'created_at', NEW.created_at
    ),
    'old_record', null
  );

  -- Call the edge function using pg_net (async HTTP call)
  -- No Authorization header - edge function validates via webhook secret instead
  PERFORM net.http_post(
    url := 'https://mcxqqwguapdhtgawgace.supabase.co/functions/v1/notify-new-bid',
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    ),
    body := payload::jsonb
  );

  RETURN NEW;
END;
$$;
