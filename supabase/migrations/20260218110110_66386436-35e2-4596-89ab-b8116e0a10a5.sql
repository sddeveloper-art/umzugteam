
-- ===========================
-- 1. Blog Articles
-- ===========================
CREATE TABLE public.blog_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT,
  category TEXT NOT NULL DEFAULT 'Ratgeber',
  read_time TEXT DEFAULT '5 Min.',
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published articles"
  ON public.blog_articles FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can view all articles"
  ON public.blog_articles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can submit articles"
  ON public.blog_articles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Admins can update articles"
  ON public.blog_articles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete articles"
  ON public.blog_articles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_blog_articles_updated_at
  BEFORE UPDATE ON public.blog_articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===========================
-- 2. Gallery Items
-- ===========================
CREATE TABLE public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Privatumzug',
  description TEXT,
  image_url TEXT,
  submitted_by_email TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved gallery items"
  ON public.gallery_items FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Admins can view all gallery items"
  ON public.gallery_items FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can submit gallery items"
  ON public.gallery_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update gallery items"
  ON public.gallery_items FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete gallery items"
  ON public.gallery_items FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_gallery_items_updated_at
  BEFORE UPDATE ON public.gallery_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===========================
-- 3. FAQ Items
-- ===========================
CREATE TABLE public.faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  submitted_by_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active FAQs"
  ON public.faq_items FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all FAQs"
  ON public.faq_items FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can submit FAQ suggestions"
  ON public.faq_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update FAQs"
  ON public.faq_items FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete FAQs"
  ON public.faq_items FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_faq_items_updated_at
  BEFORE UPDATE ON public.faq_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===========================
-- 4. Services
-- ===========================
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Truck',
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services"
  ON public.services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all services"
  ON public.services FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert services"
  ON public.services FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update services"
  ON public.services FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete services"
  ON public.services FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===========================
-- 5. Packages
-- ===========================
CREATE TABLE public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Zap',
  price TEXT NOT NULL,
  price_note TEXT,
  badge TEXT,
  is_highlighted BOOLEAN NOT NULL DEFAULT false,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  excluded_features JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active packages"
  ON public.packages FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all packages"
  ON public.packages FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert packages"
  ON public.packages FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update packages"
  ON public.packages FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete packages"
  ON public.packages FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_packages_updated_at
  BEFORE UPDATE ON public.packages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===========================
-- 6. Seed initial data
-- ===========================

-- Seed FAQ
INSERT INTO public.faq_items (question, answer, sort_order, is_active) VALUES
('Wie erhalte ich ein Angebot für meinen Umzug?', 'Sie können ein kostenloses Angebot erhalten, indem Sie unser Online-Formular oben auf dieser Seite ausfüllen oder uns direkt unter +49 151 66532563 anrufen. Ein Berater wird Sie innerhalb von 2 Stunden zurückrufen, um die Schätzung nach Ihren spezifischen Bedürfnissen zu verfeinern.', 1, true),
('Sind meine Güter während des Umzugs versichert?', 'Ja, alle Ihre Güter sind während des Transports durch unsere Berufsversicherung abgedeckt. Für Gegenstände von außergewöhnlichem Wert (Kunstwerke, Antiquitäten) bieten wir eine zusätzliche Wertversicherung an. Die Garantiedetails sind in Ihrem Angebot enthalten.', 2, true),
('Bieten Sie einen Verpackungsservice an?', 'Absolut! Wir bieten einen kompletten Verpackungsservice: Lieferung von Kartons und Materialien, professionelles Verpacken Ihrer Sachen, Spezialschutz für zerbrechliche Gegenstände und organisierte Beschriftung. Dieser Service kann je nach Ihren Wünschen teil- oder vollständig sein.', 3, true),
('Wie lange im Voraus sollte ich buchen?', 'Für einen Standardumzug empfehlen wir eine Reservierung 2 bis 3 Wochen im Voraus. In Stoßzeiten (Monatsende, Sommer) planen Sie 4 bis 6 Wochen ein. Bei Eilaufträgen tun wir unser Bestes, um Ihnen entgegenzukommen.', 4, true),
('Bieten Sie Wochenendumzüge an?', 'Ja, wir bieten Termine am Samstag und auf Anfrage auch am Sonntag an. Diese Flexibilität wird besonders von Unternehmen geschätzt, die die Auswirkungen auf ihren Betrieb minimieren möchten. Es können zusätzliche Gebühren anfallen.', 5, true),
('Was passiert bei Verspätung oder Problemen?', 'Wir verpflichten uns zur Pünktlichkeit. Bei ausnahmsweisen Verspätungen (Verkehr, Wetter) werden Sie sofort informiert. Bei Schäden ist unser Reklamationsverfahren einfach und schnell: Meldung innerhalb von 48 Stunden, Begutachtung und Entschädigung gemäß den Garantien.', 6, true),
('Führen Sie internationale Umzüge durch?', 'Ja, wir führen Umzüge in ganz Europa und international durch. Wir kümmern uns um Zollformalitäten, See- oder Lufttransport je nach Zielort und begleiten Sie bei allen administrativen Schritten.', 7, true),
('Wie funktioniert die Möbellagerung?', 'Unsere Lagerräume sind 24/7 gesichert, klimatisiert und nach Terminvereinbarung zugänglich. Sie können Ihre Güter für eine Mindestdauer von einem Monat lagern, verlängerbar. Bei der Einlagerung wird ein detailliertes Inventar erstellt, um die Rückverfolgbarkeit zu gewährleisten.', 8, true);

