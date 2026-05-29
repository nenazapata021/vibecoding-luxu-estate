-- ============================================================
-- migrations
-- Fecha: 2026-05-29 15:00:00
-- Agrega una bandera para marcar propiedades destacadas directamente
-- en la tabla principal `properties`.
-- ============================================================

ALTER TABLE properties
	ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE properties
	SET is_featured = TRUE
	WHERE id IN ('prop-7', 'prop-10');