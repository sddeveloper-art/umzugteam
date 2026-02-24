
-- Create a config table for internal secrets (only accessible via SECURITY DEFINER functions)
CREATE TABLE IF NOT EXISTS public.app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS and block all access (only SECURITY DEFINER functions can read)
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;
-- No policies = no access via normal queries

-- Insert a randomly generated webhook secret
INSERT INTO public.app_config (key, value)
VALUES ('webhook_secret', encode(gen_random_bytes(32), 'hex'))
ON CONFLICT (key) DO NOTHING;

-- Create a helper function to retrieve the webhook secret
CREATE OR REPLACE FUNCTION public.get_webhook_secret()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  secret_value TEXT;
BEGIN
  SELECT value INTO secret_value
  FROM public.app_config
  WHERE key = 'webhook_secret'
  LIMIT 1;
  RETURN secret_value;
END;
$$;

-- Revoke public access to the helper function
REVOKE ALL ON FUNCTION public.get_webhook_secret() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_webhook_secret() FROM anon;
REVOKE ALL ON FUNCTION public.get_webhook_secret() FROM authenticated;

-- Update the notify_new_bid trigger function to include webhook secret
CREATE OR REPLACE FUNCTION public.notify_new_bid()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  payload json;
  webhook_secret TEXT;
BEGIN
  -- Get the webhook secret
  webhook_secret := get_webhook_secret();

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

  -- Call the edge function with webhook secret header
  PERFORM net.http_post(
    url := 'https://mcxqqwguapdhtgawgace.supabase.co/functions/v1/notify-new-bid',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-secret', webhook_secret
    ),
    body := payload::jsonb
  );

  RETURN NEW;
END;
$$;