-- Seed Services
INSERT INTO public.services (title, description, icon_name, features, sort_order, is_active) VALUES
('Privatumzug', 'Komplettservice für Ihren privaten Umzug, vom Studio bis zum großen Haus.', 'Truck', '["Be- & Entladen", "Sicherer Transport", "Qualifiziertes Team"]', 1, true),
('Firmenumzug', 'Maßgeschneiderte Lösungen für Büros, Geschäfte und Unternehmen.', 'Building', '["Strategische Planung", "Minimale Unterbrechung", "Wochenende möglich"]', 2, true),
('Verpackungsservice', 'Professionelles Verpacken Ihrer Güter mit hochwertigen Materialien.', 'Package', '["Verstärkte Kartons", "Luftpolsterschutz", "Organisierte Beschriftung"]', 3, true),
('Lagerung & Einlagerung', 'Sichere Lagerräume für Ihre Möbel und persönlichen Gegenstände.', 'Warehouse', '["24/7 Sicherheit", "Klimakontrolle", "Flexibler Zugang"]', 4, true),
('Reinigung & Renovierung', 'Komplette Reinigung Ihrer alten oder neuen Wohnung.', 'Sparkles', '["Grundreinigung", "Umweltfreundliche Produkte", "Übergabeprotokoll"]', 5, true),
('Spezialtransporte', 'Spezialtransport für Klaviere, Kunstwerke und empfindliche Gegenstände.', 'Piano', '["Spezialausrüstung", "Fachpersonal", "Erweiterte Versicherung"]', 6, true),
('Möbel Ab- & Aufbau', 'Professionelle Demontage und Montage aller Möbelstücke – Küchen, Schränke, Betten.', 'Sofa', '["Fachgerechter Aufbau", "Werkzeug inklusive", "Küchenmontage"]', 7, true),
('Premium-Versicherung', 'Erweiterte Transportversicherung für maximalen Schutz Ihrer Wertgegenstände.', 'ShieldCheck', '["Vollkasko-Schutz", "Bis 50.000 € Deckung", "Schadensabwicklung 24h"]', 8, true),
('Empfindliches Verpacken', 'Spezialverpackung für Glas, Porzellan, Elektronik und empfindliche Objekte.', 'PackageCheck', '["Maßgeschneiderte Polsterung", "Antistatische Folien", "Spezialkisten"]', 9, true);

