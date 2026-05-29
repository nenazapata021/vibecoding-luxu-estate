-- ============================================================
-- Adds slug-based routing, property image gallery, and map coordinates
-- ============================================================

ALTER TABLE properties
	ADD COLUMN IF NOT EXISTS slug TEXT,
	ADD COLUMN IF NOT EXISTS latitude NUMERIC,
	ADD COLUMN IF NOT EXISTS longitude NUMERIC;

ALTER TABLE featured_properties
	ADD COLUMN IF NOT EXISTS slug TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS properties_slug_key ON properties (slug);
CREATE UNIQUE INDEX IF NOT EXISTS featured_properties_slug_key ON featured_properties (slug);

CREATE TABLE IF NOT EXISTS property_images (
	id BIGSERIAL PRIMARY KEY,
	property_id TEXT NOT NULL REFERENCES properties (id) ON DELETE CASCADE,
	image_url TEXT NOT NULL,
	sort_order INTEGER NOT NULL DEFAULT 0,
	created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS property_images_property_id_idx ON property_images (property_id);

ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_policies
		WHERE schemaname = 'public'
		AND tablename = 'property_images'
		AND policyname = 'Lectura pública de imágenes de propiedades'
	) THEN
		CREATE POLICY "Lectura pública de imágenes de propiedades"
			ON property_images FOR SELECT
			USING (true);
	END IF;
END $$;

UPDATE properties
SET
	slug = CASE id
		WHEN 'prop-1' THEN 'modern-family-home'
		WHEN 'prop-2' THEN 'urban-loft'
		WHEN 'prop-3' THEN 'highland-retreat'
		WHEN 'prop-4' THEN 'sea-view-penthouse'
		WHEN 'prop-5' THEN 'central-studio'
		WHEN 'prop-6' THEN 'garden-villa'
		WHEN 'prop-7' THEN 'sunset-boulevard-villa'
		WHEN 'prop-8' THEN 'minimalist-loft'
		WHEN 'prop-9' THEN 'lakefront-cabin'
		WHEN 'prop-10' THEN 'skyline-oasis-penthouse'
		WHEN 'prop-11' THEN 'mid-century-modern-house'
		WHEN 'prop-12' THEN 'cozy-garden-flat'
		WHEN 'prop-13' THEN 'mediterranean-estate'
		WHEN 'prop-14' THEN 'harbor-view-apartment'
		WHEN 'prop-15' THEN 'zen-sanctuary-house'
		WHEN 'prop-16' THEN 'ocean-breeze-penthouse'
	END,
	latitude = CASE id
		WHEN 'prop-1' THEN 47.6205
		WHEN 'prop-2' THEN 45.5152
		WHEN 'prop-3' THEN 44.0582
		WHEN 'prop-4' THEN 25.7617
		WHEN 'prop-5' THEN 41.8781
		WHEN 'prop-6' THEN 30.2672
		WHEN 'prop-7' THEN 34.0736
		WHEN 'prop-8' THEN 40.6782
		WHEN 'prop-9' THEN 39.0968
		WHEN 'prop-10' THEN 40.7831
		WHEN 'prop-11' THEN 33.8303
		WHEN 'prop-12' THEN 51.4875
		WHEN 'prop-13' THEN 38.9067
		WHEN 'prop-14' THEN -33.8688
		WHEN 'prop-15' THEN 35.0116
		WHEN 'prop-16' THEN 34.0259
	END,
	longitude = CASE id
		WHEN 'prop-1' THEN -122.3321
		WHEN 'prop-2' THEN -122.6784
		WHEN 'prop-3' THEN -121.3153
		WHEN 'prop-4' THEN -80.1918
		WHEN 'prop-5' THEN -87.6298
		WHEN 'prop-6' THEN -97.7431
		WHEN 'prop-7' THEN -118.4004
		WHEN 'prop-8' THEN -73.9442
		WHEN 'prop-9' THEN -120.0324
		WHEN 'prop-10' THEN -73.9712
		WHEN 'prop-11' THEN -116.5453
		WHEN 'prop-12' THEN -0.1880
		WHEN 'prop-13' THEN 1.4297
		WHEN 'prop-14' THEN 151.2093
		WHEN 'prop-15' THEN 135.7681
		WHEN 'prop-16' THEN -118.5115
	END;

