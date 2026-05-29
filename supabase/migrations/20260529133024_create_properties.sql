-- ============================================================
-- migrations
-- Fecha: 2026-05-29 13:30:24
-- Esta migración crea las tablas `properties` y `featured_properties`, activa RLS
-- y añade datos de ejemplo si no existen.
-- ============================================================

-- Tabla principal de propiedades
CREATE TABLE IF NOT EXISTS properties (
	id            TEXT PRIMARY KEY,
	title         TEXT NOT NULL,
	location      TEXT NOT NULL,
	price         NUMERIC NOT NULL,
	type          TEXT NOT NULL CHECK (type IN ('sale', 'rent')),
	beds          NUMERIC NOT NULL,
	baths         NUMERIC NOT NULL,
	area          NUMERIC NOT NULL,
	category      TEXT NOT NULL CHECK (category IN ('house', 'apartment', 'villa', 'penthouse')),
	image_url     TEXT NOT NULL,
	is_favorite   BOOLEAN DEFAULT FALSE,
	created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de propiedades destacadas (Featured)
CREATE TABLE IF NOT EXISTS featured_properties (
	id            TEXT PRIMARY KEY,
	title         TEXT NOT NULL,
	location      TEXT NOT NULL,
	price         NUMERIC NOT NULL,
	beds          NUMERIC NOT NULL,
	baths         NUMERIC NOT NULL,
	area          NUMERIC NOT NULL,
	tag           TEXT NOT NULL,
	image_url     TEXT NOT NULL,
	is_favorite   BOOLEAN DEFAULT FALSE,
	created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) — solo lectura pública
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de propiedades"
	ON properties FOR SELECT
	USING (true);

CREATE POLICY "Lectura pública de propiedades destacadas"
	ON featured_properties FOR SELECT
	USING (true);

-- Datos de ejemplo (seed) — inserta si no existe
INSERT INTO properties (id, title, location, price, type, beds, baths, area, category, image_url) VALUES
	('prop-1',  'Modern Family Home',        '123 Pine St, Seattle',        850000,  'sale', 3, 2,   120, 'house',      'https://lh3.googleusercontent.com/aida-public/AB6AXuDuQ9M7U6euA6_cXmYuXnej-N5IuawAW8ds-4G1mzfqmiBc13qXsPhf9_j_zTB8gfEunrBHo8xMsxYwCw_pl8fsxbxRkmyvLR1N9Tiye5ZJG7fwlLn9MwyBanXYhE0emGwp59es1FEyQTRQbmXLUKO74Yj34ZHqrqIkOtMKhP8CmRFvfoHT5LAe10105vUhKNkxIBvtt530nfLigSUTemOOcJMVNmsgactntRJUwOBU_TZzND7BYtDklr8uZcNYlQOK5U74-ufIf-E'),
	('prop-2',  'Urban Loft',                '456 Elm Ave, Portland',        3200,    'rent', 1, 1,   85,  'apartment',  'https://lh3.googleusercontent.com/aida-public/AB6AXuB4zNatD3vePhIZAi6OHHJKmamYSgeBNSKjEt32tvkkf4s6aBXCF8R4LNfDfPa9leA0t6N1OKOcP358WwZrnosbCBxSM7EaY2_P7qkx3MinRgmHQn7RvleNTwy8cLigMoR3iv0u83chBVbZYI6BcNMcqv80W-l1pIUgIWZcDIXEqtUatrsojSGfM0lTNDZpkBntBUkRY6NB4ZUymYNYvTHXKbO8NZ6N6uoyuuHqcaRWKzHCNXkOR3p-_EVFAHR8QwijIY_m1mefPZ4'),
	('prop-3',  'Highland Retreat',          '789 Mountain Rd, Bend',        620000,  'sale', 2, 2,   98,  'house',      'https://lh3.googleusercontent.com/aida-public/AB6AXuARQWC19e7mleUpjb8CWLztEv_svJeRFOaC2i-9r9GctFuX5Barzhfai9wNM1WW8bcGlqdFM32d3KPf7SItom5ijdHOz5rGGQPeT7PlWs8-y9LkfcsHLQqsLxalhxP94XJo76_mAMp7T2dVj3hPKHNzTDLLiS6ujSdSsyo3onxQthp4ZkVE8op92gyTLUUucaGaxO8vJvyhH3HuWB07EPqT1WsW0lr9Of5lUPonjG9eiqE1XiJXTqzXUZQt5JorfPwCO1MioZA_Zro'),
	('prop-4',  'Sea View Penthouse',        '321 Ocean Dr, Miami',          4500,    'rent', 3, 3,   180, 'penthouse',  'https://lh3.googleusercontent.com/aida-public/AB6AXuBGq4Phm0uDzCnjHAsnWpYTBVpOds_M6iOsJuRQQA5eUZHkztGgtc7eh_OE6wBeyW1-iZh7yyhROnvvmqkAZ9tyAWFGXk0FG52zU4kZ_EDLA0U0cRszy7byNXTeWe0_hS53SYmtCTEV8Y1AM-WxiIC38UMa15QwFDjXtCGQOxoh35K0Ol_70vfsxm0VqDbaWkr8tcEbLTLy0NXH_GcpGK4lAXizgxYOIlFWGyau-4OIfPZRpjCBDbz_qu3VlN201UUJGiuM9ajVd-U'),
	('prop-5',  'Central Studio',            '555 Main St, Chicago',         550000,  'sale', 1, 1,   50,  'apartment',  'https://lh3.googleusercontent.com/aida-public/AB6AXuA1w-Hb1289NqZKon3VK8bpmMiCDYYiAMT5egzTINo9m9wSZRHv-k-1IGTVoL1NT8YeZXJHa87JPNDIPrtrbP7jChHq0ypXF90uByhC6VA9O788_B4FY8JVg4chbWN9bcrn9-9FvVvfZX8Aj60Iqg_C8CsCA9DEnJqi2rJvzmK5UP5z-9XRTRjBneAPCa8iGgGWBD9yYKsziN6vn0ePBDGo3inieQtmbr46W31p6UfQ649XRxTm7ygOY2J-jxW1r0qWs8i97KGpkTE'),
	('prop-6',  'Garden Villa',              '999 Oak Ln, Austin',           2800,    'rent', 2, 2,   110, 'villa',      'https://lh3.googleusercontent.com/aida-public/AB6AXuCfGXdY0g51ojSg0GMeTW9ndLY3mpKK3oMtWxo2nwd_dwi1pgn1Boi_ovaDGIFhUA7nwu3WdBch8ZuHxoHu3QfgM5ceAsp8pglRVyCROWNcy9zeDNP2wqLoevyKGcaEyFYHYpIx2KK46nLWthnHiHugmkKw48kJsL8IjMO1bL3T1Zwt8bvQDTTUHTgB3GqZ2RU2asRzF1jVg0rLw3LWXXTq0YF1CsbhlWpYOuCEpH5bB8zkBlbKXR4At_M46AL8rJqn5c6BrPD5PP8'),
	('prop-7',  'Sunset Boulevard Villa',    'Beverly Hills, California',    4200000, 'sale', 4, 4.5, 380, 'villa',      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80'),
	('prop-8',  'Minimalist Loft',           'Brooklyn, New York',           3500,    'rent', 1, 1.5, 95,  'apartment',  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'),
	('prop-9',  'Lakefront Cabin',           'Lake Tahoe, Nevada',           1650000, 'sale', 3, 2.5, 175, 'house',      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80'),
	('prop-10', 'Skyline Oasis Penthouse',   'Manhattan, New York',          8900000, 'sale', 4, 4,   320, 'penthouse',  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'),
	('prop-11', 'Mid-Century Modern House',  'Palm Springs, California',     1250000, 'sale', 3, 3,   210, 'house',      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'),
	('prop-12', 'Cozy Garden Flat',          'Chelsea, London',              2900,    'rent', 2, 1,   78,  'apartment',  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'),
	('prop-13', 'Mediterranean Estate',      'Ibiza, Spain',                 6500000, 'sale', 6, 7,   550, 'villa',      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'),
	('prop-14', 'Harbor View Apartment',     'Sydney, Australia',            2100000, 'sale', 2, 2,   115, 'apartment',  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'),
	('prop-15', 'Zen Sanctuary House',       'Kyoto, Japan',                 4200,    'rent', 3, 2,   140, 'house',      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'),
	('prop-16', 'Ocean Breeze Penthouse',    'Malibu, California',           12500,   'rent', 3, 3.5, 240, 'penthouse',  'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO NOTHING;

-- Propiedades destacadas (Featured)
INSERT INTO featured_properties (id, title, location, price, beds, baths, area, tag, image_url) VALUES
	('feat-1', 'The Glass Pavilion',      'Beverly Hills, California', 5250000, 5, 4.5, 4200, 'Exclusive',   'https://lh3.googleusercontent.com/aida-public/AB6AXuCra-FKp81t0_OM8bWD55m2o9OOSnR_v7D0UilyExMImxyIcr9tIMZ2Py3HcC0ra_MtSsBkduMcwxUNKI9_iSXFFr_YRON1SF9hNM3fcYy-uG7N7uusL0Z367WINi1V7_GwfNQx-gsbUqLtzVi4ivFyqFQGb4qBs79bALeSFb6i3_ZnJnI1VVrN-VeZYHjfYyQI5C6zy90N3uxWZpwzIBhNoUDKKQjQ8EOEYPoyPTzhnh6b6AS3dkkFJ8t4xSDC6qjhMrQUoUPnAeM'),
	('feat-2', 'Azure Heights Penthouse', 'Downtown, Vancouver',       3800000, 3, 3,   2100, 'New Arrival', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDurAGHzg_fpQxFal-obkFVy1Q3WLPdueAQpz0itcQiRV-WfvulnBEDJbNeV8J06q4mX7PTtXYVJjX4-mHVr_khZLZxQ_s8f6fruGqzeqALyMu8wEHRK1EsOs9f4_jPmS7FxcdzrDkR88Wz0GjaPLXkTZRoJQfur59rxYRLi-WYcW-VU_gKS39CPLOMlftvqGvW0IOk5tXgst5mJ4WQM-ICN4vkdel9ido9YFUQga0OI10i6NSe5W4owt33-2YRi_b_ltdZW2QZC5s')
ON CONFLICT (id) DO NOTHING;