-- Seed Packages
INSERT INTO public.packages (name, icon_name, price, price_note, badge, is_highlighted, features, excluded_features, sort_order, is_active) VALUES
('Basique', 'Zap', 'Ab 299 €', 'Für Studio / 1-Zimmer', NULL, false, '["Be- und Entladen", "Sicherer Transport", "Grundversicherung", "Qualifiziertes 2-Mann-Team"]', '["Verpackungsservice", "Möbelmontage", "Reinigung", "Premium-Versicherung"]', 1, true),
('Komfort', 'Star', 'Ab 549 €', 'Für Studio / 1-Zimmer', 'Beliebt', true, '["Alles aus Basique", "Ein- und Auspacken", "Möbel Ab- & Aufbau", "Verpackungsmaterial inklusive", "3-Mann-Team"]', '["Reinigung", "Premium-Versicherung"]', 2, true),
('Premium', 'Crown', 'Ab 899 €', 'Für Studio / 1-Zimmer', NULL, false, '["Alles aus Komfort", "Grundreinigung alte Wohnung", "Empfindliches Verpacken", "Premium-Versicherung (50.000 €)", "Express-Service (Priorität)", "4-Mann-Team", "Persönlicher Ansprechpartner"]', '[]', 3, true);

-- Seed Blog Articles
INSERT INTO public.blog_articles (title, slug, excerpt, category, read_time, is_published, sort_order) VALUES
('10 Tipps für einen stressfreien Umzug', 'umzug-planen-tipps', 'Von der Planung bis zum Einzug: So meistern Sie Ihren Umzug ohne Stress. Unsere Experten teilen ihre besten Ratschläge.', 'Ratgeber', '5 Min.', true, 1),
('Umzugskosten sparen: So geht''s', 'umzugskosten-sparen', 'Erfahren Sie, wie Sie bei Ihrem nächsten Umzug bares Geld sparen können – ohne auf Qualität zu verzichten.', 'Finanzen', '4 Min.', true, 2),
('Adressänderung: Wo Sie sich überall ummelden müssen', 'adresse-aendern-checkliste', 'Bank, Versicherung, Arbeitgeber – diese komplette Liste hilft Ihnen, keine Ummeldung zu vergessen.', 'Checkliste', '6 Min.', true, 3),
('Umzug mit Kindern: Tipps für Familien', 'umzug-mit-kindern', 'Wie Sie den Umzug für Ihre Kinder stressfrei gestalten und die ganze Familie einbeziehen.', 'Familie', '5 Min.', true, 4),
('Erste eigene Wohnung: Was Sie beachten sollten', 'erste-eigene-wohnung', 'Von der Budgetplanung bis zur Einrichtung – der ultimative Guide für Ihren ersten Umzug.', 'Ratgeber', '7 Min.', true, 5),
('Nachhaltig umziehen: Öko-Tipps für den Umzug', 'nachhaltig-umziehen', 'Wie Sie Ihren Umzug umweltfreundlich gestalten: von wiederverwendbaren Kartons bis zur grünen Entsorgung.', 'Nachhaltigkeit', '4 Min.', true, 6);

-- Seed Gallery Items
INSERT INTO public.gallery_items (title, category, description, is_approved, sort_order) VALUES
('Privatumzug Berlin', 'Privatumzug', 'Kompletter 3-Zimmer-Umzug in Berlin-Mitte', true, 1),
('Büroumzug München', 'Firmenumzug', 'Büroumzug mit 50 Arbeitsplätzen über das Wochenende', true, 2),
('Seniorenumzug Hamburg', 'Privatumzug', 'Sensibler Umzug mit besonderer Betreuung', true, 3),
('Lagerung & Einlagerung', 'Lagerung', 'Sichere Zwischenlagerung für 3 Monate', true, 4),
('Klaviertransport', 'Spezialtransport', 'Professioneller Transport eines Flügels', true, 5),
('Firmenumzug Frankfurt', 'Firmenumzug', 'IT-Umzug mit empfindlicher Hardware', true, 6),
('Studentenumzug Köln', 'Privatumzug', 'Schneller und günstiger Studentenumzug', true, 7),
('Verpackungsservice', 'Service', 'Professionelles Ein- und Auspacken', true, 8),
('Möbelmontage', 'Service', 'Auf- und Abbau komplexer Schranksysteme', true, 9);
