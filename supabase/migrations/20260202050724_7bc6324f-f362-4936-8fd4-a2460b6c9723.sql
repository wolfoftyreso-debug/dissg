-- Create decision outcomes table for tracking results
CREATE TABLE IF NOT EXISTS public.decision_outcomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decision_id UUID NOT NULL REFERENCES public.policy_decisions(id) ON DELETE CASCADE,
    kpi_id UUID NOT NULL REFERENCES public.kpi_definitions(id) ON DELETE CASCADE,
    measurement_date DATE NOT NULL,
    baseline_value NUMERIC,
    baseline_date DATE,
    current_value NUMERIC NOT NULL,
    change_absolute NUMERIC,
    change_percent NUMERIC,
    target_value NUMERIC,
    target_achieved BOOLEAN DEFAULT FALSE,
    confidence_level NUMERIC DEFAULT 0.7,
    attribution_score NUMERIC DEFAULT 0.5, -- How much of change is attributable to decision
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(decision_id, kpi_id, measurement_date)
);

-- Create decision milestones table
CREATE TABLE IF NOT EXISTS public.decision_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decision_id UUID NOT NULL REFERENCES public.policy_decisions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_date DATE NOT NULL,
    completed_date DATE,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, delayed, cancelled
    responsible_entity TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add more columns to policy_decisions for better tracking
ALTER TABLE public.policy_decisions 
ADD COLUMN IF NOT EXISTS responsible_department TEXT,
ADD COLUMN IF NOT EXISTS responsible_minister TEXT,
ADD COLUMN IF NOT EXISTS budget_sek BIGINT,
ADD COLUMN IF NOT EXISTS implementation_start DATE,
ADD COLUMN IF NOT EXISTS implementation_end DATE,
ADD COLUMN IF NOT EXISTS evaluation_date DATE,
ADD COLUMN IF NOT EXISTS category TEXT;

-- Enable RLS
ALTER TABLE public.decision_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decision_milestones ENABLE ROW LEVEL SECURITY;

-- RLS policies for decision_outcomes (read for all authenticated, write for leadership)
CREATE POLICY "Authenticated users can view decision outcomes"
ON public.decision_outcomes FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Leadership can manage decision outcomes"
ON public.decision_outcomes FOR ALL TO authenticated
USING (
    public.has_role(auth.uid(), 'prime_minister')
    OR public.has_role(auth.uid(), 'system_admin')
    OR public.has_gov_role(auth.uid(), 'statsminister')
    OR public.has_gov_role(auth.uid(), 'departementsansvarig')
)
WITH CHECK (
    public.has_role(auth.uid(), 'prime_minister')
    OR public.has_role(auth.uid(), 'system_admin')
    OR public.has_gov_role(auth.uid(), 'statsminister')
    OR public.has_gov_role(auth.uid(), 'departementsansvarig')
);

-- RLS policies for decision_milestones
CREATE POLICY "Authenticated users can view decision milestones"
ON public.decision_milestones FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Leadership can manage decision milestones"
ON public.decision_milestones FOR ALL TO authenticated
USING (
    public.has_role(auth.uid(), 'prime_minister')
    OR public.has_role(auth.uid(), 'system_admin')
    OR public.has_gov_role(auth.uid(), 'statsminister')
    OR public.has_gov_role(auth.uid(), 'departementsansvarig')
)
WITH CHECK (
    public.has_role(auth.uid(), 'prime_minister')
    OR public.has_role(auth.uid(), 'system_admin')
    OR public.has_gov_role(auth.uid(), 'statsminister')
    OR public.has_gov_role(auth.uid(), 'departementsansvarig')
);