UPDATE featured_properties
SET
	slug = CASE id
		WHEN 'feat-1' THEN 'the-glass-pavilion'
		WHEN 'feat-2' THEN 'azure-heights-penthouse'
	END;

UPDATE properties
SET slug = lower(regexp_replace(title, '[^a-z0-9]+', '-', 'g'))
WHERE slug IS NULL;

UPDATE featured_properties
SET slug = lower(regexp_replace(title, '[^a-z0-9]+', '-', 'g'))
WHERE slug IS NULL;

ALTER TABLE properties
	ALTER COLUMN slug SET NOT NULL,
	ALTER COLUMN latitude SET NOT NULL,
	ALTER COLUMN longitude SET NOT NULL;

ALTER TABLE featured_properties
	ALTER COLUMN slug SET NOT NULL;

INSERT INTO property_images (property_id, image_url, sort_order) VALUES
	('prop-1', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjNDU9iE4zwPuWeg-CjIrLI-87GF24_LgOggcXT0vmUYfMx2q1dJAheiqWqVN-39uiwyLKEfP18FsG1vtUyAPX902OhGEfM4clcQiDsJW7MBbc_BoMtZXtqIeFKIfkHnkIPwmFbQg8Eaan6ULV99T8AUVUuKsro0HoTMrIaxw5pp1uSuQlF8X5Dait4US1W4vmyZnVioXbFnCoaOOZ0LPorb0rVGAIQd9reWcpqq27C0oO4ltnsCTHIcjIm0xp-2qVbRJSIZzWPv0', 0),
	('prop-1', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvpJBMaiXUL25hHYwLa_0R6dPhLLM1EuhEt-AVtOy8qSnEi9IcA_RzD5s5ThawY3XG2qw8h4kPqvfP18EY1E5vgA8fs6v7RefCMJ1gY8Gt4uyXGJ85-lcIvL18v8Nlc-U-VOwn1h54yjjg4-KXHt1N5DfuTkQUBdldSELRZeJ6zuZ087NCJ7dDIDaXKJpPgulmd6JC6zD1-Kq00Sb4VXIhVR3IQ1Hd8S6xZkd17QvMHSNqbtKG849PRqHZX3nKLHEWYWWPvbL5_Gs', 1),
	('prop-1', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbloTFAmeq6ugmfkwyqn3NMGn11PMk4FU0EIHRHvfYB8nw_-iH5TLps5ig3zipLPoKVZZKO8fOvEVJIwp3MQ9wrS4Dzhgw6ypUDhsycDc-YsboVBbRrXxKOYl-77zNHX9E4hynYyJfVVzXn7ldtURk3Ij3pHIMwqzfDdUxyhYaIJe5dRYa0JN5RpHbPNaV33TcM-IoYW11wNUCKkivtfgC3tk7hkKa3gue7ZTjLhR1ZOE_A1MvMZ3rgBxGDg-HFASH4YP6jI3rwMM', 2),
	('prop-2', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4zNatD3vePhIZAi6OHHJKmamYSgeBNSKjEt32tvkkf4s6aBXCF8R4LNfDfPa9leA0t6N1OKOcP358WwZrnosbCBxSM7EaY2_P7qkx3MinRgmHQn7RvleNTwy8cLigMoR3iv0u83chBVbZYI6BcNMcqv80W-l1pIUgIWZcDIXEqtUatrsojSGfM0lTNDZpkBntBUkRY6NB4ZUymYNYvTHXKbO8NZ6N6uoyuuHqcaRWKzHCNXkOR3p-_EVFAHR8QwijIY_m1mefPZ4', 0),
	('prop-4', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGq4Phm0uDzCnjHAsnWpYTBVpOds_M6iOsJuRQQA5eUZHkztGgtc7eh_OE6wBeyW1-iZh7yyhROnvvmqkAZ9tyAWFGXk0FG52zU4kZ_EDLA0U0cRszy7byNXTeWe0_hS53SYmtCTEV8Y1AM-WxiIC38UMa15QwFDjXtCGQOxoh35K0Ol_70vfsxm0VqDbaWkr8tcEbLTLy0NXH_GcpGK4lAXizgxYOIlFWGyau-4OIfPZRpjCBDbz_qu3VlN201UUJGiuM9ajVd-U', 0),
	('prop-7', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80', 0),
	('prop-7', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', 1),
	('prop-10', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', 0),
	('prop-13', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', 0)
ON CONFLICT DO NOTHING;