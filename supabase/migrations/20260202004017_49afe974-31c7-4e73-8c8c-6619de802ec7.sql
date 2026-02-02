-- =====================================================
-- DEL XII: OFFENTLIGA POLITIKERPROFILER (ANSVAR & UTFALL)
-- Datamodell för person → uppdrag → KPI → utfall
-- =====================================================

-- 1. Offentliga personer (endast för offentliga uppdrag)
CREATE TABLE public.public_officials (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Grundfakta (Wikipedia-nivå)
    full_name TEXT NOT NULL,
    party_affiliation TEXT,
    birth_year INTEGER,
    
    -- Metadata
    wikipedia_url TEXT,
    riksdagen_id TEXT, -- Riksdagens externa ID om tillgängligt
    
    -- Spårbarhet
    data_sources TEXT[] DEFAULT '{}',
    last_verified_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Offentliga uppdrag (poster, ministrar, etc.)
CREATE TABLE public.public_assignments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    official_id UUID NOT NULL REFERENCES public.public_officials(id) ON DELETE CASCADE,
    
    -- Uppdragsinformation
    title TEXT NOT NULL, -- t.ex. "Finansminister", "Statsråd", "Partiledare"
    assignment_type TEXT NOT NULL, -- 'minister', 'state_secretary', 'party_leader', 'committee_chair', etc.
    
    -- Ansvarsområden (kopplade till systemets områden)
    responsibility_areas responsibility_area[] NOT NULL DEFAULT '{}',
    responsibility_level responsibility_level NOT NULL DEFAULT 'nationell',
    
    -- Tidsperiod
    start_date DATE NOT NULL,
    end_date DATE, -- NULL = pågående
    
    -- Källa och spårbarhet
    source_document TEXT,
    source_url TEXT,
    
    -- Koppling till styrperiod
    governance_period_id UUID REFERENCES public.governance_periods(id),
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Uppdrag-KPI mappning (vilka KPI:er är relevanta för uppdraget)
CREATE TABLE public.assignment_kpi_relevance (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    assignment_id UUID NOT NULL REFERENCES public.public_assignments(id) ON DELETE CASCADE,
    kpi_id UUID NOT NULL REFERENCES public.kpi_definitions(id) ON DELETE CASCADE,
    
    -- Relevansnivå
    relevance_weight NUMERIC(3,2) NOT NULL DEFAULT 1.0 CHECK (relevance_weight >= 0 AND relevance_weight <= 1),
    relevance_rationale TEXT, -- Varför är denna KPI relevant för uppdraget?
    
    -- Primär eller sekundär koppling
    is_primary BOOLEAN NOT NULL DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    UNIQUE(assignment_id, kpi_id)
);

-- 4. Beräknade utfall per uppdrag (aggregerad statistik)
CREATE TABLE public.assignment_outcomes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    assignment_id UUID NOT NULL REFERENCES public.public_assignments(id) ON DELETE CASCADE,
    
    -- Beräkningsperiod
    calculated_for_period_start DATE NOT NULL,
    calculated_for_period_end DATE NOT NULL,
    
    -- Aggregerade utfall
    total_kpis_tracked INTEGER NOT NULL DEFAULT 0,
    months_with_improvement INTEGER NOT NULL DEFAULT 0,
    months_with_stagnation INTEGER NOT NULL DEFAULT 0,
    months_with_decline INTEGER NOT NULL DEFAULT 0,
    
    -- Fördelning (procent)
    improvement_percentage NUMERIC(5,2),
    stagnation_percentage NUMERIC(5,2),
    decline_percentage NUMERIC(5,2),
    
    -- Detaljerad fördelning per KPI
    kpi_outcomes JSONB NOT NULL DEFAULT '[]',
    -- Format: [{ kpi_id, kpi_name, trend, months_improved, months_declined, months_stagnant }]
    
    -- Metadata
    calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    calculation_version TEXT NOT NULL DEFAULT '1.0',
    
    UNIQUE(assignment_id, calculated_for_period_start, calculated_for_period_end)
);

-- 5. Enable RLS
ALTER TABLE public.public_officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_kpi_relevance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_outcomes ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies - Fullständig offentlig läsning (detta är offentlig information)
CREATE POLICY "Public officials are publicly readable"
ON public.public_officials FOR SELECT
USING (true);

CREATE POLICY "Public assignments are publicly readable"
ON public.public_assignments FOR SELECT
USING (true);

CREATE POLICY "Assignment KPI relevance is publicly readable"
ON public.assignment_kpi_relevance FOR SELECT
USING (true);

CREATE POLICY "Assignment outcomes are publicly readable"
ON public.assignment_outcomes FOR SELECT
USING (true);

-- 7. Service-only INSERT policies (endast systemet kan lägga till data)
CREATE POLICY "Service can insert public officials"
ON public.public_officials FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service can insert public assignments"
ON public.public_assignments FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service can insert assignment KPI relevance"
ON public.assignment_kpi_relevance FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service can insert assignment outcomes"
ON public.assignment_outcomes FOR INSERT
WITH CHECK (true);

-- 8. Indexes för snabba uppslag
CREATE INDEX idx_public_officials_party ON public.public_officials(party_affiliation);
CREATE INDEX idx_public_assignments_official ON public.public_assignments(official_id);
CREATE INDEX idx_public_assignments_dates ON public.public_assignments(start_date, end_date);
CREATE INDEX idx_public_assignments_type ON public.public_assignments(assignment_type);
CREATE INDEX idx_assignment_kpi_relevance_assignment ON public.assignment_kpi_relevance(assignment_id);
CREATE INDEX idx_assignment_kpi_relevance_kpi ON public.assignment_kpi_relevance(kpi_id);
CREATE INDEX idx_assignment_outcomes_assignment ON public.assignment_outcomes(assignment_id);

-- 9. Trigger för updated_at
CREATE TRIGGER update_public_officials_updated_at
BEFORE UPDATE ON public.public_officials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 10. Kommentarer för dokumentation
COMMENT ON TABLE public.public_officials IS 'Offentliga personer med offentliga uppdrag. Endast Wikipedia-nivå information.';
COMMENT ON TABLE public.public_assignments IS 'Tidslinjebaserade uppdrag för offentliga personer med ansvarsområden.';
COMMENT ON TABLE public.assignment_kpi_relevance IS 'Koppling mellan uppdrag och relevanta KPI:er för utfallsberäkning.';
COMMENT ON TABLE public.assignment_outcomes IS 'Aggregerade utfall per uppdrag - observerad utveckling utan värdering.';