-- Function to calculate decision effectiveness from outcomes
CREATE OR REPLACE FUNCTION public.calculate_decision_effectiveness(p_decision_id UUID)
RETURNS TABLE(
    total_kpis INT,
    improved_kpis INT,
    declined_kpis INT,
    unchanged_kpis INT,
    avg_change_percent NUMERIC,
    overall_score INT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    WITH latest_outcomes AS (
        SELECT DISTINCT ON (kpi_id)
            kpi_id,
            change_percent,
            target_achieved
        FROM public.decision_outcomes
        WHERE decision_id = p_decision_id
        ORDER BY kpi_id, measurement_date DESC
    )
    SELECT
        COUNT(*)::INT as total_kpis,
        COUNT(*) FILTER (WHERE change_percent > 2)::INT as improved_kpis,
        COUNT(*) FILTER (WHERE change_percent < -2)::INT as declined_kpis,
        COUNT(*) FILTER (WHERE change_percent BETWEEN -2 AND 2)::INT as unchanged_kpis,
        ROUND(AVG(change_percent), 2) as avg_change_percent,
        CASE
            WHEN COUNT(*) = 0 THEN 0
            ELSE ROUND(
                (COUNT(*) FILTER (WHERE change_percent > 0)::NUMERIC / COUNT(*)::NUMERIC) * 100
            )::INT
        END as overall_score
    FROM latest_outcomes;
END;
$$;

-- Trigger to update effectiveness_score on policy_decisions
CREATE OR REPLACE FUNCTION public.update_decision_effectiveness()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_score INT;
BEGIN
    SELECT overall_score INTO v_score
    FROM public.calculate_decision_effectiveness(NEW.decision_id);
    
    UPDATE public.policy_decisions
    SET effectiveness_score = v_score,
        updated_at = now()
    WHERE id = NEW.decision_id;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_outcome_change
AFTER INSERT OR UPDATE ON public.decision_outcomes
FOR EACH ROW EXECUTE FUNCTION public.update_decision_effectiveness();

-- Insert sample data for demonstration
INSERT INTO public.policy_decisions (id, title, description, decision_date, status, expected_effect, target_kpis, category, responsible_department)
VALUES 
    ('a1b2c3d4-e5f6-7890-abcd-000000000001', 'Reformpaket för arbetsmarknaden 2025', 'Omfattande reform av arbetsmarknadspolitiken med fokus på snabbare matchning och ökad rörlighet.', '2024-12-15', 'active', 'Minska arbetslösheten med 0.5 procentenheter inom 12 månader', ARRAY[]::UUID[], 'arbetsmarknad', 'Arbetsmarknadsdepartementet'),
    ('a1b2c3d4-e5f6-7890-abcd-000000000002', 'Förstärkt vårdgaranti', 'Lagstadgad garanti för vård inom 30 dagar för prioriterade diagnoser.', '2024-11-20', 'active', 'Reducera medianväntetid med 30%', ARRAY[]::UUID[], 'vård', 'Socialdepartementet'),
    ('a1b2c3d4-e5f6-7890-abcd-000000000003', 'Nationell strategi mot gängkriminalitet', 'Intensifierad brottsbekämpning och förebyggande insatser.', '2024-09-01', 'active', 'Minska grova våldsbrott med 10% på 2 år', ARRAY[]::UUID[], 'rättsväsende', 'Justitiedepartementet'),
    ('a1b2c3d4-e5f6-7890-abcd-000000000004', 'Skattereform för ökad tillväxt', 'Sänkt skatt på arbete och höjd skatt på konsumtion.', '2024-06-15', 'completed', 'Öka skattebasen med 1% årligen', ARRAY[]::UUID[], 'ekonomi', 'Finansdepartementet'),
    ('a1b2c3d4-e5f6-7890-abcd-000000000005', 'Bostadsbyggnadspaketet', 'Regelförenklingar och statliga garantier för att öka bostadsbyggandet.', '2024-03-01', 'active', 'Öka bostadsbyggandet till 60 000 per år', ARRAY[]::UUID[], 'bostäder', 'Landsbygds- och infrastrukturdepartementet')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    responsible_department = EXCLUDED.responsible_department;

-- Insert sample milestones
INSERT INTO public.decision_milestones (decision_id, title, target_date, status, responsible_entity)
VALUES
    ('a1b2c3d4-e5f6-7890-abcd-000000000001', 'Lagändring antagen', '2024-12-15', 'completed', 'Riksdagen'),
    ('a1b2c3d4-e5f6-7890-abcd-000000000001', 'Implementering påbörjad', '2025-01-01', 'in_progress', 'Arbetsförmedlingen'),
    ('a1b2c3d4-e5f6-7890-abcd-000000000001', 'Första utvärdering', '2025-06-01', 'pending', 'IFAU'),
    ('a1b2c3d4-e5f6-7890-abcd-000000000002', 'Vårdgaranti träder i kraft', '2025-01-01', 'in_progress', 'Regionerna'),
    ('a1b2c3d4-e5f6-7890-abcd-000000000003', 'Visitationszoner införs', '2024-11-01', 'completed', 'Polismyndigheten'),
    ('a1b2c3d4-e5f6-7890-abcd-000000000003', 'Halvårsutvärdering', '2025-03-01', 'pending', 'BRÅ')
ON CONFLICT DO NOTHING;

-- Insert sample timeline events
INSERT INTO public.decision_timeline (decision_id, event_type, event_title, event_description, event_date, responsible_entity, responsible_level, affected_kpi_ids)
VALUES
    ('a1b2c3d4-e5f6-7890-abcd-000000000001', 'decision', 'Riksdagsbeslut: Arbetsmarknadsreform', 'Riksdagen antog reformpaketet med röstetal 184-165.', '2024-12-15', 'Riksdagen', 'national', ARRAY[]::UUID[]),
    ('a1b2c3d4-e5f6-7890-abcd-000000000001', 'implementation', 'Implementering påbörjad', 'Arbetsförmedlingen börjar tillämpa nya regler.', '2025-01-01', 'Arbetsförmedlingen', 'national', ARRAY[]::UUID[]),
    ('a1b2c3d4-e5f6-7890-abcd-000000000002', 'decision', 'Vårdgaranti beslutad', 'Ny lagstiftning om vårdgaranti antagen.', '2024-11-20', 'Riksdagen', 'national', ARRAY[]::UUID[]),
    ('a1b2c3d4-e5f6-7890-abcd-000000000003', 'legislation', 'Visitationszoner införs', 'Lag om visitationszoner träder i kraft.', '2024-11-01', 'Justitiedepartementet', 'national', ARRAY[]::UUID[]),
    ('a1b2c3d4-e5f6-7890-abcd-000000000003', 'report', 'BRÅ-rapport: Gängkriminalitet', 'Årlig rapport visar oförändrad nivå.', '2025-01-20', 'BRÅ', 'national', ARRAY[]::UUID[])
ON CONFLICT DO NOTHING;