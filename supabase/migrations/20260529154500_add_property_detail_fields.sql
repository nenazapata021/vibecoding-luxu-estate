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

DELETE FROM property_images
WHERE property_id IN (SELECT id FROM properties);

INSERT INTO property_images (property_id, image_url, sort_order)
SELECT p.id, imgs.image_url, imgs.sort_order
FROM properties p
JOIN (
	VALUES
		('house', 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80', 0),
		('house', 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=1200&q=80', 1),
		('house', 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80', 2),
		('apartment', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', 0),
		('apartment', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80', 1),
		('apartment', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80', 2),
		('villa', 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80', 0),
		('villa', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80', 1),
		('villa', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80', 2),
		('penthouse', 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1200&q=80', 0),
		('penthouse', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80', 1),
		('penthouse', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80', 2)
) AS imgs(category, image_url, sort_order)
	ON imgs.category = p.category;