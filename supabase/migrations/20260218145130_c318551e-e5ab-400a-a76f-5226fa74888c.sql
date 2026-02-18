
-- blog_articles: add French columns
ALTER TABLE public.blog_articles
  ADD COLUMN IF NOT EXISTS title_fr text,
  ADD COLUMN IF NOT EXISTS excerpt_fr text,
  ADD COLUMN IF NOT EXISTS content_fr text,
  ADD COLUMN IF NOT EXISTS category_fr text,
  ADD COLUMN IF NOT EXISTS read_time_fr text;

-- gallery_items: add French columns
ALTER TABLE public.gallery_items
  ADD COLUMN IF NOT EXISTS title_fr text,
  ADD COLUMN IF NOT EXISTS description_fr text,
  ADD COLUMN IF NOT EXISTS category_fr text;

-- faq_items: add French columns
ALTER TABLE public.faq_items
  ADD COLUMN IF NOT EXISTS question_fr text,
  ADD COLUMN IF NOT EXISTS answer_fr text;

-- services: add French columns
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS title_fr text,
  ADD COLUMN IF NOT EXISTS description_fr text,
  ADD COLUMN IF NOT EXISTS features_fr jsonb DEFAULT '[]'::jsonb;

-- packages: add French columns
ALTER TABLE public.packages
  ADD COLUMN IF NOT EXISTS name_fr text,
  ADD COLUMN IF NOT EXISTS price_note_fr text,
  ADD COLUMN IF NOT EXISTS badge_fr text,
  ADD COLUMN IF NOT EXISTS features_fr jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS excluded_features_fr jsonb DEFAULT '[]'::jsonb;
