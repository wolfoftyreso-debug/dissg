
-- ═══════════════════════════════════════════════════════════════
-- RELEVANS- & PRIORITERINGSMOTOR - Databastabeller
-- ═══════════════════════════════════════════════════════════════

-- Tabell för viktversioner (versionerade, transparenta vikter)
CREATE TABLE public.relevance_weight_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  version INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  
  -- De 6 vikterna enligt specifikationen
  impact_weight NUMERIC NOT NULL DEFAULT 0.30,
  acceleration_weight NUMERIC NOT NULL DEFAULT 0.20,
  breadth_weight NUMERIC NOT NULL DEFAULT 0.15,
  persistence_weight NUMERIC NOT NULL DEFAULT 0.15,
  responsibility_weight NUMERIC NOT NULL DEFAULT 0.10,
  data_confidence_weight NUMERIC NOT NULL DEFAULT 0.10,
  
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT,
  change_reason TEXT,
  
  UNIQUE(version)
);

-- Tabell för beräknade relevans-scores
CREATE TABLE public.relevance_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Vad som beräknas (KPI, region, demografi, ansvarskedja)
  object_type TEXT NOT NULL CHECK (object_type IN ('kpi', 'region', 'demographic', 'responsibility_chain', 'combined')),
  object_id UUID NOT NULL,
  object_code TEXT,
  
  -- Totalpoäng (0-100)
  total_score NUMERIC NOT NULL,
  rank INTEGER,
  
  -- Breakdown av komponenter (0-100 råvärden före viktning)
  impact_raw NUMERIC NOT NULL,
  acceleration_raw NUMERIC NOT NULL,
  breadth_raw NUMERIC NOT NULL,
  persistence_raw NUMERIC NOT NULL,
  responsibility_raw NUMERIC NOT NULL,
  data_confidence_raw NUMERIC NOT NULL,
  
  -- Viktade bidrag till totalpoäng
  impact_weighted NUMERIC NOT NULL,
  acceleration_weighted NUMERIC NOT NULL,
  breadth_weighted NUMERIC NOT NULL,
  persistence_weighted NUMERIC NOT NULL,
  responsibility_weighted NUMERIC NOT NULL,
  data_confidence_contribution NUMERIC NOT NULL,
  
  -- Metadata
  weight_version_id UUID REFERENCES public.relevance_weight_versions(id),
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  
  -- Förklarbarhet
  primary_reason TEXT NOT NULL,
  secondary_reasons TEXT[],
  should_highlight BOOLEAN NOT NULL DEFAULT false,
  
  -- Extra data för djupare förklaring
  calculation_details JSONB NOT NULL DEFAULT '{}'
);

-- Dagliga startsids-snapshots (för återskapande av historiska vyer)
CREATE TABLE public.daily_priority_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  snapshot_date DATE NOT NULL,
  
  -- Topp 5 mest relevanta
  top_relevant JSONB NOT NULL DEFAULT '[]',
  
  -- Topp 5 förbättringar
  top_improvements JSONB NOT NULL DEFAULT '[]',
  
  -- Topp 5 försämringar
  top_declines JSONB NOT NULL DEFAULT '[]',
  
  -- Full ranking för dagen
  full_ranking JSONB NOT NULL DEFAULT '[]',
  
  -- Vilken viktversion som användes
  weight_version_id UUID REFERENCES public.relevance_weight_versions(id),
  
  -- Metadata
  total_objects_scored INTEGER NOT NULL DEFAULT 0,
  calculation_duration_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(snapshot_date)
);

-- Användaranpassningar (region, demografi, ansvarsområde)
CREATE TABLE public.user_relevance_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  
  -- Prioriterade filter (läggs ovanpå grundordning, döljer inte data)
  preferred_regions TEXT[],
  preferred_demographics TEXT[],
  preferred_responsibility_areas TEXT[],
  
  -- Preferenser
  boost_local BOOLEAN NOT NULL DEFAULT false,
  boost_factor NUMERIC NOT NULL DEFAULT 1.2,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Index för snabba uppslagningar
CREATE INDEX idx_relevance_scores_object ON public.relevance_scores(object_type, object_id);
CREATE INDEX idx_relevance_scores_total ON public.relevance_scores(total_score DESC);
CREATE INDEX idx_relevance_scores_calculated ON public.relevance_scores(calculated_at DESC);
CREATE INDEX idx_daily_snapshots_date ON public.daily_priority_snapshots(snapshot_date DESC);

-- RLS-policies
ALTER TABLE public.relevance_weight_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relevance_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_priority_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_relevance_preferences ENABLE ROW LEVEL SECURITY;

-- Alla kan läsa vikter och scores (transparens)
CREATE POLICY "Public read access for weight versions"
  ON public.relevance_weight_versions FOR SELECT USING (true);

CREATE POLICY "Public read access for relevance scores"
  ON public.relevance_scores FOR SELECT USING (true);

CREATE POLICY "Public read access for daily snapshots"
  ON public.daily_priority_snapshots FOR SELECT USING (true);

-- Service kan insertera
CREATE POLICY "Service can insert weight versions"
  ON public.relevance_weight_versions FOR INSERT WITH CHECK (true);

CREATE POLICY "Service can insert relevance scores"
  ON public.relevance_scores FOR INSERT WITH CHECK (true);

CREATE POLICY "Service can insert daily snapshots"
  ON public.daily_priority_snapshots FOR INSERT WITH CHECK (true);

-- Användare kan hantera sina egna preferenser
CREATE POLICY "Users can view own preferences"
  ON public.user_relevance_preferences FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own preferences"
  ON public.user_relevance_preferences FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own preferences"
  ON public.user_relevance_preferences FOR UPDATE USING (user_id = auth.uid());

-- Endast admins kan ändra vikter
CREATE POLICY "Admins can update weight versions"
  ON public.relevance_weight_versions FOR UPDATE
  USING (has_role(auth.uid(), 'system_admin'));

-- Service kan uppdatera scores
CREATE POLICY "Service can update relevance scores"
  ON public.relevance_scores FOR UPDATE WITH CHECK (true);

CREATE POLICY "Service can delete old relevance scores"
  ON public.relevance_scores FOR DELETE USING (true);

-- Trigger för updated_at på user preferences
CREATE TRIGGER update_user_relevance_preferences_updated_at
  BEFORE UPDATE ON public.user_relevance_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Sätt in standardvikter (version 1)
INSERT INTO public.relevance_weight_versions (
  version,
  name,
  description,
  impact_weight,
  acceleration_weight,
  breadth_weight,
  persistence_weight,
  responsibility_weight,
  data_confidence_weight,
  is_active,
  created_by,
  change_reason
) VALUES (
  1,
  'Standardvikter v1.0',
  'Initiala vikter baserade på principen: Det som påverkar flest människor mest just nu – och där ansvar finns – ska synas först.',
  0.30,
  0.20,
  0.15,
  0.15,
  0.10,
  0.10,
  true,
  'system',
  'Initial version av relevansvikter'
);
