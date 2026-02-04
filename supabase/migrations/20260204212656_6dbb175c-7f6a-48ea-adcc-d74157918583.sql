-- Insert transgender-related KPIs into kpi_definitions (starting from index 23)
INSERT INTO public.kpi_definitions (kpi_index, code, name, category, description, rationale, unit, is_inverted, red_flag_conditions, breakdown_dimensions, is_active)
VALUES 
  (23, 'transgender_population', 'Transpersoner', 'demografi_halsa', 
   'Uppskattat antal personer med könsidentitet som avviker från födelsetilldelat kön',
   'Demografisk basdata för inkluderande samhällsplanering och resursallokering inom vård.',
   'per 100 000', false, 
   '[{"condition": "Metodologiska förändringar i mätning"}]'::jsonb,
   ARRAY['region', 'age']::text[], true),
   
  (24, 'gender_affirming_care_queue', 'Könsdysfori-väntetid', 'karnsystem_funktion',
   'Medianväntetid från remiss till första besök vid könsdysforimottagning',
   'Mäter vårdsystemets kapacitet att hantera könsbekräftande vård.',
   'månader', true,
   '[{"condition": "Väntetid > 24 månader", "threshold": "24"}]'::jsonb,
   ARRAY['region', 'age']::text[], true),
   
  (25, 'legal_gender_changes', 'Juridiska könsbyten', 'demografi_halsa',
   'Antal beviljade ansökningar om ändring av juridiskt kön per år',
   'Indikator på tillgänglighet och efterfrågan av juridisk könsbekräftelse.',
   'antal/år', false,
   '[{"condition": "Avvikelse > 30% från föregående år"}]'::jsonb,
   ARRAY['region', 'age', 'time']::text[], true),

  (26, 'transgender_mental_health', 'Psykisk hälsa (trans)', 'demografi_halsa',
   'Andel transpersoner som rapporterar god eller mycket god psykisk hälsa',
   'Centralt hälsomått för en sårbar grupp. Speglar samhällets inkludering och vårdens kvalitet.',
   '%', false,
   '[{"condition": "Andel < 40%", "threshold": "40"}]'::jsonb,
   ARRAY['region', 'age']::text[], true),

  (27, 'hate_crimes_lgbtq', 'Hatbrott (HBTQI)', 'social_stabilitet',
   'Anmälda hatbrott med HBTQI-motiv per 100 000 invånare',
   'Mäter säkerhetssituation och social acceptans för HBTQI-personer.',
   'per 100 000', true,
   '[{"condition": "Ökning > 10% per år"}]'::jsonb,
   ARRAY['region', 'time']::text[], true)

ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  rationale = EXCLUDED.rationale,
  is_active = EXCLUDED.is_active;