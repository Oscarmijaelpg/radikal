-- Migración: Agregar nuevos campos al diagnóstico inicial
-- Fecha: 2026-02-03
-- Descripción: Agrega campos para positioning, history, audience y operations

-- Branding (expandido)
ALTER TABLE initial_diagnostics
ADD COLUMN IF NOT EXISTS typography jsonb DEFAULT '[]'::jsonb;

ALTER TABLE initial_diagnostics
ADD COLUMN IF NOT EXISTS visual_style jsonb DEFAULT '[]'::jsonb;

ALTER TABLE initial_diagnostics
ADD COLUMN IF NOT EXISTS palette_named text;

ALTER TABLE initial_diagnostics
ADD COLUMN IF NOT EXISTS logo_notes text;

-- Positioning (nuevo)
ALTER TABLE initial_diagnostics
ADD COLUMN IF NOT EXISTS slogan text;

ALTER TABLE initial_diagnostics
ADD COLUMN IF NOT EXISTS identity_message text;

ALTER TABLE initial_diagnostics
ADD COLUMN IF NOT EXISTS value_proposition text;

ALTER TABLE initial_diagnostics
ADD COLUMN IF NOT EXISTS differentiators jsonb DEFAULT '[]'::jsonb;

ALTER TABLE initial_diagnostics
ADD COLUMN IF NOT EXISTS brand_personality jsonb DEFAULT '[]'::jsonb;

ALTER TABLE initial_diagnostics
ADD COLUMN IF NOT EXISTS key_messages jsonb DEFAULT '[]'::jsonb;

-- History (nuevo)
ALTER TABLE initial_diagnostics
ADD COLUMN IF NOT EXISTS history_summary text;

ALTER TABLE initial_diagnostics
ADD COLUMN IF NOT EXISTS origin text;

ALTER TABLE initial_diagnostics
ADD COLUMN IF NOT EXISTS timeline jsonb DEFAULT '[]'::jsonb;

ALTER TABLE initial_diagnostics
ADD COLUMN IF NOT EXISTS milestones jsonb DEFAULT '[]'::jsonb;

-- Audience (nuevo)
ALTER TABLE initial_diagnostics
ADD COLUMN IF NOT EXISTS audience_segments jsonb DEFAULT '[]'::jsonb;

ALTER TABLE initial_diagnostics
ADD COLUMN IF NOT EXISTS demographics text;

ALTER TABLE initial_diagnostics
ADD COLUMN IF NOT EXISTS psychographics text;

-- Operations (nuevo)
ALTER TABLE initial_diagnostics
ADD COLUMN IF NOT EXISTS locations jsonb DEFAULT '[]'::jsonb;

ALTER TABLE initial_diagnostics
ADD COLUMN IF NOT EXISTS employees text;

ALTER TABLE initial_diagnostics
ADD COLUMN IF NOT EXISTS production_capacity text;

ALTER TABLE initial_diagnostics
ADD COLUMN IF NOT EXISTS technology jsonb DEFAULT '[]'::jsonb;

ALTER TABLE initial_diagnostics
ADD COLUMN IF NOT EXISTS b2b_services jsonb DEFAULT '[]'::jsonb;

-- Índices para mejorar búsquedas
CREATE INDEX IF NOT EXISTS idx_initial_diagnostics_brand_id ON initial_diagnostics(brand_id);
CREATE INDEX IF NOT EXISTS idx_initial_diagnostics_job_id ON initial_diagnostics(job_id);

-- Comentarios para documentación
COMMENT ON COLUMN initial_diagnostics.typography IS 'Tipografías detectadas en la marca';
COMMENT ON COLUMN initial_diagnostics.visual_style IS 'Estilos visuales de la marca';
COMMENT ON COLUMN initial_diagnostics.palette_named IS 'Nombre descriptivo de la paleta de colores';
COMMENT ON COLUMN initial_diagnostics.slogan IS 'Slogan principal de la marca';
COMMENT ON COLUMN initial_diagnostics.identity_message IS 'Mensaje de identidad de marca';
COMMENT ON COLUMN initial_diagnostics.value_proposition IS 'Propuesta de valor';
COMMENT ON COLUMN initial_diagnostics.differentiators IS 'Diferenciadores de la marca';
COMMENT ON COLUMN initial_diagnostics.brand_personality IS 'Personalidad de la marca';
COMMENT ON COLUMN initial_diagnostics.key_messages IS 'Mensajes clave de la marca';
COMMENT ON COLUMN initial_diagnostics.history_summary IS 'Resumen de la historia de la marca';
COMMENT ON COLUMN initial_diagnostics.origin IS 'Origen/lugar de fundación';
COMMENT ON COLUMN initial_diagnostics.timeline IS 'Línea de tiempo con eventos importantes';
COMMENT ON COLUMN initial_diagnostics.milestones IS 'Hitos importantes de la marca';
COMMENT ON COLUMN initial_diagnostics.audience_segments IS 'Segmentos de audiencia';
COMMENT ON COLUMN initial_diagnostics.demographics IS 'Información demográfica de la audiencia';
COMMENT ON COLUMN initial_diagnostics.psychographics IS 'Información psicográfica de la audiencia';
COMMENT ON COLUMN initial_diagnostics.locations IS 'Ubicaciones de operación';
COMMENT ON COLUMN initial_diagnostics.employees IS 'Información sobre empleados';
COMMENT ON COLUMN initial_diagnostics.production_capacity IS 'Capacidad de producción';
COMMENT ON COLUMN initial_diagnostics.technology IS 'Tecnologías utilizadas';
COMMENT ON COLUMN initial_diagnostics.b2b_services IS 'Servicios B2B ofrecidos';
