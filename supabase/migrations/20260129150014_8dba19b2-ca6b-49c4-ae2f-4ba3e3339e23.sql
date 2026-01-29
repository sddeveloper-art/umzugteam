-- Create a function to notify on new bid
CREATE OR REPLACE FUNCTION public.notify_new_bid()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
  PERFORM net.http_post(
    url := 'https://mcxqqwguapdhtgawgace.supabase.co/functions/v1/notify-new-bid',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := payload::jsonb
  );

  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS on_new_bid_notify ON public.company_bids;

CREATE TRIGGER on_new_bid_notify
AFTER INSERT ON public.company_bids
FOR EACH ROW
EXECUTE FUNCTION public.notify_new_bid();